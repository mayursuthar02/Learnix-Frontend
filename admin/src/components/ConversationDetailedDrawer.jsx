import { Avatar, Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Text } from "@chakra-ui/react";

const ConversationDetailedDrawer = ({ isOpen, onClose, conversation }) => {
    console.log(conversation)
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
            <Flex alignItems={"center"} flexDir={"column"} justifyContent={"center"} pt={10}>
                <Avatar src={conversation.groupConversationIcon} w={"110px"} h={"110px"} objectFit={"cover"}/>
                <Text fontSize={"23px"} mt={1} fontWeight={"400"} color={"#1f1f1f"}>{conversation.conversationName}</Text>

                <Flex mt={2} alignItems={"center"} flexDir={"column"} justify={"center"}>
                    <Flex align={"center"}>
                        <Avatar src={conversation.members[0].profilePic} size={"sm"} border={"2px solid #fff"}/>
                        <Avatar src={conversation.members[1].profilePic} size={"sm"} border={"2px solid #fff"} ml={"-22px"}/>
                        <Avatar src={conversation.members[2].profilePic} size={"sm"} border={"2px solid #fff"} ml={"-22px"}/>
                        {conversation.members.length > 3 && <Flex fontSize={"12px"} pr={.5} align={"center"} justify={"center"} bg={"#dddeee"} ml={"-22px"} borderRadius={"full"} w={"32px"} height={"32px"} zIndex={1} border={"2px solid #fff"}>
                            +{conversation.members.length - 3}
                        </Flex>}
                    </Flex>
                    <Text fontSize={"15px"}>Members</Text>
                </Flex>

                
            </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ConversationDetailedDrawer;
