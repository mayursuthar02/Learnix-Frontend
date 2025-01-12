import {
  Avatar,
  Flex,
  Heading,
  IconButton,
  Select,
  Spinner,
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
import { useEffect, useState } from "react";
import { format } from "date-fns";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from '../atoms/userAtom';
import UpdateUserDetails from "../components/UpdateUserDetails";
// Icons
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";

const UsersPage = () => {
  const headerCell = [
    { id: "sr", cell: "Sr. No." },
    { id: "profilePic", cell: "Profile" },
    { id: "username", cell: "Username" },
    { id: "email", cell: "Email" },
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
  const [isLoading, setIsLoading] = useState(null);
  const [isDeletingUserLoading, setIsDeletingUserLoading] = useState(null);
  
  const getAllUsers = async () => {
    setDataLoading(true);
    try {
      const response = await fetch("/api/users/getAllStudents");
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

  const deleteUser = async(userId) => {
    if (!userId) {
      showToast("Error", "UserId is required", "error");
    }
    setIsDeletingUserLoading(userId);
    try {
      const response = await fetch(`/api/users/delete-user/${userId}`, {
        method: "DELETE",
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
      <Heading
        color={"#333"}
        fontSize={"25px"}
        fontWeight={"600"}
        px={"15px"}
        mt={5}
      >
        All Students
      </Heading>

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
                  <Td color={"#444746"} w={"250px"} position={'relative'} textTransform={"capitalize"}>
                    {/* {isLoading === user._id && <Spinner position={'absolute'} top={'40%'} left={"45%"} transform={"translate(-50%, -50%)"} zIndex={1} color="#ccc"/>}
                    <Select 
                    value={user.role} 
                    onChange={(e) => updateUserRole(e.target.value, user._id)}
                    isDisabled={isLoading === user._id || isDeletingUserLoading !== null}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Select> */}
                    {user.role}
                  </Td>
                  <Td color={"#444746"}>
                    {format(user.createdAt, "yyyy-MM-dd")}
                  </Td>
                  {admin?.role === "superAdmin" && <Td>
                    <Flex alignItems={'center'} justifyContent={'center'} gap={1}>
                      <Tooltip label="Edit">
                        <IconButton 
                        aria-label='Edit' 
                        borderRadius={'full'} 
                        onClick={() => {onOpen(); setUserIdForUpdate(user._id)}}
                        icon={<TbEdit fontSize={'18px'} color="#1f1f1f"/>}
                        />
                      </Tooltip>
                      <Tooltip label="Delete">
                        <IconButton 
                        aria-label='Edit' 
                        borderRadius={'full'} 
                        icon={<MdDelete fontSize={'18px'} color="#1f1f1f"/>}
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
                <Td colSpan={8} fontSize={"18px"} color={"#1f1f1f"}>
                  <Flex justifyContent={"center"}>Users Not Found</Flex>
                </Td>
              </Tr>
            )}
          </Tbody>}
        </Table>
      </TableContainer>
      {dataLoading && <Flex justifyContent={'center'} mt={'100px'}><Spinner color="#1f1f1f"/></Flex>}
      <UpdateUserDetails isOpen={isOpen} onClose={onClose} userIdForUpdate={userIdForUpdate} getAllUsers={getAllUsers} profileType={"professor"}/>
    </>
  );
};

export default UsersPage;
