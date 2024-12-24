import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const CategoryModal = ({ onClose, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const fetchedCategories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories(); // Fetch categories only when modal is open
  }, []);

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

  // Add a new category
  const addCategory = async () => {
    if (newCategory.trim() === "") return alert("Category name cannot be empty");

    try {
      const docRef = await addDoc(collection(db, "categories"), { name: newCategory.trim() });
      setCategories([...categories, { id: docRef.id, name: newCategory.trim() }]); // Update local list
      setNewCategory(""); // Clear input
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  return (
    <div className="category-modal-overlay">
      <div className="category-modal" ref={modalRef} >
        <h2>Select a Category</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id} onClick={() => onSelectCategory(category.name)}>
              {category.name}
            </li>
          ))}
        </ul>
        <div className="add-category">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
          />
          <button onClick={addCategory}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
