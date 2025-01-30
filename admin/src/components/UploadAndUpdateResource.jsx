import { Button, Grid, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, FormControl, FormLabel, Divider, Input, Flex, Textarea, Box, Spinner } from "@chakra-ui/react";
import { useRef, useState } from "react";
  // Icons
  import { LuCloudUpload } from "react-icons/lu";
  // Function
import useShowToast from "../hooks/useShowToast";
import { useEffect } from "react";
import { GRADIENT_BUTTON_STYLE } from "../styles/globleStyles";
  

  const UploadAndUpdateResource = ({ isOpen, onClose, modelMode, resourceIdForUpdate, getResources }) => {
  // State Management
  const [isLoading, setIsLoading] = useState({ resource: false, submit: false });
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: "",
    file: "",
    resourceLink: "",
    note: "",
    fileName: null,
  });
    // Variables
    const semesters = [
      {title: "Select", value: ""},
      {title: "Semester 1", value: "semester 1"},
      {title: "Semester 2", value: "semester 2"},
      {title: "Semester 3", value: "semester 3"},
      {title: "Semester 4", value: "semester 4"},
      {title: "Semester 5", value: "semester 5"},
      {title: "Semester 6", value: "semester 6"},
    ]
    // Function
    const fileRef = useRef(null);
    const showToast = useShowToast();

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Get Single Resource
    useEffect(()=> {
        setFormData({ title: "", subject: "", semester: "", resourceLink: "", note: "", file: "", fileName: null });
        if (modelMode === "update" && resourceIdForUpdate) {
            const fetchResource = async () => {
              setIsLoading((prev) => ({ ...prev, resource: true }));
      
              try {
                const response = await fetch(`/api/resources/getSingleResource/${resourceIdForUpdate}`);
                const data = await response.json();
      
                if (data.error) {
                  showToast("Error", data.error, "error");
                  return;
                }
      
                const { title, subject, semester, resourceLink, note } = data.resource;
                setFormData({ title, subject, semester, resourceLink, note, file: "", fileName: null });
              } catch (error) {
                showToast("Error", error.message, "error");
              } finally {
                setIsLoading((prev) => ({ ...prev, resource: false }));
              }
            };
      
            fetchResource();
          }
    },[modelMode, resourceIdForUpdate]);
    
    // Upload Resource
    const handleSubmit = async() => {
        setIsLoading((prev) => ({ ...prev, submit: true }));

        try {
          const { title, subject, semester, file, resourceLink, note } = formData;
    
          if (!title || !subject || !semester) {
            showToast("Error", "Title, Semester, and Subject fields are required!", "error");
            return;
          }
    
          const uploadData = new FormData();
          uploadData.append("title", title);
          uploadData.append("subject", subject);
          uploadData.append("semester", semester);
          if (file) uploadData.append("resource", file);
          uploadData.append("resourceLink", resourceLink);
          uploadData.append("note", note);
    
          const response = await fetch("/api/resources/upload", {
            method: "POST",
            body: uploadData,
          });
    
          const data = await response.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
    
          showToast("Success", data.message, "success");
          onClose();
          getResources();
          setFormData({ title: "", subject: "", semester: "", file: "", resourceLink: "", note: "", fileName: null });
        } catch (error) {
          showToast("Error", error.message, "error");
        } finally {
          setIsLoading((prev) => ({ ...prev, submit: false }));
        }
    }

    // Update Resource
    const handleUpdate = async() => {
        setIsLoading((prev) => ({ ...prev, submit: true }));
        try {
            const { title, subject, semester, file, resourceLink, note } = formData;
    
            if (!title || !subject || !semester) {
              showToast("Error", "Title, Semester, and Subject fields are required!", "error");
              return;
            }
    
            const updateData = new FormData();
            updateData.append("title", title);
            updateData.append("subject", subject);
            updateData.append("semester", semester);
            if (file) updateData.append("resource", file);
            updateData.append("resourceLink", resourceLink);
            updateData.append("note", note);
    
          const response = await fetch(`/api/resources/update/${resourceIdForUpdate}`, {
            method: 'PUT',
            body: updateData
          });
          const data = await response.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          console.log(data);
          showToast("Success", data.message, "success");
          onClose();
          getResources();
          setFormData({ title: "", subject: "", semester: "", file: "", resourceLink: "", note: "", fileName: null });
        } catch (error) {
          console.log('Upload Error:', error);
        } finally {
            setIsLoading((prev) => ({ ...prev, submit: false }));
        }
      }

    return (  
      <Box position={'relative'}>
        <Modal
          isCentered
          closeOnOverlayClick={true}
          motionPreset="slideInBottom"
          isOpen={isOpen}
          onClose={onClose} 
          size={'xl'}
        >
          <ModalOverlay />
  
          <ModalContent>
            <ModalHeader color={"#1f1f1f"}>{modelMode === "upload" ? "Upload" : "Update"} Material</ModalHeader>
  
            <ModalCloseButton color={"#1f1f1f"}/>
  
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel color={"#1f1f1f"} fontSize={"16px"} fontWeight={"500"}>Title</FormLabel>
                <Input 
                type="text"
                placeholder={"Ex. Network Technology"}
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                isDisabled={isLoading.resource}
                />
              </FormControl>

              <Grid gridTemplateColumns={'repeat(2, 1fr)'} gap={5} mt={5}> 
                <FormControl isRequired>
                  <FormLabel color={"#1f1f1f"} fontSize={"16px"} fontWeight={"500"}>Subject</FormLabel>
                  <Input 
                  type="text"
                  placeholder={"Ex. Network Technology"}
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  isDisabled={isLoading.resource}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={"#1f1f1f"} fontSize={"16px"} fontWeight={"500"}>Semester</FormLabel>
                  <Select 
                  value={formData.semester}
                  onChange={(e) => handleInputChange("semester", e.target.value)}
                  isDisabled={isLoading.resource}
                  >
                    {semesters.map((sem,i) => (
                      <option key={i} value={sem.value}>{sem.title}</option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <FormControl mt={5} isDisabled={isLoading.resource}>
                <FormLabel color={"#1f1f1f"} fontSize={"16px"} fontWeight={"500"}>Resource</FormLabel>
                <Input 
                type="file"
                hidden
                ref={fileRef}
                onChange={(e) => handleInputChange("file", e.target.files[0], "fileName", e.target.files[0]?.name)}
                />
                <Flex alignItems={'center'} justifyContent={'center'} border={'1px solid #ededed'} borderRadius={'4px'} py={5} cursor={"pointer"} _hover={{bg: "#efefef", borderColor: "#eee"}} transition={"background .3s ease"} gap={2} onClick={()=>fileRef.current.click()}>
                    <LuCloudUpload color={"#7b899d"} fontSize={"20px"}/>
                    <Text fontSize={"17px"} color={"#7b899d"}>{formData.fileName || "Select Material From Browser"}</Text>
                </Flex>
              </FormControl>

              <Flex align={'center'} justifyContent={'space-between'} gap={2} mt={3}>
                <Divider/>
                <Text color={"#1f1f1f"} fontSize={"16px"} fontWeight={"500"}>Or</Text>
                <Divider/>
              </Flex>

              <FormControl mt={1}>
                <FormLabel color={"#1f1f1f"} fontSize={"16px"} fontWeight={"500"}>Resource Link</FormLabel>
                <Input 
                  type="text" 
                  placeholder={"Ex. https://www.resourcelink.com "}
                  value={formData.resourceLink}
                  onChange={(e) => handleInputChange("resourceLink", e.target.value)}
                  isDisabled={isLoading.resource}
                />
              </FormControl>
               
              <FormControl mt={2}>
                <FormLabel color={"#1f1f1f"} fontSize={"16px"} fontWeight={"500"}>Note</FormLabel>
                <Textarea
                  placeholder="Write something here ..."
                  size="md"
                  mt={1}
                  value={formData.note}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  isDisabled={isLoading.resource}
                />
              </FormControl>
            </ModalBody>
  
            <ModalFooter gap={3}>
              <Button
                {...GRADIENT_BUTTON_STYLE}
                  onClick={() => {
                  if (modelMode === "upload") {handleSubmit()} else {handleUpdate()};
                }}
                isLoading={isLoading.submit || isLoading.resource}
                loadingText={isLoading.resource && "Fetching"}
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
  
  export default UploadAndUpdateResource;