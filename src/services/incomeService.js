export const getIncomes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/income');
      if (!response.ok) throw new Error('Failed to fetch incomes');
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export const createIncome = async (incomeData) => {
    try {
      const response = await fetch('http://localhost:5000/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData),
      });
      if (!response.ok) throw new Error('Failed to create income');
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  