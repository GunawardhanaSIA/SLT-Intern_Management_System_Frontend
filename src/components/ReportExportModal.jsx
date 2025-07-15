import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Button, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useDisclosure,
  Checkbox,
  CheckboxGroup,
  Card,
  CardBody,
  Divider,
  Chip,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
  Input,
  Switch,
  Tooltip,
  Progress
} from "@nextui-org/react";
import { 
  Download, 
  FileText, 
  Settings, 
  PieChart,
  BarChart3,
  Users,
  TrendingUp,
  Palette,
  FileImage,
  Calendar,
  Mail,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import AdvancedPDFService from './AdvancedPDFService';
import StandardPDFService from './StandardPDFService';
import { getToken } from '../pages/authentication/Auth';

function ReportExportModal({ reportData, onExport }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [exportOptions, setExportOptions] = useState([
    'overview',
    'statusDistributions',
    'monthlyTrends',
    'specializations',
    'topPerformers'
  ]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [manualDownloadUrl, setManualDownloadUrl] = useState(null);
  
  // New user-friendly options
  const [pdfSettings, setPdfSettings] = useState({
    format: 'A4',
    orientation: 'portrait',
    colorScheme: 'professional',
    includeCharts: true,
    includeLogo: true,
    includeTimestamp: true,
    includePageNumbers: true,
    includeTableOfContents: true,
    customTitle: '',
    customSubtitle: '',
    authorName: '',
    department: '',
    fontSize: 'medium'
  });

  const exportOptionLabels = {
    overview: 'Overview Statistics',
    statusDistributions: 'Status Distributions',
    monthlyTrends: 'Monthly Registration Trends',
    specializations: 'Specialization & Department Data',
    topPerformers: 'Top Performers',
    departments: 'Department Analysis',
    projects: 'Project Statistics',
    recentActivities: 'Recent Activities',
    internDetails: 'Detailed Intern List',
    supervisorDetails: 'Supervisor Information'
  };

  const exportOptionDescriptions = {
    overview: 'Total counts, percentages, and key metrics with visual summaries',
    statusDistributions: 'Intern and supervisor status breakdowns with pie charts',
    monthlyTrends: 'Registration trends over time with interactive line charts',
    specializations: 'Distribution by specialization and department with bar charts',
    topPerformers: 'Highest performing interns with detailed performance metrics',
    departments: 'Work distribution across departments with analytics',
    projects: 'Project completion rates and technology statistics',
    recentActivities: 'Timeline of recent system activities and updates',
    internDetails: 'Comprehensive intern profiles and contact information',
    supervisorDetails: 'Supervisor assignments and management details'
  };

  const exportOptionIcons = {
    overview: Users,
    statusDistributions: PieChart,
    monthlyTrends: TrendingUp,
    specializations: BarChart3,
    topPerformers: Users,
    departments: Building,
    projects: FileText,
    recentActivities: Calendar,
    internDetails: User,
    supervisorDetails: Mail
  };

  const formatOptions = [
    { key: 'A4', label: 'A4 (Standard)', description: 'Most common format (210×297mm)' },
    { key: 'A3', label: 'A3 (Large)', description: 'Larger format for detailed charts (297×420mm)' },
    { key: 'Letter', label: 'Letter (US)', description: 'US standard format (8.5×11 inches)' },
    { key: 'Legal', label: 'Legal (US)', description: 'US legal format (8.5×14 inches)' }
  ];

  const colorSchemes = [
    { key: 'professional', label: 'Professional Blue', description: 'Corporate blue and gray theme' },
    { key: 'modern', label: 'Modern Green', description: 'Fresh green and teal theme' },
    { key: 'elegant', label: 'Elegant Purple', description: 'Purple and gold theme' },
    { key: 'classic', label: 'Classic Black', description: 'Traditional black and white' }
  ];

  const fontSizes = [
    { key: 'small', label: 'Small (10-12pt)', description: 'Compact layout, more content per page' },
    { key: 'medium', label: 'Medium (12-14pt)', description: 'Standard readability' },
    { key: 'large', label: 'Large (14-16pt)', description: 'Enhanced readability' }
  ];

  const handleExport = async (format = 'pdf') => {
    setIsExporting(true);
    setExportStatus('Preparing export...');
    setExportProgress(10);
    
    try {
      if (format === 'pdf') {
        console.log('Starting enhanced PDF export...');
        console.log('PDF Settings:', pdfSettings);
        console.log('Export Options:', exportOptions);
        
        setExportStatus('Initializing PDF generator...');
        setExportProgress(20);
        
        let pdfService;
        let downloadSuccess = false;
        
        try {
          // Try the enhanced PDF service first
          console.log('Using enhanced PDF service with user preferences...');
          setExportStatus('Applying your custom settings...');
          setExportProgress(40);
          
          pdfService = new StandardPDFService();
          
          // Validate and sanitize user settings
          const sanitizedSettings = {
            ...pdfSettings,
            customTitle: pdfSettings.customTitle || '',
            customSubtitle: pdfSettings.customSubtitle || '',
            authorName: pdfSettings.authorName || '',
            department: pdfSettings.department || ''
          };
          
          console.log('Sanitized settings:', sanitizedSettings);
          
          // Pass user settings to the PDF service
          pdfService.setUserSettings(sanitizedSettings);
          pdfService.setExportOptions(exportOptions);
          
          setExportStatus('Generating charts and tables...');
          setExportProgress(60);
          
          pdfService.generateReport(reportData);
          
          setExportStatus('Finalizing PDF document...');
          setExportProgress(80);
          
          downloadSuccess = pdfService.downloadPDF();
          
          setExportProgress(100);
          
        } catch (autoTableError) {
          console.warn('Enhanced PDF service failed, trying fallback:', autoTableError);
          setExportStatus('Using fallback PDF generator...');
          setExportProgress(50);
          
          // Fallback to simple PDF service
          try {
            console.log('Using fallback PDF service...');
            pdfService = new AdvancedPDFService();
            
            // Validate and sanitize user settings for fallback too
            const sanitizedSettings = {
              ...pdfSettings,            customTitle: pdfSettings.customTitle || '',
            customSubtitle: pdfSettings.customSubtitle || '',
            authorName: pdfSettings.authorName || '',
            department: pdfSettings.department || ''
          };
            
            pdfService.setUserSettings(sanitizedSettings);
            pdfService.setExportOptions(exportOptions);
            pdfService.generateReport(reportData, pdfSettings.includeCharts);
            downloadSuccess = pdfService.downloadPDF();
            setExportProgress(100);
          } catch (simpleError) {
            console.error('Fallback PDF service also failed:', simpleError);
            throw new Error('PDF generation failed: ' + simpleError.message);
          }
        }
        
        setExportStatus('Starting download...');
        console.log('Initiating PDF download...');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (downloadSuccess) {
          console.log('PDF download successful');
          setExportStatus('Download completed successfully!');
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (onExport) {
            onExport('pdf', 'success');
          }
        } else {
          // If automatic download failed, provide manual download option
          const pdfBlob = pdfService.getPDFBlob();
          const url = URL.createObjectURL(pdfBlob);
          setManualDownloadUrl(url);
          setExportStatus('Download ready - click manual download button below');
        }
      } else if (format === 'csv') {
        console.log('Starting CSV export...');
        setExportStatus('Creating CSV file...');
        setExportProgress(50);
        
        const csvSuccess = await generateCSVExport();
        setExportProgress(100);
        
        if (csvSuccess) {
          setExportStatus('CSV download started successfully!');
          if (onExport) {
            onExport('csv', 'success');
          }
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus(`Export failed: ${error.message}`);
      setExportProgress(0);
      
      // Show user-friendly error message
      if (error.message.includes('network') || error.message.includes('timeout')) {
        setExportStatus('Network error. Please check your connection and try again.');
      } else if (error.message.includes('memory') || error.message.includes('size')) {
        setExportStatus('Report too large. Try reducing the number of sections.');
      } else {
        setExportStatus('Export failed. Please try again or contact support.');
      }
      
      if (onExport) {
        onExport(format, 'error', error.message);
      }
    } finally {
      setIsExporting(false);
      // Auto-close modal after success, but keep open for errors
      if (!manualDownloadUrl && !exportStatus?.includes('failed') && !exportStatus?.includes('error')) {
        setTimeout(() => {
          setExportStatus(null);
          setExportProgress(0);
          onOpenChange(false);
        }, 1500);
      }
    }
  };

  const generateCSVExport = async () => {
    try {
      setExportStatus('Fetching detailed data...');
      
      // Fetch detailed intern and supervisor data if needed
      let detailedInterns = [];
      let detailedSupervisors = [];
      
      if (exportOptions.includes('internDetails') || exportOptions.includes('departments')) {
        try {
          const token = getToken();
          const internsResponse = await axios.get('http://localhost:8080/admin/interns', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          detailedInterns = internsResponse.data;
        } catch (error) {
          console.warn('Failed to fetch detailed intern data:', error);
        }
      }
      
      if (exportOptions.includes('supervisorDetails')) {
        try {
          const token = getToken();
          const supervisorsResponse = await axios.get('http://localhost:8080/admin/supervisors', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          detailedSupervisors = supervisorsResponse.data;
        } catch (error) {
          console.warn('Failed to fetch detailed supervisor data:', error);
        }
      }
      
      setExportStatus('Generating CSV content...');
      
      let csv = 'SLT Intern Management System Report\\n\\n';
      csv += 'OVERVIEW STATISTICS\\n';
      csv += 'Metric,Value\\n';
      csv += `Total Interns,${reportData.totalInterns || 0}\\n`;
      csv += `Active Interns,${reportData.activeInterns || 0}\\n`;
      csv += `Completed Interns,${reportData.completedInterns || 0}\\n`;
      csv += `Dropped Interns,${reportData.droppedInterns || 0}\\n`;
      csv += `Suspended Interns,${reportData.suspendedInterns || 0}\\n`;
      csv += `Total Projects,${reportData.totalProjects || 0}\\n`;
      csv += `Active Projects,${reportData.activeProjects || 0}\\n`;
      csv += `Completed Projects,${reportData.completedProjects || 0}\\n`;
      csv += `Total Supervisors,${reportData.totalSupervisors || 0}\\n`;
      csv += `Active Supervisors,${reportData.activeSupervisors || 0}\\n`;
      csv += `Inactive Supervisors,${reportData.inactiveSupervisors || 0}\\n`;
      csv += `On Leave Supervisors,${reportData.onLeaveSupervisors || 0}\\n\\n`;
      
      // Add detailed intern data table
      if (exportOptions.includes('internDetails') && detailedInterns.length > 0) {
        csv += 'DETAILED INTERN INFORMATION\\n';
        csv += 'Intern ID,Name,Email,Mobile,NIC,Address,Educational Institute,Degree,Academic Year,Specialization,Programming Languages,Supervisor,Start Date,Status\\n';
        
        detailedInterns.forEach(intern => {
          const id = intern.internId || '';
          const name = (intern.name || '').replace(/,/g, ';').replace(/"/g, '""');
          const email = intern.email || '';
          const mobile = intern.mobileNumber || '';
          const nic = intern.nic || '';
          const address = (intern.address || '').replace(/,/g, ';').replace(/"/g, '""');
          const institute = (intern.educationalInstitute || '').replace(/,/g, ';').replace(/"/g, '""');
          const degree = (intern.degree || '').replace(/,/g, ';').replace(/"/g, '""');
          const academicYear = intern.academicYear || '';
          const specialization = (intern.specialization || '').replace(/,/g, ';').replace(/"/g, '""');
          const programmingLanguages = (intern.programmingLanguages || '').replace(/,/g, ';').replace(/"/g, '""');
          const supervisor = (intern.supervisor?.name || '').replace(/,/g, ';').replace(/"/g, '""');
          const startDate = intern.startDate || '';
          const status = intern.state === 0 ? 'Active' : intern.state === 1 ? 'Dropped' : intern.state === 2 ? 'Completed' : 'Suspended';
          
          csv += `${id},"${name}",${email},${mobile},${nic},"${address}","${institute}","${degree}",${academicYear},"${specialization}","${programmingLanguages}","${supervisor}",${startDate},${status}\\n`;
        });
        csv += '\\n';
      }
      
      // Add detailed supervisor data table
      if (exportOptions.includes('supervisorDetails') && detailedSupervisors.length > 0) {
        csv += 'DETAILED SUPERVISOR INFORMATION\\n';
        csv += 'Supervisor ID,Name,Email,Mobile,NIC,Address,Technology,Experience,Status\\n';
        
        detailedSupervisors.forEach(supervisor => {
          const id = supervisor.supervisorId || '';
          const name = (supervisor.name || '').replace(/,/g, ';').replace(/"/g, '""');
          const email = supervisor.email || '';
          const mobile = supervisor.mobileNumber || '';
          const nic = supervisor.nic || '';
          const address = (supervisor.address || '').replace(/,/g, ';').replace(/"/g, '""');
          const technology = (supervisor.technology || '').replace(/,/g, ';').replace(/"/g, '""');
          const experience = supervisor.experience || '';
          const status = supervisor.state === 1 ? 'Active' : supervisor.state === 0 ? 'Inactive' : 'On Leave';
          
          csv += `${id},"${name}",${email},${mobile},${nic},"${address}","${technology}",${experience},${status}\\n`;
        });
        csv += '\\n';
      }
      
      // Add additional sections based on export options
      if (exportOptions.includes('statusDistributions')) {
        if (reportData.internStatusDistribution) {
          csv += 'INTERN STATUS DISTRIBUTION\\n';
          csv += 'Status,Count\\n';
          Object.entries(reportData.internStatusDistribution).forEach(([key, value]) => {
            csv += `${key},${value}\\n`;
          });
          csv += '\\n';
        }
        
        if (reportData.supervisorStatusDistribution) {
          csv += 'SUPERVISOR STATUS DISTRIBUTION\\n';
          csv += 'Status,Count\\n';
          Object.entries(reportData.supervisorStatusDistribution).forEach(([key, value]) => {
            csv += `${key},${value}\\n`;
          });
          csv += '\\n';
        }
      }
      
      if (exportOptions.includes('specializations') && reportData.specializationDistribution) {
        csv += 'SPECIALIZATION DISTRIBUTION\\n';
        csv += 'Specialization,Count\\n';
        Object.entries(reportData.specializationDistribution).forEach(([key, value]) => {
          csv += `${key},${value}\\n`;
        });
        csv += '\\n';
      }
      
      if (exportOptions.includes('monthlyTrends') && reportData.monthlyRegistrations) {
        csv += 'MONTHLY REGISTRATION TRENDS\\n';
        csv += 'Month,Registrations\\n';
        Object.entries(reportData.monthlyRegistrations).forEach(([month, count]) => {
          csv += `${month},${count}\\n`;
        });
        csv += '\\n';
      }
      
      if (exportOptions.includes('topPerformers') && reportData.topPerformers) {
        csv += 'TOP PERFORMERS\\n';
        csv += 'Name,Performance Score,Total Hours,Attendance Rate,Specialization\\n';
        reportData.topPerformers.forEach(performer => {
          const name = (performer.name || 'N/A').replace(/,/g, ';');
          const performanceScore = performer.performanceScore || 'N/A';
          const totalHours = performer.totalHours || 'N/A';
          const attendanceRate = performer.attendanceRate || 'N/A';
          const specialization = (performer.specialization || 'N/A').replace(/,/g, ';');
          csv += `"${name}",${performanceScore},${totalHours},${attendanceRate},"${specialization}"\\n`;
        });
        csv += '\\n';
      }
      
      // Add department distribution if available
      if (exportOptions.includes('departments') && reportData.departmentDistribution) {
        csv += 'DEPARTMENT DISTRIBUTION\\n';
        csv += 'Department,Count\\n';
        Object.entries(reportData.departmentDistribution).forEach(([key, value]) => {
          csv += `${key},${value}\\n`;
        });
        csv += '\\n';
      }
      
      // Add project technology distribution if available
      if (exportOptions.includes('projects') && reportData.projectsByTechnology) {
        csv += 'PROJECTS BY TECHNOLOGY\\n';
        csv += 'Technology,Count\\n';
        Object.entries(reportData.projectsByTechnology).forEach(([key, value]) => {
          csv += `${key},${value}\\n`;
        });
        csv += '\\n';
      }
      
      // Add recent activities if available
      if (exportOptions.includes('recentActivities') && reportData.recentActivities) {
        csv += 'RECENT ACTIVITIES\\n';
        csv += 'Date,Activity Type,Description\\n';
        reportData.recentActivities.slice(0, 20).forEach(activity => {
          const date = activity.date || 'N/A';
          const type = activity.type || 'N/A';
          const description = (activity.description || 'N/A').replace(/,/g, ';').replace(/"/g, '""');
          csv += `${date},"${type}","${description}"\\n`;
        });
        csv += '\\n';
      }
      
      // Add attendance rates if available
      if (reportData.attendanceRates) {
        csv += 'ATTENDANCE RATES\\n';
        csv += 'Intern,Attendance Rate\\n';
        Object.entries(reportData.attendanceRates).forEach(([intern, rate]) => {
          const internName = (intern || 'N/A').replace(/,/g, ';');
          csv += `"${internName}",${rate}%\\n`;
        });
        csv += '\\n';
      }
      
      // Add average working hours if available
      if (reportData.averageWorkingHours) {
        csv += 'AVERAGE WORKING HOURS\\n';
        csv += 'Intern,Average Hours\\n';
        Object.entries(reportData.averageWorkingHours).forEach(([intern, hours]) => {
          const internName = (intern || 'N/A').replace(/,/g, ';');
          csv += `"${internName}",${hours}\\n`;
        });
        csv += '\\n';
      }
      
      // Add interns per supervisor if available
      if (reportData.internsPerSupervisor) {
        csv += 'INTERNS PER SUPERVISOR\\n';
        csv += 'Supervisor,Number of Interns\\n';
        Object.entries(reportData.internsPerSupervisor).forEach(([supervisor, count]) => {
          const supervisorName = (supervisor || 'N/A').replace(/,/g, ';');
          csv += `"${supervisorName}",${count}\\n`;
        });
        csv += '\\n';
      }
      
      // Add educational institute distribution if available
      if (reportData.instituteDistribution) {
        csv += 'EDUCATIONAL INSTITUTE DISTRIBUTION\\n';
        csv += 'Institute,Count\\n';
        Object.entries(reportData.instituteDistribution).forEach(([institute, count]) => {
          const instituteName = (institute || 'N/A').replace(/,/g, ';');
          csv += `"${instituteName}",${count}\\n`;
        });
        csv += '\\n';
      }
      
      // Add generation metadata
      csv += `\\nGenerated on: ${new Date().toLocaleString()}\\n`;
      csv += `Export Settings: ${pdfSettings.format} format, ${pdfSettings.colorScheme} theme\\n`;
      csv += `Sections included: ${exportOptions.join(', ')}\\n`;
      
      setExportStatus('Creating download...');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `SLT_Intern_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      }
      
      return true;
    } catch (error) {
      console.error('CSV generation error:', error);
      setExportStatus('CSV export failed: ' + error.message);
      return false;
    }
  };

  const handleManualDownload = () => {
    if (manualDownloadUrl) {
      const link = document.createElement('a');
      link.href = manualDownloadUrl;
      link.download = `SLT_Intern_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        URL.revokeObjectURL(manualDownloadUrl);
        setManualDownloadUrl(null);
      }, 1000);
    }
  };

  const resetToDefaults = () => {
    setPdfSettings({
      format: 'A4',
      orientation: 'portrait',
      colorScheme: 'professional',
      includeCharts: true,
      includeLogo: true,
      includeTimestamp: true,
      includePageNumbers: true,
      includeTableOfContents: true,
      customTitle: '',
      customSubtitle: '',
      authorName: '',
      department: '',
      fontSize: 'medium'
    });
    setExportOptions([
      'overview',
      'statusDistributions',
      'monthlyTrends',
      'specializations',
      'topPerformers'
    ]);
  };

  return (
    <div className="flex gap-2">
      <Tooltip content="Export comprehensive reports in PDF or CSV format">
        <Button
          color="primary"
          variant="solid"
          startContent={<Download className="w-4 h-4" />}
          onPress={onOpen}
          style={{ 
            backgroundColor: '#2563EB', 
            color: '#FFFFFF' 
          }}
          className="hover:opacity-90 transition-opacity"
        >
          Export Report
        </Button>
      </Tooltip>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          body: "py-6",
          header: "border-b border-gray-200"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Export Report</h2>
                </div>
                <p className="text-sm text-gray-600 font-normal">
                  Customize your report format and content before exporting
                </p>
              </ModalHeader>
              <ModalBody>
                {/* Export Progress */}
                {isExporting && (
                  <Card className="mb-4">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Download className="w-5 h-5 text-blue-600 animate-pulse" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{exportStatus}</p>
                          <Progress 
                            value={exportProgress} 
                            className="mt-2"
                            color="primary"
                            size="sm"
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Manual Download Option */}
                {manualDownloadUrl && (
                  <Card className="mb-4">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Manual Download Required</p>
                          <p className="text-sm text-gray-600">Automatic download failed. Please use the button below.</p>
                        </div>
                        <Button
                          color="primary"
                          size="sm"
                          onPress={handleManualDownload}
                          startContent={<Download className="w-4 h-4" />}
                        >
                          Download PDF
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Content Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold">Content Selection</h3>
                    </div>

                    <Card>
                      <CardBody className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-700">
                            Report Sections
                          </label>
                          <Chip size="sm" variant="flat" color="primary">
                            {exportOptions.length} selected
                          </Chip>
                        </div>
                        <CheckboxGroup
                          value={exportOptions}
                          onValueChange={setExportOptions}
                          className="space-y-2"
                        >
                          {Object.entries(exportOptionLabels).map(([key, label]) => {
                            const IconComponent = exportOptionIcons[key];
                            return (
                              <div key={key} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                                <Checkbox 
                                  value={key} 
                                  size="sm"
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium">{label}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {exportOptionDescriptions[key]}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </CheckboxGroup>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Right Column - Format Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold">Format Settings</h3>
                    </div>

                    <Card>
                      <CardBody className="p-4 space-y-4">
                        {/* Color Scheme */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Color Theme
                          </label>
                          <RadioGroup
                            value={pdfSettings.colorScheme}
                            onValueChange={(value) => setPdfSettings({...pdfSettings, colorScheme: value})}
                            size="sm"
                          >
                            {colorSchemes.map(scheme => (
                              <Radio key={scheme.key} value={scheme.key} className="text-sm">
                                <div>
                                  <div className="font-medium">{scheme.label}</div>
                                  <div className="text-xs text-gray-500">{scheme.description}</div>
                                </div>
                              </Radio>
                            ))}
                          </RadioGroup>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Customization Options */}
                    <Card>
                      <CardBody className="p-4 space-y-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Customization</h4>
                        
                        <Input
                          label="Custom Title"
                          placeholder="Enter custom report title"
                          value={pdfSettings.customTitle}
                          onChange={(e) => setPdfSettings({...pdfSettings, customTitle: e.target.value})}
                          size="sm"
                        />

                        <Input
                          label="Author Name"
                          placeholder="Generated by..."
                          value={pdfSettings.authorName}
                          onChange={(e) => setPdfSettings({...pdfSettings, authorName: e.target.value})}
                          size="sm"
                        />

                        <Input
                          label="Department"
                          placeholder="Department/Division"
                          value={pdfSettings.department}
                          onChange={(e) => setPdfSettings({...pdfSettings, department: e.target.value})}
                          size="sm"
                        />

                        <Divider />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Include Charts</label>
                            <Switch
                              isSelected={pdfSettings.includeCharts}
                              onValueChange={(value) => setPdfSettings({...pdfSettings, includeCharts: value})}
                              size="sm"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Include Logo</label>
                            <Switch
                              isSelected={pdfSettings.includeLogo}
                              onValueChange={(value) => setPdfSettings({...pdfSettings, includeLogo: value})}
                              size="sm"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Page Numbers</label>
                            <Switch
                              isSelected={pdfSettings.includePageNumbers}
                              onValueChange={(value) => setPdfSettings({...pdfSettings, includePageNumbers: value})}
                              size="sm"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Table of Contents</label>
                            <Switch
                              isSelected={pdfSettings.includeTableOfContents}
                              onValueChange={(value) => setPdfSettings({...pdfSettings, includeTableOfContents: value})}
                              size="sm"
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>

                {/* Preview Section */}
                <Card className="mt-6">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileImage className="w-5 h-5 text-gray-600" />
                      <h4 className="text-sm font-medium text-gray-700">Preview</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Format:</strong> {pdfSettings.format} - {pdfSettings.orientation}</p>
                        <p><strong>Theme:</strong> {colorSchemes.find(c => c.key === pdfSettings.colorScheme)?.label}</p>
                        <p><strong>Sections:</strong> {exportOptions.length} selected</p>
                        <p><strong>Features:</strong> 
                          {[
                            pdfSettings.includeCharts && 'Charts',
                            pdfSettings.includeLogo && 'Logo',
                            pdfSettings.includePageNumbers && 'Page Numbers',
                            pdfSettings.includeTableOfContents && 'Table of Contents'
                          ].filter(Boolean).join(', ') || 'None'}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </ModalBody>
              <ModalFooter className="border-t border-gray-200">
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-2">
                    <Tooltip content="Reset all settings to default values">
                      <Button
                        variant="light"
                        size="sm"
                        onPress={resetToDefaults}
                        startContent={<Settings className="w-4 h-4" />}
                      >
                        Reset
                      </Button>
                    </Tooltip>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      color="danger" 
                      variant="light" 
                      onPress={onClose}
                      isDisabled={isExporting}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={() => handleExport('csv')}
                      isDisabled={isExporting}
                      startContent={<FileText className="w-4 h-4" />}
                      className="bg-green-100 hover:bg-green-200 text-green-800"
                    >
                      Export CSV
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => handleExport('pdf')}
                      isDisabled={isExporting || exportOptions.length === 0}
                      startContent={<Download className="w-4 h-4" />}
                      className="min-w-[120px]"
                    >
                      {isExporting ? 'Exporting...' : 'Export PDF'}
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ReportExportModal;
