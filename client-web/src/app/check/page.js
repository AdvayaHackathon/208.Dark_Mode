"use client";
import { useState, useEffect, useRef } from "react";
import Avatar from "../../components/Avatar";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentPlace, setCurrentPlace] = useState("");

  // Get user's location
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
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
        setCameraPermission(true);
        
        // Demo: Trigger achievement after 3 seconds
        setTimeout(() => {
          triggerNewPlaceDiscovery("Central Park");
        }, 3000);
      }
    } catch (err) {
      setCameraError(`Error accessing camera: ${err.message}`);
      console.error("Camera error:", err);
    }
  };

  // Function to trigger the achievement popup
  const triggerNewPlaceDiscovery = (placeName) => {
    setCurrentPlace(placeName);
    setShowAchievement(true);
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
    <div className="fixed inset-0 w-full h-full bg-black">
      <div className="relative w-full h-full">
        {/* Camera Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Avatar positioned in the middle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-5/6 md:w-3/4 lg:w-1/2">
            <Avatar />
          </div>
        </div>

        {/* Start Button */}
        {!cameraPermission && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/80 via-black/70 to-black/90 backdrop-blur-sm z-50">
            <button
              onClick={startCamera}
              className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 animate-pulse"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start the tour
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full hover:translate-x-0 transition-transform duration-300 ease-out group-hover:translate-x-full"></span>
            </button>
          </div>
        )}

        {/* Camera Error Display */}
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
            <div className="text-red-500 bg-white p-4 rounded-lg max-w-xs text-center">
              {cameraError}
            </div>
          </div>
        )}

        {/* Location display in a corner */}
        {location && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded-md z-10">
            <div>Lat: {location.latitude.toFixed(6)}</div>
            <div>Long: {location.longitude.toFixed(6)}</div>
          </div>
        )}

        {/* Video call controls */}
        {cameraPermission && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4 z-10">
            <button
              onClick={() => {
                if (videoRef.current && videoRef.current.srcObject) {
                  const tracks = videoRef.current.srcObject.getTracks();
                  tracks.forEach((track) => track.stop());
                  videoRef.current.srcObject = null;
                  setCameraPermission(false);
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-medium w-14 h-14 rounded-full flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* New Place Achievement Overlay */}
        {showAchievement && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
            <div className="animate-bounce-in relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-1 rounded-2xl shadow-2xl max-w-md w-11/12">
              <div className="bg-gray-900 rounded-xl p-6 text-center">
                {/* Confetti animation layer */}
                <div className="absolute inset-0 overflow-hidden">
                  {Array(20).fill().map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: ['#FF5252', '#FFEB3B', '#2196F3', '#4CAF50', '#E040FB'][i % 5],
                        left: `${Math.random() * 100}%`,
                        top: '-20px',
                        animation: `confetti-fall ${1 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
                      }}
                    />
                  ))}
                </div>

                {/* Achievement content */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-lg animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-yellow-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-200 mb-1">
                  HURRAY!
                </h2>
                
                <h3 className="text-xl font-bold text-white mb-4">
                  {`You've discovered a new place!`}
                </h3>
                
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-px rounded-lg mb-6">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xl font-semibold text-white">
                      {currentPlace || "Mystery Location"}
                    </p>
                  </div>
                </div>

                <div className="text-yellow-300 text-sm mb-6">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  +50 XP Earned!
                </div>

                <button
                  onClick={() => setShowAchievement(false)}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transform transition-transform hover:scale-105 shadow-lg"
                >
                  Continue Exploring!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add the style tag for animations */}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}