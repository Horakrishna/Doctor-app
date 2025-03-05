import React, { useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointment = () => {
  const { aToken, getAllAppiontment, appiontments, cancelAppiontment } =
    useContext(AdminContext);
  const { ageCalculate, slotDateFormated, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppiontment();
    }
  }, [aToken]);
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mt-3 text-xl font-medium"> All Appiontment</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patent Name</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctors</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appiontments.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                src={item.userData.image}
                className="w-8 rounded-full"
                alt=""
              />
              <p>{item.userData.name}</p>
            </div>
            <p>{ageCalculate(item.userData.dob)}</p>
            <p>
              {slotDateFormated(item.slotDate)} ,{item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                src={item.docData.image}
                className="w-8 rounded-full"
                alt=""
              />
              <p>{item.docData.name}</p>
            </div>
            <p>
              {currency}
              {item.docData.fees}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
            ) : (
              <img
                onClick={() => cancelAppiontment(item._id)}
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointment;
