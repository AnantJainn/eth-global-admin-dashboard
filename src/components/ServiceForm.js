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
  const [hoveredSection, setHoveredSection] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    const ImageformData = new FormData();
    ImageformData.append("file", formData.image);
    ImageformData.append("upload_preset", "NFT_Marketplace");

    let MediaURL;
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

  // Inline styles object for dark theme and interactive UI/UX
  const styles = {
    container: {
      backgroundColor: "#121212",
      color: "#EEEEEE",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
      maxWidth: "900px",
      margin: "30px auto",
      border: "1px solid #333",
      position: "relative",
      overflow: "hidden",
    },
    blockchainPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background:
        "radial-gradient(circle, rgba(0,255,234,0.05) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
      opacity: 0.5,
    },
    form: {
      position: "relative",
      zIndex: 1,
    },
    formHeader: {
      textAlign: "center",
      marginBottom: "25px",
    },
    blockchainIcon: {
      fontSize: "40px",
      marginBottom: "8px",
      color: "#00ffea",
    },
    h2: {
      color: "#FFFFFF",
      margin: "0 0 8px",
    },
    p: {
      color: "#A9A9A9",
      fontSize: "14px",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    },
    formSection: (isHovered) => ({
      backgroundColor: "#1E1E1E",
      padding: "15px",
      borderRadius: "6px",
      border: "1px solid #333",
      boxShadow: isHovered ? "inset 0 0 10px #00ffea" : "inset 0 0 7px #00ffe7",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      transform: isHovered ? "scale(1.02)" : "scale(1)",
      color: isHovered ? "#FFFFFF" : "#A9A9A9",
    }),
    fullWidth: {
      gridColumn: "1 / -1",
    },
    h3: {
      marginBottom: "15px",
      color: "#00ffea",
      fontWeight: "600",
    },
    inputGroup: {
      marginBottom: "12px",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      marginBottom: "6px",
      fontSize: "14px",
      color: "#80fff7",
    },
    input: (isFocused) => ({
      backgroundColor: "#262626",
      border: `1.5px solid ${isFocused ? "#00ffc8" : "#555"}`,
      borderRadius: "5px",
      padding: "10px",
      color: isFocused ? "#FFFFFF" : "#E0E0E0",
      fontSize: "14px",
      outline: "none",
      transition:
        "border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
      boxShadow: isFocused ? "0 0 8px #00ffd7" : "none",
    }),
    textarea: (isFocused) => ({
      backgroundColor: "#262626",
      border: `1.5px solid ${isFocused ? "#00ffc8" : "#555"}`,
      borderRadius: "5px",
      padding: "10px",
      color: isFocused ? "#FFFFFF" : "#E0E0E0",
      fontSize: "14px",
      resize: "vertical",
      outline: "none",
      transition:
        "border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
      boxShadow: isFocused ? "0 0 8px #00ffd7" : "none",
      minHeight: "80px",
    }),
    checkboxGroup: {
      marginTop: "12px",
      display: "flex",
      alignItems: "center",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: "#80fff7",
      fontSize: "14px",
    },
    checkmark: (isChecked) => ({
      height: "18px",
      width: "18px",
      backgroundColor: isChecked ? "#00ffea" : "#262626",
      borderRadius: "3px",
      border: `1.5px solid ${isChecked ? "#00ffea" : "#555"}`,
      marginRight: "10px",
      display: "inline-block",
      position: "relative",
      transition: "background-color 0.3s ease, border-color 0.3s ease",
    }),
    checkmarkAfter: (isChecked) => ({
      content: '""',
      position: "absolute",
      display: isChecked ? "block" : "none",
      left: "6px",
      top: "2px",
      width: "5px",
      height: "10px",
      border: "solid #121212",
      borderWidth: "0 2px 2px 0",
      transform: "rotate(45deg)",
    }),
    formActions: {
      display: "flex",
      justifyContent: "center",
      marginTop: "25px",
    },
    submitBtn: (isDisabled, isHovered) => ({
      backgroundColor: isDisabled
        ? "#555555"
        : isHovered
        ? "#00d1b8"
        : "#00c9a7",
      border: "none",
      padding: "12px 25px",
      fontWeight: "700",
      fontSize: "16px",
      borderRadius: "6px",
      color: "#121212",
      cursor: isDisabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "background-color 0.3s ease, transform 0.3s ease",
      transform: isHovered && !isDisabled ? "scale(1.05)" : "scale(1)",
    }),
    spinner: {
      border: "3px solid #ccc",
      borderTop: "3px solid #00d1b8",
      borderRadius: "50%",
      width: "18px",
      height: "18px",
      animation: "spin 1s linear infinite",
    },
    imageUploadContainer: {
      marginBottom: "15px",
    },
    imageUploadLabel: (isHovered) => ({
      display: "block",
      border: `2px dashed ${isHovered ? "#00ffc3" : "#555"}`,
      padding: "15px",
      borderRadius: "8px",
      textAlign: "center",
      cursor: "pointer",
      color: isHovered ? "#00ffea" : "#888",
      transition: "border-color 0.3s ease, color 0.3s ease",
      minHeight: "140px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "12px",
    }),
    imagePreview: {
      maxWidth: "100%",
      maxHeight: "140px",
      borderRadius: "8px",
      objectFit: "cover",
    },
    uploadPlaceholder: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
    },
    uploadIcon: {
      fontSize: "40px",
      color: "#00d1b8",
    },
    uploadText: {
      fontSize: "14px",
    },
    btnIcon: {
      fontSize: "18px",
    },
    // Keyframes for spinner (embedded as a style tag in the component)
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

        <div style={styles.formGrid}>
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
                <div>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                  ) : (
                    <div style={styles.uploadPlaceholder}>
                      <div style={styles.uploadIcon}>📷</div>
                      <span style={styles.uploadText}>
                        Click to upload project image
                      </span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div
            style={styles.formSection(hoveredSection === "basic")}
            onMouseEnter={() => setHoveredSection("basic")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h3 style={styles.h3}>📋 Basic Information</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Green Valley Solar Farm"
                required
                style={styles.input(focusedInput === "title")}
                onFocus={() => setFocusedInput("title")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Brief description of the project"
                style={styles.input(focusedInput === "subtitle")}
                onFocus={() => setFocusedInput("subtitle")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Generation Capacity</label>
              <input
                type="text"
                name="generation"
                value={formData.generation}
                onChange={handleChange}
                placeholder="e.g., 50 MW"
                style={styles.input(focusedInput === "generation")}
                onFocus={() => setFocusedInput("generation")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>

          {/* Financial Information */}
          <div
            style={styles.formSection(hoveredSection === "financial")}
            onMouseEnter={() => setHoveredSection("financial")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h3 style={styles.h3}>💰 Financial Details</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Price per kW (₹)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 45000"
                style={styles.input(focusedInput === "price")}
                onFocus={() => setFocusedInput("price")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Plant Size (kW)</label>
              <input
                type="number"
                name="plantSize"
                value={formData.plantSize}
                onChange={handleChange}
                placeholder="e.g., 50000"
                style={styles.input(focusedInput === "plantSize")}
                onFocus={() => setFocusedInput("plantSize")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Tariff Rate (₹/kWh)</label>
              <input
                type="number"
                step="0.1"
                name="tarrif"
                value={formData.tarrif}
                onChange={handleChange}
                placeholder="e.g., 4.5"
                style={styles.input(focusedInput === "tarrif")}
                onFocus={() => setFocusedInput("tarrif")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div
            style={styles.formSection(hoveredSection === "technical")}
            onMouseEnter={() => setHoveredSection("technical")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h3 style={styles.h3}>⚙️ Technical Specs</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Solar Modules</label>
              <input
                type="text"
                name="modules"
                value={formData.modules}
                onChange={handleChange}
                placeholder="e.g., Mono PERC 450W"
                style={styles.input(focusedInput === "modules")}
                onFocus={() => setFocusedInput("modules")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Inverter Technology</label>
              <input
                type="text"
                name="inverter"
                value={formData.inverter}
                onChange={handleChange}
                placeholder="e.g., String Inverters 50kW"
                style={styles.input(focusedInput === "inverter")}
                onFocus={() => setFocusedInput("inverter")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>

          {/* Blockchain Information */}
          <div
            style={styles.formSection(hoveredSection === "blockchain")}
            onMouseEnter={() => setHoveredSection("blockchain")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h3 style={styles.h3}>🔗 Blockchain Details</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Total NFTs Available</label>
              <input
                type="number"
                name="totalNFTs"
                value={formData.totalNFTs}
                onChange={handleChange}
                placeholder="e.g., 10000"
                style={styles.input(focusedInput === "totalNFTs")}
                onFocus={() => setFocusedInput("totalNFTs")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Smart Contract Address</label>
              <input
                type="text"
                name="contractAddress"
                value={formData.contractAddress}
                onChange={handleChange}
                placeholder="0x..."
                pattern="0x[a-fA-F0-9]{40}"
                style={styles.input(focusedInput === "contractAddress")}
                onFocus={() => setFocusedInput("contractAddress")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <span style={styles.checkmark(formData.isAvailable)}>
                  <span
                    style={styles.checkmarkAfter(formData.isAvailable)}
                  ></span>
                </span>
                Project Available for Investment
              </label>
            </div>
          </div>

          {/* Descriptions */}
          <div
            style={{
              ...styles.formSection(hoveredSection === "details"),
              ...styles.fullWidth,
            }}
            onMouseEnter={() => setHoveredSection("details")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h3 style={styles.h3}>📄 Project Details</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Project Overview</label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Provide a comprehensive overview of the solar project..."
                style={styles.textarea(focusedInput === "overview")}
                onFocus={() => setFocusedInput("overview")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Performance & Returns Analysis</label>
              <textarea
                name="performanceReturns"
                value={formData.performanceReturns}
                onChange={handleChange}
                placeholder="Detail the expected performance metrics and financial returns..."
                style={styles.textarea(focusedInput === "performanceReturns")}
                onFocus={() => setFocusedInput("performanceReturns")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div style={styles.spinner}></div>
                Deploying to Blockchain...
              </>
            ) : (
              <>
                <span style={styles.btnIcon}>🚀</span>
                Deploy Solar Project
              </>
            )}
          </button>
        </div>
      </form>

      {/* Embedded keyframes for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default ServiceForm;
