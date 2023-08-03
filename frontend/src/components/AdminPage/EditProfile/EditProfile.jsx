import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link, Outlet } from 'react-router-dom';

function EditProfile() {
  const [formValues, setFormValues] = useState({
    personId: '',
    personName: '',
    personAddress: '',
    personExp: '',
    personPhone: '',
    PersonEmail: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();

  

  useEffect(() => {
    axios
      .get('http://localhost:8081/getcandidate/' + id)
      .then(res => {
        const {
            personId,
            personName,
            personAddress,
            personExp,
            personPhone,
            PersonEmail
        } = res.data.Result[0];

        setFormValues({
            personId,
            personName,
            personAddress,
            personExp,
            personPhone,
            PersonEmail
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleInput = event => {
    const { name, value } = event.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    axios
      .put('http://localhost:8081/updatecandidate/' + id, formValues)
      .then(res => {
        if (res.data.Status === 'Success') {
          navigate('/admin/profile');
        }
      })
      .catch(err => console.log(err));
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
                  <Link to="/admin/getAllJobs" className="nav-link active" id='AdminOpenings'>Openings</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/profile" className="nav-link" id='AdminCandidates' aria-current="page">Candidates</Link>
                </li>
              </ul>
              <Link to="/login">
                <a className="logout" id='logout'>Logout</a>
              </Link>
            </div>
          </div>
          <Outlet />
        </nav>
      <div className="d-flex justify-content-center align-items-center vh-100 addpage">
        <div className="p-1 rounded w-25 border addform">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                value={formValues.personName}
                className="form-control"
                id="editName"
                name="personName"
                placeholder="Enter your name"
                autoComplete="off"
                onChange={handleInput}
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={formValues.personAddress}
                className="form-control"
                id="editAddress"
                name="personAddress"
                placeholder="Enter your Address"
                autoComplete="off"
                onChange={handleInput}
              />
            </div>


            <div className="mb-3">
              <input
                type="text"
                value={formValues.personPhone}
                className="form-control"
                id="editPhoneNumber"
                name="personPhone"
                placeholder="Enter your phone number"
                autoComplete="off"
                onChange={handleInput}
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={formValues.PersonEmail}
                className="form-control"
                id="editEmail"
                name="PersonEmail"
                placeholder="Enter your email"
                autoComplete="off"
                onChange={handleInput}
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={formValues.personExp}
                className="form-control"
                id="editYearOfExperience"
                name="personExp"
                placeholder="Enter the year of experience"
                autoComplete="off"
                onChange={handleInput}
              />
            </div>
            
   
            <div className="mb-3">
              <button
                type="submit"
                id="updateButton"
                className="btn btn-success w-10">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;