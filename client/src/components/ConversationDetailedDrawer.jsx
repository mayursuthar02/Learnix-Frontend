import { Avatar, Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Text } from "@chakra-ui/react";
import { MdArrowDownward } from "react-icons/md";

const ConversationDetailedDrawer = ({ isOpen, onClose, conversation }) => {
    
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent bg={'#131313'} color={'#fff'}>
        <DrawerCloseButton borderRadius={'full'} _hover={{bg:"#222"}}/>
        <DrawerBody>
            <Flex alignItems={"center"} flexDir={"column"} justifyContent={"center"} pt={10}>
                <Avatar src={conversation.groupConversationIcon} w={"110px"} h={"110px"} objectFit={"cover"}/>
                <Text fontSize={"23px"} mt={1} fontWeight={"400"} color={"#fff"}>{conversation.conversationName}</Text>

                <Flex mt={2} alignItems={"center"} flexDir={"column"} justify={"center"}>
                    <Flex align={"center"}>
                        <Avatar src={conversation?.members[0]?.profilePic} size={"sm"} border={"3px solid #131313"}/>
                        <Avatar src={conversation?.members[1]?.profilePic} size={"sm"} border={"3px solid #131313"} ml={"-18px"}/>
                        <Avatar src={conversation?.members[2]?.profilePic} size={"sm"} border={"3px solid #131313"} ml={"-18px"}/>
                        {conversation?.members?.length > 3 && <Flex fontSize={"11px"} pr={.5} align={"center"} justify={"center"} bg={"#222"} ml={"-18px"} borderRadius={"full"} w={"32px"} height={"32px"} zIndex={1} border={"3px solid #131313"}>
                            +{conversation?.members?.length - 3}
                        </Flex>}
                    </Flex>
                    <Text fontSize={"15px"} fontWeight={"300"}>Members</Text>
                </Flex>
              </Flex>
              <Text fontSize={"18px"} mt={2} mb={3}>Users</Text>
              <Flex flexDir={"column"} gap={1} maxH={"390px"} overflowY={"scroll"}>
                {conversation.members.map((member) => (
                  <Flex key={member?._id} alignItems={"center"} gap={3} bg={"#191919"} p={2} borderRadius={"15px"}>
                    <Avatar src={member?.profilePic} size={"sm"}/>
                    <Text fontSize={"18px"} fontWeight={"300"}>{member?.fullName}</Text>
                  </Flex>
                ))}
              </Flex>
              {conversation.members.length > 5 && <Flex alignItems={"center"} justifyContent={"center"} gap={2} fontSize={"15px"} color={"#444"} mt={1}>
                <Text>see all users</Text>
                <MdArrowDownward/>
              </Flex>}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ConversationDetailedDrawer;
