"use client";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    // Load Google Maps API script
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key={API_KEY_HERE}&libraries=places`;
    googleMapScript.async = true;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", () => {
      // When the script is loaded
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setUserLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => {
            console.error(err);
          }
        );
      }
    });

    return () => {
      window.document.body.removeChild(googleMapScript);
    };
  }, []);

  useEffect(() => {
    if (userLocation) {
      const mapOptions = {
        center: userLocation,
        zoom: 12,
        mapTypeId: "terrain",
      };
      const mapElement = document.getElementById("map");

      if (mapElement) {
        const mapInstance = new window.google.maps.Map(mapElement, mapOptions);

        const marker = new window.google.maps.Marker({
          position: userLocation,
          map: mapInstance,
          title: "I am here",
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: "I am here",
        });

        marker.addListener("click", () => {
          infowindow.open(mapInstance, marker);
        });

        setMap(mapInstance);
      }
    }
  }, [userLocation]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchValue }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const { location } = results[0].geometry;
          setUserLocation({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          // Handle no results found or other errors
          console.error(
            "Geocode was not successful for the following reason:",
            status
          );
        }
      });
    } catch (error) {
      console.error("Error occurred during geocoding:", error);
    }
  };

  return (
    <main className="w-full h-screen flex justify-center items-center bg-[#0E1527]">
      <div className="w-3/5 h-4/5 bg-[#F2F4F8] p-3 rounded-xl">
        <div>
          <form onSubmit={handleSearch}>
            <div className="flex items-center w-2/5 mx-auto my-5">
              <input
                type="text"
                placeholder="Search Location..."
                className="border border-gray-500 border-r-0 w-full rounded-tl-xl rounded-bl-xl p-2 text-black"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                type="submit"
                className="px-5 py-2 border border-l-0 border-gray-500 text-black bg-gray-300 rounded-tr-xl rounded-br-xl"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        <div className="w-full h-full text-black">
          <div id="map" style={{ width: "100%", height: "500px" }}></div>
        </div>
      </div>
    </main>
  );
};

export default Home;
