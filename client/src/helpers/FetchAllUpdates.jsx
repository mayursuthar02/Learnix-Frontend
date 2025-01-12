import React from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import updatesAtom from "../atoms/updatesAtom";

const FetchAllUpdates = () => {
  const [updates, setUpdates] = useRecoilState(updatesAtom);
  const showToast = useShowToast();

  const fetchAllUpdatesFunc = async () => {
    try {
      const res = await fetch("/api/updates/getAllUpdates");
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setUpdates(data.updates);
    } catch (error) {
      console.log(error);
      showToast("Error", error, "error");
    }
  };

  return fetchAllUpdatesFunc;
};

export default FetchAllUpdates;
