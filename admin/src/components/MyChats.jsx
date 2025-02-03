import { Avatar, AvatarBadge, Box, Button, Flex, Image, Tab, TabIndicator, TabList, Tabs, Text } from "@chakra-ui/react"
import {Link as RouterLink} from 'react-router-dom';
// Icons
import logoAi from "../assets/logoai.png";
import { FaPlus } from "react-icons/fa6";
import { MdArrowDownward } from "react-icons/md";

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
  return (
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
        <Button mt={6} {...BUTTON_STYLE} as={RouterLink} to={''} w={"170px"}>
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
            {[1,2,3,4,5,6,7,8,9,0].map((_,i) => (
                <Flex key={i} _hover={{bg: "#dde3eb"}} transition={"background .3s ease"} cursor={"pointer"} py={3} px={3} borderRadius={"10px"} alignItems={"center"} justifyContent={"space-between"} gap={3} mb={1}>
                <Box w={"45px"} height={"45px"} position={"relative"}>
                    <Avatar w={"100%"} h={"100%"} objectFit={"cover"}/>
                    <Box w={"16px"} height={"16px"} bg={"#4796e3"} border={"3px solid #f0f4f9"} borderRadius={"full"} position={"absolute"} top={0} right={-1}></Box>
                </Box>
                <Flex justifyContent={"center"} flexDirection={"column"} w={"180px"}>
                    <Text color={"#1f1f1f"} fontSize={"17px"}>Friends Forever</Text>
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
            ))}
        </Box>
        {12 > 7 && <Flex alignItems={"center"} justifyContent={"center"} gap={2} fontSize={"15px"} color={"#999"} mt={2}>more chats <MdArrowDownward/></Flex>}
    </Box>
  )
}

export default MyChats