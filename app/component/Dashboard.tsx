"use client";

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Card from "./Card";
import MapModal from "./MapModal";
import EditModal from "./EditModal";
import { Report } from "../interfaces/Reports";
import "../css/Cube.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function Dashboard() {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [modalLink, setModalLink] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleUpdate = (updated: Report) => {
    setData((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const dateFilter = (item: Report) => {
    const reportedDate = new Date(item.reported_on).getTime();
    let afterStart = true;
    let beforeEnd = true;

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      afterStart = reportedDate >= start.getTime();
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      beforeEnd = reportedDate <= end.getTime();
    }

    return afterStart && beforeEnd;
  };
  // Updated filtered data calculation
  const filteredData = data
    .filter((item) => {
      const departmentMatch =
        selectedDepartment === "all" || item.department === selectedDepartment;
      const statusMatch =
        selectedStatus === "all" || item.status === selectedStatus;
      return departmentMatch && statusMatch && dateFilter(item);
    })
    .sort(
      (a, b) =>
        new Date(b.reported_on).getTime() - new Date(a.reported_on).getTime()
    );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api-insight-aegh.onrender.com/api/city-monitoring/"
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `https://api-insight-aegh.onrender.com/api/city-monitoring/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Stats
  const totalReports = data.length;
  const completedCount = data.filter(
    (item) => item.status === "completed"
  ).length;
  const processingCount = data.filter(
    (item) => item.status === "in_progress"
  ).length;
  const reportedCount = data.filter(
    (item) => item.status === "reported"
  ).length;

  const departments = Array.from(new Set(data.map((item) => item.department)));
  const zones = Array.from(new Set(data.map((item) => item.zone)));
  const uniqueLocations = new Set(data.map((item) => item.location_link)).size;

  const departmentCounts = departments.map((dept) => ({
    name: dept,
    count: data.filter((item) => item.department === dept).length,
  }));

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 100 },
    }),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-700 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 
               50 100.591C22.3858 100.591 0 78.2051 
               0 50.5908C0 22.9766 22.3858 0.59082 
               50 0.59082C77.6142 0.59082 100 22.9766 
               100 50.5908ZM9.08144 50.5908C9.08144 73.1895 
               27.4013 91.5094 50 91.5094C72.5987 91.5094 
               90.9186 73.1895 90.9186 50.5908C90.9186 
               27.9921 72.5987 9.67226 50 9.67226C27.4013 
               9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 
               35.9116 97.0079 33.5539C95.2932 28.8227 
               92.871 24.3692 89.8167 20.348C85.8452 
               15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 
               4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 
               0.367541 46.6976 0.446843 41.7345 
               1.27873C39.2613 1.69328 37.813 
               4.19778 38.4501 6.62326C39.0873 
               9.04874 41.5694 10.4717 44.0505 
               10.1071C47.8511 9.54855 51.7191 
               9.52689 55.5402 10.0491C60.8642 
               10.7766 65.9928 12.5457 70.6331 
               15.2552C75.2735 17.9648 79.3347 
               21.5619 82.5849 25.841C84.9175 
               28.9121 86.7997 32.2913 88.1811 
               35.8758C89.083 38.2158 91.5421 
               39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6 flex-1 overflow-auto bg-gray-900">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-white flex items-center space-x-3"
      >
        <div className="cube-wrapper w-8 h-8">
          <div className="cube3d">
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        </div>
        <span className="p-3">City Monitoring Dashboard</span>
      </motion.h1>
      {/* Cards Grid - 4x4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        <AnimatePresence>
          {departmentCounts.map((dept, i) => (
            <motion.div
              key={dept.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Card title={dept.name} content={dept.count.toString()} />
            </motion.div>
          ))}
          {[
            { title: "Total Reports", value: totalReports },
            { title: "Completed", value: completedCount },
            { title: "In Progress", value: processingCount },
            { title: "Reported", value: reportedCount },
            { title: "Locations", value: uniqueLocations },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              custom={i + departmentCounts.length}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Card title={card.title} content={card.value.toString()} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-white text-lg mb-4">Status Distribution</h2>
          <Doughnut
            data={{
              labels: ["Completed", "Processing", "Reported"].map(
                (label, i) => {
                  const value = [
                    completedCount,
                    processingCount,
                    reportedCount,
                  ][i];
                  return `${label} (${(
                    (value / totalReports) * 100 || 0
                  ).toFixed(1)}%)`;
                }
              ),
              datasets: [
                {
                  data: [completedCount, processingCount, reportedCount],
                  backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: "white",
                    font: { size: 12 },
                  },
                },
              },
            }}
          />
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-white text-lg mb-4">Department Distribution</h2>
          <Doughnut
            data={{
              labels: departments.map((dept, i) => {
                const count = departmentCounts[i].count;
                return `${dept} (${((count / totalReports) * 100 || 0).toFixed(
                  1
                )}%)`;
              }),
              datasets: [
                {
                  data: departmentCounts.map((dept) => dept.count),
                  backgroundColor: [
                    "#f87171",
                    "#60a5fa",
                    "#34d399",
                    "#fbbf24",
                    "#a78bfa",
                  ],
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: "white",
                    font: { size: 12 },
                  },
                },
              },
            }}
          />
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-white text-lg mb-4">Zone Distribution</h2>
          <Doughnut
            data={{
              labels: zones.map((zone) => {
                const count = data.filter((item) => item.zone === zone).length;
                return `${zone} (${((count / totalReports) * 100 || 0).toFixed(
                  1
                )}%)`;
              }),
              datasets: [
                {
                  data: zones.map(
                    (zone) => data.filter((item) => item.zone === zone).length
                  ),
                  backgroundColor: [
                    "#c084fc",
                    "#5eead4",
                    "#facc15",
                    "#818cf8",
                    "#ef4444",
                  ],
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: "white",
                    font: { size: 12 },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="mb-6 bg-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-white mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-white mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-white mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="flex-1">
            <label className="block text-white mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-xl p-6">
        <h2 className="text-white text-lg mb-4">Report Details</h2>
        <table className="min-w-full text-sm text-white border-collapse">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Zone</th>
              <th className="p-3">Ward</th>
              <th className="p-3">Department</th>
              <th className="p-3">Photo</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Identify Object</th>
              <th className="p-3">Location Link</th>
              <th className="p-3">Status</th>
              <th className="p-3">Reported On</th>
              <th className="p-3">Completed Time</th>
              <th className="p-3">Remark</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-700 hover:bg-gray-700"
              >
                <td className="p-3 capitalize">{item.zone}</td>
                <td className="p-3 capitalize">{item.ward}</td>
                <td className="p-3">{item.department}</td>
                <td className="p-3">
                  <img
                    src={item.photo_url}
                    alt="Report"
                    className="h-12 w-16 object-cover rounded"
                  />
                </td>
                <td className="p-3">{item.reason}</td>
                <td className="p-3">
                  <div className="h-12 w-16 overflow-hidden rounded">
                    <img
                      src={item.identify_object_url}
                      alt="Identified"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() =>
                      setMapCoords({ lat: item.latitude, lng: item.longitude })
                    }
                    className="text-blue-400 hover:text-blue-300"
                  >
                    View Map
                  </button>
                </td>
                <td className="p-3 capitalize">{item.status}</td>
                <td className="p-3">
                  {new Date(item.reported_on).toLocaleString()}
                </td>
                <td className="p-3">
                  {item.completed_time
                    ? new Date(item.completed_time).toLocaleString()
                    : "N/A"}
                </td>
                <td className="p-3">{item.remark || "—"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditReport(item)}
                      className="text-blue-900 hover:text-white border border-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-600 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-900 hover:text-white border border-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-600 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalLink && (
        <MapModal link={modalLink} onClose={() => setModalLink(null)} />
      )}
      {editReport && (
        <EditModal
          report={editReport}
          onClose={() => setEditReport(null)}
          onUpdate={handleUpdate}
        />
      )}
      {/* Map Modal with Leaflet */}
      {mapCoords && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Location Map</h2>
            <div className="relative w-full h-96">
              <MapContainer
                center={[mapCoords.lat, mapCoords.lng]}
                zoom={15}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0.75rem",
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[mapCoords.lat, mapCoords.lng]}>
                  <Popup>Reported Location</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="flex justify-between mt-4">
              <a
                href={`https://www.openstreetmap.org/?mlat=${mapCoords.lat}&mlon=${mapCoords.lng}#map=15/${mapCoords.lat}/${mapCoords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                View larger map
              </a>
              <button
                onClick={() => setMapCoords(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
