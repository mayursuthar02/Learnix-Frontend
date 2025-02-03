import { Box, Grid } from "@chakra-ui/react"
import SideBar from "../components/SideBar"
import ChatSection from "../components/ChatSection"
import { useState } from "react"

const ChatsPage = () => {
  const [isDisableHelloButton, setIsDisableHelloButton] = useState(false);
  
  return (
    <>
        <Grid gridTemplateColumns={'.28fr 1fr'} minH={'100vh'}>
            {/* SideBar Section */}
            <SideBar setIsDisableHelloButton={setIsDisableHelloButton}/>            
              
            {/* Chat Section */}
            <ChatSection isDisableHelloButton={isDisableHelloButton}/>
        </Grid>
    </>
  )
}

export default ChatsPage