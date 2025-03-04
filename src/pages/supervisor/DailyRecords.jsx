import React from 'react';
import InternSidebar from '../../components/intern/InternSidebar';
import InternNavbar from '../../components/intern/InternNavbar';

const DailyRecords = () => {
  const records = [
    { id: 1, internId: 'INT001', project: 'Project A', record: 'Completed task 1' },
    { id: 2, internId: 'INT002', project: 'Project B', record: 'Started module 3' },
  ];

  return (
    <div className="flex h-screen">
      <InternSidebar />
      <div className="flex-1 lg:ml-72">
        <InternNavbar title="Daily Records" />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Daily Records</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Record ID</th>
                  <th className="border p-2">Intern ID</th>
                  <th className="border p-2">Project</th>
                  <th className="border p-2">Record</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="text-center">
                    <td className="border p-2">{record.id}</td>
                    <td className="border p-2">{record.internId}</td>
                    <td className="border p-2">{record.project}</td>
                    <td className="border p-2">{record.record}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRecords;
