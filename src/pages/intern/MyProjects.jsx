import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const MyProjects = () => {
  const navigate = useNavigate();
  const [internData, setInternData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in and try again.");
      setLoading(false);
      return;
    }

    const decodedToken = jwtDecode(token);

    axios
      .get(`http://localhost:8080/intern/getIntern/${decodedToken.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInternData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching intern data:", err);
        setError("Failed to fetch your project data. Please check your internet connection or try again later.");
        setLoading(false);
      });
  }, []);

  const handleCancel = () => {
    navigate("/");
  };

  const getProjectStatusColor = (startDate, targetDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const target = new Date(targetDate);
    
    if (today < start) return "primary";
    if (today > target) return "danger";
    return "success";
  };

  const getProjectStatusText = (startDate, targetDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const target = new Date(targetDate);
    
    if (today < start) return "Upcoming";
    if (today > target) return "Overdue";
    return "In Progress";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-lg text-gray-600" aria-live="polite">
            Loading your projects, please wait...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="w-96 p-6 shadow-lg">
          <CardBody className="text-center">
            <div className="text-red-600 text-6xl mb-4" role="img" aria-label="Warning sign">⚠️</div>
            <h2 className="text-xl font-bold text-red-700 mb-2">Oops! Something Went Wrong</h2>
            <p className="text-gray-600 mb-4" aria-live="polite">{error}</p>
            <Tooltip content="Refresh the page to try again" placement="top">
              <Button color="danger" onClick={() => window.location.reload()} aria-label="Try again">
                Try Again
              </Button>
            </Tooltip>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4db849] to-[#4db849] bg-clip-text text-transparent mb-2" role="heading" aria-level="1">
            My Projects Dashboard
          </h1>
          <p className="text-gray-600">Track and manage your internship projects</p>
        </div>

        {internData && (
          <div className="space-y-8">
            {/* Intern Details Card */}
            <Card className="w-full shadow-lg border-0 bg-gradient-to-r">
              <CardBody className="p-6">
                <div className="flex items-center space-x-6">
                  <Avatar
                    size="lg"
                    name={internData.intern.name}
                    className="text-white bg-gradient-to-r from-[#94a3b8] to-[#94a3b8] text-xl font-bold"
                    aria-label={`Profile picture of ${internData.intern.name}`}
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-slate-500" role="heading" aria-level="2">
                      Welcome, {internData.intern.name}! 👋
                    </h2>
                    <p className="text-slate-500 flex items-center">
                      {/* <span className="mr-2" role="img" aria-label="Email">📧</span> */}
                      {internData.intern.email}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center" role="heading" aria-level="2">
                  Your Projects
                  <Tooltip content="Number of active projects" placement="top">
                    <Chip
                      size="sm"
                      color="success"
                      variant="flat"
                      className="ml-3"
                      aria-label={`${internData.projects ? internData.projects.length : 0} projects`}
                    >
                      {internData.projects ? internData.projects.length : 0} Projects
                    </Chip>
                  </Tooltip>
                </h2>
              </div>

              {internData.projects && internData.projects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {internData.projects.map((project, index) => {
                    const otherTeamMembers = project.interns
                      ? project.interns.filter(intern => intern.internId !== internData.intern.internId)
                      : [];
                    const displayedTeamMembers = otherTeamMembers.slice(0, 6);

                    return (
                      <Card 
                        key={project.projectId} 
                        className="w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start w-full">
                            <div className="flex items-center space-x-2">
                              {/* <div className={`w-3 h-3 rounded-full ${
                                index % 4 === 0 ? 'bg-green-600' :
                                index % 4 === 1 ? 'bg-blue-600' :
                                index % 4 === 2 ? 'bg-teal-600' : 'bg-cyan-600'
                              }`} aria-hidden="true"></div> */}
                              <h3 className="font-bold text-lg text-gray-800 line-clamp-2" role="heading" aria-level="3">
                                {project.projectName}
                              </h3>
                            </div>
                            <Chip
                              size="sm"
                              color={getProjectStatusColor(project.startDate, project.targetDate)}
                              variant="flat"
                              className="ml-2 flex-shrink-0">
                              {getProjectStatusText(project.startDate, project.targetDate)}
                            </Chip>
                          </div>
                        </CardHeader>
                        <CardBody className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              {/* <span className="text-green-600" role="img" aria-label="Group">👥</span> */}
                              <span className="font-medium">Group:</span>
                              <span>{project.groupName}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center space-x-1 text-gray-600">
                                {/* <span className="text-green-600" role="img" aria-label="Calendar">📅</span> */}
                                <span className="font-medium">Start:</span>
                              </div>
                              <span className="text-gray-700">{project.startDate}</span>
                              
                              <div className="flex items-center space-x-1 text-gray-600">
                                {/* <span className="text-blue-600" role="img" aria-label="Target">🎯</span> */}
                                <span className="font-medium">Target:</span>
                              </div>
                              <span className="text-gray-700">{project.targetDate}</span>
                            </div>

                            {project.description && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-start space-x-2 text-sm">
                                  {/* <span className="text-teal-600 mt-0.5" role="img" aria-label="Description">📝</span> */}
                                  <div>
                                    <span className="font-medium text-gray-600">Description:</span>
                                    <p className="text-gray-700 mt-1 line-clamp-3">
                                      {project.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {project.technology && (
                              <div className="flex items-center space-x-2 text-sm">
                                {/* <span className="text-cyan-600" role="img" aria-label="Technology">⚡</span> */}
                                <span className="font-medium text-gray-600">Tech:</span>
                                <Chip size="sm" color="success" variant="flat">
                                  {project.technology}
                                </Chip>
                              </div>
                            )}

                            {displayedTeamMembers.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-start space-x-2 text-sm">
                                  {/* <span className="text-emerald-600 mt-0.5" role="img" aria-label="Team">👥</span> */}
                                  <div>
                                    <span className="font-medium text-gray-600">Team Members:</span>
                                    <div className="flex flex-col gap-2 mt-2">
                                      {displayedTeamMembers.map((member, idx) => (
                                        <Tooltip key={idx} content={member.email} placement="top">
                                          <div className="flex items-center space-x-2 cursor-pointer">
                                            <Avatar
                                              size="sm"
                                              name={member.name}
                                              className="bg-slate-400 text-neutral-50 text-xs"
                                              aria-label={`Profile of ${member.name}`}
                                            />
                                            <span className="text-gray-700">{member.name}</span>
                                          </div>
                                        </Tooltip>
                                      ))}
                                    </div>
                                    {otherTeamMembers.length > 6 && (
                                      <p className="text-gray-500 text-xs mt-1" aria-live="polite">
                                        +{otherTeamMembers.length - 6} more team members
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="w-full shadow-lg border-0 bg-gradient-to-r from-[#e0f2fe]">
                  <CardBody className="p-12 text-center">
                    {/* <div className="text-8xl mb-4 text-green-600" role="img" aria-label="Clipboard">📋</div> */}
                    <h3 className="text-xl font-bold text-gray-600 mb-2" role="heading" aria-level="3">
                      No Projects Yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      You haven't been assigned any projects yet. Check back later!
                    </p>
                    <Tooltip content="Refresh to check for new projects" placement="top">
                      <Button
                        color="primary"
                        variant="flat"
                        onClick={() => window.location.reload()}
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                        aria-label="Refresh page"
                      >
                        Refresh
                      </Button>
                    </Tooltip>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {/* <div className="flex justify-center mt-12">
          <Tooltip content="Return to the main dashboard" placement="top">
            <Button
              color="default"
              variant="bordered"
              size="lg"
              onClick={handleCancel}
              className="hover:bg-green-50 text-green-700 border-green-300"
              aria-label="Back to dashboard"
            >
              ← Back to Dashboard
            </Button>
          </Tooltip>
        </div> */}
      </div>
    </div>
  );
};

export default MyProjects;