import { lazy, Suspense } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import {useRecoilValue} from 'recoil';
import userAtom from '../atoms/userAtom';

// Pages
const HomePage = lazy(() => import('../pages/HomePage'));
const ChatsPage = lazy(() => import('../pages/ChatsPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));

const Router = () => {
  const user = useRecoilValue(userAtom);
  
  return (
      <Routes>
        <Route path={"/"} element={<HomePage/>}/>
        <Route path={"/chats"} element={user ? <ChatsPage/> : <Navigate to={'/login'}/>}/>
        <Route path={"/chats/conversation/:conversationId"} element={user ? <ChatsPage/> : <Navigate to={'/login'}/>}/>
        <Route path={"/login"} element={!user ? <LoginPage/> : <Navigate to={'/chats'}/>}/>
        <Route path={"/signup"} element={!user ? <SignupPage/> : <Navigate to={'/chats'}/>}/>
      </Routes>
  )
}

export default Router

