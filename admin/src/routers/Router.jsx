import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import logo from '../assets/logoai.png';

import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignUpPage = lazy(() => import("../pages/SignUpPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const UsersPage = lazy(() => import("../pages/UsersPage"));
const ProfessorsPage = lazy(() => import("../pages/ProfessorsPage"));
const ResourcePage = lazy(() => import("../pages/ResourcePage"));
const FAQsPage = lazy(() => import("../pages/FAQsPage"));
const UpdatesPage = lazy(() => import("../pages/UpdatesPage"));
const QuestionsPage = lazy(() => import("../pages/QuestionsPage"));
const EventPage = lazy(() => import("../pages/EventPage"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));



const Router = () => {
  const user = useRecoilValue(userAtom);
  
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to={'/dashboard/resource'}/>}/>
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to={'/dashboard/resource'}/>} />

        <Route path="/dashboard/*" element={<DashboardPage />}>
          <Route index element={<Navigate to="resource" replace />} />
          <Route path="students" element={user ? <UsersPage /> : <Navigate to={'/'}/>} />
          <Route path="professors" element={user ? <ProfessorsPage /> : <Navigate to={'/'}/>} />
          <Route path="resource" element={user ? <ResourcePage /> : <Navigate to={'/'}/>} />
          <Route path="faqs" element={user ? <FAQsPage /> : <Navigate to={'/'}/>} />
          <Route path="questions" element={user ? <QuestionsPage /> : <Navigate to={'/'}/>} />
          <Route path="updates" element={user ? <UpdatesPage /> : <Navigate to={'/'}/>} />
          <Route path="events" element={user ? <EventPage /> : <Navigate to={'/'}/>} />
        </Route>
        
        <Route path="*" element={<PageNotFound />} />
      </Routes>

    </Suspense>
  );
};

export default Router;

export function Loading() {
  return (
    <Flex align={'center'} justifyContent={'center'} h={'100vh'}>
      <Box w={'100px'} h={'100px'} className="logoAnime">
        <Image src={logo} objectFit={'cover'}/>
      </Box>
    </Flex>
  )
}
