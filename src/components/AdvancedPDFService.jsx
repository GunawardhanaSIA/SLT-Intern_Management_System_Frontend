import jsPDF from 'jspdf';

// Try to import autotable plugin
try {
  require('jspdf-autotable');
} catch (error) {
  console.warn('jspdf-autotable plugin not available:', error);
}

class AdvancedPDFService {
  constructor() {
    this.doc = null;
    this.currentY = 20;
    this.hasAutoTable = typeof jsPDF.API.autoTable === 'function';
    this.userSettings = null;
    this.exportOptions = [];
    this.pageNumber = 1;
    
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
  }

  setExportOptions(options) {
    this.exportOptions = options;
  }

  generateReport(reportData, includeCharts = false) {
    try {
      const format = this.userSettings?.format || 'A4';
      const orientation = this.userSettings?.orientation || 'portrait';
      
      console.log('Generating PDF with settings:', this.userSettings);
      console.log('Export options:', this.exportOptions);
      
      this.doc = new jsPDF(orientation, 'mm', format);
      this.currentY = 20;
      this.pageNumber = 1;
      
      // Check if autoTable is available
      if (!this.hasAutoTable && typeof this.doc.autoTable !== 'function') {
        console.warn('autoTable plugin not available, using fallback method');
        this.hasAutoTable = false;
      } else {
        this.hasAutoTable = true;
      }
      
      // Enhanced header
      this.addEnhancedHeader();
      
      // Table of contents (if enabled)
      if (this.userSettings?.includeTableOfContents) {
        this.addTableOfContents();
      }
      
      // Generate sections based on export options
      if (this.exportOptions.length > 0) {
        this.exportOptions.forEach(option => {
          try {
            switch(option) {
              case 'overview':
                this.addOverviewSection(reportData);
                break;
              case 'statusDistributions':
                this.addStatisticsTables(reportData);
                break;
              case 'monthlyTrends':
                if (reportData.monthlyRegistrations) {
                  this.addMonthlyTrends(reportData.monthlyRegistrations);
                }
                break;
              case 'specializations':
                this.addDistributionTables(reportData);
                break;
              case 'topPerformers':
                if (reportData.topPerformers && reportData.topPerformers.length > 0) {
                  this.addTopPerformers(reportData.topPerformers);
                }
                break;
              default:
                console.warn(`Unknown export option: ${option}`);
                break;
            }
          } catch (sectionError) {
            console.error(`Error generating section ${option}:`, sectionError);
            // Continue with other sections
          }
        });
      } else {
        // Default sections if no options specified
        this.addOverviewSection(reportData);
        this.addStatisticsTables(reportData);
        
        if (reportData.monthlyRegistrations) {
          this.addMonthlyTrends(reportData.monthlyRegistrations);
        }
      
      this.addDistributionTables(reportData);
      
      if (reportData.topPerformers && reportData.topPerformers.length > 0) {
        this.addTopPerformers(reportData.topPerformers);
      }
    }
    
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

  // Fallback method to create tables without autoTable plugin
  createSimpleTable(headers, data, title = '') {
    const pageWidth = this.doc.internal.pageSize.width;
    const margin = 20;
    const tableWidth = pageWidth - (margin * 2);
    const colWidth = tableWidth / headers.length;
    
    if (title) {
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'bold');
      this.doc.text(title, margin, this.currentY);
      this.currentY += 10;
    }
    
    // Draw headers
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'bold');
    headers.forEach((header, index) => {
      const x = margin + (index * colWidth);
      this.doc.text(header, x + 2, this.currentY);
    });
    this.currentY += 8;
    
    // Draw header line
    this.doc.line(margin, this.currentY - 2, pageWidth - margin, this.currentY - 2);
    this.currentY += 3;
    
    // Draw data rows
    this.doc.setFont(undefined, 'normal');
    data.forEach((row, rowIndex) => {
      if (this.currentY > 270) { // Check for page break
        this.doc.addPage();
        this.currentY = 20;
        
        // Redraw headers on new page
        this.doc.setFont(undefined, 'bold');
        headers.forEach((header, index) => {
          const x = margin + (index * colWidth);
          this.doc.text(header, x + 2, this.currentY);
        });
        this.currentY += 8;
        this.doc.line(margin, this.currentY - 2, pageWidth - margin, this.currentY - 2);
        this.currentY += 3;
        this.doc.setFont(undefined, 'normal');
      }
      
      if (Array.isArray(row)) {
        row.forEach((cell, colIndex) => {
          if (cell !== undefined && cell !== null) {
            const x = margin + (colIndex * colWidth);
            const cellText = String(cell);
            // Truncate long text to fit column width
            const maxWidth = colWidth - 4;
            const truncatedText = this.doc.getTextWidth(cellText) > maxWidth ? 
              cellText.substring(0, Math.floor(cellText.length * maxWidth / this.doc.getTextWidth(cellText))) + '...' :
              cellText;
            this.doc.text(truncatedText, x + 2, this.currentY);
          }
        });
      }
      this.currentY += 6;
    });
    
    this.currentY += 10;
  }

  addHeader() {
    const pageWidth = this.doc.internal.pageSize.width;
    
    // Title
    this.doc.setFontSize(20);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('SLT Intern Management System', pageWidth / 2, this.currentY, { align: 'center' });
    
    this.currentY += 10;
    this.doc.setFontSize(16);
    this.doc.text('Comprehensive Report', pageWidth / 2, this.currentY, { align: 'center' });
    
    this.currentY += 10;
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, pageWidth / 2, this.currentY, { align: 'center' });
    
    this.currentY += 20;
  }

  addEnhancedHeader() {
    try {
      const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
      const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
      
      // Background header bar
      this.doc.setFillColor(colorScheme.primary);
      this.doc.rect(0, 0, this.doc.internal.pageSize.width, 25, 'F');
      
      // Title
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(fontSize.title);
      this.doc.setFont(undefined, 'bold');
      
      const title = (this.userSettings?.customTitle && this.userSettings.customTitle.trim()) || 'SLT Intern Management System';
      this.doc.text(title, this.doc.internal.pageSize.width / 2, 15, { align: 'center' });
      
      // Subtitle
      this.doc.setFontSize(fontSize.subtitle);
      this.doc.setFont(undefined, 'normal');
      const subtitle = (this.userSettings?.customSubtitle && this.userSettings.customSubtitle.trim()) || 'Comprehensive Report';
      this.doc.text(subtitle, this.doc.internal.pageSize.width / 2, 22, { align: 'center' });
      
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
        this.doc.text(generationInfo.join(' | '), this.doc.internal.pageSize.width / 2, this.currentY, { align: 'center' });
        this.currentY += 8;
      }
      
      // Add decorative line
      this.doc.setDrawColor(colorScheme.border);
      this.doc.setLineWidth(0.5);
      this.doc.line(20, this.currentY, this.doc.internal.pageSize.width - 20, this.currentY);
      this.currentY += 15;
      
    } catch (error) {
      console.error('Error in addEnhancedHeader:', error);
      // Fallback to basic header
      this.doc.setFontSize(16);
      this.doc.text('SLT Intern Management System', this.doc.internal.pageSize.width / 2, 15, { align: 'center' });
      this.currentY = 25;
    }
  }

  addTableOfContents() {
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    this.doc.setFontSize(fontSize.heading);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(colorScheme.primary);
    this.doc.text('Table of Contents', 20, this.currentY);
    this.currentY += 15;
    
    const sectionTitles = {
      overview: 'Executive Overview',
      statusDistributions: 'Status Distribution Analysis',
      specializations: 'Specialization Breakdown',
      monthlyTrends: 'Monthly Registration Trends',
      topPerformers: 'Top Performers'
    };
    
    this.doc.setFontSize(fontSize.body);
    this.doc.setFont(undefined, 'normal');
    
    let pageRef = 2;
    
    this.exportOptions.forEach((option, index) => {
      const title = sectionTitles[option] || option;
      const dotLine = '.'.repeat(50 - title.length);
      
      this.doc.setTextColor(colorScheme.text);
      this.doc.text(`${index + 1}. ${title}`, 20, this.currentY);
      this.doc.setTextColor(colorScheme.lightText);
      this.doc.text(dotLine, 60, this.currentY);
      this.doc.setTextColor(colorScheme.text);
      this.doc.text(pageRef.toString(), this.doc.internal.pageSize.width - 30, this.currentY);
      
      this.currentY += 8;
      pageRef++;
    });
    
    this.currentY += 15;
  }

  addEnhancedFooter() {
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    // Move to bottom of page
    const pageHeight = this.doc.internal.pageSize.height;
    const pageWidth = this.doc.internal.pageSize.width;
    
    // Footer bar
    this.doc.setFillColor(colorScheme.primary);
    this.doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    
    // Footer text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(fontSize.caption);
    this.doc.setFont(undefined, 'normal');
    
    const footerText = 'SLT Intern Management System | Generated by Advanced Analytics Engine';
    this.doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: 'center' });
    
    // Contact info
    this.doc.text('For support: support@slt.com.lk', pageWidth / 2, pageHeight - 4, { align: 'center' });
  }

  addPageNumbers() {
    const colorScheme = this.colorSchemes[this.userSettings?.colorScheme || 'professional'];
    const fontSize = this.fontSizes[this.userSettings?.fontSize || 'medium'];
    
    const totalPages = this.doc.internal.getNumberOfPages();
    const pageWidth = this.doc.internal.pageSize.width;
    const pageHeight = this.doc.internal.pageSize.height;
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.doc.setTextColor(colorScheme.lightText);
      this.doc.setFontSize(fontSize.caption);
      this.doc.setFont(undefined, 'normal');
      
      const pageText = `Page ${i} of ${totalPages}`;
      this.doc.text(pageText, pageWidth - 20, pageHeight - 25);
    }
  }

  addOverviewSection(reportData) {
    this.checkPageBreak(60);
    
    this.doc.setFontSize(14);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Overview Statistics', 20, this.currentY);
    this.currentY += 10;
    
    const overviewData = [
      ['Metric', 'Count', 'Percentage'],
      ['Total Interns', reportData.totalInterns || 0, '100%'],
      ['Active Interns', reportData.activeInterns || 0, `${((reportData.activeInterns || 0) / (reportData.totalInterns || 1) * 100).toFixed(1)}%`],
      ['Completed Interns', reportData.completedInterns || 0, `${((reportData.completedInterns || 0) / (reportData.totalInterns || 1) * 100).toFixed(1)}%`],
      ['Dropped Interns', reportData.droppedInterns || 0, `${((reportData.droppedInterns || 0) / (reportData.totalInterns || 1) * 100).toFixed(1)}%`],
      ['Suspended Interns', reportData.suspendedInterns || 0, `${((reportData.suspendedInterns || 0) / (reportData.totalInterns || 1) * 100).toFixed(1)}%`],
      [],
      ['Total Projects', reportData.totalProjects || 0, '100%'],
      ['Active Projects', reportData.activeProjects || 0, `${((reportData.activeProjects || 0) / (reportData.totalProjects || 1) * 100).toFixed(1)}%`],
      ['Completed Projects', reportData.completedProjects || 0, `${((reportData.completedProjects || 0) / (reportData.totalProjects || 1) * 100).toFixed(1)}%`],
      [],
      ['Total Supervisors', reportData.totalSupervisors || 0, '100%'],
      ['Active Supervisors', reportData.activeSupervisors || 0, `${((reportData.activeSupervisors || 0) / (reportData.totalSupervisors || 1) * 100).toFixed(1)}%`],
      ['Inactive Supervisors', reportData.inactiveSupervisors || 0, `${((reportData.inactiveSupervisors || 0) / (reportData.totalSupervisors || 1) * 100).toFixed(1)}%`],
      ['On Leave Supervisors', reportData.onLeaveSupervisors || 0, `${((reportData.onLeaveSupervisors || 0) / (reportData.totalSupervisors || 1) * 100).toFixed(1)}%`]
    ];
    
    if (this.hasAutoTable && typeof this.doc.autoTable === 'function') {
      // Use autoTable plugin if available
      this.doc.autoTable({
        startY: this.currentY,
        head: [overviewData[0]],
        body: overviewData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 40, halign: 'center' }
        }
      });
      this.currentY = this.doc.lastAutoTable.finalY + 20;
    } else {
      // Use fallback method
      this.createSimpleTable(overviewData[0], overviewData.slice(1));
    }
  }

  addStatisticsTables(reportData) {
    this.checkPageBreak(80);
    
    // Status Distributions
    if (reportData.internStatusDistribution) {
      this.doc.setFontSize(14);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Intern Status Distribution', 20, this.currentY);
      this.currentY += 10;
      
      const internStatusData = Object.entries(reportData.internStatusDistribution).map(([status, count]) => [
        status, count, `${((count / (reportData.totalInterns || 1)) * 100).toFixed(1)}%`
      ]);
      
      if (this.hasAutoTable && typeof this.doc.autoTable === 'function') {
        this.doc.autoTable({
          startY: this.currentY,
          head: [['Status', 'Count', 'Percentage']],
          body: internStatusData,
          theme: 'striped',
          headStyles: { fillColor: [16, 185, 129] },
          styles: { fontSize: 10 }
        });
        this.currentY = this.doc.lastAutoTable.finalY + 15;
      } else {
        this.createSimpleTable(['Status', 'Count', 'Percentage'], internStatusData);
      }
    }
    
    if (reportData.supervisorStatusDistribution) {
      this.checkPageBreak(50);
      
      this.doc.setFontSize(14);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Supervisor Status Distribution', 20, this.currentY);
      this.currentY += 10;
      
      const supervisorStatusData = Object.entries(reportData.supervisorStatusDistribution).map(([status, count]) => [
        status, count, `${((count / (reportData.totalSupervisors || 1)) * 100).toFixed(1)}%`
      ]);
      
      if (this.hasAutoTable && typeof this.doc.autoTable === 'function') {
        this.doc.autoTable({
          startY: this.currentY,
          head: [['Status', 'Count', 'Percentage']],
          body: supervisorStatusData,
          theme: 'striped',
          headStyles: { fillColor: [139, 92, 246] },
          styles: { fontSize: 10 }
        });
        this.currentY = this.doc.lastAutoTable.finalY + 20;
      } else {
        this.createSimpleTable(['Status', 'Count', 'Percentage'], supervisorStatusData);
      }
    }
  }

  addMonthlyTrends(monthlyRegistrations) {
    this.checkPageBreak(80);
    
    this.doc.setFontSize(14);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Monthly Registration Trends (Last 12 Months)', 20, this.currentY);
    this.currentY += 10;
    
    const monthlyData = Object.entries(monthlyRegistrations).map(([month, count]) => [
      month, count
    ]);
    
    this.doc.autoTable({
      startY: this.currentY,
      head: [['Month', 'Registrations']],
      body: monthlyData,
      theme: 'striped',
      headStyles: { fillColor: [245, 158, 11] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50, halign: 'center' }
      }
    });
    
    this.currentY = this.doc.lastAutoTable.finalY + 20;
  }

  addDistributionTables(reportData) {
    // Specialization Distribution
    if (reportData.specializationDistribution) {
      this.checkPageBreak(60);
      
      this.doc.setFontSize(14);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Specialization Distribution', 20, this.currentY);
      this.currentY += 10;
      
      const specializationData = Object.entries(reportData.specializationDistribution)
        .sort(([,a], [,b]) => b - a)
        .map(([spec, count]) => [spec, count]);
      
      this.doc.autoTable({
        startY: this.currentY,
        head: [['Specialization', 'Count']],
        body: specializationData,
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68] },
        styles: { fontSize: 10 }
      });
      
      this.currentY = this.doc.lastAutoTable.finalY + 15;
    }
    
    // Department Distribution
    if (reportData.departmentDistribution) {
      this.checkPageBreak(60);
      
      this.doc.setFontSize(14);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Department Distribution', 20, this.currentY);
      this.currentY += 10;
      
      const departmentData = Object.entries(reportData.departmentDistribution)
        .sort(([,a], [,b]) => b - a)
        .map(([dept, count]) => [dept, count]);
      
      this.doc.autoTable({
        startY: this.currentY,
        head: [['Department', 'Count']],
        body: departmentData,
        theme: 'striped',
        headStyles: { fillColor: [34, 197, 94] },
        styles: { fontSize: 10 }
      });
      
      this.currentY = this.doc.lastAutoTable.finalY + 20;
    }
  }

  addTopPerformers(topPerformers) {
    this.checkPageBreak(80);
    
    this.doc.setFontSize(14);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Top Performers', 20, this.currentY);
    this.currentY += 10;
    
    const performersData = topPerformers.slice(0, 10).map((performer, index) => [
      index + 1,
      performer.name || 'N/A',
      performer.specialization || 'N/A',
      (performer.performanceScore || 0).toFixed(1),
      (performer.totalHours || 0).toFixed(1),
      `${(performer.attendanceRate || 0).toFixed(1)}%`
    ]);
    
    this.doc.autoTable({
      startY: this.currentY,
      head: [['Rank', 'Name', 'Specialization', 'Score', 'Hours', 'Attendance']],
      body: performersData,
      theme: 'striped',
      headStyles: { fillColor: [251, 191, 36] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 40 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 25, halign: 'center' },
        5: { cellWidth: 30, halign: 'center' }
      }
    });
    
    this.currentY = this.doc.lastAutoTable.finalY + 20;
  }

  addFooter() {
    const pageCount = this.doc.internal.getNumberOfPages();
    const pageWidth = this.doc.internal.pageSize.width;
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(
        `Page ${i} of ${pageCount} | Generated by SLT Intern Management System | ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        this.doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  }

  checkPageBreak(requiredSpace = 40) {
    const pageHeight = this.doc.internal.pageSize.height;
    if (this.currentY + requiredSpace > pageHeight - 30) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  downloadPDF(filename = null) {
    try {
      const finalFilename = filename || this.generateFileName();
      
      // Check if we're in a secure context (HTTPS or localhost)
      const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || 
                              window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1';
      
      if (isSecureContext) {
        // Try using the native save method first
        try {
          this.doc.save(finalFilename);
          console.log('PDF download initiated using jsPDF save method:', finalFilename);
          return true;
        } catch (saveError) {
          console.warn('jsPDF save method failed, trying fallback:', saveError);
        }
      }
      
      // Fallback method using blob and manual download
      const pdfBlob = this.doc.output('blob');
      
      // Check if the browser supports the download attribute
      if ('download' in document.createElement('a')) {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = finalFilename;
        link.style.display = 'none';
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object after a delay
        setTimeout(() => {
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            console.warn('Failed to revoke object URL:', error);
          }
        }, 1000);
        
        console.log('PDF download initiated using blob method:', finalFilename);
        return true;
      } else {
        // Very old browser fallback - open in new window
        const pdfDataUri = this.doc.output('datauristring');
        const newWindow = window.open();
        newWindow.document.write(`
          <html>
            <head><title>Download Report</title></head>
            <body>
              <h3>Your report is ready!</h3>
              <p>Right-click the link below and select "Save link as..." to download:</p>
              <a href="${pdfDataUri}" download="${finalFilename}">Download ${finalFilename}</a>
            </body>
          </html>
        `);
        newWindow.document.close();
        
        console.log('PDF download initiated using data URI method:', finalFilename);
        return true;
      }
    } catch (error) {
      console.error('All PDF download methods failed:', error);
      throw new Error('PDF download failed: ' + error.message);
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

export default AdvancedPDFService;
