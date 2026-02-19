import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const eventsRes = await axios.get(
        "https://event-tracker-backend-6ab7.onrender.com/events"
      );

      const statsRes = await axios.get(
        "https://event-tracker-backend-6ab7.onrender.com/stats"
      );

      setEvents(eventsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
  <h1 style={{ margin: 0 }}>Event Analytics Dashboard</h1>
  <span style={subTextStyle}>
    Live Jaipur Events • Auto Updated
  </span>
</div>


      <h2>Stats</h2>

      <div style={statsContainer}>
        <div
          style={cardStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-6px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0px)")
          }
        >
          Total: {stats.total_events}
        </div>

        <div
          style={cardStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-6px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0px)")
          }
        >
          Upcoming: {stats.upcoming}
        </div>

        <div
          style={cardStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-6px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0px)")
          }
        >
          Expired: {stats.expired}
        </div>
      </div>

      <h2 style={{ marginTop: "40px" }}>Events</h2>

      <div style={{ width: "100%",overflowX: "auto" }}>

        <table style={tableStyle}>
          <thead style={tableHeadStyle}>
  <tr>
    <th style={{ width: "70%" }}>Event Name</th>
    <th style={{ width: "10%", textAlign: "center" }}>City</th>
    <th style={{ width: "12%", textAlign: "center" }}>Status</th>
    <th style={{ width: "8%", textAlign: "center" }}>URL</th>
  </tr>
</thead>


          <tbody>
            {events.map((event, index) => (
              <tr
                key={index}
                style={rowStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#32324a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "")
                }
              >
                <td style={{ padding: "14px 10px" }}>
  {event["Event Name"]}
</td>

                <td style={{ padding: "14px 10px", textAlign: "center" }}>
  {event.City}
</td>


                <td style={{ padding: "14px 10px", textAlign: "center" }}>

                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      backgroundColor:
                        event.Status === "Upcoming"
                          ? "#22c55e"
                          : "#ef4444",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    {event.Status}
                  </span>
                </td>

                <td style={{ padding: "14px 10px", textAlign: "center" }}>

                  <a
                    href={event.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


const containerStyle = {
  padding: "40px",
  fontFamily: "Arial",
  backgroundColor: "#1e1e2f",
  minHeight: "100vh",
  color: "white",
  width: "100%",
  boxSizing: "border-box",
};



const statsContainer = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
};

const cardStyle = {
  padding: "20px",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "18px",
  color: "white",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  minWidth: "180px",
  textAlign: "center",
};

const tableStyle = {
  width: "100%",
  tableLayout: "fixed",
  backgroundColor: "#2a2a40",
  borderCollapse: "collapse",
  minWidth: "900px",
  fontSize: "14px",

};


const tableHeadStyle = {
  backgroundColor: "#111827",
};

const rowStyle = {
  transition: "0.2s",
};

const linkStyle = {
  color: "#7aa2ff",
  textDecoration: "none",
  fontWeight: "bold",
};

const loadingStyle = {
  backgroundColor: "#1e1e2f",
  color: "white",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial",
};
const headerStyle = {
  marginBottom: "40px",
  paddingBottom: "20px",
  borderBottom: "1px solid #333",
};

const subTextStyle = {
  fontSize: "14px",
  color: "#aaa",
};

export default App;
