import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import "./ExpenseList.css";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);  

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "expenses"));
        const expenseList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort expenses by date in ascending order
        const sortedExpenses = expenseList.sort((a, b) => {
          const dateA = new Date(a.date.seconds); // Convert string to Date object
          const dateB = new Date(b.date.seconds);
          return dateA - dateB; // Sort by date (earliest first)
        });
        setExpenses(sortedExpenses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.price), 0);

  const toggleList = () => {
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };

  if (loading) {
    return <p>Loading expenses...</p>;
  }

  return (
    <div className="expense-list">
      <h2>All Expenses : {totalExpenses} MAD</h2>
      {/* Button to expand/collapse */}
      <button
        onClick={toggleList}
        className="toggle-button"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#007bff",
          fontSize: "18px",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isExpanded ? (
          <FaArrowUp style={{ marginRight: "5px" }} />
        ) : (
          <FaArrowDown style={{ marginRight: "5px" }} />
        )}
        {isExpanded ? "Collapse" : "Expand"}
      </button>
      <div 
      style={{
        transition: "max-height 0.3s ease-out",
        maxHeight: isExpanded ? "1000px" : "0", // Toggle height for smooth collapse/expand
        overflow: "hidden",
      }}
      className="expense-table">
        <div className="expense-header">
          <div>Price</div>
          <div>Date</div>
          <div>Note</div>
        </div>
        {expenses.map((expense) => 
            {
              console.log(expense)
              return (
                <div key={expense.id} className="expense-row">
                    <div>{expense.price} MAD</div>
                    <div>{new Date(expense.date.seconds * 1000).toLocaleDateString('en-GB')}</div>
                    <div>{expense.note}</div>
                </div>
                
            )}
        )}
        
      </div>
    </div>
  );
};

export default ExpenseList;
