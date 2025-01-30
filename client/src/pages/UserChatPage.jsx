import { Box, Grid } from "@chakra-ui/react"

// Components
import UserChatList from "../components/UserChatList";
import UserChatWindow from "../components/UserChatWindow";

const UserChatPage = () => {
  return (
    <>
        <Grid gridTemplateColumns={'.3fr 1fr'} minH={'100vh'}>
            <UserChatList/>
            <UserChatWindow/>
        </Grid>
    </>
  )
}

export default UserChatPage