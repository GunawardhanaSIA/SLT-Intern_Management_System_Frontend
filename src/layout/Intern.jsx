import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaLaptopCode } from "react-icons/fa6";
import { GrCertificate } from "react-icons/gr";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FiFilePlus } from "react-icons/fi";
import InternSidebar, {InternSidebarItem} from '../components/intern/InternSidebar';
import InternNavbar from '../components/intern/InternNavbar';

const Intern = () => {
  const location = useLocation();
  const [navbarTitle, setNavbarTitle] = useState('Apply for Internships');

  const sidebarItems = [
    { path: '/intern', title: 'Apply for Internships', icon: <FiFilePlus /> },
    { path: '/intern/my-projects', title: 'My Projects', icon: <FaLaptopCode />, alert: true },
    { path: '/admin/apply-for-certificate', title: 'Apply for Certificate', icon: <GrCertificate /> },
    { path: '/admin/attendance', title: 'Attendance', icon: <FaRegCalendarCheck /> },
  ];

  const handleSidebarItemClick = (title) => {
    setNavbarTitle(title);
  };

  return (
    <div className="flex h-screen">
      <div className='h-full fixed top-0 left-0'>
        <InternSidebar>
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleSidebarItemClick(item.title)}
            >
              <InternSidebarItem
                icon={item.icon} // Pass the icon directly as it's already a React Icon component
                text={item.title}
                active={location.pathname === item.path || (item.path === '/intern' && location.pathname === '/intern')}
                alert={item.alert || false}
              />
            </Link>
          ))}
        </InternSidebar>
      </div>
      <div className="flex-1  lg:ml-72">
        <InternNavbar title={navbarTitle} />
        <Outlet />
      </div>
    </div>
  )
}

export default Intern