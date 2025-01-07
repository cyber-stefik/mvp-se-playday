import React, { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from '../lib/firebase'; // Update with your Firebase config file path
import { auth } from '../lib/firebase';
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs

function MyFields() {
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [fieldData, setFieldData] = useState({
    fieldName: "",
    location: "",
    price: "",
    description: "",
  });
//   const { user } = auth.currentUser;

//   console.log(user);

  const handleAddField = () => setShowAddFieldModal(true);
  const handleCloseModal = () => {
    setShowAddFieldModal(false);
    setFieldData({ fieldName: "", location: "", price: "", description: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldData({ ...fieldData, [e.target.name]: e.target.value });
  };

  const handleSaveField = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fieldData.fieldName || !fieldData.location || !fieldData.price) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Generate a unique ID for the new field
      const uniqueID = uuidv4();

      // Add the new field to Firestore
      await setDoc(doc(collection(firestore, "fields"), uniqueID), {
        ...fieldData,
        id: uniqueID, // Store the unique ID with the field data
        // createdBy: user?.uid, // Store the ID of the user who added the field
        createdAt: new Date(),
      });

      alert("Field added successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error adding field: ", error);
      alert("Failed to add the field. Please try again.");
    }
  };

  const buttonClass =
    "px-8 py-3 bg-[#065C64] text-white text-lg font-medium rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105";

  const sidebarButtonClass =
    "px-4 py-2 text-lg text-[#065C64] font-medium rounded-md transition-all duration-300 hover:border hover:border-[#065C64]";

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", backgroundColor: "#f4f4f4", display: "flex", flexDirection: "column", padding: "20px" }}>
        <div style={{ marginBottom: "10%", textAlign: "center" }}>
          <img
            src="https://via.placeholder.com/100"
            alt="Logo"
            style={{ marginTop: "auto", borderRadius: "80%", display: "block", margin: "0 auto" }}
          />
          <h3 style={{
            margin: "10px 0",
            fontSize: "20px",
            fontWeight: "bold",
            paddingTop: "20px"
           }}>Name</h3>
        </div>

        {/* Buttons */}
        <div style={{ marginBottom: "10px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "10px 0" }} />
          <button className={sidebarButtonClass}>Profile Data</button>
          <button className={sidebarButtonClass}>My Fields</button>
          <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "10px 0" }} />
        </div>

        {/* Sign Out Button */}
        <button
          style={{
            marginTop: "auto",
            marginBottom: "40%",
            padding: "10px",
            border: "2px solid #e74c3c",
            backgroundColor: "#fff",
            color: "#e74c3c",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search"
            style={{
              padding: "10px",
              width: "19%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button className={buttonClass}>Filter1</button>
            <button className={buttonClass}>Filter2</button>
            <button className={buttonClass}>Filter3</button>
          </div>
          <button onClick={handleAddField} className={buttonClass}>
            Add Field
          </button>
        </div>

        {/* Field Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Example Card */}
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                height: "150px",
                backgroundColor: "#e4e4e4",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span>Field Image</span>
            </div>
            <div style={{ padding: "10px" }}>
              <p>
                <strong>Location:</strong> Example Location
              </p>
              <p>
                <strong>Price:</strong> $100/hour
              </p>
              <p>
                <strong>Calendar:</strong> Available
              </p>
              <button
                className={buttonClass}
                style={{ marginTop: "10px", marginLeft: "60%", marginRight: "a", backgroundColor: "#e74c3c" }}
              >
                Cancel
              </button>
            </div>
          </div>
          {/* Repeat Field Cards */}
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "50%",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 20px",
                borderBottom: "1px solid #ccc",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>Add New Field</h3>
              <button
                onClick={handleCloseModal}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
            <form onSubmit={handleSaveField} style={{ padding: "20px", flex: 1 }}>
              {/* Field Name */}
              <div style={{ marginBottom: "20px" }}>
                <label>Field Name:</label>
                <input
                  type="text"
                  name="fieldName"
                  value={fieldData.fieldName}
                  onChange={handleInputChange}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              </div>

              {/* Location */}
              <div style={{ marginBottom: "20px" }}>
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={fieldData.location}
                  onChange={handleInputChange}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              </div>

              {/* Price */}
              <div style={{ marginBottom: "20px" }}>
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={fieldData.price}
                  onChange={handleInputChange}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: "20px" }}>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={fieldData.description}
                  onChange={handleInputChange}
                  rows={5}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                    color: "#000",
                    borderRadius: "5px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                    color: "#000",
                    borderRadius: "5px",
                  }}
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyFields;
