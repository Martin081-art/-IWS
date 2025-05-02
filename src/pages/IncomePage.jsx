
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const IncomePage = () => {
  const { user } = useAuth();
  const [month, setMonth] = useState('');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [profit, setProfit] = useState('');
  const [incomeStatements, setIncomeStatements] = useState([]);

  // Fetch all income statements
  useEffect(() => {
    console.log('Fetching income statements...');
  
    const fetchIncomeStatements = async () => {
      try {
        const token = localStorage.getItem('token');
  
        const response = await fetch('http://localhost:5000/api/income', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
  
        console.log('Fetched data:', data);
        setIncomeStatements(data);
      } catch (error) {
        console.error('Error fetching income statements:', error);
      }
    };
  
    fetchIncomeStatements();
  }, []);
  

  // Auto-calculate profit whenever income or expenses change
  useEffect(() => {
    if (income && expenses) {
      setProfit(parseFloat(income) - parseFloat(expenses));
    }
  }, [income, expenses]);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token'); // Assuming JWT is stored here after login
  
      const response = await fetch('http://localhost:5000/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ month, income, expenses }), // Profit is handled in backend
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Income statement created successfully!');
        
        // Fetch updated income statements
        const updatedResponse = await fetch('http://localhost:5000/api/income', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const updatedData = await updatedResponse.json();
        setIncomeStatements(updatedData);
      } else {
        alert(data.message || 'Failed to create income statement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting income statement');
    }
  };
  
  // Calculate the total profit
  const totalProfit = incomeStatements.reduce((acc, statement) => acc + (parseFloat(statement.profit) || 0), 0);

  // Prepare data for the chart
  const chartData = {
    labels: incomeStatements.map(statement => statement.month),
    datasets: [
      {
        label: 'Income',
        data: incomeStatements.map(statement => parseFloat(statement.income)),
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        fill: true,
      },
      {
        label: 'Expenses',
        data: incomeStatements.map(statement => parseFloat(statement.expenses)),
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        fill: true,
      },
      {
        label: 'Profit',
        data: incomeStatements.map(statement => parseFloat(statement.profit)),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        fill: true,
      }
    ]
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Income Statement Entry</h2>

      {/* Income Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
        <div>
          <label htmlFor="month" className="block text-sm font-semibold text-gray-700">Month</label>
          <input
            type="text"
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="income" className="block text-sm font-semibold text-gray-700">Income</label>
          <input
            type="number"
            id="income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="expenses" className="block text-sm font-semibold text-gray-700">Expenses</label>
          <input
            type="number"
            id="expenses"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            className="w-full p-3 mt-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="profit" className="block text-sm font-semibold text-gray-700">Profit</label>
          <input
            type="number"
            id="profit"
            value={profit}
            disabled
            className="w-full p-3 mt-2 border rounded-md bg-gray-100 border-gray-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Income Statement
        </button>
      </form>

      {/* Display All Income Statements */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-center">All Income Statements</h3>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Month</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Income</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Expenses</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Profit</th>
            </tr>
          </thead>
          <tbody>
            {incomeStatements.map((statement) => (
              <tr key={statement.id} className="hover:bg-gray-100">
                <td className="p-4 text-sm text-gray-700">{statement.month}</td>
                <td className="p-4 text-sm text-gray-700">{statement.income}</td>
                <td className="p-4 text-sm text-gray-700">{statement.expenses}</td>
                <td className="p-4 text-sm text-gray-700">{statement.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Display total profit */}
        <div className="mt-4 text-lg font-semibold text-gray-700">
          <p>Total Profit: ${totalProfit.toFixed(2)}</p>
        </div>

        {/* Chart for Income, Expenses, and Profit */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-center">Income, Expenses, and Profit Chart</h3>
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default IncomePage;