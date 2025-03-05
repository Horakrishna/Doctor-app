import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const MyAppointment = () => {
  const { doctors, backendUrl, token, getDoctorsData } = useContext(AppContext);
  // Store appiontment data
  const [appiontments, setAppiontments] = useState([]);
  // change Date Formate
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const slotDateFormate = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + months[Number(dateArray[1])] + " " + dateArray[2];
  };
  // get user Appointment list
  const getUserAppiontment = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointment", {
        headers: { token },
      });

      if (data.success) {
        setAppiontments(data.appiontments.reverse());
        console.log(data.appiontments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  // Cancel Appiontment to connect backend
  const cancelAppiontment = async (appiontmentId) => {
    try {
      // console.log(appiontmentId);
      // Api call
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appiontmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppiontment();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (token) {
      getUserAppiontment();
    }
  }, [token]);
  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appiontments.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address :</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-sm mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time :
                </span>
                {slotDateFormate(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            {/* Make components Responsive */}
            <div></div>
            <div className="flex flex-col justify-end gap-2">
              {!item.cancelled && !item.isCompleted && (
                <button className="text-sm text-ston text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                  Play Online
                </button>
              )}

              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppiontment(item._id)}
                  className="text-sm text-ston text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {!item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appiontment Cancel
                </button>
              )}
              {item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;
