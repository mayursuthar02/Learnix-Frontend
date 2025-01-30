import { Badge, Link, Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Grid, IconButton, Image, Text, Tooltip } from "@chakra-ui/react"
import img from '../assets/762faf61a5dd1_397068.webp'
import { RiImageCircleAiFill } from "react-icons/ri";

// Styles
import { TOOLTIP_STYLE } from '../styles/globleStyles'
import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import FetchAllEvents from "../helpers/FetchAllEvents";
import { useRecoilState } from "recoil";
import eventsAtom from "../atoms/eventsAtom";

const EventsDrawer = ({onClose, isOpen}) => {
  // State
  const [events, _] = useRecoilState(eventsAtom);
  const [loading, setLoading] = useState(false);
  // Function
  const fetchAllEventsFunc = FetchAllEvents();

  useEffect(()=> {
    setLoading(true);
    try {
      fetchAllEventsFunc();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  },[]);
  
  return (
    <Box>
      <Drawer onClose={onClose} isOpen={isOpen} placement={"left"} size={'md'}>
        <DrawerOverlay />
        <DrawerContent bg={'#131313'} color={'#fff'}>
          <DrawerCloseButton borderRadius={'full'} _hover={{bg:"#222"}}/>
          <DrawerHeader>Events</DrawerHeader>
          <DrawerBody>
            <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={7}>
              {events.map((event) => (
                  <Box key={event._id} position={'relative'} w={'full'} height={'300px'} borderRadius={'10px'} overflow={'hidden'}>
                    <Box position={'absolute'} w={'full'} height={'300px'} top={0} left={0} right={0} bottom={0} zIndex={1}>
                        <Box position={'absolute'} w={'full'} height={'300px'} top={0} left={0} right={0} bottom={0} zIndex={2} bg={"linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)"}></Box>
                        <Image src={event.image} objectFit={'cover'} w={'full'} h={'full'}/>
                    </Box>
              
                    <Tooltip {...TOOLTIP_STYLE} label={"See image"} zIndex={4}>
                        <Link href={event.image} target="_blank" borderRadius={"full"} bg={'#131313'} _hover={{bg: "#222"}} color={"#fff"} p={2} position={'absolute'} top={'10px'} right={'10px'} zIndex={4}>
                          <RiImageCircleAiFill fontSize={"20px"}/>
                        </Link>
                    </Tooltip>
              
                    <Box position={'absolute'} left={"20px"} right={"20px"} bottom={"15px"} zIndex={5}>
                        <Text fontSize={'30px'} fontWeight={'500'}>{event.title}</Text>
                        <Text fontSize={'15px'} opacity={.8} fontWeight={'400'}>{event.description}</Text>
                        <Flex alignItems={'center'} justifyContent={'space-between'} mt={2}>
                            <Badge fontWeight={'500'} opacity={.8} textTransform={'capitalize'} fontSize={'13px'}>Date : {format(event.eventDate, "dd MMMM yyyy")}</Badge>
                            <Text fontSize={'12px'} opacity={.8}>{formatDistanceToNow(new Date(event.createdAt))} ago</Text>
                        </Flex>
                    </Box>
                  </Box>
              ))}
            </Grid>

            {events.length === 0 && <Text textAlign={'center'} mt={"280px"} color={"#666"} fontSize={"20px"}>Events Not Found</Text>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default EventsDrawer