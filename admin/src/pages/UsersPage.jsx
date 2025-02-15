import {
  Avatar,
  Flex,
  Heading,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
// Function
import { useEffect, useState } from "react";
import { format } from "date-fns";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from '../atoms/userAtom';
// Components
import UpdateUserDetails from "../components/UpdateUserDetails";
import DataLoadingSpinner from "../components/DataLoadingSpinner";
import CustomHeading from "../components/Heading";
// Icons
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
// Styles
import { BUTTON_ICON_STYLE, TOOLTIPS_STYLE } from "../styles/globleStyles";


const UsersPage = () => {
  const headerCell = [
    { id: "sr", cell: "Sr. No." },
    { id: "profilePic", cell: "Profile" },
    { id: "username", cell: "Username" },
    { id: "email", cell: "Email" },
    { id: "phoneNo", cell: "Phone No." },
    { id: "rollNo", cell: "Roll No." },
    { id: "role", cell: "Role" },
    { id: "date", cell: "Date" },
    { id: "actions", cell: "Actions" },
  ];
  const showToast = useShowToast();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [userIdForUpdate, setUserIdForUpdate] = useState(null);
  const [users, setUsers] = useState([]);
  const admin = useRecoilValue(userAtom);
  const [dataLoading, setDataLoading] = useState(false);
  const [isDeletingUserLoading, setIsDeletingUserLoading] = useState(null);
  
  // GET ALL STUDENTS
  const getAllUsers = async () => {
    setDataLoading(true);
    try {
      const response = await fetch("/api/users/getAllStudents", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${admin.token}`
        },
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.message, "error");
        console.log(data.error);
      }
      console.log(data);
      setUsers(data.allUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setDataLoading(false);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  // DELETE STUDENTS
  const deleteUser = async(userId) => {
    if (!userId) {
      showToast("Error", "UserId is required", "error");
    }
    setIsDeletingUserLoading(userId);
    try {
      const response = await fetch(`/api/users/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${admin.token}`
        },
      })
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", data.message, "success");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.log({error});
      showToast("Error", error, "error");
    } finally {
      setIsDeletingUserLoading(null);
    }
  }

  return (
    <>
      <CustomHeading title={"All Students"}/>

      <TableContainer mt={5}>
        <Table variant="simple">
          <Thead>
            <Tr>
              {headerCell
              .filter((cell) => {
                if (admin.role === "admin" && cell.cell === "Actions") {
                  return false;
                }
                return true;
              })
              .map((cell) => (
                <Th color={"#1f1f1f"} key={cell.id}>
                  {cell.cell}
                </Th>
              ))}
            </Tr>
          </Thead>
          {!dataLoading &&
          <Tbody>
            {users?.length > 0 ? (
              users?.map((user, index) => (
                <Tr key={user._id}>
                  <Td color={"#444746"}>{index + 1}</Td>
                  <Td color={"#444746"}>
                    <Avatar src={user.profilePic} />
                  </Td>
                  <Td color={"#444746"} textTransform={"capitalize"}>{user.fullName}</Td>
                  <Td color={"#444746"}>{user.email}</Td>
                  <Td color={"#444746"}>+91 {user.phoneNumber}</Td>
                  <Td color={"#444746"}>{user.studentRollNumber}</Td>
                  <Td color={"#444746"} w={"250px"} position={'relative'} textTransform={"capitalize"}>
                    {user.role}
                  </Td>
                  <Td color={"#444746"}>
                    {format(user.createdAt, "yyyy-MM-dd")}
                  </Td>
                  {admin?.role === "superAdmin" && <Td>
                    <Flex alignItems={'center'} justifyContent={'center'} gap={1}>
                      <Tooltip label="Edit" {...TOOLTIPS_STYLE}>
                        <IconButton 
                        aria-label='Edit' 
                        borderRadius={'full'} 
                        onClick={() => {onOpen(); setUserIdForUpdate(user._id)}}
                        icon={<TbEdit {...BUTTON_ICON_STYLE}/>}
                        />
                      </Tooltip>
                      <Tooltip label="Delete" {...TOOLTIPS_STYLE}>
                        <IconButton 
                        aria-label='Edit' 
                        borderRadius={'full'} 
                        icon={<MdDelete {...BUTTON_ICON_STYLE}/>}
                        onClick={() => deleteUser(user._id)}
                        isLoading={isDeletingUserLoading === user._id}
                        />
                      </Tooltip>
                    </Flex>
                  </Td>}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={8} {...BUTTON_ICON_STYLE}>
                  <Flex justifyContent={"center"}>Users Not Found</Flex>
                </Td>
              </Tr>
            )}
          </Tbody>}
        </Table>
      </TableContainer>
      {dataLoading && <DataLoadingSpinner/>}
      
      <UpdateUserDetails isOpen={isOpen} onClose={onClose} userIdForUpdate={userIdForUpdate} getAllUsers={getAllUsers} profileType={"professor"}/>
    </>
  );
};

export default UsersPage;
