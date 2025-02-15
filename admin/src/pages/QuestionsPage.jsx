import { useEffect, useRef, useState } from "react";
import { Button, Tabs, TabList, Tab, TabIndicator,Spinner, Accordion, Grid, AccordionItem, AccordionButton, Flex, Avatar, Text, Box, Heading, Badge, Divider, FormLabel, Input, IconButton, TabPanels, TabPanel, } from "@chakra-ui/react";

// Icons
import { MdOutlineClose } from "react-icons/md";

// Hooks
import useShowToast from "../hooks/useShowToast";
import { format } from 'date-fns';
import {formatDistanceToNow} from 'date-fns';

// Styles
import {GRADIENT_BUTTON_STYLE} from '../styles/globleStyles'
import CustomHeading from "../components/Heading";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";


// STYLES
const TABS_STYLE = {fontWeight : "500", fontSize : "20px", color : "#222"}

const QuestionsPage = () => {
  // State
  const [showReplyInput, setShowReplyInput] = useState(null);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(null);
  // Functions
  const showToast = useShowToast();
  const user = useRecoilValue(userAtom);
  
  const getProfessorQuestions = async () => {
    setIsQuestionsLoading(true);
    try {
      const response = await fetch("/api/questions/getProfessorQuestions", {
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
      setQuestions(data.questions);
      filterQuestions(data.questions);
    } catch (error) {
      showToast("Error", "Something went wrong.", "error");
      console.log(error);
    } finally {
      setIsQuestionsLoading(false);
    }
  }
  useEffect(()=>{
    getProfessorQuestions();
  },[]);

  // Function to filter questions based on status
  const filterQuestions = (questions) => {
    const pending = questions.filter((question) => question.status === "pending");
    const answered = questions.filter((question) => question.status === "answered");
  
    setPendingQuestions(pending);
    setAnsweredQuestions(answered);
  };

  
  // Handle Reply
  const handleReply = async (questionId) => {
    if (!reply) {
      showToast("Error", "Please write your reply", "error");
      return;
    }
    setIsReplying(questionId);
    try {
      const response = await fetch(`/api/questions/replyQuestion/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({reply})
      })
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log(data);
      setShowReplyInput(null);
      getProfessorQuestions();
    } catch (error) {
      showToast("Error", "Something went wrong", "error");
      console.log(error);
    } finally {
      setIsReplying(null);
    }
  }
  
  return (
    <>
      <CustomHeading title={"Questions"}/>

      <Tabs position='relative' variant='unstyled' mt={5}>
        <TabList px={5}>
          <Tab {...TABS_STYLE}>Pending</Tab>
          <Tab {...TABS_STYLE}>Answered</Tab>
        </TabList>

        <TabIndicator mt='-1.5px' height='2px' bg="linear-gradient(90deg, #4796E3, #6658ff)" borderRadius='10px'/>

      { !isQuestionsLoading && 
      <TabPanels>
        <TabPanel>
          <Grid templateColumns='repeat(2, 1fr)' gap={5} my={6}>
          {pendingQuestions.map((question,i) => (
              question.status === "pending" && (
                <Box key={i} border={'1px solid #ededed'} borderRadius={'10px'} p={'20px'}>
                <Flex alignItems={'start'} justifyContent={'space-between'}>
                  <Flex align={'center'} gap={3}>
                    <Avatar src={question?.studentId?.profilePic} size={'md'}/>
                    <Box>
                      <Text fontSize={'17px'} fontWeight={'600'} color={'#47484b'}>{question?.studentId?.fullName || "User deleted"}</Text>
                      <Text color={'#acaeb4'} fontSize={'15px'} fontWeight={'400'}>{formatDistanceToNow(new Date(question.createdAt))} ago</Text>
                    </Box>
                  </Flex>
                  <Badge fontSize={'13px'} colorScheme="red" mb={1}>{question.status}</Badge>
                </Flex>
                <Text fontSize={'18px'} mt={3} color={'#47484b'} fontWeight={'400'}>{question.title}</Text>
                <Flex justifyContent={'end'} align={'center'} mt={3} gap={2} height={'50px'}>
                  {showReplyInput === question._id && <Flex alignItems={'center'} border={'1px solid #ededed'} borderRadius={'full'} gap={2} p={1} w={'full'}>
                    <Input type="text" placeholder="Reply..." value={reply} onChange={(e) => setReply(e.target.value)} border={'none'} outline={'none'} _focus={{border:"none", outline: "none"}} _focusVisible={{border:"none", outline: "none"}} w={'full'} borderRadius={'full'}/>
                      <IconButton borderRadius={'full'} onClick={() => setShowReplyInput(null)} icon={<MdOutlineClose fontSize={'20px'} color="#47484b"/>}/>
                    </Flex>}
                    {showReplyInput === null && <Button {...GRADIENT_BUTTON_STYLE} onClick={() => {setShowReplyInput(question._id)}}>Reply</Button>}
                    {showReplyInput !== null && showReplyInput === question._id && <Button {...GRADIENT_BUTTON_STYLE} onClick={() => {handleReply(question._id)}} isLoading={isReplying === question._id}>Send</Button>}
                  </Flex>
                </Box>
              )
            ))}
          </Grid>
            {pendingQuestions.length === 0 && <Text textAlign={"center"} fontSize={"20px"} color={"#111"}>Question Not Found</Text>}
        </TabPanel>

        <TabPanel>
          <Grid templateColumns='repeat(2, 1fr)' gap={5} my={6}>
          {answeredQuestions.map((question,i) => (
              question.status === "answered" && (
                <Box key={i} border={'1px solid #ededed'} borderRadius={'10px'} p={'20px'}>
                <Flex alignItems={'start'} justifyContent={'space-between'}>
                  <Flex align={'center'} gap={3}>
                    <Avatar src={question?.studentId?.profilePic} size={'md'}/>
                    <Box>
                      <Text fontSize={'17px'} fontWeight={'600'} color={'#47484b'}>{question?.studentId?.fullName || "User deleted"}</Text>
                      <Text color={'#acaeb4'} fontSize={'15px'} fontWeight={'400'}>{formatDistanceToNow(new Date(question.createdAt))} ago</Text>
                    </Box>
                  </Flex>
                  <Badge fontSize={'13px'} colorScheme="green" mb={1}>{question.status}</Badge>
                </Flex>
                <Text fontSize={'18px'} mt={3} color={'#47484b'} fontWeight={'400'}>{question.title}</Text>
                <Text fontSize={'18px'} mt={3} color={'#47484b'} fontWeight={'500'}>Reply</Text>
                <Text fontSize={'18px'} color={'#47484b'} fontWeight={'400'}>{question.reply}</Text>
                <Text color={'#acaeb4'} mt={3} fontSize={'15px'} fontWeight={'400'}>{formatDistanceToNow(new Date(question.updatedAt))} ago</Text>
                </Box>
              )
            ))}
          </Grid>
          {answeredQuestions.length === 0 && <Text textAlign={"center"} fontSize={"20px"} color={"#111"}>Question Not Found</Text>}
        </TabPanel>
      </TabPanels>}

      {isQuestionsLoading && <Flex alignItems={'center'} mt={"200px"} justifyContent={'center'}><Spinner/></Flex>}
      </Tabs>
    </>
  );
};

export default QuestionsPage