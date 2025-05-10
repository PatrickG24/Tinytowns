import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// Resolve __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load Firebase service account credentials
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"))
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

// ✅ CORS for frontend at localhost:5173
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ JSON parsing middleware
app.use(express.json());



app.post("/save-user-game", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).send({ error: "Missing ID token" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const { score, startTime, endTime, grid } = req.body;

    const docRef = await db
      .collection("users")
      .doc(uid)
      .collection("games")
      .add({
        score,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        grid,
      });

    console.log(`✅ Game saved for user ${uid}, game ID: ${docRef.id}`);
    res.status(200).send({ success: true, docId: docRef.id });
  } catch (error) {
    // console.error("❌ Failed to save user game:", error);
    console.error("❌ Failed to save user game:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Body:", req.body);

    res.status(500).send({ error: "Failed to save user game" });
  }
});


app.post("/update-achievements", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).send({ error: "Missing token" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const { achievements } = req.body;

    const defaultAchievements = {
      perfectTown: false,
      highScore: false,
      WhatANoob: false,
      masterArchitect: false,
      townPlanner: false,
      engineer: false,
      carpenter: false,
      buildersApprentice: false,
      aspiringArchitect: false,
    };

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    // if (!userDoc.exists) {
    //   // New user — initialize all achievements
    //   await userRef.set({ achievements: defaultAchievements });
    // }



    const userData = userDoc.data() || {};
    const existingAchievements = userData.achievements || {};

    const achievementsToInitialize = {};
    for (const [key, value] of Object.entries(defaultAchievements)) {
      if (!(key in existingAchievements)) {
        achievementsToInitialize[`achievements.${key}`] = value;
      }
    }

    if (Object.keys(achievementsToInitialize).length > 0) {
      await userRef.update(achievementsToInitialize);
    }


    const existing = userDoc.data()?.achievements || {};

    const updates = {};
    for (const [key, value] of Object.entries(achievements)) {
      if (value === true && existing[key] !== true) {
        updates[`achievements.${key}`] = true;
      }
    }

    if (Object.keys(updates).length > 0) {
      await userRef.update(updates);
    }

    res.status(200).send({ success: true, updated: updates });
  } catch (err) {
    console.error("❌ Failed to update achievements:", err);
    res.status(500).send({ error: "Update failed" });
  }
});






// ✅ Start server on port 3000
const PORT = process.env.VITE_BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
