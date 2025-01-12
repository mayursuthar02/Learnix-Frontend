import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
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
} from "@chakra-ui/react";
// Icons
import { SmallCloseIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
// Function
import usePriviewImg from '../hooks/usePriviewImg';
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useRef, useState } from "react";

export default function UpdateProfile({ isOpen, onClose }) {
    // State
    const [user, setUser] = useRecoilState(userAtom);
    const [fullName, setFullName] = useState(user?.fullName);
    const [email, setEmail] = useState(user?.email);
    // Functions
    const fileRef = useRef();
    const {handleImageChange, imgUrl, setImgUrl} = usePriviewImg();
    
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
                    <Tooltip label={"Change Profile Pic"} placement='top'>
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
            <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} border={"1px solid #333"} placeholder="FullName"/>
          </FormControl>

          <FormControl id="email" isRequired mb={4}>
            <FormLabel>Email</FormLabel>
            <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} border={"1px solid #333"} placeholder="email@example.com"/>
          </FormControl>

          </ModalBody>

          <ModalFooter gap={2}>
            <Button
              // isLoading={isLoading}
            //   size="lg"
              bg="linear-gradient(90deg, #4796E3, #6658ff, #ff5546)"
              color="white"
              borderRadius="full"
              transition="background-position 0.3s ease-in-out"
              bgSize="200% 200%"
              bgPos="0% 0%"
              _hover={{ bgPos: "100% 0%" }}
              _active={{ bgPos: "100% 0%", opacity: 0.9 }}
              // onClick={handleSubmit}
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
