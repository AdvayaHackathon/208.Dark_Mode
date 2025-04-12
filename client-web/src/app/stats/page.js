"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Map,
  GlobeAlt,
  Camera,
  Calendar,
  Flag,
  Clock,
  ThumbsUp,
  Zap,
  Globe2Icon,
} from "lucide-react";





export default function TravelTimeline() {
  const [activePlace, setActivePlace] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef(null);

  const allPlaces = [
    {
      id: 1,
      name: "Paris, France",
      date: "March 2023",
      duration: "7 days",
      highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
      rating: 4.8,
      photos: 127,
      visited: true,
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      date: "July 2023",
      duration: "12 days",
      highlights: ["Shibuya Crossing", "Tokyo Tower", "Meiji Shrine"],
      rating: 4.9,
      photos: 318,
      visited: true,
    },
    {
      id: 3,
      name: "Santorini, Greece",
      date: "September 2023",
      duration: "5 days",
      highlights: ["Oia Sunset", "Black Sand Beach", "Fira"],
      rating: 5.0,
      photos: 211,
      visited: true,
    },
    {
      id: 4,
      name: "Machu Picchu, Peru",
      date: "Upcoming",
      duration: "5 days",
      highlights: ["Inca Trail", "Sacred Valley", "Sun Gate"],
      rating: null,
      photos: 0,
      visited: false,
    },
    {
      id: 5,
      name: "Serengeti, Tanzania",
      date: "Upcoming",
      duration: "8 days",
      highlights: ["Wildlife Safari", "Great Migration", "Ngorongoro Crater"],
      rating: null,
      photos: 0,
      visited: false,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const timelineStart = timelineRect.top + window.pageYOffset;
      const timelineEnd = timelineStart + timelineRect.height;
      const currentPosition = window.pageYOffset + window.innerHeight;

      const progress = Math.min(
        100,
        Math.max(
          0,
          ((currentPosition - timelineStart) / timelineRect.height) * 100
        )
      );

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sortedPlaces = useMemo(
    () =>
      [...allPlaces].sort((a, b) => {
        if (a.visited === b.visited) return a.id - b.id;
        return a.visited ? -1 : 1;
      }),
    [allPlaces]
  );

  const visitedPlaces = sortedPlaces.filter((place) => place.visited);
  const totalPlaces = sortedPlaces.length;
  const visitedCount = visitedPlaces.length;
  const totalDays = visitedPlaces.reduce(
    (sum, place) => sum + parseInt(place.duration),
    0
  );
  const totalPhotos = visitedPlaces.reduce(
    (sum, place) => sum + place.photos,
    0
  );
  const avgRating =
    visitedCount > 0
      ? (
          visitedPlaces.reduce((sum, place) => sum + place.rating, 0) /
          visitedCount
        ).toFixed(1)
      : 0;
  const lastVisitedIndex =
    sortedPlaces.findIndex((place) => !place.visited) - 1;
  const timelineProgress = ((lastVisitedIndex + 1) / sortedPlaces.length) * 100;

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-800">
            AI Travel Guide
          </h1>
          <button
            onClick={() => setShowStats(!showStats)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2"
          >
            {showStats ? <Map size={20} /> : <Zap size={20} />}
            {showStats ? "Show Timeline" : "Show Stats"}
          </button>
        </div>

        {!showStats ? (
          <div className="relative mb-32" ref={timelineRef}>
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300 z-0"></div>
            {/* Animated progress line */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-indigo-600 z-10 transition-all duration-300"
              style={{ height: `${scrollProgress}%` }}
            ></div>

            {sortedPlaces.map((place, index) => {
              const isVisited = place.visited;
              const isActive = activePlace === place.id;

              return (
                <div
                  key={place.id}
                  className={`flex flex-col mb-32 relative z-10 ${
                    index % 2 === 0 ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg
                    ${isVisited ? "bg-indigo-500" : "bg-gray-300"}`}
                  ></div>

                  {isVisited ? (
                    <div
                      className={`w-5/12 ${
                        index % 2 === 0 ? "mr-12" : "ml-12"
                      }`}
                      onMouseEnter={() => setActivePlace(place.id)}
                      onMouseLeave={() => setActivePlace(null)}
                    >
                      <div
                        className={`bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ${
                          isActive ? "transform scale-105 shadow-2xl" : ""
                        }`}
                      >
                        <div className="h-48 bg-indigo-200 flex items-center justify-center">
                          <img
                            src={`https://media.istockphoto.com/id/942152278/photo/gadisar-lake-at-jaisalmer-rajasthan-at-sunrise-with-ancient-temples-and-archaeological-ruins.jpg?s=612x612&w=0&k=20&c=HvhbHZ8HH_lAjAAI2pmqL4mUipyyAwy31qp5jjKQTO0=`}
                            alt={place.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h2 className="text-2xl font-bold text-gray-800">
                              {place.name}
                            </h2>
                            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                              {place.date}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600 mb-4">
                            <Clock size={16} className="mr-1" />
                            <span>{place.duration}</span>
                          </div>

                          <h3 className="font-semibold text-gray-700 mb-2">
                            Highlights:
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {place.highlights.map((highlight, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>

                          {/* <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <div className="flex items-center">
                              <ThumbsUp
                                size={16}
                                className="text-yellow-500 mr-1"
                              />
                              <span className="font-semibold">
                                {place.rating}/5.0
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Camera
                                size={16}
                                className="text-indigo-500 mr-1"
                              />
                              <span>{place.photos} photos</span>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`w-5/12 ${
                        index % 2 === 0 ? "mr-12" : "ml-12"
                      } opacity-70`}
                    >
                      <div className="bg-gray-100 rounded-xl p-6 shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h2 className="text-2xl font-bold text-gray-500">
                            {place.name}
                          </h2>
                          <span className="bg-gray-200 text-gray-500 text-sm font-medium px-3 py-1 rounded-full">
                            Planned
                          </span>
                        </div>
                        <div className="text-gray-400">
                          <p className="mb-2">Duration: {place.duration}</p>
                          <h3 className="font-semibold mb-2">Highlights:</h3>
                          <div className="flex flex-wrap gap-2">
                            {place.highlights.map((highlight, i) => (
                              <span
                                key={i}
                                className="bg-gray-200 text-gray-500 text-sm px-3 py-1 rounded-full"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-indigo-800">
              Travel Progress
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-indigo-50 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-indigo-100 p-4 rounded-full">
                    <Flag className="text-indigo-600 w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-indigo-600 mb-2">
                  {visitedCount}
                  <span className="text-2xl text-gray-500">/{totalPlaces}</span>
                </h3>
                <p className="text-gray-600">Destinations Visited</p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-indigo-100 p-4 rounded-full">
                    <Calendar className="text-indigo-600 w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-indigo-600 mb-2">
                  {totalDays}
                </h3>
                <p className="text-gray-600">Days Exploring</p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-indigo-100 p-4 rounded-full">
                    <Camera className="text-indigo-600 w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-indigo-600 mb-2">
                  {totalPhotos}
                </h3>
                <p className="text-gray-600">Memories Captured</p>
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                Exploration Progress
              </h3>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="relative h-4 bg-gray-200 rounded-full">
                  <div
                    className="absolute h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${(visitedCount / totalPlaces) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-3 text-sm text-gray-600">
                  <span>{visitedCount} completed</span>
                  <span>{totalPlaces - visitedCount} remaining</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center mb-6">
                  <ThumbsUp className="w-6 h-6 mr-3" />
                  <h3 className="text-xl font-semibold">
                    Average Experience Rating
                  </h3>
                </div>
                <div className="text-center">
                  <span className="text-5xl font-bold">{avgRating}</span>
                  <span className="text-xl font-semibold"> / 5.0</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center mb-6">
                  <Globe2Icon className="w-6 h-6 mr-3" />
                  <h3 className="text-xl font-semibold">Next Destination</h3>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold">
                    {sortedPlaces.find((place) => !place.visited)?.name ||
                      "All destinations visited!"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
