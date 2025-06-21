const supabase = require('./client');
const { logAction } = require('./logger');
const { getGeminiSummary } = require('./geminiSummarizer');

// Haversine formula
const haversine = (lat1, lon1, lat2, lon2) => {
  const toRad = angle => (angle * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

exports.createDisaster = async (req, res) => {
  const {
    title,
    location_name,
    description = '',
    tags = [],
    owner_id,
    latitude,
    longitude
  } = req.body;

  if (!title || !location_name || !owner_id) {
    return res.status(400).json({ error: 'title, location_name, and owner_id are required' });
  }

  try {
    const { data, error } = await supabase
      .from('disasters')
      .insert([{ title, location_name, description, tags, owner_id, latitude, longitude }])
      .select('*');

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to create disaster' });
    }

    const io = req.app.get('socketio');
    io.emit('disaster_created', data[0]);

    await logAction('create', 'disaster', data[0].id, owner_id);
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};

exports.getDisasters = async (req, res) => {
  const { tag, page = 1, limit = 10 } = req.query;
  const from = (page - 1) * limit;
  const to = from + parseInt(limit) - 1;

  try {
    let query = supabase
      .from('disasters')
      .select('*', { count: 'exact' })
      .range(from, to);

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch disasters' });
    }

    res.json({
      data,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};

exports.deleteDisaster = async (req, res) => {
  const { id } = req.params;
  const owner_id = req.body.owner_id || 'unknown';

  if (!id) {
    return res.status(400).json({ error: 'Disaster ID is required' });
  }

  try {
    const { error } = await supabase
      .from('disasters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({ error: 'Failed to delete disaster' });
    }

    const io = req.app.get('socketio');
    io.emit('disaster_deleted', { id });

    await logAction('delete', 'disaster', id, owner_id);
    res.json({ message: `Disaster ${id} deleted successfully` });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};

exports.updateDisaster = async (req, res) => {
  const { id } = req.params;
  const { title, location_name, description, tags = [], owner_id, latitude, longitude } = req.body;

  if (!id || !owner_id) {
    return res.status(400).json({ error: 'id and owner_id are required' });
  }

  try {
    const { data, error } = await supabase
      .from('disasters')
      .update({ title, location_name, description, tags, latitude, longitude })
      .eq('id', id)
      .select('*');

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Failed to update disaster' });
    }

    const io = req.app.get('socketio');
    io.emit('disaster_updated', data[0]);

    await logAction('update', 'disaster', id, owner_id);
    res.json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};

exports.getNearbyDisasters = async (req, res) => {
  const { lat, lng, radius = 50 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const { data, error } = await supabase
      .from('disasters')
      .select('*');

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch disasters' });
    }

    const nearby = data.filter(d => {
      if (d.latitude && d.longitude) {
        const dist = haversine(parseFloat(lat), parseFloat(lng), d.latitude, d.longitude);
        return dist <= radius;
      }
      return false;
    });

    res.json({ data: nearby, radius });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};

exports.getDisastersGeoJSON = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('disasters')
      .select('*');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch disasters' });
    }

    const geojson = {
      type: 'FeatureCollection',
      features: data
        .filter(d => d.latitude && d.longitude)
        .map(d => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [d.longitude, d.latitude]
          },
          properties: {
            id: d.id,
            title: d.title,
            location_name: d.location_name,
            description: d.description,
            tags: d.tags
          }
        }))
    };

    res.json(geojson);
  } catch (err) {
    console.error('GeoJSON error:', err);
    res.status(500).json({ error: 'GeoJSON generation failed' });
  }
};