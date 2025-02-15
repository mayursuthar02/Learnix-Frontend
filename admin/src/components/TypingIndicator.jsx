import { Avatar, Box, Flex, Spinner } from "@chakra-ui/react";

const TypingIndicator = ({user}) => {
  return (
    <Flex align={"center"} gap={3} mt={3}>
        <Avatar src={user?.profilePic} w={"40px"} h={"40px"}/>
        {/* <Spinner color="#cccddd"/> */}
        <Flex alignItems={"center"} gap={1} bg={"#eeefff"} py={3} px={3} borderRadius={"full"}>
          {[1,2,3].map((_,i) => (
            <Box key={i} w={2} h={2} borderRadius={"full"} bg={"#cccddd"} className="typingEffect"></Box>
          ))}
        </Flex>
    </Flex>
  );
};

export default TypingIndicator;
