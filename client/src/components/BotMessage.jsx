import { Avatar, Box, Button, Flex, Grid, Link, Text, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";

// Icons
import { RiLinkM } from "react-icons/ri";
import { FaUserLarge } from "react-icons/fa6";

// Styles
import { TOOLTIP_STYLE } from "../styles/globleStyles";

const MotionText = motion(Text);
const MotionButton = motion(Button);

const BotMessage = ({ message, handleUserReply, isScholaraActive, responseLoadingDisableButton }) => {
  
  // Handle option selection
  const handleOptionClick = async (option) => {
    if (option?.apiRoute) {
      // Log the correct route being used
      console.log("Selected option apiRoute:", option?.apiRoute);
      handleUserReply(option.option, option?.apiRoute);
    } else {
      console.log("Error: Missing API route for option:", option?.option);
    }
  };
  

  return (
    <>
      {/* Bot Message */}
      <MotionText
        bgColor={""}
        color={"#fff"}
        borderRadius={"20px"}
        py={0}
        px={0}
        maxWidth={"550px"}
        fontWeight={"300"}
        mb={3}
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
      >
        {message?.botResponse?.message}
      </MotionText>

      {/* Resources */}
      {message?.botResponse?.resources && (
  <Grid templateColumns={"repeat(2, 1fr)"} as="ul" alignItems={"center"} gap={4}>
    {message?.botResponse?.resources.map((resource, index) => (
      <motion.li
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
      >
        <Box bg={"#222"} px={4} py={3} borderRadius={"10px"} mb={2}>
          <Flex color={"#fff"} fontWeight={"500"} alignItems={"center"} gap={2} mb={1}>
            <Avatar src={resource?.authorProfilePic || ""} w={"30px"} h={"30px"} />
            <Text fontWeight={"400"}>{resource.author}</Text>
          </Flex>
          <Tooltip
            label={resource.resourceLink}
            {...TOOLTIP_STYLE}
            borderRadius={"md"}
            p={3}
          >
            <Link
              href={resource.resourceLink}
              color={"#4b90ff"}
              fontWeight={"400"}
              display={"flex"}
              alignItems={"center"}
              gap={2}
              target="_blank"
            >
              <RiLinkM />
              {resource.title}
            </Link>
          </Tooltip>
        </Box>
      </motion.li>
    ))}
  </Grid>
)}


      {/* Notes */}
      {message?.botResponse?.note && (
        <MotionText
          bgColor={""}
          color={"#fff"}
          borderRadius={"20px"}
          py={0}
          px={0}
          maxWidth={"500px"}
          fontWeight={"300"}
          mb={3}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
        >
          {message?.botResponse?.note}
        </MotionText>
      )}

      {/* Button Options */}
      {message?.botResponse?.options && (
        <Flex
          as="ul"
          align="center"
          gap={2}
          wrap="wrap"
          maxWidth="600px"
          mt={2}
        >
          {message?.botResponse?.options?.map((option, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Button
                isDisabled={isScholaraActive || responseLoadingDisableButton}
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
