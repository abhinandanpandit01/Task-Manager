import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
export default function EditNote() {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [Title, setTitle] = useState();
  const [Description, setDescription] = useState();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios.get(`http://localhost:2000/tasks/task?id=${id}`).then((res) => {
        setDescription(res.data.Description);
        setTitle(res.data.Title);
      });
    }
  }, []);
  // console.log({ Title, Description });
  const handleBack = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/home");
    }, 1000);
  };
  const handleEditTask = async () => {
    setEditLoading(true);
    await axios
      .patch(`http://localhost:2000/tasks/Edittask?id=${id}`, {
        Title,
        Description,
      })
      .then((res) => {
        enqueueSnackbar(res.data.status, {
          variant: "success",
          autoHideDuration: 900,
        });
      });
    setTimeout(() => {
      setEditLoading(false);
      navigate("/home");
      location.reload();
    }, 1100);
  };
  return (
    <div className="w-full h-[91.5vh]">
      {loading && (
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <PulseLoader color="white" />
        </div>
      )}
      <header className="w-full h-[10vh] p-2">
        <span
          className="w-14 h-14 bg-white/30 backdrop-blur-lg flex items-center justify-center rounded-full"
          onClick={handleBack}
        >
          <IoIosArrowBack size={"2.3em"} />
        </span>
      </header>
      <div className="container w-screen h-[81.6vh]  flex items-center justify-center">
        <div className="w-[25rem] h-[30rem] bg-slate-200 absolute rounded-lg flex flex-col overflow-hidden items-center z-10">
          <header className="w-full text-center py-2 relative">
            <h1 className="text-2xl font-semibold text-gray-500">Edit Task</h1>
          </header>
          <div className="form w-full h-[60.5vh] bg-slate-700 flex flex-col items-center px-3 gap-3 py-6">
            <input
              type="text"
              placeholder="Enter the Title"
              className="w-full py-2 text-black outline-none px-2 rounded-lg"
              value={Title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              name=""
              id=""
              className="w-full h-40 text-black outline-none px-2 rounded-lg"
              placeholder="Eg: I want to code the personal task manager"
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button
              className="bg-green-500 px-20 py-2 rounded-md text-xl font-semibold"
              onClick={handleEditTask}
            >
              {editLoading ? <PulseLoader color="white" /> : "Edit Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
