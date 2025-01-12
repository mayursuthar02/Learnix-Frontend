import { Button, Heading, IconButton, Spinner, Tooltip, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Flex, Grid, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
// Components
import AddAndEditFAQ from "../components/AddAndEditFAQ";
// Icons
import { FaPlus } from "react-icons/fa6";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
// Functions
import useShowToast from "../hooks/useShowToast";


const FAQsPage = () => {
  // Functions
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // State
  const [FAQs, setFAQs] = useState([]);
  const [modelMode, setModelMode] = useState("");
  const [FAQIdForEdit, setFAQIdForEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteFAQ, setIsDeleteFAQ] = useState(null);

    //   Get User FAQs
    const getFAQs = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/FAQs/getRequestingUserFAQs");
        const data = await response.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data.FAQs);
        setFAQs(data.FAQs || []);
      } catch (error) {
        console.log(error);
        showToast("Error", error.message || "An unknown error occurred", "error");
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      getFAQs();
    }, []);

      // Handle Delete Update
  const handleDelete = async (FAQId) => {
    if (!FAQId) {
      showToast("Error", "Update ID is required", "error");
      return;
    }
    setIsDeleteFAQ(FAQId);
    try {
      const response = await fetch(`/api/FAQs/deleteFAQ/${FAQId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", data.message, "success");
      setFAQs((prev) => prev.filter((FAQ) => FAQ._id !== FAQId));
    } catch (error) {
      console.error(error);
      showToast("Error", "Failed to delete update", "error");
    } finally {
      setIsDeleteFAQ(null);
    }
  };

  return (
    <>
      <Flex justify={"end"} mx={4} mt={2}>
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
          Add FAQ
        </Button>
      </Flex>

      <Heading fontSize={"20px"} px={5} mb={5}>FAQs</Heading>
      
      {!loading && (
        FAQs.length > 0 ? (
          <Accordion allowMultiple mt={7} px={8}>
            <Grid templateColumns="repeat(1, 1fr)" gap={5}>
              {FAQs.map(FAQ => (
                <AccordionItem borderRadius={'10px'} key={FAQ._id}>
                <h2>
                  <AccordionButton border={'2px solid #eee'} borderRadius={'10px'} py={3} _hover={{bg: "#edf2f7"}}>
                    <Box as="span" flex="1" textAlign="left" fontWeight={'600'} textTransform={'capitalize'}>
                      {FAQ.title}
                    </Box>
                    <Flex alignItems={"center"} justifyContent={"center"} gap={2} mr={2}>
                      <Tooltip label="Edit">
                        <IconButton aria-label="Edit" borderRadius={"full"} icon={<TbEdit fontSize={"18px"} color="#1f1f1f" />}
                          onClick={() => {
                            onOpen();
                            setModelMode("edit");
                            setFAQIdForEdit(FAQ._id);
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete">
                        <IconButton aria-label="Edit" borderRadius={"full"} icon={<MdDelete fontSize={"18px"} color="#1f1f1f" />} 
                        onClick={() => handleDelete(FAQ._id)} 
                        isLoading={FAQ._id === isDeleteFAQ}
                        />
                      </Tooltip>
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                
                <AccordionPanel pb={4} border={'2px solid #eee'} borderRadius={'10px'} mt={2} textTransform={'capitalize'}>
                  {FAQ.description}
                </AccordionPanel>
                </AccordionItem>
              ))}
            </Grid>
        </Accordion>
        ) : (
          <Flex fontSize={"18px"} color={"#1f1f1f"} justifyContent={"center"}>
            FAQs Not Found
          </Flex>
        ))}

      {loading && (
        <Flex justifyContent={"center"} mt={"100px"}>
          <Spinner color="#1f1f1f" />
        </Flex>
      )}

      <AddAndEditFAQ onClose={onClose} isOpen={isOpen} modelMode={modelMode} FAQIdForEdit={FAQIdForEdit} getFAQs={getFAQs}/>
    </>
  );
};

export default FAQsPage;
