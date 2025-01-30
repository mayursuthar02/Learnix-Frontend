import { Box, Flex, Button, Heading, Badge, Link, Grid, Image, Text, Tooltip, useDisclosure, Avatar, IconButton, Spinner } from '@chakra-ui/react';

// Icons
import { FaPlus } from "react-icons/fa6";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { RiImageCircleAiFill } from "react-icons/ri";

// Styles
import { GRADIENT_BUTTON_STYLE, TOOLTIPS_STYLE } from "../styles/globleStyles";

// Components
import AddAndEditEvent from '../components/AddAndEditEvent';

// Functions
import { format, formatDistanceToNow } from "date-fns";
import { useState } from 'react';
import { useEffect } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import CustomHeading from '../components/Heading';


// STYLES
const ICONBUTTON_STYLE = {
borderRadius : "full",
bg : "#131313",
_hover : {bg: "#222"},
color : "#fff"
}
const BOX_POSITION_STYLE = {
  position : "absolute",
  w : "full",
  height : "300px",
  top : "0",
  left : "0",
  right : "0",
  bottom : "0"
}

const EventPage = () => {
  // Function
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();
  // State
  const user = useRecoilValue(userAtom);
  const [events, setEvents] = useState([]);
  const [modelMode, setModelMode] = useState("add");
  const [eventEditId, setEventEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchAllEventsFunc = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events/getAllEventsAdmin");
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setEvents(data.events);
      console.log(data.events)
    } catch (error) {
      console.log(error);
      showToast("Error", error, "error");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(()=> {
    fetchAllEventsFunc();
  },[]);
  
  // Handle Delete
  const handleDelete = async (eventId) => {
    setIsDeleting(eventId);
    try {
      const response = await fetch(`/api/events/delete/${eventId}`, { method: "DELETE" });
      const data = await response.json();
  
      if (data.error) {
        showToast("Error", data.error.toString(), "error"); 
        return;
      }
      showToast("Success", data.message || "Event deleted successfully", "success");
      fetchAllEventsFunc();
    } catch (error) {
      showToast("Error", error.message || "Something went wrong", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  
  return (
    <Box>
      <Flex justify={"end"} mx={4} mt={2}>
        <Button {...GRADIENT_BUTTON_STYLE} onClick={() => { onOpen(); setModelMode("add"); setEventEditId(null)}}>
          <FaPlus fontSize={"15px"} />
          Add Events
        </Button>
      </Flex>

      <CustomHeading title={"Events"}/>

      <Grid gridTemplateColumns={"repeat(2, 1fr)"} gap={7} px={5} maxHeight={"550px"} overflow={'scroll'} mt={5}>
        {!isLoading && events.map((event) => (
            <Box key={event._id} position={'relative'} w={'full'} height={'300px'} borderRadius={'10px'} overflow={'hidden'}>
              <Box {...BOX_POSITION_STYLE} zIndex={1}>
                  <Box {...BOX_POSITION_STYLE} zIndex={2} bg={"linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)"}></Box>
                  <Image src={event.image} objectFit={'cover'} w={'full'} h={'full'}/>
              </Box>
        
              <Flex position={'absolute'} top={'10px'} right={'10px'} zIndex={4} gap={2}>
                {user._id === event.userId._id && <Tooltip label={"Edit"} zIndex={4} {...TOOLTIPS_STYLE}>
                  <IconButton {...ICONBUTTON_STYLE} icon={<TbEdit fontSize={"18px"}/>} onClick={()=> {onOpen(); setModelMode("edit"); setEventEditId(event._id)}}/>
                </Tooltip>}
                {user._id === event.userId._id && <Tooltip label={"Delete"} zIndex={4} {...TOOLTIPS_STYLE}>
                  <IconButton {...ICONBUTTON_STYLE} icon={<MdDelete fontSize={"18px"}/>} onClick={() => handleDelete(event._id)} isLoading={event._id === isDeleting}/>
                </Tooltip>}
                <Tooltip label={"See image"} zIndex={4} {...TOOLTIPS_STYLE}>
                    <Link href={event.image} target="_blank" {...ICONBUTTON_STYLE} p={2.5}>
                      <RiImageCircleAiFill fontSize={"20px"}/>
                    </Link>
                </Tooltip>
              </Flex>
        
              <Box position={'absolute'} left={"20px"} right={"20px"} bottom={"15px"} zIndex={5}>
                  <Text fontSize={'30px'} fontWeight={'500'} color={"#fff"}>{event.title}</Text>
                  <Text fontSize={'15px'} opacity={.8} fontWeight={'400'} color={"#fff"}>{event.description}</Text>
                  <Flex alignItems={'start'} justifyContent={'space-between'} mt={2}>
                      <Badge fontWeight={'500'} textTransform={'capitalize'} fontSize={'13px'}>Date : {format(event.eventDate, "dd MMMM yyyy")}</Badge>
                      <Flex flexDir={"column"} alignItems={'end'}>
                        <Flex alignItems={'center'} gap={2}>
                          <Avatar src={event.userId?.profilePic} size={"sm"}/>
                          <Text fontSize={'20px'} fontWeight={'400'} color={"#fff"}>{event.userId?.fullName}</Text>
                        </Flex>
                        <Text Text fontSize={'12px'} opacity={.8} color={"#fff"}>{formatDistanceToNow(new Date(event.createdAt))} ago</Text>
                      </Flex>
                  </Flex>
              </Box>
            </Box>
        ))}
      </Grid>

      {isLoading && <Flex alignItems={'center'} mt={"200px"} justifyContent={'center'}><Spinner/></Flex>}

      {!isLoading && events.length === 0 && <Text fontSize={"20px"} mt={"200px"} textAlign={'center'}>Events Not Found</Text>}


      {/* Event Model */}
      <AddAndEditEvent isOpen={isOpen} onClose={onClose} modelMode={modelMode} eventEditId={eventEditId} getData={fetchAllEventsFunc} setEventEditId={setEventEditId}/>
    </Box>
  )
}

export default EventPage