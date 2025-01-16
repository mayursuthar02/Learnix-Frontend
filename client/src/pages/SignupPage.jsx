import { useState } from 'react'
import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Text, Link, Image, RadioGroup, Radio} from '@chakra-ui/react';

// Icons and Logo
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import AiLogo from '../assets/logoai.png'

// Functions
import { Link as RouterLink, useNavigate} from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

// Styles
import {GRADIENT_BUTTON_STYLE, INPUT_STYLE} from '../styles/globleStyles'

const SignupPage = () => {
  // Functions
  const showToast = useShowToast(); //For toast
  const navigate = useNavigate();
  // State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileType, setProfileType] = useState("");

  // Validation Function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format regex
    return emailRegex.test(email);
  };


  // Handle Signup Function
  const handleSubmit = async() => {
    if (!fullName || !email || !password) {
      showToast("Error", "All fields are required!", "error");
      return;
    }
    if (!validateEmail(email)) {
      showToast("Error", "Invalid email format!", "error");
      return;
    }
    if (!profileType) {
      showToast("Error", "Profile Type is required!", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({fullName, email, password, profileType})
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", data.message, "success");
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Flex alignItems={'center'} justifyContent={'center'} minH={'100vh'} width={'full'} bg={'#131313'} color={'#fff'} position={'relative'} overflow={'hidden'}>

        <Box w={'500px'} borderRadius={'3xl'} p={'25px'}>
          <Stack align={"center"} mb={10}>
            <Flex align={'center'} gap={2} mb={2}>
              <Image src={AiLogo} w={'35px'} h={'35px'}/>
              <Heading fontSize={"30px"} fontWeight={'700'} textAlign={"center"} className='link-color'>
                Learnix
              </Heading>
            </Flex>
            <Text fontSize={"17px"} fontWeight={'400'}>
              Access smarter learning – sign up to Learnix AI today! 🤖
            </Text>
          </Stack>
        
          <FormControl id="fullname" isRequired mb={4}>
            <FormLabel fontWeight={'400'}>FullName</FormLabel>
            <Input {...INPUT_STYLE} type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="FullName"/>
          </FormControl>

          <FormControl id="email" isRequired mb={4}>
            <FormLabel fontWeight={'400'}>Email</FormLabel>
            <Input {...INPUT_STYLE} type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com"/>
          </FormControl>

          <FormControl id="password" isRequired mb={4}>
            <FormLabel fontWeight={'400'}>Password</FormLabel>
            <InputGroup>
              <Input {...INPUT_STYLE} type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="******"/>
              <InputRightElement h={"full"}>
                <Button
                  _hover={{bg: "#222"}}
                  color={'#fff'}
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl id="profileType" isRequired mb={4}>
            <FormLabel>Profile Type</FormLabel>
              <RadioGroup onChange={setProfileType} value={profileType}>
                <Stack direction='row'>
                  <Radio value='professor'>Professor</Radio>
                  <Radio value='student'>Student</Radio>
                </Stack>
              </RadioGroup>
          </FormControl>
                  
          <Stack spacing={10} pt={2}>
              <Button isLoading={isLoading} onClick={handleSubmit} size={"lg"} {...GRADIENT_BUTTON_STYLE}>Sign Up</Button>
          </Stack>

          <Stack pt={6}>
              <Text align={"center"} fontWeight={'400'}>
                Already have an account?{" "}
                <Link as={RouterLink} to={"/login"} className='link-color'>
                  Login
                </Link>
              </Text>
          </Stack>
        </Box>
        
{/* 
        <Box width={'400px'} height={'400px'} position={'absolute'} top={0} left={0} className='authPageBGAnime'>
            <Image src={AiLogo} objectFit={'cover'}/>
        </Box> */}
    </Flex>
  )
}

export default SignupPage