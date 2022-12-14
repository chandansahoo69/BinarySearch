import { useEffect, useState } from "react";
import { getAllRooms, getAllUsers } from "../api";

const useFetchData = (query, pageNumber, urlName) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [peoples, setPeoples] = useState([]);
  const [hasMore, setHasMore] = useState(undefined);

  useEffect(() => {
    setRooms([]);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);

    if (urlName === "rooms") {
      try {
        const getRooms = async () => {
          const { data } = await getAllRooms(pageNumber);
          setRooms((prevRooms) => {
            return [...prevRooms, ...data.allRooms.map((room) => room)];
          });
          setHasMore(data.allRooms.length >= 8);
          setLoading(false);
        };
        getRooms();
      } catch (error) {
        //   if (API.isCancel(error)) return;
        setError(true);
      }
    } else if (urlName === "peoples") {
      try {
        const getPeoples = async () => {
          const { data } = await getAllUsers(pageNumber);
          setPeoples((prevPeoples) => {
            return [...prevPeoples, ...data];
          });
          setHasMore(data.length > 0);
          setLoading(false);
        };
        getPeoples();
      } catch (error) {
        setError(true);
      }
    }
  }, [query, pageNumber]);

  return { loading, error, rooms, hasMore, peoples };
};

export default useFetchData;
