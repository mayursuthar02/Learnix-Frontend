import {
  Avatar,
  Box,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

// Components
import EmojiPicker from "emoji-picker-react";
import ScrollableFeed from "react-scrollable-feed";

// Icons
import { SlOptionsVertical } from "react-icons/sl";
import { BiSolidSend } from "react-icons/bi";
import { ImAttachment } from "react-icons/im";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdNotInterested } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { CgMailReply } from "react-icons/cg";
import { IoClose } from "react-icons/io5";

// Functions
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import usePriviewImg from "../hooks/usePriviewImg";
import { useSocket } from "../context/SocketContext";
// Styles
import { BUTTON_ICON_STYLE, TOOLTIPS_STYLE } from "../styles/globleStyles";
import { format } from "date-fns";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../helpers/ChatLogics";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import selectedUserConversationAtom from "../atoms/selectedUserConversationAtom";
import ConversationDetailedDrawer from "./ConversationDetailedDrawer";
import TypingIndicator from "./TypingIndicator";
import userConversationAtom from "../atoms/userConversationAtom";
import useUploadImage from "../hooks/useUploadImage";


// Main Function
const ChatWindow = () => {
  // State
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [userTyping, setUserTyping] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  
  const [file, setFile] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [uploadImage, setUploadImage] = useState("");
  const [replyTo, setReplyTo] = useState({messageId : null, message: "", replyUserName: ""});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // Atoms State
  const user = useRecoilValue(userAtom);
  const selectedUserConversation = useRecoilValue(selectedUserConversationAtom);
  const [userConversations, setUserConversations] = useRecoilState(userConversationAtom);
  // Use Function
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePriviewImg();
  const showToast = useShowToast();
  const fileRef = useRef();
  const socket = useSocket();
  const toast = useToast();

  // Join the conversation room when a conversation is selected
  useEffect(() => {
    if (selectedUserConversation?._id) {
      console.log("Joining room:", selectedUserConversation._id);
      socket.emit("join_conversation", selectedUserConversation._id);
    }
    return () => {
      if (selectedUserConversation?._id) {
        console.log("Leaving room:", selectedUserConversation._id);
        socket.emit("leave_conversation", selectedUserConversation._id);
      }
    };
  }, [selectedUserConversation, socket]);
  
  
  // Typing
  useEffect(() => {
    socket.on("typing", ({userName, userId, profilePic}) => {
      if (userId !== user._id) {
        setUserTyping({userName, profilePic});
      }
    });
  
    socket.on("stop_typing", () => {
      setUserTyping("");
    });
  
    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket]);
  


  // Listen for new messages
  useEffect(() => {
    if (!socket) return; // Ensure socket is defined
  
    const handleReceiveMessage = ({ msg, conversation }) => {
      console.log("Received message:", msg);
      console.log("Received conversation:", conversation);
  
      // Ensure the message has a valid sender
      if (!msg.sender) {
        console.error("Message sender is undefined:", msg);
        return;
      }
  
      // Set Messages
      setMessages((prev) => [...prev, msg]);

      // Update Conversation
      setUserConversations((prevConversations) => {
        // Find the index of the received conversation in the current list
        const conversationIndex = prevConversations.findIndex(
          (conv) => conv._id === conversation._id
        );
    
        // If the conversation exists, remove it and add the updated conversation at the 0th index
        if (conversationIndex !== -1) {
          const updatedConversations = [
            conversation, // Add the updated conversation at the 0th index
            ...prevConversations.slice(0, conversationIndex), // Conversations before the old one
            ...prevConversations.slice(conversationIndex + 1), // Conversations after the old one
          ];
    
          return updatedConversations;
        }
    
        // If the conversation doesn't exist, add it at the 0th index
        return [conversation, ...prevConversations];
      });
    };
  
    socket.on("receiveMessage", handleReceiveMessage);
  
    // Cleanup the event listener
    return () => {
      if (socket) {
        socket.off("receiveMessage", handleReceiveMessage);
      }
    };
  }, [socket]); // Add `socket` as a dependency


  // Fetch All Messages
  useEffect(() => {
    const fetchMessages = async() => {
      setMessageLoading(true);
      setMessages([]);
      try {
        const response = await fetch(`/api/userMessages/${selectedUserConversation._id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user.token}`
          },
        });
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMessages(data.data);
      } catch (error) {
        console.log(error);
        showToast("Error", "Something went wrong", "error");
      } finally {
        setMessageLoading(false);
      }
    }
    if (Object.keys(selectedUserConversation).length > 0) {
      fetchMessages();
    }
  }, [selectedUserConversation])


  // Send Messages
  const sendMessage = async(e) => {
    if ((e.type === "click" || (e.key === "Enter" && newMessage)) && (newMessage || uploadImage))  {
      try {
        const response = await fetch("/api/userMessages/sendMessage", {
          method: "POST",
          headers: {
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({content: newMessage, conversationId: selectedUserConversation._id, attachments: uploadImage})
        });
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // console.log("Message sent:", data.data);
        socket.emit("newMessage", data.data);
        setNewMessage("");

        
      } catch (error) {
        console.log(error);
        showToast("Error", "Something went wrong.", "error");
      } finally {
        setUploadImage("");
      }
    }
  }


  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    // Emit typing event immediately
    socket.emit("typing", { userName: user.fullName, userId: user._id, profilePic: user.profilePic, conversationId: selectedUserConversation._id });

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      socket.emit("stop_typing", selectedUserConversation._id);
    }, 1000);

    setTypingTimeout(timeout);
  };

  
  // Upload Product Images
  const handleUploadProductImages = async (e) => {
      const file = e.target.files[0]; // Get the file from the input
      const toastPresets = {variant: 'subtle', duration: 3000, isClosable: true}
      if (!file) {
        showToast("Error", "No file selected", "error");
        return;
      }
    
      setIsUploading(true);
    
      // Create a promise for uploading the image
      const uploadPromise = useUploadImage(file);
    
      // Show a toast that updates based on the promise result
      toast.promise(uploadPromise, {
        success: { title: "Upload Successful", description: "Image uploaded successfully!", ...toastPresets },
        error: { title: "Upload Failed", description: "Failed to upload the image.", ...toastPresets },
        loading: { title: "Uploading...", description: "Please wait while the image is uploading.", ...toastPresets },
      });
    
      try {
        const uploadImageCloudinary = await uploadPromise;
        // console.log("Uploaded image URL:", uploadImageCloudinary.url);
        setUploadImage(uploadImageCloudinary.url); // Update state with the uploaded image URL
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
  };
    
  
  
  return (
    Object.keys(selectedUserConversation).length > 0 ? (
      <>
        <Box bg={'#fff'} minH={"100vh"} maxH={"100vh"}>
            {/* Header */}
            <Flex alignItems={"center"} justifyContent={"space-between"} pl={10} pr={5} py={3}>
        
              <Flex justifyContent={"center"} flexDir={"column"}>
                  <Flex alignItems={"center"} gap={3}>
                      <Avatar src={selectedUserConversation.groupConversationIcon}/>
                      <Flex justifyContent={"center"} flexDirection={"column"} w={"180px"}>
                          <Text color={"#1f1f1f"} fontSize={"17px"}>{selectedUserConversation.conversationName}</Text>
                          {userTyping && <Flex color={"#888"} fontSize={"13px"} gap={1} alignItems={"center"}>
                              <Text className="header-logo-text" textTransform={"lowercase"}>@{userTyping.userName.split(" ")[0]}</Text>
                              Typing...
                          </Flex>}
                      </Flex>
                  </Flex>
              </Flex>
                
              <Flex>
                <IconButton {...BUTTON_ICON_STYLE} bg={"#fff"} borderRadius={"full"} onClick={onOpen} icon={<SlOptionsVertical/>}/>
              </Flex>
            </Flex>

            {/* Messages */}
            <Box height={"78vh"} px={50} pos={"relative"}>
              {messageLoading && 
                <Flex alignItems={"center"} justifyContent={"center"} py={20}>
                  <Spinner color="#999" size={"lg"}/>
                </Flex>}
              <ScrollableFeed>
                {messages &&
                  messages.map((m, i) => (
                    <div style={{ display: "flex", alignItems: "flex-end" }} key={m._id}>
                      {/* Avatar for messages from other users */}
                      {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                        <Tooltip label={m?.sender?.fullName} placement="top">
                          <Avatar mr={2} w={"40px"} h={"40px"} cursor="pointer" name={m?.sender?.fullName} src={m?.sender?.profilePic}/>
                        </Tooltip>
                      )}

                      {/* Message Box */}
                      <Flex
                      style={{
                        marginLeft: isSameSenderMargin(messages, m, i, user._id), 
                        marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                        marginRight: m.sender._id === user._id ? 0 : "auto", maxWidth: "75%",
                      }}
                      alignItems={"center"}
                      onMouseEnter={() => setIsHovered(m._id)}
                      onMouseLeave={() => setIsHovered(null)}
                      gap={3}
                      >                        
                        <Box
                          style={{
                            background: `${m.sender._id === user._id ? "linear-gradient(60deg, #4796e3, #336dff, #492cbe)" : "#dddeee"}`,
                            color: `${m.sender._id === user._id ? "#fff" : "#1f1f1f"}`,
                             // Align to the right for the current user
                            
                            borderRadius: m.sender._id === user._id ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                            padding: "8px 10px", wordWrap: "break-word", display: "flex", flexDirection: "column",
                          }}
                        >
                          {/* Reply To  */}
                          {/* <Flex alignItems={"center"} gap={2} overflow={"hidden"} bg={m?.sender?._id === user._id ? "#f0f4f9" : "#cccddd"} 
                            py={1} px={2} borderRadius={"10px 10px 5px 5px"} fontSize={"15px"} mb={1}
                            color={m?.sender?._id === user._id ? "#333444" : "#666777"} 
                          >
                            <Text color={m?.sender?._id === user._id ? "#fff" : "#333444"} className={m?.sender?._id === user._id ? "header-logo-text" : ""}>@mayur</Text> 
                            <Text >Hello! Trupti</Text>
                          </Flex> */}

                          {/* Message and Timestamp */}
                          <Flex align={"center"} justifyContent={"space-between"} gap={"10px"}>
                            {/* Message Content */}
                            {!m.isDeleted ? (
                              <Text>{m.content}</Text>
                            ) : (
                              <Flex alignItems={"center"}  gap={2} fontWeight={"400"} opacity={.7}>
                                <MdNotInterested fontSize={"19px"}/>
                                <i>you deleted this message.</i>
                              </Flex>
                            )}

                            {/* Timestamp */}
                            <Text
                              color={m.sender._id === user._id ? "#ddd" : "#777"} fontSize={"11px"} textTransform={"lowercase"}
                              textAlign={m.sender._id === user._id ? "right" : "left"} mb={-2}>
                              {format(new Date(m.updatedAt), "h:mm a")}
                            </Text>
                          </Flex>
                          
                          {/* attachments (IMG) */}
                          {m.attachments && <Box w={"250px"} h={"150px"} borderRadius={"13px"} overflow={"hidden"} bg={"#333"} my={2}>
                            <Image w={"full"} height={"full"} src={m.attachments} objectFit={"cover"}/>
                          </Box>}

                        </Box>
                        
                        {/* {isHovered === m._id && m.sender._id !== user._id && <Flex>
                          <IconButton borderRadius={"full"} fontSize={"20px"} color={"#222"} icon={<CgMailReply/>} onClick={() => setReplyTo({messageId: m._id, message: m.content, replyUserName: m.sender?.fullName})}/>
                        </Flex>} */}
                      </Flex>
                    </div>
                  ))}
                  {userTyping && <TypingIndicator user={userTyping}/>}
              </ScrollableFeed>
            </Box>

            {/* Input Box */}
            <Box display={"flex"} justifyContent={"center"} py={3} position={"relative"}>
                {/* IMAGE SEND SECTION */}
                {uploadImage && <Box pos={"absolute"} bottom={3} left={5} bg={"#fff"} overflow={"hidden"} boxShadow='sm' borderRadius={"xl"} w={"400px"} height={"320px"} border={'1px solid #dddeee'} zIndex={1}>
                  <Box w={"full"} height={"260px"} bg={"#f8fafc"} borderRadius={"xl"} overflow={"hidden"}>
                    <Box pos={"absolute"} right={3} top={3} zIndex={2} fontSize={"30px"} color={"#fff"} cursor={"pointer"} onClick={() => setUploadImage("")}><IoCloseCircle/></Box>
                    <Image w={"full"} h={"full"} src={uploadImage} objectFit={"cover"}/>
                  </Box>

                  <Flex mt={3} pr={2}>
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
                        onChange={handleInputChange}
                        isDisabled={!uploadImage}
                    />
                    </FormControl>
                    <IconButton onClick={sendMessage} borderRadius={'full'} {...BUTTON_ICON_STYLE} _active={{opacity: 0.7}} icon={<BiSolidSend color="#444" fontSize={'20px'} />} isDisabled={uploadImage === ""}/>
                  </Flex>
                </Box>}

                {/* REPLY TO SECTION */}
                {replyTo.message && <Flex alignItems={"center"} gap={1} pos={"absolute"} bottom={"90%"} left={"210px"} bg={"#dddeee"} borderRadius={"full"} px={3} py={2} overflow={"hidden"}>
                  <Flex fontSize={"20px"} color={"#555"}><CgMailReply/></Flex>
                  <Text className="header-logo-text" textTransform={"lowercase"}>@{replyTo.replyUserName.split(" ")[0]}:</Text>
                  <Text color={"#555"}>{replyTo.message}</Text>
                  <Flex fontSize={"20px"} color={"#999"} ml={3} cursor={"pointer"} _hover={{color: "#555"}} transition={"color .3s ease"} onClick={() => setReplyTo({messageId: null, message: "", replyUserName: ""})}><IoClose/></Flex>
                </Flex>}

                {/* INPUT SECTION */}
                <form onSubmit={(e) => e.preventDefault()}>
                    <Flex alignItems={'end'} border={'1px solid #dddeee'} gap={1} borderRadius={'30px'} p={1} w={'50vw'} transition={'width .5s ease-in-out'} minH={'50px'}>
                        <Box>
                          <Input type="file" hidden ref={fileRef} onChange={handleUploadProductImages}/>
                          <Tooltip label={"Attachment"} {...TOOLTIPS_STYLE}>
                            <IconButton onClick={() => fileRef.current.click()} borderRadius={'full'} {...BUTTON_ICON_STYLE} _active={{opacity: 0.7}} icon={<ImAttachment color="#444" fontSize={'20px'} />}/>
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
                              <IconButton borderRadius={'full'} {...BUTTON_ICON_STYLE} _active={{opacity: 0.7}} icon={<MdOutlineEmojiEmotions color="#444" fontSize={'20px'}/>} onClick={() => setShowEmojiPicker(!showEmojiPicker)}/>
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
                                onChange={handleInputChange}
                                isDisabled={uploadImage}
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
