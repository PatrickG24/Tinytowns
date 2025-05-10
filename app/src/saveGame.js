// export async function saveGameToServer({ grid, score, startTime, endTime }) {
//   try {
//     const res = await fetch("http://localhost:3000/test-save-game", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         grid,          // ✅ matches what your server expects
//         score,
//         startTime,
//         endTime,
//       }),
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error("❌ Failed to save game:", errorText);
//       throw new Error("Failed to save game");
//     }

//     const result = await res.json();
//     console.log("✅ Game saved successfully:", result);
//   } catch (err) {
//     console.error("🔥 Error in saveGameToServer:", err);
//   }
// }


export async function saveGameToServer(score) {
  try {
    const res = await fetch("http://localhost:3000/test-save-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }), // Only sending score now
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Failed to save score:", errorText);
      throw new Error("Failed to save score");
    }

    const result = await res.json();
    console.log("✅ Score saved successfully:", result);
  } catch (err) {
    console.error("🔥 Error in saveGameToServer:", err);
  }
}
