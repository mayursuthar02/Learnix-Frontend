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

const AddAndEditUpdate = ({ isOpen, onClose, modelMode, updateIdForEdit, getUpdates}) => {
  // State Management
  const [isLoading, setIsLoading] = useState({ submit: false, fetch: false });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Functions
  const showToast = useShowToast();

  // Fetch Update Data if Editing
  useEffect(() => {
    setTitle("");
    setDescription("");

    if (modelMode === "edit" && updateIdForEdit) {
      const fetchUpdate = async () => {
        setIsLoading((prev) => ({ ...prev, fetch: true }));
        try {
          const response = await fetch(
            `/api/updates/getSingleUpdate/${updateIdForEdit}`
          );
          const data = await response.json();

          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          const { title, description } = data.update;
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
  }, [modelMode, updateIdForEdit]);

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
          ? "/api/updates/addUpdate"
          : `/api/updates/editUpdate/${updateIdForEdit}`;
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
      setTitle("");
      setDescription("");
      getUpdates();
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
            {modelMode === "add" ? "Add Update" : "Edit Update"}
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

          <ModalFooter>
            <Button
              mr={3}
              bg="linear-gradient(90deg, #4796E3, #6658ff, #ff5546)"
              color="white"
              borderRadius="full"
              transition="background-position 0.3s ease-in-out"
              bgSize="200% 200%"
              bgPos="0% 0%"
              _hover={{ bgPos: "100% 0%" }}
              _active={{ bgPos: "100% 0%", opacity: 0.9 }}
              onClick={handleSubmit}
              isLoading={isLoading.submit || isLoading.fetch}
              loadingText={isLoading.fetch && "Fetching"}
              textTransform={"capitalize"}
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

export default AddAndEditUpdate;
