import React, { useState } from 'react'
import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Text, Link, Image, Checkbox, RadioGroup, Radio} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate} from 'react-router-dom';

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import AiLogo from '../assets/logoai.png'
import useShowToast from '../hooks/useShowToast';
import { GRADIENT_BUTTON_STYLE } from '../styles/globleStyles';



const SignUpPage = () => {
  // Function
  const showToast = useShowToast(); //For toast
  const navigate = useNavigate();
  // State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileType, setProfileType] = useState("");

  // Email Validation
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
      console.log(data);
      showToast("Success", data.message, "success");
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Flex alignItems={'center'} justifyContent={'center'} minH={'100vh'} width={'full'}>

        <Box border={'1px solid'} borderColor={'gray.100'} w={'500px'} borderRadius={'md'} p={'25px'}>
          <Stack align={"center"} mb={10}>
            <Flex align={'center'} gap={2} mb={2}>
              <Image src={AiLogo} w={'35px'} h={'35px'}/>
              <Heading fontSize={"30px"} fontWeight={'700'} textAlign={"center"} className='link-color'>
              Learnix
              </Heading>
            </Flex>
            <Text fontSize={"17px"} color={"gray.600"}>
            Access smarter learning – sign up to Learnix AI today! 🤖
            </Text>
          </Stack>
        
          <FormControl id="fullName" isRequired mb={4}>
            <FormLabel>FullName</FormLabel>
            <Input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="FullName"/>
          </FormControl>

          <FormControl id="email" isRequired mb={4}>
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com"/>
          </FormControl>

          <FormControl id="password" isRequired mb={4}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="******"/>
              <InputRightElement h={"full"}>
                <Button
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
              <Button {...GRADIENT_BUTTON_STYLE} size={"lg"} isLoading={isLoading} onClick={handleSubmit}>
                Sign Up
              </Button>
          </Stack>

          <Stack pt={6}>
              <Text align={"center"}>
                Already have an account?{" "}
                <Link as={RouterLink} to={"/"} className='link-color'>
                  Login
                </Link>
              </Text>
          </Stack>
        </Box>
        
    </Flex>
  )
}

export default SignUpPage