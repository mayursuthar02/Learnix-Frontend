import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import eventsAtom from "../atoms/eventsAtom";

const FetchAllEvents = () => {
  const [events, setEvents] = useRecoilState(eventsAtom);
  const showToast = useShowToast();

  const fetchAllEventsFunc = async () => {
    try {
      const res = await fetch("/api/events/getAllEvents");
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
