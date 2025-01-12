import React, { useState } from 'react'
import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Text, Link, Image} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate} from 'react-router-dom';

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import AiLogo from '../assets/logoai.png'

import useShowToast from '../hooks/useShowToast';
import {useRecoilState} from 'recoil';
import userAtom from '../atoms/userAtom';


const LoginPage = () => {
  const showToast = useShowToast(); //For toast
  const navigate = useNavigate();
  const [_, setUser] = useRecoilState(userAtom);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  


  // Handle Signup Function
  const handleSubmit = async() => {
    if (!email || !password) {
      showToast("Error", "All fields is required!", 'error');
      return;
    }
    setIsLoading(true);
    try {
      const ressponse = await fetch('/api/auth/admin-login', {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email, password})
      });
      const data = await ressponse.json();
      if (data.error) {
        showToast('Error', data.error, "error");
        return;
      }
      localStorage.setItem('learnixAdminUser', JSON.stringify(data.userData));
      setUser(data.userData);
      showToast('Success', data.message, "success");
      console.log(data.userData);
      navigate('/dashboard/');
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
            Access smarter learning – login to Learnix AI today! 🤖
            </Text>
          </Stack>
        
          <FormControl id="email" isRequired mb={4}>
            <FormLabel>Email</FormLabel>
            <Input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com"/>
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

          <Stack spacing={10} pt={2}>
              <Button
                isLoading={isLoading}
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
                Login
              </Button>
          </Stack>

          <Stack pt={6}>
              <Text align={"center"}>
                Don't have an account?{" "}
                <Link as={RouterLink} to={"/signup"} className='link-color'>
                  SignUp
                </Link>
              </Text>
          </Stack>
        </Box>
        
    </Flex>
  )
}

export default LoginPage