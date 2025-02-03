import React, { useState } from 'react'
import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Text, Link, Image, RadioGroup, Radio, Grid, Tooltip, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogFooter, AlertDialogBody, useDisclosure} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate} from 'react-router-dom';

// Icons
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import AiLogo from '../assets/logoai.png'
import { FaCircleExclamation } from "react-icons/fa6";

// Functioon
import useShowToast from '../hooks/useShowToast';

// Styles
import { GRADIENT_BUTTON_STYLE } from '../styles/globleStyles';
import { useRef } from 'react';



const SignUpPage = () => {
  // Function
  const showToast = useShowToast(); //For toast
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef();
  // State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileType, setProfileType] = useState("professor");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [studentRollNo, setStudentRollNo] = useState("");

  // Email Validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email);
  };

  // Handle Model Open to confirm Details
  const handleModelOpen = () => {
    if (!profileType) {
      showToast("Error", "Profile Type is required!", "error");
      return;
    }
    
    if (!fullName || !email || !password || !phoneNumber || (profileType === "student" && !studentRollNo)) {
      showToast("Error", "All required fields must be filled!", "error");
      return;
    }

    if (!validateEmail(email)) {
      showToast("Error", "Invalid email format!", "error");
      return;
    }
    onOpen();
  }

  // Handle Signup Function
  const handleSubmit = async() => {
    setIsLoading(true);
    try {
      const userData = { fullName, email, password, profileType, phoneNumber };
      if (profileType === "student") {
        userData.studentRollNo = studentRollNo;
      }
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(userData)
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

          <Grid templateColumns={"1fr 1fr"} gap={5}>
          <FormControl id="phoneNumber" isRequired mb={4} position={"relative"}>
            <FormLabel fontWeight={'400'}>Phone No.</FormLabel>
            <Input type="text" value={phoneNumber} 
              onChange={e => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {  // Allow only numbers up to 10 digits
                  setPhoneNumber(value);
                }}} 
                pl={"40px"}
            placeholder="xxxxx xxxxx"/>
            <Flex alignItems={"center"} justifyContent={"center"} position={"absolute"} left={"2px"} top={"34px"} borderRadius={"4px"} w={"35px"} height={"35px"}>+91</Flex>
          </FormControl>

          {profileType === "student" && <FormControl id="studentRollNo" mb={4}>
            <Flex alignItems={"center"} gap={1}>
              <FormLabel fontWeight={'400'}>Student Roll No.</FormLabel>
              <Tooltip label="Required for group chats and other student-related features." placement='right'>
                <Box mb={"9px"}>
                  <FaCircleExclamation fontSize={"12px"} color='#555'/>
                </Box>
              </Tooltip>
            </Flex>
            <Input type="number" value={studentRollNo} onChange={e => setStudentRollNo(e.target.value)} placeholder="Ex. 2461062"/>
          </FormControl>}
          </Grid>

          <FormControl id="profileType" isRequired mb={4}>
            <FormLabel>Profile Type</FormLabel>
              <RadioGroup onChange={setProfileType} value={profileType}>
                <Stack direction='row'>
                  <Radio value='professor'>Professor</Radio>
                  <Radio value='student'>Student</Radio>
                </Stack>
              </RadioGroup>
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
              <Button {...GRADIENT_BUTTON_STYLE} size={"lg"} isLoading={isLoading} onClick={handleModelOpen}>
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
        

        {/* Details Confirm Model */}
        <AlertDialog
          motionPreset='slideInBottom'
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent color={"#1f1f1f"}>
            <AlertDialogHeader>Confirm Details</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Text fontSize="15px" fontWeight="400" mb={4}>
                Please confirm your details before signing up.
              </Text>
              
              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                {[
                  { label: "Full Name", value: fullName },
                  { label: "Email", value: email },
                  { label: "Phone No.", value: `+91 ${phoneNumber}` },
                  ...(profileType === "student" ? [{ label: "Student Roll No.", value: studentRollNo }] : []),
                  { label: "Profile Type", value: profileType },
                  { label: "Password", value: password }
                ].map((item, index) => (
                  <Box key={index}>
                    <Text fontSize="15px" color={"#666"}>{item.label}:</Text>
                    <Text fontSize="17px" fontWeight="400">{item.value}</Text>
                  </Box>
                ))}
              </Grid>
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button {...GRADIENT_BUTTON_STYLE} onClick={handleSubmit} isLoading={isLoading}>
                SignUp Now
              </Button>
              <Button ref={cancelRef} onClick={onClose} borderRadius={"full"}>
                Cancle
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </Flex>
  )
}

export default SignUpPage