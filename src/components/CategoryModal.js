import React from 'react';

const CategoryModal = ({ onClose, onSelectCategory }) => {
  const categories = ["Food", "Transport", "Entertainment", "Shopping"]; // Example categories

  return (
    <div className="category-modal-overlay">
      <div className="category-modal">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Select a Category</h2>
        <ul>
          {categories.map((cat, index) => (
            <li key={index} onClick={() => onSelectCategory(cat)}>
              {cat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryModal;
