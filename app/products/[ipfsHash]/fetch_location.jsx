'use client'

import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCpxGN2fTUXjRAmehUEbHbSx2kq3q2unEg",
  authDomain: "qrcode-blockchain-e3dc7.firebaseapp.com",
  projectId: "qrcode-blockchain-e3dc7",
  storageBucket: "qrcode-blockchain-e3dc7.firebasestorage.app",
  messagingSenderId: "494436534708",
  appId: "1:494436534708:web:b776643e6eb9be8caf0ae1",
  measurementId: "G-MY5GLW817G"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const Location_Fetching = ({ setLocationData }) => {
  const [showPopup, setShowPopup] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (showPopup) {
      const confirmLocation = window.confirm("Would you like to share your location?");
      if (confirmLocation) {
        fetchLocation();
      } else {
        setShowPopup(false);
        setLocationData(null);
      }
    }
  }, [showPopup]);

  const fetchLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const pageUrl = window.location.href;
          const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          
          try {
            setLocationData({
              latitude: latitude,
              longitude: longitude,
              pageUrl: pageUrl,
              googleMapsLink: googleMapsLink
            });
            
            await addDoc(collection(db, 'locations'), {
              latitude,
              longitude,
              timestamp: new Date(),
              pageUrl,
              googleMapsLink
            });
            alert('Location saved successfully!');
          } catch (err) {
            setError('Failed to save location');
          }
          setShowPopup(false);
        },
        (err) => {
          setError(err.message);
          setShowPopup(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setShowPopup(false);
    }
  };

  return (
    <div className="p-4 text-center">
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Location_Fetching;
