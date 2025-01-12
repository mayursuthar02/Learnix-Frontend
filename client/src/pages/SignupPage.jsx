import { useState } from 'react'
import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Text, Link, Image, RadioGroup, Radio} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate} from 'react-router-dom';

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import AiLogo from '../assets/logoai.png'

import useShowToast from '../hooks/useShowToast';
import {useRecoilState} from 'recoil';
import userAtom from '../atoms/userAtom';


const SignupPage = () => {
  const showToast = useShowToast(); //For toast
  const navigate = useNavigate();
  // const [_, setUser] = useRecoilState(userAtom);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileType, setProfileType] = useState("");

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
            <Input borderColor={'#222'} _hover={{borderColor: "#444"}} fontWeight={'400'} type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="FullName"/>
          </FormControl>

          <FormControl id="email" isRequired mb={4}>
            <FormLabel fontWeight={'400'}>Email</FormLabel>
            <Input borderColor={'#222'} _hover={{borderColor: "#444"}} fontWeight={'400'} type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com"/>
          </FormControl>

          <FormControl id="password" isRequired mb={4}>
            <FormLabel fontWeight={'400'}>Password</FormLabel>
            <InputGroup>
              <Input borderColor={'#222'}  _hover={{borderColor: "#444"}} fontWeight={'400'} type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="******"/>
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
              <Button
                isLoading={isLoading}
                fontWeight={'500'}
                size="lg"
                bg="linear-gradient(90deg, #4796E3, #6658ff, #ff5546)"
                color="white"
                borderRadius="full"
                transition="background-position 0.3s ease-in-out"
                bgSize="200% 200%"
                bgPos="0% 0%"
                _hover={{ bgPos: "100% 0%" }}
                _active={{ bgPos: "100% 0%", opacity: 0.9}}
                onClick={handleSubmit}
              >
                Sign Up
              </Button>
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