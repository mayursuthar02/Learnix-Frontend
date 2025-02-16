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
import { HiCalendarDateRange } from "react-icons/hi2";
import { FaQ } from "react-icons/fa6";
import { LuMessagesSquare } from "react-icons/lu";

// Functions
import { useRecoilValue } from "recoil";
import FetchAllUpdates from "../helpers/FetchAllUpdates";
import FetchAllEvents from "../helpers/FetchAllEvents";
import updatesAtom from "../atoms/updatesAtom";
import eventsAtom from "../atoms/eventsAtom";

// styles
import { TOOLTIP_STYLE } from "../styles/globleStyles";
import EventsDrawer from "./EventsDrawer";
import ReplyDrawer from "./ReplyDrawer";


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
const TAB_BUTTON_STYLE = {
  alignItems : "center",
  gap : "2",
  justifyContent : "start",
  px : "4",
  py : "2.5",
  borderRadius : "50px",
  cursor : "pointer",
  bg : "",
  _hover : { bg: "#242424" },
  transition : "background .3s ease",
  _active : { bg: "#242424" }
}
const TAB_BUTTON_BADGE_STYLE = {
  alignItems : "center",
  justifyContent : "center",
  fontSize : "12px",
  fontWeight : "600",
  borderRadius : "full",
  w : "5",
  h : "5",
  color : "#4796e3",
  background : "#222"
}
const ICON_STYLE = { color : "#fff", fontSize : "20px" }
const TEXT_STYLE = {color : "#fff", fontSize : "17px", fontWeight : "400"}
const BUTTON_STYLE = {
  display : "flex",
  alignItems : "center",
  gap : "1",
  borderRadius : "50px",
  bg : "#242424",
  _hover : { bg: "#292929"},
  _active : { bg: "#242424"},
  color : "#fff",
  fontWeight : "400",
}

// MAIN FUNCTION
// -------------------------------------------------------------
const SideBar = ({setIsDisableHelloButton}) => {
  // Functions
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenEventDrawer, onOpen: onOpenEventDrawer, onClose: onCloseEventDrawer } = useDisclosure();
  const { isOpen: isOpenViewReplyDrawer, onOpen: onOpenViewReplyDrawer, onClose: onCloseViewReplyDrawer } = useDisclosure();
  const { isOpen: isOpenAskAQuestion, onOpen: onOpenAskAQuestion, onClose: onCloseAskAQuestion } = useDisclosure();
  const { isOpen: isOpenUpdateProfileModel, onOpen: onOpenUpdateProfileModel, onClose: onCloseUpdateProfileModel } = useDisclosure();
  const fetchAllUpdatesFunc = FetchAllUpdates();
  const fetchAllEventsFunc = FetchAllEvents();
  const updates = useRecoilValue(updatesAtom);
  const event = useRecoilValue(eventsAtom);
  
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
      <Button mt={6} mb={7} {...BUTTON_STYLE} as={RouterLink} to={'/chats'} w={"170px"}>
        <FaPlus color="#fff" fontSize={"15px"} />
        <Text color={"#fff"} onClick={()=> setIsDisableHelloButton(false)} fontSize={"15px"} fontWeight={"400"}>
          New Conversation
        </Text>
      </Button>

      <Flex flexDir={'column'} justifyContent={'space-between'} h={'79vh'}>
        {/* Conversation History Tabs Section */}
        <ConversationHistoryTabs setIsDisableHelloButton={setIsDisableHelloButton}/>

        {/* More Option */}
        <Flex justifyContent={'end'} flexDir={'column'} mt={2} gap={1}>
          <Tooltip label={"Chats"} {...TOOLTIP_STYLE} placement="right">
            <Flex as={RouterLink} to={"/u/chats"} {...TAB_BUTTON_STYLE}>
              <LuMessagesSquare {...ICON_STYLE} />
              <Text {...TEXT_STYLE}>Chats</Text>
            </Flex>
          </Tooltip>

          <Tooltip label={"Notices"} {...TOOLTIP_STYLE} placement="right">
            <Flex onClick={onOpen} {...TAB_BUTTON_STYLE}>
              <BiSolidNotification {...ICON_STYLE} />
              <Text {...TEXT_STYLE}>Notices</Text>
              <Flex ml={'197px'} {...TAB_BUTTON_BADGE_STYLE}>{updates.length}</Flex>
            </Flex>
          </Tooltip>
          
          <Tooltip label={"Events"} {...TOOLTIP_STYLE} placement="right">
            <Flex onClick={onOpenEventDrawer} {...TAB_BUTTON_STYLE}>
              <HiCalendarDateRange {...ICON_STYLE} />
              <Text {...TEXT_STYLE}>Events</Text>
              <Flex ml={'203px'} {...TAB_BUTTON_BADGE_STYLE}>{event.length}</Flex>
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
            <MenuList marginLeft={"10px"} zIndex={3} borderRadius={'10px'} w={'250px'} px={1} pt={2} pb={1} bg={"#222"} color={'#fff'} border={'none'}>
                <MenuItem {...MENU_ITEM_STYLES} onClick={onOpenUpdateProfileModel}>
                  <LuUserPen {...ICON_STYLE} />
                  Update Profile
                </MenuItem>
                <MenuItem {...MENU_ITEM_STYLES} onClick={onOpenAskAQuestion}>
                  <MdQuestionMark {...ICON_STYLE}/>
                  Ask a Question
                </MenuItem>
                <MenuItem {...MENU_ITEM_STYLES} onClick={onOpenViewReplyDrawer}>
                  <LuMessageSquareMore {...ICON_STYLE} />
                  View Replies
                </MenuItem>
                <MenuItem as={RouterLink} to={"/faqs"} {...MENU_ITEM_STYLES}>
                  <FaQ {...ICON_STYLE} />
                  FAQs
                </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Updates Drawer */}
      <UpdatesDrawer isOpen={isOpen} onClose={onClose}/>

      {/* Events Drawer */}
      <EventsDrawer isOpen={isOpenEventDrawer} onClose={onCloseEventDrawer}/>

      {/* Ask A Question */}
      <AskAQuestion isOpen={isOpenAskAQuestion} onClose={onCloseAskAQuestion}/>

      {/* View Reply */}
      <ReplyDrawer isOpen={isOpenViewReplyDrawer} onClose={onCloseViewReplyDrawer}/>

      {/* Update Profile */}
      <UpdateProfile isOpen={isOpenUpdateProfileModel} onClose={onCloseUpdateProfileModel}/>
    </Box>
  );
};

// d2d7dc

export default SideBar;
