import { Flex, IconButton,Tooltip, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
// Icons
import { FiMessageSquare } from "react-icons/fi";
import { SlOptionsVertical } from "react-icons/sl";
import { IoMdShareAlt } from "react-icons/io";
import { MdDelete } from "react-icons/md";
// Hooks
import useShowToast from '../hooks/useShowToast';
import { Link as RouterLink, useParams } from "react-router-dom";

const Conversation = ({ conversation, handleDeleteConversation }) => {
  // Functions
  const showToast = useShowToast();
  const {conversationId } = useParams();

  return (
    <Tooltip label={conversation.title.length > 25
      ? conversation.title.slice(0, 25) + "..."
      : conversation.title} 
      bg={'#222'} color={'#fff'} placement='right'>
      <Flex
      alignItems={"center"}
      justifyContent={"space-between"}
      borderRadius={"50px"}
      pl={4}
      pr={1}
      py={1}
      bg={conversation?._id === conversationId ? '#242424' : 'transparent'}
      color={"#fff"}
      _hover={{ color: "#fff", bg: "#242424" }}
      transition={"color 0.3s ease, background 0.3s ease"}
      cursor={"pointer"}
      >
        <Flex as={RouterLink} to={`/chats/conversation/${conversation._id}`} gap={2} alignItems={"center"} height={'100%'} w={'100%'}>
          <FiMessageSquare />
          <Text fontSize={"15px"} fontWeight={"400"}>
            {conversation.title.length > 25
              ? conversation.title.slice(0, 25) + "..."
              : conversation.title}
          </Text>
        </Flex>

        <Menu isLazy>
          <MenuButton as={IconButton} borderRadius={'full'} bg={'transparent'} icon={<SlOptionsVertical/>} border={"none"} color={"#333"} _hover={{bg: "#333", color: "#fff"}} _active={{bg: "#333", color: "#fff"}} transition={"color 0.3s ease, background 0.3s ease"} aria-label='Options' variant='outline'/>
          <MenuList bg={"#222"} border={"none"} borderRadius={"lg"} zIndex={3}>
            <MenuItem bg={"#222"} _hover={{bg: "#333"}} px={5} display={"flex"} alignItems={'center'} gap={2}><IoMdShareAlt/> Share</MenuItem>
            <MenuItem bg={"#222"} _hover={{bg: "#333"}} px={5} display={"flex"} alignItems={'center'} gap={2} onClick={()=> handleDeleteConversation(conversation._id)}><MdDelete/> Delete</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Tooltip>
  );
};

export default Conversation;
