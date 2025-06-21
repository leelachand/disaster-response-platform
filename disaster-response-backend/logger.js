// utils/logger.js
const supabase = require('./client');

exports.logAction = async (action, entity, entity_id, user_id) => {
  const log = {
    action,
    user_id,
    timestamp: new Date().toISOString(),
  };

  await supabase
    .from('disasters')
    .update({ audit_trail: log })
    .eq('id', entity_id);
};
