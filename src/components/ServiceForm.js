import React, { useState } from "react";
import "./App.css";
import axios from "axios";
function ServiceForm({ addService }) {
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    subtitle: "",
    generation: "",
    price: "",
    plantSize: "",
    tarrif: "",
    overview: "",
    modules: "",
    inverter: "",
    performanceReturns: "",
    totalNFTs: "",
    isAvailable: true,
    contractAddress: "",
  });

  const handleChange = async(e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
        let  MediaURL;
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

        const ImageformData = new FormData();
        ImageformData.append("file",formData.image);
        ImageformData.append("upload_preset", "NFT_Marketplace");
        console.log(ImageformData);

      try {
        const res = await axios.post(`https://api.cloudinary.com/v1_1/dbvezos5j/image/upload`,ImageformData);
        MediaURL = res.data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
      }

const AformData = new FormData();
  AformData.append("image", MediaURL); // file input
  AformData.append("title", formData.title);
  AformData.append("subtitle", formData.subtitle);
  AformData.append("generation", formData.generation);
  AformData.append("price", formData.price);
  AformData.append("plantSize", formData.plantSize);
  AformData.append("tarrif", formData.tarrif);
  AformData.append("overview", formData.overview);
  AformData.append("modules", formData.modules);
  AformData.append("inverter", formData.inverter);
  AformData.append("performanceReturns", formData.performanceReturns);
  AformData.append("totalNFTs", formData.totalNFTs);
  AformData.append("isAvailable", formData.isAvailable);
  AformData.append("contractAddress", formData.contractAddress);

  try {
    const res = await fetch("http://localhost:5000/api/v1/admin/add-service", {
      method: "POST",
      body: AformData,
    });

    const data = await res.json();
    console.log("✅ Service saved:", data);
  } catch (err) {
    console.error("❌ Error saving service:", err);
  }
  };

  return (
    <form className="service-form" onSubmit={handleSubmit}>
      <h2>Add New Project</h2>

      <label>Project Image</label>
      <input type="file" name="image" onChange={handleChange} />

      <label>Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} />

      <label>Subtitle</label>
      <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} />

      <label>Generation</label>
      <input type="text" name="generation" value={formData.generation} onChange={handleChange} />

      <label>Price</label>
      <input type="text" name="price" value={formData.price} onChange={handleChange} />

      <label>Plant Size</label>
      <input type="text" name="plantSize" value={formData.plantSize} onChange={handleChange} />

      <label>Tariff (₹/kWh)</label>
      <input type="number" step="0.1" name="tarrif" value={formData.tarrif} onChange={handleChange} />

      <label>Overview</label>
      <textarea name="overview" value={formData.overview} onChange={handleChange} />

      <label>Technology - Modules</label>
      <input type="text" name="modules" value={formData.modules} onChange={handleChange} />

      <label>Technology - Inverter</label>
      <input type="text" name="inverter" value={formData.inverter} onChange={handleChange} />

      <label>Performance & Returns</label>
      <textarea
        name="performanceReturns"
        value={formData.performanceReturns}
        onChange={handleChange}
      />

      <label>Total NFTs</label>
      <input type="number" name="totalNFTs" value={formData.totalNFTs} onChange={handleChange} />

      <label>
        <input
          type="checkbox"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
        />
        Available
      </label>

      <label>Contract Address</label>
      <input
        type="text"
        name="contractAddress"
        value={formData.contractAddress}
        onChange={handleChange}
      />

      <button type="submit">Save Project</button>
    </form>
  );
}

export default ServiceForm;
