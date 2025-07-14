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

  // Prepare chart data
  const pieChartData = reportData.internStatusDistribution ? 
    Object.entries(reportData.internStatusDistribution).map(([status, count]) => {
      const colors = {
        'Active': '#10B981',
        'Completed': '#3B82F6', 
        'Dropped': '#EF4444',
        'Suspended': '#F59E0B'
      };
      return { name: status, value: count || 0, color: colors[status] || '#6B7280' };
    }) :
    [
      { name: 'Active', value: reportData.activeInterns || 0, color: '#10B981' },
      { name: 'Completed', value: reportData.completedInterns || 0, color: '#3B82F6' },
      { name: 'Dropped', value: reportData.droppedInterns || 0, color: '#EF4444' },
      { name: 'Suspended', value: reportData.suspendedInterns || 0, color: '#F59E0B' }
    ];

  const monthlyData = Object.entries(reportData.monthlyRegistrations || {}).map(([month, count]) => ({
    month: month.split('-')[1] || month,
    registrations: count || 0
  }));

  const specializationData = Object.entries(reportData.specializationDistribution || {}).map(([spec, count]) => ({
    specialization: spec,
    count: count || 0
  }));

  const supervisorStatusData = reportData.supervisorStatusDistribution ? 
    Object.entries(reportData.supervisorStatusDistribution).map(([status, count]) => {
      const colors = {
        'Active': '#10B981',
        'Inactive': '#EF4444',
        'On Leave': '#F59E0B'
      };
      return { name: status, value: count || 0, color: colors[status] || '#6B7280' };
    }) :
    [
      { name: 'Active', value: reportData.activeSupervisors || 0, color: '#10B981' },
      { name: 'Inactive', value: reportData.inactiveSupervisors || 0, color: '#EF4444' },
      { name: 'On Leave', value: reportData.onLeaveSupervisors || 0, color: '#F59E0B' }
    ];

  const projectTechData = Object.entries(reportData.projectsByTechnology || {}).map(([tech, count]) => ({
    technology: tech,
    count: count || 0
  }));

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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interns</p>
                <p className="text-2xl font-bold text-blue-600">{reportData.totalInterns || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Chip size="sm" color="success" variant="flat">
                {reportData.activeInterns || 0} Active
              </Chip>
              <Chip size="sm" color="primary" variant="flat">
                {reportData.completedInterns || 0} Completed
              </Chip>
              <Chip size="sm" color="danger" variant="flat">
                {reportData.droppedInterns || 0} Dropped
              </Chip>
              <Chip size="sm" color="warning" variant="flat">
                {reportData.suspendedInterns || 0} Suspended
              </Chip>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-green-600">{reportData.totalProjects || 0}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Chip size="sm" color="success" variant="flat">
                {reportData.activeProjects || 0} Active
              </Chip>
              <Chip size="sm" color="primary" variant="flat">
                {reportData.completedProjects || 0} Completed
              </Chip>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Supervisors</p>
                <p className="text-2xl font-bold text-purple-600">{reportData.totalSupervisors || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Chip size="sm" color="success" variant="flat">
                {reportData.activeSupervisors || 0} Active
              </Chip>
              <Chip size="sm" color="danger" variant="flat">
                {reportData.inactiveSupervisors || 0} Inactive
              </Chip>
              <Chip size="sm" color="warning" variant="flat">
                {reportData.onLeaveSupervisors || 0} On Leave
              </Chip>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(reportData.totalInterns && reportData.totalInterns > 0) 
                    ? Math.round(((reportData.completedInterns || 0) / reportData.totalInterns) * 100) 
                    : 0}%
                </p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <Chip size="sm" color="warning" variant="flat">
                {reportData.completedInterns || 0} Completed
              </Chip>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intern Status Distribution */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openChartModal('pie', pieChartData, 'Intern Status Distribution')}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Intern Status Distribution</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              {pieChartData.some(item => item.value > 0) ? (
                <MUIPieChart
                  series={[{
                    data: pieChartData.map((item, index) => ({
                      id: index,
                      value: item.value,
                      label: item.name,
                      color: item.color
                    }))
                  }]}
                  width={400}
                  height={250}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No data available</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Monthly Registration Trend */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openChartModal('line', monthlyData, 'Monthly Registration Trend')}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold">Monthly Registration Trend</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              {monthlyData.length > 0 ? (
                <MUILineChart
                  xAxis={[{ 
                    scaleType: 'point', 
                    data: monthlyData.map(d => d.month) 
                  }]}
                  series={[{ 
                    data: monthlyData.map(d => d.registrations), 
                    label: 'Registrations',
                    color: '#10B981'
                  }]}
                  width={400}
                  height={250}
                  sx={{
                    [`& .${lineElementClasses.root}`]: {
                      strokeWidth: 3,
                    },
                    [`& .${markElementClasses.root}`]: {
                      strokeWidth: 2,
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No registration data available</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialization Distribution */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openChartModal('bar', specializationData, 'Specialization Distribution')}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold">Specialization Distribution</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              {specializationData.length > 0 ? (
                <MUIBarChart
                  xAxis={[{ 
                    scaleType: 'band', 
                    data: specializationData.map(d => d.specialization) 
                  }]}
                  series={[{ 
                    data: specializationData.map(d => d.count), 
                    label: 'Count',
                    color: '#8B5CF6'
                  }]}
                  width={400}
                  height={250}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No specialization data available</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Supervisor Status Distribution */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openChartModal('pie', supervisorStatusData, 'Supervisor Status Distribution')}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Supervisor Status Distribution</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              {supervisorStatusData.some(item => item.value > 0) ? (
                <MUIPieChart
                  series={[{
                    data: supervisorStatusData.map((item, index) => ({
                      id: index,
                      value: item.value,
                      label: item.name,
                      color: item.color
                    }))
                  }]}
                  width={400}
                  height={250}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No supervisor data available</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Performers */}
      {reportData.topPerformers && reportData.topPerformers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-semibold">Top Performers</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportData.topPerformers.slice(0, 6).map((performer, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{performer.name}</h4>
                    <Chip 
                      size="sm" 
                      color={index < 3 ? "warning" : "primary"} 
                      variant="flat"
                    >
                      #{index + 1}
                    </Chip>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{performer.specialization}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Performance Score:</span>
                      <span className="font-medium">{performer.performanceScore?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Hours:</span>
                      <span className="font-medium">{performer.totalHours?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Attendance:</span>
                      <span className="font-medium">{performer.attendanceRate?.toFixed(1) || 'N/A'}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Recent Activities */}
      {reportData.recentActivities && reportData.recentActivities.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Recent Activities</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {reportData.recentActivities.slice(0, 8).map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'New Intern' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  <Chip 
                    size="sm" 
                    color={activity.type === 'New Intern' ? 'success' : 'primary'} 
                    variant="flat"
                  >
                    {activity.type}
                  </Chip>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Chart Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">
                  {selectedChart?.title || 'Chart Details'}
                </h3>
              </ModalHeader>
              <ModalBody>
                <div className="h-96 flex justify-center">
                  {selectedChart?.type === 'pie' && selectedChart?.data?.some(item => item.value > 0) && (
                    <MUIPieChart
                      series={[{
                        data: selectedChart.data.map((item, index) => ({
                          id: index,
                          value: item.value,
                          label: item.name,
                          color: item.color
                        }))
                      }]}
                      width={600}
                      height={400}
                    />
                  )}
                  {selectedChart?.type === 'pie' && !selectedChart?.data?.some(item => item.value > 0) && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No data available for this chart</p>
                    </div>
                  )}
                  {selectedChart?.type === 'line' && selectedChart?.data?.length > 0 && (
                    <MUILineChart
                      xAxis={[{ 
                        scaleType: 'point', 
                        data: selectedChart.data.map(d => d.month) 
                      }]}
                      series={[{ 
                        data: selectedChart.data.map(d => d.registrations), 
                        label: 'Registrations',
                        color: '#10B981'
                      }]}
                      width={600}
                      height={400}
                    />
                  )}
                  {selectedChart?.type === 'line' && (!selectedChart?.data || selectedChart.data.length === 0) && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No registration data available</p>
                    </div>
                  )}
                  {selectedChart?.type === 'bar' && selectedChart?.data?.length > 0 && (
                    <MUIBarChart
                      xAxis={[{ 
                        scaleType: 'band', 
                        data: selectedChart.data.map(d => d.specialization || d.department || d.technology || 'Unknown') 
                      }]}
                      series={[{ 
                        data: selectedChart.data.map(d => d.count || 0), 
                        label: 'Count',
                        color: '#8B5CF6'
                      }]}
                      width={600}
                      height={400}
                    />
                  )}
                  {selectedChart?.type === 'bar' && (!selectedChart?.data || selectedChart.data.length === 0) && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No data available for this chart</p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Reports;
