import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [User, setUser] = useState();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!User) {
        axios.get("/profile").then((data) => {
          setUser(data.data.Name);
        });
      }
    }
  }, []);
  return (
    <UserContext.Provider value={{ User }}>{children}</UserContext.Provider>
  );
}
