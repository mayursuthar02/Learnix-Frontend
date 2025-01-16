import { useEffect } from "react";
import { Box, Button,Tooltip, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from "@chakra-ui/react";
import {Link as RouterLink} from 'react-router-dom';

// Components
import ConversationHistoryTabs from "./ConversationHistoryTabs";
import UpdatesDrawer from "./UpdatesDrawer";
import UpdateProfile from "./UpdateProfile";
import AskAQuestion from "./AskAQuestion";

// Icons
import logoAi from "../assets/logoai.png";
import { FaPlus } from "react-icons/fa6";
import { BiSolidNotification } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { MdQuestionMark } from "react-icons/md";
import { LuMessageSquareMore } from "react-icons/lu";
import { LuUserPen } from "react-icons/lu";

// Functions
import { useRecoilValue } from "recoil";
import FetchAllUpdates from "../helpers/FetchAllUpdates";
import updatesAtom from "../atoms/updatesAtom";

// styles
import { TOOLTIP_STYLE } from "../styles/globleStyles";


// CSS STYLES
// -------------------------------------------------------------
const MENU_ITEM_STYLES = {
  borderRadius : "full", 
  py : "2",
  mb : "1", 
  display : "flex", 
  alignItems : "center", 
  bg : "#222", 
  color : "#fff", 
  _hover : {bg: "#333"}, 
  transition : "background .3s ease", 
  gap : "2", 
  px : "4"
}
const ICON_STYLE = { color : "#fff", fontSize : "20px" }
const TEXT_STYLE = {color : "#fff", fontSize : "17px", fontWeight : "400"}


// MAIN FUNCTION
// -------------------------------------------------------------
const SideBar = ({isNewConversation}) => {
  // Functions
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenAskAQuestion, onOpen: onOpenAskAQuestion, onClose: onCloseAskAQuestion } = useDisclosure();
  const { isOpen: isOpenUpdateProfileModel, onOpen: onOpenUpdateProfileModel, onClose: onCloseUpdateProfileModel } = useDisclosure();
  const fetchAllUpdatesFunc = FetchAllUpdates();
  const updates = useRecoilValue(updatesAtom);
  
  // Fetch All Updates
  useEffect(() => {
    fetchAllUpdatesFunc();
  }, [])
  

  return (
    <Box padding={3} background={"#191919"}>
      {/* Logo */}
      <Flex display={"flex"} alignItems={"center"} gap={2}>
        <Box
          width={"40px"}
          height={"40px"}
          borderRadius={"full"}
          overflow={"hidden"}
          as={RouterLink} to={'/'}
          className="logo-rotate-anime"
        >
          <Image src={logoAi} w={"100%"} h={"100%"} objectFit={"cover"} />
        </Box>
        <Text  as={RouterLink} to={'/'} className="header-logo-text" fontWeight={"600"} fontSize={"30px"}>
          Learnix
        </Text>
      </Flex>

      {/* New conversation button */}
      <Button
        mt={6}
        display={"flex"}
        alignItems={"center"}
        gap={1}
        mb={7}
        borderRadius={"50px"}
        bg={"#242424"}
        _hover={{ bg: "#292929" }}
        _active={{ bg: "#242424" }}
      >
        <FaPlus color="#fff" fontSize={"15px"} />
        <Text as={RouterLink} to={'/chats'} color={"#fff"} fontSize={"15px"} fontWeight={"400"}>
          New Conversation
        </Text>
      </Button>

      <Flex flexDir={'column'} justifyContent={'space-between'} h={'79vh'}>
        {/* Conversation History Tabs Section */}
        <ConversationHistoryTabs isNewConversation={isNewConversation}/>

        {/* More Option */}
        <Flex justifyContent={'end'} flexDir={'column'} mt={2} gap={1}>
          <Tooltip label={"Updates"} {...TOOLTIP_STYLE} placement="right">
            <Flex onClick={onOpen} alignItems={"center"} gap={2} justifyContent={'start'} px={4} py={2.5} borderRadius={"50px"} cursor={'pointer'} bg={""} _hover={{ bg: "#242424" }} transition={"background .3s ease"} _active={{ bg: "#242424" }}>
              <BiSolidNotification {...ICON_STYLE} />
              <Text {...TEXT_STYLE}>Updates</Text>
              <Flex ml={'190px'} alignItems={'center'} justifyContent={'center'} fontSize={'12px'} fontWeight={'600'} borderRadius={'full'} w={5} h={5} color={'#f1bcb9'} background={"#333"}>{updates.length}</Flex>
            </Flex>
          </Tooltip>

          <Menu>
            <Tooltip label={"Settings"} {...TOOLTIP_STYLE} placement="right">
              <MenuButton borderRadius={"50px"} cursor={'pointer'} bg={""} _hover={{ bg: "#242424" }} transition={"background .3s ease"} _active={{ bg: "#242424" }}>
                <Flex alignItems={"center"} justifyContent={'start'} gap={2} px={4} py={2.5}>
                  <IoMdSettings className="logo-rotate-anime" {...ICON_STYLE} />
                  <Text {...TEXT_STYLE}>Settings</Text>
                </Flex>
              </MenuButton>
            </Tooltip>
            <MenuList marginLeft={"10px"} zIndex={3} borderRadius={'10px'} px={1} pt={2} pb={1} bg={"#222"} color={'#fff'} border={'none'}>
                <MenuItem {...MENU_ITEM_STYLES} onClick={onOpenAskAQuestion}>
                  <MdQuestionMark {...ICON_STYLE}/>
                  Ask a Question
                </MenuItem>
                <MenuItem {...MENU_ITEM_STYLES}>
                  <LuMessageSquareMore {...ICON_STYLE} />
                  View Replies
                </MenuItem>
                <MenuItem {...MENU_ITEM_STYLES} onClick={onOpenUpdateProfileModel}>
                  <LuUserPen {...ICON_STYLE} />
                  Update Profile
                </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Updates Drawer */}
      <UpdatesDrawer isOpen={isOpen} onClose={onClose}/>

      {/* Ask A Question */}
      <AskAQuestion isOpen={isOpenAskAQuestion} onClose={onCloseAskAQuestion}/>

      {/* Update Profile */}
      <UpdateProfile isOpen={isOpenUpdateProfileModel} onClose={onCloseUpdateProfileModel}/>
    </Box>
  );
};

// d2d7dc

export default SideBar;
