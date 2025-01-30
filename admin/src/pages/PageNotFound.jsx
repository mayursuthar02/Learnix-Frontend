import { Box, Button, Flex, Grid, Image, Text } from "@chakra-ui/react"
import Logo from "../assets/logoai.png";
import { GRADIENT_BUTTON_STYLE } from "../styles/globleStyles";
import { Link as RouterLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Grid templateColumns={"1fr 1fr"} h={"100vh"} w={"100%"} bg={"#fff"}>

        <Flex alignItems={"center"} justifyContent={"center"} flexDir={"column"}>
            <Text className="header-logo-text" fontSize={"150px"} mb={"-50px"} fontWeight={"500"}>404</Text>
            <Text fontSize={"60px"} color={"#dfe3e7"} fontWeight={"500"}>PAGE NOT FOUND</Text>
            <Text fontSize={"15px"} color={"#999"}>The requested URL was not found on this server.</Text>
            <Button as={RouterLink} to={"/"} {...GRADIENT_BUTTON_STYLE} mt={5} fontWeight={"400"}>Back To Home</Button>
        </Flex>

        <Flex alignItems={"center"} justify={"center"}>
            <Box w={"500px"} h={"500px"} className="logo-rotate-anime">
                <Image src={Logo} objectFit={"cover"}/>
            </Box>
        </Flex>
    </Grid>
  )
}

export default PageNotFound