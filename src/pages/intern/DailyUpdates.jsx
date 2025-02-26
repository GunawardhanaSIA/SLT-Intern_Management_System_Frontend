import React, { useState } from 'react'
import {Card, CardBody, CardHeader, Table, DatePicker, Textarea, Input, TableHeader, TableColumn, TableBody, TableRow, 
       TableCell, Checkbox, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import {parseDate, today, getLocalTimeZone } from "@internationalized/date";

const members = [
    { id: 1, name: "Nethmi Athukorala" },
    { id: 2, name: "Nishika Emalshi" },
    { id: 3, name: "Sandani Gunawardhana" },
    { id: 4, name: "Avishka Perera" },
    { id: 5, name: "Dasun Thathsara" },
];


const ProjectCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone())); // Default: today's date
    const [attendance, setAttendance] = useState({}); // Stores attendance in { date: { memberId: true/false } }

    // Convert Date object to a string (YYYY-MM-DD format)
    const formatDate = (date) => date.toString();

    // Handle attendance selection
    const handleAttendanceChange = (memberId) => {
        const dateKey = formatDate(selectedDate);

        setAttendance((prev) => ({
            ...prev,
            [dateKey]: {
                ...prev[dateKey],
                [memberId]: !prev[dateKey]?.[memberId], // Toggle presence
            }
        }));
    };

    const handleSubmit = () => {
        console.log("Attendance Data:", attendance);
        alert("Attendance marked successfully!");
    };

    // Get all unique dates for columns
    const allDates = Object.keys(attendance).sort(); // Sorted for consistency

  return (
    <div className="m-6">
      <Card className="p-4 w-full">
        <CardHeader>
          <h1 className="font-bold text-lg text-blue">
            JAVA8 - Intern Management System
          </h1>
        </CardHeader>
        <CardBody>
          <div className="w-full space-y-6 mt-4">
            <div className="flex flex-wrap md:flex-nowrap gap-6">
              <Input
                isDisabled
                size="md"
                variant="bordered"
                label="Group Name"
                labelPlacement="outside"
                type="text"
                placeholder="JAVA8"
                className="w-full md:w-1/2"
              />

              <Input
                size="md"
                isDisabled
                variant="bordered"
                label="Project Name"
                labelPlacement="outside"
                type="text"
                placeholder="Intern Management System"
                className="w-full md:w-1/2"
              />
            </div>

            <div>
              <Textarea
                variant="bordered"
                isDisabled
                label="Description"
                labelPlacement="outside"
                type="text"
                placeholder="The description about the Intern Management System"
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-6">
              <Input
                isDisabled
                size="md"
                variant="bordered"
                label="Supervisor"
                labelPlacement="outside"
                type="text"
                placeholder="M.Giridaran"
                className="w-full md:w-1/2"
              />
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-6">
              <DatePicker
                variant="bordered"
                isDisabled
                label="Start Date"
                labelPlacement="outside"
                defaultValue={parseDate("2024-04-04")}
                className="w-full md:w-1/2"
              />

              <DatePicker
                variant="bordered"
                isDisabled
                label="Target Date"
                labelPlacement="outside"
                defaultValue={parseDate("2024-04-04")}
                className="w-full md:w-1/2"
              />
            </div>
            <Table>
              <TableHeader>
                <TableColumn>Team Member Name</TableColumn>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    {allDates.map((date) => (
                      <TableCell key={`${date}-${member.id}`}>
                        {attendance[date]?.[member.id] ? "✅" : "❌"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Past Attendance Table */}
            <div className="mt-20">
              <div className="flex justify-between items-center mt-10 mb-3">
                <h2 className="font-semibold text-md mb-2">Daily records</h2>

                {/* Button to Open Daily records Modal */}
                <div className="flex flex-wrap md:flex-nowrap gap-6">
                  <Button
                    className="font-bold text-white bg-blue "
                    onClick={() => setIsModalOpen(true)}
                  >
                    Viwe Records
                  </Button>
                  <Button
                    className="font-bold text-white bg-green"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Add Daily Record
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>

        {/* Record Marking Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalContent>
            <ModalHeader>Add daily record</ModalHeader>
            <ModalBody>
              {/* Select Date */}
              <DatePicker
                variant="bordered"
                label="Select the Date"
                labelPlacement="outside"
                selected={selectedDate}
                onChange={setSelectedDate}
                className="w-full"
              />

              {/* text area */}
              <Textarea
                variant="bordered"
                label="Daily progress"
                labelPlacement="outside"
                type="text"
                placeholder="Enter your progress"
                className="w-full"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button color="primary" onClick={() => setIsModalOpen(false)}>
                Save Recoed
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </div>
  );
}

export default ProjectCard