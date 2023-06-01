import React from 'react'
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import ShowUsers from './ShowUsers';
import ShowTrainers from './ShowTrainers';
import ApproveTrainers from './ApproveTrainers';
import { BrowserRouter,  Route,Routes } from "react-router-dom";
import AdminDash from './AdminDash';
import Adminprofile from './Adminprofile';
import ShowVideos from './ShowVideos';

export default function Admin() {
  
    return (

<>

<Sidebar />
<AdminDash></AdminDash>
{/* <Sidebar /> */}
{/* <AdminDash/> */}

{/* <div>

<Sidebar/>
<div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AdminHeader />
</div> */}
    

{/* <AdminDash></AdminDash> */}


{/* <BrowserRouter>

<Sidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AdminHeader />
        <Routes>

        <Route path='/admindash' element={
            <AdminDash></AdminDash>
            }/>
        <Route path='/showtrainers' element={
            <ShowTrainers></ShowTrainers>
            }/>
        
        <Route path='/showusers' element={
            <ShowUsers></ShowUsers>
            }/>

        <Route path='/approvetrainers' element={
            <ApproveTrainers></ApproveTrainers>
            }/>

        <Route path='/approvetrainers/:id' element={
                    <ApproveTrainers></ApproveTrainers>
                    }/>



<Route path='/adminprofile' element={
            <Adminprofile></Adminprofile>
            }/>

<Route path='/showvideos' element={
            <ShowVideos></ShowVideos>
            }/>



     
            
        </Routes>
        </div>
    // </BrowserRouter> */}
   
    </>
  )
}

