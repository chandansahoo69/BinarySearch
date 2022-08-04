import { useState } from "react";
import { updateProfileImage } from "../../api";
import { useParams } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotification } from "../../hooks/useNotification";
import NotificationModal from "../NotificationModal/NotificationModal";

const UpdateImageModal = ({ onClose, setUserData, setLoading }) => {
  const { id: userId } = useParams();
  const [image, setImage] = useState("/image/monkey-avatar.png");
  const { NotificationHandler, closeNotification, showNotification } =
    useNotification();

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
    };
  }

  async function updateImage() {
    setLoading(true);
    try {
      // If image not selected
      if (image === "/image/monkey-avatar.png") {
        NotificationHandler();
        return;
      }

      const imageDetails = {
        image,
        userId,
      };
      // Update Image
      const { data } = await updateProfileImage(imageDetails);
      // Update user Data
      setUserData(data);
      // Close the update image modal
      onClose();
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-calendar2-week text-red-500"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                  </svg>
                  <h2 className="text-xl font-bold capitalize">
                    Update Profile Image
                  </h2>
                </div>
              </div>
              <div>
                {/* Image Upload here */}
                <div className="flex flex-col justify-center items-center py-6">
                  <div className="h-14 w-24 mb-10">
                    <img
                      src={image}
                      alt="avatar"
                      className="w-24 h-24 rounded-2xl"
                    />
                  </div>
                  <div>
                    <input
                      onChange={captureImage}
                      id="avatarInput"
                      type="file"
                      className="hidden"
                    />
                    <label
                      htmlFor="avatarInput"
                      className="inline-block my-4 text-blue-600 font-medium cursor-pointer"
                    >
                      Choose a different photo
                    </label>
                  </div>
                </div>
              </div>
              <button
                className="flex sm:inline-flex justify-center items-center capitalize bg-codewar_bluebutton hover:bg-codewar_bluebuttondark active:bg-blue-700 focus-visible:ring ring-blue-300 text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-4 py-2"
                onClick={() => updateImage()}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {showNotification && (
        <NotificationModal
          message={"Please Upload an Image."}
          onClick={closeNotification}
        />
      )}
    </>
  );
};

export default UpdateImageModal;
