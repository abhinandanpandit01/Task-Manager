import React, { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import UserImg from "./assets/user.png";
import { FaUser } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";

export default function UserProfile() {
  const [userData, setUserData] = useState({});
  const [Name, setName] = useState("");
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [editable, setEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await axios.post("/logout");
      localStorage.removeItem("token");
      enqueueSnackbar(res.data.status, {
        variant: "success",
        autoHideDuration: 2000,
      });
      navigate("/");
      location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      enqueueSnackbar("Error logging out", {
        variant: "error",
        autoHideDuration: 2000,
      });
      navigate("/");
    }
  };

  useEffect(() => {
    axios
      .get("/profile")
      .then((res) => {
        console.log(res.data);
        setUserData(res.data);
        setName(res.data.Name);
        setUserName(res.data.UserName);
        setPassword(res.data.Password);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
      });
  }, []);

  const handleEdit = () => {
    setEditable(!editable);
  };
  console.log(UserName);

  const handleSave = async () => {
    await axios
      .patch("/profile/update", { Name, UserName, Password })
      .then((res) => {
        enqueueSnackbar(res.data.status, { autoHideDuration: 900 });
        console.log(res.data);
        localStorage.removeItem("token");
        const token = res.data.token;
        localStorage.setItem("token", token);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="w-full h-[91.5vh] flex items-center justify-center relative">
      <div className="profile-card w-[22rem] h-[28rem] bg-white/40 backdrop-filter backdrop-blur-lg rounded-lg flex flex-col items-center gap-10 py-2">
        <div className="edit-save absolute bg-white/40 p-[.5rem] rounded-full top-0 left-0 m-2">
          <FaSave size={"1.7em"} onClick={handleSave} />
        </div>
        <div className="profile-pic w-full h-[22vh] flex items-center justify-center flex-col">
          <div className="img w-28 h-28 rounded-full relative">
            <img
              src={UserImg}
              alt=""
              className="rounded-full max-w-full max-h-full object-cover"
            />
            <button
              className="bg-white/70 rounded-full p-[0.5rem] absolute right-0 top-[70%]"
              onClick={handleEdit}
            >
              <MdEdit size={"1.8em"} />
            </button>{" "}
          </div>
          <h1 className="text-xl font-semibold">{userData.Name}</h1>
        </div>
        <div className="container flex flex-col gap-2 w-full">
          <div className="input-container w-full flex items-center justify-center gap-2 relative">
            <span className="absolute left-[.5rem]">
              <FaUser />
            </span>
            <input
              type="text"
              className="w-full py-2 outline-none bg-transparent border-b-4 px-10 border-b-white"
              disabled={!editable}
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-container w-full flex items-center justify-center gap-2 relative">
            <span className="absolute left-[.5rem]">
              <MdOutlineAlternateEmail />
            </span>
            <input
              type="email"
              className="w-full py-2 outline-none bg-transparent border-b-4 border- border-b-white px-10"
              value={UserName}
              disabled
            />
          </div>
          <div className="input-container w-full flex items-center justify-center gap-2 relative">
            <span className="absolute left-[.5rem]">
              <RiLockPasswordFill />
            </span>
            <input
              type={showPassword && editable ? "text" : "password"}
              className="w-full py-2 outline-none bg-transparent border-b-4 border- border-b-white px-10"
              value={Password}
              disabled={!editable}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="absolute right-2 p-[.2rem] rounded-full z-50">
              {showPassword && editable ? (
                <FaEye size={"1.4em"} onClick={() => setShowPassword(false)} />
              ) : (
                <FaEyeSlash
                  size={"1.4em"}
                  onClick={() => setShowPassword(true)}
                />
              )}
            </button>
          </div>
        </div>
        <button
          className="bg-red-600 px-3 py-2 rounded-md"
          onClick={handleLogOut}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
