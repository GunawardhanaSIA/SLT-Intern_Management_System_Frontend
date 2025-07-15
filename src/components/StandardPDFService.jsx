import jsPDF from 'jspdf';

class StandardPDFService {
  constructor() {
    this.doc = null;
    this.currentY = 20;
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.userSettings = null;
    this.exportOptions = [];
    this.pageNumber = 1;
    this.totalPages = 0;
    this.tableOfContents = [];
    
    // Enhanced color schemes
    this.colorSchemes = {
      professional: {
        primary: '#2563EB',
        secondary: '#1E40AF',
        accent: '#3B82F6',
        text: '#1F2937',
        lightText: '#6B7280',
        background: '#F8FAFC',
        border: '#E5E7EB'
      },
      modern: {
        primary: '#10B981',
        secondary: '#059669',
        accent: '#34D399',
        text: '#1F2937',
        lightText: '#6B7280',
        background: '#F0FDF4',
        border: '#D1FAE5'
      },
      elegant: {
        primary: '#7C3AED',
        secondary: '#5B21B6',
        accent: '#A855F7',
        text: '#1F2937',
        lightText: '#6B7280',
        background: '#FAF7FF',
        border: '#E9D5FF'
      },
      classic: {
        primary: '#374151',
        secondary: '#1F2937',
        accent: '#4B5563',
        text: '#111827',
        lightText: '#6B7280',
        background: '#FFFFFF',
        border: '#D1D5DB'
      }
    };
    
    // Font size settings
    this.fontSizes = {
      small: { title: 18, subtitle: 14, heading: 12, body: 10, caption: 8 },
      medium: { title: 20, subtitle: 16, heading: 14, body: 12, caption: 10 },
      large: { title: 24, subtitle: 18, heading: 16, body: 14, caption: 12 }
    };
  }

  setUserSettings(settings) {
    this.userSettings = settings;
    
    // Set page format and orientation
    const format = settings.format || 'A4';
    const orientation = settings.orientation || 'portrait';
    
    if (format === 'A3') {
      this.pageWidth = orientation === 'portrait' ? 297 : 420;
      this.pageHeight = orientation === 'portrait' ? 420 : 297;
    } else if (format === 'Letter') {
      this.pageWidth = orientation === 'portrait' ? 216 : 279;
      this.pageHeight = orientation === 'portrait' ? 279 : 216;
    } else if (format === 'Legal') {
      this.pageWidth = orientation === 'portrait' ? 216 : 356;
      this.pageHeight = orientation === 'portrait' ? 356 : 216;
    } else { // A4
      this.pageWidth = orientation === 'portrait' ? 210 : 297;
      this.pageHeight = orientation === 'portrait' ? 297 : 210;
    }
  }

  setExportOptions(options) {
    this.exportOptions = options;
  }

  generateReport(reportData) {
    try {
      const format = this.userSettings?.format || 'A4';
      const orientation = this.userSettings?.orientation || 'portrait';
      
      console.log('Generating PDF with settings:', this.userSettings);
      console.log('Export options:', this.exportOptions);
      
      this.doc = new jsPDF(orientation, 'mm', format);
      this.currentY = 20;
      this.pageWidth = this.doc.internal.pageSize.width;
      this.pageHeight = this.doc.internal.pageSize.height;
      this.pageNumber = 1;
      
      // Enhanced header with logo and custom branding
      this.addEnhancedHeader();
      
      // Table of contents (if enabled)
      if (this.userSettings?.includeTableOfContents) {
        this.addTableOfContents();
      }
      
      // Generate sections based on export options
      this.exportOptions.forEach(option => {
        try {
          switch(option) {
            case 'overview':
              this.addOverviewSection(reportData);
              break;
            case 'statusDistributions':
              this.addStatusDistributionWithCharts(reportData);
              break;
            case 'specializations':
              this.addSpecializationDistributionWithChart(reportData);
              break;
            case 'monthlyTrends':
              this.addMonthlyTrendsWithChart(reportData);
              break;
            case 'topPerformers':
              this.addTopPerformers(reportData);
              break;
            case 'departments':
              this.addDepartmentAnalysis(reportData);
              break;
            case 'projects':
              this.addProjectStatistics(reportData);
              break;
            case 'recentActivities':
              this.addRecentActivities(reportData);
              break;
            case 'internDetails':
              this.addInternDetails(reportData);
              break;
            case 'supervisorDetails':
              this.addSupervisorDetails(reportData);
              break;
            default:
              console.warn(`Unknown export option: ${option}`);
          }
        } catch (sectionError) {
          console.error(`Error generating section ${option}:`, sectionError);
          // Continue with other sections
        }
      });
      
      // Enhanced footer
      this.addEnhancedFooter();
      
      // Add page numbers if enabled
      if (this.userSettings?.includePageNumbers) {
        this.addPageNumbers();
      }
      
      console.log('PDF generation completed successfully');
      return this.doc;
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  addEnhancedHeader() {
    try {
      const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
      const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
      
      // Background header bar
      this.doc.setFillColor(colorScheme.primary);
      this.doc.rect(0, 0, this.pageWidth, 25, 'F');
      
      // Logo placeholder (if enabled)
      if (this.userSettings?.includeLogo) {
        this.doc.setFillColor(255, 255, 255);
        this.doc.rect(this.margin, 5, 20, 15, 'F');
        this.doc.setTextColor(colorScheme.primary);
        this.doc.setFontSize(8);
        this.doc.text('SLT', this.margin + 10, 13, { align: 'center' });
      }
      
      // Title
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(fontSize.title);
      this.doc.setFont(undefined, 'bold');
      
      const title = (this.userSettings?.customTitle && this.userSettings.customTitle.trim()) || 'SLT Intern Management System';
      this.doc.text(title, this.pageWidth / 2, 15, { align: 'center' });
      
      // Subtitle
      this.doc.setFontSize(fontSize.subtitle);
      this.doc.setFont(undefined, 'normal');
      const subtitle = (this.userSettings?.customSubtitle && this.userSettings.customSubtitle.trim()) || 'Comprehensive Analytics Report';
      this.doc.text(subtitle, this.pageWidth / 2, 22, { align: 'center' });
      
      // Reset colors and position
      this.doc.setTextColor(colorScheme.text);
      this.currentY = 35;
      
      // Add generation info
      this.doc.setFontSize(fontSize.caption);
      this.doc.setFont(undefined, 'normal');
      this.doc.setTextColor(colorScheme.lightText);
      
      const generationInfo = [];
      if (this.userSettings?.includeTimestamp) {
        generationInfo.push(`Generated: ${new Date().toLocaleString()}`);
      }
      if (this.userSettings?.authorName && this.userSettings.authorName.trim()) {
        generationInfo.push(`By: ${this.userSettings.authorName.trim()}`);
      }
      if (this.userSettings?.department && this.userSettings.department.trim()) {
        generationInfo.push(`Department: ${this.userSettings.department.trim()}`);
      }
      
      if (generationInfo.length > 0) {
        this.doc.text(generationInfo.join(' | '), this.pageWidth / 2, this.currentY, { align: 'center' });
        this.currentY += 8;
      }
      
      // Add decorative line
      this.doc.setDrawColor(colorScheme.border);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
      this.currentY += 15;
      
    } catch (error) {
      console.error('Error in addEnhancedHeader:', error);
      // Fallback to basic header
      this.doc.setFontSize(16);
      this.doc.text('SLT Intern Management System', this.pageWidth / 2, 15, { align: 'center' });
      this.currentY = 25;
    }
  }

  addTableOfContents() {
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    this.addSectionTitle('Table of Contents');
    
    const sectionTitles = {
      overview: 'Executive Overview',
      statusDistributions: 'Status Distribution Analysis',
      specializations: 'Specialization Breakdown',
      monthlyTrends: 'Monthly Registration Trends',
      topPerformers: 'Top Performers',
      departments: 'Department Analysis',
      projects: 'Project Statistics',
      recentActivities: 'Recent Activities',
      internDetails: 'Intern Directory',
      supervisorDetails: 'Supervisor Directory'
    };
    
    this.doc.setFontSize(fontSize.body);
    this.doc.setFont(undefined, 'normal');
    
    let pageRef = 2; // Start from page 2 (after TOC)
    
    this.exportOptions.forEach((option, index) => {
      const title = sectionTitles[option] || option;
      const dotLine = '.'.repeat(60 - title.length);
      
      this.doc.setTextColor(colorScheme.text);
      this.doc.text(`${index + 1}. ${title}`, this.margin, this.currentY);
      this.doc.setTextColor(colorScheme.lightText);
      this.doc.text(dotLine, this.margin + 50, this.currentY);
      this.doc.setTextColor(colorScheme.text);
      this.doc.text(pageRef.toString(), this.pageWidth - this.margin - 10, this.currentY);
      
      this.currentY += 8;
      pageRef++;
    });
    
    this.currentY += 15;
    this.checkPageBreak();
  }

  addSectionTitle(title, subtitle = null) {
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    this.checkPageBreak(30);
    
    // Section background
    this.doc.setFillColor(colorScheme.background);
    this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - (2 * this.margin), 20, 'F');
    
    // Section title
    this.doc.setTextColor(colorScheme.primary);
    this.doc.setFontSize(fontSize.heading);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(title, this.margin + 5, this.currentY + 5);
    
    if (subtitle) {
      this.doc.setFontSize(fontSize.body);
      this.doc.setFont(undefined, 'normal');
      this.doc.setTextColor(colorScheme.lightText);
      this.doc.text(subtitle, this.margin + 5, this.currentY + 12);
    }
    
    this.currentY += 25;
    
    // Add to table of contents
    this.tableOfContents.push({
      title: title,
      page: this.pageNumber
    });
  }

  addOverviewSection(reportData) {
    this.addSectionTitle('Executive Overview', 'Key performance indicators and summary metrics');
    
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    // Create summary cards layout
    const cardWidth = (this.pageWidth - (3 * this.margin)) / 2;
    const cardHeight = 35;
    
    const metrics = [
      { 
        title: 'Total Interns', 
        value: reportData.totalInterns || 0,
        subtitle: `${reportData.activeInterns || 0} Active | ${reportData.completedInterns || 0} Completed`,
        color: colorScheme.primary
      },
      { 
        title: 'Projects', 
        value: reportData.totalProjects || 0,
        subtitle: `${reportData.activeProjects || 0} Active | ${reportData.completedProjects || 0} Completed`,
        color: colorScheme.accent
      },
      { 
        title: 'Supervisors', 
        value: reportData.totalSupervisors || 0,
        subtitle: `${reportData.activeSupervisors || 0} Active | ${reportData.inactiveSupervisors || 0} Inactive`,
        color: colorScheme.secondary
      },
      { 
        title: 'Completion Rate', 
        value: reportData.totalInterns > 0 ? 
          Math.round(((reportData.completedInterns || 0) / reportData.totalInterns) * 100) + '%' : '0%',
        subtitle: 'Overall program success rate',
        color: colorScheme.primary
      }
    ];
    
    let cardX = this.margin;
    let cardY = this.currentY;
    
    metrics.forEach((metric, index) => {
      if (index % 2 === 0 && index > 0) {
        cardY += cardHeight + 10;
        cardX = this.margin;
      }
      
      this.drawMetricCard(cardX, cardY, cardWidth, cardHeight, metric, colorScheme, fontSize);
      cardX += cardWidth + 10;
    });
    
    this.currentY = cardY + cardHeight + 20;
    
    // Add summary text
    this.doc.setFontSize(fontSize.body);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(colorScheme.text);
    
    const summaryText = this.generateSummaryText(reportData);
    const lines = this.doc.splitTextToSize(summaryText, this.pageWidth - (2 * this.margin));
    
    lines.forEach(line => {
      this.checkPageBreak();
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 15;
  }

  drawMetricCard(x, y, width, height, metric, colorScheme, fontSize) {
    // Card background
    this.doc.setFillColor(255, 255, 255);
    this.doc.setDrawColor(colorScheme.border);
    this.doc.rect(x, y, width, height, 'FD');
    
    // Accent bar
    this.doc.setFillColor(metric.color);
    this.doc.rect(x, y, 3, height, 'F');
    
    // Title
    this.doc.setTextColor(colorScheme.lightText);
    this.doc.setFontSize(fontSize.body);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(metric.title, x + 10, y + 10);
    
    // Value
    this.doc.setTextColor(colorScheme.text);
    this.doc.setFontSize(fontSize.heading);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(metric.value.toString(), x + 10, y + 20);
    
    // Subtitle
    this.doc.setTextColor(colorScheme.lightText);
    this.doc.setFontSize(fontSize.caption);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(metric.subtitle, x + 10, y + 28);
  }

  generateSummaryText(reportData) {
    const totalInterns = reportData.totalInterns || 0;
    const activeInterns = reportData.activeInterns || 0;
    const completedInterns = reportData.completedInterns || 0;
    const completionRate = totalInterns > 0 ? Math.round((completedInterns / totalInterns) * 100) : 0;
    
    return `This report provides a comprehensive overview of the SLT Intern Management System as of ${new Date().toLocaleDateString()}. ` +
           `Currently, there are ${totalInterns} interns in the system, with ${activeInterns} actively participating in the program. ` +
           `The overall completion rate stands at ${completionRate}%, indicating ${completionRate >= 70 ? 'strong' : completionRate >= 50 ? 'moderate' : 'concerning'} program performance. ` +
           `${reportData.totalProjects || 0} projects are being managed across various departments, with ${reportData.totalSupervisors || 0} supervisors providing guidance and mentorship.`;
  }

  // Enhanced methods for additional sections...
  addDepartmentAnalysis(reportData) {
    this.addSectionTitle('Department Analysis', 'Work distribution and performance by department');
    
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    // Add department-specific analytics
    this.doc.setFontSize(fontSize.body);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(colorScheme.text);
    
    const deptText = 'Department analysis shows the distribution of interns across various divisions within SLT. This helps identify resource allocation and specialization trends.';
    const lines = this.doc.splitTextToSize(deptText, this.pageWidth - (2 * this.margin));
    
    lines.forEach(line => {
      this.checkPageBreak();
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 15;
  }

  addProjectStatistics(reportData) {
    this.addSectionTitle('Project Statistics', 'Project completion rates and technology distribution');
    
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    // Add project-specific statistics
    this.doc.setFontSize(fontSize.body);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(colorScheme.text);
    
    const projectText = 'Project statistics provide insights into the types of projects interns are working on, completion rates, and technology stack usage across different specializations.';
    const lines = this.doc.splitTextToSize(projectText, this.pageWidth - (2 * this.margin));
    
    lines.forEach(line => {
      this.checkPageBreak();
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 15;
  }

  addRecentActivities(reportData) {
    this.addSectionTitle('Recent Activities', 'Latest system activities and updates');
    
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    if (reportData.recentActivities && reportData.recentActivities.length > 0) {
      reportData.recentActivities.slice(0, 10).forEach(activity => {
        this.checkPageBreak();
        
        // Activity item
        this.doc.setTextColor(colorScheme.text);
        this.doc.setFontSize(fontSize.body);
        this.doc.setFont(undefined, 'normal');
        this.doc.text(`• ${activity.description}`, this.margin, this.currentY);
        
        this.doc.setTextColor(colorScheme.lightText);
        this.doc.setFontSize(fontSize.caption);
        this.doc.text(activity.date, this.pageWidth - this.margin - 30, this.currentY);
        
        this.currentY += 8;
      });
    } else {
      this.doc.setTextColor(colorScheme.lightText);
      this.doc.setFontSize(fontSize.body);
      this.doc.text('No recent activities to display.', this.margin, this.currentY);
      this.currentY += 8;
    }
    
    this.currentY += 15;
  }

  addInternDetails(reportData) {
    this.addSectionTitle('Intern Directory', 'Detailed intern information and contacts');
    
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    this.doc.setFontSize(fontSize.body);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(colorScheme.text);
    
    const dirText = 'This section would contain detailed intern profiles, contact information, and current project assignments. Due to privacy considerations, only summary statistics are shown in this report.';
    const lines = this.doc.splitTextToSize(dirText, this.pageWidth - (2 * this.margin));
    
    lines.forEach(line => {
      this.checkPageBreak();
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 15;
  }

  addSupervisorDetails(reportData) {
    this.addSectionTitle('Supervisor Directory', 'Supervisor assignments and management details');
    
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    this.doc.setFontSize(fontSize.body);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(colorScheme.text);
    
    const supText = 'This section provides information about supervisors, their specializations, and current intern assignments. Contact details and management structures are included for administrative reference.';
    const lines = this.doc.splitTextToSize(supText, this.pageWidth - (2 * this.margin));
    
    lines.forEach(line => {
      this.checkPageBreak();
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 15;
  }

  addEnhancedFooter() {
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    // Move to bottom of page
    this.currentY = this.pageHeight - 20;
    
    // Footer bar
    this.doc.setFillColor(colorScheme.primary);
    this.doc.rect(0, this.pageHeight - 15, this.pageWidth, 15, 'F');
    
    // Footer text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(fontSize.caption);
    this.doc.setFont(undefined, 'normal');
    
    const footerText = 'SLT Intern Management System | Generated by Advanced Analytics Engine';
    this.doc.text(footerText, this.pageWidth / 2, this.pageHeight - 8, { align: 'center' });
    
    // Contact info
    this.doc.text('For support: support@slt.com.lk', this.pageWidth / 2, this.pageHeight - 4, { align: 'center' });
  }

  addPageNumbers() {
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    const totalPages = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.doc.setTextColor(colorScheme.lightText);
      this.doc.setFontSize(fontSize.caption);
      this.doc.setFont(undefined, 'normal');
      
      const pageText = `Page ${i} of ${totalPages}`;
      this.doc.text(pageText, this.pageWidth - this.margin, this.pageHeight - 25);
    }
  }

  checkPageBreak(requiredSpace = 20) {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage();
      this.pageNumber++;
      this.currentY = 20;
    }
  }

  // Method to draw a circular pie chart that matches the dashboard design
  drawPieChart(x, y, radius, data, title) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return;

    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];

    // Colors matching the theme
    const colors = {
      'Active': colorScheme.primary,
      'Completed': colorScheme.accent,
      'Dropped': '#EF4444',
      'Suspended': '#F59E0B',
      'Inactive': '#EF4444',
      'On Leave': '#F59E0B',
      'default': [colorScheme.primary, colorScheme.accent, '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899']
    };
    
    // Draw title
    this.doc.setFontSize(fontSize.heading);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(colorScheme.text);
    this.doc.text(title, x - radius, y - radius - 15);
    
    // Draw the pie chart using polygon approximation
    let currentAngle = -Math.PI / 2; // Start from top (12 o'clock position)
    const segments = 60; // Higher number for smoother circles
    
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      
      // Get color for this slice
      const color = colors[item.name] || colors.default[index % colors.default.length];
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      this.doc.setFillColor(r, g, b);
      this.doc.setDrawColor(255, 255, 255);
      this.doc.setLineWidth(2);
      
      // Draw pie slice using many small triangular segments
      const segmentCount = Math.max(1, Math.ceil((sliceAngle / (2 * Math.PI)) * segments));
      const segmentAngle = sliceAngle / segmentCount;
      
      for (let i = 0; i < segmentCount; i++) {
        const angle1 = currentAngle + (i * segmentAngle);
        const angle2 = currentAngle + ((i + 1) * segmentAngle);
        
        // Calculate triangle points
        const centerX = x;
        const centerY = y;
        const x1 = centerX + radius * Math.cos(angle1);
        const y1 = centerY + radius * Math.sin(angle1);
        const x2 = centerX + radius * Math.cos(angle2);
        const y2 = centerY + radius * Math.sin(angle2);
        
        // Fill the triangular segment
        this.fillTriangle(centerX, centerY, x1, y1, x2, y2);
      }
      
      currentAngle += sliceAngle;
    });
    
    // Draw clean circle border
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(1);
    this.drawCircleOutline(x, y, radius);
    
    // Draw legend to the right of the pie chart
    let legendX = x + radius + 20;
    let legendY = y - radius + 10;
    this.doc.setFontSize(fontSize.caption);
    this.doc.setFont(undefined, 'normal');
    
    data.forEach((item, index) => {
      const color = colors[item.name] || colors.default[index % colors.default.length];
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      // Draw legend color box
      this.doc.setFillColor(r, g, b);
      this.doc.rect(legendX, legendY - 3, 6, 6, 'F');
      
      // Draw legend text
      this.doc.setTextColor(colorScheme.text);
      const percentage = ((item.value / total) * 100).toFixed(1);
      this.doc.text(`${item.name}: ${item.value} (${percentage}%)`, legendX + 10, legendY);
      
      legendY += 8;
    });
  }

  // Helper method to fill a triangle efficiently
  fillTriangle(x1, y1, x2, y2, x3, y3) {
    this.doc.triangle(x1, y1, x2, y2, x3, y3, 'F');
  }

  // Helper method to draw circle outline
  drawCircleOutline(x, y, radius) {
    this.doc.circle(x, y, radius, 'S');
  }

  // Method to draw a bar chart matching dashboard design
  drawBarChart(x, y, width, height, data, title) {
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    if (data.length === 0) return;
    
    // Draw title
    this.doc.setFontSize(fontSize.body);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(colorScheme.text);
    this.doc.text(title, x, y - 5);
    
    // Calculate bar dimensions
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = width / data.length * 0.8;
    const barSpacing = width / data.length * 0.2;
    
    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * height;
      const barX = x + (index * (barWidth + barSpacing));
      const barY = y + height - barHeight;
      
      // Draw bar
      this.doc.setFillColor(colorScheme.primary);
      this.doc.rect(barX, barY, barWidth, barHeight, 'F');
      
      // Draw value label
      this.doc.setTextColor(colorScheme.text);
      this.doc.setFontSize(fontSize.caption);
      this.doc.text(item.value.toString(), barX + barWidth / 2, barY - 2, { align: 'center' });
      
      // Draw category label
      this.doc.text(item.name, barX + barWidth / 2, y + height + 8, { align: 'center' });
    });
    
    // Draw axes
    this.doc.setDrawColor(colorScheme.border);
    this.doc.setLineWidth(0.5);
    this.doc.line(x, y + height, x + width, y + height); // X-axis
    this.doc.line(x, y, x, y + height); // Y-axis
  }

  drawLineChart(x, y, width, height, data, title) {
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    if (data.length === 0) return;
    
    // Draw title
    this.doc.setFontSize(fontSize.body);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(colorScheme.text);
    this.doc.text(title, x, y - 5);
    
    // Calculate point positions
    const maxValue = Math.max(...data.map(d => d.value));
    const stepX = width / (data.length - 1);
    
    // Draw axes
    this.doc.setDrawColor(colorScheme.border);
    this.doc.setLineWidth(0.5);
    this.doc.line(x, y + height, x + width, y + height); // X-axis
    this.doc.line(x, y, x, y + height); // Y-axis
    
    // Draw line
    this.doc.setDrawColor(colorScheme.primary);
    this.doc.setLineWidth(2);
    
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = x + (i * stepX);
      const y1 = y + height - (data[i].value / maxValue) * height;
      const x2 = x + ((i + 1) * stepX);
      const y2 = y + height - (data[i + 1].value / maxValue) * height;
      
      this.doc.line(x1, y1, x2, y2);
    }
    
    // Draw points
    data.forEach((item, index) => {
      const pointX = x + (index * stepX);
      const pointY = y + height - (item.value / maxValue) * height;
      
      this.doc.setFillColor(colorScheme.primary);
      this.doc.circle(pointX, pointY, 2, 'F');
      
      // Draw value label
      this.doc.setTextColor(colorScheme.text);
      this.doc.setFontSize(fontSize.caption);
      this.doc.text(item.value.toString(), pointX, pointY - 4, { align: 'center' });
    });
  }

  addStatusDistributionWithCharts(reportData) {
    this.addSectionTitle('Status Distribution Analysis', 'Visual breakdown of intern and supervisor status');
    
    if (this.userSettings?.includeCharts) {
      // Intern Status Distribution
      if (reportData.internStatusDistribution) {
        this.checkPageBreak(80);
        
        const internData = Object.entries(reportData.internStatusDistribution)
          .map(([status, count]) => ({ name: status, value: count }))
          .filter(item => item.value > 0);
        
        if (internData.length > 0) {
          this.drawPieChart(70, this.currentY + 40, 25, internData, 'Intern Status Distribution');
          this.currentY += 80;
        }
      }
      
      // Supervisor Status Distribution
      if (reportData.supervisorStatusDistribution) {
        this.checkPageBreak(80);
        
        const supervisorData = Object.entries(reportData.supervisorStatusDistribution)
          .map(([status, count]) => ({ name: status, value: count }))
          .filter(item => item.value > 0);
        
        if (supervisorData.length > 0) {
          this.drawPieChart(70, this.currentY + 40, 25, supervisorData, 'Supervisor Status Distribution');
          this.currentY += 80;
        }
      }
    }
    
    this.currentY += 15;
  }

  addSpecializationDistributionWithChart(reportData) {
    this.addSectionTitle('Specialization Distribution', 'Distribution of interns by specialization');
    
    if (reportData.specializationDistribution) {
      const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
      const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
      
      if (this.userSettings?.includeCharts) {
        this.checkPageBreak(100);
        
        const specData = Object.entries(reportData.specializationDistribution)
          .map(([spec, count]) => ({ name: spec, value: count }))
          .filter(item => item.value > 0);
        
        if (specData.length > 0) {
          this.drawBarChart(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 60, specData, 'Specialization Distribution');
          this.currentY += 80;
        }
      }
      
      // Add table summary
      this.doc.setFontSize(fontSize.body);
      this.doc.setFont(undefined, 'normal');
      this.doc.setTextColor(colorScheme.text);
      
      const specText = Object.entries(reportData.specializationDistribution)
        .map(([spec, count]) => `${spec}: ${count}`)
        .join(', ');
      
      const lines = this.doc.splitTextToSize(`Specialization breakdown: ${specText}`, this.pageWidth - (2 * this.margin));
      
      lines.forEach(line => {
        this.checkPageBreak();
        this.doc.text(line, this.margin, this.currentY);
        this.currentY += 6;
      });
    }
    
    this.currentY += 15;
  }

  addMonthlyTrendsWithChart(reportData) {
    this.addSectionTitle('Monthly Registration Trends', 'Registration patterns over time');
    
    if (reportData.monthlyRegistrations) {
      const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
      const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
      
      if (this.userSettings?.includeCharts) {
        this.checkPageBreak(100);
        
        const monthlyData = Object.entries(reportData.monthlyRegistrations)
          .map(([month, count]) => ({ month, value: count }))
          .sort((a, b) => new Date(a.month) - new Date(b.month));
        
        if (monthlyData.length > 0) {
          this.drawLineChart(this.margin, this.currentY, this.pageWidth - (2 * this.margin), 60, monthlyData, 'Registration Trends (Last 12 Months)');
          this.currentY += 80;
        }
      }
      
      // Add summary text
      this.doc.setFontSize(fontSize.body);
      this.doc.setFont(undefined, 'normal');
      this.doc.setTextColor(colorScheme.text);
      
      const totalRegistrations = Object.values(reportData.monthlyRegistrations).reduce((sum, count) => sum + count, 0);
      const avgPerMonth = totalRegistrations / Object.keys(reportData.monthlyRegistrations).length;
      
      const summaryText = `Over the past ${Object.keys(reportData.monthlyRegistrations).length} months, there have been ${totalRegistrations} total registrations with an average of ${avgPerMonth.toFixed(1)} registrations per month.`;
      
      const lines = this.doc.splitTextToSize(summaryText, this.pageWidth - (2 * this.margin));
      
      lines.forEach(line => {
        this.checkPageBreak();
        this.doc.text(line, this.margin, this.currentY);
        this.currentY += 6;
      });
    }
    
    this.currentY += 15;
  }

  addTopPerformers(reportData) {
    this.addSectionTitle('Top Performers', 'Highest performing interns and their achievements');
    
    if (reportData.topPerformers && reportData.topPerformers.length > 0) {
      const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
      const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
      
      reportData.topPerformers.slice(0, 10).forEach((performer, index) => {
        this.checkPageBreak(25);
        
        // Rank badge
        this.doc.setFillColor(colorScheme.primary);
        this.doc.circle(this.margin + 10, this.currentY + 5, 8, 'F');
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(fontSize.caption);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(`${index + 1}`, this.margin + 10, this.currentY + 7, { align: 'center' });
        
        // Performer details
        this.doc.setTextColor(colorScheme.text);
        this.doc.setFontSize(fontSize.body);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(performer.name, this.margin + 25, this.currentY + 5);
        
        this.doc.setFont(undefined, 'normal');
        this.doc.setTextColor(colorScheme.lightText);
        this.doc.text(performer.specialization || 'N/A', this.margin + 25, this.currentY + 12);
        
        // Performance metrics
        const metrics = [];
        if (performer.performanceScore) metrics.push(`Score: ${performer.performanceScore.toFixed(1)}`);
        if (performer.totalHours) metrics.push(`Hours: ${performer.totalHours.toFixed(1)}`);
        if (performer.attendanceRate) metrics.push(`Attendance: ${performer.attendanceRate.toFixed(1)}%`);
        
        if (metrics.length > 0) {
          this.doc.text(metrics.join(' | '), this.margin + 25, this.currentY + 18);
        }
        
        this.currentY += 25;
      });
    } else {
      const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
      const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
      
      this.doc.setTextColor(colorScheme.lightText);
      this.doc.setFontSize(fontSize.body);
      this.doc.text('No top performers data available.', this.margin, this.currentY);
      this.currentY += 15;
    }
    
    this.currentY += 15;
  }

  downloadPDF() {
    try {
      const filename = this.generateFileName();
      this.doc.save(filename);
      console.log('PDF downloaded successfully');
      return true;
    } catch (error) {
      console.error('Primary PDF download failed:', error);
      
      // Fallback download method
      try {
        const pdfBlob = this.doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.generateFileName();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            console.warn('Failed to revoke object URL:', error);
          }
        }, 1000);
        
        console.log('PDF download initiated using blob method');
        return true;
      } catch (fallbackError) {
        console.error('Fallback PDF download also failed:', fallbackError);
        throw new Error('PDF download failed: ' + fallbackError.message);
      }
    }
  }

  generateFileName() {
    const date = new Date().toISOString().split('T')[0];
    const title = (this.userSettings?.customTitle && this.userSettings.customTitle.trim()) ? 
      this.userSettings.customTitle.trim().replace(/[^a-zA-Z0-9]/g, '_') : 
      'SLT_Intern_Report';
    
    return `${title}_${date}.pdf`;
  }

  getPDFBlob() {
    return this.doc.output('blob');
  }

  getPDFDataUri() {
    return this.doc.output('datauristring');
  }
}

export default StandardPDFService;