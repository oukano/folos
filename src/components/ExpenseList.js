import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { FaArrowDown, FaArrowUp, FaTrashAlt, FaSync } from "react-icons/fa";
import "./ExpenseList.css";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // Track which row is clicked
  const [isConfirming, setIsConfirming] = useState(false); // Track confirmation state
  const [expenseToDelete, setExpenseToDelete] = useState(null); // Store the expense to delete

  useEffect(() => {

    fetchExpenses();
  }, []);

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

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.price), 0);

  const toggleList = () => {
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };

  const handleDelete = async (expenseId) => {
    try {
      await deleteDoc(doc(db, "expenses", expenseId));
      setExpenses(expenses.filter((expense) => expense.id !== expenseId)); // Remove expense from state after deletion
      setIsConfirming(false); // Reset confirmation state
      setExpenseToDelete(null); // Clear the expense to delete
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleRowClick = (index) => {
    // Toggle the row's active state
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense); // Set the expense to delete
    setIsConfirming(true); // Show the confirmation prompt
  };

  const cancelDelete = () => {
    setIsConfirming(false); // Cancel the deletion
    setExpenseToDelete(null); // Clear the expense to delete
  };
  const refreshExpenses = () => {
    setLoading(true); // Show loading indicator while fetching
    fetchExpenses(); // Trigger the fetchExpenses function to reload data
  };

  

  return (
    <div className="expense-list">
      <div className="header" >
      <h2>All Expenses: {totalExpenses} MAD</h2>
      <button onClick={refreshExpenses} className="refresh-button">
          <FaSync size={20} />
        </button>
      </div>
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

      {loading ?( <p>Loading expenses...</p>) :
      (<div
        style={{
          transition: "max-height 0.3s ease-out",
          maxHeight: isExpanded ? "1000px" : "0", // Toggle height for smooth collapse/expand
          overflow: "hidden",
        }}
        className="expense-table"
      >
        <div className="expense-header">
          <div>Price</div>
          <div>Date</div>
          <div>Note</div>
        </div>

        {expenses.map((expense, index) => (
          <div
            key={expense.id}
            className="expense-row"
            onClick={() => handleRowClick(index)} // Trigger row click
            style={{
              position: "relative", // Necessary for absolute positioning of delete button
            }}
          >
            <div>{expense.price} MAD</div>
            <div>{new Date(expense.date.seconds * 1000).toLocaleDateString("en-GB")}</div>
            <div>{expense.note}</div>

            {/* Delete button */}
            {activeIndex === index && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click from triggering when clicking delete
                  handleDeleteClick(expense); // Trigger confirmation for deletion
                }}
                className="delete-button"
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
        ))}
      </div>
      )
      }
      {/* Confirmation dialog */}
      {isConfirming && expenseToDelete && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <p>Are you sure you want to delete this expense?</p>
            <button
              className="confirm-button"
              onClick={() => handleDelete(expenseToDelete.id)}
            >
              Yes, Delete
            </button>
            <button className="cancel-button" onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
