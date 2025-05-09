import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { getToken } from '../../../pages/authentication/Auth';
import "../../../Table.css";
import {Button, Select, SelectItem, Input, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, RadioGroup, Radio, Textarea, user} from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserXmark } from "react-icons/fa6";

const TodayInterviews = () => {
  const [applicants, setApplicants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [supervisors, setSupervisors] = useState([]); // List of supervisors
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

    useEffect(() => {
      const token = getToken();
      console.log(token);

      axios.get("http://localhost:8080/admin/applicants",
        {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
        }
      ) 
        .then(response => {
          const filteredApplicants = response.data.filter(applicant => applicant.interviewDate === new Date().toISOString().split('T')[0]);
          setApplicants(filteredApplicants);
          console.log(filteredApplicants)
        })
        .catch(error => {
          console.error("Error fetching applicants:", error);
        });


        // Fetch the list of supervisors
        axios
        .get("http://localhost:8080/admin/supervisors", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setSupervisors(response.data);
          console.log(supervisors)
        })
        .catch((error) => {
          console.error("Error fetching supervisors:", error);
        });
    }, []);


    const handleSaveIntern = (applicant, selectedSupervisor) => {
      const token = getToken(); // Get authentication token
    
      const requestData = {
        name: applicant.name,
        nic: applicant.nic,
        mobileNumber: applicant.mobileNumber,
        email: applicant.email,
        address: applicant.address,
        educationalInstitute: applicant.educationalInstitute,
        degree: applicant.degree,
        academicYear: applicant.academicYear,
        internshipPeriod: applicant.internshipPeriod,
        specialization: applicant.specialization,
        programmingLanguages: applicant.programmingLanguages,
        resumeURL: applicant.resumeURL,
        startDate: new Date().toISOString().split('T')[0]
      };
    
      console.log("Request Payload:", requestData);
      console.log("Selected Supervisor ID:", selectedSupervisor);

      try {
        const postResponse = fetch(`http://localhost:8080/admin/createIntern?userId=${applicant.user.id}&applicantId=${applicant.applicantId}&supervisorId=${selectedSupervisor}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });
    
        console.log("Intern saved successfully!");
        console.log("Intern saved successfully!");
        setApplicants(prevApplicants => prevApplicants.filter(a => a.applicantId !== applicant.applicantId));
        setIsSupervisorModalOpen(false);
      } catch (error) {
        console.error("Error saving intern:", error);
        alert("Error saving intern. Please try again.");
      }
    };

    const handleEyeClick = (applicant) => {
        setSelectedApplicant(applicant);
        setIsModalOpen(true); // Open the modal when the "eye" is clicked
      };
    
    const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedApplicant(null);
    };

    const handleSupervisorModal = (applicant) => {
      setSelectedApplicant(applicant);
      setIsSupervisorModalOpen(true);
    };



  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className='font-bold text-lg text-zinc-600'>Today Interviews</h1>
        <h1 className='font-bold text-lg text-zinc-600'>Date: {new Date().toISOString().split('T')[0]}</h1>
      </div>

      <div className="table_component mt-4" role="region" tabIndex="0">
        <table>
          <thead className="text-sm font-thin">
            <tr className='text-xs text-gray-500'>
              <th>Applicant ID</th>
              <th>Name</th>
              <th>Degree/Course</th>
              <th>Institute</th>
              <th>Specialization</th>
              <th>Interview Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs align-top">
            {applicants.map(applicant => (
            <tr key={applicant.applicantId}>
                <td>{`A${String(applicant.applicantId).padStart(6, '0')}`}</td>
                <td>{applicant.name}</td>
                <td>{applicant.degree}</td>
                <td>{applicant.educationalInstitute}</td>
                <td>{applicant.specialization}</td>
                <td>{applicant.interviewTime}</td>
                <td>
                    <div className="relative flex items-center gap-2">
                    <Tooltip content="Details">
                        <span
                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                        >
                        <FaRegEye onClick={() => handleEyeClick(applicant)} />
                        </span>
                    </Tooltip>
                    <Tooltip color='success' content="Accept Applicant">
                      <span 
                        className="text-lg text-success cursor-pointer active:opacity-50"
                      >
                        <FaUserCheck onClick={() => handleSupervisorModal(applicant)} />
                      </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Reject Applicant">
                      <span 
                        className="text-lg text-danger cursor-pointer active:opacity-50" >
                        <FaUserXmark />
                      </span>
                    </Tooltip>
                    </div>
                </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          scrollBehavior="inside"
          size="5xl"
          style={{ height: '600px' }}
      >
          <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-blue">
              {selectedApplicant ? `${`A${String(selectedApplicant.applicantId).padStart(6, '0')}`} - ${selectedApplicant.name}` : "Applicant Details"}
          </ModalHeader>
          <ModalBody>
              {selectedApplicant ? (
              <div>
                  <h1 className='pb-4 font-semibold'>Personal Information</h1>
                  <div className='grid grid-cols-2 gap-y-5 gap-x-7 m-auto'>
                  {/* <Input isDisabled label="1. App_ID" labelPlacement="outside" value={`A${String(selectedApplicant.applicantId).padStart(6, '0')}`} type="text" /> */}
                  <Input isDisabled label="2. Name" labelPlacement="outside" value={selectedApplicant.name} type="text" />
                  <Input isDisabled label="3. NIC Number" labelPlacement="outside" value={selectedApplicant.nic} type="text" />
                  <Input isDisabled label="4. Mobile Number" labelPlacement="outside" value={selectedApplicant.mobileNumber} type="text" />
                  <Input isDisabled label="5. Email Address" labelPlacement="outside" value={selectedApplicant.email} type="text" />
                  <Input isDisabled label="6. Address" labelPlacement="outside" value={selectedApplicant.address} type="text" />
                  </div>
                  <h1 className='pb-4 mt-16 font-semibold'>Educational Information</h1>
                  <div className='grid grid-cols-2 gap-y-5 gap-x-10 m-auto'>
                  <Input isDisabled label="7. Institute" labelPlacement="outside" value={selectedApplicant.educationalInstitute} type="text" />
                  <Input isDisabled label="8. Degree/Course" labelPlacement="outside" value={selectedApplicant.degree} type="text" />
                  <Input isDisabled label="9. Current Academic Year" labelPlacement="outside" value={selectedApplicant.academicYear} type="text" />
                  <Input isDisabled label="10. Internship Period (Months)" labelPlacement="outside" value={selectedApplicant.internshipPeriod} type="text" />
                  </div>
                  <h1 className='pb-4 mt-16 font-semibold'>Specialization Preference</h1>
                  <div className='grid grid-cols-2 gap-y-5 gap-x-10 m-auto'>
                  <Input isDisabled label="11. Field of Specialization" labelPlacement="outside" value={selectedApplicant.specialization} type="text" />
                  <Input isDisabled label="12. Familiar with Programming Languages?" labelPlacement="outside" value={selectedApplicant.programmingLanguages} type="text" />
                  </div>
                  <div className='flex flex-col gap-2 pb-4 mt-16'>
                  <h1 className='font-semibold'>Resume</h1>
                  <a 
                      href="/Resumes/1745134385361-SandaniGunawardhana_SLT.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className='text-sm text-blue'
                  >Click Here</a>
                  </div>
              </div>
              ) : (
              <p className="text-gray-500 text-center">No details available</p>
              )}
          </ModalBody>
          <ModalFooter>
              <Button className='text-red font-bold border-red' variant="bordered" onPress={handleCloseModal}>
              Close
              </Button>
          </ModalFooter>
          </ModalContent>
      </Modal>

      {/* Supervisor Selection Modal */}
      <Modal isOpen={isSupervisorModalOpen} onClose={() => setIsSupervisorModalOpen(false)} size="md">
        <ModalContent>
          <ModalHeader>Select Supervisor for {selectedApplicant?.name}</ModalHeader>
          <ModalBody>
            <Select
            className='my-8'
              label="Select Supervisor"
              variant='bordered'
              placeholder="Choose a supervisor"
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
            >
              {supervisors.map((supervisor) => (
                <SelectItem key={supervisor.supervisorId} value={supervisor.supervisorId}>
                  {supervisor.name}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" color="danger" onPress={() => setIsSupervisorModalOpen(false)}>
              Cancel
            </Button>
            <Button className='bg-green font-bold text-white' onPress={() => handleSaveIntern(selectedApplicant, selectedSupervisor)}>
              Save Intern
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default TodayInterviews