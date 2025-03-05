import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  // Token
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appiontments, setAppiontments] = useState([]);
  const [dashData, setDashData] = useState(false);
  // connect to backend
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // Get All doctor List from Backend
  const getAllDoctors = async () => {
    try {
      // Call api get doctors data
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Change Doctor availability function
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Get All appiontsment
  const getAllAppiontment = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appiontments", {
        headers: { aToken },
      });
      if (data.success) {
        // toast.success(data.message);
        setAppiontments(data.appiontments);
        console.log(data.appiontments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Cancel Appiontment
  const cancelAppiontment = async (appiontmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appiontments",
        { appiontmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppiontment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // dashboard data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    getAllAppiontment,
    appiontments,
    setAppiontments,
    cancelAppiontment,
    getDashData,
    dashData,
    setDashData,
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
