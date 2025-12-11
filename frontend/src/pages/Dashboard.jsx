import React, { useState, useEffect } from "react";
import { api, setAuthToken } from "../api/client";
import { useSelector } from "react-redux";
import "./dashboard.css"; // ← CSS moved here

export default function Dashboard() {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [tab, setTab] = useState(0);
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/company/profile");
      setCompany(res?.data?.data || null);
    } catch (err) {
      setError("Failed to load company profile");
    }
  };

  useEffect(() => {
    setAuthToken(token);
    fetchProfile();
  }, [token]);

  return (
    <div className="dashboard-container">

      {/* TOP HEADER */}
      <div className="top-header">
        <img src="/logo.jpg" alt="Logo" className="logo-img" />

        <div className="progress-box">
          <p className="progress-label">Setup Progress</p>
          <p className="progress-value">0% Completed</p>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button className={tab === 0 ? "tab active" : "tab"} onClick={() => setTab(0)}>Company Info</button>
        <button className={tab === 1 ? "tab active" : "tab"} onClick={() => setTab(1)}>Founding Info</button>
        <button className={tab === 2 ? "tab active" : "tab"} onClick={() => setTab(2)}>Social Media Profile</button>
        <button className={tab === 3 ? "tab active" : "tab"} onClick={() => setTab(3)}>Contact</button>
      </div>

      {/* ERROR MESSAGE */}
      {error && <div className="error-box">{error}</div>}

      <p className="welcome-text">Welcome, {user?.email}</p>

      {/* TAB CONTENTS */}

      {/* COMPANY INFO */}
      {tab === 0 && (
        <div>
          <h3>Logo & Banner Image</h3>

          <div className="upload-row">
            <div className="upload-box">
              <p className="upload-title">Upload Logo</p>
              <label className="upload-btn">
                Browse Photo
                <input type="file" hidden />
              </label>
              <p className="upload-note">A photo larger than 400px works best. Max size 5 MB.</p>
            </div>

            <div className="upload-box">
              <p className="upload-title">Banner Image</p>
              <label className="upload-btn">
                Browse Photo
                <input type="file" hidden />
              </label>
              <p className="upload-note">Optimal size 1520×400. JPG/PNG only. Max size 5 MB.</p>
            </div>
          </div>

          <input className="input-field" placeholder="Company Name" />
          <textarea className="textarea-field" placeholder="About Us"></textarea>
        </div>
      )}

      {/* FOUNDING INFO */}
      {tab === 1 && (
        <div>
          <h3>Founding Information</h3>
          <input className="input-field" placeholder="Founded Year" />
          <input className="input-field" placeholder="Founder Name" />
          <input className="input-field" placeholder="Company Size" />
        </div>
      )}

      {/* SOCIAL MEDIA */}
      {tab === 2 && (
        <div>
          <h3>Social Media Profiles</h3>
          <input className="input-field" placeholder="LinkedIn URL" />
          <input className="input-field" placeholder="Twitter URL" />
          <input className="input-field" placeholder="Website" />
        </div>
      )}

      {/* CONTACT INFO */}
      {tab === 3 && (
        <div>
          <h3>Contact Information</h3>
          <input className="input-field" placeholder="Email" />
          <input className="input-field" placeholder="Phone Number" />
          <input className="input-field" placeholder="Address" />
        </div>
      )}
    </div>
  );
}
