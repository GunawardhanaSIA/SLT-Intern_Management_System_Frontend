import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { getToken } from '../authentication/Auth';
import "../../Table.css";
import {Button, Select, SelectItem, Input, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, RadioGroup, Radio, Textarea, DateInput, TimeInput, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserXmark } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import emailjs from '@emailjs/browser';


const NewApplications = () => {
    const [applicants, setApplicants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [interviewee, setInterviewee] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [date, setDate] = useState(null); // Start with null
    const [time, setTime] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["All"]));
    const [rankedApplicants, setRankedApplicants] = useState([]);
    const [isRankModalOpen, setIsRankModalOpen] = useState(false);
    const [selectedRankedIds, setSelectedRankedIds] = useState([]);

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
          console.log(response.data)
          const filteredApplicants = response.data.filter(applicant => applicant.state === 0);
          setApplicants(filteredApplicants);
        })
        .catch(error => {
          console.error("Error fetching applicants:", error);
        });
    }, []);



    // specialization dropdown
    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
      [selectedKeys],
    );



    // checkbox to select applicants
    const visibleIds = applicants.map(app => app.applicantId);
    const isAllSelected = visibleIds.every(id => selectedIds.includes(id)) && visibleIds.length > 0;

    const handleSelectAll = () => {
      if (isAllSelected) {
        // Deselect all visible ones
        setSelectedIds(selectedIds.filter(id => !visibleIds.includes(id)));
      } else {
        // Add all visible ones
        const newSelection = [...new Set([...selectedIds, ...visibleIds])];
        setSelectedIds(newSelection);
      }
    };

    const handleSelectOne = (id) => {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(appId => appId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    };



    // calling python API to rank resumes
    const handleRankResumes = () => {
      // Filter selected applicants
      const selectedApplicants = applicants.filter(applicant =>
        selectedIds.includes(applicant.applicantId)
      );

      const selectedValue = Array.from(selectedKeys)[0];

      if (selectedValue === "All") {
        alert("Please select a specialization before ranking CVs");
        return;
      }

      // Prepare the payload to match FastAPI structure
      const payload = {
        specialization: selectedValue,
        applicants: selectedApplicants.map(app => ({
          id: app.applicantId,
          resumeText: app.resumeText 
        }))
      };

      console.log("Payload to Python API:", payload);

      axios.post("http://localhost:8001/rank_cvs", payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log("Raw response data:", response.data);
        const formatted = response.data.rankedApplicants
        .sort((a, b) => a.rank - b.rank)  
        .map(app => {
          const original = selectedApplicants.find(a => a.applicantId === app.id);
          return {
            id: app.id,
            name: original?.name || `Applicant ${app.id}`,
            score: app.score
          };
        });
        setRankedApplicants(formatted);
        setIsRankModalOpen(true);
      })
      .catch(error => {
        console.error("Error ranking resumes:", error);
      });
    };


    const handleRankedSelectOne = (id) => {
      setSelectedRankedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    };

    const handleSendToSystem = () => {
      const selected = rankedApplicants.filter(app => selectedRankedIds.includes(app.id));
      console.log("Send to system:", selected);

      // You can send them to your backend with axios:
      // axios.post("/api/send_applicants", selected)
    };



    // fiter applicants by search input
    const filteredApplicants = applicants.filter((applicant) => {
      const matchesSearch = Object.values(applicant).some(value =>
        String(value).toLowerCase().includes(searchTerm)
      );

      const selectedSpecialization = selectedValue;
      const matchesSpecialization =
        selectedSpecialization === "All" || applicant.specialization === selectedSpecialization;

      return matchesSearch && matchesSpecialization;
    });
  


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
        <div className='flex justify-between'>
          <div className='flex gap-6 items-center'>
            <p className='text-zinc-500'>Filter Applications</p>
            <Input
              className='w-80'
              placeholder="Type here ..."
              variant='bordered'
              startContent={
                <IoSearch className="text-xl text-default-300 pointer-events-none flex-shrink-0" />
              }
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
          <div className='flex gap-1 items-center'>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" selectionMode="single">{selectedValue}<IoIosArrowDown/></Button>
              </DropdownTrigger>
              <DropdownMenu 
                disallowEmptySelection
                aria-label="Single selection example"
                selectedKeys={selectedKeys}
                selectionMode="single"
                variant="flat"
                onSelectionChange={setSelectedKeys}
              >
                <DropdownItem key="All">All</DropdownItem>
                <DropdownItem key="Fullstack">Fullstack</DropdownItem>
                <DropdownItem key="QA">QA</DropdownItem>
                <DropdownItem key="BA">BA</DropdownItem>
                <DropdownItem key="DevOps">DevOps</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button className='bg-green font-bold text-white' isDisabled={selectedIds.length === 0} onClick={handleRankResumes}>Rank Resumes</Button>
          </div>
        </div>
        <div className="table_component mt-6" role="region" tabIndex="0">
          <table>
            <thead className="text-sm font-thin">
              <tr className='text-xs text-gray-500'>
                <th>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th>Applicant ID</th>
                <th>Specialization</th>
                <th>Name</th>
                <th>Address</th>
                <th>Degree/Course</th>
                <th>Institute</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs align-top">
              {filteredApplicants.map(applicant => (
                <tr key={applicant.applicantId}>
                    <td>
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedIds.includes(applicant.applicantId)}
                        onChange={() => handleSelectOne(applicant.applicantId)}
                      />
                    </td>
                    <td>{`A${String(applicant.applicantId).padStart(6, '0')}`}</td>
                    <td>{applicant.specialization}</td>
                    <td>{applicant.name}</td>
                    <td>{applicant.address}</td>
                    <td>{applicant.degree}</td>
                    <td>{applicant.educationalInstitute}</td>
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
                    <Input isDisabled label="12. Programming Languages" labelPlacement="outside" value={selectedApplicant.programmingLanguages} type="text" />
                  </div>
                  <div className='flex flex-col gap-2 pb-4 mt-16'>
                    <h1 className='font-semibold'>Resume</h1>
                    <a 
                      href="/Resumes/1745134385361-SandaniGunawardhana_SLT.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className='text-sm text-blue'
                    >Click Here</a>
                    {/* <a href={selectedApplicant.resumeURL} target="_blank" rel="noopener noreferrer" className='text-sm text-blue'>Click Here</a> */}
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

        <Modal isOpen={isRankModalOpen} onClose={() => setIsRankModalOpen(false)} size="4xl">
          <ModalContent>
            <ModalHeader className="text-blue">Ranked Applicants</ModalHeader>
            <ModalBody>
              {rankedApplicants.length > 0 ? (
                <div className="overflow-auto max-h-[400px]">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500">
                      <tr>
                        <th>Select</th>
                        <th>Applicant ID</th>
                        <th>Name</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankedApplicants.map((app, index) => (
                        <tr key={app.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRankedIds.includes(app.id)}
                              onChange={() => handleRankedSelectOne(app.id)}
                            />
                          </td>
                          <td>{`A${String(app.id).padStart(6, '0')}`}</td>
                          <td>{app.name}</td>
                          <td>{app.score?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No ranked applicants to show.</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => setIsRankModalOpen(false)}>
                Close
              </Button>
              <Button className="bg-green text-white font-bold" onPress={handleSendToSystem} isDisabled={selectedRankedIds.length === 0}>
                Send Selected
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
}

export default NewApplications