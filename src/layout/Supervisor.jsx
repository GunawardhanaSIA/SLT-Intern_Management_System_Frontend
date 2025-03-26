import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaLaptopCode } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { FaRegCalendarCheck } from "react-icons/fa";
import SupervisorSidebar, {SupervisorSidebarItem} from '../components/supervisor/SupervisorSidebar';
import SupervisorNavbar from '../components/supervisor/SupervisorNavbar';

const Supervisor = () => {
  const location = useLocation();
  const [navbarTitle, setNavbarTitle] = useState('Projects');

  const sidebarItems = [
    { path: '/supervisor', title: 'Projects', icon: <FaLaptopCode /> },
    { path: '/supervisor/attendance', title: 'Attendance', icon: <FaRegCalendarCheck /> },
    { path: '/supervisor/my-interns', title: 'My Interns', icon: <HiUserGroup /> },
  ];

  const handleSidebarItemClick = (title) => {
    setNavbarTitle(title);
  };

  return (
    <div className="flex h-screen">
      <div className='h-full fixed top-0 left-0'>
        <SupervisorSidebar>
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleSidebarItemClick(item.title)}
            >
              <SupervisorSidebarItem
                icon={item.icon} // Pass the icon directly as it's already a React Icon component
                text={item.title}
                active={location.pathname === item.path || (item.path === '/supervisor' && location.pathname === '/supervisor')}
                alert={item.alert || false}
              />
            </Link>
          ))}
        </SupervisorSidebar>
      </div>
      <div className="flex-1  lg:ml-72">
        <SupervisorNavbar title={navbarTitle} />
        <Outlet />
      </div>
    </div>
  )
}
export default Supervisor