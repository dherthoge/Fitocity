import React, { useState, useEffect } from 'react'
import '../../App.css'; 
import axios from 'axios'
import qs from "qs";
import './Dashboard.css'
import Navigation from '../Navigation/Navigation';
import Table from '../Table/Table';
import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";


export default function Dashboard() {
  const email = localStorage.getItem("email");
  const [role, setRole] = useState("user");

  // Auth token and refresh token state
  const existingAuthtoken = localStorage.getItem("authToken") || "";
  const [authToken] = useState(existingAuthtoken);

  // Appointment table information
  let columns = [
    { heading: 'Title', value: 'title' },
    { heading: 'Date', value: 'date' },
    { heading: 'Time', value: 'time' },
    { heading: 'Duration', value: 'duration' },
    { heading: 'Description', value: 'description' },
    { heading: 'Meeting Link', value: 'meetingLink'},
    { heading: 'Booked', value: 'customerId'},
    { heading: 'Action' }
  ];
  const [dataTable, setDataTable] = useState([]);

  
  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const instance = axios.create({
      baseURL: "http://localhost:5000",
      withCredentials: true,
      headers: headers,
    });

    // Get the user's role
    instance
      .get("/api/users/profile/getdetails", { params: { email: email } })
      .then((res) => {
        setRole(res.data.role);
      })
      .catch((error) => {
        if (error.response) console.log(error.response.data);
      });


    const formData = {
      isTrainer: role === 'trainer',
      filterStartTime: Date.now()
    }
    instance
      .post("/api/scheduling/listAppointments", qs.stringify(formData))
      .then((res) => {
        let appointments = res.data;

        // Transform data for this table
        for (let i = 0; i < appointments.length; i++) {
          appointments[i].id = i;
          let dateTime = new Date(appointments[i].startTime);

          appointments[i].date = `${dateTime.getFullYear()}/${dateTime.getMonth()+1}/${dateTime.getDate()+1}`;
          
          
          const dateAmOrPm = dateTime.getHours() / 12 >= 1 ? 'PM' : 'AM';

          let dateHour = dateTime.getHours();
          if (dateHour === 0) dateHour = 12;
          else if (dateHour > 12) dateHour -= 12;


          let dateMinute = dateTime.getMinutes().toString();
          if (dateMinute.length === 1) dateMinute = '0' + dateMinute;

          appointments[i].time = `${dateHour}:${dateMinute} ${dateAmOrPm}`;
        }

        setDataTable(appointments);
      })
      .catch((error) => {
        console.error(error);
        setDataTable([]);
      });
  }, [authToken, email, role]);

  const onCancelClick = (event) => {
    event.preventDefault();

    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const instance = axios.create({
      baseURL: "http://localhost:5000",
      withCredentials: true,
      headers: headers,
    });
    const formData = {
      appointmentId: dataTable.filter(apt => apt.id === Number.parseInt(event.target.value))[0]._id
    }

    instance
      .post("/api/scheduling/cancelAppointment", qs.stringify(formData))
      .then((res) => {
        setDataTable(dataTable
          .filter(apt => apt._id !== dataTable[event.target.value]._id) // filter out booked apt
          .map(apt => { // decrement ids of each row
            apt.id -= 1;
            return apt;
          })
        );

        toast('Appointment cancelled successfully!')
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const onDeleteClick = (event) => {
    event.preventDefault();

    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const instance = axios.create({
      baseURL: "http://localhost:5000",
      withCredentials: true,
      headers: headers,
    });
    const formData = {
      appointmentId: dataTable.filter(apt => apt.id === Number.parseInt(event.target.value))[0]._id
    }

    instance
      .post("/api/scheduling/deleteAppointment", qs.stringify(formData))
      .then((res) => {
        setDataTable(dataTable
          .filter(apt => apt._id !== dataTable[event.target.value]._id) // filter out booked apt
          .map(apt => { // decrement ids of each row
            apt.id -= 1;
            return apt;
          })
        );

        toast('Appointment deleted successfully!')
      })
      .catch((error) => {
        console.error(error);
      });
  }


  return (
    <>
      <Navigation/>
      <ToastContainer/>


      <section class="home-section" style={{backgroundColor:'#cbe2f7'}}>
        <nav>
          <div class="sidebar-button">
            <i class='bx bx-menu sidebarBtn'></i>
            <span class="dashboard">Dashboard</span>
          </div>
        </nav>


            <div className="gradient-custom-2" style={{ backgroundColor: "#cbe2f7", minHeight:'100vh', marginTop:'100px'}}>
                <MDBRow className="justify-content-center align-items-center h-100">
                  <MDBCol className="subsection">
                    {/* User Profile Card */}
                    <MDBCard>
                      {/* User information card */}
                      <MDBCardBody className="text-black p-4">
                        <MDBRow
                          className="justify-content-left align-items-center"
                          md="6"
                          style={{ marginBottom: "30px" }}
                        >
                          <h1 className="fw-bold" style={{ width: "600px" }}>
                            Your Agenda
                          </h1>
                        </MDBRow>
                        <MDBRow
                          md="4"
                          className="justify-content-center align-items-center h-100"
                        >
                          <div>
                            {dataTable.length === 0 ?
                              <h2>You do not have any upcoming appointments!</h2>
                            :
                              role === 'trainer' ?
                                <Table data={dataTable} columns={columns} onDeleteClick={onDeleteClick} />
                              :
                                <Table data={dataTable} columns={columns} onCancelClick={onCancelClick} />
                            }
                          </div>
                        </MDBRow>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
            </div>
      </section>
    </>
  )

}
