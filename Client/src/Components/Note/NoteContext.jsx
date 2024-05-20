import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const NoteContext = createContext({});

export const NoteContextProvider = ({ children }) => {
  const [Notes, setNotes] = useState();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .get("/tasks")
        .then((res) => {
          setNotes(res.data);
        })
        .catch((error) => {
          console.error("Error fetching notes:", error);
        });
    }
  }, []);

  return (
    <NoteContext.Provider value={{ Notes, setNotes }}>
      {children}
    </NoteContext.Provider>
  );
};
