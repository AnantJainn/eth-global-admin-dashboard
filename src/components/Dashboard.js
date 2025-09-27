import React, { useState } from "react";
import ServiceForm from "./ServiceForm";
import ServiceList from "./ServiceList";
import "./App.css";

function Dashboard() {
  const [services, setServices] = useState(
    JSON.parse(localStorage.getItem("services")) || []
  );

  const addService = (service) => {
    const updatedServices = [...services, service];
    setServices(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>⚙️ Admin Dashboard</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("services");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </header>
      <main className="dashboard-content">
        <div className="form-section">
          <ServiceForm addService={addService} />
        </div>
        <div className="list-section">
          <ServiceList services={services} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
