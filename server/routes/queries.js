const express = require('express');
const { Query } = require('../models');  // Correctly import the Query model
const { Op } = require('sequelize');


const router = express.Router();




// Validate required fields
const validateFields = (fields, reqBody) => {
  return fields.every(field => reqBody[field] && reqBody[field].trim() !== '');
};

const findAutoReply = (incomingMessage, previousQueries) => {
  incomingMessage = incomingMessage.toLowerCase();

  for (const query of previousQueries) {
    const storedMessage = query.message.toLowerCase();
    if (
      incomingMessage.includes(storedMessage) ||
      storedMessage.includes(incomingMessage)
    ) {
      return query.reply_message;
    }
  }

  return null;
};



router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const previousQueries = await Query.findAll({
      where: {
        status: 'complete',
        auto_replied: 1,
        reply_message: {
          [Op.ne]: null
        }
      }
    });

    const autoReply = findAutoReply(message, previousQueries);

    const newQuery = await Query.create({
      name,
      email,
      message,
      status: autoReply ? 'complete' : 'pending',
      auto_replied: autoReply ? 1 : 0,
      reply_message: autoReply || null,
    });

    res.status(201).json({
      message: 'Query logged successfully',
      autoReply: autoReply || 'Thank you for your query, we will get back to you soon!',
    });
  } catch (error) {
    console.error('Error saving query:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/report', async (req, res) => {
  try {
    const allQueries = await Query.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(allQueries);
  } catch (error) {
    console.error('Error fetching query report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;
