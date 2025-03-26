import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, DatePicker } from "@nextui-org/react";
import { MdOutlineSearch } from "react-icons/md";
import "../../Table.css";
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../authentication/Auth';
import axios from 'axios';
import DatePicker2 from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getLocalTimeZone, today} from "@internationalized/date";

const Attendance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [interns, setInterns] = useState([]);
    const [filteredInterns, setFilteredInterns] = useState([]); // For searching
    const [searchTerm, setSearchTerm] = useState(""); // Search input state
    const [markedAttendance, setMarkedAttendance] = useState({});
    const [selectedInternName, setSelectedInternName] = useState(null);
    const [pastAttendance, setPastAttendance] = useState([]);
    const [date, setDate] = useState(today(getLocalTimeZone()))

    // Convert Date object to a string (YYYY-MM-DD format)
    const formatDate = (date) => date.toString();

    useEffect(() => {
        const token = getToken();
        const decodedToken = jwtDecode(token);
        const user_id = decodedToken.user_id;

        axios.get("http://localhost:8080/supervisor/myInterns", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const filteredInterns = response.data.filter(intern => intern.supervisor.user.id === user_id);
            setInterns(filteredInterns);
            setFilteredInterns(filteredInterns);
        })
        .catch(error => {
            console.error("Error fetching interns:", error);
        });
    }, []);

    // Function to filter interns based on search input
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = interns.filter(intern =>
            intern.name.toLowerCase().includes(value) || 
            intern.internId.toString().includes(value) // Ensure internId is converted to string
        );

        setFilteredInterns(filtered);
    };

    const calculateEndDate = (startDate, months) => {
        if (!startDate || !months) return "N/A";
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + months);
        return date.toISOString().split("T")[0];
    };

    const handleMarkAttendance = (internId) => {
        const token = getToken();
       
        const formattedDate = formatDate(date)
        console.log(formattedDate) // Initially show all interns

        axios.post(`http://localhost:8080/supervisor/attendance?internId=${internId}&date=${formattedDate}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log("Attendance marked:", response.data);
            setMarkedAttendance(prev => ({ ...prev, [internId]: true }));
        })
        .catch(error => {
            console.error("Error marking attendance:", error);
        });
    };

    const handlePastAttendance = (internId, internName) => {
        setSelectedInternName(internName);
        const token = getToken();

        axios.get(`http://localhost:8080/supervisor/attendance/${internId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const dates = response.data.map(entry => new Date(entry.date));
            setPastAttendance(dates);
            setIsModalOpen(true);
        })
        .catch(error => {
            console.error("Error fetching past attendance:", error);
        });
    };

    return (
        <div className="mx-6 mt-6">
            <div className='flex justify-between'>
                {/* Search Input */}
                <Input 
                    className='w-96' 
                    size='md' 
                    variant='bordered' 
                    radius='lg' 
                    placeholder="Search by Name or ID" 
                    type="text" 
                    value={searchTerm} 
                    onChange={handleSearch}
                    startContent={<MdOutlineSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                />
                <DatePicker 
                    className="max-w-[350px]" 
                    label="Pick the Date" 
                    labelPlacement='outside-left' 
                    variant='bordered' 
                    defaultValue={date}  // Use the `today()` output directly
                    onChange={(selectedDate) => setDate(selectedDate)}
                />
            </div>
            

            {/* Attendance Table */}
            <div className="attendance_table mt-10 flex justify-center" role="region" tabIndex="0">
                <table className='w-3/4'>
                    <thead className="text-sm font-thin">
                        <tr className='text-xs text-gray-500'>
                            <th>Intern ID</th>
                            <th>Name</th>
                            <th>Technology</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs align-center">
                        {filteredInterns.map(intern => (
                            <tr key={intern.internId}>
                                <td>{intern.internId}</td>
                                <td>{intern.name}</td>
                                <td>{intern.specialization}</td>
                                <td>{intern.startDate}</td>
                                <td>{calculateEndDate(intern.startDate, intern.internshipPeriod)}</td>
                                <td>
                                    <Button 
                                        size='sm' 
                                        className={`text-white font-bold ${markedAttendance[intern.internId] ? 'bg-yellow-500' : 'bg-green'}`} 
                                        onPress={() => handleMarkAttendance(intern.internId)}
                                    >
                                        {markedAttendance[intern.internId] ? "Marked" : "Present"}
                                    </Button>
                                    <Button size='sm' className='ml-2 text-blue bg-white font-bold' onClick={() => handlePastAttendance(intern.internId, intern.name)}>Past Attendance</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Past Attendance */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} scrollBehavior='inside' size='xl' >
                <ModalContent>
                    <ModalHeader className="text-blue">{selectedInternName} - Past Attendance</ModalHeader>
                    <ModalBody className='flex items-center justify-center'>
                        <DatePicker2
                            inline
                            highlightDates={pastAttendance}
                            monthsShown={1}
                            calendarClassName="custom-datepicker"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Attendance;
