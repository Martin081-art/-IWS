// Simulate logging the purchase in the backend
export const logPurchase = async (cartItems, total) => {
    // Here, you would normally call your backend API to log the purchase
    console.log("Logging purchase:", cartItems);
    console.log("Total amount: $", total);
  
    // Simulate an API call
    return new Promise((resolve) => setTimeout(resolve, 500));
  };
  