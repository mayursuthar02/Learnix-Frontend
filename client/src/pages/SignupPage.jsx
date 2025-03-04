import { useRef, useState } from 'react'
import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Stack, Text, Link, Image, RadioGroup, Radio, Grid, Tooltip, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogFooter, AlertDialogBody, useDisclosure} from '@chakra-ui/react';

// Icons and Logo
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import AiLogo from '../assets/logoai.png'
import { FaCircleExclamation } from "react-icons/fa6";

// Functions
import { Link as RouterLink, useNavigate} from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

// Styles
import {BUTTON_STYLE, GRADIENT_BUTTON_STYLE, INPUT_STYLE, TOOLTIP_STYLE} from '../styles/globleStyles'

const SignupPage = () => {
  // Functions
  const showToast = useShowToast(); //For toast
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  // State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [studentRollNo, setStudentRollNo] = useState("");
  const [password, setPassword] = useState('');
  const [profileType, setProfileType] = useState("student");

  // Validation Function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format regex
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

          <Grid templateColumns={"1fr 1fr"} gap={5}>
          <FormControl id="phoneNumber" isRequired mb={4} position={"relative"}>
            <FormLabel fontWeight={'400'}>Phone No.</FormLabel>
            <Input {...INPUT_STYLE} type="text" value={phoneNumber} 
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
              <Tooltip {...TOOLTIP_STYLE} label="Required for group chats and other student-related features." placement='right'>
                <Box mb={"9px"}>
                  <FaCircleExclamation fontSize={"12px"} color='#555'/>
                </Box>
              </Tooltip>
            </Flex>
            <Input {...INPUT_STYLE} type="number" value={studentRollNo} onChange={e => setStudentRollNo(e.target.value)} placeholder="Ex. 2461062"/>
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
              <Button isLoading={isLoading} onClick={handleModelOpen} size={"lg"} {...GRADIENT_BUTTON_STYLE}>Sign Up</Button>
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

        {/* Details Confirm Model */}
        <AlertDialog
          motionPreset='slideInBottom'
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent bg={"#131313"} color={"#fff"}>
            <AlertDialogHeader>Confirm Details</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Text fontSize="15px" fontWeight="300" mb={4}>
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
                    <Text fontSize="15px" color="#555">{item.label}:</Text>
                    <Text fontSize="17px" fontWeight="300">{item.value}</Text>
                  </Box>
                ))}
              </Grid>
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button {...GRADIENT_BUTTON_STYLE} onClick={handleSubmit} isLoading={isLoading}>
                SignUp Now
              </Button>
              <Button ref={cancelRef} onClick={onClose} {...BUTTON_STYLE}>
                Cancle
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </Flex>
  )
}

export default SignupPage