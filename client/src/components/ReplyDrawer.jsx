import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Grid, Text, Divider, Badge, Spinner } from "@chakra-ui/react";
import { useDeferredValue, useEffect, useState } from "react";
import FetchAllUpdates from '../helpers/FetchAllUpdates';
import { useRecoilState, useRecoilValue } from "recoil";
import updatesAtom from "../atoms/updatesAtom";
import { formatDistanceToNow } from 'date-fns'
import { BiLock } from "react-icons/bi";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

// STYLES 
// --------------------------------
const QUESTION_TITLE_STYLE = {
    ml : "50px",
    mt : "2",
    fontSize : "17px",
    fontWeight : "400"
}
const QUESTION_BOX_STYLE = {
    w : "full",
    bg : "#222",
    borderRadius : "10px",
    py : "15px",
    px : "15px",
    mb : "5"
}
const FLEX_STYLE = {
    alignItems : "center",
    justifyContent : "space-between"
}
const TEXT_STYLE = {
    fontSize : "17px",
    fontWeight : "400"
}

const ReplyDrawer = ({ onClose, isOpen }) => {
    const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
    const [pendingQuestions, setPendingQuestions] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    // Functions
    const showToast = useShowToast();
    const user = useRecoilValue(userAtom);

    const getUserReplies = async () => {
        setIsQuestionsLoading(true);
        try {
          const response = await fetch("/api/questions/getUserReplies", {
            method: "GET",
            headers: { "Authorization": `Bearer ${user.token}` }
          });
          const data = await response.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          filterQuestions(data.questions);
        } catch (error) {
          showToast("Error", "Something went wrong.", "error");
          console.log(error);
        } finally {
          setIsQuestionsLoading(false);
        }
      }
      useEffect(()=>{
        getUserReplies();
      },[isOpen]);
    
      // Function to filter questions based on status
      const filterQuestions = (questions) => {
        const pending = questions.filter((question) => question.status === "pending");
        const answered = questions.filter((question) => question.status === "answered");
      
        setPendingQuestions(pending);
        setAnsweredQuestions(answered);
      };

    return (
        <Box>
            <Drawer onClose={onClose} isOpen={isOpen} placement={"left"} size={'md'}>
                <DrawerOverlay />
                <DrawerContent bg={'#131313'} color={'#fff'}>
                    <DrawerCloseButton borderRadius={'full'} _hover={{ bg: "#222" }} />
                    <DrawerHeader>View Replys</DrawerHeader>
                    <DrawerBody>
                        {/* Answered */}
                        {!isQuestionsLoading && answeredQuestions.map((question) => (
                            <Box key={question._id} {...QUESTION_BOX_STYLE}>
                                <Flex {...FLEX_STYLE}>
                                    <ReplyHeaderProfileSection
                                        profilePic={question.studentId.profilePic}
                                        fullName={question.studentId.fullName}
                                        date={question.createdAt}
                                    />
                                    <Badge colorScheme="green">{question.status}</Badge>
                                </Flex>

                                <Text {...QUESTION_TITLE_STYLE}>{question.title}</Text>

                                <Divider my={4} borderColor={"#444"}/>

                                <ReplyHeaderProfileSection
                                    profilePic={question.professorId.profilePic}
                                    fullName={question.professorId.fullName}
                                    date={question.updatedAt}
                                />
                                <Flex alignItems={'center'} gap={3} mt={2}>
                                    <Text>Reply:</Text>
                                    <Text {...TEXT_STYLE}>{question.reply}</Text>
                                </Flex>
                            </Box>
                        ))}
                        
                        {/* Pending */}
                        {!isQuestionsLoading && pendingQuestions.map((question) => (
                            <Box key={question._id} {...QUESTION_BOX_STYLE}>
                                <Flex {...FLEX_STYLE}>
                                    <ReplyHeaderProfileSection
                                        profilePic={question.studentId.profilePic}
                                        fullName={question.studentId.fullName}
                                        date={question.createdAt}
                                    />
                                    <Badge colorScheme="red">Pending</Badge>
                                </Flex>
                                <Text {...QUESTION_TITLE_STYLE}>{question.title}</Text>
                                <Flex alignItems={'center'} gap={3} mt={5}>
                                    <Text>To:</Text>
                                    <Flex alignItems={'center'} gap={2}>
                                        <Avatar w={'30px'} height={'30px'} src={question.professorId.profilePic}/>
                                        <Text {...TEXT_STYLE}>{question.professorId.fullName}</Text>
                                    </Flex>
                                </Flex>
                            </Box>
                        ))}
                        
                        {answeredQuestions.length === 0 && pendingQuestions.length === 0 && <Text fontSize={"20px"} color={"#444"} textAlign={"center"} mt={"250px"}>Reply Not Found</Text>}

                        {isQuestionsLoading && <Flex justifyContent={'center'} mt={"250px"}><Spinner color="#444" size={"lg"}/></Flex>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default ReplyDrawer


export const ReplyHeaderProfileSection = ({ profilePic, fullName, date }) => {
    return (
        <Flex alignItems={'center'} gap={3}>
            <Avatar w={'40px'} height={'40px'} src={profilePic} />
            <Box>
                <Text {...TEXT_STYLE} mb={-1}>{fullName}</Text>
                <Text fontSize={'13px'} fontWeight={'400'} color={"#666"}>
                    {formatDistanceToNow(new Date(date))} ago
                </Text>
            </Box>
        </Flex>
    );
};
