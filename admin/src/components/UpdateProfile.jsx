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
} from "@chakra-ui/react";
// Icons
import { MdEdit } from "react-icons/md";
// Function
import usePriviewImg from '../hooks/usePriviewImg';
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { GRADIENT_BUTTON_STYLE, TOOLTIPS_STYLE } from "../styles/globleStyles";

// BASEURL
import { baseURL as BASEURL } from "../config/baseURL.js";


export default function UpdateProfile({ isOpen, onClose }) {
    // State
    const [user, setUser] = useRecoilState(userAtom);
    const [fullName, setFullName] = useState(user?.fullName);
    const [email, setEmail] = useState(user?.email);
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
    const [isLoading, setIsLoading] = useState(false);
    // Functions
    const fileRef = useRef();
    const {handleImageChange, imgUrl} = usePriviewImg();
    const showToast = useShowToast();
    

      // Update User Profile
      const updateUserProfile = async() => {
        setIsLoading(true);
        try {
          const response = await fetch(`${BASEURL}/api/users/updateAdminUserProfile`, {
            method: "PUT",
            headers: {
              "Content-Type" : "application/json",
              "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify({fullName, profilePic: imgUrl, phoneNumber})
          });
          const data = await response.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          localStorage.setItem('learnixAdminUser', JSON.stringify(data.user));
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
        <ModalContent>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl id="profilePic" mb={5}>
              <FormLabel>User Icon</FormLabel>
                <Center>
                  <Avatar size="2xl" src={imgUrl || user?.profilePic}>
                    <Tooltip label={"Change Profile Pic"} placement='top' {...TOOLTIPS_STYLE}>
                        <AvatarBadge
                          as={IconButton}
                          size="md"
                          rounded="full"
                          top="-10px"
                          colorScheme="blue"
                          aria-label="remove Image"
                          icon={<MdEdit />}
                          onClick={() => fileRef.current.click()}
                        />
                    </Tooltip>
                    <Input type="file" hidden ref={fileRef} onChange={handleImageChange}/>
                  </Avatar>
                </Center>
            </FormControl>

          <FormControl id="fullName" isRequired mb={4}>
            <FormLabel>FullName</FormLabel>
            <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="FullName"/>
          </FormControl>

          {/* <FormControl id="email" isRequired mb={4} isDisabled={true}>
            <FormLabel>Email</FormLabel>
            <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com"/>
          </FormControl> */}

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

          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              {...GRADIENT_BUTTON_STYLE}
              isLoading={isLoading}
              _hover={{ bgPos: "100% 0%" }}
              _active={{ bgPos: "100% 0%", opacity: 0.9 }}
              onClick={updateUserProfile}
            >
              Update
            </Button>
            <Button borderRadius={"full"} onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
