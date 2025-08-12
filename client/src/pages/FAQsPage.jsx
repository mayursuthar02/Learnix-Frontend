import {
    Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import logo from "../assets/logoai.png";
import { Link as RouterLink } from "react-router-dom";

// Icons
import { MdLogout } from "react-icons/md";

// State
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import HandleUserLogout from "../helpers/HandleUserLogout"
// Styles
import { BUTTON_STYLE, TOOLTIP_STYLE } from "../styles/globleStyles";

// BASEURL
import { baseURL as BASEURL } from "../config/baseURL.js";

const FAQsPage = () => {
    // State
  const [user, setUser] = useRecoilState(userAtom);
  const [FAQs, setFAQs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
//   Functions
  const showToast = useShowToast();
  const { handleUserLogoutFunc, loading } = HandleUserLogout();

  useEffect(()=>{
    const getAllFAQs = async () => {
      setIsLoading(true);
        try {
            const resposne = await fetch(`${BASEURL}/api/FAQs/getAllFAQs`, {
              method: "GET",
              headers: {"Authorization": `Bearer ${user.token}`}
            });
            const data = await resposne.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setFAQs(data.FAQs);
        } catch (error) {
            console.log(error);
            showToast("Error", "Something went wrong", "error");
        } finally {
            setIsLoading(false);
        }
    }
    getAllFAQs();
  },[]);

  return (
    <Box minHeight={"100vh"} bg={"#131313"} pb={"100px"}>
      <Flex alignItems={"center"} justifyContent={"space-between"} px={"50px"} py={5}>
        <Flex alignItems={"center"} gap={2} as={RouterLink} to={"/"}>
          <Box width={"40px"} height={"40px"} borderRadius={"full"} overflow={"hidden"} className="logo-rotate-anime">
            <Image src={logo} w={"100%"} h={"100%"} objectFit={"cover"} />
          </Box>
          <Text className="header-logo-text" fontWeight={"600"} fontSize={"30px"}>Learnix</Text>
        </Flex>
        <Flex alignItems={"center"} gap={2} bg={"#1e1f20"} borderRadius={"full"}>
          {!user && (
            <Button borderRadius={"full"} fontWeight={"400"} bg={"#1f4cec"} color={"#fff"} _hover={{ bg: "#183bb9" }} as={RouterLink} to={"/login"}>Sign in</Button>
          )}
          {user && (
            <Tooltip label={user?.fullName} {...TOOLTIP_STYLE}>
              <Avatar src={user?.profilePic} />
            </Tooltip>
          )}
          {user && (
            <Tooltip hasArrow label={"Logout"} {...TOOLTIP_STYLE}>
              <IconButton size={"lg"} {...BUTTON_STYLE} fontSize={"20px"} icon={<MdLogout />} onClick={handleUserLogoutFunc} isLoading={loading}/>
            </Tooltip>
          )}
        </Flex>
      </Flex>

      <Text textAlign={"center"} color={"#fff"} fontSize={"30px"} mt={5}>Learnix FAQs</Text>

      {!isLoading && (
        FAQs.length > 0 ? (
          <Accordion allowMultiple border={'none'} mt={5} mx={"200px"} color={"#fff"} fontWeight={"400"} overflow={"hidden"} borderRadius={"20px"}>
              {FAQs.map(FAQ => (
                <AccordionItem borderRadius={"5px"} overflow={'hidden'} border={'none'} key={FAQ._id} mb={1}>
                    <h2>
                      <AccordionButton border={'none'} bg={"#222"} _hover={{bg: "#222"}} py={5} px={"30px"} fontSize={"17px"}>
                        <Box as="span" flex="1" textAlign="left">
                          {FAQ.title}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                
                    <AccordionPanel py={5} px={"30px"} border={'none'} bg={"#222"} fontSize={"17px"} fontWeight={"300"}>
                      {FAQ.description}
                    </AccordionPanel>
                </AccordionItem>
              ))}
        </Accordion>
        ) : (
          <Flex fontSize={"18px"} color={"#444"} mt={"100px"} justifyContent={"center"}>
            FAQs Not Found
          </Flex>
        ))}

      {isLoading && (
        <Flex justifyContent={"center"} mt={"100px"}>
          <Spinner color="#555" />
        </Flex>
      )}
    </Box>
  );
};

export default FAQsPage;
