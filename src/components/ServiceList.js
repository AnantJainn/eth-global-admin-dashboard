import React from "react";
import "./App.css";

function ServiceList({ services }) {
  return (
    <div className="service-list">
      {services.map((service) => (
        <div key={service.id} className="service-card">
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          {service.file && (
            <img src={service.file} alt={service.title} className="service-img" />
          )}
        </div>
      ))}
    </div>
  );
}

export default ServiceList;
