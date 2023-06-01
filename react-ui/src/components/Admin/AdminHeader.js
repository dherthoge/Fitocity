import React from 'react'
import '../../App.css'; 

export default function AdminHeader() {
  return (
    <section class="admin-header container">
    <div>
      <nav>
      <div class="sidebar-button">
        <i class='bx bx-menu sidebarBtn'></i>
        <span class="dashboard">Admin Dashboard</span>
      </div>
      <div class="search-box">
        <input type="text" placeholder="Search..."/>
        <i class='bx bx-search' ></i>
      </div>
      <div class="profile-details">
        <img src="https://xsgames.co/randomusers/assets/avatars/male/63.jpg" alt=""/>
        <span class="admin_name">Welcome Admin</span>
        <i class='bx bx-chevron-down' ></i>
      </div>
    </nav>
    </div>
    </section>
  )
}
