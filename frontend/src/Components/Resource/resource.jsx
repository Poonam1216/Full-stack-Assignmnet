import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Resource/resource.css'

function StaffingSystem() {
  const [resources, setResources] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [technologies, setTechnologies] = useState([
    'Nodejs',
    'React',
    'Angular',
    'React Native',
    'Typescript'
  ]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [fullName, setFullName] = useState('');
  const [resume, setResume] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");




  useEffect(() => {
    fetch('http://localhost:3001/api/vendors')
      .then((res) => res.json())
      .then((data) => {
        setVendors(data.vendorlist);
        setSelectedVendor(data.vendorlist[0].name);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/resources')
      .then((res) => res.json())
      .then((data) => {
        setResources(data.resourcelist);
      });
  }, []);

  function handleDownload(filename) {
    axios({
      url: `/uploads/${filename}`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    });
  }


  const handleVendorSelect = (event) => {
    setSelectedVendor(event.target.value);
  };

  const handleTechnologySelect = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedTechnologies([...selectedTechnologies, value]);
    } else {
      setSelectedTechnologies(selectedTechnologies.filter((t) => t !== value));
    }
  };

  const handleFileSelect = (event) => {
    setResume(event.target.files[0]);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', fullName);
    formData.append('vendor', selectedVendor);
    formData.append('resume', resume);
    formData.append('technologies', selectedTechnologies);

    try {
      const response = await fetch("http://localhost:3001/api/resources", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setSuccessMessage(data.message);
      setFullName('');
      setSelectedVendor('');
      setResume(null);
      setSelectedTechnologies([]);
      // fetchResources();
    } catch (error) {
      setErrorMessage("Failed to create resource");
    }
    };

    useEffect(() => {
      fetch('http://localhost:3001/api/vendors').then(res => {
        return res.json();
      }).then(data => {
        setVendors(data.vendors);
      });
      fetch('http://localhost:3001/api/resources').then(res=>{
              return res.json()
            }).then(data=>{
              setResources(data.resourcelist);
            // console.log(data);
            
          }).catch(error => console.error(error));;
    }, []);

  console.log(vendors, resources);
  const handleVendorSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/vendors', {
        name: selectedVendor,
      });
      setVendors([...vendors, response.data]);
      setSelectedVendor('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
    <div>
      <div id='heading'><h1>Enter Vendor Details</h1></div>
      <form onSubmit={handleVendorSubmit}>
        <label htmlFor="vendor">Vendor Name:</label>
        <input
          id="vendor"
          type="text"
          value={selectedVendor}
          onChange={handleVendorSelect}
        />
        <button type="submit">Submit</button>
        <h6> Refresh this Page after Submit</h6>
      </form>
      <div id='heading'><h1>Enter Resource Details</h1></div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="fullName">Full Name:</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={handleFullNameChange}
        />
        <br />

        <label htmlFor="resume">Upload Resume:</label>
        <input id="resume" type="file" onChange={handleFileSelect} />
        <br />

        <label htmlFor="vendorSelect">Vendor Name:</label>
        <select id="vendorSelect" value={selectedVendor} onChange={handleVendorSelect}>
          <option value="">Select a vendor...</option>
         {
           (Array.isArray(vendors))?
          vendors?.map((item,i)=>{
            return <option key={i} value={item?.name}>{item?.name}</option>
            
          })
         :null}
    
    </select>
    <br />

    <label htmlFor="technologySelect">Technologies:</label>
    <br />
    {technologies.map((technology) => (
      <label key={technology}>
        <input
          type="checkbox"
          value={technology}
          checked={selectedTechnologies.includes(technology)}
          onChange={handleTechnologySelect}
        />
        {technology}
      </label>
    ))}
    <br />

    <button type="submit">Submit</button>

    <h6>Hit the Refresh Button</h6>
  </form>

  <h2 id='heading'>Resources</h2>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Vendor</th>
        <th>Technologies</th>
        <th>Resume</th>
      </tr>
    </thead>
    <tbody>
    {
           (Array.isArray(resources))?
          resources?.map((item,i)=>{
            return  <tr key={i}>
            <td>{item.name}</td>
            <td>{item.vendor}</td>
            <td>{item.technologies.join(', ')}</td>
            <td>
            {item.resume && (
              <a href={`/${item.resume}`} download onClick={() => handleDownload(item.resume)}>
                Download Resume
              </a>
            )}
          </td>
          </tr>
            
          })
        
         :null}
  

      {/* {
      (Array?.isArray(resources))?
      resources?.map((item,i) => (
          <tr key={i}>
          <td>{item.name}</td>
          <td>{item.vendor}</td>
          <td>{item.technologies.join(', ')}</td>
          <td>
            {item.resume && (
              <a href={`/${item.resume}`} download>
                Download Resume
              </a>
            )}
          </td>
        </tr>
      )):null} */}
    </tbody>
  </table>
</div>
);
}

export default StaffingSystem;