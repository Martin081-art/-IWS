const db = require('../db');
const { Query } = require('../models'); // Correct import for Query model
const { getSimilarityScore } = require('../services/similarityService');
const { Op } = require('sequelize');


const THRESHOLD = 0.4; // Similarity threshold

exports.logQuery = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Get all previous queries with replies
    const previousQueries = await Query.findAll({
      where: {
        status: 'complete',
        reply_message: {
          [Op.ne]: null
        }
      }
    });

    let bestMatch = null;
    let highestScore = 0;

    for (const row of previousQueries) {
      const score = getSimilarityScore(message, row.message);
      if (score > highestScore && score >= THRESHOLD) {
        highestScore = score;
        bestMatch = row;
      }
    }

    const autoReplied = bestMatch ? 1 : 0;
    const status = autoReplied ? 'complete' : 'pending';
    const reply = bestMatch ? bestMatch.reply_message : null;

    // Insert the new query into the database
    const newQuery = await Query.create({
      name,
      email,
      message,
      status,
      auto_replied: autoReplied,
      reply_message: reply,
    });

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
    const allQueries = await Query.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(allQueries);
  } catch (err) {
    console.error('Error fetching queries:', err);
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
};

// Handle reply to a query
exports.replyToQuery = async (req, res) => {
  const queryId = req.params.query_id; // Use query_id here
  const { reply_message } = req.body;

  try {
    // Update the query with the reply message
    const query = await Query.findOne({
      where: { query_id: queryId } // Use query_id here
    });

    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    query.reply_message = reply_message;
    query.status = 'complete'; // Update the status to complete after replying

    await query.save(); // Save the updated query

    res.status(200).json({ message: 'Reply updated successfully.' });
  } catch (err) {
    console.error('Error updating reply:', err);
    res.status(500).json({ error: 'Failed to update reply' });
  }
};

exports.markQueryComplete = async (req, res) => {
  const { query_id } = req.params;

  try {
    const query = await Query.findOne({ where: { query_id } });

    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    query.status = 'complete';
    await query.save();

    res.status(200).json({ message: 'Query marked as complete.' });
  } catch (error) {
    console.error('Error marking query complete:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

