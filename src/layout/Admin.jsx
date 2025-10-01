import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import AdminSidebar, {
  AdminSidebarItem,
} from "../components/admin/AdminSidebar";
import { MdDashboard, MdPersonAddAlt1 } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";
import { FaUserTie } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import AdminNavbar from "../components/admin/AdminNavbar";
import { getToken } from "../pages/authentication/Auth";
import axios from "axios";
import API_BASE_URL from "../config/api";
import axios from "axios";

const Admin = () => {
  const location = useLocation();
  const [navbarTitle, setNavbarTitle] = useState("Dashboard");
  const [hasNewApplications, setHasNewApplications] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSidebarExpandChange = (expanded) => {
    setSidebarExpanded(expanded);
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      axios
        .get(`${API_BASE_URL}/admin/applicants`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const applicants = response.data;
          console.log("All applicants: ", applicants);
          const hasPending = applicants.some(
            (applicant) => applicant.state === 0
          );
          setHasNewApplications(hasPending);
        })
        .catch((error) => {
          console.error("Error fetching applicants data:", error);
        });
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const sidebarItems = [
    { path: "/admin", title: "Dashboard", icon: <MdDashboard /> },
    {
      path: "/admin/new-applications",
      title: "New Applications",
      icon: <MdPersonAddAlt1 />,
      alert: hasNewApplications,
    },
    {
      path: "/admin/upcoming-interviews",
      title: "Upcoming Interviews",
      icon: <FaCalendarCheck />,
    },
    {
      path: "/admin/manage-interns",
      title: "Manage Interns",
      icon: <HiUserGroup />,
    },
    {
      path: "/admin/manage-supervisors",
      title: "Manage Supervisors",
      icon: <FaUserTie />,
    },
    { path: "/admin/reports", title: "Reports", icon: <IoDocuments /> },
  ];

  const handleSidebarItemClick = (title) => {
    setNavbarTitle(title);
  };

  return (
    <div className="flex h-screen">
      <div>
        <AdminSidebar onExpandChange={handleSidebarExpandChange}>
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
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarExpanded ? "lg:ml-72" : "lg:ml-20"
        }`}
      >
        <AdminNavbar title={navbarTitle} />
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
