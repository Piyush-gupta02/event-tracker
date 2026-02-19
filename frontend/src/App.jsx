import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const eventsRes = await axios.get("https://event-tracker-backend-6ab7.onrender.com/events");

    const statsRes = await axios.get("https://event-tracker-backend-6ab7.onrender.com/stats");

    setEvents(eventsRes.data);
    setStats(statsRes.data);
  };

  return (
    <div
    style={{
    padding: "40px",
    fontFamily: "Arial",
    backgroundColor: "#1e1e2f",
    minHeight: "100vh",
    color: "white",
  }}>
      <h1>Event Analytics Dashboard</h1>

      <h2>Stats</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={cardStyle}>Total: {stats.total_events}</div>
        <div style={cardStyle}>Upcoming: {stats.upcoming}</div>
        <div style={cardStyle}>Expired: {stats.expired}</div>
      </div>

      <h2 style={{ marginTop: "30px" }}>Events</h2>

      <table
  border="1"
  cellPadding="10"
  style={{
    width: "100%",
    backgroundColor: "#2a2a40",
    borderColor: "#444",
  }}
>

        <thead>
          <tr>
            <th>Event Name</th>
            <th>City</th>
            <th>Status</th>
            <th>URL</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{event["Event Name"]}</td>
              <td>{event.City}</td>
              <td>{event.Status}</td>
              <td>
                <a href={event.URL} target="_blank">
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle = {
  padding: "25px",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  borderRadius: "12px",
  color: "white",
  fontWeight: "bold",
  fontSize: "18px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  minWidth: "150px",
  textAlign: "center",
};


export default App;
