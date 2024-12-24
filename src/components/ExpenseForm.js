import React, { useState } from 'react';
import CategoryModal from './CategoryModal'; // Import CategoryModal
import { db } from '../services/firebase'; // Firestore
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ExpenseForm = () => {
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Categories');
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'expenses'), {
        price,
        category,
        image,
        audio,
        timestamp: serverTimestamp(),
      });

      setPrice('');
      setCategory('');
      setImage(null);
      setAudio(null);
      alert("Expense added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding expense.");
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowModal(false); // Close the modal when a category is selected
  };

  return (
    <div className="expense-form">
      <input 
        type="number" 
        placeholder="Enter price" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
      />
      
      {/* Button to show the Category Modal */}
      <button onClick={() => setShowModal(true)}>{category}</button>

      {/* Conditionally render the CategoryModal */}
      {showModal && (
        <CategoryModal 
          onClose={() => setShowModal(false)} // Close modal when clicked outside or via a close button
          onSelectCategory={handleCategorySelect} 
        />
      )}

      <div>
        <button>📷</button> {/* Camera Icon */}
        <button>🎤</button> {/* Mic Icon */}
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ExpenseForm;
