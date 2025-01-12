import { Avatar, Badge, Button, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useDisclosure } from "@chakra-ui/react"
import {useNavigate, useParams, Link as RouterLink} from 'react-router-dom';
// Components
import ChatList from "./ChatList"
import ChatInput from "./ChatInput"
import { motion, AnimatePresence } from "framer-motion";
import UpdateProfile from '../components/UpdateProfile';
// Icons
import { MdLogout } from "react-icons/md";
import { PiHandWavingBold } from "react-icons/pi";
import { LuUserPen } from "react-icons/lu";
// State and Toast, Function
import {useRecoilState} from 'recoil';
import userAtom from '../atoms/userAtom'
import useShowToast from "../../../admin/src/hooks/useShowToast";
import { useEffect, useState } from "react";

const ChatSection = ({isNewConversation, setIsNewConversation}) => {
  const languages = [
    "Hello!",
    "नमस्ते!", // Hindi
  ];
  // State
  const [user, setUser] = useRecoilState(userAtom);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [botResponseLoading, setBotResponseLoading] = useState(false);
  const [isScholaraActive, setIsScholaraActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use Function
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const {conversationId} = useParams();

  // Animation Effect
  // Loop through the languages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % languages.length);
    }, 5000); // Change text every 2 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);
  
  // Fetch Messages
  useEffect(()=> {

    const getMessages = async() => {
      try {
        const response = await fetch(`/api/messages/getMessages/${conversationId}`);
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setMessages(data.messages);
      } catch (error) {
        showToast("Error", error, "error");
      }
    }

    if (conversationId) {
      getMessages();
    }
  },[conversationId]);

  // User LogOut
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
      localStorage.removeItem("learnixUserDetails");
      navigate("/login");
    } catch (error) {
        console.log(error);
        showToast("Error", error, "error");
    } finally {
        setLoading(false);
    }
  }
  
  // Start API
  const startConversation = async() => {
    setBotResponseLoading(true);
    try {
      const response = await fetch('/api/chats/start', {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({conversationId})
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log(data);
      navigate(`/chats/conversation/${data.newMessage?.conversationId}`)
      setIsScholaraActive(false);
      setMessages((prev) => [...prev, data.newMessage]);
    } catch (error) {
      console.log(error);
    } finally {
      setBotResponseLoading(false);
    }
  }

  const activateScholara = async(prompt) => {
    setBotResponseLoading(true);
    try {
      const response = await fetch(`/api/chats/activateScholara`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({prompt, conversationId})  
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log(data)
      setMessages((prev) => [...prev, data.newMessage]);
      setIsScholaraActive(true);
    } catch (error) {
      console.log(error);
      showToast("Error", error, "error");
    } finally {
      setBotResponseLoading(false);
    }
  }

  return (
    <Flex align={'center'} justifyContent={'space-between'} flexDir={'column'} bg={'#131313'}>
      {/* Header */}
      <Flex alignItems={'center'} justifyContent={'space-between'} w={'100%'} px={6} pt={3} pb={1}> 
          {/* Learnix Version */}
          <Flex alignItems={'center'} gap={2} color={'#fff'}> 
            <Badge bg={'#222'} color={'#fff'} fontWeight={'400'} textTransform={'lowercase'}>1.0v</Badge>
            <Flex alignItems={'center'} gap={1}>
              <Text>Learnix</Text>
              {/* <MdKeyboardArrowDown/> */}
            </Flex>
          </Flex>
          {/* User Profile and Logout */}
          <Flex align={'center'} gap={3} bg={'#222'} borderRadius={'full'}>
            <Menu>
              <Tooltip label={user?.fullName} color={'#fff'} bg={'#222'}>
                <MenuButton>
                  <Avatar src={user?.profilePic}/>
                </MenuButton>
              </Tooltip>
              <MenuList marginLeft={'70px'} borderRadius={'50px'} px={1} py={1} bg={"#131313"} color={'#fff'} border={'1px solid #222'}>
                  <MenuItem borderRadius={'full'} py={2} display={'flex'} alignItems={'center'} bg={"#131313"} color={'#fff'} _hover={{bg: "#222"}} transition={'background .3s ease'} gap={2} px={4} onClick={onOpen}>
                    <LuUserPen fontSize={'18px'}/> 
                    Update Profile
                  </MenuItem>
              </MenuList>
            </Menu>
            {user && (
              <Tooltip hasArrow label={"Logout"} bg="#222" color="#fff">
                <IconButton borderRadius={'full'} size={'lg'} fontSize={"25px"} bg={'#222'} _hover={{bg: '#222'}} transition={'background .3s ease'} color="#fff" pl={.5}  icon={<MdLogout fontSize={'22px'}/>} onClick={handleLogout} isLoading={loading}/>
              </Tooltip>
            )}
          </Flex>
      </Flex>

      {/* Hello Message */}
      {messages.length > 0 && conversationId ? (
        <ChatList botResponseLoading={botResponseLoading} setBotResponseLoading={setBotResponseLoading} messages={messages} setMessages={setMessages} conversationId={conversationId} isScholaraActive={isScholaraActive} />
      ) : (
        <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'} height={'100%'} >
          <Flex align={'center'} gap={2}>
            <AnimatePresence mode="wait">
              <motion.div key={currentIndex} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }}>
                <Text className="header-logo-text"textAlign={'right'} fontSize={"50px"} fontWeight={"500"} textTransform={"capitalize"}>
                  {languages[currentIndex]} {user?.fullName}
                </Text>
              </motion.div>
            </AnimatePresence>
            {/* <Text className="header-logo-text" fontSize={"50`px"} fontWeight={"500"} textTransform={"capitalize"}>
            {user?.fullName}
            </Text>` */}
          </Flex>
        
          <Text textAlign={'center'} color={'#7f7f7f'} fontSize={'16px'} mt={1} fontWeight={'300'} w={'500px'}>Get instant access to subject materials, homework help, and expert answers to your academic questions.</Text>
          <Tooltip label="Start your conversation!" bg={'#222'} color={'#fff'}>
            <Button onClick={() => {startConversation(); setIsNewConversation(!isNewConversation)}} display={'flex'} alignItems={'center'} color={'#fff'} mt={10} gap={2} borderRadius={'full'} bg="linear-gradient(90deg, #4796E3, #6658ff, #ff5546)" transition="background-position 0.5s ease-in-out" bgSize="200% 200%" bgPos="0% 0%" _hover={{ bgPos: "100% 0%" }} _active={{bgPos: "0% 0%"}} px={5}>
              <PiHandWavingBold/>
              <Text fontWeight={'500'}>Hello!</Text>
            </Button>
          </Tooltip>
        </Flex>
      )}

      {/* {messages.length === 0 && (
        <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
          <Text className="header-logo-text" fontSize={'50px'} fontWeight={'500'} textTransform={'capitalize'}>Hello! {user?.fullName}</Text>
          <Text textAlign={'center'} color={'#7f7f7f'} fontSize={'16px'} mt={1} fontWeight={'300'} w={'500px'}>Get instant access to subject materials, homework help, and expert answers to your academic questions.</Text>
          <Tooltip label="Start your conversation!" bg={'#222'} color={'#fff'}>
            <Button onClick={startConversation} display={'flex'} alignItems={'center'} color={'#fff'} mt={10} gap={2} borderRadius={'full'} bg="linear-gradient(90deg, #4796E3, #6658ff, #ff5546)" transition="background-position 0.5s ease-in-out" bgSize="200% 200%" bgPos="0% 0%" _hover={{ bgPos: "100% 0%" }} _active={{bgPos: "0% 0%"}} px={5}>
              <PiHandWavingBold/>
              <Text fontWeight={'500'}>Hello!</Text>
            </Button>
          </Tooltip>
        </Flex>
      )}

      // {messages.length > 0 && conversationId && <ChatList botResponseLoading={botResponseLoading} setBotResponseLoading={setBotResponseLoading} messages={messages} setMessages={setMessages} conversationId={conversationId} isScholaraActive={isScholaraActive} />} */}

      <ChatInput conversationId={conversationId} botResponseLoading={botResponseLoading} startConversation={startConversation} isScholaraActive={isScholaraActive} setIsScholaraActive={setIsScholaraActive} activateScholara={activateScholara} setMessages={setMessages}/>

      {/* Update Profile DialogBox */}
      <UpdateProfile isOpen={isOpen} onClose={onClose}/>
    </Flex>
  )
}

export default ChatSection