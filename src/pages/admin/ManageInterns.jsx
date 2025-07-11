import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../authentication/Auth';
import "../../Table.css";
import { Button, Select, SelectItem, Input, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa6";
import { FaEdit, FaTrash, FaPen, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';

const ManageInterns = () => {
  const [interns, setInterns] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortedInterns, setSortedInterns] = useState([]);
  const [sortBy, setSortBy] = useState('name'); // field to sort by

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
                <td>{intern.name}</td>
                <td>{intern.email}</td>
                <td>{intern.supervisor?.name || 'Not Assigned'}</td>
                <td>{intern.specialization}</td>
                <td>{getStatusBadge(intern.state)}</td>
                <td>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="View Details">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <FaRegEye />
                      </span>
                    </Tooltip>
                    <Tooltip content="Edit">
                      <span className="text-lg text-[#3B82F6] cursor-pointer active:opacity-50">
                        <FaPen />
                      </span>
                    </Tooltip>
                    <Tooltip content="Deactivate">
                      <span className="text-lg text-[#EF4444] cursor-pointer active:opacity-50">
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

export default ManageInterns;
