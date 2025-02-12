import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AdminSidebar, { AdminSidebarItem } from '../components/admin/AdminSidebar';
import { MdDashboard, MdPersonAddAlt1 } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";
import { FaUserTie } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import AdminNavbar from '../components/admin/AdminNavbar';

const Admin = () => {
  const location = useLocation();
  const [navbarTitle, setNavbarTitle] = useState('Dashboard');

  const sidebarItems = [
    { path: '/admin', title: 'Dashboard', icon: <MdDashboard /> },
    { path: '/admin/new-applications', title: 'New Applications', icon: <MdPersonAddAlt1 />, alert: true },
    { path: '/admin/upcoming-interviews', title: 'Upcoming Interviews', icon: <FaCalendarCheck /> },
    { path: '/admin/manage-interns', title: 'Manage Interns', icon: <HiUserGroup /> },
    { path: '/admin/manage-supervisors', title: 'Manage Supervisors', icon: <FaUserTie /> },
    { path: '/admin/reports', title: 'Reports', icon: <IoDocuments /> },
  ];

  const handleSidebarItemClick = (title) => {
    setNavbarTitle(title);
  };

  return (
    <div className="flex h-screen">
      <div>
        <AdminSidebar>
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleSidebarItemClick(item.title)}
            >
              <AdminSidebarItem
                icon={item.icon} // Pass the icon directly as it's already a React Icon component
                text={item.title}
                active={location.pathname === item.path}
                alert={item.alert || false}
              />
            </Link>
          ))}
        </AdminSidebar>
      </div>
      <div className="flex-1">
        <AdminNavbar title={navbarTitle} />
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
