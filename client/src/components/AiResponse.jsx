import { useEffect, useRef, useState } from "react";
import { Box, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react"; // Divider for the hr tag
import { motion } from "framer-motion";
// Text Format
import ReactMarkdown from "react-markdown";
import hljs from "highlight.js"; // Import Highlight.js
import "highlight.js/styles/github-dark.css"; // Import Highlight.js theme
// Icons
import { TbCopy } from "react-icons/tb";
import { RiVoiceAiFill } from "react-icons/ri";
import { FaStop } from "react-icons/fa6";
import { GrFormCheckmark } from "react-icons/gr";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { MdOutlineTranslate } from "react-icons/md";
// Function
import useShowToast from '../hooks/useShowToast.js';
import { BUTTON_STYLE, TOOLTIP_STYLE } from "../styles/globleStyles.js";


// Create a motion component for the Box
const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

// const translateText = async (text, targetLanguage) => {
//   const url = 'https://api.apilayer.com/language_translate/translate';
//   const apiKey = '2ZoSMTqkQMdKVMLTOGpW8E0ZriQRzScN'; // Replace with your API Layer key

//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'apikey': apiKey,
//     },
//     body: JSON.stringify({
//       text: text,
//       target: targetLanguage,
//       source: 'auto', // Auto-detect language
//     }),
//   });

//   if (!response.ok) {
//     throw new Error(`Error: ${response.statusText}`);
//   }

//   const data = await response.json();
//   return data.translated_text;
// };


const AiResponse = ({ message }) => {
  // State
  const [responseType, setResponseType] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [isCopied, setIsCopied] = useState(<TbCopy/>);
  const [translatedText, setTranslatedText] = useState("");
  // Function
  const showToast = useShowToast();
  const containerRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  

  useEffect(() => {
    // Apply highlight only after the DOM updates
    const codeBlocks = containerRef.current?.querySelectorAll("pre code");
    codeBlocks?.forEach((block) => hljs.highlightElement(block));
  }, [message]);

  // Copy Code
  const handleCopy = (code) => {
    setIsCopied(<GrFormCheckmark fontSize={"22px"}/>);
    navigator.clipboard.writeText(code).then(
      () => {
        showToast("success", "Code copied to clipboard!", "success");
      },
      (err) => {
        console.error("Failed to copy code: ", err);
      }
    );
    setTimeout(() => {
      setIsCopied(<TbCopy/>);
    }, 1500);
  };

  // Handle response Good or Bad type
  const userLikeDislikeResponse = async(goodOrBad) => {
    setIsLoading(goodOrBad);
    try {
      const response = await fetch(`/api/messages/userLikeDislikeResponse/${message._id}`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({responseType: goodOrBad})
      })
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      message.responseType = goodOrBad;
    } catch (error) {
      console.log(error);
      showToast("Error", "Something went wrong.", "error");
    } finally {
        setIsLoading("");
    }
  }

  // Handle language translation toggle
  // const handleTranslation = async () => {
  //   const translated = await translateText(message.aiResponse, 'hi');
  //   // setTranslatedText(translated);
  //   console.log(translated);
  // };


  // Function to read out the AI response
  const handleReadResponse = async () => {
    if (!message?.aiResponse) {
      alert("No AI response to read");
      return;
    }
  
    setSpeaking(true);
    setAudioLoading(true);
    try {
      // Function to split long text into chunks and play audio
      const generateSpeech = async (text) => {
        const chunkSize = 1000;  // Adjust chunk size based on the API limits
        let audioChunks = [];
  
        // Split the text into chunks
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
          chunks.push(text.slice(i, i + chunkSize));
        }
  
        // Fetch audio for each chunk
        for (const chunk of chunks) {
          const response = await fetch('/api/chats/textToSpeech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            'Authorization': `Bearer sk_e1ddad2c577ca5ecf2ee3caccd7fec78bfa7c6f30ab15d2c`,
            body: JSON.stringify({ text: chunk })
          });
  
          if (!response.ok) {
            console.error("Failed to fetch speech:", response.statusText);
            showToast("Error", "The text is too long for speech synthesis. Please try with a shorter script.", "error");
            return;
          }
  
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          audioChunks.push(audioUrl);
        }
  
        // Combine and play the generated chunks
        const audio = new Audio();
        audio.src = audioChunks.join(',');  // Joining the chunks as URLs
        audio.play();
  
        // Reset speaking state when audio ends
        audio.onended = () => setSpeaking(false);
      };
  
      // Use the AI response text
      const text = message?.aiResponse;
      await generateSpeech(text);
  
    } catch (error) {
      console.error("Error with the speech request:", error);
      setSpeaking(false);
      alert("Failed to read the AI response.");
    } finally {
      // setSpeaking(false);
      setAudioLoading(false);
    }
  };
  


  const cancel = () => {
    setSpeaking(false);
  };
  
  

  return (
    <MotionBox
      color={"#fff"}
      borderRadius={"20px"}
      py={2}
      maxWidth={"50vw"}
      minWidth={"50vw"}
      w={"100%"}
      maxH={'auto'}
      fontWeight={"300"}
      mb={3}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="aiResponse"
      ref={containerRef}
    >
      <ReactMarkdown
        components={{
          code: ({ inline, className, children, ...props }) => {
            if (inline) {
              return (
                <Box
                  as="span"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                  {...props}
                >
                  {children}
                </Box>
              );
            }
            const language = className?.replace("language-", "") || "plaintext";
            const codeContent = String(children).trim();

            // Highlighted code block using Highlight.js
            return (
              <>
                <Flex align={'center'} justifyContent={'space-between'} bg={'#1e1f20'} borderRadius={'10px 10px 5px 5px'} mt={5} py={2} pl={5} pr={3} fontWeight={'400'}>  
                  <Text fontSize={'15px'} textTransform={'capitalize'}>{language}</Text>
                  <Tooltip label="Copy" {...TOOLTIP_STYLE}>
                    <IconButton {...BUTTON_STYLE} size={'md'} icon={<TbCopy/>} onClick={() => handleCopy(codeContent)}/>
                  </Tooltip>
                </Flex>
                <Box
                  as="pre"
                  overflowX="auto"
                  my={.5}
                  className={className || "language-plaintext"}
                >
                  <code>{children}</code>
                </Box>
              </>
            );
          },
        }}
      >
        {message?.aiResponse || "No response yet!"}
      </ReactMarkdown>

      <Flex mt={2} gap={2} w={"400px"}>
      <Tooltip {...TOOLTIP_STYLE} label={"Read"}>
        <MotionIconButton
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          {...BUTTON_STYLE}
          size={"sm"}
          fontSize={"17px"}
          onClick={speaking ? cancel : handleReadResponse}
          icon={speaking ? <FaStop fontSize={"13px"} /> : <RiVoiceAiFill />}
          className={speaking ? "voiceButtonGlowingAnimation active" : "voiceButtonGlowingAnimation"}
          isLoading={audioLoading}
        />
      </Tooltip>

      <Tooltip {...TOOLTIP_STYLE} label={"Translate"}>
        <MotionIconButton
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          {...BUTTON_STYLE}
          size={"sm"}
          fontSize={"17px"}
          icon={<MdOutlineTranslate />}
          // onClick={handleTranslation}
        />
      </Tooltip>

      <Tooltip {...TOOLTIP_STYLE} label={"Copy"}>
        <MotionIconButton
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          {...BUTTON_STYLE}
          size={"sm"}
          fontSize={"17px"}
          icon={isCopied}
          onClick={() => handleCopy(message?.aiResponse)}
        />
      </Tooltip>

      <Tooltip {...TOOLTIP_STYLE} label={"Good response"}>
        <MotionIconButton
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
          {...BUTTON_STYLE}
          size={"sm"}
          fontSize={"17px"}
          onClick={ () => userLikeDislikeResponse("good") }
          icon={message?.responseType === "good" ? <BiSolidLike/> : <BiLike/>}
          isLoading={isLoading === "good"}
        />
      </Tooltip>

      <Tooltip {...TOOLTIP_STYLE} label={"Bad response"}>
        <MotionIconButton
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
          {...BUTTON_STYLE}
          size={"sm"}
          fontSize={"17px"}
          onClick={ () => userLikeDislikeResponse("bad")}
          icon={message?.responseType === "bad" ? <BiSolidDislike/> : <BiDislike/>}
          isLoading={isLoading === "bad"}
        />
      </Tooltip>
    </Flex>
    </MotionBox>
  );
};

export default AiResponse;
