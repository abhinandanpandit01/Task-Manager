import HomePage from "./Components/HomePage";
import Login from "./Components/User/Login";
import Register from "./Components/User/Register";
import { UserContextProvider } from "./Components/User/UserContext";
import Navbar from "./Components/Navbar";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import { NoteContextProvider } from "./Components/Note/NoteContext";
import EditNote from "./Components/Note/EditNote";
import UserProfile from "./Components/UserProfile";

axios.defaults.baseURL = "http://localhost:2000";
axios.defaults.withCredentials = true;
function App() {
  return (
    <UserContextProvider>
      <NoteContextProvider>
        <div className="w-screen h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500">
          <Navbar />
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/edit/:id" element={<EditNote />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </NoteContextProvider>
    </UserContextProvider>
  );
}

export default App;
