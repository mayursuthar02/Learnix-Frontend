import { Avatar, AvatarBadge, Box, Button, Flex, Image, Spinner, Tab, TabIndicator, TabList, Tabs, Text, useDisclosure } from "@chakra-ui/react"
import {Link as RouterLink} from 'react-router-dom';

// Components
import SearchUsersModel from "../components/SearchUsersModel";

// Icons
import logoAi from "../assets/logoai.png";
import { FaPlus } from "react-icons/fa6";
import { MdArrowDownward } from "react-icons/md";

// Functions
import FetchAllUserConversations from "../helpers/FetchAllUserConversations";
import { useEffect, useState } from "react";
import userConversationAtom from "../atoms/userConversationAtom";
import { useRecoilState } from "recoil";

// STYLES
const BUTTON_STYLE = {
    display : "flex",
    alignItems : "center",
    gap : "1",
    borderRadius : "50px",
    bg : "#e2e8f0",
    _hover : { bg: "#ced5de"},
    _active : { bg: "#e2e8f0"},
    color : "#fff",
    fontWeight : "400",
  }


// Main Function
const MyChats = () => {
    // State
    const [loading, setLoading] = useState(true);
    const [userConversations, setUserConversations] = useRecoilState(userConversationAtom);
    // Functions
    const { isOpen, onOpen, onClose } = useDisclosure();
    const fetchAllUserConversationsFunc = FetchAllUserConversations();
    

    // Fetch All Chats
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchAllUserConversationsFunc(); 
            setLoading(false);
        };
        
        fetchData();
    }, []); 
    
  return (
    <>
        <Box padding={3} background={"#f0f4f9"}>
            {/* Logo */}
            <Flex display={"flex"} alignItems={"center"} gap={2} as={RouterLink} to={'/'} >
                <Box width={"40px"} height={"40px"} borderRadius={"full"} overflow={"hidden"} as={RouterLink} to={'/'} className="logo-rotate-anime" >
                    <Image src={logoAi} w={"100%"} h={"100%"} objectFit={"cover"} />
                </Box>
                <Text className="header-logo-text" fontWeight={"600"} fontSize={"30px"}>
                    Learnix
                </Text>
            </Flex>

            {/* New conversation button */}
            <Button mt={6} {...BUTTON_STYLE} w={"170px"} onClick={onOpen}>
                <FaPlus color="#555b64" fontSize={"15px"} />
                <Text color={"#555b64"} fontSize={"15px"} fontWeight={"400"}>
                    New Group
                </Text>
            </Button>

            <Flex align={"center"} gap={3} mb={3} mt={5}>
                <Text color={'#1f1f1f'} fontSize={'16px'} fontWeight={'400'}>Group</Text>
                <Flex align={'center'} justifyContent={'center'} fontSize={"12px"} w={5} h={5} color={"#4796e3"} bg={"#dddeee"} borderRadius={"full"}>4</Flex>
            </Flex>

            <Box maxH={"70vh"} overflowY={"scroll"}> 
                {userConversations.length > 0 ? (
                    !loading && userConversations.map((conversation,i) => (
                        <Flex key={conversation._id} _hover={{bg: "#dde3eb"}} transition={"background .3s ease"} cursor={"pointer"} py={3} px={3} borderRadius={"10px"} alignItems={"center"} justifyContent={"space-between"} gap={3} mb={1}>
                        <Box w={"45px"} height={"45px"} position={"relative"}>
                            <Avatar src={conversation.groupConversationIcon} w={"100%"} h={"100%"} objectFit={"cover"}/>
                            <Box w={"16px"} height={"16px"} bg={"#4796e3"} border={"3px solid #f0f4f9"} borderRadius={"full"} position={"absolute"} top={0} right={-1}></Box>
                        </Box>
                        <Flex justifyContent={"center"} flexDirection={"column"} w={"180px"}>
                            <Text color={"#1f1f1f"} fontSize={"17px"}>{conversation.conversationName}</Text>
                            <Flex color={"#555b64"} fontSize={"13px"} gap={1} alignItems={"center"}>
                                <Text className="header-logo-text">@mayur</Text>
                                How are you ?...
                            </Flex>
                        </Flex>
                        <Flex alignItems={"end"} justifyContent={"center"} flexDirection={"column"} gap={1}>
                            <Flex align={'center'} justifyContent={'center'} fontSize={"12px"} w={5} h={5} color={"#4796e3"} bg={"#dddeee"} borderRadius={"full"}>{i}</Flex>
                            <Text color={"#999"} fontSize={"13px"}>4 min ago</Text>
                        </Flex>
                    </Flex>
                    ))
                ) : (
                    <Text color={"#888"} textAlign={"center"} mt={5} fontSize={"17px"}>Chats Not Found</Text>
                )}

                {loading && <Flex align={"center"} justify={"center"} height={"40vh"}><Spinner size={"lg"} color="#888"/></Flex>}
            </Box>
            
            {userConversations.length > 7 && <Flex alignItems={"center"} justifyContent={"center"} gap={2} fontSize={"15px"} color={"#999"} mt={2}>more chats <MdArrowDownward/></Flex>}
        </Box>

        {/* Search Model */}
        <SearchUsersModel isOpen={isOpen} onClose={onClose}/>
    </>
  )
}

export default MyChats