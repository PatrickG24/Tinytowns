import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from './profileAPI';

export function Profile({ user }) {
  const [profile, setProfile] = useState(null);

    useEffect(() => {
    async function loadProfile() {
        try {
        const idToken = await user.getIdToken();
        const data = await fetchUserProfile(idToken);
        setProfile(data);
        } catch (err) {
        console.error("❌ Failed to load profile:", err);
        }
    }

    if (user) loadProfile();
    }, [user]);


  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
      <ul className="mb-6">
        {Object.entries(profile.achievements).map(([key, value]) => (
          <li key={key} className={value ? "text-green-600" : "text-gray-400"}>
            {key} {value ? "✅" : "❌"}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-4">Game History</h2>
      <ul>
        {profile.games.map((game, idx) => (
          <li key={idx}>
            Score: {game.score}, Ended: {new Date(game.endTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
