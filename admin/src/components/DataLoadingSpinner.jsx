import { Flex, Spinner } from "@chakra-ui/react"

const DataLoadingSpinner = () => {
    return (
      <Flex justifyContent={'center'} mt={'100px'}><Spinner color="#1f1f1f"/></Flex>
    )
  }

  export default DataLoadingSpinner