import * as functions from "firebase-functions";

import admin = require("firebase-admin");
admin.initializeApp();

const cors = require("cors")({ origin: true });

export const saveTrip = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    console.log("req.body " + JSON.stringify(req.body));
    await admin.firestore().collection("trips").add(req.body);
    res.json({
      result: "saved trip",
    });
  });
});
