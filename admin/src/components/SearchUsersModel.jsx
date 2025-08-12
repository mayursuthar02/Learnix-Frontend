import { Avatar, AvatarBadge, Badge, Box, Button, Center, Flex, FormControl, FormLabel, Grid, IconButton, Image, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, SkeletonCircle, Text, Tooltip } from "@chakra-ui/react"
import {Link as RouterLink} from 'react-router-dom';

// Icons
import { SearchIcon } from "@chakra-ui/icons";
import { RiGroup2Line } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { PiCheckCircleFill } from "react-icons/pi";
import { HiOutlineUpload } from "react-icons/hi";

// Function
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import usePriviewImg from "../hooks/usePriviewImg";

// Styles
import { GRADIENT_BUTTON_STYLE, TOOLTIPS_STYLE } from "../styles/globleStyles";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

// BASEURL
import { baseURL as BASEURL } from "../config/baseURL.js";


// STYLES
const INPUT_ICON_STYLES = {
    position: "absolute",
    top: "1%",
    bg: "transparent",
    _hover: { bg: "transparent" },
    right: "1", 
    "aria-label": "Search database", 
    cursor: "default"
};
const INPUT_BOX_STYLE = {
    type : "text",
    height : "43px",
    pr : "70px",
    borderRadius : "5px"
}
const SEARCH_RESULT_STYLE = {
    align : "center",
    gap : "2",
    border : "1px solid",
    borderRadius : "15px",
    px : "2",
    py : "2"
}

const useDebounce = (callback, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  };

// Main Function
const SearchUsersModel = ({isOpen, onClose, fetchData}) => {
    const [groupName, setGroupName] = useState("");
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);

    // Functions
    const fileRef = useRef();
    const {handleImageChange, imgUrl, setImgUrl} = usePriviewImg();
    const showToast = useShowToast();
    const user = useRecoilValue(userAtom);
    

    // Handle Search
    const handleSearch = async (value) => {
        if (!value) {
          setSearchResults([]);
          return;
        }
    
        setLoading(true);
    
        try {
            const res = await fetch(`${BASEURL}/api/users/searchUsers/${value}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${user.token}`
                },
            });
            const data = await res.json();
            if (data.error) {
              showToast("Error", data.error, "error");
              return;
            }
            setSearchResults(data.users);
        } catch (error) {
            console.error('Search error:', error);
            showToast("Error", "An error occurred during the search", "error");
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };
    
    // Debounced version of handleSearch
    const debouncedSearch = useDebounce(handleSearch, 300);
    
    const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchValue(value);
      debouncedSearch(value);
    };


    // API Handle Create Group
    const createGroupConversation = async() => {
        if (!selectedMembers || !groupName) {
            showToast("Error", "Please provide all required fields.", "error");
            return;
        }
        if (selectedMembers.length < 2) {
            showToast("Error", "At least 2 members are required to create a group chat.", "error");
            return;
        }
        setSearchValue("");
        setLoading(true);
        try {
            const members = selectedMembers.map(member => member._id);
            const response = await fetch(`${BASEURL}/api/userChats/createGroupConversation`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({ members, name: groupName, groupConversationIcon: imgUrl })
            });
            const data = await response.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            console.log(data);
            onClose();
            fetchData();
            setGroupName("");
            setSelectedMembers([]);
            setSearchResults([]);
            setImgUrl("");
        } catch (error) {
            console.log(error);
            showToast("Error", "Something went wrong.", "error");
        } finally {
            setLoading(false);
        }
    } 
    
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset='slideInBottom'
        size={'xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight={'500'}>Create Group Chat</ModalHeader>

          <ModalCloseButton _hover={{bgColor: "blue.50"}}/>
          
          <ModalBody pb={4}>
            <Grid templateColumns={"1fr .5fr"}>
                <Box>
                    <FormControl mb={3}>
                        <FormLabel>Group Name:</FormLabel>
                        <Box position={'relative'}>
                            <Input {...INPUT_BOX_STYLE} placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
                            <IconButton {...INPUT_ICON_STYLES} icon={<RiGroup2Line fontSize={"24px"} color="#7d8a9f"/>} />
                        </Box>
                    </FormControl>
            
                    <FormControl>
                        <FormLabel>Search:</FormLabel>
                        <Box position={'relative'}>
                            <Input {...INPUT_BOX_STYLE} placeholder="Search Students or Professors" value={searchValue} onChange={handleInputChange}/>
                            <IconButton {...INPUT_ICON_STYLES} icon={<SearchIcon fontSize={"18px"} color="#7d8a9f"/>} />
                        </Box>
                    </FormControl>
                </Box>

                <FormControl id="profilePic" mb={5}>
                    <FormLabel textAlign={"center"}>Group Icon</FormLabel>
                    <Center>
                        <Avatar size="2xl" src={imgUrl || ""}>
                            <Tooltip label={"Group Icon"} placement='top' {...TOOLTIPS_STYLE}>
                                <AvatarBadge
                                  as={IconButton}
                                  size="md"
                                  rounded="full"
                                  top="-10px"
                                  colorScheme="blue"
                                  icon={<HiOutlineUpload />}
                                  onClick={() => fileRef.current.click()}
                                />
                            </Tooltip>
                            <Input type="file" hidden ref={fileRef} onChange={handleImageChange}/>
                        </Avatar>
                    </Center>
                </FormControl>
            </Grid>
          </ModalBody>

            <FormLabel px={6} mb={2}>Members:</FormLabel>
            {selectedMembers.length > 0 && (
                <Flex align={"center"} gap={2} flexWrap={"wrap"} px={6} mb={4}>
                    {selectedMembers.map((user,i) => (
                        <Badge key={i} alignItems={"center"} py={1} px={3} gap={2} borderRadius={"full"} display={"flex"} textTransform={"capitalize"} colorScheme="blue" fontSize={"15px"} fontWeight={"400"}>
                            <Text>{user.fullName}</Text>
                            <Tooltip label={`Remove ${user.fullName}`} {...TOOLTIPS_STYLE}>
                                <Box fontSize={"15px"} cursor={"pointer"}
                                onClick={() => {
                                    setSelectedMembers(prev => prev.filter(member => member._id !== user._id))
                                }}
                                ><IoIosCloseCircle/></Box>
                            </Tooltip>
                        </Badge>
                    ))}
                </Flex>
            )}

          {searchResults.length > 0 && (
            <Grid px={6} pb={4} maxH={'320px'} overflowY={'scroll'} gridTemplateColumns={"repeat(4, 1fr)"} gap={2}>              
                {!loading && searchResults.map(user => (
                    <Flex key={user._id} {...SEARCH_RESULT_STYLE} cursor={"pointer"} justifyContent={"center"} 
                    flexDir={"column"}
                    borderColor={selectedMembers.some(member => member._id === user._id) ? "#bee3f8" : "#ddd"}
                    transition={"background .3s ease, color .3s ease"}
                    bg={selectedMembers.some(member => member._id === user._id) ? "#bee3f8" : "transparent"}
                    color={selectedMembers.some(member => member._id === user._id) ? "#2a4365" : "#1f1f1f"}
                    _hover={{
                        bg: "#bee3f8",
                        color: "#2a4365"
                    }}
                    onClick={() => {
                        setSelectedMembers(prev => 
                            prev.some(member => member._id === user._id) 
                            ? prev.filter(member => member._id !== user._id) 
                            : [{_id : user._id, fullName: user.fullName}, ...prev]
                        )
                    }}
                    >
                        <Box pos={"relative"}>
                            <Avatar src={user?.profilePic} w={"60px"} h={"60px"} objectFit={"cover"}/>
                            {selectedMembers.some(member => member._id === user._id) && 
                            <Box position={"absolute"} bottom={0} right={-1} bg={"#bee3f8"} borderRadius={"full"}><PiCheckCircleFill fontSize={"25px"}/></Box>}
                        </Box>
                        <Box>
                            <Text fontSize={"15px"} fontWeight={"400"} textAlign={"center"}>{user?.fullName}</Text>
                            {user?.studentRollNumber && <Text fontSize={"15px"} fontWeight={"400"} textAlign={"center"}>@{user?.studentRollNumber}</Text>}
                        </Box>
                    </Flex>
                ))}
            </Grid>
           )}

        <ModalFooter gap={3}>
            <Button
              {...GRADIENT_BUTTON_STYLE}
              onClick={createGroupConversation}
              isLoading={loading}
              loadingText={"Creating"}
            >
                Create
            </Button>
            <Button onClick={onClose} borderRadius={"full"}>
              Cancel
            </Button>
        </ModalFooter>
        </ModalContent>
      </Modal>
  )
}

export default SearchUsersModel