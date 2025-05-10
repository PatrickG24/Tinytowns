// achievements.js
export async function updateAchievementsOnServer(achievements, idToken) {
  try {
    const response = await fetch("http://localhost:3000/update-achievements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ achievements }),
    });

    if (!response.ok) {
      throw new Error("Failed to update achievements");
    }

    const data = await response.json();
    console.log("Achievements updated:", data);
  } catch (error) {
    console.error("Error updating achievements:", error);
  }
}
