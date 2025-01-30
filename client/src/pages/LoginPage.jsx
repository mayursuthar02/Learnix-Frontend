import { useState } from 'react'
import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Text, Link, Image} from '@chakra-ui/react';

// Icons and Logo
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import AiLogo from '../assets/logoai.png'

// Functions
import useShowToast from '../hooks/useShowToast';
import {useRecoilState} from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink, useNavigate} from 'react-router-dom';

// Styles
import { GRADIENT_BUTTON_STYLE, INPUT_STYLE } from '../styles/globleStyles';


const LoginPage = () => {
  const showToast = useShowToast(); //For toast
  const [_, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  
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
      const ressponse = await fetch('/api/auth/login', {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email, password})
      });
      const data = await ressponse.json();
      if (data.error) {
        showToast('Error', data.error, "error");
        return;
      }
      localStorage.setItem('learnixUserDetails', JSON.stringify(data.userData));
      setUser(data.userData);
      showToast('Success', data.message, "success");
      console.log(data.userData);
      navigate('/chats');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Flex alignItems={'center'} justifyContent={'center'} minH={'100vh'} width={'full'} bg={'#131313'} color={'#fff'}>

        <Box w={'500px'} borderRadius={'3xl'} p={'25px'}>
          <Stack align={"center"} mb={10}>
            <Flex align={'center'} gap={2} mb={2}>
              <Image src={AiLogo} w={'35px'} h={'35px'}/>
              <Heading fontSize={"30px"} fontWeight={'700'} textAlign={"center"} className='link-color'>
                Learnix
              </Heading>
            </Flex>
            <Text fontSize={"17px"} fontWeight={'400'}>
            Access smarter learning – login to Learnix AI today! 🤖
            </Text>
          </Stack>
        
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

          <Stack spacing={10} pt={2}>
              <Button isLoading={isLoading} onClick={handleSubmit} size={"lg"} {...GRADIENT_BUTTON_STYLE}>Login</Button>
          </Stack>

          <Stack pt={6}>
              <Text align={"center"} fontWeight={'400'}>
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