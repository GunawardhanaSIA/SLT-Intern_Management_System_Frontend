import React, {useState} from 'react'
import {Button, Input, Select, SelectItem, DatePicker, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import ProjectCard from '../../components/supervisor/dashboard/ProjectCard';

export const technology = [
  { key: "Java", label: "Java" },
  { key: "PHP", label: "PHP" },
  { key: "Python", label: "Python" },
  { key: "C#", label: "C#" },
  { key: "MERN", label: "MERN" },
  { key: "All", label: "All" },
];

export const intern = [
  { key: "Sandani Gunawardhana", label: "Sandani Gunawardhana" },
  { key: "Avishka Perera", label: "Avishka Perera" },
  { key: "Dasun Thathsara", label: "Dasun Thathsara" },
  { key: "Nishika Emalshi", label: "Nishika Emalshi" },
  { key: "Nethmi Athukorala", label: "Nethmi Athukorala" },
];

const SupervisorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = () => {
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };
  return (
    <div className='m-6'>
      <div className='flex justify-between'>
        <h1 className='text-xl text-blue'>Total Number of Projects : 5</h1>
        <Button className='bg-blue font-bold text-white' onClick={() => handleCreateProject()}>Create New Project</Button>
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

      <div className='flex flex-col justify-center items-center mt-12 mx-40'>
        <ProjectCard/>
      </div>


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
              />

              <Input 
                size='md' 
                variant='bordered' 
                label="Project Name" 
                labelPlacement='outside' 
                type="text" 
                placeholder='Enter project name' 
              />

              <Textarea  
                variant='bordered' 
                label="Description" 
                labelPlacement='outside' 
                type="text" 
                placeholder='Enter a description about the project' 
              />

              <DatePicker 
                variant='bordered' 
                label="Start Date" 
                labelPlacement='outside' 
              />

              <DatePicker 
                variant='bordered' 
                label="Target Date" 
                labelPlacement='outside' 
              />

              <Select
                label="Member 1"
                labelPlacement="outside"
                placeholder="Select the member 1"
                variant="bordered"
              >
                {intern.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                    {item.label}
                </SelectItem>
                ))}
              </Select>

              <Select
                label="Member 2"
                labelPlacement="outside"
                placeholder="Select the member 2"
                variant="bordered"
              >
                {intern.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                    {item.label}
                </SelectItem>
                ))}
              </Select>

              <Select
                label="Member 3"
                labelPlacement="outside"
                placeholder="Select the member 3"
                variant="bordered"
              >
                {intern.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                    {item.label}
                </SelectItem>
                ))}
              </Select>

              <Select
                label="Member 4"
                labelPlacement="outside"
                placeholder="Select the member 4"
                variant="bordered"
              >
                {intern.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                    {item.label}
                </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button className='text-red font-bold border-red' variant="bordered" onPress={handleCloseModal}>
                Close
              </Button>
              <Button className='text-white font-bold bg-green'>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
      </Modal>
    </div>
  )
}

export default SupervisorDashboard