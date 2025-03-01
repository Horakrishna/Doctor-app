import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Appiontment from "./pages/Appiontment";
import Contact from "./pages/Contact";
import Doctor from "./pages/Doctor";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyAppointment from "./pages/MyAppointment";
import MyProfile from "./pages/MyProfile";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointment" element={<MyAppointment />} />
        <Route path="/appointment/:docId" element={<Appiontment />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
