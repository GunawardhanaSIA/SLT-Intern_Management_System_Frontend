import {
  Input,
  RadioGroup,
  Select,
  SelectItem,
  Radio,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const superviser = [
  { key: "M.Giri", label: "M. Giridaran" },
  { key: "JaneDoe", label: "Jane Doe" },
  { key: "JohnDoe", label: "John Doe" },
  { key: "ChamaraJayas", label: "C.Jayashinha" },
];

const MyProjects = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeURL, setResumeURL] = useState("");
  const [userID, setUserID] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    setSelectedFile(file);
  };

  const [formData, setFormData] = useState({
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

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload your resume before submitting!");
      return;
    }

    const token = localStorage.getItem("token");
    console.log(token);

    const decodedToken = jwtDecode(token);
    console.log(decodedToken.user_id);
    setUserID(decodedToken.user_id);

    try {
      const fileData = new FormData();
      fileData.append("file", selectedFile);
      fileData.append("upload_preset", "SLTMobitel");
      fileData.append("cloud_name", "dljhk5ajd");
      fileData.append("resource_type", "raw");

      const cloudinaryResp = await fetch(
        "https://api.cloudinary.com/v1_1/dljhk5ajd/raw/upload",
        {
          method: "POST",
          body: fileData,
        }
      );

      const uploadedResumeURL = await cloudinaryResp.json();
      console.log("Uploaded Resume URL:", uploadedResumeURL.url);

      const finalFormData = {
        ...formData,
        user_id: decodedToken.user_id,
        resumeURL: uploadedResumeURL.url,
      };

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
