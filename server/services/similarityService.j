// services/similarityService.js
function getSimilarityScore(text1, text2) {
  const words1 = text1.toLowerCase().split(/\W+/);
  const words2 = text2.toLowerCase().split(/\W+/);

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = [...set1].filter(word => set2.has(word));
  const union = new Set([...set1, ...set2]);

  return intersection.length / union.size;
}

module.exports = { getSimilarityScore };
