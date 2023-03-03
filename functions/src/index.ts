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
      await firestoreDb.collection("trips").add(tripToSave);
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

export const fetchTrips = functions.https.onRequest(async (req, res) => {
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

function hasAllTripFields(trip: TripDetail) {
  return (
    !isEmpty(trip.cityFrom) &&
    !isEmpty(trip.cityTo) &&
    !isEmpty(trip.departDate) &&
    !isEmpty(trip.returnDate) &&
    !isEmpty(trip.totalBudget)
  );
}

function isEmpty(val: any) {
  return val == null || val == "";
}
