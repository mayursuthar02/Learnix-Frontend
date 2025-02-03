import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Tooltip,
  Flex,
  Grid,
} from "@chakra-ui/react";

// Icons
import { MdEdit } from "react-icons/md";

// Function
import usePriviewImg from '../hooks/usePriviewImg';
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";

// STYLES
import { GRADIENT_BUTTON_STYLE, BUTTON_STYLE, INPUT_STYLE, TOOLTIP_STYLE } from "../styles/globleStyles";



export default function UpdateProfile({ isOpen, onClose }) {
    // State
    const [user, setUser] = useRecoilState(userAtom);
    const [fullName, setFullName] = useState(user?.fullName);
    const [email, setEmail] = useState(user?.email);
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
    const [studentRollNumber, setStudentRollNumber] = useState(user?.studentRollNumber);
    const [isLoading, setIsLoading] = useState(false);
    // Functions
    const fileRef = useRef();
    const {handleImageChange, imgUrl} = usePriviewImg();
    const showToast = useShowToast();

    // Update User Profile
    const updateUserProfile = async() => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/users/updateUserProfile', {
          method: "PUT",
          headers: {"Content-Type" : "application/json"}, 
          body: JSON.stringify({fullName, email, profilePic: imgUrl, phoneNumber, studentRollNumber})
        });
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        localStorage.setItem('learnixUserDetails', JSON.stringify(data.user));
        setUser(data.user);
        onClose();
      } catch (error) {
        console.log({error});
        showToast("Error", error, "error");
      } finally {
        setIsLoading(false);
      }
    }
    
  return (
    <Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
        closeOnOverlayClick={true}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent bg={"#131313"} color={"#fff"}>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl id="profilePic" mb={5}>
              <FormLabel>User Icon</FormLabel>
                <Center>
                  <Avatar size="2xl" src={imgUrl || user.profilePic}>
                    <Tooltip label={"Change Profile Pic"} placement='top' {...TOOLTIP_STYLE}>
                        <AvatarBadge
                          as={IconButton}
                          size="md"
                          rounded="full"
                          top="-10px"
                          colorScheme="blue"
                          aria-label="remove Image"
                          icon={<MdEdit />}
                          onClick={() => fileRef.current.click()}
                          border={"4px solid"}
                          borderColor={"#131313"}
                        />
                    </Tooltip>
                    <Input type="file" hidden ref={fileRef} onChange={handleImageChange}/>
                  </Avatar>
                </Center>
            </FormControl>

          <FormControl id="fullName" isRequired mb={4}>
            <FormLabel>FullName</FormLabel>
            <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} {...INPUT_STYLE} placeholder="FullName"/>
          </FormControl>

          <FormControl id="email" isRequired mb={4} isDisabled={true}>
            <FormLabel>Email</FormLabel>
            <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} {...INPUT_STYLE} placeholder="email@example.com"/>
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

            {user?.profileType === "student" && 
            <FormControl id="studentRollNo" mb={4}>
              <FormLabel fontWeight={'400'}>Student Roll No.</FormLabel>
              <Input {...INPUT_STYLE} type="number" value={studentRollNumber} onChange={e => setStudentRollNumber(e.target.value)} placeholder="Ex. 2461062"/>
            </FormControl>}
          </Grid>
          
          </ModalBody>

          <ModalFooter gap={2}>
            <Button isLoading={isLoading} onClick={updateUserProfile} {...GRADIENT_BUTTON_STYLE}>Update</Button>
            <Button onClick={onClose} {...BUTTON_STYLE}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
