"use client";
import { useState, useEffect, useRef } from "react";
import Avatar from "@/components/Avatar";
import Dictaphone from "@/components/voice";


export default function Home() {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const [text,setText] = useState("");


  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError(`Error getting location: ${error.message}`);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Handle camera access
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Important: This ensures the video plays when loaded
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
        setCameraPermission(true);
      }
    } catch (err) {
      setCameraError(`Error accessing camera: ${err.message}`);
      console.error("Camera error:", err);
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black">
      {/* Full screen wrapper */}
      <div className="relative w-full h-full">
        {/* Camera Section */}
        {!cameraPermission && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black">
          <button
            onClick={startCamera}
            className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 animate-pulse"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Start the tour
             
            </span>
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full hover:translate-x-0 transition-transform duration-300 ease-out group-hover:translate-x-full"></span>
          </button>
        </div>
        )}

        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
            <div className="text-red-500 bg-white p-4 rounded-lg max-w-xs text-center">
              {cameraError}
            </div>
          </div>
        )}

        {/* Video element takes full screen */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Avatar positioned in the middle */}
        <div className="absolute h-[50%] w-[50%]  flex items-center top-85 bottom-10 right-0 justify-center pointer-events-none ">
          <div className="w-[100%] h-[100%]">
            <Avatar text={text} />
          </div>
        </div>


        {/* Location display in a corner */}
        {/* {location && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded-md z-10">
            <div>Lat: {location.latitude.toFixed(6)}</div>
            <div>Long: {location.longitude.toFixed(6)}</div>
          </div>
        )} */}

        {/* Video call controls */}

        {cameraPermission && (
          <div className="absolute top-3 left-3  flex justify-center space-x-4 z-10">
            <button
              onClick={() => {
                if (videoRef.current && videoRef.current.srcObject) {
                  const tracks = videoRef.current.srcObject.getTracks();
                  tracks.forEach((track) => track.stop());
                  videoRef.current.srcObject = null;
                  setCameraPermission(false);
                }
              }}
              className="bg-red-500/30 text-white font-medium w-14 h-14 rounded-full flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          
          
          </div>
          
        )}

        {cameraPermission && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4 z-10">
           
            <div>
                <Dictaphone setText={setText}/>
            </div>
          
          </div>
          
        )}
        
      </div>
    </div>
  );
}