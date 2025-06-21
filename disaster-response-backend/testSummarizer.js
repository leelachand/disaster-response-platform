// testSummarizer.js
const { summarizeAlertWithGemini } = require('./geminiSummarizer');

const sampleAlert = `
BREAKING: Intense rainfall overnight has led to major flooding in several districts of Chennai. Water levels rising rapidly. 
Citizens advised to stay indoors. Emergency services deployed.
`;

(async () => {
  const summary = await summarizeAlertWithGemini(sampleAlert);
  console.log('🔍 Summary Output:\n', summary);
})();
