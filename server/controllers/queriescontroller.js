// controllers/queryController.js
const db = require('../db');
const { getSimilarityScore } = require('../services/similarityService');

const THRESHOLD = 0.4; // Similarity threshold

exports.logQuery = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Get all previous queries with replies
    const [rows] = await db.query("SELECT message, reply FROM queries WHERE status = 'complete' AND reply IS NOT NULL");

    let bestMatch = null;
    let highestScore = 0;

    for (const row of rows) {
      const score = getSimilarityScore(message, row.message);
      if (score > highestScore && score >= THRESHOLD) {
        highestScore = score;
        bestMatch = row;
      }
    }

    const autoReplied = bestMatch ? 1 : 0;
    const status = autoReplied ? 'complete' : 'pending';
    const reply = bestMatch ? bestMatch.reply : null;

    // Insert the new query
    await db.query(
      "INSERT INTO queries (name, email, message, status, auto_replied, reply) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, message, status, autoReplied, reply]
    );

    res.status(200).json({
      message: 'Query submitted successfully.',
      autoReply: reply || null,
    });
  } catch (err) {
    console.error('Error logging query:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllQueries = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM queries ORDER BY created_at DESC");
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching queries:', err);
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
};

app.put('/api/queries/reply/:id', async (req, res) => {
  const queryId = req.params.id;
  const { reply_message } = req.body;

  try {
    await db.query(
      "UPDATE queries SET reply_message = ?, status = 'complete' WHERE query_id = ?",
      [reply_message, queryId]
    );

    res.json({ message: "Reply updated successfully." });
  } catch (error) {
    console.error("Error updating reply:", error);
    res.status(500).json({ error: "Failed to update reply" });
  }
});

