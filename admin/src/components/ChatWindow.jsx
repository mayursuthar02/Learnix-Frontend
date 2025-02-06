import {
  Avatar,
  Box,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";

// Components
import EmojiPicker from "emoji-picker-react";
import ScrollableFeed from "react-scrollable-feed";

// Icons
import { SlOptionsVertical } from "react-icons/sl";
import { BiSolidSend } from "react-icons/bi";
import { ImAttachment } from "react-icons/im";
import { MdOutlineEmojiEmotions } from "react-icons/md";

// Functions
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
// Styles
import { BUTTON_ICON_STYLE, TOOLTIPS_STYLE } from "../styles/globleStyles";
import { format } from "date-fns";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../helpers/ChatLogics";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import selectedUserConversationAtom from "../atoms/selectedUserConversationAtom";
import ConversationDetailedDrawer from "./ConversationDetailedDrawer";


// Main Function
const ChatWindow = () => {
  // State
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [file, setFile] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const user = useRecoilValue(userAtom);
  const selectedUserConversation = useRecoilValue(selectedUserConversationAtom);
  // Use Function
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();
  const fileRef = useRef();

  // Fetch All Messages
  useEffect(() => {
    const fetchMessages = async() => {
      try {
        const response = await fetch(`/api/userMessages/${selectedUserConversation._id}`);
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMessages(data.data);
      } catch (error) {
        console.log(error);
        showToast("Error", "Something went wrong", "error");
      }
    }
    if (Object.keys(selectedUserConversation).length > 0) {
      fetchMessages();
    }
  }, [selectedUserConversation])

  // Send Messages
  const sendMessage = async(e) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const response = await fetch("/api/userMessages/sendMessage", {
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify({content: newMessage, conversationId: selectedUserConversation._id})
        });
        const data = await response.json();
        console.log(data.data);
        setMessages([...messages, data.data]);
        setNewMessage("");
      } catch (error) {
        console.log(error);
        showToast("Error", "Something went wrong.", "error");
      }
    }
  }
  
  
  return (
    Object.keys(selectedUserConversation).length > 0 ? (
      <>
        <Box bg={'#fff'} minH={"100vh"} maxH={"100vh"}>
            {/* Header */}
            <Flex alignItems={"center"} justifyContent={"space-between"} pl={10} pr={5} py={3}>
        
              <Flex justifyContent={"center"} flexDir={"column"}>
                  <Flex alignItems={"center"} gap={3}>
                      <Avatar/>
                      <Flex justifyContent={"center"} flexDirection={"column"} w={"180px"}>
                          <Text color={"#1f1f1f"} fontSize={"17px"}>Friends Forever</Text>
                          <Flex color={"#888"} fontSize={"13px"} gap={1} alignItems={"center"}>
                              <Text className="header-logo-text">@mayur</Text>
                              Typing...
                          </Flex>
                      </Flex>
                  </Flex>
              </Flex>
                
              <Flex>
                <IconButton {...BUTTON_ICON_STYLE} bg={"#fff"} borderRadius={"full"} onClick={onOpen} icon={<SlOptionsVertical/>}/>
              </Flex>
            </Flex>

            {/* Messages */}
            <Box height={"78vh"} px={30} pos={"relative"}>
              <ScrollableFeed>
                {messages &&
                  messages.map((m, i) => (
                    <div style={{ display: "flex", alignItems: "flex-end" }} key={m._id}>
                      {/* Avatar for messages from other users */}
                      {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                        <Avatar
                          mr={2}
                          w={"40px"} h={"40px"}
                          cursor="pointer"
                          name={m.sender.fullName}
                          src={m.sender.profilePic}
                        />
                      )}

                      {/* Message Box */}
                      <Box
                        style={{
                          background: `${
                            m.sender._id === user._id
                              ? "linear-gradient(60deg, #4796e3, #336dff, #492cbe)"
                              : "#dddeee"
                          }`,
                          color: `${m.sender._id === user._id ? "#fff" : "#1f1f1f"}`,
                          marginLeft: isSameSenderMargin(messages, m, i, user._id),
                          marginRight: m.sender._id === user._id ? 0 : "auto", // Align to the right for the current user
                          marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                          borderRadius:
                            m.sender._id === user._id
                              ? "20px 20px 4px 20px"
                              : "20px 20px 20px 4px",
                          padding: "8px 16px",
                          maxWidth: "75%",
                          wordWrap: "break-word",
                          display: "flex",
                          alignItems: "end",
                          gap: "10px"
                        }}
                      >
                        {/* Message Content */}
                        {m.content}

                        {/* Timestamp */}
                        <Text
                          color={m.sender._id === user._id ? "#ddd" : "#777"} fontSize={"11px"} textTransform={"lowercase"}
                          textAlign={m.sender._id === user._id ? "right" : "left"} mt={1}>
                          {format(new Date(m.updatedAt), "h:mm a")}
                        </Text>
                      </Box>
                    </div>
                  ))}
              </ScrollableFeed>
            </Box>

            {/* Input Box */}
            <Box display={"flex"} justifyContent={"center"} py={3}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Flex alignItems={'end'} border={'1px solid #dddeee'} gap={1} borderRadius={'30px'} p={1} w={'50vw'} transition={'width .5s ease-in-out'} minH={'50px'}>
                        <Box>
                          <Input type="file" hidden ref={fileRef} onChange={(e) => setFile(e.target.files[0])}/>
                          <Tooltip label={"Attachment"} {...TOOLTIPS_STYLE}>
                            <IconButton borderRadius={'full'} {...BUTTON_ICON_STYLE} _active={{opacity: 0.7}} icon={<ImAttachment color="#444" fontSize={'20px'} />}/>
                          </Tooltip>
                        </Box>

                        <Box position={"relative"}>       
                          {showEmojiPicker && <Box position={"absolute"} bottom={"50px"} zIndex={3} bg="#191919" borderRadius="10px" boxShadow="0px 4px 10px rgba(0, 0, 0, 0.5)">
                            <EmojiPicker 
                            theme="light" 
                            emojiStyle="apple" 
                            searchDisabled={true}
                            skinTonesDisabled={true}
                            height={"400px"} width={"400px"}
                            onEmojiClick={(emoji) => setNewMessage((prevText) => prevText + emoji.emoji)}/> 
                          </Box> }    
                          <Tooltip label={"Emoji"} {...TOOLTIPS_STYLE}>
                              <IconButton borderRadius={'full'} {...BUTTON_ICON_STYLE} _active={{opacity: 0.7}} icon={<MdOutlineEmojiEmotions color="#444" fontSize={'20px'} onClick={() => setShowEmojiPicker(!showEmojiPicker)}/>}/>
                          </Tooltip>
                        </Box>  

                        <FormControl isRequired onKeyDown={sendMessage}>
                            <Input 
                                type="text"
                                placeholder="Type a messages here..."
                                minHeight="40px"
                                borderRadius={'30px'}
                                border={'none'}
                                outline={'none'}
                                color={'#1f1f1f'}
                                fontSize={'15px'}
                                _focusVisible={{ border: 'none', outline: 'none' }}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                        </FormControl>
                        <IconButton borderRadius={'full'} {...BUTTON_ICON_STYLE} _active={{opacity: 0.7}} icon={<BiSolidSend color="#444" fontSize={'20px'} />} isDisabled={newMessage === ""}/>
                    </Flex>
                </form>
            </Box>
          </Box>

          {/* Conversation Details Drawer */}
          <ConversationDetailedDrawer onClose={onClose} isOpen={isOpen} conversation={selectedUserConversation}/>
          
      </>
    ) : (
      <Flex bg={'#fff'} minH={"100vh"} maxH={"100vh"} alignItems={"center"} justifyContent={"center"} px={40}>
        <Text fontSize={"80px"} fontWeight={"500"} color={"#dde3eb"}>Welcome! Select a user to begin your chat journey.</Text>
      </Flex> 
    )
)};

export default ChatWindow;
