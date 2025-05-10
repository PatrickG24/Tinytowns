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



// app.get("/test-firestore", async (req, res) => {
//   try {
//     const testData = {
//       message: "Hello from test endpoint yay",
//       timestamp: new Date().toISOString(),
//     };

//     const docRef = await db.collection("test").add(testData);

//     console.log(`✅ Test document written with ID: ${docRef.id}`);
//     res.status(200).send({ success: true, docId: docRef.id });
//   } catch (error) {
//     console.error("❌ Failed to write test document:", error);
//     res.status(500).send({ error: "Failed to write test document" });
//   }
// });

app.post("/test-save-game", async (req, res) => {
  const { score } = req.body;

  try {
    const docRef = await db.collection("test").add({
      score,
      timestamp: new Date().toISOString(),
    });

    console.log("🧪 Score saved to test collection:", score);
    res.status(200).send({ success: true, docId: docRef.id });
  } catch (error) {
    console.error("❌ Failed to save score:", error);
    res.status(500).send({ error: "Failed to save score" });
  }
});


// ✅ Start server on port 3000
const PORT = process.env.VITE_BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
