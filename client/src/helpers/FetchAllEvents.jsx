import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import eventsAtom from "../atoms/eventsAtom";
import userAtom from "../atoms/userAtom";

const FetchAllEvents = () => {
  const [events, setEvents] = useRecoilState(eventsAtom);
  const showToast = useShowToast();
  const user = useRecoilValue(userAtom);

  const fetchAllEventsFunc = async () => {
    try {
      const res = await fetch("/api/events/getAllEvents", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user.token}`
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setEvents(data.events);
    } catch (error) {
      console.log(error);
      showToast("Error", error, "error");
    }
  };

  return fetchAllEventsFunc;
};

export default FetchAllEvents;
