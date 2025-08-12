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
import { GRADIENT_BUTTON_STYLE, TOOLTIPS_STYLE } from "../styles/globleStyles";
import CustomHeading from "../components/Heading";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

  //BASEURL
  import { baseURL as BASEURL } from "../config/baseURL.js";


const FAQsPage = () => {
  // Functions
  const showToast = useShowToast();
  const user = useRecoilValue(userAtom);
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
        const response = await fetch(`${BASEURL}/api/FAQs/getRequestingUserFAQs`, {
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
      const response = await fetch(`${BASEURL}/api/FAQs/deleteFAQ/${FAQId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`
        },
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
        <Button {...GRADIENT_BUTTON_STYLE}
          onClick={() => {
            onOpen();
            setModelMode("add");
          }}
        >
          <FaPlus fontSize={"15px"} />
          Add FAQ
        </Button>
      </Flex>

      <CustomHeading title={"FAQs"}/>
      
      {!loading && (
        FAQs.length > 0 ? (
          <Accordion allowMultiple border={'none'} mt={5} mx={"50px"} color={"#fff"} fontWeight={"400"} overflow={"hidden"} borderRadius={"20px"}>
            <Grid templateColumns="repeat(1, 1fr)" gap={1}>
              {FAQs.map(FAQ => (
                <AccordionItem borderRadius={"5px"} overflow={'hidden'} border={'none'} key={FAQ._id}>
                <h2>
                  <AccordionButton border={'none'} bg={"#f0f4f9"} _hover={{bg: "#f0f4f9"}} py={4} px={"30px"} fontSize={"17px"}>
                    <Box as="span" flex="1" textAlign="left" fontWeight={'500'} color={"#111"}>
                      {FAQ.title}
                    </Box>
                    <Flex alignItems={"center"} justifyContent={"center"} gap={2} mr={2}>
                      <Tooltip label="Edit" {...TOOLTIPS_STYLE}>
                        <IconButton aria-label="Edit" borderRadius={"full"} icon={<TbEdit fontSize={"18px"} color="#1f1f1f" />}
                          onClick={() => {
                            onOpen();
                            setModelMode("edit");
                            setFAQIdForEdit(FAQ._id);
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete" {...TOOLTIPS_STYLE}>
                        <IconButton aria-label="Edit" borderRadius={"full"} icon={<MdDelete fontSize={"18px"} color="#1f1f1f" />} 
                        onClick={() => handleDelete(FAQ._id)} 
                        isLoading={FAQ._id === isDeleteFAQ}
                        />
                      </Tooltip>
                    </Flex>
                    <AccordionIcon color={"#111"}/>
                  </AccordionButton>
                </h2>
                
                <AccordionPanel py={4} px={"30px"} border={'none'} bg={"#f0f4f9"} fontSize={"17px"} fontWeight={"400"} color={"#111"}>
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
