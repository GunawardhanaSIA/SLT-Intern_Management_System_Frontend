import React, {useEffect, useState} from 'react';
import axios from 'axios';
import "../../../Table.css";
import {Button, Select, SelectItem, Input, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, RadioGroup, Radio, Textarea} from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserXmark } from "react-icons/fa6";

const NewApplications = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleEyeClick = () => {
    setIsModalOpen(true); // Open the modal when the "eye" is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className='font-bold text-lg text-zinc-600'>New Applications</h1>
        <Button className="bg-green font-bold text-white">View All</Button>
      </div>

      <div className="table_component mt-4" role="region" tabIndex="0">
        <table>
          <thead className="text-sm font-thin">
            <tr className='text-xs text-gray-500'>
              <th>App_ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Degree/Course</th>
              <th>Institute</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs align-top">
            <tr>
              <td>A000001</td>
              <td>Sandani Gunawardhana</td>
              <td>No. 17, Rajamaha Vihara Road, Pitakotte</td>
              <td>BSc. (Hons) in Software Engineering</td>
              <td>University of Colombo School of Computing</td>
              <td>Fullstack</td>
              <td>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Details">
                    <span
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      onClick={handleEyeClick}
                    >
                      <FaRegEye />
                    </span>
                  </Tooltip>
                  <Tooltip color='success' content="Edit Intern">
                    <span 
                      className="text-lg text-success cursor-pointer active:opacity-50"
                    >
                      <FaUserCheck />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete user">
                    <span 
                      className="text-lg text-danger cursor-pointer active:opacity-50" >
                      <FaUserXmark />
                    </span>
                  </Tooltip>
                </div>
              </td>
            </tr>
            <tr>
              <td>A000001</td>
              <td>Sandani Gunawardhana</td>
              <td>No. 17, Rajamaha Vihara Road, Pitakotte</td>
              <td>BSc. (Hons) in Software Engineering</td>
              <td>University of Colombo School of Computing</td>
              <td>Fullstack</td>
              <td>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Details">
                    <span
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      onClick={handleEyeClick}
                    >
                      <FaRegEye />
                    </span>
                  </Tooltip>
                  <Tooltip color='success' content="Edit Intern">
                    <span 
                      className="text-lg text-success cursor-pointer active:opacity-50"
                    >
                      <FaUserCheck />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete user">
                    <span 
                      className="text-lg text-danger cursor-pointer active:opacity-50" >
                      <FaUserXmark />
                    </span>
                  </Tooltip>
                </div>
              </td>
            </tr>
            <tr>
              <td>A000001</td>
              <td>Sandani Gunawardhana</td>
              <td>No. 17, Rajamaha Vihara Road, Pitakotte</td>
              <td>BSc. (Hons) in Software Engineering</td>
              <td>University of Colombo School of Computing</td>
              <td>Fullstack</td>
              <td>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Details">
                    <span
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      onClick={handleEyeClick}
                    >
                      <FaRegEye />
                    </span>
                  </Tooltip>
                  <Tooltip color='success' content="Edit Intern">
                    <span 
                      className="text-lg text-success cursor-pointer active:opacity-50"
                    >
                      <FaUserCheck />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete user">
                    <span 
                      className="text-lg text-danger cursor-pointer active:opacity-50" >
                      <FaUserXmark />
                    </span>
                  </Tooltip>
                </div>
              </td>
            </tr>
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
            A000001 - Sandani Gunawardhana
          </ModalHeader>
          <ModalBody>
              <div>
                <h1 className='pb-4 font-semibold'>Personal Information</h1>
                <div className='grid grid-cols-2 gap-y-5 gap-x-7 m-auto'>
                  <Input isDisabled label="1. App_ID" labelPlacement="outside" placeholder='A000001'  type="text" />
                  <Input isDisabled label="2. Name" labelPlacement="outside" placeholder='Sandani Gunawardhana' type="text" />
                  <Input isDisabled label="3. NIC Number" labelPlacement="outside" placeholder='200169801767' type="text" />
                  <Input isDisabled label="4. Mobile Number" labelPlacement="outside" placeholder='0710569459' type="text" />
                  <Input isDisabled label="5. Email Address" labelPlacement="outside" placeholder='siagunawardhana@gmail.com' type="text" />
                  <Input isDisabled label="6. Address" labelPlacement="outside" placeholder='No. 17, Rajamaha Vihara Road, Pitakotte' type="text" />
                </div>
                <h1 className='pb-4 mt-16 font-semibold'>Educational Information</h1>
                <div className='grid grid-cols-2 gap-y-5 gap-x-10 m-auto'>
                  <Input isDisabled label="7. Institute" labelPlacement="outside" placeholder='University of Colombo School of Computing' type="text" />
                  <Input isDisabled label="8. Degree/Course" labelPlacement="outside" placeholder='BSc. (Hons) in Software Engineering' type="text" />
                  <Input isDisabled label="9. Current Academic Year" labelPlacement="outside" placeholder='3rd Year' type="text" />
                  <Input isDisabled label="10. Internship Period(In Months)" labelPlacement="outside" placeholder='6' type="text" />
                </div>
                <h1 className='pb-4 mt-16 font-semibold'>Specialization Preference</h1>
                <div className='grid grid-cols-2 gap-y-5 gap-x-10 m-auto'>
                  <Input isDisabled label="11. Field of Specialization" labelPlacement="outside" placeholder='Fullstack' type="text" />
                  <RadioGroup isDisabled
                        label="11. Familiar with Programming Languages?"
                        className='text-sm'
                        orientation="horizontal">
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                    </RadioGroup>
                </div>
                <div className='flex flex-col gap-2 pb-4 mt-16'>
                  <h1 className='font-semibold'>Resume</h1>
                  <a href="" className='text-sm text-blue'>Click Here</a>
                </div>
              </div>
            {/* ) : (
              <p>No details available</p>
            )} */}
          </ModalBody>
          <ModalFooter>
            <Button className='text-red font-bold border-red' variant="bordered" onPress={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      
      
    </div>
  );
};

export default NewApplications