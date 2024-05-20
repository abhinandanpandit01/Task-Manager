import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
export default function Login() {
  const navigate = useNavigate();
  const [UserName, setUserName] = useState();
  const [Password, setPassword] = useState();
  const handleLogIn = async () => {
    await axios
      .post("/login", { UserName, Password })
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("token", token);
        enqueueSnackbar(res.data.status, {
          variant: "success",
          autoHideDuration: 900,
        });
      })
      .catch(() => {
        enqueueSnackbar("Something Went Wrong", {
          variant: "error",
          autoHideDuration: 900,
        });
      })
      .finally(() => {
        setTimeout(() => {
          if (localStorage.getItem("token")) {
            navigate("/home");
            location.reload();
          }
        }, 1000);
      });
    setUserName("");
    setPassword("");
    //   setTimeout(() => {
    //     location.reload();
    //   }, 2000);
  };
  return (
    <div className="container flex flex-col items-center justify-center w-full h-[91vh]">
      <div className="h-[25rem] w-[21rem] rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20  bg-slate-50/20 overflow-hidden flex flex-col gap-12">
        <header className="w-full h-[6vh] text-center text-3xl font-bold text-white/80 p-1">
          Login
        </header>
        <section className="w-full h-[22.5rem] flex flex-col p-2 items-center gap-3 ">
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
                placeholder="Enter Your Email"
                className="py-[0.50rem] px-3 w-[18rem] bg-transparent outline-none border rounded-full text-white placeholder:text-white"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </span>
          </div>
          <button
            className="px-5 py-2 bg-white w-[18rem] rounded-md"
            onClick={handleLogIn}
          >
            Login
          </button>
          <h1 className="text-white">
            Don't Have An Account?{" "}
            <Link className="font-bold underline" to={"register"}>
              Register Now
            </Link>
          </h1>
        </section>
      </div>
    </div>
  );
}
