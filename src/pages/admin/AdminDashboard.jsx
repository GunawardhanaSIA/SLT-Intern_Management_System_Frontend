import React from 'react';
import InternStatusOverview from '../../components/admin/dashboard/InternStatusOverview';
import NewInternRegistrationOverview from '../../components/admin/dashboard/NewInternRegistrationOverview';
import TodayInterviews from '../../components/admin/dashboard/TodayInterviews';

const AdminDashboard = () => {
  return (
    <div className="mx-6 my-2">
      <div className="flex gap-4 w-full">
        <div className="w-7/12">
          <NewInternRegistrationOverview/>
        </div>
        <div className="w-5/12">
          <InternStatusOverview/>
        </div>
      </div>
      <div className='my-8'>
        <TodayInterviews/>
      </div>
    </div>
  );
};

export default AdminDashboard;
