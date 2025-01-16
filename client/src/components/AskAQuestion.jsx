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
  import {ChevronDownIcon} from '@chakra-ui/icons';
import { useState } from "react";

// STYLES
import { BUTTON_STYLE, GRADIENT_BUTTON_STYLE } from "../styles/globleStyles";

const AskAQuestion = ({ isOpen, onClose }) => {
    const options = [
        { id: 1, name: "John Doe", avatar: "https://via.placeholder.com/150" },
        { id: 2, name: "Jane Smith", avatar: "https://via.placeholder.com/150" },
        { id: 3, name: "Alice Johnson", avatar: "https://via.placeholder.com/150" },
        { id: 4, name: "Bob Brown", avatar: "https://via.placeholder.com/150" },
        { id: 5, name: "Charlie Green", avatar: "https://via.placeholder.com/150" },
      ];
    const [selectedOption, setSelectedOption] = useState({name: "Select"});
    
    
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
                <MenuButton as={Button} bg="#131313" rightIcon={<ChevronDownIcon />} color="white" _active={{bg: "#131313"}}  _hover={{borderColor: "#444" }} border={'1px solid'} w={'full'} borderColor={'#222'} py={2}>
                    <Flex align="center" gap={4}>
                        {selectedOption.avatar && <Avatar src={selectedOption.avatar} size="sm" />}
                        <Text>{selectedOption.name}</Text>
                    </Flex>
                </MenuButton>
                <MenuList bg="#131313" borderColor="#222" maxH={'190px'} overflow={'scroll'}>
                    {/* <MenuItem
                        w={'462px'}
                        bg="#131313"
                        _hover={{ bg: "#222" }}
                        onClick={() => setSelectedOption("Select")}
                    >
                        <Flex align="center" gap={4}>
                        <Text color="white">Select</Text>
                        </Flex>
                    </MenuItem> */}
                    {options.map((option) => (
                    <MenuItem
                        w={'462px'}
                        key={option.id}
                        bg="#131313"
                        _hover={{ bg: "#222" }}
                        onClick={() => setSelectedOption(option)}
                    >
                        <Flex align="center" gap={4}>
                        <Avatar src={option.avatar} size="sm" />
                        <Text color="white">{option.name}</Text>
                        </Flex>
                    </MenuItem>
                    ))}
                </MenuList>
            </Menu>
          </FormControl>

          <FormControl id="email" isRequired mb={4}>
            <FormLabel fontWeight={'400'}>Question</FormLabel>
            <Input borderColor={'#222'} _hover={{borderColor: "#444"}} type="text" placeholder="Write your question..."/>
          </FormControl>

          </ModalBody>

          <ModalFooter gap={2}>
            <Button
              // isLoading={isLoading}
            //   size="lg"
              {...GRADIENT_BUTTON_STYLE}
              // onClick={handleSubmit}
            >
              Send
            </Button>
            <Button {...BUTTON_STYLE} onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AskAQuestion