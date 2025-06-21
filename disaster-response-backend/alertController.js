const supabase = require('./client');
const { logAction } = require('./logger');
const { getGeminiSummary } = require('./geminiSummarizer');

exports.receiveAlert = async (req, res) => {
  const {
    source = 'mock-twitter',
    message,
    latitude,
    longitude
  } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    // Step 1: Use Gemini to summarize and extract info
    const summaryData = await getGeminiSummary(message);
    if (!summaryData) {
      return res.status(500).json({ error: 'AI summarization failed' });
    }

    const {
      summary,
      type,
      location,
      tags
    } = summaryData;

    const location_name = location || 'Unknown';
    const title = `${type || 'Unknown'} Alert`;

    // ✅ Step 2: Store in alerts table (now includes lat/lng)
    const alertInsert = await supabase
      .from('alerts')
      .insert([{
        source,
        message,
        summary,
        type,
        location: location_name,
        tags,
        latitude,          // ✅ Added
        longitude          // ✅ Added
      }])
      .select('*');

    if (alertInsert.error) {
      console.error('Alert insert error:', alertInsert.error);
      return res.status(500).json({ error: 'Failed to store alert' });
    }

    const alertData = alertInsert.data[0];

    // Step 3: Store in disasters table
    const disasterInsert = await supabase
      .from('disasters')
      .insert([{
        title,
        description: message,
        location_name,
        tags,
        latitude,
        longitude,
        owner_id: source
      }])
      .select('*');

    if (disasterInsert.error) {
      console.error('Disaster insert error:', disasterInsert.error);
      return res.status(500).json({ error: 'Failed to store disaster' });
    }

    const io = req.app.get('socketio');
    io.emit('alert_received', disasterInsert.data[0]);

    await logAction('alert', 'disaster', disasterInsert.data[0].id, source);

    res.status(201).json({
      message: 'Alert processed and stored successfully',
      alert: alertData,
      disaster: disasterInsert.data[0]
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};
