import { lazy, Suspense } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import {useRecoilValue} from 'recoil';
import userAtom from '../atoms/userAtom';
import { Box, Flex, Image } from '@chakra-ui/react';

import logo from "../assets/logoai.png";

// Pages
const HomePage = lazy(() => import('../pages/HomePage'));
const ChatsPage = lazy(() => import('../pages/ChatsPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));
const FAQsPage = lazy(() => import('../pages/FAQsPage'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));
const UserChatPage = lazy(() => import('../pages/UserChatPage'));

const Router = () => {
  const user = useRecoilValue(userAtom);
  
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path={"/"} element={<HomePage/>}/>
        <Route path={"/faqs"} element={<FAQsPage/>}/>
        <Route path={"/chats"} element={user ? <ChatsPage/> : <Navigate to={'/login'}/>}/>
        <Route path={"/chats/conversation/:conversationId"} element={user ? <ChatsPage/> : <Navigate to={'/login'}/>}/>
        <Route path={"/u/chats"} element={user ? <UserChatPage/> : <Navigate to={'/login'}/>}/>
        <Route path={"/login"} element={!user ? <LoginPage/> : <Navigate to={'/chats'}/>}/>
        <Route path={"/signup"} element={!user ? <SignupPage/> : <Navigate to={'/chats'}/>}/>
        <Route path={"/*"} element={<PageNotFound/>}/>
      </Routes>
    </Suspense>
  )
}

export default Router

export function Loading() {
  return (
    <Flex align={'center'} justifyContent={'center'} h={'100vh'} bg={"#131313"}>
      <Box w={'100px'} h={'100px'} className="logo-rotate-anime">
        <Image src={logo} objectFit={'cover'}/>
      </Box>
    </Flex>
  )
}

