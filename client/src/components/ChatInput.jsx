import { Box, Input, Flex, FormControl, IconButton, Textarea, Tooltip, Text } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";

// Icons
import { BiSolidSend } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { PiHandWavingBold } from "react-icons/pi";
import { RiMic2AiFill } from "react-icons/ri";
import { ImAttachment } from "react-icons/im";

// Functions
import useShowToast from "../hooks/useShowToast";
import { motion, AnimatePresence } from "framer-motion";

// Styles
import {TOOLTIP_STYLE, GRADIENT_BUTTON_STYLE, BUTTON_STYLE} from '../styles/globleStyles';

// Data
import { placeholderTexts } from "../data/textsForAnimation";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";


// MAIN FUNCTION
const ChatInput = ({conversationId, startConversation, isScholaraActive,setUserReplyLoading, activateScholara, setMessages, botResponseLoading}) => {
    const [prompt, setPrompt] = useState("");
    const [textAreaRow, setTextAreaRow] = useState(1);
    const [isMicPopupOpen, setIsMicPopupOpen] = useState(false); // Mic popup state
    const [isListening, setIsListening] = useState(false); // Speech recognition state
    const [interimText, setInterimText] = useState(""); // Temporary text from speech recognition
    const [file, setFile] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    // Use Function
    const showToast = useShowToast();
    const fileRef = useRef();
    const user = useRecoilValue(userAtom);
     

    // Loop through the Text Animation Effect
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % placeholderTexts.length);
      }, 3000); // Change text every 2 seconds
      return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);
  
    const handleTextareaChange = (event) => {
        setPrompt(event.target.value);
    }

    // User prompt
    const userPrompt = async() => {
      if (!prompt) {
        showToast("Error", "Prompt is required", "error");
        return;
      }
      
      setUserReplyLoading(true);
      try {
        const response = await fetch(`/api/messages/userPrompt`, {
          method: "POST",
          headers: {
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({conversationId, prompt: prompt})
        });
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        console.log(data);
        setMessages((prev) => [...prev, data.data]);
        activateScholara(prompt);
        setPrompt('');       
      } catch (error) {
        console.log(error);
      } finally {
        setUserReplyLoading(false);
      }
    }

    const handleKeyDown = async(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            // Store in Database
            userPrompt();
        }

        if (event.shiftKey && event.key === 'Enter') {
            if (textAreaRow > 3) {
                setTextAreaRow(4);
            } else {
                setTextAreaRow(textAreaRow + 1);
            }
        }
    };

    // Speech Recognition Logic
    const startSpeechRecognition = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      // Check if the browser supports Speech Recognition
      if (!SpeechRecognition) {
        showToast("Error", "Speech Recognition API is not supported in this browser", "error");
        return;
      }

      // Handle different browser behaviors
      const recognition = new SpeechRecognition();
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += text;
          } else {
            setInterimText(text);
          }
        }
        setPrompt((prev) => prev + finalText);
        setInterimText(""); // Clear interim text after final result
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        showToast("Error", "Speech recognition failed, try again.", "error");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    };

    
    return (
        <Box mb={5} pos={"relative"}>
            <form onSubmit={(e) => e.preventDefault()}>
                <Flex alignItems={'end'} border={'1px solid #333'} gap={1} borderRadius={'30px'} p={1} w={'50vw'} transition={'width .5s ease-in-out'} minH={'50px'} className={isListening ? "input active" : "input"}>
                    <Box>
                      <Input type="file" hidden ref={fileRef} onChange={(e) => setFile(e.target.files[0])}/>
                      <Tooltip label={"Attachment"} {...TOOLTIP_STYLE}>
                        <IconButton borderRadius={'full'} onClick={() => {fileRef.current.click()}} {...BUTTON_STYLE} _active={{opacity: 0.7}} icon={<ImAttachment color="#fff" fontSize={'20px'} />} isDisabled={!isScholaraActive}/>
                      </Tooltip>
                    </Box>
                  
                    <FormControl zIndex={3}>
                        <Textarea 
                            isDisabled={!isScholaraActive}
                            value={prompt}
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown}
                            resize="none"   // Prevent resizing
                            rows={1}        // Control visible rows
                            minHeight="40px" // Set a fixed minimum height
                            height="auto"   // Allow auto height based on content
                            overflow="hidden" // Prevent vertical scrolling
                            borderRadius={'30px'}
                            // background={"#1e1f20"}
                            border={'none'}
                            outline={'none'}
                            color={'#e3e5e4'}
                            fontSize={'15px'}
                            _focusVisible={{ border: 'none', outline: 'none' }}
                        />
                    </FormControl>
                        
                    <IconButton borderRadius={'full'} onClick={() => {userPrompt(); setPrompt('')}} {...BUTTON_STYLE} _active={{opacity: 0.7}} icon={<BiSolidSend color="#fff" fontSize={'20px'} />} isDisabled={!isScholaraActive}/>
                    
                    <IconButton borderRadius={'full'} onClick={() => {setIsMicPopupOpen(true); startSpeechRecognition()}} {...BUTTON_STYLE} _active={{opacity: 0.7}} icon={<RiMic2AiFill color="#fff" fontSize={'20px'} />} isDisabled={botResponseLoading || !isScholaraActive}/>

                    <Tooltip label={"Hello!"} {...TOOLTIP_STYLE}>
                        <IconButton onClick={() => {startConversation()}} {...GRADIENT_BUTTON_STYLE} isDisabled={botResponseLoading} icon={<PiHandWavingBold color="#fff" fontSize={'20px'} />}/>
                    </Tooltip>
                    
                    <Tooltip label={"Activate Scholara"} {...TOOLTIP_STYLE}>
                        <IconButton onClick={()=> {activateScholara("Hello!")}} {...GRADIENT_BUTTON_STYLE} isDisabled={botResponseLoading} icon={<BsStars color="#fff" fontSize={'20px'} />}/>
                    </Tooltip>
                </Flex>
            </form>

            {/* Animation Text  */}
            {!prompt && <Box pos={"absolute"} top={"13px"} left={"65px"} zIndex={1}>
              <AnimatePresence mode="wait">
                <motion.div key={currentIndex} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }}>
                  <Text textAlign={'left'} fontSize={"15px"} fontWeight={"500"} color={"#555"} maxW={"520px"} overflow={"hidden"}>
                    {placeholderTexts[currentIndex]}
                  </Text>
                </motion.div>
              </AnimatePresence>
            </Box>}
        </Box>
    )
}

export default ChatInput