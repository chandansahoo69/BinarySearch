import People from "../People/People";
import Rooms from "../Rooms/Rooms";

const Lobby = () => {
  return (
    <>
      <div className="grid grid-cols-5 gap-2 pt-2 pb-4 px-4">
        <div className="col-span-4 bg-transparent">
          <Rooms />
        </div>
        <div className="bg-transparent">
          <People />
        </div>
      </div>
    </>
  );
};

export default Lobby;
