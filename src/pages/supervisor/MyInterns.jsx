import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { getToken } from '../authentication/Auth';
import "../../Table.css";
import {Button, Input, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { jwtDecode } from 'jwt-decode';

const MyInterns = () => {
    const [interns, setInterns] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIntern, setSelectedIntern] = useState(null);

    const handleEyeClick = (intern) => {
        setSelectedIntern(intern);
        setIsModalOpen(true); // Open the modal when the "eye" is clicked
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedIntern(null);
    };

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
          })
          .catch(error => {
            console.error("Error fetching interns:", error);
          });
    }, []);
  
    return (
        <div className="mx-6 mt-6">
            <div className="table_component mt-4" role="region" tabIndex="0">
                <table>
                    <thead className="text-sm font-thin">
                        <tr className='text-xs text-gray-500'>
                        <th>Intern ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Specialization</th>
                        <th>Start Date</th>
                        <th>Internship Period</th>
                        <th>Degree/Course</th>
                        <th>Institute</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs align-top">
                        {interns.map(intern => (
                        <tr key={intern.internId}>
                            <td>{`I${String(intern.internId).padStart(6, '0')}`}</td>
                            <td>{intern.name}</td>
                            <td>{intern.email}</td>
                            <td>{intern.specialization}</td>
                            <td>{intern.startDate}</td>
                            <td>{intern.internshipPeriod}</td>
                            <td>{intern.degree}</td>
                            <td>{intern.educationalInstitute}</td>
                            <td>
                                <div className="relative flex items-center gap-2">
                                <Tooltip content="Details">
                                    <span
                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                    >
                                    <FaRegEye onClick={() => handleEyeClick(intern)} />
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
                        {selectedIntern ? `${`I${String(selectedIntern.internId).padStart(6, '0')}`} - ${selectedIntern.name}` : "Intern Details"}
                    </ModalHeader>
                    <ModalBody>
                        {selectedIntern ? (
                        <div>
                            <h1 className='pb-4 font-semibold'>Personal Information</h1>
                            <div className='grid grid-cols-2 gap-y-5 gap-x-7 m-auto'>
                            {/* <Input isDisabled label="1. App_ID" labelPlacement="outside" value={`A${String(selectedApplicant.applicantId).padStart(6, '0')}`} type="text" /> */}
                            <Input isDisabled label="2. Name" labelPlacement="outside" value={selectedIntern.name} type="text" />
                            <Input isDisabled label="3. NIC Number" labelPlacement="outside" value={selectedIntern.nic} type="text" />
                            <Input isDisabled label="4. Mobile Number" labelPlacement="outside" value={selectedIntern.mobileNumber} type="text" />
                            <Input isDisabled label="5. Email Address" labelPlacement="outside" value={selectedIntern.email} type="text" />
                            <Input isDisabled label="6. Address" labelPlacement="outside" value={selectedIntern.address} type="text" />
                            </div>
                            <h1 className='pb-4 mt-16 font-semibold'>Educational Information</h1>
                            <div className='grid grid-cols-2 gap-y-5 gap-x-10 m-auto'>
                            <Input isDisabled label="7. Institute" labelPlacement="outside" value={selectedIntern.educationalInstitute} type="text" />
                            <Input isDisabled label="8. Degree/Course" labelPlacement="outside" value={selectedIntern.degree} type="text" />
                            <Input isDisabled label="9. Current Academic Year" labelPlacement="outside" value={selectedIntern.academicYear} type="text" />
                            <Input isDisabled label="10. Internship Period (Months)" labelPlacement="outside" value={selectedIntern.internshipPeriod} type="text" />
                            </div>
                            <h1 className='pb-4 mt-16 font-semibold'>Specialization Preference</h1>
                            <div className='grid grid-cols-2 gap-y-5 gap-x-10 m-auto'>
                            <Input isDisabled label="11. Field of Specialization" labelPlacement="outside" value={selectedIntern.specialization} type="text" />
                            <Input isDisabled label="12. Familiar with Programming Languages?" labelPlacement="outside" value={selectedIntern.programmingLanguages} type="text" />
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
        </div>
    )
}

export default MyInterns