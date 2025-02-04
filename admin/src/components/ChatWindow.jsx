import {
  Avatar,
  Box,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
  Text,
  Tooltip,
} from "@chakra-ui/react";

// Components
import EmojiPicker from "emoji-picker-react";

// Icons
import { SlOptionsVertical } from "react-icons/sl";
import { BiSolidSend } from "react-icons/bi";
import { ImAttachment } from "react-icons/im";
import { MdOutlineEmojiEmotions } from "react-icons/md";

// Functions
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
// Styles
import { BUTTON_ICON_STYLE, TOOLTIPS_STYLE } from "../styles/globleStyles";

// Main Function
const ChatWindow = () => {
  // State
  const [file, setFile] = useState("");
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Use Function
  const showToast = useShowToast();
  const fileRef = useRef();

  return (
    <Box bg={'#fff'} minH={"100vh"} maxH={"100vh"}>
        {/* Header */}
        <Flex alignItems={"center"} justifyContent={"space-between"} pl={10} pr={5} py={3} mb={2} border={"1px solid red"}>
    
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
                <IconButton {...BUTTON_ICON_STYLE} bg={"#fff"} borderRadius={"full"} icon={<SlOptionsVertical/>}/>
            </Flex>
        </Flex>

        {/* Messages */}
        <Box border={"1px solid blue"} height={"78vh"}>
            
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
                        onEmojiClick={(emoji) => setInputText((prevText) => prevText + emoji.emoji)}/> 
                      </Box> }    
                      <Tooltip label={"Emoji"} {...TOOLTIPS_STYLE}>
                          <IconButton borderRadius={'full'} {...BUTTON_ICON_STYLE} _active={{opacity: 0.7}} icon={<MdOutlineEmojiEmotions color="#444" fontSize={'20px'} onClick={() => setShowEmojiPicker(!showEmojiPicker)}/>}/>
                      </Tooltip>
                    </Box>  

                    <FormControl>
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
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                    </FormControl>
                    <IconButton borderRadius={'full'} {...BUTTON_ICON_STYLE} _active={{opacity: 0.7}} icon={<BiSolidSend color="#444" fontSize={'20px'} />} isDisabled={inputText === ""}/>
                </Flex>
            </form>
        </Box>
  </Box>);
};

export default ChatWindow;
