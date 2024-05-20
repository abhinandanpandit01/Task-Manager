import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <div>
      <nav className="w-full bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 bg-slate-50/20 h-16  top-0 flex items-center justify-between px-4">
        <div className="logo">
          <h1 className="text-xl font-bold text-white py-5">
            <Link to="/">TaskManagerX</Link>
          </h1>
        </div>
        <div className="items">
          <ul className="flex gap-8 text-lg text-white font-semibold">
            {localStorage.getItem("token") && <Link to={"/home"}>Home</Link>}
            <li>
              <Link to={"/"}>Login</Link>
            </li>

            {localStorage.getItem("token") && (
              <Link to={"/UserProfile"}>Profile</Link>
            )}
          </ul>
        </div>
      </nav>
      <div></div>
    </div>
  );
}
