import { Avatar, Box, Flex} from "@chakra-ui/react";
// import { _mockMessagesData } from "../_mock/Messages";
import Logo from "../assets/logoai.png";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
// Icons
import { useEffect, useRef } from "react";
// State and Toast
import useShowToast from '../hooks/useShowToast';
import {useRecoilValue} from 'recoil';
import userAtom from "../atoms/userAtom";
import AiResponse from "./AiResponse";
import LoadingAnime from "./LoadingAnime";

const ChatList = ({botResponseLoading, setBotResponseLoading, messages, setMessages, conversationId, isScholaraActive}) => {
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const chatContainerRef = useRef(null);
  
  // User Reply
  const handleUserReply = async(reply, apiRoute) => {
    try {
      const response = await fetch(`/api/messages/userPrompt`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({conversationId, prompt: reply})
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      }
      console.log(data);
      setMessages((prev) => [...prev, data.data]);
      botResponse(apiRoute);
    } catch (error) {
      console.log(error);
    }
  };

  // Bot Response
  const botResponse = async(apiRoute) => {
    setBotResponseLoading(true);
    try {
      const response = await fetch(`/api/chats${apiRoute}`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({conversationId})  
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      }
      console.log(data);
      setMessages((prev) => [...prev, data.newMessage]);
    } catch (error) {
      console.log(error);
    } finally {
      setBotResponseLoading(false);
    }
  }
  
  // Scroll Effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // Smooth transition
      });
    }
  }, [messages, botResponse]);

  return (
    <Box w={"60vw"} minH={"500px"} maxH={"78vh"} className="chatList_Section" ref={chatContainerRef} position={'relative'}>
      {messages?.map((message) => (
        <Flex align={"start"} gap={5} justifyContent={message?.sender == "user" ? "end" : "start"} key={message?._id} mb={message?.sender === "user" ? 2 : 8} py={3}>
          {/* Ai(Bot) Avatar */}
          {message?.sender != "user" && (
            <Avatar name="Ai" src={Logo} objectFit={"cover"} w={"40px"} h={"40px"} />
          )}

          {/* Messages User and Ai(Bot) */}
          <Box>
            {message?.sender === "user" ? (
              <UserMessage message={message}/>
              ) : message?.sender === "scholara" ? (
                <BotMessage isScholaraActive={isScholaraActive} message={message} handleUserReply={handleUserReply}/>
            ) : (
              <AiResponse message={message} />
            )}
          </Box>

          {/* User Avatar */}
          {message?.sender == "user" && (
            <Avatar name={user?.fullName} src={user?.profilePic} w={"40px"} h={"40px"} />
          )}
        </Flex>
      ))}

      {/* Response Loading Animation */}
      {botResponseLoading && (
        <Flex mb={10} w={'100%'} gap={5} alignItems={'start'}>
          <Avatar name="Ai" src={Logo} className={botResponseLoading ? "activeLoading" : ""} objectFit={"cover"} w={"40px"} h={"40px"} />
          <LoadingAnime/>
        </Flex>
      )}

      {/* Bottom Greadient */}
      <Box w={'100%'} height={'50px'} bg="linear-gradient( transparent, #131313)" position={"sticky"} bottom={0} left={0} zIndex={2}></Box>
    </Box>
  );
};

export default ChatList;
