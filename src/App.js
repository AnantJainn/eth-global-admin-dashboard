import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ServiceForm from "./components/ServiceForm";
import DeployContract from "./DeployContract";
import "./App.css";

function Home() {
  return <h1>Welcome Home</h1>;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-service" element={<ServiceForm />} />
        <Route path="/deploy-contract" element={<DeployContract />} />
      </Routes>
    </Router>
  );
}

export default App;
