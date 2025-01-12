import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Grid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FetchAllUpdates from '../helpers/FetchAllUpdates';
import { useRecoilState } from "recoil";
import updatesAtom from "../atoms/updatesAtom";
import { formatDistanceToNow } from 'date-fns'

const UpdatesDrawer = ({onClose, isOpen}) => {
  const [updates, setUpdates] = useRecoilState(updatesAtom);
  const fetchAllUpdatesFunc = FetchAllUpdates();
  
  useEffect(() => {
    fetchAllUpdatesFunc();
  }, [])
  
  return (
    <Box>
      <Drawer onClose={onClose} isOpen={isOpen} placement={"left"} size={'md'}>
        <DrawerOverlay />
        <DrawerContent bg={'#131313'} color={'#fff'}>
          <DrawerCloseButton borderRadius={'full'} _hover={{bg:"#222"}}/>
          <DrawerHeader>Updates</DrawerHeader>
          <DrawerBody>
            <Accordion allowMultiple w={'full'}>
                <Grid templateColumns="repeat(1, 1fr)" gap={5}>
                    {updates.map((update) => (
                        <AccordionItem key={update._id} borderRadius={'10px'} border={"none"} bg="#222">
                        <h2>
                          <AccordionButton borderRadius={'10px'} py={3} _hover={{bg: "transparent"}}>
                            <Grid templateColumns={'1fr'} w={'full'}>
                                <Flex alignItems={'center'} justifyContent={'space-between'}>
                                  <Flex alignItems={'center'} gap={2}>
                                      <Avatar src={update.userId?.profilePic} size={'sm'}/>   
                                      <Text>{update.userId?.fullName}</Text>
                                  </Flex>
                                  <Text textAlign={'left'} fontSize={"15px"} color={"#777"}>{formatDistanceToNow(new Date(update.createdAt))} ago</Text>
                                </Flex>
                                <Flex alignItems={'center'} justifyContent={'space-between'} mt={4}>
                                    <Text textAlign={'left'} textTransform={'capitalize'} fontWeight={'500'} fontSize={'20px'}>{update.title}</Text>
                                    <AccordionIcon />
                                </Flex>
                            </Grid>
                          </AccordionButton>
                        </h2>

                        <AccordionPanel pb={4} borderRadius={'10px'}>
                            <Box as="pre" whiteSpace="pre-wrap" fontFamily="'Outfit', sans-serif" fontWeight="400" margin="0">
                              {update.description}
                            </Box>
                        </AccordionPanel>
                    </AccordionItem>
                    ))}
                </Grid>
            </Accordion>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default UpdatesDrawer;
