import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../authentication/Auth';
import "../../Table.css";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaEye, FaSortAlphaDown, FaSortAlphaUp, FaPen } from 'react-icons/fa';
import { IoSearch } from "react-icons/io5";

const ManageSupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSupervisor, setEditingSupervisor] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortedSupervisors, setSortedSupervisors] = useState([]);
  const [sortBy, setSortBy] = useState('name'); // field to sort by
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSupervisors, setFilteredSupervisors] = useState([]);
  const [newSupervisor, setNewSupervisor] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    specialization: ''
  });

  useEffect(() => {
    fetchSupervisors();
  }, []);

  useEffect(() => {
    if (supervisors.length > 0) {
      const sorted = [...supervisors].sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'id':
            aValue = a.supervisorId || 0;
            bValue = b.supervisorId || 0;
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          case 'name':
            aValue = a.name || '';
            bValue = b.name || '';
            break;
          case 'email':
            aValue = a.email || '';
            bValue = b.email || '';
            break;
          case 'mobile':
            aValue = a.mobileNumber || '';
            bValue = b.mobileNumber || '';
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
      setSortedSupervisors(sorted);
    }
  }, [supervisors, sortOrder, sortBy]);

  useEffect(() => {
    if (sortedSupervisors.length > 0) {
      const filtered = sortedSupervisors.filter(supervisor => {
        const searchLower = searchTerm.toLowerCase();
        return (
          supervisor.name?.toLowerCase().includes(searchLower) ||
          supervisor.email?.toLowerCase().includes(searchLower) ||
          supervisor.mobileNumber?.toString().toLowerCase().includes(searchLower) ||
          supervisor.specialization?.toLowerCase().includes(searchLower) ||
          `S${String(supervisor.supervisorId).padStart(6, '0')}`.toLowerCase().includes(searchLower)
        );
      });
      setFilteredSupervisors(filtered);
    } else {
      setFilteredSupervisors([]);
    }
  }, [sortedSupervisors, searchTerm]);

  const fetchSupervisors = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:8080/admin/supervisors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSupervisors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
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

  const handleEdit = (supervisor) => {
    setEditingSupervisor({...supervisor});
  };

  const handleSave = async () => {
    try {
      const token = getToken();
      await axios.put(`http://localhost:8080/admin/supervisors/${editingSupervisor.supervisorId}`, editingSupervisor, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setEditingSupervisor(null);
      fetchSupervisors();
    } catch (error) {
      console.error('Error updating supervisor:', error);
      alert('Error updating supervisor');
    }
  };

  const handleDelete = async (supervisorId) => {
    if (window.confirm('Are you sure you want to deactivate this supervisor?')) {
      try {
        const token = getToken();
        // Find the supervisor to update their status
        const supervisorToUpdate = supervisors.find(supervisor => supervisor.supervisorId === supervisorId);
        if (supervisorToUpdate) {
          const updatedSupervisor = { ...supervisorToUpdate, state: 0 }; // Set status to Inactive
          await axios.put(`http://localhost:8080/admin/supervisors/${supervisorId}`, updatedSupervisor, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          fetchSupervisors();
        }
      } catch (error) {
        console.error('Error updating supervisor status:', error);
        alert('Error updating supervisor status');
      }
    }
  };

  const handleStatusChange = async (supervisorId, newStatus) => {
    try {
      const token = getToken();
      await axios.put(`http://localhost:8080/admin/supervisors/${supervisorId}/status?status=${newStatus}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchSupervisors();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleAddSupervisor = async () => {
    try {
      const token = getToken();
      await axios.post('http://localhost:8080/admin/supervisors', newSupervisor, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setShowAddForm(false);
      setNewSupervisor({
        name: '',
        mobileNumber: '',
        email: '',
        specialization: ''
      });
      fetchSupervisors();
    } catch (error) {
      console.error('Error adding supervisor:', error);
      alert('Error adding supervisor');
    }
  };

  const handleViewClick = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedSupervisor(null);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      0: { text: 'Inactive', color: 'bg-[#FEF2F2] text-[#991B1B]' },
      1: { text: 'Active', color: 'bg-[#F0FDF4] text-[#166534]' },
      2: { text: 'On Leave', color: 'bg-[#FEFCE8] text-[#A16207]' }
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
          placeholder="Search supervisors by name, email, mobile, specialization, or ID..."
          startContent={<IoSearch className="text-[#6B7280]" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
          clearable
        />
        <Button
          className="bg-[#52b74d] hover:bg-[#1D4ED8] text-white"
          onPress={() => setShowAddForm(true)}
          startContent={<FaPlus />}
          
        >
          Add New Supervisor
        </Button>
      </div>

      <div className="table_component mt-4" role="region" tabIndex="0">
        <table>
          <thead className="text-sm font-thin">
            <tr className='text-xs text-[#6B7280]'>
              <th 
                className="cursor-pointer hover:text-[#2563EB] select-none"
                onClick={() => handleSort('id')}
              >
                Supervisor ID {getSortIcon('id')}
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
                onClick={() => handleSort('mobile')}
              >
                Mobile {getSortIcon('mobile')}
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
            {filteredSupervisors.map((supervisor) => (
              <tr key={supervisor.supervisorId}>
                <td>{`S${String(supervisor.supervisorId).padStart(6, '0')}`}</td>
                <td>
                  {editingSupervisor?.supervisorId === supervisor.supervisorId ? (
                    <Input
                      size="sm"
                      value={editingSupervisor.name}
                      onChange={(e) => setEditingSupervisor({...editingSupervisor, name: e.target.value})}
                    />
                  ) : (
                    supervisor.name
                  )}
                </td>
                <td>
                  {editingSupervisor?.supervisorId === supervisor.supervisorId ? (
                    <Input
                      size="sm"
                      type="email"
                      value={editingSupervisor.email}
                      onChange={(e) => setEditingSupervisor({...editingSupervisor, email: e.target.value})}
                    />
                  ) : (
                    supervisor.email
                  )}
                </td>
                <td>
                  {editingSupervisor?.supervisorId === supervisor.supervisorId ? (
                    <Input
                      size="sm"
                      value={editingSupervisor.mobileNumber}
                      onChange={(e) => setEditingSupervisor({...editingSupervisor, mobileNumber: e.target.value})}
                    />
                  ) : (
                    supervisor.mobileNumber
                  )}
                </td>
                <td>
                  {editingSupervisor?.supervisorId === supervisor.supervisorId ? (
                    <Input
                      size="sm"
                      value={editingSupervisor.specialization}
                      onChange={(e) => setEditingSupervisor({...editingSupervisor, specialization: e.target.value})}
                    />
                  ) : (
                    supervisor.specialization
                  )}
                </td>
                <td>
                  {editingSupervisor?.supervisorId === supervisor.supervisorId ? (
                    <Select
                      size="sm"
                      selectedKeys={[editingSupervisor.state?.toString()]}
                      onSelectionChange={(keys) => setEditingSupervisor({...editingSupervisor, state: parseInt(Array.from(keys)[0])})}
                    >
                      <SelectItem key="0" value="0">Inactive</SelectItem>
                      <SelectItem key="1" value="1">Active</SelectItem>
                      <SelectItem key="2" value="2">On Leave</SelectItem>
                    </Select>
                  ) : (
                    getStatusBadge(supervisor.state)
                  )}
                </td>
                <td>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="Details">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <FaEye onClick={() => handleViewClick(supervisor)} />
                      </span>
                    </Tooltip>
                    {editingSupervisor?.supervisorId === supervisor.supervisorId ? (
                      <>
                        <Tooltip content="Save">
                          <span className="text-lg text-[#16A34A] cursor-pointer active:opacity-50">
                            <FaSave onClick={handleSave} />
                          </span>
                        </Tooltip>
                        <Tooltip content="Cancel">
                          <span className="text-lg text-[#4B5563] cursor-pointer active:opacity-50">
                            <FaTimes onClick={() => setEditingSupervisor(null)} />
                          </span>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip content="Edit">
                          <span className="text-lg text-[#2563EB] cursor-pointer active:opacity-50">
                            <FaPen onClick={() => handleEdit(supervisor)} />
                          </span>
                        </Tooltip>
                        <Tooltip content="Deactivate">
                          <span className="text-lg text-[#DC2626] cursor-pointer active:opacity-50">
                            <FaTrash onClick={() => handleDelete(supervisor.supervisorId)} />
                          </span>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Supervisor Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-blue">
            Add New Supervisor
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                placeholder="Enter supervisor name"
                value={newSupervisor.name}
                onChange={(e) => setNewSupervisor({...newSupervisor, name: e.target.value})}
              />
              <Input
                label="Mobile Number"
                placeholder="Enter mobile number"
                value={newSupervisor.mobileNumber}
                onChange={(e) => setNewSupervisor({...newSupervisor, mobileNumber: e.target.value})}
              />
              <Input
                label="Email"
                type="email"
                placeholder="Enter email address"
                value={newSupervisor.email}
                onChange={(e) => setNewSupervisor({...newSupervisor, email: e.target.value})}
              />
              <Input
                label="Specialization"
                placeholder="Enter specialization"
                value={newSupervisor.specialization}
                onChange={(e) => setNewSupervisor({...newSupervisor, specialization: e.target.value})}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="bordered"
              onPress={() => setShowAddForm(false)}
              startContent={<FaTimes />}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleAddSupervisor}
              startContent={<FaSave />}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Supervisor Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        scrollBehavior="inside"
        size="4xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-blue">
            {selectedSupervisor ? `${`S${String(selectedSupervisor.supervisorId).padStart(6, '0')}`} - ${selectedSupervisor.name}` : "Supervisor Details"}
          </ModalHeader>
          <ModalBody>
            {selectedSupervisor ? (
              <div>
                <h1 className='pb-4 font-semibold'>Supervisor Information</h1>
                <div className='grid grid-cols-2 gap-y-5 gap-x-7 m-auto'>
                  <Input 
                    isDisabled 
                    label="Supervisor ID" 
                    labelPlacement="outside" 
                    value={`S${String(selectedSupervisor.supervisorId).padStart(6, '0')}`} 
                    type="text" 
                  />
                  <Input 
                    isDisabled 
                    label="Name" 
                    labelPlacement="outside" 
                    value={selectedSupervisor.name} 
                    type="text" 
                  />
                  <Input 
                    isDisabled 
                    label="Email Address" 
                    labelPlacement="outside" 
                    value={selectedSupervisor.email} 
                    type="text" 
                  />
                  <Input 
                    isDisabled 
                    label="Mobile Number" 
                    labelPlacement="outside" 
                    value={selectedSupervisor.mobileNumber} 
                    type="text" 
                  />
                  <Input 
                    isDisabled 
                    label="Specialization" 
                    labelPlacement="outside" 
                    value={selectedSupervisor.specialization} 
                    type="text" 
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Status</label>
                    {getStatusBadge(selectedSupervisor.state)}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[#6B7280] text-center">No details available</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button 
              className='text-red font-bold border-red' 
              variant="bordered" 
              onPress={handleCloseViewModal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ManageSupervisors;
