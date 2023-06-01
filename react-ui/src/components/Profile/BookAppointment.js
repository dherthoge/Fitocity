import { React, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBBtn,
} from "mdb-react-ui-kit";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";
import Navigation from "../Navigation/Navigation";
import Table from '../Table/Table';
import qs from "qs";

export default function BookAppointment() {
  // Trainer's profile ID from parameters
  const { profileId } = useParams()

  // Auth token and refresh token state
  const existingAuthtoken = localStorage.getItem("authToken") || "";
  const [authToken] = useState(existingAuthtoken);

  // Appointment table information
  const columns = [
    { heading: 'Title', value: 'title' },
    { heading: 'Date', value: 'date' },
    { heading: 'Time', value: 'time' },
    { heading: 'Duration', value: 'duration' },
    { heading: 'Description', value: 'description' },
    { heading: 'Booked', value: 'customerId'},
    { heading: 'Action' }
  ];
  const [dataTable, setDataTable] = useState([]);

  
  useEffect(() => {
    console.log(`profileId: ${profileId}`);
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
      profileId: profileId,
      filterStartTime: Date.now()
    }

    instance
      .post("/api/scheduling/listAppointments", qs.stringify(formData))
      .then((res) => {
        let appointments = res.data;
        // Filter out booked appointments
        appointments = appointments.filter(apt => apt.customerId === '');
        console.log(appointments);

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
  }, [authToken, profileId]);

  const onBookClick = (event) => {
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
      .post("/api/scheduling/bookAppointment", qs.stringify(formData))
      .then((res) => {
        setDataTable(dataTable
          .filter(apt => apt._id !== dataTable[event.target.value]._id) // filter out booked apt
          .map(apt => { // decrement ids of each row
            apt.id -= 1;
            return apt;
          })
        );

        toast('Appointment booked successfully!')
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      <Navigation />
      <ToastContainer/>
      <div className="gradient-custom-2" style={{ backgroundColor: "#cbe2f7", minHeight:'100vh'}}>
        <MDBContainer className="py-5 h-100 section">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol g="9" xl="7" className="subsection">
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
                      Book Your Appointment
                    </h1>
                  </MDBRow>
                  <MDBRow
                    md="4"
                    className="justify-content-center align-items-center h-100"
                  >
                    <div>
                      {dataTable.length === 0 ?
                        <h2>The trainer does not have any available appointments!</h2>
                      :
                        <Table data={dataTable} columns={columns} onBookClick={onBookClick} />
                      }
                    </div>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </>
  );
}
