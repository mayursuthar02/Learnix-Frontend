import { Avatar, Box, Flex, Spinner } from "@chakra-ui/react";


const TypingIndicator = ({user}) => {
  return (
    <Flex align={"center"} gap={3} mt={3}>
        <Avatar src={user?.profilePic} w={"40px"} h={"40px"}/>
        {/* <Spinner color="#333"/> */}
        <Flex alignItems={"center"} gap={1} bg={"#222"} py={3} px={3} borderRadius={"full"}>
          {[1,2,3].map((_,i) => (
            <Box key={i} w={2} h={2} borderRadius={"full"} bg={"#444"} className="typingEffect"></Box>
          ))}
        </Flex>
    </Flex>
  );
};

export default TypingIndicator;
