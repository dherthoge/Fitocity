import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


const Navigation = () => {
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
    <div class="sidebar">
    <div class="logo-details">
      <i class='bx bxl-c-plus-plus'></i>
      <span class="logo_name">Fitocity</span>
    </div>
    <ul class="nav-links">
      <li>
        <Link to='/dashboard'>
          <i class='bx bx-grid-alt' ></i>
          <span class="links_name">Dashboard</span>
        </Link>
      </li>
      {role !== 'trainer' ?  
      <li>
        <Link to="/recommendation" >
          <i class='bx bx-grid-alt' ></i>
          <span class="links_name">Diet Recommendations</span>
        </Link>
      </li>
      : ""}
      {role !== 'trainer' ?  
      <li>
        <Link to='/mealLog'>
          <i class='bx bx-grid-alt' ></i>
          <span class="links_name">Meal Log</span>
        </Link>
      </li>
      : ""}
      {role !== 'trainer' ?  
      <li>
        <Link to='/sleepLog'>
          <i class='bx bx-grid-alt' ></i>
          <span class="links_name">Sleep Log</span>
        </Link>
      </li>
      : ""}
      {role !== 'trainer' ?  
      <li>
        <Link to='/workoutLog'>
          <i class='bx bx-grid-alt' ></i>
          <span class="links_name">Workout Log</span>
        </Link>
      </li>
: ""}
      {role !== 'trainer' ? 
      <li>
      <Link to = '/messages'>
            <i class='bx bx-message' ></i>
            <span class="links_name">Messages</span>
          </Link>
      </li>
      : ""}
      <li>
        <Link to = '/profile'>
          <i class='bx bx-coin-stack' ></i>
          <span class="links_name">Profile</span>
        </Link>
      </li>
      <li>
        <Link to='/settings'>
          <i class='bx bx-cog' ></i>
          <span class="links_name">Settings</span>
        </Link>
      </li>
      {role !== 'trainer' ? 
      <li>
          <Link to='/search'>
            <i class='bx bx-coin-stack' ></i>
            <span class="links_name">Search</span>
          </Link>
        </li>: ""}
      <li>
        <button className='logoutbutton' onClick={onLogout} >
            <i class='bx bx-coin-stack' ></i>
            <span class="links_name">Logout</span>
        </button>
      </li>
    </ul>
  </div>
  )
}

export default Navigation