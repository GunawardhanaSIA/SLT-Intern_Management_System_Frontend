import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Save, Calendar, Briefcase, Clock, Target, FileText, ArrowLeft, Edit3 } from 'lucide-react';

const InternDailyRecords = () => {
  const [currentView, setCurrentView] = useState('add');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workRecords, setWorkRecords] = useState({});
  const [currentRecord, setCurrentRecord] = useState({
    tasks: '',
    hoursWorked: '',
    department: 'general',
    supervisor: '',
    achievements: '',
    challenges: '',
    learnings: '',
    status: 'completed'
  });

  const departments = ['general', 'marketing', 'engineering', 'hr', 'finance', 'operations', 'design', 'sales'];
  const statusOptions = ['completed', 'in-progress', 'pending', 'on-hold'];

  // Get calendar data
  const getCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    
    const dateKey = formatDateKey(clickedDate);
    const existingRecord = workRecords[dateKey];
    
    if (existingRecord) {
      setCurrentRecord(existingRecord);
    } else {
      setCurrentRecord({
        tasks: '',
        hoursWorked: '',
        department: 'general',
        supervisor: '',
        achievements: '',
        challenges: '',
        learnings: '',
        status: 'completed'
      });
    }
    
    setCurrentView('add');
  };

  const handleSaveRecord = () => {
    if (!currentRecord.tasks.trim() || !currentRecord.hoursWorked) return;
    
    const dateKey = formatDateKey(selectedDate);
    setWorkRecords(prev => ({
      ...prev,
      [dateKey]: {
        ...currentRecord,
        date: selectedDate.toISOString()
      }
    }));
    
    // Switch to calendar view after saving
    setCurrentView('calendar');
    
    // Reset form for next entry
    setCurrentRecord({
      tasks: '',
      hoursWorked: '',
      department: 'general',
      supervisor: '',
      achievements: '',
      challenges: '',
      learnings: '',
      status: 'completed'
    });
    
    // Set selected date to tomorrow for next entry
    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);
  };

  const hasRecord = (day) => {
    if (!day) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(date);
    return workRecords[dateKey];
  };

  const getRecordPreview = (day) => {
    if (!day) return null;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(date);
    return workRecords[dateKey];
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-200 text-green-800',
      'in-progress': 'bg-[#BFDBFE] text-blue-800',
      pending: 'bg-yellow-200 text-yellow-800',
      'on-hold': 'bg-red-200 text-red-800'
    };
    return colors[status] || colors.completed;
  };

  const getDepartmentColor = (department) => {
    const colors = {
      marketing: 'bg-purple-100 border-purple-300',
      engineering: 'bg-[#DBEAFE] border-blue-300',
      hr: 'bg-green-100 border-green-300',
      finance: 'bg-yellow-100 border-yellow-300',
      operations: 'bg-orange-100 border-orange-300',
      design: 'bg-pink-100 border-pink-300',
      sales: 'bg-red-100 border-red-300',
      general: 'bg-[#F3F4F6] border-[#D1D5DB]'
    };
    return colors[department] || colors.general;
  };

  const getTotalHours = () => {
    return Object.values(workRecords).reduce((total, record) => {
      return total + (parseFloat(record.hoursWorked) || 0);
    }, 0);
  };

  const getMonthlyHours = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return Object.entries(workRecords).reduce((total, [dateKey, record]) => {
      const recordDate = new Date(record.date);
      if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
        return total + (parseFloat(record.hoursWorked) || 0);
      }
      return total;
    }, 0);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Add Record View
  const renderAddRecordView = () => (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#4db849] flex items-center gap-2">
            {/* <Plus className="text-[#2563EB]" /> */}
            Add Daily Work Record
          </h1>
          {Object.keys(workRecords).length > 0 && (
            <button
              onClick={() => setCurrentView('calendar')}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors"
            >
              <Calendar size={16} />
              View Calendar
            </button>
          )}
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Clock className="text-[#2563EB]" size={20} />
              <span className="text-sm font-medium text-[#4B5563]">Total Hours</span>
            </div>
            <p className="text-2xl font-bold text-[#1F2937]">{getTotalHours().toFixed(1)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Target className="text-[#16A34A]" size={20} />
              <span className="text-sm font-medium text-[#4B5563]">This Month</span>
            </div>
            <p className="text-2xl font-bold text-[#1F2937]">{getMonthlyHours().toFixed(1)} hrs</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <FileText className="text-[#7C3AED]" size={20} />
              <span className="text-sm font-medium text-[#4B5563]">Work Days</span>
            </div>
            <p className="text-2xl font-bold text-[#1F2937]">{Object.keys(workRecords).length}</p>
          </div>
        </div>
      </div>

      {/* Add Record Form */}
      <div className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#1F2937] mb-2">
            Work Record for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-sm px-3 py-1 bg-[#DBEAFE] text-[#1D4ED8] rounded-lg hover:bg-[#BFDBFE] transition-colors"
            >
              Today
            </button>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="text-sm px-3 py-1 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Hours Worked *
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={currentRecord.hoursWorked}
              onChange={(e) => setCurrentRecord(prev => ({ ...prev, hoursWorked: e.target.value }))}
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-lg"
              placeholder="8.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Department
            </label>
            <select
              value={currentRecord.department}
              onChange={(e) => setCurrentRecord(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-lg"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Supervisor
            </label>
            <input
              type="text"
              value={currentRecord.supervisor}
              onChange={(e) => setCurrentRecord(prev => ({ ...prev, supervisor: e.target.value }))}
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-lg"
              placeholder="Enter supervisor name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Status
            </label>
            <select
              value={currentRecord.status}
              onChange={(e) => setCurrentRecord(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-lg"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Tasks Completed *
            </label>
            <textarea
              value={currentRecord.tasks}
              onChange={(e) => setCurrentRecord(prev => ({ ...prev, tasks: e.target.value }))}
              rows="4"
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-lg resize-none"
              placeholder="Describe the tasks you worked on today..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Key Achievements
            </label>
            <textarea
              value={currentRecord.achievements}
              onChange={(e) => setCurrentRecord(prev => ({ ...prev, achievements: e.target.value }))}
              rows="3"
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-lg resize-none"
              placeholder="What did you accomplish today?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Challenges Faced
            </label>
            <textarea
              value={currentRecord.challenges}
              onChange={(e) => setCurrentRecord(prev => ({ ...prev, challenges: e.target.value }))}
              rows="3"
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-lg resize-none"
              placeholder="Any obstacles or difficulties encountered?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Learning & Development
            </label>
            <textarea
              value={currentRecord.learnings}
              onChange={(e) => setCurrentRecord(prev => ({ ...prev, learnings: e.target.value }))}
              rows="3"
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-lg resize-none"
              placeholder="What new skills or knowledge did you gain?"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSaveRecord}
            disabled={!currentRecord.tasks.trim() || !currentRecord.hoursWorked}
            className="w-full bg-[#2563EB] text-white py-4 px-6 rounded-lg hover:bg-[#1D4ED8] disabled:bg-[#9CA3AF] disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-lg font-medium"
          >
            <Save size={20} />
            Save Work Record & View Calendar
          </button>
        </div>
      </div>
    </div>
  );

  // Calendar View
  const renderCalendarView = () => (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#1F2937] flex items-center gap-2">
            <Calendar className="text-[#2563EB]" />
            Work Records Calendar
          </h1>
          <button
            onClick={() => setCurrentView('add')}
            className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] text-white rounded-lg hover:bg-[#15803D] transition-colors"
          >
            <Plus size={16} />
            Add New Record
          </button>
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Clock className="text-[#2563EB]" size={20} />
              <span className="text-sm font-medium text-[#4B5563]">Total Hours</span>
            </div>
            <p className="text-2xl font-bold text-[#1F2937]">{getTotalHours().toFixed(1)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Target className="text-[#16A34A]" size={20} />
              <span className="text-sm font-medium text-[#4B5563]">This Month</span>
            </div>
            <p className="text-2xl font-bold text-[#1F2937]">{getMonthlyHours().toFixed(1)} hrs</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <FileText className="text-[#7C3AED]" size={20} />
              <span className="text-sm font-medium text-[#4B5563]">Work Days</span>
            </div>
            <p className="text-2xl font-bold text-[#1F2937]">{Object.keys(workRecords).length}</p>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-[#4B5563] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {getCalendarData().map((day, index) => {
              const record = getRecordPreview(day);
              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`
                    h-28 border rounded-lg cursor-pointer transition-all duration-200 relative
                    ${day ? 'hover:shadow-md hover:scale-105' : 'cursor-default'}
                    ${hasRecord(day) 
                      ? `${getDepartmentColor(record?.department)} border-2` 
                      : 'bg-gray-50 border-[#E5E7EB] hover:bg-[#F3F4F6]'
                    }
                  `}
                >
                  {day && (
                    <>
                      <div className="p-2">
                        <span className={`text-sm font-medium ${hasRecord(day) ? 'text-[#1F2937]' : 'text-[#4B5563]'}`}>
                          {day}
                        </span>
                        {hasRecord(day) && (
                          <div className="mt-1 space-y-1">
                            <div className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor(record.status)}`}>
                              {record.status}
                            </div>
                            <div className="text-xs text-[#4B5563] font-medium">
                              {record.hoursWorked}h
                            </div>
                          </div>
                        )}
                      </div>
                      {hasRecord(day) && (
                        <div className="absolute top-1 right-1">
                          <Edit3 size={12} className="text-[#4B5563]" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Work Records */}
      <div className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#1F2937] flex items-center gap-2">
          <FileText size={20} />
          Recent Work Records
        </h3>
        {Object.keys(workRecords).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#4B5563] mb-4">No work records yet.</p>
            <button
              onClick={() => setCurrentView('add')}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors"
            >
              Add Your First Record
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(workRecords)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .slice(0, 5)
              .map(([dateKey, record]) => (
                <div key={dateKey} className={`p-4 rounded-lg border-2 ${getDepartmentColor(record.department)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-[#1F2937]">
                        {new Date(record.date).toLocaleDateString()} - {record.department.toUpperCase()}
                      </h4>
                      <p className="text-sm text-[#4B5563]">
                        {record.hoursWorked} hours • {record.supervisor && `Supervisor: ${record.supervisor}`}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#374151] mb-2">
                    <strong>Tasks:</strong> {record.tasks}
                  </p>
                  {record.achievements && (
                    <p className="text-sm text-[#374151] mb-1">
                      <strong>Achievements:</strong> {record.achievements}
                    </p>
                  )}
                  {record.learnings && (
                    <p className="text-sm text-[#374151]">
                      <strong>Learning:</strong> {record.learnings}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  return currentView === 'add' ? renderAddRecordView() : renderCalendarView();
};

export default InternDailyRecords;

