import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to your backend server
const socket = io('http://localhost:3000'); // Change this if your backend is deployed

const SocialMediaFeed = ({ disasterId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/disasters/${disasterId}/social-media`);
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to fetch social media posts:', err);
      }
    };

    // Initial fetch
    fetchPosts();

    // Listen to real-time updates from backend via socket
    socket.on('social_media_updated', (update) => {
      if (update.disasterId === disasterId) {
        setPosts(update.posts);
      }
    });

    // Clean up the socket listener on unmount
    return () => {
      socket.off('social_media_updated');
    };
  }, [disasterId]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">📡 Social Media Reports</h3>
      <ul className="space-y-3">
        {posts.length === 0 && <p className="text-gray-500">No social media posts found.</p>}
        {posts.map((post, idx) => (
          <li
            key={idx}
            className="border border-gray-200 rounded p-3 bg-gray-50"
          >
            <p className="font-bold text-blue-600">@{post.user}</p>
            <p className="text-gray-800">{post.post}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialMediaFeed;

