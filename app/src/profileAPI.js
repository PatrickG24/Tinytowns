export async function fetchUserProfile(idToken) {
  const res = await fetch("http://localhost:3000/user-profile", {  // ✅ correct path
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return await res.json();
}
