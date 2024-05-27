import { useContext, useEffect, useState } from "react";
import { UserContext } from "./User/UserContext";
import { FaListUl } from "react-icons/fa";
import { IoIosAddCircle, IoIosArrowBack } from "react-icons/io";
import { PulseLoader } from "react-spinners";
import { enqueueSnackbar } from "notistack";
import Notetile from "./Note/Notetile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NoteContext } from "./Note/NoteContext";
import NoTask from "./assets/NoTask.svg";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { User } = useContext(UserContext);
  const [add, setAdd] = useState(false);
  const { Notes } = useContext(NoteContext);
  const [tasks, setTasks] = useState([]);
  const [shareTask, setShareTask] = useState(false);
  const [shareUser, setShareUser] = useState("");
  const [taskToShare, setTaskToShare] = useState(null);

  useEffect(() => {
    setTasks(Notes);
  });

  const handleAddTask = async () => {
    const data = { UserName: User, Title: title, Description: description };
    setLoading(true);
    await axios
      .post("/tasks/add", data)
      .then((response) => {
        console.log(response);
        enqueueSnackbar(response.data, { autoHideDuration: 900 });
        setTitle("");
        setDescription("");
        setLoading(false);
        setAdd(false);
        setTimeout(()=>{
          location.reload()
        },1100)
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar("Error adding task", {
          variant: "error",
          autoHideDuration: "1000",
        });
      });
  };

  const handleAdd = () => {
    setAdd(true);
  };

  const handleBack = () => {
    setAdd(false);
    setShareTask(false);
  };

  const ShareFunction = (task) => {
    setTaskToShare(task);
    setShareTask(true);
  };

  const handleShare = async () => {
    if (!taskToShare) return;

    const data = { ...taskToShare, ShareUser: shareUser };

    try {
      const response = await axios.post("/tasks/share", data);
      enqueueSnackbar(response.data.status, {
        variant: "success",
        autoHideDuration: 900,
      });
      setShareTask(false);
    } catch (error) {
      enqueueSnackbar("Error sharing task", { variant: "error" });
    }
  };

  return (
    <>
      <div className="w-screen h-[91vh] flex items-center text-white flex-col relative">
        {shareTask && (
          <div className="absolute bg-white/40 backdrop-blur-lg w-[28rem] h-[13rem] top-[30%] rounded-lg z-50 px-3 flex flex-col items-center justify-center gap-3">
            <span className="absolute top-3 left-3 bg-white/50 rounded-full p-1">
              <IoIosArrowBack
                size={"1.8em"}
                className=""
                color="black"
                onClick={handleBack}
              />
            </span>
            <input
              type="text"
              className="w-full rounded-md py-2 text-black outline-none px-3"
              placeholder="Enter user to share with"
              onChange={(e) => setShareUser(e.target.value)}
            />
            <button
              className="bg-green-600 w-[20rem] py-2 rounded-lg"
              onClick={handleShare}
            >
              Share
            </button>
          </div>
        )}
        {add && (
          <div className="w-[25rem] h-[30rem] bg-slate-200 absolute rounded-lg flex flex-col overflow-hidden items-center z-10">
            <header className="w-full text-center py-2 relative">
              <span className="absolute left-0 px-2" onClick={handleBack}>
                <IoIosArrowBack color="black" size={"2em"} />
              </span>
              <h1 className="text-2xl font-semibold text-gray-500">Add Task</h1>
            </header>
            <div className="form w-full h-[60.5vh] bg-slate-700 flex flex-col items-center px-3 gap-3 py-6">
              <input
                type="text"
                placeholder="Enter the Title"
                className="w-full py-2 text-black outline-none px-2 rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full h-40 text-black outline-none px-2 rounded-lg"
                placeholder="Eg: I want to code the personal task manager"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <button
                className="bg-green-500 px-20 py-2 rounded-md text-xl font-semibold"
                onClick={handleAddTask}
              >
                {loading ? <PulseLoader color="white" /> : "Add Task"}
              </button>
            </div>
          </div>
        )}
        <div className="w-full flex justify-center gap-2 py-5">
          <h1 className="text-2xl font-semibold my-1">
            Hello {User ? User : null}!
          </h1>
        </div>
        <div className="container w-full h-[75vh] py-2 px-2 flex gap-1 flex-col">
          <header className="w-full flex items-center justify-between px-9">
            <h1 className="text-3xl font-semibold text-white">Tasks</h1>
            <span className="flex gap-4 items-center">
              <IoIosAddCircle fontSize={"2em"} onClick={handleAdd} />
              <FaListUl fontSize={"1.5em"} />
            </span>
          </header>
          <div className="note-container w-full flex flex-wrap overflow-y-scroll overflow-x-hidden px-3 gap-5 scrollbar-hide">
            {tasks && tasks.length > 0 ? (
              <>
                {tasks.map((element, index) => (
                  <Notetile
                    key={index}
                    Title={element.Title}
                    id={element._id}
                    Description={element.Description}
                    ShareFunction={() =>
                      ShareFunction({
                        Title: element.Title,
                        Description: element.Description,
                      })
                    }
                  />
                ))}
              </>
            ) : (
              <div className="w-full flex items-center justify-center">
                <img src={NoTask} alt="No Task" className="w-[40vw] h-[40vh]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
