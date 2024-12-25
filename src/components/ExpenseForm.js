import React, { useState, useEffect } from 'react';
import CategoryModal from './CategoryModal'; // Import CategoryModal
import { db } from '../services/firebase'; // Firestore
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
// import RecordRTC from 'recordrtc';
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './ExpenseForm.css';

const ExpenseForm = () => {
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState({name: 'Category'});
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [note, setNote] = useState('');
//   const [image, setImage] = useState(null);
//   const [audio, setAudio] = useState(null);
//   const [audioUrl, setAudioUrl] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const recorderRef = useRef(null);  // To store the recorder instance
//   const streamRef = useRef(null); 

  // Function to handle form submission
  const handleSubmit = async () => {

    if (price.trim() !== "") {
      const selectedDate = date ? new Date(date) : new Date();
      try {
        await addDoc(collection(db, 'expenses'), {
          price,
          note,
          category: category.id,
          date: selectedDate,
          // image,
          // audioUrl, // Send audio URL (or Blob, depending on your setup)
          timestamp: serverTimestamp(),
        });

        // Reset form after submission
        setPrice('');
        setNote('');
        setCategory({name: 'Category'});
      //   setImage(null);
      //   setAudio(null);
      //   setAudioUrl(null);
      } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error adding expense.");
      }
    }
  };

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
  }, [categories]);
   // Add a new category
   const addCategory = async (newCategory) => {
    if (newCategory.trim() === "") return alert("Category name cannot be empty");

    try {
      const docRef = await addDoc(collection(db, "categories"), { name: newCategory.trim() });
      setCategories([...categories, { id: docRef.id, name: newCategory.trim() }]); // Update local list
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  // Function to handle category selection
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowModal(false); // Close the modal when a category is selected
  };

//     const uploadImage = async (file) => {
//     try {
//       const storageRef = ref(storage, `images/${file.name}`); // Create a reference
//       const snapshot = await uploadBytes(storageRef, file); // Upload file
//       const downloadURL = await getDownloadURL(snapshot.ref); // Get the file's download URL
//       console.log("File uploaded successfully. URL:", downloadURL);
//       return downloadURL;
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       throw error;
//     }
//   };

  // Function to handle image selection (either camera or gallery)
//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//         uploadImage(file).then((url) => {
//             setImage(URL.createObjectURL(file)); // Display the image preview
//         });
//     }
//   };

  // Start recording audio
//   const startRecording = async () => {
//     try {
//       // Request microphone access
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;  // Save the stream to stop it later

//       // Initialize RecordRTC with the stream
//       const recorder = new RecordRTC(stream, { type: 'audio' });
//       recorder.startRecording();  // Start recording
//       recorderRef.current = recorder;  // Save the recorder instance

//       setIsRecording(true);  // Set recording state
//     } catch (error) {
//       console.error("Error accessing microphone:", error);
//       alert("Failed to start recording. Please check your microphone permissions.");
//     }
//   };

  // Stop recording and save the audio
//   const stopRecording = () => {
//     if (recorderRef.current) {
//         recorderRef.current.stopRecording(() => {
//             const blob = recorderRef.current.getBlob(); // Safely retrieve the blob
//             const audioUrl = URL.createObjectURL(blob); // Create a URL from the blob
//             setAudio(audioUrl);
//             setIsRecording(false);
          
//             // Stop the media stream
//             if (streamRef.current) {
//               streamRef.current.getTracks().forEach(track => track.stop());
//             }
//         });
//     }
//   };

  return (
    <div className="expense-form">
      <div className='mainInput'>
      <input 
        type="number" 
        placeholder="MAD" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
      />
      <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        </div>
      {/* Button to show the Category Modal */}
      <button onClick={() => setShowModal(true)}>{category.name}</button>

      {/* Conditionally render the CategoryModal */}
      {showModal && (
        <CategoryModal 
          onClose={() => setShowModal(false)} // Close modal when clicked outside or via a close button
          onSelectCategory={handleCategorySelect} 
          addCategory={addCategory}
          categories={categories}
        />
      )}

<textarea
        placeholder="Add a note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          resize: "none",
        }}
      />

        <div className='multimedia'>


      {/* Image Selection - Camera/Gallery */}
      {/* <button htmlFor="image-upload" className="categories-btn">
        📷
      </button> */}

      {/* <input 
        id="image-upload" 
        type="file" 
        accept="image/*" 
        onChange={handleImageSelect} 
        style={{ display: 'none' }} 
      /> */}

      {/* Display the selected image */}
      {/* {image && <img src={image} alt="Selected" style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }} />} */}

      {/* Mic Recording */}
        {/* <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : '🎤 Start Recording'}
        </button> */}
        </div>
      {/* Display recorded audio */}
      {/* {audio && (
        <div>
          <audio controls>
            <source src={audio} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )} */}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ExpenseForm;
