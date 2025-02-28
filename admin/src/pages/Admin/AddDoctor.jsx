import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
const AddDoctor = () => {
  const [docImage, setDocImage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [degree, setDegree] = useState("");
  const [about, setAbout] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  // connect to backend url and token
  const { backendUrl, aToken } = useContext(AdminContext);

  // Save data
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Api Call
    try {
      if (!docImage) {
        return toast.error("Image Not Selected");
      }
      //   Add Data
      const formData = new FormData();
      formData.append("image", docImage);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("speciality", speciality);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("degree", degree);
      formData.append("about", about);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      // Check From data
      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });
      //   Api call from backend
      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        // Reset from Data
        setDocImage(false);
        setName("");
        setEmail("");
        setPassword("");
        setAbout("");
        setFees("");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <form onSubmit={onSubmitHandler} className="mt-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-800 ">
          <label htmlFor="docImage">
            <img
              src={
                docImage ? URL.createObjectURL(docImage) : assets.upload_area
              }
              className="w-16 bg-gray-100  rounded-full cursor-pointer"
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImage(e.target.files[0])}
            type="file"
            id="docImage"
            hidden
          />
          <p>
            Upload Doctor <br />
            Image
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                name="experience"
                id="experience"
                className="border rounded px-3 py-2"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Years</option>
                <option value="3 Year">3 Years</option>
                <option value="4 Year">4 Years</option>
                <option value="5 Year">5 Years</option>
                <option value="6 Year">6 Years</option>
                <option value="7 Year">7 Years</option>
                <option value="8 Year">8 Years</option>
                <option value="9 Year">9 Years</option>
                <option value="10 Year">10 Years</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Fees"
                required
              />
            </div>
          </div>
          {/* Left Sectioin */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                name="speciality"
                id="speciality"
                className="border rounded px-3 py-2"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Education</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Education"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="address 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="address 2"
                required
              />
            </div>
          </div>

          {/* Left SEction End */}
        </div>
        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            placeholder="Write about doctor"
            rows={5}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
