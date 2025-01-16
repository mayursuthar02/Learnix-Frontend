import { Box, Button, Flex, Image, Text } from "@chakra-ui/react"
import {Link as RouterLink} from 'react-router-dom';
import logoAi from '../assets/logoai.png'

const Header = () => {
  return (
    <Flex alignItems={'center'} justifyContent={'space-between'} px={'30px'} py={'10px'}>
      {/* Logo */}
      <Flex display={'flex'} alignItems={'center'} gap={2}>
        <Box width={'40px'} height={'40px'} borderRadius={'full'} overflow={'hidden'}>
          <Image src={logoAi} w={'100%'} h={'100%'} objectFit={'cover'}/>
        </Box>
        <Text className="header-logo-text" fontWeight={'600'} fontSize={'30px'}>Learnix</Text>
      </Flex>

      {/* Button */}  
      <Button to={'/login'} as={RouterLink} borderRadius={'full'} fontSize={'17px'} padding={'10px 20px'} fontWeight={'500'}>Login</Button>

    </Flex>
  )
}

export default Header