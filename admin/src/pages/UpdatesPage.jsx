import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Link,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
// Icons
import { FaPlus } from "react-icons/fa6";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
// Function
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import AddAndEditUpdate from "../components/AddAndEditUpdate";

const UpdatesPage = () => {
  // Functions
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // State
  const [updates, setUpdates] = useState([]);
  const [modelMode, setModelMode] = useState("");
  const [updateIdForEdit, setUpdateIdForEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteUpdate, setIsDeleteUpdate] = useState(null);

  //   Get User Updates
  const getUpdates = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/updates/getRequestingUserUpdates");
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setUpdates(data.updates);
    } catch (error) {
      console.log(error);
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUpdates();
  }, []);

  //   Handle Delete Update
  const handleDelete = async (updateId) => {
    if (!updateId) {
      showToast("Error", "Update ID is required", "error");
      return;
    }
    setIsDeleteUpdate(updateId);
    try {
      const response = await fetch(`/api/updates/deleteUpdate/${updateId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", data.message, "success");
      setUpdates((prev) => prev.filter((update) => update._id !== updateId));
    } catch (error) {
      console.error(error);
      showToast("Error", "Failed to delete update", "error");
    } finally {
      setIsDeleteUpdate(null);
    }
  };

  return (
    <>
      <Flex alignItems="center" justifyContent="end" mx={2} mb={"30px"} mt={3}>
        <Button
          bg="linear-gradient(90deg, #4796E3, #6658ff, #ff5546)"
          color="white"
          borderRadius="full"
          transition="background-position 0.3s ease-in-out"
          bgSize="200% 200%"
          bgPos="0% 0%"
          _hover={{ bgPos: "100% 0%" }}
          _active={{ bgPos: "100% 0%", opacity: 0.9 }}
          onClick={() => {
            onOpen();
            setModelMode("add");
          }}
          display={"flex"}
          alignItems={"center"}
          gap={1}
        >
          <FaPlus fontSize={"15px"} />
          Add Update
        </Button>
      </Flex>

      <Heading fontSize={"20px"} px={5} mb={5}>Updates</Heading>

      {!loading &&
        (updates.length > 0 ? (
          <Grid templateColumns={"1fr 1fr"} px={5} gap={5}>
            {updates.map((update) => (
              <Box key={update._id} border={"1px solid #ddd"} p={5} borderRadius={"10px"}>
                <Flex alignItems={"center"} justifyContent={"space-between"} borderBottom={"1px solid #ddd"} pb={2} mb={2}>
                  <Text fontSize={"20px"} fontWeight={"500"} color={"#1f1f1f"}>{update.title}</Text>

                  <Flex alignItems={"center"} justifyContent={"center"} gap={2}>
                    <Tooltip label="Edit">
                      <IconButton aria-label="Edit" borderRadius={"full"} icon={<TbEdit fontSize={"18px"} color="#1f1f1f" />}
                        onClick={() => {
                          onOpen();
                          setModelMode("edit");
                          setUpdateIdForEdit(update._id);
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Delete">
                      <IconButton aria-label="Edit" borderRadius={"full"} icon={<MdDelete fontSize={"18px"} color="#1f1f1f" />} onClick={() => handleDelete(update._id)} isLoading={update._id === isDeleteUpdate}/>
                    </Tooltip>
                  </Flex>
                </Flex>

                <Text fontSize={"18px"} fontWeight={"400"} color={"#444746"}>{update.description}</Text>

                <Tooltip label="See details" bg={"#1f1f1f"}>
                  <Link color={"#4796E3"} fontSize={"15px"}>see details</Link>
                </Tooltip>
              </Box>
            ))}
          </Grid>
        ) : (
          <Flex fontSize={"18px"} color={"#1f1f1f"} justifyContent={"center"}>
            Updates Not Found
          </Flex>
        ))}

      {loading && (
        <Flex justifyContent={"center"} mt={"100px"}>
          <Spinner color="#1f1f1f" />
        </Flex>
      )}

      <AddAndEditUpdate
        onClose={onClose}
        isOpen={isOpen}
        modelMode={modelMode}
        updateIdForEdit={updateIdForEdit}
        getUpdates={getUpdates}
      />
    </>
  );
};

export default UpdatesPage;
