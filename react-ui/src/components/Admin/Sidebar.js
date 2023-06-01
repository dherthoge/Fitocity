import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import '../../App.css'; 
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Sidebar() {
  const navigate = useNavigate();
  const role = useSelector(state => state.role)
  const existingAuthtoken = localStorage.getItem('authToken') || '';
  const [authToken] = useState(existingAuthtoken);
  const onLogout = async (event) => {
      const headers = {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
      };
      const instance = axios.create({
          baseURL: 'http://localhost:5000',
          withCredentials: true,
          headers: headers
      });
        
      // Terminate the user's session information
      await instance.post('/auth/logout', {}).then((res) => {})
        .catch((error) => console.error(error));
  
      // Navigate to home
      localStorage.clear();
      navigate('/');
  };

  return (
    <>
   
    <div>
      <div class="sidebar">
    <div class="logo-details">
      <i class='bx bxl-c-plus-plus'></i>
      <span class="logo_name">Fitocity</span>
    </div>
      <ul class="nav-links">
      <li>
          <Link to="/admindash">
            <i class='bx bx-grid-alt' ></i>
            <span class="links_name">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/showusers">
            <i class='bx bx-grid-alt' ></i>
            <span class="links_name">Show Users</span>
          </Link>
        </li>
        <li>
          <Link to="/showtrainers">
            <i class='bx bx-box' ></i>
            <span class="links_name">Show Trainers</span>
          </Link>
        </li>
        <li>
          <Link to="/approvetrainers">
            <i class='bx bx-list-ul' ></i>
            <span class="links_name">Approve Trainers</span>
          </Link>
        </li> 
        <li>
          <Link to="/showvideos">
            <i class='bx bx-list-ul' ></i>
            <span class="links_name">Workout Videos</span>
          </Link>
        </li> 
        <li>
          <Link to="/adminprofile">
            <i class='bx bx-coin-stack' ></i>
            <span class="links_name" >Add Profile</span>
          </Link>
        </li>

        <li>
          <button className='logoutbutton' onClick={onLogout} >
              <i class='bx bx-coin-stack' ></i>
              <span class="links_name">Logout</span>
          </button>
        </li>
      </ul>
    </div>
    </div>
    </>
  )
}
