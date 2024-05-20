import  { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [UserName, setUserName] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState();
  const handleRegister = async () => {
    setLoading(true);
    await axios
      .post("/register", { UserName, Name, Password })
      .then((res) => {
        setPassword("");
        setUserName("");
        setName("");
        console.log(res);
        enqueueSnackbar(res.data.status, {
          variant: "info",
          autoHideDuration: 2000,
        });
      })
      .finally(() => {
        setLoading(false);
        setName("");
        setUserName("");
        setPassword("");
        setTimeout(() => {
          navigate("/");
        }, 800);
      });
  };

  return (
    <div className="w-full h-[91vh] flex items-center justify-center relative">
      <div className="h-[26rem] w-[22rem] rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 bg-slate-50/20 overflow-hidden flex flex-col gap-10">
        <header className="w-full h-[6vh] text-center text-3xl font-bold text-white/80 p-1">
          Register
        </header>
        <section className="w-full h-[22.5rem] flex flex-col p-2 items-center gap-3 ">
          <div className="">
            <label
              htmlFor="name"
              className="text-lg font-semibold text-slate-100 mx-5"
            >
              Username
            </label>
            <span className="w-full flex items-center justify-center relative bg-transparent">
              <input
                type="email"
                placeholder="Enter Username"
                className="py-[0.50rem] px-3 w-[18rem] bg-transparent outline-none border rounded-full text-white placeholder:text-white"
                onChange={(e) => setName(e.target.value)}
              />
            </span>
          </div>
          <div className="">
            <label
              htmlFor="email"
              className="text-lg font-semibold text-slate-100 mx-5"
            >
              Email Address
            </label>
            <span className="w-full flex items-center justify-center relative bg-transparent">
              <FaUser
                className="absolute right-[6%] translate-x-[-50%] "
                color="white"
              />
              <input
                type="email"
                placeholder="Enter Email Address"
                className="py-[0.50rem] px-3 w-[18rem] bg-transparent outline-none border rounded-full text-white placeholder:text-white"
                onChange={(e) => setUserName(e.target.value)}
              />
            </span>
          </div>
          <div className="">
            <label
              htmlFor="Password"
              className="text-lg font-semibold text-slate-100 mx-5"
            >
              Password
            </label>

            <span className="w-full flex items-center justify-center relative bg-transparent">
              <FaLock
                className="absolute right-[6%] translate-x-[-50%] "
                color="white"
              />
              <input
                type="password"
                placeholder="Enter Password"
                className="py-[0.50rem] px-3 w-[18rem] bg-transparent outline-none border rounded-full text-white placeholder:text-white"
                onChange={(e) => setPassword(e.target.value)}
              />
            </span>
          </div>
          <button
            className="px-5 py-2 bg-white w-[18rem] rounded-md"
            onClick={handleRegister}
          >
            {loading ? <PulseLoader color="pink" /> : "Register"}
          </button>
        </section>
      </div>
    </div>
  );
}
