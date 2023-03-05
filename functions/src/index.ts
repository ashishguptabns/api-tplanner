import * as functions from "firebase-functions";

import admin = require("firebase-admin");
import { TripDetail } from "./model/trip-detail";
import { CommentDetail } from "./model/comment-detail";

admin.initializeApp();
const firestoreDb = admin.firestore();

const cors = require("cors")({ origin: true });
const COLLECTION_COMMENTS = "comments";
const COLLECTION_TRIPS = "trips";

export const fetchCommentsByTripId = functions.https.onRequest(
  async (req, res) => {
    let tripId = req.query.tripId as string;
    cors(req, res, async () => {
      let commentsSnapshot = await firestoreDb
        .collection(COLLECTION_TRIPS)
        .doc(tripId)
        .collection(COLLECTION_COMMENTS)
        .get();
      if (commentsSnapshot.empty) {
        res.json({ status: false, result: [] });
        return;
      }
      let comments: CommentDetail[] = [];
      await Promise.all(
        commentsSnapshot.docs.map((commentSnapshot) => {
          comments.push(
            new CommentDetail(
              commentSnapshot.data().tripId,
              commentSnapshot.data().postedByUserId,
              commentSnapshot.data().commentText
            )
          );
        })
      );
      res.json(comments);
    });
  }
);

export const postComment = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let commentToPost = req.body;
    if (hasAllCommentFields(commentToPost)) {
      await firestoreDb
        .collection(COLLECTION_TRIPS)
        .doc(commentToPost.tripId)
        .collection(COLLECTION_COMMENTS)
        .add(commentToPost);
      res.json({
        result: "saved comment",
      });
    } else {
      res.json({
        result: "invalid comment",
      });
    }
  });
});

export const saveTrip = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let tripToSave = req.body;
    if (hasAllTripFields(tripToSave)) {
      if (!isEmpty(tripToSave.id)) {
        await firestoreDb
          .collection(COLLECTION_TRIPS)
          .doc(tripToSave.id)
          .set(tripToSave, { merge: true });
      } else {
        let ref = firestoreDb.collection(COLLECTION_TRIPS).doc();
        tripToSave.id = ref.id;
        await firestoreDb.collection(COLLECTION_TRIPS).add(tripToSave);
      }
      res.json({
        result: "saved trip",
      });
    } else {
      res.json({
        result: "invalid trip",
      });
    }
  });
});

export const fetchTripsByType = functions.https.onRequest(async (req, res) => {
  let tripsType = req.query.type;
  cors(req, res, async () => {
    let tripsSnapshot = await firestoreDb
      .collection(COLLECTION_TRIPS)
      .where("type", "==", tripsType)
      .get();
    if (tripsSnapshot.empty) {
      res.json({ status: false, result: [] });
      return;
    }
    let trips: TripDetail[] = [];
    await Promise.all(
      tripsSnapshot.docs.map((tripSnapshot) => {
        trips.push(new TripDetail(tripSnapshot.data()));
      })
    );
    res.json(trips);
  });
});

export const fetchTripById = functions.https.onRequest(async (req, res) => {
  let id: string = req.query.id ? req.query.id.toString() : "";
  if (!isEmpty(id)) {
    cors(req, res, async () => {
      let tripSnapshot = await firestoreDb
        .collection(COLLECTION_TRIPS)
        .doc(id)
        .get();
      if (!tripSnapshot.exists) {
        res.json({ status: false, result: "Invalid trip id" });
        return;
      } else {
        res.json(new TripDetail(tripSnapshot.data()));
      }
    });
  } else {
    res.json({ status: false, result: "Invalid trip id" });
  }
});

function hasAllTripFields(trip: TripDetail) {
  return (
    !isEmpty(trip.cityFrom) &&
    !isEmpty(trip.cityTo) &&
    !isEmpty(trip.cityImgUrl) &&
    !isEmpty(trip.departDate) &&
    !isEmpty(trip.returnDate) &&
    !isEmpty(trip.totalBudget)
  );
}

function isEmpty(val: any) {
  return val == null || val == "";
}
function hasAllCommentFields(commentToPost: any) {
  return (
    !isEmpty(commentToPost.tripId) &&
    !isEmpty(commentToPost.commentText) &&
    !isEmpty(commentToPost.postedByUserId)
  );
}
