import { useEffect, useState } from "react";
import { Flex, IconButton, Input, Link, Spinner, TableContainer, Tooltip, useDisclosure, Button, Table, Thead, Tbody, Tr, Th, Td, Box, Divider, Tabs, TabList, Tab, TabIndicator, TabPanels, TabPanel, Heading } from "@chakra-ui/react";
// Components
import UploadAndUpdateResource from "../components/UploadAndUpdateResource";
import UploadAndUpdateExamDetails from "../components/UploadAndUpdateExamDetails";
import UploadAndUpdateTimeTable from "../components/UploadAndUpdateTimeTable";
// Icons
import { GrResources } from "react-icons/gr";
import { FaPlus } from "react-icons/fa6";
import { RiLinkM } from "react-icons/ri";
import { IoAlertCircleSharp } from "react-icons/io5";
import { FaImage } from "react-icons/fa6";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { FaLink } from "react-icons/fa6";
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { MdOutlineEditNote } from "react-icons/md";
import { MdOutlineViewTimeline } from "react-icons/md";
import { FiPaperclip } from "react-icons/fi";
// Hooks
import useShowToast from "../hooks/useShowToast";
import {format} from 'date-fns';
import UploadAndUpdatePreviousPaper from "../components/UploadAndUpdatePreviousPaper";

const ResourcePage = () => {
  // Header Cell
  const materialHeaderCell = [
    { id: "srno", cell: "Sr. No." },
    { id: "-", cell: <GrResources fontSize={"19px"} /> },
    { id: "title", cell: "Title" },
    { id: "subject", cell: "Subject" },
    { id: "semester", cell: "Semester" },
    { id: "resourcelink", cell: "Resource Link" },
    { id: "note", cell: "Note" },
    { id: "uploaddate", cell: "Upload Date" },
    { id: "action", cell: "Action" },
  ];
  const examDetailsHeaderCell = [
    { id: "srno", cell: "Sr. No." },
    { id: "-", cell: <GrResources fontSize={"19px"} /> },
    { id: "title", cell: "Title" },
    { id: "examType", cell: "ExamType" },
    { id: "semester", cell: "Semester" },
    { id: "resourcelink", cell: "Resource Link" },
    { id: "description", cell: "Description" },
    { id: "uploaddate", cell: "Upload Date" },
    { id: "action", cell: "Action" },
  ]; //same Heading for Previous Exam Paper Table Section
  const timeTableHeaderCell = [
    { id: "srno", cell: "Sr. No." },
    { id: "-", cell: <GrResources fontSize={"19px"} /> },
    { id: "title", cell: "Title" },
    { id: "division", cell: "Division" },
    { id: "semester", cell: "Semester" },
    { id: "resourcelink", cell: "Resource Link" },
    { id: "description", cell: "Description" },
    { id: "uploaddate", cell: "Upload Date" },
    { id: "action", cell: "Action" },
  ];


  // Functions
  const showToast = useShowToast();
  const { isOpen: isOpenMaterialModel, onOpen: onOpenMaterialModel, onClose: onCloseMaterialModel } = useDisclosure();
  const { isOpen: isOpenExamDetailsModel, onOpen: onOpenExamDetailsModel, onClose: onCloseExamDetailsModel } = useDisclosure();
  const { isOpen: isOpenTimeTableModel, onOpen: onOpenTimeTableModel, onClose: onCloseTimeTableModel } = useDisclosure();
  const { isOpen: isOpenPreviousPaperModel, onOpen: onOpenPreviousPaperModel, onClose: onClosePreviousPaperModel } = useDisclosure();
  // State
  const [resources, setResources] = useState([]);
  const [modelMode, setModelMode] = useState("");
  const [loading, setLoading] = useState(false);
  // Resources Update Id
  const [resourceIdForUpdate, setResourceIdForUpdate] = useState(null);
  const [examDetailsResourceIdForUpdate, setExamDetailsResourceIdForUpdate] = useState(null);
  const [timeTableResourceIdForUpdate, setTimeTableResourceIdForUpdate] = useState(null);
  const [previousPaperResourceIdForUpdate, setPreviousPaperResourceIdForUpdate] = useState(null);
  const [isDeleteResource, setIsDeleteResource] = useState(null);
  const [endpointDataMode, setEndpointDataMode] = useState("/api/resources/getResources");  
  

  // Get All Data(Resource, ExamDetails, TimeTable, PreviousExamPapaer)
  const getResources = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${endpointDataMode}`);
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setResources(data.resources);
      console.log(data.resources);
    } catch (error) {
      console.log(error);
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getResources();
  }, [endpointDataMode, TabPanel]);

  
  // Delete Resource
  const handleDelete = async (resourceId, endpointRoute) => {
    if (!resourceId) {
      showToast("Error", "Resource ID is required", "error");
      return;
    }
    setIsDeleteResource(resourceId);
    try {
      const response = await fetch(`/api/${endpointRoute}/delete/${resourceId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", data.message, "success");
      setResources((prev) => prev.filter((resource) => resource._id !== resourceId));
    } catch (error) {
      console.error(error);
      showToast("Error", "Failed to delete resource", "error");
    } finally {
      setIsDeleteResource(null);
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" mx={2} mb={'30px'} mt={3}>
        <Input htmlSize={50} width="400px" placeholder="Search..." borderRadius={"50px"} />

        <Flex alignItems={'center'} gap={2}>
          <Button
            bg="linear-gradient(90deg, #4796E3, #6658ff, #ff5546)"
            color="white"
            borderRadius="full"
            transition="background-position 0.3s ease-in-out"
            bgSize="200% 200%"
            bgPos="0% 0%"
            _hover={{ bgPos: "100% 0%" }}
            _active={{ bgPos: "100% 0%", opacity: 0.9 }}
            onClick={()=> {onOpenPreviousPaperModel(); setModelMode("upload"); setPreviousPaperResourceIdForUpdate(null)}}
            display={"flex"}
            alignItems={"center"}
            gap={1}
          >
            <FiPaperclip fontSize={"15px"} />
            Previous Paper
          </Button>

          <Button
            bg="linear-gradient(90deg, #4796E3, #6658ff, #ff5546)"
            color="white"
            borderRadius="full"
            transition="background-position 0.3s ease-in-out"
            bgSize="200% 200%"
            bgPos="0% 0%"
            _hover={{ bgPos: "100% 0%" }}
            _active={{ bgPos: "100% 0%", opacity: 0.9 }}
            onClick={()=> {onOpenTimeTableModel(); setModelMode("upload"); setTimeTableResourceIdForUpdate(null)}}
            display={"flex"}
            alignItems={"center"}
            gap={1}
          >
            <MdOutlineViewTimeline fontSize={"18px"} />
            Time Table
          </Button>

          <Button
            bg="linear-gradient(90deg, #4796E3, #6658ff, #ff5546)"
            color="white"
            borderRadius="full"
            transition="background-position 0.3s ease-in-out"
            bgSize="200% 200%"
            bgPos="0% 0%"
            _hover={{ bgPos: "100% 0%" }}
            _active={{ bgPos: "100% 0%", opacity: 0.9 }}
            onClick={()=> {onOpenExamDetailsModel(); setModelMode("upload"); setExamDetailsResourceIdForUpdate(null)}}
            display={"flex"}
            alignItems={"center"}
            gap={1}
          >
            <MdOutlineEditNote fontSize={"20px"} />
            Exam Details
          </Button>

          <Button
            bg="linear-gradient(90deg, #4796E3, #6658ff, #ff5546)"
            color="white"
            borderRadius="full"
            transition="background-position 0.3s ease-in-out"
            bgSize="200% 200%"
            bgPos="0% 0%"
            _hover={{ bgPos: "100% 0%" }}
            _active={{ bgPos: "100% 0%", opacity: 0.9 }}
            onClick={()=> {onOpenMaterialModel(); setModelMode("upload"); setResourceIdForUpdate(null)}}
            display={"flex"}
            alignItems={"center"}
            gap={1}
          >
            <FaPlus fontSize={"15px"} />
            Add Material
          </Button>
        </Flex>
      </Box>

      {/* Tab Section For Materials, Exam Details, Time Table and Exam Paper */}
      <Tabs position='relative' variant='unstyled'>
        <TabList px={5}>
          <Tab fontWeight={'500'} onClick={() => setEndpointDataMode("/api/resources/getResources")}>Materials</Tab>
          <Tab fontWeight={'500'} onClick={() => setEndpointDataMode("/api/examDetails/getExamDetailsResources")}>Exam Details</Tab>
          <Tab fontWeight={'500'} onClick={() => setEndpointDataMode("/api/timeTables/getTimeTableResources")}>Time Tables</Tab>
          <Tab fontWeight={'500'} onClick={() => setEndpointDataMode("/api/previousPapers/getPreviousPaperResources")}>Exam Papers</Tab>
        </TabList>

        <TabIndicator mt='-1.5px' height='3px' bg="linear-gradient(90deg, #4796E3, #6658ff)" borderRadius='10px'/>
        
        <TabPanels>
          <TabPanel>
            <>
              <Heading fontSize={"20px"} px={5} mb={5} mt={5}>Materials</Heading>
              <TableContainer >
                <Table>
                  <Thead>
                    <Tr>
                      {materialHeaderCell.map((cell) => (
                        <Th color={"#1f1f1f"} key={cell.id}>{cell.cell}</Th>
                      ))}
                    </Tr>
                  </Thead>
                      {!loading && 
                    <Tbody>
                    {resources.length > 0 ? (
                      resources.map((resource, index) => (
                        <Tr color={"#444746"} key={resource._id}>
                          <Td>{index+1}</Td>
                          <Td>
                            {resource.resourceLink.split("/")[7] === "images" ? (
                              <FaImage />
                            ) : resource.resourceLink.split("/")[7] === "resources" ? (
                              <BsFileEarmarkPdfFill />
                            ) : (
                              <FaLink />
                            )}
                          </Td>
                          <Td >{resource.title}</Td>
                          <Td >{resource.subject}</Td>
                          <Td >{resource.semester}</Td>
                          <Td>
                            <Tooltip label={resource.resourceLink} bg={'#1f1f1f'} p={2} borderRadius={'md'}>
                              <Link href={resource.resourceLink} target="_blank" display={'flex'} alignItems={'center'} gap={1} color={"#4b90ff"} _hover={{opacity: 0.9}}><RiLinkM/>Link</Link>
                            </Tooltip>
                          </Td>
                          {/* <Td>{resource.resourceType === "application" ? "PDF" : resource.resourceType}</Td> */}
                          <Td>
                            <Tooltip label={resource.note ? <pre dangerouslySetInnerHTML={{__html: resource.note}} /> : "-"} bg={'#1f1f1f'} p={2} borderRadius={'md'}>
                              <Box cursor={'pointer'} _hover={{color: "#ff5546"}} transition={"color .2s ease"}><IoAlertCircleSharp fontSize={'18px'}/></Box>
                            </Tooltip>
                          </Td>
                          <Td>{format(resource.createdAt, "yyyy-MM-dd")}</Td>
                          <Td>
                              <Flex alignItems={'center'} justifyContent={'center'} gap={1}>
                                <Tooltip label="Edit">
                                  <IconButton 
                                  aria-label='Edit' 
                                  borderRadius={'full'} 
                                  icon={<TbEdit fontSize={'18px'} color="#1f1f1f"/>}
                                  onClick={() => {onOpenMaterialModel(); setModelMode("update"); setResourceIdForUpdate(resource._id)}}
                                  />
                                </Tooltip>
                                <Tooltip label="Delete">
                                  <IconButton 
                                  aria-label='Edit' 
                                  borderRadius={'full'} 
                                  icon={<MdDelete fontSize={'18px'} color="#1f1f1f"/>}
                                  onClick={() => handleDelete(resource._id, "resources")}
                                  isLoading={resource._id === isDeleteResource}
                                  />
                                </Tooltip>
                              </Flex>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={9} fontSize={"18px"} color={"#1f1f1f"}>
                          <Flex justifyContent={"center"}>Materials Not Found</Flex>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>}
                </Table>
              </TableContainer>
              {loading && <Flex justifyContent={'center'} mt={'100px'}><Spinner color="#1f1f1f"/></Flex>}
            </>
          </TabPanel>

          <TabPanel>
            <>
              <Heading fontSize={"20px"} px={5} mb={5} mt={5}>Exam Details</Heading>
              <TableContainer >
                <Table>
                  <Thead>
                    <Tr>
                      {examDetailsHeaderCell.map((cell) => (
                        <Th color={"#1f1f1f"} key={cell.id}>{cell.cell}</Th>
                      ))}
                    </Tr>
                  </Thead>
                      {!loading && 
                    <Tbody>
                    {resources.length > 0 ? (
                      resources.map((resource, index) => (
                        <Tr color={"#444746"} key={resource._id}>
                          <Td>{index+1}</Td>
                          <Td>
                            {resource.resourceLink.split("/")[7] === "images" ? (
                              <FaImage />
                            ) : resource.resourceLink.split("/")[7] === "resources" ? (
                              <BsFileEarmarkPdfFill />
                            ) : (
                              <FaLink />
                            )}
                          </Td>
                          <Td >{resource?.title}</Td>
                          <Td >{resource?.examType}</Td>
                          <Td >{resource?.semester}</Td>
                          <Td>
                            <Tooltip label={resource.resourceLink} bg={'#1f1f1f'} p={2} borderRadius={'md'}>
                              <Link href={resource.resourceLink} target="_blank" display={'flex'} alignItems={'center'} gap={1} color={"#4b90ff"} _hover={{opacity: 0.9}}><RiLinkM/>Link</Link>
                            </Tooltip>
                          </Td>
                          {/* <Td>{resource.resourceType === "application" ? "PDF" : resource.resourceType}</Td> */}
                          <Td>
                            <Tooltip label={resource.description ? <pre dangerouslySetInnerHTML={{__html: resource.description}} /> : "-"} bg={'#1f1f1f'} p={2} borderRadius={'md'}>
                              <Box cursor={'pointer'} _hover={{color: "#ff5546"}} transition={"color .2s ease"}><IoAlertCircleSharp fontSize={'18px'}/></Box>
                            </Tooltip>
                          </Td>
                          <Td>{format(resource.createdAt, "yyyy-MM-dd")}</Td>
                          <Td>
                              <Flex alignItems={'center'} justifyContent={'center'} gap={1}>
                                <Tooltip label="Edit">
                                  <IconButton 
                                  aria-label='Edit' 
                                  borderRadius={'full'} 
                                  icon={<TbEdit fontSize={'18px'} color="#1f1f1f"/>}
                                  onClick={() => {onOpenExamDetailsModel(); setModelMode("update"); setExamDetailsResourceIdForUpdate(resource._id)}}
                                  />
                                </Tooltip>
                                <Tooltip label="Delete">
                                  <IconButton 
                                  aria-label='Edit' 
                                  borderRadius={'full'} 
                                  icon={<MdDelete fontSize={'18px'} color="#1f1f1f"/>}
                                  onClick={() => handleDelete(resource._id, "examDetails")}
                                  isLoading={resource._id === isDeleteResource}
                                  />
                                </Tooltip>
                              </Flex>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={9} fontSize={"18px"} color={"#1f1f1f"}>
                          <Flex justifyContent={"center"}>Exam Details Resources Not Found</Flex>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>}
                </Table>
              </TableContainer>
              {loading && <Flex justifyContent={'center'} mt={'100px'}><Spinner color="#1f1f1f"/></Flex>}
            </>
          </TabPanel>

          <TabPanel>
            <>
              <Heading fontSize={"20px"} px={5} mb={5} mt={5}>Time Tables</Heading>
              <TableContainer >
                <Table>
                  <Thead>
                    <Tr>
                      {timeTableHeaderCell.map((cell) => (
                        <Th color={"#1f1f1f"} key={cell.id}>{cell.cell}</Th>
                      ))}
                    </Tr>
                  </Thead>
                      {!loading && 
                    <Tbody>
                    {resources.length > 0 ? (
                      resources.map((resource, index) => (
                        <Tr color={"#444746"} key={resource._id}>
                          <Td>{index+1}</Td>
                          <Td>
                            {resource.resourceLink.split("/")[7] === "images" ? (
                              <FaImage />
                            ) : resource.resourceLink.split("/")[7] === "resources" ? (
                              <BsFileEarmarkPdfFill />
                            ) : (
                              <FaLink />
                            )}
                          </Td>
                          <Td textTransform={'capitalize'}>{resource?.title}</Td>
                          <Td textTransform={'capitalize'}>{resource?.division}</Td>
                          <Td textTransform={'capitalize'}>{resource?.semester}</Td>
                          <Td>
                            <Tooltip label={resource.resourceLink} bg={'#1f1f1f'} p={2} borderRadius={'md'}>
                              <Link href={resource.resourceLink} target="_blank" display={'flex'} alignItems={'center'} gap={1} color={"#4b90ff"} _hover={{opacity: 0.9}}><RiLinkM/>Link</Link>
                            </Tooltip>
                          </Td>
                          {/* <Td>{resource.resourceType === "application" ? "PDF" : resource.resourceType}</Td> */}
                          <Td>
                            <Tooltip label={resource.description ? <pre dangerouslySetInnerHTML={{__html: resource.description}} /> : "-"} bg={'#1f1f1f'} p={2} borderRadius={'md'}>
                              <Box cursor={'pointer'} _hover={{color: "#ff5546"}} transition={"color .2s ease"}><IoAlertCircleSharp fontSize={'18px'}/></Box>
                            </Tooltip>
                          </Td>
                          <Td>{format(resource.createdAt, "yyyy-MM-dd")}</Td>
                          <Td>
                              <Flex alignItems={'center'} justifyContent={'center'} gap={1}>
                                <Tooltip label="Edit">
                                  <IconButton 
                                  aria-label='Edit' 
                                  borderRadius={'full'} 
                                  icon={<TbEdit fontSize={'18px'} color="#1f1f1f"/>}
                                  onClick={() => {onOpenTimeTableModel(); setModelMode("update"); setTimeTableResourceIdForUpdate(resource._id)}}
                                  />
                                </Tooltip>
                                <Tooltip label="Delete">
                                  <IconButton 
                                  aria-label='Edit' 
                                  borderRadius={'full'} 
                                  icon={<MdDelete fontSize={'18px'} color="#1f1f1f"/>}
                                  onClick={() => handleDelete(resource._id, "timeTables")}
                                  isLoading={resource._id === isDeleteResource}
                                  />
                                </Tooltip>
                              </Flex>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={9} fontSize={"18px"} color={"#1f1f1f"}>
                          <Flex justifyContent={"center"}>Time Table Resources Not Found</Flex>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>}
                </Table>
              </TableContainer>
              {loading && <Flex justifyContent={'center'} mt={'100px'}><Spinner color="#1f1f1f"/></Flex>}
            </>
          </TabPanel>

          <TabPanel>
            <>
              <Heading fontSize={"20px"} px={5} mb={5} mt={5}>Previous Exam Papers</Heading>
              <TableContainer >
                <Table>
                  <Thead>
                    <Tr>
                      {examDetailsHeaderCell.map((cell) => (
                        <Th color={"#1f1f1f"} key={cell.id}>{cell.cell}</Th>
                      ))}
                    </Tr>
                  </Thead>
                      {!loading && 
                    <Tbody>
                    {resources.length > 0 ? (
                      resources.map((resource, index) => (
                        <Tr color={"#444746"} key={resource._id}>
                          <Td>{index+1}</Td>
                          <Td>
                            {resource.resourceLink.split("/")[7] === "images" ? (
                              <FaImage />
                            ) : resource.resourceLink.split("/")[7] === "resources" ? (
                              <BsFileEarmarkPdfFill />
                            ) : (
                              <FaLink />
                            )}
                          </Td>
                          <Td textTransform={'capitalize'}>{resource?.title}</Td>
                          <Td textTransform={'capitalize'}>{resource?.examType}</Td>
                          <Td textTransform={'capitalize'}>{resource?.semester}</Td>
                          <Td>
                            <Tooltip label={resource.resourceLink} bg={'#1f1f1f'} p={2} borderRadius={'md'}>
                              <Link href={resource.resourceLink} target="_blank" display={'flex'} alignItems={'center'} gap={1} color={"#4b90ff"} _hover={{opacity: 0.9}}><RiLinkM/>Link</Link>
                            </Tooltip>
                          </Td>
                          {/* <Td>{resource.resourceType === "application" ? "PDF" : resource.resourceType}</Td> */}
                          <Td>
                            <Tooltip label={resource.description ? <pre dangerouslySetInnerHTML={{__html: resource.description}} /> : "-"} bg={'#1f1f1f'} p={2} borderRadius={'md'}>
                              <Box cursor={'pointer'} _hover={{color: "#ff5546"}} transition={"color .2s ease"}><IoAlertCircleSharp fontSize={'18px'}/></Box>
                            </Tooltip>
                          </Td>
                          <Td>{format(resource.createdAt, "yyyy-MM-dd")}</Td>
                          <Td>
                              <Flex alignItems={'center'} justifyContent={'center'} gap={1}>
                                <Tooltip label="Edit">
                                  <IconButton 
                                  aria-label='Edit' 
                                  borderRadius={'full'} 
                                  icon={<TbEdit fontSize={'18px'} color="#1f1f1f"/>}
                                  onClick={() => {onOpenPreviousPaperModel(); setModelMode("update"); setPreviousPaperResourceIdForUpdate(resource._id)}}
                                  />
                                </Tooltip>
                                <Tooltip label="Delete">
                                  <IconButton 
                                  aria-label='Edit' 
                                  borderRadius={'full'} 
                                  icon={<MdDelete fontSize={'18px'} color="#1f1f1f"/>}
                                  onClick={() => handleDelete(resource._id, "previousPapers")}
                                  isLoading={resource._id === isDeleteResource}
                                  />
                                </Tooltip>
                              </Flex>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={9} fontSize={"18px"} color={"#1f1f1f"}>
                          <Flex justifyContent={"center"}>Previous Paper Resources Not Found</Flex>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>}
                </Table>
              </TableContainer>
              {loading && <Flex justifyContent={'center'} mt={'100px'}><Spinner color="#1f1f1f"/></Flex>}
            </>
          </TabPanel>

        </TabPanels>
      </Tabs>
      
      {/* Upload And Update Material */}
      <UploadAndUpdateResource modelMode={modelMode} onClose={onCloseMaterialModel} isOpen={isOpenMaterialModel} resourceIdForUpdate={resourceIdForUpdate} getResources={getResources}/>
      {/* Upload And Update Exam Details */}
      <UploadAndUpdateExamDetails modelMode={modelMode} onClose={onCloseExamDetailsModel} isOpen={isOpenExamDetailsModel} resourceIdForUpdate={examDetailsResourceIdForUpdate} getResources={getResources}/>
      {/* Upload And Update Time Table */}
      <UploadAndUpdateTimeTable modelMode={modelMode} onClose={onCloseTimeTableModel} isOpen={isOpenTimeTableModel} resourceIdForUpdate={timeTableResourceIdForUpdate} getResources={getResources}/>
      {/* Upload And Update Previous Paper */}
      <UploadAndUpdatePreviousPaper modelMode={modelMode} onClose={onClosePreviousPaperModel} isOpen={isOpenPreviousPaperModel} resourceIdForUpdate={previousPaperResourceIdForUpdate} getResources={getResources}/>
    </>
  );
};

export default ResourcePage;
