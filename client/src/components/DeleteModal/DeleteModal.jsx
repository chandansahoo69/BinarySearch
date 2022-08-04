import { useHistory, useParams } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdDelete } from "react-icons/md";
import { deleteRoom, deleteSingleUser } from "../../api";
import { setAuth } from "../../store/authSlice";
import { useDispatch } from "react-redux";

const DeleteModal = ({ onClose, setLoading, component }) => {
  const Id = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  async function deleteAccount() {
    setLoading(true);
    try {
      if (component === "room") {
        // Delete room
        await deleteRoom(Id);

        // Go back to lobby
        history.push("/lobby");
      } else if (component === "profile") {
        // Delete Account
        const { data } = await deleteSingleUser(Id);

        // Dispatch the user data
        dispatch(setAuth(data));
        // Close the delete modal
        onClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-w-screen">
        <div className="w-full h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
          <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
          <div className="lg:w-full max-w-lg w-11/12 p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-navy ">
            <div className="flex flex-col justify-center items-center relative">
              {/* Header Title */}
              <div className="text-center flex flex-col justify-center items-center">
                <button
                  onClick={onClose}
                  className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-lightest-navy hover:text-gray-100 rounded-md text-sm p-2.5 ml-auto inline-flex items-center ease-in-out transition-all duration-150"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="flex justify-center items-center gap-3">
                  <MdDelete className="text-4xl text-red-500" />
                  <h2 className="text-xl font-bold capitalize">
                    Are You Sure?
                  </h2>
                </div>
              </div>

              <div className="text-center mb-10 mt-4">
                <h2 className="text-md text-red-500 capitalize">
                  By deleting your account all the data will <br /> earse from
                  database.
                </h2>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  className="flex sm:inline-flex justify-center items-center capitalize bg-red-600 hover:bg-red-700 active:bg-red-700 focus-visible:ring ring-blue-300 text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-4 py-2"
                  onClick={() => deleteAccount()}
                >
                  Delete
                </button>
                <button
                  className="flex sm:inline-flex justify-center items-center capitalize bg-blue-600 hover:bg-blue-700 active:bg-blue-700 focus-visible:ring ring-blue-300 text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-4 py-2"
                  onClick={() => onClose()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
