import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "৳";
  // Age Calculator
  const ageCalculate = (dob) => {
    const today = new Date();
    const birthDay = new Date(dob);

    let age = today.getFullYear() - birthDay.getFullYear();
    return age;
  };
  // Date formate change
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
    "Nov",
    "Dec",
  ];
  const slotDateFormated = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  const value = {
    ageCalculate,
    slotDateFormated,
    currency,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
