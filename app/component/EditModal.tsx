"use client";

import { FC, useState } from "react";
import { Report } from "../interfaces/Reports";

interface EditModalProps {
  report: Report;
  onClose: () => void;
  onUpdate: (updated: Report) => void;
}

const EditModal: FC<EditModalProps> = ({ report, onClose, onUpdate }) => {
  const [status, setStatus] = useState(report.status);
  const [remark, setRemark] = useState(report.remark);
  const [department, setDepartment] = useState(report.department);
  const [zone, setZone] = useState(report.zone);
  const [ward, setWard] = useState(report.ward);
  const [latitude, setLatitude] = useState(report.latitude);
  const [longitude, setLongitude] = useState(report.longitude);
  const [completedTime, setCompletedTime] = useState(report.completed_time || "");
  const [photo, setPhoto] = useState<File | null>(null); // For new photo upload

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("status", status);
      formData.append("remark", remark);
      formData.append("department", department);
      formData.append("zone", zone);
      formData.append("ward", ward);
      formData.append("latitude", String(latitude));
      formData.append("longitude", String(longitude));
      if (completedTime) {
        formData.append("completed_time", completedTime);
      }
      if (photo) {
        formData.append("photo", photo);
      }

      const res = await fetch(
        `https://api-insight-aegh.onrender.com/api/city-monitoring/${report.id}/`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
        onClose();
      } else {
        const errorData = await res.json();
        console.error("Update failed:", errorData);
      }
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-4xl text-white relative">
        <button className="absolute top-2 right-4 text-white" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Report #{report.id}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            Status:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 p-2 bg-gray-700 rounded"
            >
              <option value="reported">Reported</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="block">
            Department:
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full mt-1 p-2 bg-gray-700 rounded"
            >
              <option value="Traffic">Traffic</option>
              <option value="Animal">Animal</option>
              <option value="Sanitation">Sanitation</option>
            </select>
          </label>

          <label className="block">
            Ward:
            <input
              type="text"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full mt-1 p-2 bg-gray-700 rounded"
            />
          </label>

          <label className="block">
            Zone:
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full mt-1 p-2 bg-gray-700 rounded"
            >
              <option value="">Select Zone</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
              <option value="central">Central</option>
            </select>
          </label>

          <label className="block">
            Latitude:
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              className="w-full mt-1 p-2 bg-gray-700 rounded"
            />
          </label>

          <label className="block">
            Longitude:
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              className="w-full mt-1 p-2 bg-gray-700 rounded"
            />
          </label>

          <label className="block">
            Completed Time:
            <input
              type="datetime-local"
              value={completedTime || ""}
              onChange={(e) => setCompletedTime(e.target.value)}
              className="w-full mt-1 p-2 bg-gray-700 rounded"
            />
          </label>

          <label className="block">
            Photo:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="w-full mt-1 p-2 bg-gray-700 rounded"
            />
            {report.photo_url && (
              <img src={report.photo_url} alt="Current Photo" className="mt-2 h-20" />
            )}
          </label>

          <div className="col-span-1 md:col-span-2">
            <label className="block">
              Remark:
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded"
                rows={3}
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 px-4 py-2 mt-6 rounded text-white hover:bg-blue-700 w-full"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditModal;
