import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import "./App.css";
import useShowToast from "./hooks/useShowToast";
import { useRecoilState } from "recoil";
import userAtom from "./atoms/userAtom";

// BASEURL
import { baseURL as BASEURL } from "./config/baseURL.js";

const App = () => {
  const navigate = useNavigate();
  const showToast = useShowToast();
  const [user, setUser] = useRecoilState(userAtom);

  // Auth Check
  useEffect(() => {
    const checkUserAuth = async () => {
      let storedData;

      // Try to parse the local storage data safely
      try {
        storedData = JSON.parse(localStorage.getItem("learnixUserDetails"));
      } catch (error) {
        showToast("Error", "Error parsing localStorage data.", "error");
        console.error("Error parsing localStorage data:", error.message);
        handleLogout();
        return;
      }

      if (!storedData || !storedData.token) {
        handleLogout();
        return;
      }

      const token = storedData.token;

      try {
        const response = await fetch(`${BASEURL}/api/auth/check`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
          handleLogout();
          return;
        }

        console.log({ message: "User authorized" });
      } catch (error) {
        console.error("Auth Check Failed:", error.message);
        handleLogout();
      }
    };

    checkUserAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("learnixUserDetails");
    setUser(null);
    navigate("/");
  };

  return <Layout />;
};

export default App;
