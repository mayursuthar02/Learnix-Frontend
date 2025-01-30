import { Avatar, AvatarBadge, Box, Flex, Image, Tab, TabIndicator, TabList, Tabs, Text } from "@chakra-ui/react"
import {Link as RouterLink} from 'react-router-dom';
// Icons
import logoAi from "../assets/logoai.png";

const UserChatList = () => {
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
        <Flex align={'center'} justifyContent={'center'} fontSize={"12px"} w={5} h={5} color={"#4796e3"} bg={"#222"} borderRadius={"full"}>4</Flex>
      </Flex>

      <Box> 
        {[1,2,3,4,5,6].map((_,i) => (
            <Flex key={i} _hover={{bg: "#242424"}} transition={"background .3s ease"} cursor={"pointer"} py={3} px={3} borderRadius={"10px"} alignItems={"center"} justifyContent={"space-between"} gap={3} mb={1}>
            <Box w={"45px"} height={"45px"} position={"relative"}>
                <Avatar w={"100%"} h={"100%"} objectFit={"cover"}/>
                <Box w={"16px"} height={"16px"} bg={"#4796e3"} border={"3px solid #191919"} borderRadius={"full"} position={"absolute"} top={0} right={-1}></Box>
            </Box>
            <Flex justifyContent={"center"} flexDirection={"column"} w={"180px"}>
                <Text color={"#fff"} fontSize={"17px"}>Friends Forever</Text>
                <Flex color={"#666"} fontSize={"13px"} gap={1} alignItems={"center"}>
                    <Text className="header-logo-text">@mayur</Text>
                    How are you ?...
                </Flex>
            </Flex>
            <Flex alignItems={"end"} justifyContent={"center"} flexDirection={"column"} gap={1}>
                <Flex align={'center'} justifyContent={'center'} fontSize={"12px"} w={5} h={5} color={"#4796e3"} bg={"#222"} borderRadius={"full"}>4</Flex>
                <Text color={"#666"} fontSize={"13px"}>4 min ago</Text>
            </Flex>
        </Flex>
        ))}
      </Box>
    </Box>
  )
}

export default UserChatList