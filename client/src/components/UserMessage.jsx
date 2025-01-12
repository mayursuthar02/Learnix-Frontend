import { Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

// Create a motion component for Text
const MotionText = motion(Text);

const UserMessage = ({ message }) => {
  const wordArray = message?.userPrompt?.split(""); // Convert the message into an array of characters
  return (
    <MotionText
      bgColor={"#222"}
      color={"#fff"}
      borderRadius={"20px"}
      py={2}
      px={5}
      maxWidth={"400px"}
      fontWeight={"300"}
      mb={3}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {wordArray.map((char, index) => (
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
  );
};

export default UserMessage;
