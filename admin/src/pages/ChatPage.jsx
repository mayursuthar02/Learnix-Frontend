import { Box, Grid } from "@chakra-ui/react"

// Components
import MyChats from "../components/MyChats"
import ChatWindow from "../components/ChatWindow"

const ChatPage = () => {
  return (
    <Grid gridTemplateColumns={'.3fr 1fr'} minH={'100vh'}>
        <MyChats/>
        <ChatWindow/>
    </Grid>
  )
}

export default ChatPage