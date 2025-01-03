"use client";
import { useEffect, useState } from "react";
import "./page.css";

export default function Home() {
  const [occupancyData, setOccupancyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOccupancyData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/rooms");
      if (!response.ok) {
        throw new Error("Failed to fetch room occupancy data");
      }
      const data = await response.json();

      // Sort rooms lexicographically by room number
      const sortedData = data.sort((a, b) =>
        a.room_no.localeCompare(b.room_no, undefined, { numeric: true })
      );
      console.log(sortedData);
      setOccupancyData(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the data initially
    fetchOccupancyData();

    // Set an interval to refresh data every 60 seconds (1 minute)
    const intervalId = setInterval(() => {
      fetchOccupancyData();
    }, 60000); // 60000 ms = 1 minute

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="dashboard">
      {/* Display error message */}
      {error && <p className="error">Error: {error}</p>}

      {/* Show loading indicator */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="room-grid">
          {occupancyData.map((room) => (
            <div
              key={room.id}
              className={`room ${room.status ? "occupied" : "available"}`}
            >
              <div className="room-number">{room.room_no}</div>
              <div className="room-name">
                {room.Crew && room.Crew.crewname ? `${room.Crew.crewname}` : "Available"}
              </div>
              <div className="room-name">
                {room.Crew && room.Crew.hq ? `(${room.Crew.hq})` : "N/A"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
