import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../authentication/Auth';
import "../../Table.css";
import { Button, Select, SelectItem, Input, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, RadioGroup, Radio, Textarea, DateInput, TimeInput } from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaEdit, FaTrash, FaSave, FaTimes, FaSortAlphaDown, FaSortAlphaUp, FaPen } from 'react-icons/fa';

const ManageInterns = () => {
  const [interns, setInterns] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIntern, setEditingIntern] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortedInterns, setSortedInterns] = useState([]);
  const [sortBy, setSortBy] = useState('name'); // field to sort by
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInterns, setFilteredInterns] = useState([]);

  useEffect(() => {
    fetchInterns();
    fetchSupervisors();
  }, []);

  useEffect(() => {
    if (interns.length > 0) {
      const sorted = [...interns].sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'id':
            aValue = a.internId || 0;
            bValue = b.internId || 0;
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          case 'name':
            aValue = a.name || '';
            bValue = b.name || '';
            break;
          case 'email':
            aValue = a.email || '';
            bValue = b.email || '';
            break;
          case 'supervisor':
            aValue = a.supervisor?.name || '';
            bValue = b.supervisor?.name || '';
            break;
          case 'specialization':
            aValue = a.specialization || '';
            bValue = b.specialization || '';
            break;
          case 'status':
            aValue = a.state || 0;
            bValue = b.state || 0;
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          default:
            aValue = a.name || '';
            bValue = b.name || '';
        }
        
        if (sortOrder === 'asc') {
          return aValue.toString().localeCompare(bValue.toString());
        } else {
          return bValue.toString().localeCompare(aValue.toString());
        }
      });
      setSortedInterns(sorted);
    }
  }, [interns, sortOrder, sortBy]);

  useEffect(() => {
    if (sortedInterns.length > 0) {
      const filtered = sortedInterns.filter(intern => {
        const searchLower = searchTerm.toLowerCase();
        return (
          intern.name?.toLowerCase().includes(searchLower) ||
          intern.email?.toLowerCase().includes(searchLower) ||
          intern.supervisor?.name?.toLowerCase().includes(searchLower) ||
          intern.specialization?.toLowerCase().includes(searchLower) ||
          `I${String(intern.internId).padStart(6, '0')}`.toLowerCase().includes(searchLower)
        );
      });
      setFilteredInterns(filtered);
    } else {
      setFilteredInterns([]);
    }
  }, [sortedInterns, searchTerm]);

  const fetchInterns = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:8080/admin/interns', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setInterns(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interns:', error);
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? <FaSortAlphaDown className="inline ml-1" /> : <FaSortAlphaUp className="inline ml-1" />;
    }
    return <FaSortAlphaDown className="inline ml-1 opacity-30" />;
  };

  const fetchSupervisors = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:8080/admin/supervisors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSupervisors(response.data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const handleEdit = (intern) => {
    setEditingIntern({
      ...intern,
      supervisorId: intern.supervisor?.supervisorId || ''
    });
  };

  const handleSave = async () => {
    try {
      const token = getToken();
      await axios.put(`http://localhost:8080/admin/interns/${editingIntern.internId}`, editingIntern, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setEditingIntern(null);
      fetchInterns();
    } catch (error) {
      console.error('Error updating intern:', error);
      alert('Error updating intern');
    }
  };

  const handleDelete = async (internId) => {
    if (window.confirm('Are you sure you want to deactivate this intern?')) {
      try {
        const token = getToken();
        // Find the intern to update their status
        const internToUpdate = interns.find(intern => intern.internId === internId);
        if (internToUpdate) {
          const updatedIntern = { ...internToUpdate, state: 1 }; // Set status to Inactive
          await axios.put(`http://localhost:8080/admin/interns/${internId}`, updatedIntern, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          fetchInterns();
        }
      } catch (error) {
        console.error('Error updating intern status:', error);
        alert('Error updating intern status');
      }
    }
  };

  const handleViewIntern = (intern) => {
    setSelectedIntern(intern);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedIntern(null);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      1: { text: 'Inactive', color: 'bg-[#FEF2F2] text-[#991B1B]' },
      0: { text: 'Active', color: 'bg-[#F0FDF4] text-[#166534]' },
      2: { text: 'Completed', color: 'bg-[#EFF6FF] text-[#1E40AF]' },
      3: { text: 'Suspended', color: 'bg-[#FEFCE8] text-[#A16207]' }
    };
    const statusInfo = statusMap[status] || { text: 'Unknown', color: 'bg-[#F9FAFB] text-[#374151]' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  return (
    <div className="mx-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <Input
          size="lg"
          placeholder="Search interns by name, email, supervisor, specialization, or ID..."
          startContent={<IoSearch className="text-[#6B7280]" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
          clearable
        />
      </div>

      <div className="table_component mt-4" role="region" tabIndex="0">
        <table>
          <thead className="text-sm font-thin">
            <tr className='text-xs text-[#6B7280]'>
              <th 
                className="cursor-pointer hover:text-[#2563EB] select-none"
                onClick={() => handleSort('id')}
              >
                Intern ID {getSortIcon('id')}
              </th>
              <th 
                className="cursor-pointer hover:text-[#2563EB] select-none"
                onClick={() => handleSort('name')}
              >
                Name {getSortIcon('name')}
              </th>
              <th 
                className="cursor-pointer hover:text-[#2563EB] select-none"
                onClick={() => handleSort('email')}
              >
                Email {getSortIcon('email')}
              </th>
              <th 
                className="cursor-pointer hover:text-[#2563EB] select-none"
                onClick={() => handleSort('supervisor')}
              >
                Supervisor {getSortIcon('supervisor')}
              </th>
              <th 
                className="cursor-pointer hover:text-[#2563EB] select-none"
                onClick={() => handleSort('specialization')}
              >
                Specialization {getSortIcon('specialization')}
              </th>
              <th 
                className="cursor-pointer hover:text-[#2563EB] select-none"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs align-top">
            {filteredInterns.map((intern) => (
              <tr key={intern.internId}>
                <td>{`I${String(intern.internId).padStart(6, '0')}`}</td>
                <td>
                  {editingIntern?.internId === intern.internId ? (
                    <Input
                      size="sm"
                      value={editingIntern.name}
                      onChange={(e) => setEditingIntern({...editingIntern, name: e.target.value})}
                      className="min-w-[150px]"
                    />
                  ) : (
                    intern.name
                  )}
                </td>
                <td>
                  {editingIntern?.internId === intern.internId ? (
                    <Input
                      size="sm"
                      type="email"
                      value={editingIntern.email}
                      onChange={(e) => setEditingIntern({...editingIntern, email: e.target.value})}
                      className="min-w-[200px]"
                    />
                  ) : (
                    intern.email
                  )}
                </td>
                <td>
                  {editingIntern?.internId === intern.internId ? (
                    <Select
                      size="sm"
                      selectedKeys={editingIntern.supervisorId ? [editingIntern.supervisorId.toString()] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0];
                        setEditingIntern({...editingIntern, supervisorId: selectedKey});
                      }}
                      className="min-w-[150px]"
                    >
                      {supervisors.map(supervisor => (
                        <SelectItem key={supervisor.supervisorId} value={supervisor.supervisorId}>
                          {supervisor.name}
                        </SelectItem>
                      ))}
                    </Select>
                  ) : (
                    intern.supervisor?.name || 'Not Assigned'
                  )}
                </td>
                <td>
                  {editingIntern?.internId === intern.internId ? (
                    <Input
                      size="sm"
                      value={editingIntern.specialization}
                      onChange={(e) => setEditingIntern({...editingIntern, specialization: e.target.value})}
                      className="min-w-[150px]"
                    />
                  ) : (
                    intern.specialization
                  )}
                </td>
                <td>
                  {editingIntern?.internId === intern.internId ? (
                    <Select
                      size="sm"
                      selectedKeys={[editingIntern.state?.toString()]}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0];
                        setEditingIntern({...editingIntern, state: parseInt(selectedKey)});
                      }}
                      className="min-w-[100px]"
                    >
                      <SelectItem key="1" value="1">Inactive</SelectItem>
                      <SelectItem key="0" value="0">Active</SelectItem>
                      <SelectItem key="2" value="2">Completed</SelectItem>
                      <SelectItem key="3" value="3">Suspended</SelectItem>
                    </Select>
                  ) : (
                    getStatusBadge(intern.state)
                  )}
                </td>
                <td>
                  {editingIntern?.internId === intern.internId ? (
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="Save">
                        <span className="text-lg text-[#10B981] cursor-pointer active:opacity-50">
                          <FaSave onClick={handleSave} />
                        </span>
                      </Tooltip>
                      <Tooltip content="Cancel">
                        <span className="text-lg text-[#6B7280] cursor-pointer active:opacity-50">
                          <FaTimes onClick={() => setEditingIntern(null)} />
                        </span>
                      </Tooltip>
                    </div>
                  ) : (
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="View Details">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <FaRegEye onClick={() => handleViewIntern(intern)} />
                        </span>
                      </Tooltip>
                      <Tooltip content="Edit">
                        <span className="text-lg text-[#3B82F6] cursor-pointer active:opacity-50">
                          <FaPen onClick={() => handleEdit(intern)} />
                        </span>
                      </Tooltip>
                      <Tooltip content="Deactivate">
                        <span className="text-lg text-[#EF4444] cursor-pointer active:opacity-50">
                          <FaTrash onClick={() => handleDelete(intern.internId)} />
                        </span>
                      </Tooltip>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Intern Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        scrollBehavior="inside"
        size="5xl"
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
                  <Input isDisabled label="Name" labelPlacement="outside" value={selectedIntern.name} type="text" />
                  <Input isDisabled label="NIC Number" labelPlacement="outside" value={selectedIntern.nic} type="text" />
                  <Input isDisabled label="Mobile Number" labelPlacement="outside" value={selectedIntern.mobileNumber} type="text" />
                  <Input isDisabled label="Email Address" labelPlacement="outside" value={selectedIntern.email} type="text" />
                  <Input isDisabled label="Address" labelPlacement="outside" value={selectedIntern.address} type="text" className="col-span-2" />
                </div>
                <h1 className='pb-4 mt-8 font-semibold'>Educational Information</h1>
                <div className='grid grid-cols-2 gap-y-5 gap-x-7 m-auto'>
                  <Input isDisabled label="Institute" labelPlacement="outside" value={selectedIntern.educationalInstitute} type="text" />
                  <Input isDisabled label="Degree/Course" labelPlacement="outside" value={selectedIntern.degree} type="text" />
                  <Input isDisabled label="Current Academic Year" labelPlacement="outside" value={selectedIntern.academicYear} type="text" />
                  <Input isDisabled label="Internship Period (Months)" labelPlacement="outside" value={selectedIntern.internshipPeriod} type="text" />
                </div>
                <h1 className='pb-4 mt-8 font-semibold'>Specialization Information</h1>
                <div className='grid grid-cols-2 gap-y-5 gap-x-7 m-auto'>
                  <Input isDisabled label="Field of Specialization" labelPlacement="outside" value={selectedIntern.specialization} type="text" />
                  <Input isDisabled label="Programming Languages" labelPlacement="outside" value={selectedIntern.programmingLanguages} type="text" />
                  <Input isDisabled label="Start Date" labelPlacement="outside" value={selectedIntern.startDate} type="text" />
                  <Input isDisabled label="Supervisor" labelPlacement="outside" value={selectedIntern.supervisor?.name || 'Not Assigned'} type="text" />
                </div>
                <h1 className='pb-4 mt-8 font-semibold'>Status Information</h1>
                <div className='grid grid-cols-1 gap-y-5 gap-x-7 m-auto'>
                  <Input isDisabled label="Current Status" labelPlacement="outside" value={getStatusBadge(selectedIntern.state).props.children} type="text" />
                </div>
              </div>
            ) : (
              <p className="text-[#6B7280] text-center">No details available</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button className='text-red font-bold border-red' variant="bordered" onPress={handleCloseViewModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ManageInterns;
