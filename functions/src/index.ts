import * as functions from "firebase-functions";

import admin = require("firebase-admin");
import { TripDetail } from "./model/trip-detail";
import { CommentDetail } from "./model/comment-detail";
import { UserDetail } from "./model/user-detail";
import { BlogDetail } from "./model/blog-detail";
import { FlatPostDTO } from "./model/flat-post-dto";

admin.initializeApp();
const firestoreDb = admin.firestore();

const cors = require("cors")({ origin: true });
const COLLECTION_COMMENTS = "comments";
const COLLECTION_TRIPS = "trips";
const COLLECTION_FLAT_POSTS = "flat_posts";
const COLLECTION_USERS = "users";
const COLLECTION_BLOGS = "blogs";

export const fetchCommentsByTripId = functions.https.onRequest(
  async (req, res) => {
    let tripId = req.query.tripId as string;
    cors(req, res, async () => {
      let comments = await _fetchCommentsByTripId(tripId);
      res.json(comments);
    });
  }
);

async function _fetchCommentsByTripId(tripId: string) {
  let commentsSnapshot = await firestoreDb
    .collection(COLLECTION_TRIPS)
    .doc(tripId)
    .collection(COLLECTION_COMMENTS)
    .get();
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
  return comments;
}

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

export const saveFlatPost = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let flatPostToSave = req.body;
    console.log(flatPostToSave);
    if (hasAllFlatPostFields(flatPostToSave)) {
      if (!isEmpty(flatPostToSave.id)) {
        await firestoreDb
          .collection(COLLECTION_FLAT_POSTS)
          .doc(flatPostToSave.id)
          .set(flatPostToSave, { merge: true });
      } else {
        let ref = firestoreDb.collection(COLLECTION_FLAT_POSTS).doc();
        flatPostToSave.id = ref.id;
        await firestoreDb.collection(COLLECTION_FLAT_POSTS).add(flatPostToSave);
      }
      res.json({
        result: "saved post",
      });
    } else {
      res.json({
        result: "invalid post",
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

export const saveUser = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let userToSave = req.body;
    if (hasAllUserFields(userToSave)) {
      if (isEmpty(userToSave.uid)) {
        let ref = firestoreDb.collection(COLLECTION_USERS).doc();
        userToSave.uid = ref.id;
      }
      await firestoreDb
        .collection(COLLECTION_USERS)
        .doc(userToSave.uid)
        .set(userToSave, { merge: true });
      res.json({
        result: "saved user",
      });
    } else {
      res.json({
        result: "invalid user",
      });
    }
  });
});

export const saveBlog = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let blogToSave = req.body;
    if (hasAllBlogFields(blogToSave)) {
      if (isEmpty(blogToSave.id)) {
        let ref = firestoreDb.collection(COLLECTION_BLOGS).doc();
        blogToSave.id = ref.id;
      }
      await firestoreDb
        .collection(COLLECTION_BLOGS)
        .doc(blogToSave.id)
        .set(blogToSave, { merge: true });
      res.json({
        result: "saved bog",
      });
    } else {
      res.json({
        result: "invalid blog",
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

export const fetchFlatPosts = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let postsSnapshot = await firestoreDb
      .collection(COLLECTION_FLAT_POSTS)
      .get();
    if (postsSnapshot.empty) {
      res.json({ status: false, result: [] });
      return;
    }
    let posts: FlatPostDTO[] = [];
    await Promise.all(
      postsSnapshot.docs.map((postSnapshot) => {
        const postData = postSnapshot.data();
        console.log(postData, "hello", postData as FlatPostDTO);
        posts.push(postData as FlatPostDTO);
      })
    );
    res.json(posts);
  });
});

async function _fetchTripById(tripId: string) {
  let tripSnapshot = await firestoreDb
    .collection(COLLECTION_TRIPS)
    .doc(tripId)
    .get();
  if (tripSnapshot.exists) {
    return new TripDetail(tripSnapshot.data());
  } else {
    return undefined;
  }
}

async function _fetchBlogById(blogId: string) {
  let blogSnapshot = await firestoreDb
    .collection(COLLECTION_BLOGS)
    .doc(blogId)
    .get();
  if (blogSnapshot.exists) {
    return new BlogDetail(blogSnapshot.data());
  } else {
    return undefined;
  }
}

export const fetchBlogById = functions.https.onRequest(async (req, res) => {
  let blogId = req.query.id as string;
  if (!isEmpty(blogId)) {
    cors(req, res, async () => {
      let blogDetail = await _fetchBlogById(blogId);
      res.json(blogDetail);
    });
  } else {
    res.json({ status: false, result: "Invalid blog id" });
  }
});

export const fetchTripByIdForViewPage = functions.https.onRequest(
  async (req, res) => {
    let tripId = req.query.id as string;
    if (!isEmpty(tripId)) {
      cors(req, res, async () => {
        let tripDetail = await _fetchTripById(tripId);
        if (tripDetail != undefined) {
          if (tripDetail.postedByUserId != null) {
            let postedByUser = await _fetchUserById(tripDetail.postedByUserId);
            if (postedByUser != null) {
              tripDetail.postedByPhotoUrl = postedByUser.photoURL;
            }
          } else {
            res.json({
              status: false,
              tripDetail: tripDetail,
              message: "postedByUserId is null",
            });
          }
          tripDetail.comments = await _fetchCommentsByTripId(tripId);
        }
        res.json(tripDetail);
      });
    } else {
      res.json({ status: false, result: "Invalid trip id" });
    }
  }
);

export const fetchTripById = functions.https.onRequest(async (req, res) => {
  let tripId = req.query.id as string;
  if (!isEmpty(tripId)) {
    cors(req, res, async () => {
      let tripDetail = await _fetchTripById(tripId);
      res.json(tripDetail);
    });
  } else {
    res.json({ status: false, result: "Invalid trip id" });
  }
});

async function _fetchUserById(userId: string) {
  let userSnapshot = await firestoreDb
    .collection(COLLECTION_USERS)
    .doc(userId)
    .get();
  if (!userSnapshot.exists) {
    return undefined;
  } else {
    return new UserDetail(userSnapshot.data());
  }
}

export const fetchUserById = functions.https.onRequest(async (req, res) => {
  let userId = req.query.userId as string;
  if (!isEmpty(userId)) {
    cors(req, res, async () => {
      let user = await _fetchUserById(userId);
      res.json(user);
    });
  } else {
    res.json({ status: false, result: "Invalid user id" });
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
function hasAllUserFields(userToSave: any) {
  return (
    !isEmpty(userToSave.uid) &&
    !isEmpty(userToSave.displayName) &&
    !isEmpty(userToSave.email)
  );
}
function hasAllBlogFields(blogToSave: any) {
  return !isEmpty(blogToSave.text) && !isEmpty(blogToSave.imgUrl);
}
function hasAllFlatPostFields(flatPostToSave: any) {
  return (
    !isEmpty(flatPostToSave.actionFlat) &&
    !isEmpty(flatPostToSave.area) &&
    !isEmpty(flatPostToSave.bhks) &&
    !isEmpty(flatPostToSave.budgets) &&
    !isEmpty(flatPostToSave.furnishing) &&
    !isEmpty(flatPostToSave.location)
  );
}
