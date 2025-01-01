import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import Papa from "papaparse";
import { FaArrowDown, FaArrowUp, FaTrashAlt, FaSync, FaFileExcel } from "react-icons/fa";
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
      const expenseSnapshot = await getDocs(collection(db, "expenses"));
      const categorySnapshot = await getDocs(collection(db, "categories"));

      // Extract data from Firestore documents
      const fetchedExpenses = expenseSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const fetchedCategories = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(fetchedCategories);

      // Map category names into expenses
      const combinedExpenses = fetchedExpenses.map((expense) => {
        const category = fetchedCategories.find((cat) => cat.id === expense.category);
      console.log(fetchedCategories);

        return {
          ...expense,
          categoryName: category ? category.name : "Unknown", // Default to "Unknown" if no match
        };
      });

      // Sort expenses by date
      const sortedExpenses = combinedExpenses.sort((a, b) => {
        const dateA = new Date(a.date.seconds * 1000);
        const dateB = new Date(b.date.seconds * 1000);
        return dateA - dateB;
      });

      setExpenses(sortedExpenses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const exportToCSV = () => {
    const csvData = expenses.map((expense) => ({
      Price: expense.price,
      Date: new Date(expense.date.seconds * 1000).toLocaleDateString("en-GB"),
      Note: expense.note || "",
      Category: expense.categoryName || "Unknown",
    }));

    const csv = Papa.unparse(csvData);

    // Create a downloadable file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          overflow: "scroll",
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
      <button onClick={exportToCSV} className="export-button">
          <FaFileExcel />
        </button>
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
