import { useEffect, useState } from "react";
import { Avatar, AvatarBadge, Box, Flex, Image, Spinner, Tab, TabIndicator, TabList, Tabs, Text } from "@chakra-ui/react"
import {Link as RouterLink} from 'react-router-dom';
// Icons
import logoAi from "../assets/logoai.png";
import { FaPlus } from "react-icons/fa6";
import { MdArrowDownward } from "react-icons/md";
import { RiAttachment2 } from "react-icons/ri";

// Functions
import FetchAllUserConversations from "../helpers/FetchAllUserConversations";
import userConversationAtom from "../atoms/userConversationAtom";
import selectedUserConversationAtom from "../atoms/selectedUserConversationAtom";
import { useRecoilState } from "recoil";
import { format } from "date-fns";

const UserChatList = () => {
    // State
    const [loading, setLoading] = useState(true);
    const [userConversations, setUserConversations] = useRecoilState(userConversationAtom);
    const [selectedUserConversation, setSelectedUserConversation] = useRecoilState(selectedUserConversationAtom);
    // Functions
    const fetchAllUserConversationsFunc = FetchAllUserConversations();

    useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          await fetchAllUserConversationsFunc(); 
          setLoading(false);
      };
      
      fetchData();
    }, []); 
    
  
  return (
    <Box padding={3} background={"#191919"}>
        {/* Logo */}
      <Flex display={"flex"} alignItems={"center"} gap={2} as={RouterLink} to={'/'} >
        <Box
          width={"40px"}
          height={"40px"}
          borderRadius={"full"}
          overflow={"hidden"}
          as={RouterLink} to={'/'}
          className="logo-rotate-anime"
        >
          <Image src={logoAi} w={"100%"} h={"100%"} objectFit={"cover"} />
        </Box>
        <Text className="header-logo-text" fontWeight={"600"} fontSize={"30px"}>
          Learnix
        </Text>
      </Flex>

     <Flex align={"center"} gap={3} mb={5} mt={10}>
        <Text color={'#fff'} fontSize={'15px'} fontWeight={'400'}>Group</Text>
        <Flex align={'center'} justifyContent={'center'} fontSize={"12px"} w={5} h={5} color={"#4796e3"} bg={"#222"} borderRadius={"full"}>{userConversations.length}</Flex>
      </Flex>

      <Box maxH={"70vh"} overflowY={"scroll"}> 
      {console.log(userConversations)}
        {userConversations.length > 0 ? (
            !loading && userConversations.map((conversation,i) => (
                <Flex key={conversation._id} bg={selectedUserConversation._id === conversation._id ? "#242424" : "transparent"} _hover={{bg: "#242424"}} transition={"background .3s ease"} cursor={"pointer"} py={3} px={3} borderRadius={"10px"} alignItems={"center"} justifyContent={"space-between"} gap={3} mb={1} onClick={() => setSelectedUserConversation(conversation)}>
                    <Box w={"45px"} height={"45px"} position={"relative"}>
                        <Avatar src={conversation.groupConversationIcon} w={"100%"} h={"100%"} objectFit={"cover"}/>
                        {/* <Box w={"16px"} height={"16px"} bg={"#4796e3"} border={"3px solid #191919"} borderRadius={"full"} position={"absolute"} top={0} right={-1}></Box> */}
                    </Box>
                    <Flex justifyContent={"center"} flexDirection={"column"} w={"180px"}>
                        <Text color={"#fff"} fontSize={"17px"}>{conversation.conversationName}</Text>
                        <Flex color={"#666"} fontSize={"13px"} gap={1} alignItems={"center"}>
                            <Text className="header-logo-text" textTransform={"lowercase"}>@{conversation?.latestMessage?.sender?.fullName.split(" ")[0] || "-"}</Text>
                            {conversation?.latestMessage?.content?.length > 16 ? conversation?.latestMessage?.content.slice(0, 16) + "..." : conversation?.latestMessage?.content}
                            {conversation?.latestMessage?.attachments && <Box><RiAttachment2 fontSize={"16px"}/></Box>}
                        </Flex>
                    </Flex>
                    <Flex alignItems={"end"} justifyContent={"center"} flexDirection={"column"} gap={1}>
                        {conversation.unreadCount > 0 && (
                        <Flex align={'center'} justifyContent={'center'} fontSize={"12px"} w={5} h={5} color={"#4796e3"} bg={"#222"} borderRadius={"full"}>{conversation.unreadCount.count}</Flex>
                        )}
                        <Text color={"#666"} fontSize={"13px"} textTransform={"lowercase"}>{format(new Date(conversation.updatedAt), "h:mm a")}</Text>
                    </Flex>
                </Flex>
            ))
        ) : (
            <Text color={"#888"} textAlign={"center"} mt={5} fontSize={"17px"}>Chats Not Found</Text>
        )}
        {loading && <Flex align={"center"} justify={"center"} height={"40vh"}><Spinner size={"lg"} color="#888"/></Flex>}
      </Box>

      {userConversations.length > 7 && <Flex alignItems={"center"} justifyContent={"center"} gap={2} fontSize={"15px"} color={"#888"} mt={2}>more chats <MdArrowDownward/></Flex>}
    </Box>
  )
}

export default UserChatList