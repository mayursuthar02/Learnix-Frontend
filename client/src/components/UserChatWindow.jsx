import { Avatar, Box, Divider, Flex, FormControl, IconButton, Input, Text, Tooltip } from "@chakra-ui/react"

// Components
import EmojiPicker from 'emoji-picker-react';

// Icons
import { SlOptionsVertical } from "react-icons/sl";
import { BiSolidSend } from "react-icons/bi";
import { ImAttachment } from "react-icons/im";
import { MdOutlineEmojiEmotions } from "react-icons/md";

// Functions
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";

// Styles
import { BUTTON_STYLE, TOOLTIP_STYLE } from "../styles/globleStyles"

const mockData = [
    {sender: "user", text: "Hello"},
    {sender: "user", text: "How are you ?"},
    {sender: "", text: "I am fine."},
    {sender: "user", text: "Good."},
    {sender: "", text: "How are you ?"},
    {sender: "", text: "I hope you will be fine."},
    {sender: "user", text: "Hello"},
    {sender: "user", text: "How are you ?"},
    {sender: "", text: "I am fine."},
    {sender: "user", text: "Good."},
    {sender: "", text: "How are you ?"},
    {sender: "", text: "I hope you will be fine."},
]


const UserChatWindow = () => {
    // State
    const [file, setFile] = useState("");
    const [inputText, setInputText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Use Function
    const showToast = useShowToast();
    const fileRef = useRef();
    
    
  return (
    <Box bg={'#131313'} minH={"100vh"} maxH={"100vh"}>

        {/* <Text>Start Chat Now</Text> */}

        {/* Header */}
        <Flex alignItems={"center"} justifyContent={"space-between"} pl={10} pr={5} py={3} mb={2}>

            <Flex justifyContent={"center"} flexDir={"column"}>
                <Flex alignItems={"center"} gap={3}>
                    {/* <Flex>
                        <Avatar border={"4px solid #131313"} src="https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"/>
                        <Avatar border={"4px solid #131313"} ml={"-35px"} src="https://c8.alamy.com/comp/KEDB24/handsome-young-man-profile-KEDB24.jpg"/>
                        <Avatar border={"4px solid #131313"} ml={"-35px"} src="https://i.pinimg.com/474x/98/51/1e/98511ee98a1930b8938e42caf0904d2d.jpg"/>
                        <Flex alignItems={"center"} justifyContent={"center"} border={"4px solid #131313"} ml={"-35px"} w={"50px"} h={"50px"} borderRadius={"full"} color={"#fff"} bg={"#242424"} zIndex={2}>+99</Flex>
                    </Flex> */}
                    <Avatar/>
                    <Flex justifyContent={"center"} flexDirection={"column"} w={"180px"}>
                        <Text color={"#fff"} fontSize={"17px"}>Friends Forever</Text>
                        <Flex color={"#666"} fontSize={"13px"} gap={1} alignItems={"center"}>
                            <Text className="header-logo-text">@mayur</Text>
                            Typing...
                        </Flex>
                    </Flex>
                </Flex>
                
            </Flex>
            
            <Flex>
                <IconButton {...BUTTON_STYLE} bg={"#131313"} icon={<SlOptionsVertical/>}/>
            </Flex>
        </Flex>

        
        {/* Chat List */}
        <Box height={"560px"} overflow="scroll" mb={2} position={"relative"} px={"100px"}>
          {mockData.map((message, i) => {
            const isSameSenderAsPrevious =
              i > 0 && mockData[i - 1].sender === message.sender;
        
            return (
                    <Flex
                      key={i}
                      align={"center"}
                      gap={3}
                      justifyContent={message?.sender === "user" ? "end" : "start"}
                    >
                        {message?.sender !== "user" && !isSameSenderAsPrevious && <Avatar />}
            
                        <Text
                          color={"#fff"}
                          bg="linear-gradient(60deg, #4796e3, #336dff, #492cbe)"
                          py={1.5}
                          px={3}
                          maxWidth={"400px"}
                          fontWeight={"300"}
                          borderRadius={"20px"}
                          
                        >
                          {message.text}
                        </Text>
            
                        {message?.sender === "user" && !isSameSenderAsPrevious && <Avatar />}
                    </Flex>
                );
            })}            
            {/* Bottom Greadient */}
            <Box w={'100%'} height={'50px'} bg="linear-gradient( transparent, #131313)" position={"sticky"} bottom={0} left={0} zIndex={2}></Box>
        </Box>
        
        
        {/* Input Box */}
        <Box display={"flex"} justifyContent={"center"} py={3}>
            <form onSubmit={(e) => e.preventDefault()}>
                <Flex alignItems={'end'} border={'1px solid #333'} gap={1} borderRadius={'30px'} p={1} w={'50vw'} transition={'width .5s ease-in-out'} minH={'50px'}>
                    <Box>
                      <Input type="file" hidden ref={fileRef} onChange={(e) => setFile(e.target.files[0])}/>
                      <Tooltip label={"Attachment"} {...TOOLTIP_STYLE}>
                        <IconButton borderRadius={'full'} {...BUTTON_STYLE} _active={{opacity: 0.7}} icon={<ImAttachment color="#fff" fontSize={'20px'} />}/>
                      </Tooltip>
                    </Box>

                    <Box position={"relative"}>       
                      {showEmojiPicker && <Box position={"absolute"} bottom={"50px"} zIndex={3} bg="#191919" borderRadius="10px" boxShadow="0px 4px 10px rgba(0, 0, 0, 0.5)">
                        <EmojiPicker 
                        theme="dark" 
                        emojiStyle="apple" 
                        searchDisabled={true}
                        skinTonesDisabled={true}
                        height={"400px"} width={"400px"}
                        onEmojiClick={(emoji) => setInputText((prevText) => prevText + emoji.emoji)}/> 
                      </Box> }    
                      <Tooltip label={"Emoji"} {...TOOLTIP_STYLE}>
                          <IconButton borderRadius={'full'} {...BUTTON_STYLE} _active={{opacity: 0.7}} icon={<MdOutlineEmojiEmotions color="#fff" fontSize={'20px'} onClick={() => setShowEmojiPicker(!showEmojiPicker)}/>}/>
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
                            color={'#e3e5e4'}
                            fontSize={'15px'}
                            _focusVisible={{ border: 'none', outline: 'none' }}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                    </FormControl>
                    <IconButton borderRadius={'full'} {...BUTTON_STYLE} _active={{opacity: 0.7}} icon={<BiSolidSend color="#fff" fontSize={'20px'} />} isDisabled={inputText === ""}/>
                </Flex>
            </form>
        </Box>
    </Box>
  )
}

export default UserChatWindow