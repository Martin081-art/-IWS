const db = require('../models');

const analyticsController = {
  async getAnalytics(req, res) {
    try {
      // Get total queries
      const totalQueriesQuery = 'SELECT COUNT(*) as total FROM queries';
      
      // Get automated vs manual responses
      const responseTypesQuery = `
        SELECT 
          SUM(CASE WHEN auto_replied = 1 THEN 1 ELSE 0 END) as automated,
          SUM(CASE WHEN auto_replied = 0 THEN 1 ELSE 0 END) as manual
        FROM queries
      `;

      // Get queries over time (last 7 days)
      const queriesOverTimeQuery = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM queries
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `;

      // Get response rate
      const responseRateQuery = `
        SELECT 
          (COUNT(CASE WHEN status = 'complete' THEN 1 END) * 100.0 / COUNT(*)) as rate
        FROM queries
      `;

      // Execute all queries
      const [
        totalQueries,
        responseTypes,
        queriesOverTime,
        responseRate
      ] = await Promise.all([
        db.query(totalQueriesQuery),
        db.query(responseTypesQuery),
        db.query(queriesOverTimeQuery),
        db.query(responseRateQuery)
      ]);

      const statistics = {
        totalQueries: totalQueries[0].total,
        automatedResponses: responseTypes[0].automated,
        manualResponses: responseTypes[0].manual,
        responseRate: parseFloat(responseRate[0].rate).toFixed(2),
        avgResponseTime: 0, // You can implement this based on your needs
        successRate: ((responseTypes[0].automated + responseTypes[0].manual) * 100 / totalQueries[0].total).toFixed(2)
      };

      res.json({
        queries: queriesOverTime,
        statistics
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
  }
};

module.exports = analyticsController;