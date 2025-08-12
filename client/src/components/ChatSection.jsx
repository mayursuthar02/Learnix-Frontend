import { Avatar, Badge, Button, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react"
import {useNavigate, useParams} from 'react-router-dom';

// Components
import ChatList from "./ChatList"
import ChatInput from "./ChatInput"
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { MdLogout } from "react-icons/md";
import { PiHandWavingBold } from "react-icons/pi";

// State and Toast, Function
import {useRecoilState} from 'recoil';
import userAtom from '../atoms/userAtom'
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import HandleUserLogout from "../helpers/HandleUserLogout";

// Styles
import { GRADIENT_BUTTON_STYLE, TOOLTIP_STYLE } from "../styles/globleStyles";
import conversationAtom from "../atoms/conversationAtom";
import { languages } from "../data/textsForAnimation";

// MAIN FUNCTION
const ChatSection = ({isDisableHelloButton}) => {
  // State
  const [user, setUser] = useRecoilState(userAtom);
  const [_, setConversations] = useRecoilState(conversationAtom);
  const [messages, setMessages] = useState([]);
  const [botResponseLoading, setBotResponseLoading] = useState(false);
  const [userReplyLoading, setUserReplyLoading] = useState(false);
  const [isScholaraActive, setIsScholaraActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use Function
  const { handleUserLogoutFunc, loading } = HandleUserLogout();
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
      setMessages([]);
      setBotResponseLoading(true);
      try {
        const response = await fetch(`/api/messages/getMessages/${conversationId}`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (data.error || data.error === "No messages found for this conversationId." || data.error === "conversationId is not found!") {
          showToast("Error", data.error, "error");
          navigate("/chats");
          return;
        }
        console.log({Data: data.messages})
        setMessages(data.messages);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setBotResponseLoading(false);
      }
    }

    if (conversationId) {
      getMessages();
    }
  },[conversationId]);

  
  // Start Conversation
  const startConversation = async() => {
    setBotResponseLoading(true);
    try {
      const response = await fetch('/api/chats/start', {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({conversationId})
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      const newConvId = data.newMessage?.conversationId;
      if (!conversationId) {
        navigate(`/chats/conversation/${data.newMessage?.conversationId}`)
      }
      setIsScholaraActive(false);
      setConversations((prev) => {
      const conversationExists = prev.some(c => c._id === newConvId);

      if (conversationExists) {
        // Update title if conversation exists
        return prev.map((conversation) =>
          conversation._id === newConvId
            ? {
                ...conversation,
                title: data.newMessage?.botResponse?.message || "",
              }
            : conversation
        );
      } else {
        // Add new conversation if it doesn't exist
        return [data.conversation, ...prev];
      }
      });

      // console.log(data)
      setMessages((prev) => [...prev, data.newMessage]);
    } catch (error) {
      console.log(error);
      showToast("Error", "Something went wrong.", "error");
    } finally {
      setBotResponseLoading(false);
    }
  }

  // Active Ai
  const activateScholara = async(prompt) => {
    setBotResponseLoading(true);
    try {
      const response = await fetch(`/api/chats/activateScholara`, {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({prompt, conversationId})  
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", "Something went wrong.", "error");
        return;
      }
      if (!conversationId) {
        navigate(`/chats/conversation/${data.newMessage?.conversationId}`)
      }
      setMessages((prev) => [...prev, data.newMessage]);
      setIsScholaraActive(true);
      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation._id === data.newMessage.conversationId) {
            return {
              ...conversation,
              title: prompt,
            };
          }
          return conversation;
        })
      );
    } catch (error) {
      console.log(error);
      showToast("Error", "Something went wrong.", "error");
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
            </Flex>
          </Flex>

          {/* User Profile and Logout */}
          <Flex align={'center'} gap={3} bg={'#222'} borderRadius={'full'}>
            <Tooltip hasArrow label={user?.fullName} {...TOOLTIP_STYLE}>
              <Avatar src={user?.profilePic}/>
            </Tooltip>
            {user && (
              <Tooltip hasArrow label={"Logout"} {...TOOLTIP_STYLE}>
                <IconButton borderRadius={'full'} size={'lg'} fontSize={"25px"} bg={'#222'} _hover={{bg: '#222'}} transition={'background .3s ease'} color="#fff" pl={.5}  icon={<MdLogout fontSize={'22px'}/>} onClick={handleUserLogoutFunc} isLoading={loading}/>
              </Tooltip>
            )}
          </Flex>
      </Flex>

      {/* Hello Message */}
      {messages.length > 0 && conversationId ? (
        <ChatList userReplyLoading={userReplyLoading} setUserReplyLoading={setUserReplyLoading} botResponseLoading={botResponseLoading} setBotResponseLoading={setBotResponseLoading} messages={messages} setMessages={setMessages} conversationId={conversationId} isScholaraActive={isScholaraActive} />
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
          </Flex>
        
          <Text textAlign={'center'} color={'#7f7f7f'} fontSize={'16px'} mt={1} fontWeight={'300'} w={'500px'}>Get instant access to subject materials, homework help, and expert answers to your academic questions.</Text>
          <Tooltip label="Start your conversation!" {...TOOLTIP_STYLE}>
            <Button isDisabled={isDisableHelloButton} onClick={() => {startConversation()}} display={'flex'} alignItems={'center'} mt={10} gap={1} {...GRADIENT_BUTTON_STYLE}>
              <PiHandWavingBold/>
              <Text fontWeight={'500'}>Hello!</Text>
            </Button>
          </Tooltip>
        </Flex>
      )}

      {/* Input Section */}
      <ChatInput conversationId={conversationId} setUserReplyLoading={setUserReplyLoading} botResponseLoading={botResponseLoading} startConversation={startConversation} isScholaraActive={isScholaraActive} setIsScholaraActive={setIsScholaraActive} activateScholara={activateScholara} setMessages={setMessages}/>
    </Flex>
  )
}

export default ChatSection