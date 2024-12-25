import React, { useState, useEffect, useRef } from "react";
import "./CategoryModal.css";

const CategoryModal = ({ onClose, onSelectCategory, categories, addCategory }) => {
  const [newCategory, setNewCategory] = useState("");
  const modalRef = useRef(null);

  const handleAddCategory = () => {
    addCategory(newCategory)
    setNewCategory('')
  }

  // Close modal if clicked outside
  useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
  
        document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onClose]);

 

  return (
    <div className="category-modal-overlay">
      <div className="category-modal" ref={modalRef} >
        <div className="categories">
          {categories.map((category) => (
            <span key={category.id} onClick={() => onSelectCategory(category)}>
              {category.name}
            </span>
          ))}
        </div>
        <div className="add-category">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
          />
          <button onClick={handleAddCategory}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
