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
      const response = await fetch('/api/auth/userLogout');
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", data.message, "success");
      setUser(null);
      localStorage.removeItem("learnixUserDetails");
      navigate("/login");
    } catch (error) {
        console.log(error);
        showToast("Error", error, "error");
    } finally {
        setLoading(false);
    }
  };

  return {handleUserLogoutFunc, loading};
};

export default HandleUserLogout;
