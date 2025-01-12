import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import logoAi from "../assets/logoai.png";
import { TbLogout } from "react-icons/tb";

import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const handleLogout = async() => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout');
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", data.message, "success");
      setUser(null);
      localStorage.removeItem("learnixAdminUser");
      navigate("/");
    } catch (error) {
        console.log(error);
        showToast("Error", error, "error");
    } finally {
        setLoading(false);
    }
  }

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"space-between"}
      px={"10px"}
      pb={"15px"}
      pt={"5px"}
    >
      {/* Logo */}
      <Flex display={"flex"} alignItems={"center"} gap={2}>
        <Box
          width={"40px"}
          height={"40px"}
          borderRadius={"full"}
          overflow={"hidden"}
        >
          <Image src={logoAi} w={"100%"} h={"100%"} objectFit={"cover"} />
        </Box>
        <Text className="header-logo-text" fontWeight={"600"} fontSize={"30px"}>
          Learnix
        </Text>
      </Flex>

      <Flex align={'center'} gap={3}>
        {/* Button */}
        {user && (
          <Tooltip hasArrow label={user?.fullName} bg="#1f1f1f" color="#fff">
            <Avatar src={user?.profilePic} />
          </Tooltip>
        )}
        {user && (
          <Tooltip hasArrow label={"Logout"} bg="#1f1f1f" color="#fff">
            <IconButton borderRadius={'full'} size={'lg'} fontSize={"25px"} icon={<TbLogout />} onClick={handleLogout} isLoading={loading}/>
          </Tooltip>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
