import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../authentication/Auth';
import "../../Table.css";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaEye, FaPen } from 'react-icons/fa';
import { IoSearch } from "react-icons/io5";

const ManageSupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSupervisors, setFilteredSupervisors] = useState([]);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  useEffect(() => {
    if (supervisors.length > 0) {
      const filtered = supervisors.filter(supervisor => {
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
  }, [supervisors, searchTerm]);

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
          startContent={<FaPlus />}
        >
          Add New Supervisor
        </Button>
      </div>

      <div className="table_component mt-4" role="region" tabIndex="0">
        <table>
          <thead className="text-sm font-thin">
            <tr className='text-xs text-[#6B7280]'>
              <th>Supervisor ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs align-top">
            {filteredSupervisors.map((supervisor) => (
              <tr key={supervisor.supervisorId}>
                <td>{`S${String(supervisor.supervisorId).padStart(6, '0')}`}</td>
                <td>{supervisor.name}</td>
                <td>{supervisor.email}</td>
                <td>{supervisor.mobileNumber}</td>
                <td>{supervisor.specialization}</td>
                <td>{getStatusBadge(supervisor.state)}</td>
                <td>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="Details">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <FaEye />
                      </span>
                    </Tooltip>
                    <Tooltip content="Edit">
                      <span className="text-lg text-[#2563EB] cursor-pointer active:opacity-50">
                        <FaPen />
                      </span>
                    </Tooltip>
                    <Tooltip content="Deactivate">
                      <span className="text-lg text-[#DC2626] cursor-pointer active:opacity-50">
                        <FaTrash />
                      </span>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSupervisors;
