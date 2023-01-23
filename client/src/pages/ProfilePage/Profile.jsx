import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { followUser, getSingleUser } from "../../api";
import Loader from "../../components/shared/Loader/Loader";
import { BsCalendarCheck } from "react-icons/bs";
import { RiImageEditFill, RiDeleteBin4Fill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import ProfileRoomCard from "./ProfileRoomCard";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import UpdateImageModal from "../../components/UpdateImageModal/UpdateImageModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { AiOutlineFire, AiOutlineCode, AiOutlineMail } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";

const Profile = () => {
  const { width } = useWindowDimensions();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const userId = location.pathname.substr(6);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomMadal] = useState(false);
  const [showImageUpdateModal, setShowImageUpdateModal] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const user = await getSingleUser(userId);
      setUserData(user.data);
      setLoading(false);
    };
    fetchUser();
  }, [userId]);

  function openImageModal() {
    setShowImageUpdateModal(!showImageUpdateModal);
  }

  function openDeleteModal() {
    setDeleteModalState(!deleteModalState);
  }

  function openRoomModal() {
    setShowRoomMadal(!showRoomModal);
  }

  const followOrUnfollowUser = async () => {
    const { data } = await followUser(userId);
    setUserData(data);
  };

  function showFollowUnfollowTag() {
    const index = userData.followers.findIndex(
      (obj) => String(obj._id) === String(user.id)
    );
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  }

  function matchUser() {
    return user && userId !== user.id;
  }

  if (loading) return <Loader message="Loading Profile..." />;

  return (
    <>
      <div className="relative containerBox rounded-lg shadow w-auto text-gray-600 mb-5 bg-blue-300 bg-opacity-5 py-16 border border-blue-500 border-opacity-25">
        <div className="flex flex-row items-center justify-center">
          <div>
            <div className="flex flex-col gap-1 text-center">
              <div className="relative">
                <img
                  data="picture"
                  className="h-60 w-60 border-blue-600 border-2 rounded-xl shadow-md mb-6 block mx-auto bg-center bg-no-repeat bg-cover"
                  src={userData ? userData.avatar : ""}
                  alt="user_avatar"
                />
                {userData &&
                  !matchUser() &&
                  userData &&
                  userData.email !== "dummyuser@gmail.com" && (
                    <RiImageEditFill
                      onClick={openImageModal}
                      className="absolute bottom-7 right-16 cursor-pointer hover:text-white ease-in-out duration-300 text-slate-200"
                      size={30}
                    />
                  )}
              </div>
              <div className="felx flex-col justify-center items-center">
                <p className="role font-bold text-lg font-mono text-blue-600 px-1 rounded shadow-md">
                  {userData ? userData.fullname : ""}
                </p>
                <p className="role font-semibold text-sm font-mono text-slate-300 px-1 rounded shadow-md">
                  @ {userData ? userData.username : ""}
                </p>
                <div className="flex justify-center items-center font-mono font-semibold text-sm my-2 text-slate-100 px-1 rounded shadow-md">
                  <AiOutlineFire className="font-bold text-yellow-500 text-lg" />{" "}
                  &nbsp;
                  <p>
                    XP :{" "}
                    <span className="py-1 px-3 capitalize text-white font-bold">
                      {userData ? userData.xp : ""}
                    </span>
                  </p>
                </div>
                <div className="flex justify-center items-center font-mono font-semibold text-sm my-2 text-slate-100 px-1 rounded shadow-md">
                  <AiOutlineCode className="font-bold text-blue-500 text-lg" />{" "}
                  &nbsp;
                  <p>
                    skills :{" "}
                    <span className="py-1 px-3 bg-gray-500 ml-2 bg-opacity-30 rounded-2xl capitalize text-white">
                      {userData ? userData.skill : ""}
                    </span>
                  </p>
                </div>
                <div className="flex justify-center items-center font-mono font-semibold text-sm text-slate-100 px-1 rounded shadow-md">
                  <HiOutlineLocationMarker className="font-bold text-red-500 text-lg" />{" "}
                  &nbsp;
                  <p>
                    location :{" "}
                    <span className="capitalize text-white">
                      {userData ? userData.location : ""}
                    </span>
                  </p>
                </div>
                <div className="flex justify-center items-center font-mono font-semibold text-sm text-slate-100 px-1 rounded shadow-md">
                  <AiOutlineMail className="font-bold text-red-700 text-lg" />{" "}
                  &nbsp;
                  <p>
                    email :{" "}
                    <span className="capitalize text-white">
                      {userData ? userData.email : ""}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 my-4 border-b border-slate-200 border-opacity-25">
              <div className="font-semibold text-center mx-2 lg:mx-4">
                <p className="text-blue-600 font-bold">
                  {userData.rooms.length}
                </p>
                <span className="text-gray-400">Rooms</span>
              </div>
              <NavLink
                to={`/user/${userId}/getAllFollowers`}
                className="font-semibold text-center mx-2 lg:mx-4 bg-transparent py-2 px-4 rounded-lg hover:bg-lightest-navy"
              >
                <p className="text-blue-600 font-bold">
                  {userData && userData.followers.length}
                </p>
                <span className="text-gray-400">Followers</span>
              </NavLink>
              <NavLink
                to={`/user/${userId}/getAllFollowing`}
                className="font-semibold text-center mx-2 lg:mx-4 bg-transparent py-2 px-4 rounded-lg hover:bg-lightest-navy"
              >
                <p className="text-blue-600 font-bold">
                  {userData && userData.following.length}
                </p>
                <span className="text-gray-400">Folowing</span>
              </NavLink>
            </div>

            <div className="flex justify-center gap-2 my-5">
              {userData && matchUser() && (
                <div
                  onClick={followOrUnfollowUser}
                  className="text-sm font-bold text-gray-50 btn px-4 py-2 mr-1 rounded-full shadow cursor-pointer bg-blue-600 hover:bg-gray-300"
                >
                  {showFollowUnfollowTag() === true ? "UNFOLLOW" : "FOLLOW"}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="containerBox flex flex-col items-center">
          <div className="flex items-center justify-between pl-3 pr-1">
            <h1 className="inline-block py-2 px-4 text-md font-bold text-center text-gray-400 rounded-t-lg border-b-2 border-transparent uppercase">
              Rooms
            </h1>
            {!matchUser() && (
              <button
                className="px-4 py-2 m-5 bg-blue-700 bg-opacity-80 rounded-full text-white outline-none shadow-lg flex items-center gap-3 hover:bg-blue-500 transition-all ease-in-out duration-500"
                onClick={openRoomModal}
              >
                <BsCalendarCheck />
                <span className="hidden md:block lg:block">Create a Room</span>
              </button>
            )}
          </div>

          <div className="w-5/6 border-b border-slate-200 border-opacity-25"></div>

          {userData.rooms.length > 0 ? (
            <div className="flex flex-col mt-4 container max-w-7xl px-4">
              <Splide
                options={{
                  perPage:
                    width <= 450 ? 1 : width <= 540 ? 2 : width <= 768 ? 3 : 4,
                  waitForTransition: true,
                  drag: "free",
                  gap: "1rem",
                  pagination: false,
                  autoplay: true,
                }}
              >
                {userData.rooms.map((room, index) => (
                  <SplideSlide>
                    <ProfileRoomCard room={room} key={index} />
                  </SplideSlide>
                ))}
              </Splide>
            </div>
          ) : (
            <span className="text-sky_blue text-opacity-40 font-medium text-lg capitalize pt-4">
              No Rooms are avialble.
            </span>
          )}
        </div>

        {/* Delete Account Button */}
        {userId === user.id &&
          userData &&
          userData.email !== "dummyuser@gmail.com" && (
            <button
              className="absolute right-4 top-4 gap-1 flex sm:inline-flex justify-center items-center capitalize bg-red-600 hover:bg-red-700 active:bg-red-700 focus-visible:ring ring-blue-300 text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-4 py-2"
              onClick={() => openDeleteModal()}
            >
              <RiDeleteBin4Fill className="text-xl" />
              Delete Account
            </button>
          )}
      </div>

      {showImageUpdateModal && (
        <UpdateImageModal
          onClose={openImageModal}
          setUserData={setUserData}
          setLoading={setLoading}
        />
      )}
      {showRoomModal && <AddRoomModal onClose={openRoomModal} Url={"room"} />}
      {deleteModalState && (
        <DeleteModal
          onClose={openDeleteModal}
          setLoading={setLoading}
          component={"profile"}
        />
      )}
    </>
  );
};

export default Profile;
