// cacheUtils.js
const supabase = require('./client');

exports.cacheGet = async (key) => {
  const now = new Date().toISOString();
  const { data } = await supabase
    .from('cache')
    .select('value')
    .eq('key', key)
    .gt('expires_at', now)
    .single();
  return data?.value || null;
};

exports.cacheSet = async (key, value, ttlSeconds = 3600) => {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  await supabase.from('cache').upsert({ key, value, expires_at: expiresAt });
};
