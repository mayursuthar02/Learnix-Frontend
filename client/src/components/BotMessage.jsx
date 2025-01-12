import { Box, Button, Flex, Link, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// Icons
import { RiLinkM } from "react-icons/ri";

const MotionText = motion(Text);
const MotionButton = motion(Button);

const BotMessage = ({ message, handleUserReply, isScholaraActive }) => {
  const [buttonsAnimated, setButtonsAnimated] = useState(false);
  const [messageCompleted, setMessageCompleted] = useState(false);
  const wordArray = message?.botResponse?.message.split("");

  let noteWordArray = [];
  if (message?.botResponse?.note) {
    noteWordArray = message?.botResponse?.note.split("");
  }

  useEffect(() => {
    if (messageCompleted && message?.botResponse?.options) {
      setButtonsAnimated(true);
    }
  }, [messageCompleted, message?.botResponse?.options]);

  // Handle option selection
  const handleOptionClick = async (option) => {
    handleUserReply(option.option, option?.apiRoute);
  };

  return (
    <>
      <MotionText
        bgColor={""}
        color={"#fff"}
        borderRadius={"20px"}
        py={0}
        px={0}
        maxWidth={"400px"}
        fontWeight={"300"}
        mb={3}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {wordArray.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onAnimationComplete={() => {
              if (index === wordArray.length - 1) {
                setMessageCompleted(true); // Set messageCompleted to true when last character animates
              }
            }}
            transition={{ delay: index * 0.005 }} // Controls the delay between each character
          >
            {char}
          </motion.span>
        ))}
      </MotionText>

      {/* For Materials */}
      {message?.botResponse?.resources && (
        <Box as="ul" alignItems={"center"} gap={4}>
          {message?.botResponse?.resources.map((resource, index) => (
            <motion.li
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Tooltip key={index} label={resource.resourceLink} bg={'#222'} color={'#fff'} fontWeight={'400'} borderRadius={'md'} p={3}>
                <Link
                  href={resource.resourceLink}
                  border={'1px solid #222'}
                  color={"#4b90ff"}
                  borderRadius={"20px"}
                  px={4}
                  py={2}
                  maxWidth={"400px"}
                  minWidth={'auto'}
                  fontWeight={"400"}
                  display={"flex"}
                  alignItems={"center"}
                  gap={2}
                  mb={3}
                  target="_blank"
                >
                  <RiLinkM />
                  {resource.title}
                </Link>
              </Tooltip>
            </motion.li>
          ))}
        </Box>
      )}

      {/* For Notes */}
      {message?.botResponse?.note && buttonsAnimated && (
        <MotionText
          bgColor={""}
          color={"#fff"}
          borderRadius={"20px"}
          py={0}
          px={0}
          maxWidth={"400px"}
          fontWeight={"300"}
          mb={3}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {noteWordArray.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.005 }} // Controls the delay between each character
            >
              {char}
            </motion.span>
          ))}
        </MotionText>
      )}

      {/* For Button Option */}
      {buttonsAnimated && (
        <Flex
          as="ul"
          align="center"
          gap={2}
          wrap="wrap"
          maxWidth="400px"
          mt={2}
        >
          {message?.botResponse?.options?.map((option, index) => (
            <motion.li
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                isDisabled={isScholaraActive}
                w="inherit"
                bg="#222"
                color="white"
                borderRadius="30px"
                textTransform={"capitalize"}
                fontWeight="300"
                _hover={{ bg: "#333" }}
                _active={{ opacity: 0.8 }}
                onClick={() => handleOptionClick(option)}
              >
                {option.option}
              </Button>
            </motion.li>
          ))}
        </Flex>
      )}
    </>
  );
};

export default BotMessage;
