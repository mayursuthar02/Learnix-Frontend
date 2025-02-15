import { Box, Flex, Grid, Text } from "@chakra-ui/react"
import { _mockConversationsData } from "../_mock/Conversations"

// Hooks
import { useEffect, useState } from "react"
import useShowToast from '../hooks/useShowToast';

// Components
import Conversation from "./Conversation"
import { useNavigate, useParams } from "react-router-dom";

// Function
import conversationAtom from "../atoms/conversationAtom.js";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";


const ConversationHistoryTabs = ({ setIsDisableHelloButton}) => {
  // States
  const [conversations, setConversations] = useRecoilState(conversationAtom);
  // Functions
  const {conversationId } = useParams();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  
  // Get All user Conversation history
  useEffect(()=> {
    const getConversations = async() => {
      try {
        const response = await fetch("/api/conversations/getConversations", {
          method: "GET",
          headers: { "Authorization": `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConversations(data.conversations);
        console.log(data.conversations)
      } catch (error) {
        showToast("Error", error, "error");
      }
    }

    getConversations();
  },[showToast]);

  
  // Delete Conversation
  const handleDeleteConversation = async(conversation_Id) => {
    try {
      const response = await fetch(`/api/conversations/deleteConversation/${conversation_Id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("success", data.message, "success");
      setConversations((prevConversations) =>
        prevConversations.filter((conv) => conv._id !== conversation_Id)
      );
      if (conversationId === conversation_Id) {
        navigate('/chats');
      }
    } catch (error) {
      console.log(error);
      showToast("Error", error, "error");
    }
  }  
  
  return (
    <Box>
        <Flex align={"center"} gap={5} mb={5}>
          <Text color={'#fff'} fontSize={'15px'} fontWeight={'400'}>Conversation History</Text>
          <Flex align={'center'} justifyContent={'center'} fontSize={"12px"} w={5} h={5} color={"#4796e3"} bg={"#222"} borderRadius={"full"}>{conversations.length}</Flex>
        </Flex>
        
        {/* Converastions */}
        <Grid templateColumns={'repeat(1, 1fr)'} className="chatList_Section" gap={1} maxHeight={'315px'} overflow={'scroll'}>
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <Conversation key={conversation._id} setIsDisableHelloButton={setIsDisableHelloButton} conversation={conversation} handleDeleteConversation={handleDeleteConversation}/>
            ))) : (
              <Text color={"#333"} fontWeight={'400'} fontSize={'15px'} textAlign={'center'}>No conversations found for this user!</Text>
            )}
        </Grid>
    </Box>
  )
}

export default ConversationHistoryTabs