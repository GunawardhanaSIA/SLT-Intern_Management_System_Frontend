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


      console.log("Final Form Data:", finalFormData);

      const response = await axios.post(
        "http://localhost:8080/intern/apply",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Form submitted successfully:", response.data);
      alert("Application submitted successfully!");
      setFormData({
        name: "",
        nic: "",
        mobileNumber: "",
        email: "",
        address: "",
        educationalInstitute: "",
        degree: "",
        academicYear: "",
        internshipPeriod: "",
        superviser: "",
        programmingLanguages: "",
        resumeURL: "",
      });
      setSelectedFile(null);
      setResumeURL("");
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      alert("Failed to submit the application. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="py-10 flex flex-col items-center">
      <Card className="w-2/3 p-8">
        <CardHeader className="flex justify-center mb-4">
          <h1 className="text-2xl font-semibold text-green">Add a Project</h1>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-y-8 md:container md:mx-auto">
            {/* Personal information Fields */}
            <Input
              label={
                <span>
                  1. Project Name<span className="text-red"> *</span>
                </span>
              }
              labelPlacement="outside"
              placeholder="Enter the project name"
              type="text"
              variant="bordered"
              //onChange={(e) => handleChange("name", e.target.value)}
            />
            {/* Superviser */}
            <Select
              className="w-2/3"
              disableSelectorIconRotation
              label={
                <span>
                  2. Superviser<span className="text-red"> *</span>
                </span>
              }
              labelPlacement="outside"
              placeholder="Select the field of specialization"
              variant="bordered"
              onChange={(e) => handleChange("superviser", e.target.value)}
            >
              {superviser.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              ))}
            </Select>

            {/* Start date and end date */}
            <div className="flex w-full flex-wrap mt-3 md:flex-nowrap md:mb-0 gap-6">
                
              <Input
                label={
                  <span>
                    3. Start date<span className="text-red"> *</span>
                  </span>
                }
                labelPlacement="outside"
                placeholder="Enter start date"
                variant="bordered"
                onChange={(e) => handleChange("address", e.target.value)}
              />
              <Input
                label={
                  <span>
                    4. End date<span className="text-red"> *</span>
                  </span>
                }
                labelPlacement="outside"
                placeholder="Enter end date"
                variant="bordered"
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <Input
              label={
                <span>
                  5. Group number<span className="text-red"> *</span>
                </span>
              }
              labelPlacement="outside"
              placeholder="Enter NIC number"
              type="text"
              variant="bordered"
              //onChange={(e) => handleChange("nic", e.target.value)}
            />
        {/* Other team members */}
            <Input
              label={
                <span>
                  6. Other team menber<span className="text-red"> *</span>
                </span>
              }
              labelPlacement="outside"
              placeholder="Enter other team members"
              variant="bordered"
              type="tel"
              onChange={(e) => handleChange("mobileNumber", e.target.value)}
            />
        {/* Add daily records */}
            <div className="flex w-full flex-wrap mt-3 md:flex-nowrap md:mb-0 gap-6">
            <span className="text-gray-400 font-bold w-1/2">Add Daily record</span>
              <Button
                className="font-bold text-white bg-green w-1/2"
                //onPress={handleSubmit}
              >
                add record
              </Button>
              <Button
                color="default"
                variant="bordered"
                className="text-gray-400 font-bold w-1/2"
                //onPress={handleCancel}
              >
                history
              </Button>
              
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MyProjects;
