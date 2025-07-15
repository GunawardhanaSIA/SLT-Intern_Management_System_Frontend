import React, {useEffect, useState} from 'react'
import {Button, Input, Select, SelectItem, DatePicker, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
        Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox } from "@nextui-org/react";
import ProjectCard from '../../components/supervisor/dashboard/ProjectCard';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../authentication/Auth';
import axios from 'axios';
import {parseDate, today, getLocalTimeZone } from "@internationalized/date";

export const technology = [
  { key: "Java", label: "Java" },
  { key: "PHP", label: "PHP" },
  { key: "Python", label: "Python" },
  { key: "C#", label: "C#" },
  { key: "MERN", label: "MERN" }
];

const SupervisorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [ supervisorId, setSupervisorId ] = useState();
  const [interns, setInterns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone())); // Default: today's date
  const [attendance, setAttendance] = useState({}); // Stores attendance in { date: { memberId: true/false } }
  const [attendanceData, setAttendanceData] = useState({});
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [targetDate, setTargetDate] = useState(null);
  const [member1, setMember1] = useState(null);
  const [member2, setMember2] = useState(null);
  const [member3, setMember3] = useState(null);
  const [member4, setMember4] = useState(null);
  const [formData, setFormData] = useState({
    technology: "",
    groupName: "",
    projectName: "",
    description: "",
  });
  const [members, setMembers] = useState(["", "", "", ""]);

  const handleMemberChange = (index, value) => {
    setMembers((prevMembers) =>
      prevMembers.map((member, i) => (i === index ? value : member))
    );
  };  

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
        ...prev,
        [field]: value
    }));
  };


  // Convert Date object to a string (YYYY-MM-DD format)
  const formatDate = (date) => date.toString();

  // Handle attendance selection
  // const handleAttendanceChange = (memberId) => {
  //     const dateKey = formatDate(selectedDate);

  //     setAttendance((prev) => ({
  //         ...prev,
  //         [dateKey]: {
  //             ...prev[dateKey],
  //             [memberId]: !prev[dateKey]?.[memberId], // Toggle presence
  //         }
  //     }));
  // };

  // const handleSubmit = () => {
  //     console.log("Attendance Data:", attendance);
  //     alert("Attendance marked successfully!");
  // };

  // Get all unique dates for columns
  // const allDates = Object.keys(attendance).sort(); // Sorted for consistency


  useEffect(() => {
      const token = getToken();
      console.log(token);
      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.user_id;
      console.log(user_id);

      axios.get("http://localhost:8080/supervisor/myInterns",
        {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
        }
      ) 
        .then(response => {
          const filteredInterns = response.data.filter(intern => intern.supervisor.user.id === user_id);
          setInterns(filteredInterns);
          console.log(filteredInterns)
          setSupervisorId(filteredInterns[0].supervisor.supervisorId)
        })
        .catch(error => {
          console.error("Error fetching interns:", error);
        });
  }, []);

  useEffect(() => {
    if (supervisorId) {
      axios.get("http://localhost:8080/supervisor/myProjects", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
        })
        .then(response => {
          console.log(response.data)
          const filteredProjects = response.data.filter(project => project.supervisor.supervisorId === supervisorId);
          setProjects(filteredProjects.sort((a, b) => b.projectId - a.projectId));
          console.log(supervisorId, filteredProjects);

          // filteredProjects.forEach(project => {
          //   axios.get(`http://localhost:8080/supervisor/attendance/${project.projectId}`, {
          //       headers: {
          //           'Content-Type': 'application/json',
          //           'Authorization': `Bearer ${getToken()}`
          //       }
          //   })
          //   .then(attendanceResponse => {
          //     console.log("Raw attendance data: ", attendanceResponse.data);

          //     // Transform data into { date: { internId: status } }
          //     const structuredAttendance = {};

          //     attendanceResponse.data.forEach(record => {
          //         const { date, intern, status } = record;

          //         if (!structuredAttendance[date]) {
          //             structuredAttendance[date] = {};
          //         }
          //         structuredAttendance[date][intern.internId] = status;
          //     });

          //     console.log("Transformed attendance data: ", structuredAttendance);

          //     setAttendanceData(prev => ({
          //         ...prev,
          //         [project.projectId]: structuredAttendance  // Store transformed data
          //     }));

          //     console.log("Type of structuredAttendance:", typeof structuredAttendance);
          //     console.log("Is structuredAttendance an Object?", structuredAttendance instanceof Object);
          //     console.log("Raw Object.keys(structuredAttendance):", Object.keys(structuredAttendance));

          //     const allDates = Object.keys(structuredAttendance).sort(); 


              // Set columns per project
        //       setColumns(prevColumns => ({
        //         ...prevColumns,
        //         [project.projectId]: [
        //             { key: "name", label: "Member Name" },
        //             ...allDates.map(date => ({ key: date, label: date })) // Dynamically set date columns
        //         ]
        //     }));

        //     console.log(columns)

        //       // Set rows per project
        //       setRows(prevRows => ({
        //           ...prevRows,
        //           [project.projectId]: project.interns.map(intern => {
        //               let rowData = { id: intern.internId, name: intern.name };
        //               allDates.forEach(date => {
        //                   rowData[date] = structuredAttendance[date]?.[intern.internId] ? "✅" : "❌";
        //               });
        //               return rowData;
        //           })
        //       }));
        //     })
        //     .catch(error => {
        //         console.error(`Error fetching attendance for project ${project.projectId}:`, error);
        //     });
        // });
        })
        .catch(error => {
          console.error("Error fetching projects:", error);
        });
      }
    }, [supervisorId, attendanceData]);


  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateProject = () => {
    const token = getToken();
  
    const formattedStartDate = startDate.toString();
    const formatTargettDate = targetDate.toString();

    // const projectInterns = [
    //   { internId: member1 },
    //   { internId: member2 },
    //   { internId: member3 },
    //   { internId: member4 }
    // ];

    // console.log(projectInterns)

    const projectInterns = [member1, member2, member3, member4]
      .filter(Boolean)  // Remove any empty (null/undefined) selections
      .map(id => ({ internId: id }));  // Map to { internId: id }

    const projectData = {
      groupName: formData.groupName,
      projectName: formData.projectName,
      description: formData.description,
      technology: formData.technology,
      startDate: formattedStartDate,
      targetDate: formatTargettDate,
      interns: projectInterns
    };

    console.log("submitting data: ", projectData)

    axios.post(`http://localhost:8080/supervisor/createProject?supervisorId=${supervisorId}`, projectData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
      console.log(response.data)
        alert("Project created successfully!");
        setProjects(prevProjects => [response.data, ...prevProjects]); 
        setIsModalOpen(false);  // Close modal on success
    })
    .catch(error => {
        console.error("Error creating project:", error);
        alert("Failed to create project.");
    });
  };

// const handleSaveAttendance = async () => {
//   const token = getToken();
//   const formattedDate = selectedDate.toString();

//   try {
//       const updatedAttendanceData = { ...attendanceData };

//       await Promise.all(selectedInterns.map(async (intern) => {
//           const attendanceEntry = {
//               intern: intern.internId,
//               projectId: selectedProject.projectId,
//               date: formattedDate,
//               status: attendance[formattedDate]?.[intern.internId] || false
//           };

//           console.log("Sending attendance data:", attendanceEntry);

//           const response = await fetch(
//               `http://localhost:8080/supervisor/attendance?internId=${intern.internId}&projectId=${selectedProject.projectId}&date=${formattedDate}&status=${attendanceEntry.status}`, 
//               {
//                   method: "POST",
//                   headers: {
//                       "Content-Type": "application/json",
//                       "Authorization": `Bearer ${token}`,
//                   },
//               }
//           );

//           if (!response.ok) {
//               throw new Error("Failed to save attendance");
//           }

//           console.log("Attendance saved for intern:", intern);

//           // ✅ **Update `updatedAttendanceData` before fetching**
//           if (!updatedAttendanceData[selectedProject.projectId]) {
//               updatedAttendanceData[selectedProject.projectId] = {};
//           }

//           if (!updatedAttendanceData[selectedProject.projectId][formattedDate]) {
//               updatedAttendanceData[selectedProject.projectId][formattedDate] = {};
//           }

//           updatedAttendanceData[selectedProject.projectId][formattedDate][intern.internId] = attendanceEntry.status;
//       }));

//       // ✅ **1. Update state immediately**
//       setAttendanceData(updatedAttendanceData);

//       // ✅ **2. Close modal after updating state**
//       setIsAttendanceModalOpen(false);

//       // ✅ **3. Trigger a re-fetch**
//       fetchUpdatedAttendance(selectedProject.projectId);

//   } catch (error) {
//       console.error("Error saving attendance:", error);
//   }
// };


  const handleOpenModal = () => {
    setIsModalOpen(true); 
};

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };


  return (
    <div className='m-6'>
      <div className='flex justify-between'>
        <h1 className='text-xl text-blue'>Total Number of Projects : {projects.length}</h1>
        <Button className='bg-blue font-bold text-white' onClick={() => handleOpenModal()}>Create New Project</Button>
      </div>

      <div className='flex gap-6 my-8 items-center'>
        <h2 className='font-bold'>Select the Technology</h2>
        <Select
          className='w-36'
          variant="bordered"
          defaultSelectedKeys={["All"]}
        >
          {technology.map((item) => (
          <SelectItem key={item.key} value={item.key}>
              {item.label}
          </SelectItem>
          ))}
        </Select>
        <Button className='border-green font-bold text-green' variant='bordered'>Load Projects</Button>
      </div>

      <div className='flex flex-col justify-center items-center mt-12 mx-40 gap-8'>
        {projects.map((project, index) => (
        <Card className='p-4 mb-5 w-full'>
          <CardHeader className='flex justify-between'>
              <h1 className='font-bold text-lg text-blue'>{project.groupName} - {project.projectName}</h1>
              {/* <Button variant='bordered' className='font-bold text-green bg-none border-green'>Edit Project</Button> */}
          </CardHeader>
          <CardBody>
              <div className="w-full space-y-6 mt-4">
                  <div className="flex flex-wrap md:flex-nowrap gap-6">
                      <Input 
                          // isDisabled
                          size='md' 
                          variant='bordered' 
                          label="Group Name" 
                          labelPlacement='outside' 
                          type="text" 
                          defaultValue={project.groupName}
                          className="w-full md:w-1/2"
                      />

                      <Input 
                          size='md' 
                          // isDisabled
                          variant='bordered' 
                          label="Project Name" 
                          labelPlacement='outside' 
                          type="text" 
                          defaultValue={project.projectName}
                          className="w-full md:w-1/2"
                      />
                  </div>

                  <div>
                      <Textarea  
                          variant='bordered' 
                          // isDisabled
                          label="Description" 
                          labelPlacement='outside' 
                          type="text" 
                          defaultValue={project.description}
                          className="w-full"
                      />
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap gap-6">
                      <Input 
                          variant='bordered' 
                          // isDisabled
                          label="Start Date" 
                          labelPlacement='outside' 
                          defaultValue={project.startDate}
                          className="w-full md:w-1/2"
                      />

                      <Input 
                          variant='bordered' 
                          // isDisabled
                          label="Target Date" 
                          labelPlacement='outside' 
                          defaultValue={project.targetDate}
                          className="w-full md:w-1/2"
                      />
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap gap-6">
                      <Input 
                          variant='bordered' 
                          // isDisabled
                          label="Member 1" 
                          labelPlacement='outside' 
                          defaultValue={project.interns[0]?.name || "N/A"}
                          className="w-full md:w-1/2"
                      />

                      <Input 
                          variant='bordered' 
                          // isDisabled
                          label="Member 2" 
                          labelPlacement='outside' 
                          defaultValue={project.interns[1]?.name || "N/A"}
                          className="w-full md:w-1/2"
                      />
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap gap-6">
                      <Input 
                          variant='bordered' 
                          // isDisabled
                          label="Member 3" 
                          labelPlacement='outside' 
                          defaultValue={project.interns[2]?.name || "N/A"}
                          className="w-full md:w-1/2"
                      />

                      <Input 
                          variant='bordered' 
                          // isDisabled
                          label="Member 4" 
                          labelPlacement='outside' 
                          defaultValue={project.interns[3]?.name || "N/A"}
                          className="w-full md:w-1/2"
                      />
                  </div>

                  <div className='flex justify-between'>
                    <Button variant='bordered' className='font-bold text-blue border-blue'>Add More Members</Button>
                    <Button className='font-bold text-white bg-green'>Save Changes</Button>
                  </div>

                  {/* Past Attendance Table */}
                  {/* <div className="mt-20">
                      <div className='flex justify-between items-center mt-10 mb-3'>
                          <h2 className="font-semibold text-md mb-2">Attendance</h2>

                          <div className="">
                              <Button className="font-bold text-white bg-green" onClick={() => {
                                    setSelectedInterns(project.interns);
                                    setSelectedProject(project);
                                    setIsAttendanceModalOpen(true);
                                }}
                                >
                                  Mark Attendance
                              </Button>
                          </div>
                      </div>
                      
                      <Table aria-label={`Attendance Table for ${project.projectName}`}>
                    <TableHeader columns={columns[project.projectId] || []}>
                        {column => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={rows[project.projectId] || []}>
                        {row => (
                            <TableRow key={row.id}>
                                {columnKey => <TableCell>{row[columnKey]}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </div> */}
              </div>
          </CardBody>

          {/* Attendance Marking Modal */}
          {/* <Modal isOpen={isAttendanceModalOpen} onClose={() => setIsAttendanceModalOpen(false)}>
            <ModalContent>
                      <ModalHeader>Mark Attendance</ModalHeader>
                      <ModalBody>
                          
                          <DatePicker 
                              variant='bordered' 
                              label="Select Attendance Date" 
                              labelPlacement='outside' 
                              selected={selectedDate}
                              onChange={setSelectedDate}
                              className="w-full"
                          />

                          <Table>
                              <TableHeader>
                                  <TableColumn>Member Name</TableColumn>
                                  <TableColumn>Present</TableColumn>
                              </TableHeader>
                              <TableBody>
                                  {selectedInterns.map(intern => (
                                      <TableRow key={intern.internId}>
                                          <TableCell>{intern.name}</TableCell>
                                          <TableCell>
                                              <Checkbox 
                                                  isSelected={attendance[formatDate(selectedDate)]?.[intern.internId] || false} 
                                                  onChange={() => handleAttendanceChange(intern.internId)}
                                              />
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </ModalBody>
                      <ModalFooter>
                          <Button color="danger" variant="light" onClick={() => setIsModalOpen(false)}>
                              Cancel
                          </Button>
                          <Button color="primary" onClick={handleSaveAttendance}>
                              Save Attendance
                          </Button>
                      </ModalFooter>
                  </ModalContent>
              </Modal> */}
          </Card>
        ))}
      </div>

       {/* create new project */}
        <Modal
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            scrollBehavior="inside"
            size="lg"
            style={{ height: '600px' }}
          >
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1 text-blue">
                Create New Project
              </ModalHeader>
              <ModalBody className='flex flex-col gap-8 mt-4'>
                <Select
                  label="Technology"
                  labelPlacement="outside"
                  placeholder="Select the technology"
                  variant="bordered"
                  value={formData.technology}
                  onChange={(e) => handleChange("technology", e.target.value)}
                >
                  {technology.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                      {item.label}
                  </SelectItem>
                  ))}
                </Select>

                <Input 
                  size='md' 
                  variant='bordered' 
                  label="Group Name" 
                  labelPlacement='outside' 
                  type="text" 
                  placeholder='Enter group name' 
                  value={formData.groupName}
                  onChange={(e) => handleInputChange("groupName", e.target.value)}
                />

                <Input 
                  size='md' 
                  variant='bordered' 
                  label="Project Name" 
                  labelPlacement='outside' 
                  type="text" 
                  placeholder='Enter project name' 
                  value={formData.projectName}
                  onChange={(e) => handleInputChange("projectName", e.target.value)}
                />

                <Textarea  
                  variant='bordered' 
                  label="Description" 
                  labelPlacement='outside' 
                  type="text" 
                  placeholder='Enter a description about the project' 
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />

                <DatePicker 
                  variant='bordered' 
                  label="Start Date" 
                  labelPlacement='outside'
                  // value={formData.startDate}
                  // onChange={(e) => handleInputChange("startDate", e.target.value)}
                  onChange={(newDate) => setStartDate(newDate)}
                  granularity="day" 
                  value={startDate}
                />

                <DatePicker 
                  variant='bordered' 
                  label="Target Date" 
                  labelPlacement='outside' 
                  // value={formData.targetDate}
                  // onChange={(e) => handleInputChange("targetDate", e.target.value)}
                  onChange={(newDate) => setTargetDate(newDate)}
                  granularity="day" 
                  value={targetDate}
                />

                <Select
                  label="Member 1"
                  labelPlacement="outside"
                  placeholder="Select the member 1"
                  variant="bordered"
                  // value={formData.member1}
                  // onChange={(e) => handleInputChange("member1", e.target.value)}
                  value={member1}  
                  onChange={(e) => setMember1(e.target.value)}
                >
                  {interns.map((intern) => (
                  <SelectItem key={intern.internId} value={intern.internId}>
                      {intern.name}
                  </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Member 2"
                  labelPlacement="outside"
                  placeholder="Select the member 2"
                  variant="bordered"
                  // value={formData.member2}
                  // onChange={(e) => handleInputChange("member2", e.target.value)}
                  value={member2}  
                  onChange={(e) => setMember2(e.target.value)}
                >
                  {interns.map((intern) => (
                  <SelectItem key={intern.internId} value={intern.internId}>
                      {intern.name}
                  </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Member 3"
                  labelPlacement="outside"
                  placeholder="Select the member 3"
                  variant="bordered"
                  // value={formData.member3}
                  // onChange={(e) => handleInputChange("member3", e.target.value)}
                  value={member3}  
                  onChange={(e) => setMember3(e.target.value)}
                >
                  {interns.map((intern) => (
                  <SelectItem key={intern.internId} value={intern.internId}>
                      {intern.name}
                  </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Member 4"
                  labelPlacement="outside"
                  placeholder="Select the member 4"
                  variant="bordered"
                  // value={formData.member4}
                  // onChange={(e) => handleInputChange("member4", e.target.value)}
                  value={member4}  
                  onChange={(e) => setMember4(e.target.value)}
                >
                  {interns.map((intern) => (
                  <SelectItem key={intern.internId} value={intern.internId}>
                      {intern.name}
                  </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button className='text-red font-bold border-red' variant="bordered" onPress={handleCloseModal}>
                  Close
                </Button>
                <Button className='text-white font-bold bg-green' onClick={handleCreateProject}>
                  Create
                </Button>
              </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
  )
}

export default SupervisorDashboard