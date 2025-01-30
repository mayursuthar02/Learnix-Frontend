import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Input,
    FormControl,
    FormLabel,
    Textarea,
    Box,
    Flex,
    IconButton,
    Image
  } from "@chakra-ui/react";
  
// Functions
import { useState, useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import usePriviewImg from '../hooks/usePriviewImg';

// Icons
import { LuCloudUpload } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

//   Styles
import { GRADIENT_BUTTON_STYLE } from "../styles/globleStyles";
import { useRef } from "react";


// MAIN FUNCTION  
const AddAndEditEvent = ({ isOpen, onClose, modelMode, eventEditId, getData, setEventEditId}) => {
    // State Management
    const [isLoading, setIsLoading] = useState({ submit: false, fetch: false });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    // Functions
    const showToast = useShowToast();
    const fileRef = useRef();
    const { handleImageChange, imgUrl, setImgUrl } = usePriviewImg();

    // Format Date
    function formatToInputDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    

    // Fetch Data
    useEffect(() => {
      setTitle(""); setDescription(""); setEventDate(""); setImgUrl("");
      if (modelMode === "edit" && eventEditId) {
        const fetchEvent = async () => {
          setIsLoading((prev) => ({ ...prev, fetch: true }));
          try {
            const response = await fetch(
              `/api/events/getSingleEvent/${eventEditId}`
            );
            const data = await response.json();
            
            if (data.error) {
              showToast("Error", data.error, "error");
              return;
            }
            const { title, description, eventDate, image } = data.event;
            setTitle(title); setDescription(description); setEventDate(formatToInputDate(eventDate)); setImgUrl(image);
          } catch (error) {
            console.error("Error fetching update:", error);
          } finally {
            setIsLoading((prev) => ({ ...prev, fetch: false }));
          }
        };
  
        fetchEvent();
      }
    }, [modelMode, eventEditId]);
  
    // Handle Submit
    const handleSubmit = async () => {
      setIsLoading((prev) => ({ ...prev, submit: true }));
  
      try {
        if (!title || !description || !eventDate || !imgUrl) {
          showToast("Error", "All fields are required!", "error");
          return;
        }

        const updateData = { title, description, eventDate, image: imgUrl };
        const endpoint =
          modelMode === "add"
            ? "/api/events/add"
            : `/api/events/edit/${eventEditId}`;
        const method = modelMode === "add" ? "POST" : "PUT";
  
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
  
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        showToast("Success", data.message, "success");
        onClose();
        getData();
        setTitle("");
        setDescription("");
        setEventDate("");
        setImgUrl("");
        setEventEditId(null);
      } catch (error) {
        console.error("Error:", error.message);
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading((prev) => ({ ...prev, submit: false }));
      }
    };

    return (
      <Box>
        <Modal isOpen={isOpen}onClose={onClose} isCentered motionPreset="slideInBottom" closeOnOverlayClick={true}size={"lg"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {modelMode === "add" ? "Add Event" : "Edit Event"}
            </ModalHeader>
            <ModalCloseButton />
  
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Image</FormLabel>
                <Input type="file" hidden ref={fileRef} onChange={handleImageChange}/>
                {!imgUrl && <Flex alignItems={'center'} justifyContent={'center'} flexDir={'column'} gap={2} color={"#999"} w={'full'} height={"120px"} border={"1px solid #e7e7e7"} borderRadius={"10px"} cursor={"pointer"} _hover={{bg: "#eee"}} transition={"background .3s ease"} onClick={()=> fileRef.current.click()}>
                    <LuCloudUpload size={"30px"}/>
                </Flex>}
                {imgUrl && <Box pos={"relative"} w={"120px"}>
                  <Box w={"120px"} height={"120px"} borderRadius={"10px"} bg={"#eee"} overflow={"hidden"}>
                    <Image src={imgUrl} w={"full"} height={"full"} objectFit={"cover"}/>
                  </Box>
                  <IconButton pos={"absolute"} top={"-5px"} right={"-10px"} onClick={() => setImgUrl("")} border={"3px solid #fff"} color="#fff" bg={"#4796e3"} _hover={{bg: "blue.500"}} borderRadius={"full"} size={"sm"} icon={<IoMdClose fontSize={"20px"}/>}/>
                </Box>}
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  isDisabled={isLoading.fetch}
                />
              </FormControl>
  
              <FormControl mt={4} isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  isDisabled={isLoading.fetch}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Event Date</FormLabel>
                <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}/>
              </FormControl>
            </ModalBody>
  
            <ModalFooter gap={3}>
              <Button
                {...GRADIENT_BUTTON_STYLE}        
                onClick={handleSubmit}
                isLoading={isLoading.submit || isLoading.fetch}
                loadingText={isLoading.fetch && "Fetching"}
                textTransform={"capitalize"}
              >
                {modelMode}
              </Button>
              <Button onClick={onClose} borderRadius={"full"}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  };
  
  export default AddAndEditEvent;
  