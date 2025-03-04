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
import { GRADIENT_BUTTON_STYLE, TOOLTIPS_STYLE } from "../styles/globleStyles";
import CustomHeading from "../components/Heading";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const UpdatesPage = () => {
  // Functions
  const showToast = useShowToast();
  const user = useRecoilValue(userAtom);
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
      const response = await fetch("/api/updates/getRequestingUserUpdates", {
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
        headers: { "Authorization": `Bearer ${user.token}` }
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
          {...GRADIENT_BUTTON_STYLE}
          onClick={() => {
            onOpen();
            setModelMode("add");
          }}
        >
          <FaPlus fontSize={"15px"} />
          Add Update
        </Button>
      </Flex>

      <CustomHeading title={"Updates"}/>

      {!loading &&
        (updates.length > 0 ? (
          <Grid templateColumns={"1fr 1fr"} px={5} gap={5} mt={5}>
            {updates.map((update) => (
              <Box key={update._id} border={"1px solid #ddd"} p={5} borderRadius={"10px"}>
                <Flex alignItems={"center"} justifyContent={"space-between"} borderBottom={"1px solid #ddd"} pb={2} mb={2}>
                  <Text fontSize={"20px"} fontWeight={"500"} color={"#1f1f1f"}>{update.title}</Text>

                  <Flex alignItems={"center"} justifyContent={"center"} gap={2}>
                    <Tooltip label="Edit" {...TOOLTIPS_STYLE}>
                      <IconButton aria-label="Edit" borderRadius={"full"} icon={<TbEdit fontSize={"18px"} color="#1f1f1f" />}
                        onClick={() => {
                          onOpen();
                          setModelMode("edit");
                          setUpdateIdForEdit(update._id);
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Delete" {...TOOLTIPS_STYLE}>
                      <IconButton aria-label="Edit" borderRadius={"full"} icon={<MdDelete fontSize={"18px"} color="#1f1f1f" />} onClick={() => handleDelete(update._id)} isLoading={update._id === isDeleteUpdate}/>
                    </Tooltip>
                  </Flex>
                </Flex>

                <Text fontSize={"18px"} fontWeight={"400"} color={"#444746"}>{update.description}</Text>

                {/* <Tooltip label="See details" {...TOOLTIPS_STYLE}>
                  <Link color={"#4796E3"} fontSize={"15px"}>see details</Link>
                </Tooltip> */}
              </Box>
            ))}
          </Grid>
        ) : (
          <Flex fontSize={"18px"} color={"#1f1f1f"} justifyContent={"center"}>Updates Not Found</Flex>
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
