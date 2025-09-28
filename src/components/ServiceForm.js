// import React, { useState } from "react";
// import "./App.css";
// import axios from "axios";
// function ServiceForm({ addService }) {
//   const [formData, setFormData] = useState({
//     image: null,
//     title: "",
//     subtitle: "",
//     generation: "",
//     price: "",
//     plantSize: "",
//     tarrif: "",
//     overview: "",
//     modules: "",
//     inverter: "",
//     performanceReturns: "",
//     totalNFTs: "",
//     isAvailable: true,
//     contractAddress: "",
//   });

//   const handleChange = async(e) => {
//     const { name, value, type, checked, files } = e.target;

//     if (type === "file") {
//       setFormData({ ...formData, [name]: files[0] });
//     } else if (type === "checkbox") {
//       setFormData({ ...formData, [name]: checked });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };
//         let  MediaURL;
//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     console.log("Submitting form data:", formData);

//         const ImageformData = new FormData();
//         ImageformData.append("file",formData.image);
//         ImageformData.append("upload_preset", "NFT_Marketplace");
//         console.log(ImageformData);

//       try {
//         const res = await axios.post(`https://api.cloudinary.com/v1_1/dbvezos5j/image/upload`,ImageformData);
//         MediaURL = res.data.secure_url;
//       } catch (error) {
//         console.error("Error uploading image:", error);
//       }

// const AformData = new FormData();
//   AformData.append("image", MediaURL); // file input
//   AformData.append("title", formData.title);
//   AformData.append("subtitle", formData.subtitle);
//   AformData.append("generation", formData.generation);
//   AformData.append("price", formData.price);
//   AformData.append("plantSize", formData.plantSize);
//   AformData.append("tarrif", formData.tarrif);
//   AformData.append("overview", formData.overview);
//   AformData.append("modules", formData.modules);
//   AformData.append("inverter", formData.inverter);
//   AformData.append("performanceReturns", formData.performanceReturns);
//   AformData.append("totalNFTs", formData.totalNFTs);
//   AformData.append("isAvailable", formData.isAvailable);
//   AformData.append("contractAddress", formData.contractAddress);

//   try {
//     const res = await fetch("http://localhost:5000/api/v1/admin/add-service", {
//       method: "POST",
//       body: AformData,
//     });

//     const data = await res.json();
//     console.log("✅ Service saved:", data);
//   } catch (err) {
//     console.error("❌ Error saving service:", err);
//   }
//   };

//   return (
//     <form className="service-form" onSubmit={handleSubmit}>
//       <h2>Add New Project</h2>

//       <label>Project Image</label>
//       <input type="file" name="image" onChange={handleChange} />

//       <label>Title</label>
//       <input type="text" name="title" value={formData.title} onChange={handleChange} />

//       <label>Subtitle</label>
//       <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} />

//       <label>Generation</label>
//       <input type="text" name="generation" value={formData.generation} onChange={handleChange} />

//       <label>Price</label>
//       <input type="text" name="price" value={formData.price} onChange={handleChange} />

//       <label>Plant Size</label>
//       <input type="text" name="plantSize" value={formData.plantSize} onChange={handleChange} />

//       <label>Tariff (₹/kWh)</label>
//       <input type="number" step="0.1" name="tarrif" value={formData.tarrif} onChange={handleChange} />

//       <label>Overview</label>
//       <textarea name="overview" value={formData.overview} onChange={handleChange} />

//       <label>Technology - Modules</label>
//       <input type="text" name="modules" value={formData.modules} onChange={handleChange} />

//       <label>Technology - Inverter</label>
//       <input type="text" name="inverter" value={formData.inverter} onChange={handleChange} />

//       <label>Performance & Returns</label>
//       <textarea
//         name="performanceReturns"
//         value={formData.performanceReturns}
//         onChange={handleChange}
//       />

//       <label>Total NFTs</label>
//       <input type="number" name="totalNFTs" value={formData.totalNFTs} onChange={handleChange} />

//       <label>
//         <input
//           type="checkbox"
//           name="isAvailable"
//           checked={formData.isAvailable}
//           onChange={handleChange}
//         />
//         Available
//       </label>

//       <label>Contract Address</label>
//       <input
//         type="text"
//         name="contractAddress"
//         value={formData.contractAddress}
//         onChange={handleChange}
//       />

//       <button type="submit">Save Project</button>
//     </form>
//   );
// }

// export default ServiceForm;

import React, { useState } from "react";
// import "./ServiceForm.css";
// ServiceForm.js
import "./ServiceForm.dark.css";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      // Create image preview
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(files[0]);
      }
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  let MediaURL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    const ImageformData = new FormData();
    ImageformData.append("file", formData.image);
    ImageformData.append("upload_preset", "NFT_Marketplace");
    console.log(ImageformData);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dbvezos5j/image/upload`,
        ImageformData
      );
      MediaURL = res.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsSubmitting(false);
      return;
    }

    const AformData = new FormData();
    AformData.append("image", MediaURL);
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
      const res = await fetch(
        "https://ethglobal.azurewebsites.net/api/v1/admin/add-service",
        {
          method: "POST",
          body: AformData,
        }
      );

      const data = await res.json();
      console.log("✅ Service saved:", data);

      // Reset form after successful submission
      setFormData({
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
      setImagePreview(null);
    } catch (err) {
      console.error("❌ Error saving service:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="service-form-container">
      <div className="blockchain-pattern"></div>

      <form className="service-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="blockchain-icon">⚡</div>
          <h2>Add New Solar Project</h2>
          <p>Deploy your renewable energy asset to the blockchain</p>
        </div>

        <div className="form-grid">
          {/* Image Upload Section */}
          <div className="form-section full-width">
            <h3>📸 Project Media</h3>
            <div className="image-upload-container">
              <label className="image-upload-label">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <div className="image-upload-area">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">📷</div>
                      <span>Click to upload project image</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <h3>📋 Basic Information</h3>
            <div className="input-group">
              <label>Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Green Valley Solar Farm"
                required
              />
            </div>

            <div className="input-group">
              <label>Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Brief description of the project"
              />
            </div>

            <div className="input-group">
              <label>Generation Capacity</label>
              <input
                type="text"
                name="generation"
                value={formData.generation}
                onChange={handleChange}
                placeholder="e.g., 50 MW"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="form-section">
            <h3>💰 Financial Details</h3>
            <div className="input-group">
              <label>Price per kW (₹)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 45000"
              />
            </div>

            <div className="input-group">
              <label>Plant Size (kW)</label>
              <input
                type="number"
                name="plantSize"
                value={formData.plantSize}
                onChange={handleChange}
                placeholder="e.g., 50000"
              />
            </div>

            <div className="input-group">
              <label>Tariff Rate (₹/kWh)</label>
              <input
                type="number"
                step="0.1"
                name="tarrif"
                value={formData.tarrif}
                onChange={handleChange}
                placeholder="e.g., 4.5"
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="form-section">
            <h3>⚙️ Technical Specs</h3>
            <div className="input-group">
              <label>Solar Modules</label>
              <input
                type="text"
                name="modules"
                value={formData.modules}
                onChange={handleChange}
                placeholder="e.g., Mono PERC 450W"
              />
            </div>

            <div className="input-group">
              <label>Inverter Technology</label>
              <input
                type="text"
                name="inverter"
                value={formData.inverter}
                onChange={handleChange}
                placeholder="e.g., String Inverters 50kW"
              />
            </div>
          </div>

          {/* Blockchain Information */}
          <div className="form-section">
            <h3>🔗 Blockchain Details</h3>
            <div className="input-group">
              <label>Total NFTs Available</label>
              <input
                type="number"
                name="totalNFTs"
                value={formData.totalNFTs}
                onChange={handleChange}
                placeholder="e.g., 10000"
              />
            </div>

            <div className="input-group">
              <label>Smart Contract Address</label>
              <input
                type="text"
                name="contractAddress"
                value={formData.contractAddress}
                onChange={handleChange}
                placeholder="0x..."
                pattern="0x[a-fA-F0-9]{40}"
              />
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Project Available for Investment
              </label>
            </div>
          </div>

          {/* Descriptions */}
          <div className="form-section full-width">
            <h3>📄 Project Details</h3>
            <div className="input-group">
              <label>Project Overview</label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Provide a comprehensive overview of the solar project..."
                rows="4"
              />
            </div>

            <div className="input-group">
              <label>Performance & Returns Analysis</label>
              <textarea
                name="performanceReturns"
                value={formData.performanceReturns}
                onChange={handleChange}
                placeholder="Detail the expected performance metrics and financial returns..."
                rows="4"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Deploying to Blockchain...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Deploy Solar Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ServiceForm;
