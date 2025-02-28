import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { AdminContext } from "./context/AdminContext";
import AddDoctor from "./pages/Admin/AddDoctor";
import AllAppointment from "./pages/Admin/AllAppointment";
import Dashboard from "./pages/Admin/Dashboard";
import DoctorList from "./pages/Admin/DoctorList";
import Login from "./pages/Login";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div className=" bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointment />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorList />} />
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
