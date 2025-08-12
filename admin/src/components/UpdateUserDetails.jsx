import { Button, Grid, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, FormControl, FormLabel, Divider, Input, Flex, Textarea, Box, Spinner } from "@chakra-ui/react";
import { useRef, useState } from "react";
// Function
import useShowToast from "../hooks/useShowToast";
import { useEffect } from "react";
import { GRADIENT_BUTTON_STYLE } from "../styles/globleStyles";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

// BASEURL
import { baseURL as BASEURL } from "../config/baseURL.js";


const UpdateUserDetails = ({ isOpen, onClose, userIdForUpdate, getAllUsers, profileType }) => {
    // State Management
    const [isLoading, setIsLoading] = useState({ resource: false, submit: false });
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    // Variables
    const roles = [
        { title: "Select", value: "" },
        { title: "Admin", value: "admin" },
        { title: "User", value: "user" },
    ]
    // Function
    const showToast = useShowToast();
    const user = useRecoilValue(userAtom);

    // Get Single Resource
    useEffect(() => {
        if (userIdForUpdate) {
            const fetchResource = async () => {
                setIsLoading((prev) => ({ ...prev, resource: true }));

                try {
                    const response = await fetch(`${BASEURL}/api/users/fetchSingleUser/${userIdForUpdate}`, {
                        method: "GET",
                        headers: {
                          "Authorization": `Bearer ${user.token}`
                        },
                    });
                    const data = await response.json();

                    if (data.error) {
                        showToast("Error", data.error, "error");
                        return;
                    }
                    
                    // console.log(data);
                    const { fullName, email, role } = data.data;
                    setFullName(fullName);
                    setEmail(email);
                    setRole(role);
                } catch (error) {
                    showToast("Error", error.message, "error");
                } finally {
                    setIsLoading((prev) => ({ ...prev, resource: false }));
                }
            };

            fetchResource();
        }
    }, [userIdForUpdate]);


    const handleResourceAction = async () => {
        setIsLoading((prev) => ({ ...prev, submit: true }));

        try {
            console.log({fullName, email, role});
            const response = await fetch(`${BASEURL}/api/users/updateUserDetails/${userIdForUpdate}`, {
                method: "PUT",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({fullName, email, role}),
            });

            const data = await response.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            showToast("Success", data.message, "success");//
            onClose();
            getAllUsers();

        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading((prev) => ({ ...prev, submit: false }));
        }
    };


    return (
        <Box position={'relative'}>
            <Modal
                isCentered
                closeOnOverlayClick={true}
                motionPreset="slideInBottom"
                isOpen={isOpen}
                onClose={onClose}
                size={'md'}
            >
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader color={"#1f1f1f"} textTransform={'capitalize'}>Update Details</ModalHeader>

                    <ModalCloseButton color={"#1f1f1f"} />

                    <ModalBody pb={6}>
                        <FormControl isRequired mb={4}>
                            <FormLabel color={"#1f1f1f"} fontSize={"16px"} fontWeight={"500"}>FullName</FormLabel>
                            <Input
                                type="text"
                                placeholder={"Professors Fullname"}
                                // value={formData.fullName}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                isDisabled={isLoading.resource}
                            />
                        </FormControl>
                        <FormControl isRequired mb={4}>
                            <FormLabel color={"#1f1f1f"} fontSize={"16px"} fontWeight={"500"}>Email</FormLabel>
                            <Input
                                type="text"
                                placeholder={"Professors Email"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isDisabled={isLoading.resource}
                            />
                        </FormControl>
                            <FormControl isRequired>
                            <FormLabel color={"#1f1f1f"} fontSize={"16px"} fontWeight={"500"}>Role</FormLabel>
                            <Select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                isDisabled={isLoading.resource || profileType !== "student"}
                            >
                                {roles.map((role, i) => (
                                    <option key={i} value={role.value}>{role.title}</option>
                                ))}
                            </Select>
                        </FormControl>
                        
                    </ModalBody>

                    <ModalFooter gap={3}>
                        <Button
                            {...GRADIENT_BUTTON_STYLE}
                            onClick={() => {
                                handleResourceAction();
                            }}
                            isLoading={isLoading.submit || isLoading.resource}
                            loadingText={isLoading.resource && "Fetching"}
                        >
                            Update
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

export default UpdateUserDetails