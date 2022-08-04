import { useHistory } from "react-router-dom";
import { BsGlobe } from "react-icons/bs";

const RoomCard = ({ room }) => {
  const history = useHistory();

  return (
    <div
      onClick={() => {
        history.push(`/room/${room.id}`);
      }}
      className={`bg-roomcard flex items-center justify-between rounded-xl p-5 border border-codewar_hoverdivbutton shadow-lg cursor-pointer`}
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium font-mono text-xl text-white capitalize">
          {room.topic}
        </span>
        <span className="font-medium font-sans text-base text-slate-200 capitalize">
          {room.ownerId?.username}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium font-sans text-slate-200 capitalize">
          <BsGlobe className="text-blue-500" />
          Public
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <span
          className={`${
            room.difficultyLevel === "easy"
              ? "bg-green-300"
              : room.difficultyLevel === "medium"
              ? "bg-yellow-400"
              : "bg-red-500"
          } text-white text-sm font-medium py-0.5 px-2 rounded-xl shadow-md`}
        >
          {room.difficultyLevel}
        </span>
        <img
          src={room.ownerId?.avatar}
          className="w-11 h-11 rounded-xl border-2 border-purple-400"
          alt="user_avatar"
        />
      </div>

      {/* <h3 className="text-lg font-mono font-bold tracking-wide border-b border-purple-300 text-purple-400">
        {room.topic}
      </h3>
      <div
        className={`${styles.speakers} ${
          room.speakers && room.speakers.length === 1
            ? styles.singleSpeaker
            : ""
        }`}
      >
        <img
          src={room.speakers[0].avatar}
          alt="user_avatar"
          className="w-12 h-12 rounded-full border-2 border-purple-400"
        />
        {/* <div className="">
          {room.speakers &&
            room.speakers.map((speaker) => (
              <img
                key={speaker.id}
                src={speaker.avatar}
                alt="user_avatar"
                className="w-24 h-24 rounded-2xl"
              />
            ))}
        </div> 
        <div className={styles.names}>
          {room.speakers &&
            room.speakers.map((speaker) => (
              <div key={speaker.id} className={styles.nameWrapper}>
                <span className="text-slate-100 font-semibold font-sans">
                  {speaker.username}
                </span>
                <AiOutlineCode size={20} className="text-red-600" />
              </div>
            ))}
        </div>
      </div> */}
    </div>
  );
};

export default RoomCard;
