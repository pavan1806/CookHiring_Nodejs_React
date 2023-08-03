import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';

function Jobseekerapplyjob() {
  const [values, setValues] = useState({
    personName: '',
    personPhoneNumber: '',
    personYearOfExperience: '',
    personAddress: '',
    personEmail: ''
  });

  const { jobId } = useParams(); // Retrieve the jobId from the URL
  const navigate = useNavigate();
  const location = useLocation();
  const jobIdFromPath = location.pathname.split('/').pop(); // Retrieve the jobId from the URL path

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/applyjob', { values, jobId: jobIdFromPath }); // Include the jobId in the request payload
      navigate('/jobseeker/appliedjob');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='body'>
      <div><br/></div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mx-auto">
        <div className="container-fluid">
          <a className="navbar-brand" id='home'>Cooking Expert</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link to="/user/dashboard" className="nav-link active" id='CustomerHomeButton'>Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/jobseeker/appliedjob" className="nav-link" id='addOpenings' aria-current="page">Applied Jobs</Link>
              </li>
            </ul>
            <Link to="/login">
              <a className="logout" id='logout'>Logout</a>
            </Link>
          </div>
        </div>
      </nav>
      <div className='d-flex justify-content-center align-items-center vh-100 addpage'>
        <div className='p-1 rounded w-25 border addform'>
          <h2>Apply Job</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <input
                type='text'
                className='form-control'
                id='personName'
                name='personName'
                placeholder='Enter your name'
                autoComplete='off'
                onChange={handleInput}
              />
            </div>
            <div className='mb-3'>
              <input
                type='text'
                className='form-control'
                id='personPhoneNumber'
                name='personPhoneNumber'
                placeholder='Enter your phone number'
                autoComplete='off'
                onChange={handleInput}
              />
            </div>
            <div className='mb-3'>
              <input
                type='text'
                className='form-control'
                id='personYearOfExperience'
                name='personYearOfExperience'
                placeholder='Enter the year of experience'
                autoComplete='off'
                onChange={handleInput}
              />
            </div>
            <div className='mb-3'>
              <input
                type='text'
                className='form-control'
                id='personAddress'
                name='personAddress'
                placeholder='Enter your Address'
                autoComplete='off'
                onChange={handleInput}
              />
            </div>
            <div className='mb-3'>
              <input
                type='text'
                className='form-control'
                id='personEmail'
                name='personEmail'
                placeholder='Enter your email'
                autoComplete='off'
                onChange={handleInput}
              />
            </div>
            
            <div className='mb-3'>
              <button type='submit' id='applyButton' className='btn btn-success'>
                Apply job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Jobseekerapplyjob;
