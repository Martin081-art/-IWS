const express = require('express');
const { Query } = require('../models'); // Correct import for Query model
const { replyToQuery, markQueryComplete, getAllQueries } = require('../controllers/queriescontroller'); // Correct import for controller functions
const { getSimilarityScore } = require('../services/similarityService'); // Correct import for similarity service
const { Op } = require('sequelize'); // Correct import for Sequelize operators
const router = express.Router();

// Function to find the best auto-reply based on message similarity
const findAutoReply = (message, previousQueries) => {
  let bestMatch = null;
  let highestScore = 0;
  
  // Loop through previous queries and find the best match based on similarity score
  for (const query of previousQueries) {
    const score = getSimilarityScore(message, query.message); // Compute similarity score
    if (score > highestScore && score >= 0.4) { // Match if score exceeds threshold
      highestScore = score;
      bestMatch = query;
    }
  }
  
  return bestMatch ? bestMatch.reply_message : null; // Return reply message if match is found
};

// Route to create a new query
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    console.log('Received request to create a new query:', req.body);

    // Get all previous queries with completed status and replies
    const previousQueries = await Query.findAll({
      where: {
        status: 'complete',
        auto_replied: 1,
        reply_message: {
          [Op.ne]: null
        }
      }
    });

    console.log('Found previous queries with auto-replies:', previousQueries);

    // Find an auto-reply for the current message
    const autoReply = findAutoReply(message, previousQueries);
    console.log('Auto-reply found:', autoReply);

    // Create a new query in the database
    const newQuery = await Query.create({
      name,
      email,
      message,
      status: autoReply ? 'complete' : 'pending', // Set status to complete if there's an auto-reply
      auto_replied: autoReply ? 1 : 0, // Set auto_replied flag
      reply_message: autoReply || null, // Set the reply message
    });

    console.log('New query created:', newQuery);

    res.status(201).json({
      message: 'Query logged successfully',
      autoReply: autoReply || 'Thank you for your query, we will get back to you soon!',
    });
  } catch (error) {
    console.error('Error saving query:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to reply to a query
router.put('/reply/:query_id', (req, res, next) => {
  console.log('Received request to reply to query with ID:', req.params.query_id);
  next();
}, replyToQuery); // Use query_id in the route

// Route to mark a query as complete
router.put('/:query_id', (req, res, next) => {
  console.log('Received request to mark query with ID:', req.params.query_id, 'as complete');
  next();
}, markQueryComplete); // Matches frontend expectations

// Route to get all queries
router.get('/', (req, res, next) => {
  console.log('Received request to get all queries');
  next();
}, getAllQueries); // Replaced with direct controller function

module.exports = router;
