import { React, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBInput,
  MDBFile,
  MDBTypography,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTextArea,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownToggle,
  MDBDropdown
} from 'mdb-react-ui-kit';
import axios from 'axios';
import qs from 'qs';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import SleepCard from './SleepCard';
import Button from '@material-ui/core/Button';
import Navigation from '../Navigation/Navigation';
import './SleepLog.css';
import AddRounded from '@material-ui/icons/AddRounded';
import DateTimePicker from 'react-datetime-picker';

export default function SleepLog() {
  let mfaRequired = localStorage.getItem('mfaRequired');
  const navigate = useNavigate();
  const selector = useSelector(state => state.email);
  const role = useSelector(state => state.role);
  const [dataFromState, setDataFromState] = useState(selector);
  const [dataFromStateRole, setDataFromStateRole] = useState(role);
  const [sleeps, setSleeps] = useState([]);
  const [sleepUploadModalVisible, setSleepUploadModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [comments, setComments] = useState('');

  // User body measurements
  const [error, setError] = useState(''); // String

  // Auth token and refresh token state
  const existingAuthtoken = localStorage.getItem('authToken') || '';
  const [authToken] = useState(existingAuthtoken);

  // Get the user's sleeps and store them
  useEffect(() => {
    setDataFromState(selector)
    setDataFromStateRole(role)
    
    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const instance = axios.create({
        baseURL: 'http://localhost:5000',
        withCredentials: true,
        headers: headers
    });    
    instance.get('/api/users/log/sleep').then((res) => {
      const { data } = res;
      setSleeps(data.data);
    }).catch((err) => {
      console.error(err);
    })
  }, [authToken, role, selector]);

  const onCommentsChange = (event) => {
    setComments(event.target.value);
  }

  // Updates the wellness information of the user's profile
  const addSleep = (event) => {
    event.preventDefault();

    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const instance = axios.create({
        baseURL: 'http://localhost:5000',
        withCredentials: true,
        headers: headers
    });
    const formData = {
      startDate: startDate,
      endDate: endDate,
      comments: comments
    };
    // Add the sleep the the database
    instance.post('/api/users/log/sleep', qs.stringify(formData)).then((res) => {
      toast('Sleep Added!')
      setSleepUploadModalVisible(false);
    }).catch((err) => {
      toast('Something went wrong!')
    });

    window.location.reload(false); // reload the page
  };

  return (
    <div className="mainbody gradient-custom-2" style={{ backgroundColor: '#cbe2f7' }}>

      {/* Sidebar Navigation */}
      <Navigation/>


      {/* Sleeps section */}
      <div>
      <MDBContainer className="py-5 h-100 section">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol g="9" xl="7">

            {/* User Profile Card */}
            <MDBCard>
              {/* User information card */}
              <MDBCardBody className="text-black p-4">

                <MDBRow className="justify-content-left align-items-center" md='4' style={{ marginBottom: '60px' }}>
                  <h1 className="fw-bold mb-1" style={{ width: '300px'}}>Sleep Log</h1>                 
                  <Button variant="contained" color="default"
                    className='material-button'
                    // startIcon={<AddRounded />}
                    style={{width: '220px'}}
                    onClick={() => {
                      setSleepUploadModalVisible(!sleepUploadModalVisible);
                    }}
                  >
                  Add Sleep
                  </Button>
                </MDBRow>
                <MDBRow md='4' className="justify-content-center align-items-center h-100">
                  {sleeps ? <SleepCard sleeps={sleeps} /> : ''}
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      </div>

      {/* Sleep upload Modal */}
      <MDBModal show={sleepUploadModalVisible} setShow={setSleepUploadModalVisible} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
              <MDBModalHeader>
                <h2>Add Sleep</h2>
              </MDBModalHeader>
              <MDBModalBody>
                <div className='mb-3'>
                  <h4>Start Date</h4>
                  <MDBRow className="" style={{flex: 'left'}}>
                  <div style={{ flex: 'left', width: '150px'}}>
                  <DateTimePicker
                    amPmAriaLabel="Select AM/PM"
                    calendarAriaLabel="Toggle calendar"
                    clearAriaLabel="Clear value"
                    dayAriaLabel="Day"
                    hourAriaLabel="Hour"
                    maxDetail="second"
                    minuteAriaLabel="Minute"
                    monthAriaLabel="Month"
                    nativeInputAriaLabel="Date and time"
                    onChange={setStartDate}
                    secondAriaLabel="Second"
                    value={startDate}
                    yearAriaLabel="Year"
                  />
                  </div>
                  </MDBRow>
                </div>
                <hr/>
                <div className='mb-3'>
                  <h4>End Date</h4>
                  <MDBRow className="" style={{flex: 'left'}}>
                  <div style={{ flex: 'left', width: '150px'}}>
                  <DateTimePicker
                    amPmAriaLabel="Select AM/PM"
                    calendarAriaLabel="Toggle calendar"
                    clearAriaLabel="Clear value"
                    dayAriaLabel="Day"
                    hourAriaLabel="Hour"
                    maxDetail="second"
                    minuteAriaLabel="Minute"
                    monthAriaLabel="Month"
                    nativeInputAriaLabel="Date and time"
                    onChange={setEndDate}
                    secondAriaLabel="Second"
                    value={endDate}
                    yearAriaLabel="Year"
                  />
                  </div>
                  </MDBRow>
                </div>
                <hr/>
                <div className='mb-3'>
                  <h4>Coments</h4>
                  <MDBInput wrapperClass='mb-4' 
                            label='Comments' 
                            value={comments} 
                            onChange={onCommentsChange} 
                            id='formControlLg' 
                            type='textarea' 
                            size="lg" />
                </div>
              </MDBModalBody>
              <MDBModalFooter>
                {/* type='button' prevents form submission */}
                <MDBBtn type='button' color='secondary' onClick={() => setSleepUploadModalVisible(!sleepUploadModalVisible)}>
                  Close
                </MDBBtn>
                <MDBBtn onClick={addSleep}>Add</MDBBtn>
              </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}