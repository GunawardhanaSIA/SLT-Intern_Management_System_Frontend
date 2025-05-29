import { Input, RadioGroup, Select, SelectItem, Radio, Button, Card, CardHeader, CardBody } from "@nextui-org/react";
import React, {useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.js",
  import.meta.url
).toString();

export const educationalInstitute = [
    { key: "University of Colombo", label: "University of Colombo" },
    { key: "IIT", label: "IIT" },
    { key: "NIBM", label: "NIBM" },
    { key: "SLIIT", label: "SLIIT" },
    { key: "other", label: "Other" },
];

export const programmingLang = [
    { key: "Java", label: "Java" },
    { key: "Python", label: "Python" },
    { key: "PHP", label: "PHP" },
    { key: "C#", label: "C#" },
    { key: "MERN", label: "MERN" },
];

export const academicYear = [
    { key: "1", label: "1st Year" },
    { key: "2", label: "2nd Year" },
    { key: "3", label: "3rd Year" },
    { key: "4", label: "4th Year" },
];

export const specialization = [
    { key: "QA", label: "QA" },
    { key: "Fullstack", label: "FullStack" },
    { key: "Cloud", label: "Cloud" },
    { key: "UI/UX", label: "UI/UX" },
];


const InternDashboard = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [resumeURL, setResumeURL] = useState("");
    const [selectedInstitute, setSelectedInstitute] = useState("");
    const [resumeText, setResumeText] = useState("")
    const formRef = useRef(null)

    // const handleFileChange = async (event) => {
    //     const file = event.target.files[0];
    //     console.log(file);
    //     setSelectedFile(file); 
    // };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = async function() {
                const typedArray = new Uint8Array(this.result);

                const pdf = await pdfjsLib.getDocument({data:typedArray}).promise;
                let allText = "";

                for(let i=1; i<=pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map(item => item.str)
                    const joinedText = strings.join(" ");
                    // const cleanedText = joinedText.replace(/[^a-zA-Z ]/g, ""); 

                    allText += joinedText + " ";
                }
                setResumeText(allText)
            }
            reader.readAsArrayBuffer(file)
        }
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
        specialization: "",
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

        console.log("Extracted Resume Text:", resumeText);
        
        const token = localStorage.getItem("token");
        console.log(token)

        try {
            const fileData = new FormData()
            fileData.append("resume", selectedFile)

            const resumeResponse = await axios.post("http://localhost:8080/intern/apply/resumeUpload", fileData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const resumeResponsedata = resumeResponse.data;
            const resumeURL = resumeResponsedata.uri
            console.log("File uploaded to: ", resumeURL);

            const finalFormData = {
                ...formData,
                resumeURL: resumeURL,
                resumeText: resumeText
            };
    

            console.log("Final Form Data:", finalFormData);

            const response = await axios.post(
              "http://localhost:8080/intern/apply", 
              finalFormData,
              {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
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
                specialization: "",
                programmingLanguages: "",
                resumeURL: "",
            });
            setSelectedFile(null);
            setResumeURL("");
        } catch (error) {
        console.error("Error submitting form:", error.response?.data || error.message);
        alert("Failed to submit the application. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    

  return (
    <div className="py-10 flex flex-col items-center">
      <Card className="w-2/3 p-8">
        <CardHeader className="flex justify-center mb-4">
          <h1 className="text-2xl font-semibold text-green">Apply for your internship with SLTMobitel - Digital Platforms</h1>
        </CardHeader>
        <CardBody>
            <ol className="list-decimal pl-4 text-sm text-gray-500 space-y-1 mb-12">
                <li>Complete all fields in the application form accurately before submitting.</li>
                <li>If selected, you will receive an email with further instructions and details about the process.</li>
                <li>The email will include a date for an in-person meeting. On that day, bring all required documents listed below.</li>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>National Identity Card (NIC) Copy</li>
                        <li>Police Report</li>
                        <li>Letter from the University Confirming the Eligibility to Undertake the Internship</li>
                    </ul>
            </ol>
          <div className="flex flex-col gap-y-8 md:container md:mx-auto">
            {/* Personal information Fields */}
                <Input
                    label={
                        <span>
                        1. Name<span className="text-red"> *</span>
                        </span>
                    }
                    labelPlacement="outside"
                    placeholder="Enter name"
                    type="text"
                    variant="bordered"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
                <Input
                    label={
                        <span>
                        2. NIC Number<span className="text-red"> *</span>
                        </span>
                    }
                    labelPlacement="outside"
                    placeholder="Enter NIC number"
                    type="text"
                    variant="bordered"
                    value={formData.nic}
                    onChange={(e) => handleChange("nic", e.target.value)}
                />
                <Input
                    label={
                        <span>
                        3. Mobile Number<span className="text-red"> *</span>
                        </span>
                    }
                    labelPlacement="outside"
                    placeholder="Enter mobile number"
                    variant="bordered"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleChange("mobileNumber", e.target.value)}
                />
                <Input
                    label={
                        <span>
                        4. Email Address<span className="text-red"> *</span>
                        </span>
                    }
                    labelPlacement="outside"
                    placeholder="Enter email address"
                    type="text"
                    variant="bordered"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)} 
                />
                <Input
                    label={
                        <span>
                        5. Home Address<span className="text-red"> *</span>
                        </span>
                    }
                    labelPlacement="outside"
                    placeholder="Enter address/city"
                    variant="bordered"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)} 
                />
            
            {/* educational information firelds */}
                <div className="flex w-full flex-wrap mt-12 md:flex-nowrap md:mb-0 gap-6">
                    <Select
                        disableSelectorIconRotation
                        label={
                        <span>
                            6. Educational Institute<span className="text-red"> *</span>
                        </span>
                        }
                        labelPlacement="outside"
                        placeholder="Select the educational institute"
                        variant="bordered"
                        value={formData.educationalInstitute}
                        onChange={(e) => {
                            handleChange("educationalInstitute", e.target.value);
                            setSelectedInstitute(e.target.value); 
                        }}
                    >
                        {educationalInstitute.map((item) => (
                        <SelectItem key={item.key} value={item.key}>
                            {item.label}
                        </SelectItem>
                        ))}
                    </Select>
                    <Input
                        label={<span>Other</span>}
                        labelPlacement="outside"
                        placeholder="Enter educational institute"
                        variant="bordered"
                        isDisabled={selectedInstitute !== "other"} 
                        onChange={(e) => handleChange("educationalInstitute", e.target.value)}
                    />
                </div>

                <Input
                    label={
                        <span>
                        7. Degree/Course<span className="text-red"> *</span>
                        </span>
                    }
                    labelPlacement="outside"
                    placeholder="Enter degree/course"
                    variant="bordered"
                    value={formData.degree}
                    onChange={(e) => handleChange("degree", e.target.value)}
                />
                
                <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 gap-6">
                    <Select
                        disableSelectorIconRotation
                        label={
                        <span>
                            8. Current Academic Year<span className="text-red"> *</span>
                        </span>
                        }
                        labelPlacement="outside"
                        placeholder="Select the current academic year"
                        variant="bordered"
                        value={formData.academicYear}
                        onChange={(e) => handleChange("academicYear", e.target.value)}
                    >
                        {academicYear.map((item) => (
                        <SelectItem key={item.key} value={item.key}>
                            {item.label}
                        </SelectItem>
                        ))}
                    </Select>
                    <Input
                        label={
                            <span>
                            9. Internship Period(In Months)<span className="text-red"> *</span>
                            </span>
                        }
                        labelPlacement="outside"
                        placeholder="Enter internship period"
                        variant="bordered"
                        value={formData.internshipPeriod}
                        onChange={(e) => handleChange("internshipPeriod", e.target.value)}
                    />
                </div>

            {/* field of specialization */}
                <div className="flex w-full flex-wrap mt-12 md:flex-nowrap md:mb-0 gap-6">
                    <Select
                        className="w-1/2"
                        disableSelectorIconRotation
                        label={
                        <span>
                            10. Field of Specialization<span className="text-red"> *</span>
                        </span>
                        }
                        labelPlacement="outside"
                        placeholder="Select the field of specialization"
                        variant="bordered"
                        value={formData.specialization}
                        onChange={(e) => handleChange("specialization", e.target.value)}
                    >
                        {specialization.map((item) => (
                        <SelectItem key={item.key} value={item.key}>
                            {item.label}
                        </SelectItem>
                        ))}
                    </Select>
                    <Select
                        className="w-1/2"
                        disableSelectorIconRotation
                        selectionMode="multiple"
                        label={
                        <span>
                            10. Programming Languages<span className="text-red"> *</span>
                        </span>
                        }
                        labelPlacement="outside"
                        placeholder="Select the languages you are familiar with"
                        variant="bordered"
                        value={formData.programmingLanguages}
                        onChange={(e) => handleChange("programmingLanguages", e.target.value)}
                    >
                        {programmingLang.map((item) => (
                        <SelectItem key={item.key} value={item.key}>
                            {item.label}
                        </SelectItem>
                        ))}
                    </Select>
                </div>

            {/* resume upload */}
                <div className="flex flex-col gap-4 mt-12">
                    <label htmlFor="file-upload" className="flex flex-col text-sm">
                        <span className="flex items-center">
                            12. Upload Resume (Max Size: 1MB)<span className="text-red ml-1">*</span>
                        </span>
                        {/* <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        /> */}
                    </label>

                    <div className="flex gap-2 items-center">
                        <input type="file" class="file-input w-full file-input-sm file-input-blue max-w-xs" onChange={handleFileChange} />

                        {/* {selectedFile && (
                            <p className="text-sm text-gray-500">
                            </p>
                        )} */}
                        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                        {resumeURL && (
                            <p className="text-sm text-gray-500">
                                Resume Uploaded: <a href={resumeURL} target="_blank" className="text-blue-500">View</a>
                            </p>
                        )}
                    </div>  
                </div>

            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 mt-8">
              <Button className="font-bold text-white bg-green w-1/2" onPress={handleSubmit} disabled={uploading}>
                Submit Application
              </Button>
              <Button color="default" variant="bordered" className="text-gray-400 font-bold w-1/2" onPress={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default InternDashboard