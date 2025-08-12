import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Box,
    Avatar,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";

// Icons
import {ChevronDownIcon} from '@chakra-ui/icons';

// Function
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

// STYLES
import { BUTTON_STYLE, GRADIENT_BUTTON_STYLE } from "../styles/globleStyles";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

// BASEURL
import { baseURL as BASEURL } from "../config/baseURL.js";


// MAIN FUNCTIONS
const AskAQuestion = ({ isOpen, onClose }) => {
  // State
  const [selectedOption, setSelectedOption] = useState({fullName: "Select Professor"});
  const [professorsList, setProfessorsList] = useState([]);
  const [professorId, setProfessorId] = useState(null);
  const [question, setQuestion] = useState("");
  const [isProfessorsLoading, setIsProfessorsLoading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  // Function
  const showToast = useShowToast();  
  const user = useRecoilValue(userAtom);
    
  // Fetch Professors
  useEffect(()=> {
      const getAdminProfessors = async () => {
        setIsProfessorsLoading(true);
        try {
          const response = await fetch(`${BASEURL}/api/users/getAdminProfessors`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${user.token}`
            },
          });
          const data = await response.json();
          if (data.error) {
            console.log(data.error);
            return;
          }
          setProfessorsList(data.adminProfessors);
        } catch (error) {
          console.log(error);
        } finally {
          setIsProfessorsLoading(false);
        }
      }

      getAdminProfessors();
  },[]);
    
  const handleSubmit = async () => {
    if (!question) {
      showToast("Error", "Question is required!", "error");
      return;
    }
    if (!professorId) {
      showToast("Error", "ProfessorId is required!", "error");
      return;
    }
    
    setIsSubmiting(true);
    try {
      const response = await fetch(`${BASEURL}/api/questions/ask-a-question`, {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({professorId, question})
      })
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Message sent", "success");
      onClose();
      setQuestion("");
      setProfessorId("");
      setSelectedOption({fullName: "Select Professor"});
    } catch (error) {
      showToast("Error", "Something went wrong", "error");
      console.log(error);
    } finally {
      setIsSubmiting(false);
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
          <ModalHeader>Ask A Question</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            
          <FormControl id="fullName" isRequired mb={4}>
            <FormLabel fontWeight={'400'}>Select Professor</FormLabel>
            <Menu>
                <MenuButton as={Button} bg="#131313" rightIcon={<ChevronDownIcon />} color="white" _active={{bg: "#131313"}}  _hover={{borderColor: "#444" }} border={'1px solid'} w={'full'} borderColor={'#222'} h={"50px"}>
                    <Flex align="center" gap={3}>
                        {selectedOption?.profilePic && <Avatar src={selectedOption?.profilePic} size="sm" />}
                        <Text fontSize={"16px"} fontWeight={"400"}>{selectedOption?.fullName}</Text>
                    </Flex>
                </MenuButton>
                <MenuList bg="#131313" borderColor="#222" maxH={'275px'} overflow={'scroll'}>
                    {professorsList.map((option) => (
                    <MenuItem
                        w={'462px'}
                        key={option.id}
                        bg="#131313"
                        _hover={{ bg: "#222" }}
                        onClick={() => {setSelectedOption(option); setProfessorId(option._id)}}
                    >
                        <Flex align="center" gap={4}>
                        <Avatar src={option.profilePic} size="sm" />
                        <Text color="white">{option.fullName}</Text>
                        </Flex>
                    </MenuItem>
                    ))}
                </MenuList>
            </Menu>
          </FormControl>

          <FormControl id="email" isRequired mb={4}>
            <FormLabel fontWeight={'400'}>Question</FormLabel>
            <Input borderColor={'#222'} _hover={{borderColor: "#444"}} type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Write your question..."/>
          </FormControl>

          </ModalBody>

          <ModalFooter gap={2}>
            <Button isLoading={isSubmiting} {...GRADIENT_BUTTON_STYLE} onClick={handleSubmit}>Send</Button>
            <Button {...BUTTON_STYLE} onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AskAQuestion