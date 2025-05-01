// server/utils/tfidfHelper.js
const natural = require('natural');
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

/**
 * Find most similar message from a set of past queries
 * @param {string} newMessage - The new incoming customer message
 * @param {Array} pastQueries - Array of { message: string, reply_message: string }
 * @param {number} threshold - Cosine similarity threshold (e.g., 0.6)
 * @returns {string|null} - Suggested reply or null
 */
function findAutoReply(newMessage, pastQueries, threshold = 0.6) {
  const tfidf = new TfIdf();

  pastQueries.forEach((q, i) => {
    tfidf.addDocument(tokenizer.tokenize(q.message).join(' '), i.toString());
  });

  const newTokens = tokenizer.tokenize(newMessage).join(' ');
  let bestMatchIndex = -1;
  let highestScore = 0;

  tfidf.tfidfs(newTokens, (i, score) => {
    if (score > highestScore) {
      highestScore = score;
      bestMatchIndex = i;
    }
  });

  if (highestScore >= threshold && bestMatchIndex !== -1) {
    return pastQueries[bestMatchIndex].reply_message;
  }

  return null;
}

module.exports = { findAutoReply };
