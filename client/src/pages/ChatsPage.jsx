import { Box, Grid } from "@chakra-ui/react"
import SideBar from "../components/SideBar"
import ChatSection from "../components/ChatSection"
import { useState } from "react"

const ChatsPage = () => {
  const [isNewConversation, setIsNewConversation] = useState(true);
  
  return (
    <>
        <Grid gridTemplateColumns={'.28fr 1fr'} minH={'100vh'}>
            {/* SideBar Section */}
            <SideBar isNewConversation={isNewConversation}/>            
              
            {/* Chat Section */}
            <ChatSection isNewConversation={isNewConversation} setIsNewConversation={setIsNewConversation}/>
        </Grid>
    </>
  )
}

export default ChatsPage