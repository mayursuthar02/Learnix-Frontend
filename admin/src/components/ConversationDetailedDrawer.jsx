import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Text } from "@chakra-ui/react";
import { MdArrowDownward } from "react-icons/md";
import { BUTTON_ICON_STYLE } from "../styles/globleStyles";
import { MdDelete } from "react-icons/md";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import userConversationAtom from "../atoms/userConversationAtom";
import selectedUserConversationAtom from "../atoms/selectedUserConversationAtom";

const ConversationDetailedDrawer = ({ isOpen, onClose, conversation }) => {
  const [loading, setLoading] = useState(false);
  const user = useRecoilValue(userAtom);
  const [userConversations, setUserConversations] = useRecoilState(userConversationAtom);
  const [selectedUserConversation, setSelectedUserConversation] = useRecoilState(selectedUserConversationAtom);
  const showToast = useShowToast();

  const deleteConversation = async() => {
    setLoading(true);
    try {
      const res = await fetch(`/api/userChats/deleteGroupConversation`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({conversationId: conversation?._id})
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Group chat deleted successfully", "success");
      setSelectedUserConversation("");
      setUserConversations((prevConversations) => 
        prevConversations.filter(
          (conv) => conv._id !== conversation?._id
        )
      );
    } catch (error) {
      showToast("Error", "Something went wrong.", "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
    
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
                        <Avatar src={conversation.members[1].profilePic} size={"sm"} border={"2px solid #fff"} ml={"-18px"}/>
                        <Avatar src={conversation.members[2].profilePic} size={"sm"} border={"2px solid #fff"} ml={"-18px"}/>
                        {conversation.members.length > 3 && <Flex fontSize={"12px"} pr={.5} align={"center"} justify={"center"} bg={"#dddeee"} ml={"-18px"} borderRadius={"full"} w={"32px"} height={"32px"} zIndex={1} border={"2px solid #fff"}>
                            +{conversation.members.length - 3}
                        </Flex>}
                    </Flex>
                    <Text fontSize={"15px"}>Members</Text>
                </Flex>

              {conversation?.groupAdmin?._id === user._id && <Button mt={3} {...BUTTON_ICON_STYLE} borderRadius={"full"} gap={2} onClick={deleteConversation} isLoading={loading}>
                  <MdDelete color="#555b64" fontSize={"17px"} />
                  <Text color={"#555b64"} fontSize={"16px"} fontWeight={"400"}>
                      Delete Chat
                  </Text>
              </Button>}
            </Flex>

            <Text fontSize={"18px"} mt={2} mb={3}>Users</Text>
            <Flex flexDir={"column"} gap={1} maxH={"380px"} overflowY={"scroll"}>
              {conversation.members.map((member) => (
                <Flex key={member?._id} alignItems={"center"} gap={3} bg={"#f0f4f9"} p={2} borderRadius={"15px"}>
                  <Avatar src={member?.profilePic} size={"sm"}/>
                  <Text fontSize={"18px"}>{member?.fullName}</Text>
                </Flex>
              ))}
            </Flex>
            {conversation.members.length > 5 && <Flex alignItems={"center"} justifyContent={"center"} gap={2} fontSize={"15px"} color={"#999"} mt={2}>
              <Text>see all users</Text>
              <MdArrowDownward/>
            </Flex>}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ConversationDetailedDrawer;
