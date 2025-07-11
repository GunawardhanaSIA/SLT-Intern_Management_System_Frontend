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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSupervisors, setFilteredSupervisors] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortedSupervisors, setSortedSupervisors] = useState([]);
  const [sortBy, setSortBy] = useState('name'); // field to sort by

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
