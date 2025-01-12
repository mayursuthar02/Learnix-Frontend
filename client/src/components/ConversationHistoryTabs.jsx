import { Box, Grid, Text } from "@chakra-ui/react"
import { _mockConversationsData } from "../_mock/Conversations"
// Hooks
import { useEffect, useState } from "react"
import useShowToast from '../hooks/useShowToast';
// Components
import Conversation from "./Conversation"
import { useNavigate, useParams } from "react-router-dom";

const ConversationHistoryTabs = ({isNewConversation}) => {
  const [conversations, setConversations] = useState([]);
  const {conversationId } = useParams();
  // Function
  const showToast = useShowToast();
  const navigate = useNavigate();
  
  // Get All user Conversation history
  useEffect(()=> {
    const getConversations = async() => {
      try {
        const response = await fetch("/api/conversations/getConversations");
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data.conversations);
        setConversations(data.conversations);
      } catch (error) {
        showToast("Error", error, "error");
      }
    }

    getConversations();
  },[showToast, isNewConversation]);

  
  // Delete Conversation
  const handleDeleteConversation = async(conversation_Id) => {
    try {
      const response = await fetch(`/api/conversations/deleteConversation/${conversation_Id}`, {
        method: "DELETE"
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
        <Text color={'#fff'} fontSize={'15px'} fontWeight={'400'} mb={5}>Conversation History</Text>
        
        {/* Converastions */}
        <Grid templateColumns={'repeat(1, 1fr)'} className="chatList_Section" gap={1} maxHeight={'315px'} overflow={'scroll'}>
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <Conversation key={conversation._id} conversation={conversation} handleDeleteConversation={handleDeleteConversation}/>
            ))) : (
              <Text color={"#333"} fontWeight={'400'} fontSize={'15px'} textAlign={'center'}>No conversations found for this user!</Text>
            )}
        </Grid>
    </Box>
  )
}

export default ConversationHistoryTabs