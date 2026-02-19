import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const eventsRes = await axios.get("http://127.0.0.1:8000/events");
    const statsRes = await axios.get("http://127.0.0.1:8000/stats");

    setEvents(eventsRes.data);
    setStats(statsRes.data);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Event Analytics Dashboard</h1>

      <h2>Stats</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={cardStyle}>Total: {stats.total_events}</div>
        <div style={cardStyle}>Upcoming: {stats.upcoming}</div>
        <div style={cardStyle}>Expired: {stats.expired}</div>
      </div>

      <h2 style={{ marginTop: "30px" }}>Events</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
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
  padding: "20px",
  background: "#f2f2f2",
  borderRadius: "10px",
  fontWeight: "bold",
};

export default App;
