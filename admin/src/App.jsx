import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import AddDoctor from "./pages/Admin/AddDoctor";
import AllAppointment from "./pages/Admin/AllAppointment";
import Dashboard from "./pages/Admin/Dashboard";
import DoctorList from "./pages/Admin/DoctorList";
import Login from "./pages/Login";
import DoctorDashBoard from "./pages/Doctor/DoctorDashBoard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorAppiontment from "./pages/Doctor/DoctorAppiontment";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className=" bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Route */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointment />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorList />} />
          <Route path="/doctor-list" element={<DoctorList />} />
          {/* Doctor Route */}
          <Route path="/doctor-dashboard" element={<DoctorDashBoard />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/doctor-appiontments" element={<DoctorAppiontment />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
