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
import { BiSolidAnalyse } from "react-icons/bi";
import { TOOLTIPS_STYLE } from "../styles/globleStyles";

const Header = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const handleLogout = async() => {
    setLoading(true);
    try {
      localStorage.removeItem("learnixAdminUser");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
      showToast("Error", "Logout failed.", "error");
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
      <Flex display={"flex"} alignItems={"center"} gap={1}>
        <Flex
          width={"40px"}
          height={"40px"}
          borderRadius={"full"}
          overflow={"hidden"}
          alignItems={'center'}
          justifyContent={'center'}
          className="logo-rotate-anime"
        >
          <Image src={logoAi} w={"100%"} h={"100%"} objectFit={"cover"} />
        </Flex>
        <Text className="header-logo-text" fontWeight={"600"} fontSize={"30px"}>
          Learnix
        </Text>
      </Flex>

      <Flex align={'center'} gap={3} bg={"#f0f4f9"} borderRadius={'full'}>
        {/* Button */}  
        {user && (
          <Tooltip hasArrow label={user?.fullName} {...TOOLTIPS_STYLE}>
            <Avatar src={user?.profilePic} />
          </Tooltip>
        )}
        {user && (
          <Tooltip hasArrow label={"Logout"} {...TOOLTIPS_STYLE}>
            <IconButton borderRadius={'full'} size={'lg'} fontSize={"25px"} icon={<TbLogout />} onClick={handleLogout} isLoading={loading}/>
          </Tooltip>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
