import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  Card,
  CardContent
} from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [queryData, setQueryData] = useState({
    queries: [],
    responses: [],
    statistics: {}
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setQueryData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const queryLineChartData = {
    labels: queryData.queries.map(q => q.date),
    datasets: [{
      label: 'Queries Over Time',
      data: queryData.queries.map(q => q.count),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const responseTypeData = {
    labels: ['Automated', 'Manual'],
    datasets: [{
      data: [
        queryData.statistics.automatedResponses || 0,
        queryData.statistics.manualResponses || 0
      ],
      backgroundColor: ['#FF6384', '#36A2EB']
    }]
  };

  const categoryBarData = {
    labels: queryData.statistics.categories?.map(c => c.name) || [],
    datasets: [{
      label: 'Queries by Category',
      data: queryData.statistics.categories?.map(c => c.count) || [],
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Query Analytics Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Queries Over Time
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={queryLineChartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Response Types
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={responseTypeData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Queries by Category
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={categoryBarData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Key Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Queries
                  </Typography>
                  <Typography variant="h4">
                    {queryData.statistics.totalQueries || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Response Rate
                  </Typography>
                  <Typography variant="h4">
                    {queryData.statistics.responseRate || 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Response Time
                  </Typography>
                  <Typography variant="h4">
                    {queryData.statistics.avgResponseTime || 0}s
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Success Rate
                  </Typography>
                  <Typography variant="h4">
                    {queryData.statistics.successRate || 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;