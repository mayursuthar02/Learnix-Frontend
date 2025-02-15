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
  } from "@chakra-ui/react";
  // Functions
  import { useState, useEffect } from "react";
  import useShowToast from "../hooks/useShowToast";
  // Styles
  import { GRADIENT_BUTTON_STYLE } from "../styles/globleStyles";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
  
  const AddAndEditFAQ = ({ isOpen, onClose, modelMode, FAQIdForEdit, getFAQs}) => {
    // State Management
    const [isLoading, setIsLoading] = useState({ submit: false, fetch: false });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    // Functions
    const showToast = useShowToast();
    const user = useRecoilValue(userAtom);
  
    // Fetch FAQ Data if Editing
    useEffect(() => {
      setTitle("");
      setDescription("");
  
      if (modelMode === "edit" && FAQIdForEdit) {
        const fetchUpdate = async () => {
          setIsLoading((prev) => ({ ...prev, fetch: true }));
          try {
            const response = await fetch(
              `/api/FAQs/getSingleFAQ/${FAQIdForEdit}`, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${user.token}`
                },
              }
            );
            const data = await response.json();
  
            if (data.error) {
              showToast("Error", data.error, "error");
              return;
            }
            const { title, description } = data.FAQ;
            setTitle(title);
            setDescription(description);
          } catch (error) {
            console.error("Error fetching update:", error);
          } finally {
            setIsLoading((prev) => ({ ...prev, fetch: false }));
          }
        };
  
        fetchUpdate();
      }
    }, [modelMode, FAQIdForEdit]);
  
    // Handle Submit
    const handleSubmit = async () => {
      setIsLoading((prev) => ({ ...prev, submit: true }));
  
      try {
        if (!title || !description) {
          showToast("Error", "Both Title and Description are required!", "error");
          return;
        }
  
        const updateData = { title, description };
        const endpoint =
          modelMode === "add"
            ? "/api/FAQs/addFAQ"
            : `/api/FAQs/editFAQ/${FAQIdForEdit}`;
        const method = modelMode === "add" ? "POST" : "PUT";
  
        const response = await fetch(endpoint, {
          method,
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
           },
          body: JSON.stringify(updateData),
        });
  
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        showToast("Success", data.message, "success");
        onClose();
        setTitle("");
        setDescription("");
        getFAQs();
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
              {modelMode === "add" ? "Add FAQ" : "Edit FAQ"}
            </ModalHeader>
            <ModalCloseButton />
  
            <ModalBody>
              <FormControl isRequired>
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
            </ModalBody>
  
            <ModalFooter gap={3}>
              <Button
                {...GRADIENT_BUTTON_STYLE}
                onClick={handleSubmit}
                isLoading={isLoading.submit || isLoading.fetch}
                loadingText={isLoading.fetch && "Fetching"}
              >
                {modelMode}
              </Button>
              <Button onClick={onClose} borderRadius={"full"}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  };
  
  export default AddAndEditFAQ;
  