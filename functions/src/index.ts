import * as functions from "firebase-functions";

import admin = require("firebase-admin");
import { TripDetail } from "./model/trip-detail";

admin.initializeApp();
const firestoreDb = admin.firestore();

const cors = require("cors")({ origin: true });

export const saveTrip = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let tripToSave = req.body;
    if (hasAllTripFields(tripToSave)) {
      if (!isEmpty(tripToSave.id)) {
        await firestoreDb
          .collection("trips")
          .doc(tripToSave.id)
          .set(tripToSave, { merge: true });
      } else {
        let ref = firestoreDb.collection("trips").doc();
        tripToSave.id = ref.id;
        await firestoreDb.collection("trips").add(tripToSave);
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
      .collection("trips")
      .where("type", "==", tripsType)
      .get();
    if (tripsSnapshot.empty) {
      res.json({ status: false, result: "No trips found" });
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
      let tripSnapshot = await firestoreDb.collection("trips").doc(id).get();
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
