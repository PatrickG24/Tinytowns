export async function saveGameToServer({ score, startTime, endTime, grid }, idToken) {
  try {
    const response = await fetch("http://localhost:3000/save-user-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ score, startTime, endTime, grid }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("🛑 Server responded with error:", result);
      throw new Error("Server failed to save game");
    }

    console.log("✅ Game saved:", result);
  } catch (err) {
    console.error("🔥 saveGameToServer error:", err);
  }
}
