import { Box, Flex, Text, Tooltip, Avatar, Badge, MenuButton, Button, MenuList, MenuItem, Menu, useDisclosure } from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
// Icons
import { PiUsersThreeBold } from "react-icons/pi";
import { GrResources } from "react-icons/gr";
import { LuMessagesSquare } from "react-icons/lu";
import { MdOutlineEditNotifications } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { MdOutlineQuestionMark } from "react-icons/md";
import { RiSettings3Line } from "react-icons/ri";
import { LuUserPen } from "react-icons/lu";
// Pages and Components
import Header from "../components/Header";

import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { ChevronDownIcon } from "@chakra-ui/icons";
import UpdateProfile from "../components/UpdateProfile";

const DashboardPage = () => {
  // Dashboard Menu
  const dashBoardLink = [
    { title: "Students", link: "/dashboard/students", icon: <PiStudent /> },
    { title: "Professors", link: "/dashboard/professors", icon: <PiUsersThreeBold /> },
    { title: "Resources", link: "/dashboard/resource", icon: <GrResources /> },
    { title: "FAQs", link: "/dashboard/faqs", icon: <LuMessagesSquare /> },
    { title: "Questions", link: "/dashboard/questions", icon: <MdOutlineQuestionMark /> },
    { title: "Updates", link: "/dashboard/updates", icon: <MdOutlineEditNotifications /> },
  ];
  const user = useRecoilValue(userAtom);
  // Function
  const { isOpen, onOpen, onClose} = useDisclosure();


  return (
    <>
      <Flex minH={"100vh"} display={"grid"} gridTemplateColumns={".23fr 1fr"} width={"100%"}>
        <Box py={5} px={3} background={"#f0f4f9"}>
          <Flex alignItems={"center"} h={"fit-content"} px={3} gap={3} mb={10}>
            <Avatar src={user?.profilePic} size={'md'}/>
            <Box>
              <Text fontSize={"23px"} fontWeight={"500"} mb={-1}>{user?.fullName}</Text>
              <Badge bg={'#dfe3e7'} color={'#1f1f1f'} fontSize={'11px'}>{user?.role}</Badge>
            </Box>
          </Flex>

          <Text fontSize={"16px"} fontWeight={"500"} mb={"10px"} mx={5}>
            Tabs
          </Text>

          <Flex flexDir={'column'} justifyContent={'space-between'} height={'78vh'} pb={4}>
            <Flex flexDir={"column"} gap={1}>
              {dashBoardLink.map((el, i) => (
                <Tooltip label={el.title} key={i} placement='top'>
                  <NavLink
                    to={el.link}
                    // _hover={{bgColor: 'blue.50', color:"blue.500"}}
                    px={4}
                    py={4}
                    borderRadius={"md"}
                  >
                    {({ isActive }) => (
                      <Box
                        px={5}
                        py={2}
                        borderRadius={"full"}
                        bg={isActive ? "#dfe3e7" : "transparent"}
                        color={isActive ? "#1f1f1f" : "#444746"}
                        _hover={{ bg: "#dfe3e7", color: "#1f1f1f" }}
                        transition={"background .3s ease, color .3s ease"}
                        
                      >
                        <Flex alignItems={"center"} gap={3} fontSize={"18px"}>
                          {el.icon}
                          {el.title}
                        </Flex>
                      </Box>
                    )}
                  </NavLink>
                </Tooltip>
              ))}
            </Flex>

            <Menu>
              <Tooltip label={"Settings"}placement='top'>
                <MenuButton as={Button} fontWeight={'400'} fontSize={'15px'} px={5} py={3} borderRadius={"full"} bg={"transparent"} color={"#444746"} _hover={{bg: "#dfe3e7", color: "#1f1f1f"}} _active={{bg: "#dfe3e7", color: "#1f1f1f"}} transition={"background .3s ease, color .3s ease"}>
                  <Flex alignItems={"center"} gap={3} fontSize={"19px"}>
                    <RiSettings3Line/>
                    <Text>Settings</Text>
                  </Flex>
                </MenuButton>
              </Tooltip>
              <MenuList marginLeft={'40px'} borderRadius={'50px'} px={1} py={1}>
                <Tooltip label={"Update Profile"} placement='top'>
                  <MenuItem borderRadius={'full'} py={2} display={'flex'} alignItems={'center'} gap={2} px={4} onClick={onOpen}>
                    <LuUserPen fontSize={'18px'}/> 
                    Update Profile
                  </MenuItem>
                </Tooltip>
              </MenuList>
            </Menu>
          </Flex>
        </Box>

        <Box py={5} px={5}>
          <Header />
          <Outlet />
        </Box>
      </Flex>

      {/* Update Profile DialogBox */}
      <UpdateProfile isOpen={isOpen} onClose={onClose}/>
    </>
  );
};

export default DashboardPage;
