import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const loadingBar = keyframes`
  0% { transform: translateX(-100%) }
  50% { transform: translateX(0%) }
  100% { transform: translateX(100%) }
`;

const LoadingAnime = () => {
  const animation = `${loadingBar} 2s infinite ease-in-out`;

  return (
    <Box w={'100%'}>
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          w="100%"
          mb={2}
          h="16px"
          borderRadius="full"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            inset={0}
            bg="linear-gradient(90deg, #131313, #5973f3, #131313)"
            borderRadius="full"
            animation={animation}
            style={{ animationDelay: `${i * 250}ms` }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default LoadingAnime;