"use client";

import React, { useState } from "react";

export default function Form() {
  const [participants, setParticipants] = useState([{ name: "", email: "" }]);
  const [signingType, setSigningType] = useState("regular");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const addParticipant = () => {
    setParticipants([...participants, { name: "", email: "" }]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result); 
      };
      reader.readAsDataURL(file);
    } else {
      setMessage("Please select a valid PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/docusign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants, signingType, file }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Envelope Send successfully!");
      } else {
        setMessage(data.error || "Failed to send envelope");
      }
    } catch (error) {
      console.error('Error details:', error);
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex flex-col justify-between">
      <header className="p-4 bg-white shadow-md text-center">
        <h1 className="text-xl font-bold text-gray-800">Document Signing Portal</h1>
        <p className="text-sm text-gray-500">Effortlessly send and manage your agreements</p>
      </header>

      <main className="flex-grow flex justify-center items-center">
        <form
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Send Agreement for Signature</h2>

          {participants.map((participant, index) => (
            <div key={index} className="flex flex-col gap-2 mb-4">
              <input
                type="text"
                placeholder="Name"
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-100 text-gray-800"
                value={participant.name}
                onChange={(e) =>
                  handleParticipantChange(index, "name", e.target.value)
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-100 text-gray-800"
                value={participant.email}
                onChange={(e) =>
                  handleParticipantChange(index, "email", e.target.value)
                }
                required
              />
            </div>
          ))}
          <button
            type="button"
            className="w-full p-3 bg-gray-700 text-white rounded-md shadow-sm hover:bg-gray-800 mb-4"
            onClick={addParticipant}
          >
            Add Participant
          </button>

          <select
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-gray-800"
            value={signingType}
            onChange={(e) => setSigningType(e.target.value)}
          >
            <option value="regular">Regular Signing</option>
            <option value="notary">Notary Signing</option>
          </select>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-gray-800"
          />

          <button
            type="submit"
            className={`w-full p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>

          {message && <p className="text-sm text-green-600 mt-4 text-center">{message}</p>}
        </form>
      </main>

      <footer className="p-4 bg-white shadow-md text-center">
        <p className="text-sm text-gray-500">&copy; 2025 Document Signing Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}
