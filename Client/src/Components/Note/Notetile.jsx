import { useState } from "react";
import noteIcon from "../assets/NoteIcon.svg";
import { SiTicktick } from "react-icons/si";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { FaShare } from "react-icons/fa";
import completedAudioSrc from "../assets/taskCompleted.mp3";

const completedAudio = new Audio(completedAudioSrc);
export default function Notetile({ Title, id, Description, ShareFunction }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tasks/delete?id=${id}`);
      enqueueSnackbar("Deleted successfully", {
        variant: "success",
        autoHideDuration: 950,
      });
      setTimeout(() => {
        location.reload();
      }, 1100);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Error deleting task", { variant: "error" });
    }
  };
  const handleShowInfo = async () => {
    setShowDescription(!showDescription);
  };
  const handleDone = async () => {
    try {
      setLoading(true);
      await axios.delete(`/tasks/delete?id=${id}`);
      enqueueSnackbar("Completed The Task", { variant: "success" });
      completedAudio.play();
      setTimeout(() => {
        window.location.reload();
      }, 1100);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Error completing task", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };
  const handleShare = () => {
    ShareFunction();
  };
  return (
    <div className="w-full min-h-[8rem] bg-white/30 rounded-xl flex items-center justify-center px-2 backdrop-blur-sm] relative flex-col gap-3 py-2">
      {loading && (
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <PulseLoader color="white" />
        </div>
      )}
      <div className="w-full flex items-center justify-center">
        <div className="details-container flex gap-3 w-[70vw] ">
          <div className="icon w-16 h-16 flex items-center justify-center px-1">
            <img
              src={noteIcon}
              alt=""
              className="w-16 h-16"
              onClick={() => handleShowInfo(id)}
            />
          </div>
          <div className="details flex flex-col gap-1 truncate justify-center">
            <h1 className="title text-2xl font-semibold">{Title}</h1>
            <h1 className="id text-md text-[#BFC8E8] hidden text-[1px]">
              {id}
            </h1>
          </div>
        </div>
        <div className="btn-control flex gap-4 h-full items-center justify-center w-[20vw] px-1">
          <SiTicktick fontSize={"1.5em"} color="green" onClick={handleDone} />
          <Link to={`/edit/${id}`}>
            <MdEdit fontSize={"1.5em"} />
          </Link>
          <MdDelete
            fontSize={"1.5em"}
            color="red"
            onClick={() => handleDelete(id)}
          />
          <FaShare size={"1.1em"} onClick={handleShare} />
        </div>
      </div>
      {showDescription && (
        <div className="description w-full py-2">
          <p className="text-sm w-full break-words">{Description}</p>
        </div>
      )}
    </div>
  );
}
