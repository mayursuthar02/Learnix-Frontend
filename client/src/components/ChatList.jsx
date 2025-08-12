import { Avatar, Box, Flex, Spinner} from "@chakra-ui/react";
// import { _mockMessagesData } from "../_mock/Messages";
import Logo from "../assets/logoai.png";

// Components
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import AiResponse from "./AiResponse";
import LoadingAnime from "./LoadingAnime";

// Icons
import { useCallback, useEffect, useRef, useState } from "react";

// State and Toast
import useShowToast from '../hooks/useShowToast';
import {useRecoilState, useRecoilValue} from 'recoil';
import userAtom from "../atoms/userAtom";
import conversationAtom from "../atoms/conversationAtom";
import { useParams } from "react-router-dom";

// BASEURL
import { baseURL as BASEURL } from "../config/baseURL.js";

// STYLE
const AVATAR_STYLES = { objectFit : "cover", w : "40px", h : "40px" }


// Main Function
const ChatList = ({botResponseLoading, setBotResponseLoading, messages, setMessages, conversationId, isScholaraActive, userReplyLoading, setUserReplyLoading}) => {
  // State
  const [responseLoadingDisableButton, setResponseLoadingDisableButton] = useState(false);
  const [_, setConversations] = useRecoilState(conversationAtom);
  // Functions
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const chatContainerRef = useRef(null);
  
  
  // Bot Response
  const botResponse = useCallback(
    async (apiRoute) => {
      setBotResponseLoading(true);
      try {
        const response = await fetch(`${BASEURL}/api/chats${apiRoute}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({ conversationId }),
        });
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        }
        console.log(data);
        setMessages((prev) => [...prev, data.newMessage]);
        setConversations((prev) =>
          prev.map((conversation) => {
            if (conversation._id === data.newMessage.conversationId) {
              return {
                ...conversation,
                title: data?.newMessage?.botResponse?.message,
              };
            }
            return conversation;
          })
        );
      } catch (error) {
        console.log(error);
      } finally {
        setBotResponseLoading(false);
      }
    },
    [conversationId] // Dependencies
  );

  // User Reply
  const handleUserReply = useCallback(
    async (reply, apiRoute) => {
      setResponseLoadingDisableButton(true);
      setUserReplyLoading(true);
      try {
        const response = await fetch(`${BASEURL}/api/messages/userPrompt`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({ conversationId, prompt: reply }),
        });
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        // console.log(data);
        setMessages((prev) => [...prev, data.data]);
        botResponse(apiRoute);
      } catch (error) {
        console.log(error);
      } finally {
        setUserReplyLoading(false);
        setResponseLoadingDisableButton(false);
      }
    },
    [conversationId, botResponse] // Dependencies
  );
  
  // Scroll Effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, botResponseLoading]);

  return (
    <Box w={"60vw"} minH={"500px"} maxH={"78vh"} className="chatList_Section" ref={chatContainerRef} position={'relative'}>
      {messages?.map((message) => (
        <Flex align={"start"} gap={5} justifyContent={message?.sender == "user" ? "end" : "start"} key={message?._id} mb={message?.sender === "user" ? 2 : 8} py={3}>
          {/* Ai(Bot) Avatar */}
          {message?.sender != "user" && (
            <Avatar name="Ai" src={Logo} {...AVATAR_STYLES} />
          )}

          {/* Messages User and Ai(Bot) */}
          <Box>
            {message?.sender === "user" ? (
              <UserMessage message={message}/>
              ) : message?.sender === "learnix" ? (
                <BotMessage isScholaraActive={isScholaraActive} message={message} handleUserReply={handleUserReply} responseLoadingDisableButton={responseLoadingDisableButton}/>
            ) : (
              <AiResponse message={message} />
            )}
          </Box>

          {/* User Avatar */}
          {message?.sender == "user" && (
            <Avatar name={user?.fullName} src={user?.profilePic} {...AVATAR_STYLES} />
          )}
        </Flex>
      ))}
    
      {/* User reply Loading Animation */}
      {userReplyLoading && (
        <Flex mb={10} w={'100%'} gap={5} alignItems={'center'} justifyContent={'end'}>
          <Spinner color="#333"/>
          <Avatar name={user?.fullName} src={user?.profilePic} className={botResponseLoading ? "activeLoading" : ""} {...AVATAR_STYLES}/>
        </Flex>
      )}
    
      {/* Response Loading Animation */}
      {botResponseLoading && (
        <Flex mb={10} w={'100%'} gap={5} alignItems={'start'}>
          <Avatar name="Ai" src={Logo} className={botResponseLoading ? "activeLoading" : ""} {...AVATAR_STYLES}/>
          <LoadingAnime/>
        </Flex>
      )}

      {/* Bottom Greadient */}
      <Box w={'100%'} height={'50px'} bg="linear-gradient( transparent, #131313)" position={"sticky"} bottom={0} left={0} zIndex={2}></Box>
    </Box>
  );
};

export default ChatList;
