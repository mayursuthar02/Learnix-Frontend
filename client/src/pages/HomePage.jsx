import { Avatar, Box, Button, Divider, Flex, Grid, IconButton, Image, Text, Tooltip } from "@chakra-ui/react";
import logo from "../assets/logoai.png";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// Iamge and Videos
// import BgVideo from "../assets/22908-331768732.mp4";
import profilePic from '../assets/profile.jpg';
import homePagePhoto from '../assets/homepagephoto.jpg';
// Icons
import { RiBookShelfFill } from "react-icons/ri";
import { PiChatsBold } from "react-icons/pi";
import { SiSemanticscholar } from "react-icons/si";
import { MdLogout } from "react-icons/md";
// State
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import HandleUserLogout from "../helpers/HandleUserLogout";
// Styles
import { BUTTON_STYLE, TOOLTIP_STYLE } from '../styles/globleStyles'


const HomePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  // Function
  const { handleUserLogoutFunc, loading } = HandleUserLogout();


  return (
    <Box minHeight={"100vh"} position={"absolute"} bg={"#131313"} zIndex={1}>
      <Box zIndex={"2"} w={"100vw"}>
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          px={"50px"}
          py={5}
        >
          <Flex alignItems={"center"} gap={2}>
            <Box
              width={"40px"}
              height={"40px"}
              borderRadius={"full"}
              overflow={"hidden"}
              className="logo-rotate-anime"
            >
              <Image src={logo} w={"100%"} h={"100%"} objectFit={"cover"} />
            </Box>
            <Text
              className="header-logo-text"
              fontWeight={"600"}
              fontSize={"30px"}
            >
              Learnix
            </Text>
          </Flex>
          <Flex alignItems={'center'} gap={2} bg={'#1e1f20'} borderRadius={'full'}>
            {!user && (
              <Button
                borderRadius={"full"}
                fontWeight={"400"}
                bg={"#1f4cec"}
                color={"#fff"}
                _hover={{ bg: "#183bb9" }}
                as={RouterLink}
                to={'/login'}
              >
                Sign in
              </Button>
            )}
            {user && (
              <Tooltip label={user?.fullName} {...TOOLTIP_STYLE}>
                <Avatar src={user?.profilePic}/>
              </Tooltip>
            )}
            {user && (
              <Tooltip hasArrow label={"Logout"} {...TOOLTIP_STYLE}>
                <IconButton size={'lg'} {...BUTTON_STYLE} fontSize={'20px'}  icon={<MdLogout/>} onClick={handleUserLogoutFunc} isLoading={loading}/>
              </Tooltip>
            )}
          </Flex>
        </Flex>

        <Grid gridTemplateColumns={'1fr 1fr'} gap={2} mt={'50px'} height={'500px'} mx={20} px={20}>
          <Flex justifyContent={'center'} alignItems={'center'}>
            <Box w={'500px'}>
              <Text className="header-logo-text" fontSize={'100px'} fontWeight={'500'}>Learnix</Text>
              <Text color={'#fff'} fontSize={'32px'} mt={-3} lineHeight={'35px'} fontWeight={'500'}>Your AI Study Companion for <br/>College Success</Text>
              <Text color={'#7f7f7f'} fontSize={'16px'} lineHeight={'22px'} mt={4} fontWeight={'300'}>Get instant access to subject materials, homework help, and expert answers to your academic questions.</Text>
              <Button
                borderRadius={"full"}
                fontWeight={"400"}
                px={5}
                bg={"#1f4cec"}
                color={"#fff"}
                mt={6}
                _hover={{ bg: "#183bb9" }}
                as={RouterLink}
                to={'/chats'}
              >
                Get Start
              </Button>
            </Box>
          </Flex>
          <Flex justifyContent={'center'} alignItems={'center'} position={'relative'}>
              <Box w={'420px'} h={'420px'} borderRadius={'3xl'} mr={20} overflow={'hidden'}>
                <Image src={homePagePhoto} objectFit={'cover'}/>
              </Box>
              <Flex w={'400px'} position={'absolute'} bottom={'22px'} right={'25px'} bg={'#131313'} borderRadius={'3xl'} gap={4} p={4}>
                <Avatar src={profilePic} size={'md'}/>
                <Text color={'#fff'} fontSize={'15px'} fontWeight={'400'}>This app has transformed my studying! Instant access to materials and expert help is a lifesaver. Highly recommend!</Text>
              </Flex>
          </Flex>
        </Grid>

        <Box mx={20} px={20} border={'1x solid #fff'} mt={'100px'} mb={20}>
          <Flex justifyContent={'center'} color={'#fff'} fontSize={'30px'} fontWeight={'500'}>Why Choose Learnix?</Flex>

          <Grid gridTemplateColumns={'1fr 1fr 1fr'} gap={10} mt={10} color={'#fff'}>
            <Box border={'2px solid #222'} borderRadius={'3xl'} py={5} px={7}>
              <Flex align={'center'} gap={3}  fontSize={'28px'}>
                <RiBookShelfFill/>
                <Text fontWeight={'500'}>Subject Materials</Text>
              </Flex>
              <Divider borderColor={'#333'} mt={2} mb={3}/>
              <Text fontSize={'15px'} fontWeight={'400'} mt={2}>Access comprehensive study materials across various subjects, tailored to your curriculum.</Text>
            </Box>

            <Box border={'2px solid #222'} borderRadius={'3xl'} p={5}>
              <Flex align={'center'} gap={3}  fontSize={'28px'}>
                <PiChatsBold/>
                <Text fontWeight={'500'}>24/7 AI Support</Text>
              </Flex>
              <Divider borderColor={'#333'} mt={2} mb={3}/>
              <Text fontSize={'15px'} fontWeight={'400'} mt={2}>Get instant answers to your questions anytime, anywhere with our AI-powered chat system.</Text>
            </Box>

            <Box border={'2px solid #222'} borderRadius={'3xl'} p={5}>
              <Flex align={'center'} gap={3}  fontSize={'28px'}>
                <SiSemanticscholar/>
                <Text fontWeight={'500'}>Personalized Learning</Text>
              </Flex>
              <Divider borderColor={'#333'} mt={2} mb={3}/>
              <Text fontSize={'15px'} fontWeight={'400'} mt={2}>Experience adaptive learning that adjusts to your pace and understanding level.</Text>
            </Box>
          </Grid>
        </Box>
      </Box>
      
    </Box>
  );
};

export default HomePage;
