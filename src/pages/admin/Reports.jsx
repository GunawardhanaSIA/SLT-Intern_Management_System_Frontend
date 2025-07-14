import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { PieChart, BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  LineChart as MUILineChart, 
  BarChart as MUIBarChart, 
  PieChart as MUIPieChart,
  lineElementClasses,
  markElementClasses 
} from '@mui/x-charts';
import axios from 'axios';
import { getToken } from '../authentication/Auth';
import ReportExportModal from '../../components/ReportExportModal';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Award, 
  Clock, 
  Building, 
  Target, 
  Download,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  UserCheck
} from 'lucide-react';

function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get('http://localhost:8080/admin/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setReportData(response.data);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const openChartModal = (chartType, data, title = '') => {
    setSelectedChart({ type: chartType, data, title });
    onOpen();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardBody>
            <div className="flex items-center gap-2 text-red-700">
              <FileText className="h-6 w-6" />
              <p className="text-lg font-semibold">Error Loading Report</p>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
            <Button 
              color="danger" 
              variant="flat" 
              onClick={fetchReportData}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-6">
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">No report data available</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and insights</p>
        </div>
        <ReportExportModal 
          reportData={reportData} 
          onExport={(format, status, error) => {
            if (status === 'success') {
              console.log(`${format.toUpperCase()} export completed successfully`);
            } else if (status === 'error') {
              console.error(`${format.toUpperCase()} export failed:`, error);
            }
          }}
        />
      </div>

      {/* Placeholder for future content */}
      <div className="text-center py-8">
        <p className="text-gray-500">Charts and overview cards will be added in the next commits</p>
      </div>
    </div>
  );
}

export default Reports;