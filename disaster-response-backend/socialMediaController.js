// socialMediaController.js
const supabase = require('./client');
const { logAction } = require('./logger');
const { cacheGet, cacheSet } = require('./cacheUtils');

// Mock social media posts
const mockPosts = [
  {
    post: '#floodrelief Need food in NYC',
    user: 'citizen1',
    type: 'need',
    timestamp: new Date().toISOString()
  },
  {
    post: 'Offering shelter in Brooklyn for flood victims #help',
    user: 'volunteer42',
    type: 'offer',
    timestamp: new Date().toISOString()
  },
  {
    post: 'Urgent: trapped in Lower Manhattan. Please help. #SOS',
    user: 'trappedUser',
    type: 'urgent',
    timestamp: new Date().toISOString()
  }
];

exports.getSocialMediaPosts = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `social_media_${id}`;

  try {
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.json({ cached: true, data: cached });
    }

    // Simulate filtering posts related to the disaster ID (in real case, use keywords)
    const relevantPosts = mockPosts.map(post => ({ ...post, disaster_id: id }));

    await cacheSet(cacheKey, relevantPosts, 3600); // TTL 1 hour

    const io = req.app.get('socketio');
    io.emit('social_media_updated', relevantPosts);

    await logAction('fetch', 'social_media', id, 'system');

    res.json({ cached: false, data: relevantPosts });
  } catch (err) {
    console.error('Social media fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve social media posts' });
  }
};