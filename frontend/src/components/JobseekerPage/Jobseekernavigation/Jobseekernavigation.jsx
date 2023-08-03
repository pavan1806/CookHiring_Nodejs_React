import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

function Jobseekernavigation() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8081/getjob')
      .then(res => {
        if (res.data.Status === 'Success') {
          console.log(res.data.Result);
          setJobs(res.data.Result);
        } else {
          alert('Error');
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleClick = (jobId) => {
    navigate(`/jobseeker/applyjob/${jobId}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const filteredResults = jobs.filter((job) =>
      job.jobLocation.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJobs(filteredResults);
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <>
      <div className='body'>
        <div><br/></div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light mx-auto">
          <div className="container-fluid">
            <a className="navbar-brand" id='home'>Cooking Expert</a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link to="/user/dashboard" className="nav-link active" id='userHomeButton'>Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/jobseeker/appliedjob" className="nav-link" id='userAppliedJobs' aria-current="page">Applied Jobs</Link>
                </li>
              </ul>
              <Link to="/login">
                <a className="logout" id='logout'>Logout</a>
              </Link>
            </div>
          </div>
        </nav>
        <Outlet />
      </div>
      <div className="templateContainer">
        <div className="searchInput_Container">
          <input
            id="searchInput"
            type="text"
            placeholder="Type here to search Job"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button
            className="btn btn-success w-10"
            type="submit"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {(filteredJobs.length > 0 ? filteredJobs : jobs).map((job) => (
          <div className="grid-item" key={job.jobId} onClick={() => handleClick(job.jobId)}>
            <div className="template" key={job.jobId} id="adminCandidateGrid">
              <div className="leftContainer">
                <p>Job Description: {job.jobDescription}</p>
                <p>From Date: {new Date(job.fromDate).toLocaleDateString('en-GB')}</p>
                <p>Job Location: {job.jobLocation}</p>
              </div>
              <div className="rightContainer">
                <p>Wage Per Day: {job.wagePerDay}</p>
                <p>To Date: {new Date(job.toDate).toLocaleDateString('en-GB')}</p>
                <p>Phone Number: {job.jobPhone}</p>
              </div>
              <div className="buttonContainer">
                <button className={new Date(currentDate) <= new Date(job.toDate) ? 'available-button' : 'unavailable-button'}>
                  {new Date(currentDate) <= new Date(job.toDate) ? 'Available' : 'Not Available'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && jobs.length === 0 && <p>No results found.</p>}
      </div>
    </>
  );
}

export default Jobseekernavigation;
