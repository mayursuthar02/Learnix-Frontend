import { useEffect } from "react";
import { Box, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react"; // Divider for the hr tag
import { motion } from "framer-motion";
// Text Format
import ReactMarkdown from "react-markdown";
import hljs from "highlight.js"; // Import Highlight.js
import "highlight.js/styles/github-dark.css"; // Import Highlight.js theme
// Icons
import { TbCopy } from "react-icons/tb";
// Function
import useShowToast from '../hooks/useShowToast.js';
import { BUTTON_STYLE, TOOLTIP_STYLE } from "../styles/globleStyles.js";

// Create a motion component for the Box
const MotionBox = motion(Box);

const AiResponse = ({ message }) => {
  const showToast = useShowToast();
  
  useEffect(() => {
    hljs.highlightAll();
  }, [message]);

  // Copy Code
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(
      () => {
        showToast("success", "Code copied to clipboard!", "success");
      },
      (err) => {
        console.error("Failed to copy code: ", err);
      }
    );
  };


  return (
    <MotionBox
      color={"#fff"}
      borderRadius={"20px"}
      py={2}
      maxWidth={"90%"}
      maxH={'auto'}
      fontWeight={"300"}
      mb={3}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="aiResponse"
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
    </MotionBox>
  );
};

export default AiResponse;
