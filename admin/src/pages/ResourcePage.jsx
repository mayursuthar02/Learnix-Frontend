import { useEffect, useState } from "react";
import { Flex, IconButton, Input, Link, Spinner, TableContainer, Tooltip, useDisclosure, Button, Table, Thead, Tbody, Tr, Th, Td, Box, Divider, Tabs, TabList, Tab, TabIndicator, TabPanels, TabPanel, Heading } from "@chakra-ui/react";
// Components
import UploadAndUpdateResource from "../components/UploadAndUpdateResource";
import UploadAndUpdateExamDetails from "../components/UploadAndUpdateExamDetails";
import UploadAndUpdateTimeTable from "../components/UploadAndUpdateTimeTable";
import DataLoadingSpinner from '../components/DataLoadingSpinner';
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
import { MdMenuBook } from "react-icons/md";
import { LuNotebookText } from "react-icons/lu";
import { TbTableFilled } from "react-icons/tb";
import { CgNotes } from "react-icons/cg";
// Hooks
import useShowToast from "../hooks/useShowToast";
import {format} from 'date-fns';
import UploadAndUpdatePreviousPaper from "../components/UploadAndUpdatePreviousPaper";
// Styles
import { BUTTON_ICON_STYLE, GRADIENT_BUTTON_STYLE, TOOLTIPS_STYLE } from "../styles/globleStyles";
import CustomHeading from "../components/Heading";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

  //BASEURL
  import { baseURL as BASEURL } from "../config/baseURL.js";


// STYLES
// -------------------------------------------------
const LINK_STYLE = {
  target : "_blank",
  display : "flex",
  alignItems : "center",
  gap : "1",
  color : "#4b90ff",
  _hover : {opacity: 0.9}
}
const TABS_STYLE = {
  display : "flex",
  alignItems : "center",
  gap : "1",
  color : "#1f1f1f",
  fontWeight : "500"
}

// Main Functions
const ResourcePage = () => {
  // Header Cell
  const HeaderCell = [
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


  // Functions
  const showToast = useShowToast();
  const user = useRecoilValue(userAtom);
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
  const [endpointDataMode, setEndpointDataMode] = useState(`${BASEURL}/api/resources/getResources`);  
  const [DataMode, setDataMode] = useState("materials");

  // Get All Data(Resource, ExamDetails, TimeTable, PreviousExamPapaer)
  const getResources = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${endpointDataMode}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user.token}`
        },
      });
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
      const response = await fetch(`${BASEURL}/api/${endpointRoute}/delete/${resourceId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`
        },
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

  // Modified Resource Title
  const modifiedResourceTitle = (title) => {
    return title.length > 15 ? title.slice(0, 15) + "..." : title;
  }

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" mx={2} mb={'30px'} mt={3}>
        {/* <Input htmlSize={50} width="400px" placeholder="Search..." borderRadius={"50px"} /> */}
        <Box></Box>

        <Flex alignItems={'center'} gap={2}>
          <Button {...GRADIENT_BUTTON_STYLE} onClick={()=> {onOpenPreviousPaperModel(); setModelMode("upload"); setPreviousPaperResourceIdForUpdate(null)}}>
            <FiPaperclip fontSize={"15px"} />
            Previous Paper
          </Button>

          <Button {...GRADIENT_BUTTON_STYLE} onClick={()=> {onOpenTimeTableModel(); setModelMode("upload"); setTimeTableResourceIdForUpdate(null)}}>
            <MdOutlineViewTimeline fontSize={"18px"} />
            Time Table
          </Button>

          <Button {...GRADIENT_BUTTON_STYLE} onClick={()=> {onOpenExamDetailsModel(); setModelMode("upload"); setExamDetailsResourceIdForUpdate(null)}}>
            <MdOutlineEditNote fontSize={"20px"} />
            Exam Details
          </Button>

          <Button {...GRADIENT_BUTTON_STYLE} onClick={()=> {onOpenMaterialModel(); setModelMode("upload"); setResourceIdForUpdate(null)}}>
            <FaPlus fontSize={"15px"} />
            Add Material
          </Button>
        </Flex>
      </Box>

      {/* Tab Section For Materials, Exam Details, Time Table and Exam Paper */}
      <Tabs position='relative' variant='unstyled'>
        <TabList px={5}>
          <Tab {...TABS_STYLE} onClick={() => {setEndpointDataMode(`${BASEURL}/api/resources/getResources`); setDataMode("materials")}}>
            <MdMenuBook />
            Materials
          </Tab>
          <Tab {...TABS_STYLE} onClick={() => {setEndpointDataMode(`${BASEURL}/api/examDetails/getExamDetailsResources`); setDataMode("examDetails")}}>
            <LuNotebookText />
            Exam Details
          </Tab>
          <Tab {...TABS_STYLE} onClick={() => {setEndpointDataMode(`${BASEURL}/api/timeTables/getTimeTableResources`); setDataMode("timeTables")}}>
            <TbTableFilled />
            Time Tables
          </Tab>
          <Tab {...TABS_STYLE} onClick={() => {setEndpointDataMode(`${BASEURL}/api/previousPapers/getPreviousPaperResources`); setDataMode("previousPapers")}}>
            <CgNotes />
            Exam Papers
          </Tab>
        </TabList>

        <TabIndicator mt='-1.5px' height='3px' bg="linear-gradient(90deg, #4796E3, #6658ff)" borderRadius='10px'/>
        
        <TabPanels>

        {[1,2,3,4].map((keyId) => (
          <TabPanel key={keyId}>
            <>
            <CustomHeading title={
              DataMode === "materials" ? "Materials" : 
              DataMode === "examDetails" ? "Exam Details" : 
              DataMode === "timeTables" ? "Time Tables" : "Exam Papers"
              }/>

              <TableContainer mt={3} overflow={"scroll"}>
                <Table>
                  <Thead>
                    <Tr>
                      {HeaderCell.map((cell, i) => {
                        if (i == 3) {
                          if (DataMode === "materials") {
                            return <Th color={"#1f1f1f"} key={"subject"}>Subject</Th>
                          } else if (DataMode === "examDetails" || DataMode === "previousPapers") {
                            return <Th color={"#1f1f1f"} key={"examType"}>Exam Type</Th>
                          } else {
                            return <Th color={"#1f1f1f"} key={"division"}>Division</Th>
                          }
                        } else if (i == 6) {
                          if (DataMode === "examDetails" || DataMode === "previousPapers" || DataMode === "timeTables") {
                            return <Th color={"#1f1f1f"} key={"description"}>Description</Th>
                          } else {
                            return <Th color={"#1f1f1f"} key={"note"}>Note</Th>
                          }
                        } else {
                          return <Th color={"#1f1f1f"} key={cell.id}>{cell.cell}</Th>
                        }
                      })}
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
                              <FaImage {...BUTTON_ICON_STYLE}/>
                            ) : resource.resourceLink.split("/")[7] === "resources" ? (
                              <BsFileEarmarkPdfFill {...BUTTON_ICON_STYLE}/>
                            ) : (
                              <FaLink {...BUTTON_ICON_STYLE}/>
                            )}
                          </Td>
                          <Td textTransform={'capitalize'}>{modifiedResourceTitle(resource?.title)}</Td>

                          {DataMode === "materials" ? (
                            <Td textTransform={'capitalize'}>
                              {
                              // resource?.subject?.length
                              resource?.subject?.length > 20 ? resource?.subject?.slice(0, 20) + "..." : resource?.subject
                              }
                              </Td>
                            ) : DataMode === "examDetails" || DataMode === "previousPapers" ? (
                              <Td textTransform={'capitalize'}>{resource?.examType}</Td>
                            ) :  (
                              <Td textTransform={'capitalize'}>{resource?.division}</Td>
                            )}

                          <Td textTransform={'capitalize'}>{resource?.semester}</Td>
                          <Td>
                            <Tooltip label={resource.resourceLink} {...TOOLTIPS_STYLE} px={2} py={1}>
                              <Link href={resource.resourceLink} {...LINK_STYLE}><RiLinkM/>Link</Link>
                            </Tooltip>
                          </Td>
                          <Td>
                            <Tooltip label={resource.description ? <pre dangerouslySetInnerHTML={{__html: resource.description}} /> : "-"} {...TOOLTIPS_STYLE} px={2} py={1}>
                              <Box cursor={'pointer'} _hover={{color: "#ff5546"}} transition={"color .2s ease"}><IoAlertCircleSharp fontSize={'18px'}/></Box>
                            </Tooltip>
                          </Td>
                          <Td>{format(resource.createdAt, "yyyy-MM-dd")}</Td>
                          <Td>
                              <Flex alignItems={'center'} justifyContent={'center'} gap={1}>
                                <Tooltip label="Edit" {...TOOLTIPS_STYLE}>
                                  <IconButton 
                                  aria-label='Edit' 
                                  borderRadius={'full'} 
                                  icon={<TbEdit {...BUTTON_ICON_STYLE}/>}
                                  onClick={() => {
                                    if (DataMode === "materials") {
                                      onOpenMaterialModel(); setModelMode("update"); setResourceIdForUpdate(resource._id)
                                    } else if (DataMode === "examDetails") {
                                      onOpenExamDetailsModel(); setModelMode("update"); setExamDetailsResourceIdForUpdate(resource._id)
                                    } else if (DataMode === "timeTables") {
                                      onOpenTimeTableModel(); setModelMode("update"); setTimeTableResourceIdForUpdate(resource._id)
                                    } else {
                                      onOpenPreviousPaperModel(); setModelMode("update"); setPreviousPaperResourceIdForUpdate(resource._id)
                                    }
                                  }}
                                  />
                                </Tooltip>
                                <Tooltip label="Delete" {...TOOLTIPS_STYLE}>
                                  <IconButton 
                                  aria-label='Edit' 
                                  borderRadius={'full'} 
                                  icon={<MdDelete {...BUTTON_ICON_STYLE}/>}
                                  onClick={() => {
                                    if (DataMode === "materials") {
                                      handleDelete(resource._id, "resources");
                                    } else if (DataMode === "examDetails") {
                                      handleDelete(resource._id, "examDetails");
                                    } else if (DataMode === "timeTables") {
                                      handleDelete(resource._id, "timeTables");
                                    } else {
                                      handleDelete(resource._id, "previousPapers");
                                    }
                                  }}
                                  isLoading={resource._id === isDeleteResource}
                                  />
                                </Tooltip>
                              </Flex>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={9} {...BUTTON_ICON_STYLE}>
                          <Flex justifyContent={"center"}>
                            {DataMode === "materials" ? "Materials" :
                            DataMode === "examDetails" ? "Exam details" :
                            DataMode === "timeTables" ? "Time Table" :
                            "Previous Paper" } 
                            Not Found</Flex>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>}
                </Table>
              </TableContainer>
              {loading && <DataLoadingSpinner/>}
            </>
          </TabPanel>  
        ))}

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


