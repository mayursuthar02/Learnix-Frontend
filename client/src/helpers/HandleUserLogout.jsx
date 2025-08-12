import React, { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";



const HandleUserLogout = () => {
    const [user, setUser] = useRecoilState(userAtom);
      const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const handleUserLogoutFunc = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("learnixUserDetails");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
      showToast("Error", "Logout failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return {handleUserLogoutFunc, loading};
};

export default HandleUserLogout;
