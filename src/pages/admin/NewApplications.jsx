import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { getToken } from '../authentication/Auth';
import "../../Table.css";
import {Button, Select, SelectItem, Input, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, RadioGroup, Radio, Textarea, DateInput, TimeInput} from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserXmark } from "react-icons/fa6";
import emailjs from '@emailjs/browser';


const NewApplications = () => {
    const [applicants, setApplicants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [interviewee, setInterviewee] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [date, setDate] = useState(null); // Start with null
    const [time, setTime] = useState(null);

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
          const filteredApplicants = response.data.filter(applicant => applicant.state === 0);
          setApplicants(filteredApplicants);
        })
        .catch(error => {
          console.error("Error fetching applicants:", error);
        });
    }, []);
  
    const handleEyeClick = (applicant) => {
      setSelectedApplicant(applicant);
      setIsModalOpen(true); // Open the modal when the "eye" is clicked
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false); // Close the modal
      setSelectedApplicant(null);
    };

    const handleInterview = (interviewee) => {
      setInterviewee(interviewee);
      setIsInterviewModalOpen(true);
    }

    const handleCloseInterviewModal = () => {
      setIsInterviewModalOpen(false);
      setInterviewee(null);
    }


    const handleSendEmail = async (id, email, date, time) => {
      const token = getToken();
      console.log("Interviewee ID: ", id);

      if (!date || !time) {
        return;
      }

      try {
        const putResponse = await fetch(`http://localhost:8080/admin/setForInterview/${id}?interviewDate=${encodeURIComponent(date)}&interviewTime=${encodeURIComponent(time)}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
    
        if (!putResponse.ok) {
          throw new Error("Failed to set for interview");
        }
    
        console.log("Interview date stored successfully!");
        alert("Interview date set successfully!");
        setApplicants((prevApplicants) =>
          prevApplicants.filter((applicant) => applicant.applicantId !== id)
        );
        handleCloseInterviewModal();

        const emailData = {
          send_to: email,
          date: encodeURIComponent(date),
          time: encodeURI(time)
        };

        console.log(emailData)
        const emailResponse = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_INTERVIEW_TEMPLATE_ID,
          emailData,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        if (emailResponse.status === 200) {
          console.log("Interview email sent successfully:", emailResponse);
        }else{
          console.log("Interview email is not sent")
        }
      } catch (error) {
        console.error("Error setting interview:", error);
        alert("Error setting interview. Please try again.");
      }
    };

  
    return (
      <div className="mx-6 mt-6">
        <div className="table_component mt-4" role="region" tabIndex="0">
          <table>
            <thead className="text-sm font-thin">
              <tr className='text-xs text-gray-500'>
                <th>Applicant ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Degree/Course</th>
                <th>Institute</th>
                <th>Specialization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs align-top">
              {applicants.map(applicant => (
                <tr key={applicant.applicantId}>
                    <td>{`A${String(applicant.applicantId).padStart(6, '0')}`}</td>
                    <td>{applicant.name}</td>
                    <td>{applicant.address}</td>
                    <td>{applicant.degree}</td>
                    <td>{applicant.educationalInstitute}</td>
                    <td>{applicant.specialization}</td>
                    <td>
                      <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                          <span
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          >
                            <FaRegEye onClick={() => handleEyeClick(applicant)} />
                          </span>
                        </Tooltip>
                        <Tooltip color='success' content="Call for Interview">
                          <span 
                            className="text-lg text-success cursor-pointer active:opacity-50"
                          >
                            <FaUserCheck onClick={() => handleInterview(applicant)} />
                          </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete Applicant">
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
  
        {/* view more modal */}
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
                    <a href={selectedApplicant.resumeURL} target="_blank" rel="noopener noreferrer" className='text-sm text-blue'>Click Here</a>
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
  

        {/* interview date modal */}
        <Modal isOpen={isInterviewModalOpen} onClose={handleCloseInterviewModal}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 text-blue">Call for Interview</ModalHeader>
            <ModalBody className='flex flex-col gap-8'>
              <Input isDisabled label="Applicant Name" labelPlacement='outside' placeholder={interviewee ? interviewee.name : ''}  type="text" />
              <DateInput
                className="max-w-sm"
                label={"Interview Date"}
                labelPlacement='outside'
                onChange={(newDate) => setDate(newDate)}
                granularity="day" 
                value={date}
              />
              <TimeInput label="Interview Time" labelPlacement='outside' value={time} onChange={(newTime) => setTime(newTime)} granularity="minute"  />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleCloseInterviewModal}>
                Close
              </Button>
              <Button className='bg-green text-white font-bold' onPress={() => handleSendEmail(interviewee.applicantId, interviewee.email, date, time)}>
                Send Email
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
}

export default NewApplications