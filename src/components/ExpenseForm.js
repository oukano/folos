import React, { useState, useRef } from 'react';
import CategoryModal from './CategoryModal'; // Import CategoryModal
import { db } from '../services/firebase'; // Firestore
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import RecordRTC from 'recordrtc';

const ExpenseForm = () => {
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);  // To store the recorder instance
  const streamRef = useRef(null); 

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'expenses'), {
        price,
        category,
        image,
        audioUrl, // Send audio URL (or Blob, depending on your setup)
        timestamp: serverTimestamp(),
      });

      // Reset form after submission
      setPrice('');
      setCategory('');
      setImage(null);
      setAudio(null);
      setAudioUrl(null);
      alert("Expense added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding expense.");
    }
  };

  // Function to handle category selection
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowModal(false); // Close the modal when a category is selected
  };

  // Function to handle image selection (either camera or gallery)
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Display the image preview
    }
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;  // Save the stream to stop it later

      // Initialize RecordRTC with the stream
      const recorder = new RecordRTC(stream, { type: 'audio' });
      recorder.startRecording();  // Start recording
      recorderRef.current = recorder;  // Save the recorder instance

      setIsRecording(true);  // Set recording state
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Failed to start recording. Please check your microphone permissions.");
    }
  };

  // Stop recording and save the audio
  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const audioUrl = URL.createObjectURL(recorderRef.current.blob);  // Create a URL for the recorded audio
        setAudio(audioUrl);  // Store the audio URL for playback
        setIsRecording(false);  // Update recording state

        // Stop the media stream to release microphone
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      });
    }
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
      <button onClick={() => setShowModal(true)}>Categories</button>

      {/* Conditionally render the CategoryModal */}
      {showModal && (
        <CategoryModal 
          onClose={() => setShowModal(false)} // Close modal when clicked outside or via a close button
          onSelectCategory={handleCategorySelect} 
        />
      )}

      {/* Image Selection - Camera/Gallery */}
      <label htmlFor="image-upload" className="categories-btn">
        📷 Upload Image
      </label>
      <input 
        id="image-upload" 
        type="file" 
        accept="image/*" 
        onChange={handleImageSelect} 
        style={{ display: 'none' }} 
      />

      {/* Display the selected image */}
      {image && <img src={image} alt="Selected" style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }} />}

      {/* Mic Recording */}
      <div>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : '🎤 Start Recording'}
        </button>
      </div>

      {/* Display recorded audio */}
      {audio && (
        <div>
          <audio controls>
            <source src={audio} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ExpenseForm;
