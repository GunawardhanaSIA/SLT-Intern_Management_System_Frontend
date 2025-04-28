import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import { FaLaptopCode } from "react-icons/fa6";
import { GrCertificate } from "react-icons/gr";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FiFilePlus } from "react-icons/fi";
import InternSidebar, { InternSidebarItem } from '../components/intern/InternSidebar';
import InternNavbar from '../components/intern/InternNavbar';
import { getToken } from '../pages/authentication/Auth';

const Intern = () => {
  const location = useLocation();
  const [navbarTitle, setNavbarTitle] = useState('Apply for Internships');
  const [intern, setIntern] = useState(null);

  useEffect(() => {
    const token = getToken(); 
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub; 
      const userID = decodedToken.user_id      ; 

      console.log("Decoded Username:", decodedToken);

      axios.get(`http://localhost:8080/intern/getIntern/${userID}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log("Intern Data:", response.data);
        setIntern(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching intern data:", error);
        setIntern(null); 
      });

    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const sidebarItems = [
    { path: '/intern', title: 'Apply for Internships', icon: <FiFilePlus />, alwaysEnabled: true },
    { path: '/intern/my-projects', title: 'My Projects', icon: <FaLaptopCode />, alert: true },
    // { path: '/admin/apply-for-certificate', title: 'Apply for Certificate', icon: <GrCertificate /> },
    { path: '/admin/attendance', title: 'Attendance', icon: <FaRegCalendarCheck /> },
    // { path: '/intern/daily-updates', title: 'Daily updates', icon: <FaRegCalendarCheck /> },
  ];

  const handleSidebarItemClick = (title) => {
    setNavbarTitle(title);
  };

  return (
    <div className="flex h-screen">
      <div className="h-full fixed top-0 left-0">
        <InternSidebar>
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={intern || item.alwaysEnabled ? item.path : "#"}
              onClick={() => (intern || item.alwaysEnabled ? handleSidebarItemClick(item.title) : null)}
              className={intern || item.alwaysEnabled ? "" : "pointer-events-none opacity-50"} // Disable if intern is null
            >
              <InternSidebarItem
                icon={item.icon}
                text={item.title}
                active={location.pathname === item.path || (item.path === "/intern" && location.pathname === "/intern")}
                alert={item.alert || false}
              />
            </Link>
          ))}
        </InternSidebar>
      </div>
      <div className="flex-1 lg:ml-72">
        <InternNavbar title={navbarTitle} />
        <Outlet />
      </div>
    </div>
  );
};


export default Intern;
