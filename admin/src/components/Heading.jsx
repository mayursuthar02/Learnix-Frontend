import { Heading } from "@chakra-ui/react";

const CustomHeading = ({title}) => {
  return (
    <Heading color={"#333"} fontSize={"25px"} fontWeight={"600"} px={"15px"} mt={5}>
        {title}
    </Heading>
  )
}

export default CustomHeading