import { React, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import VideoCard from './VideoCard';
import './Profile.css'
import Navigation from '../Navigation/Navigation';
import { v4 as uuidv4 } from 'uuid';

export default function TrainerProfile() {
  let mfaRequired = localStorage.getItem('mfaRequired');
  const navigate = useNavigate();
  const selector = useSelector(state => state.email)
  const role = useSelector(state => state.role)
  const [userEmail, setUserEmail] = useState('')
  const [userFullName, setUserFullName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [userCity, setUserCity] = useState('')
  const [userImage, setUserImage] = useState('')
  const [mfaQrCodeUrl, setMfaQrCodeUrl] = useState('')
  const [mfaSecret, setMfaSecret] = useState('')
  const [dataFromState, setDataFromState] = useState(selector)
  //const [dataFromStateRole, setDataFromStateRole] = useState(role)
  const [status, setStatus] = useState('todo')
  const [videos, setVideos] = useState([])
  const { id } = useParams()
  const [userId, setUserId] = useState('')

  // Auth token and refresh token state
  const existingAuthtoken = localStorage.getItem('authToken') || '';
  const [authToken] = useState(existingAuthtoken);

  //todo
  //get user data
  useEffect(() => {
    setDataFromState(selector)
    //setDataFromStateRole(role)
    axios.get('/api/users/profile/getdetailsbyid', { params: { id: id } })
      .then((res) => {
        setUserEmail(res.data.data.email)
        setUserCity(res.data.data.city)
        setUserFullName(res.data.data.fullName)
        setUserPhone(res.data.data.phone)
        setUserImage(res.data.data.profileImage)
      })
      .catch((error) => {
        if (error.response)
          console.log(error.response.data);
      })

      axios.get('/api/trainer/videosbyid', { params: { id: id } })
      .then((res) => {
        setVideos(res.data.data)
      }).catch((error) => {
        setVideos('')
        console.log(error)
      })

      axios.get('/api/chat/userid', {params: {email: dataFromState}})
      .then((res) => {
        setUserId(res.data.user)
      }).catch((error) => {
        console.log(error)
      })

    // If the user has mfa enabled, get the google authenticator qr code url from the server
    if (mfaRequired === 'true') {
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      const instance = axios.create({
        baseURL: 'http://localhost:5000',
        withCredentials: true,
        headers: headers
      });
      instance.get('/auth/mfa/google/authenticator/info', {}).then((res) => {
        setMfaQrCodeUrl(res.data.qrImage);
        setMfaSecret(res.data.mfa_secret);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }, [authToken, mfaRequired, selector, setMfaQrCodeUrl, role])

  const addUserToChat = () => {
    const request = {
      userId: userId,
      trainerId: id,
      conversationId: uuidv4()
    }
    axios.post('/api/chat/add', request).then((response) =>{
      console.log(response)
      navigate('/chat', {state:{conversationId: response.data.conversationId, userId: userId}})
    }).catch((error) => {
      console.log(error)
    })
  }


  return (
    <div className="gradient-custom-2" style={{ backgroundColor: '#cbe2f7' }}>
   

      {/* Sidebar Navigation */}
      <Navigation/>
        <MDBContainer className="py-5 h-100 section">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="9" xl="7">

              {/* User Profile Card */}
              <MDBCard>
                <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                  <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                    <div className="image-container">
                    <MDBCardImage src={userImage}
                      alt="Generic placeholder image" className="mt-4 mb-2 img-thumbnail" fluid style={{ width: '150px', zIndex: '1' }} />
                      </div>
                  </div>
                  <div className="ms-3" style={{ marginTop: '130px' }}>
                    <MDBTypography tag="h5">{userFullName}</MDBTypography>
                    <MDBCardText>{userCity}</MDBCardText>
                  </div>
                </div>

                
                {/* Trainer video upload button */}
                <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="d-flex justify-content-end text-center py-1">
                  <MDBBtn onClick={addUserToChat}>Chat with Trainer</MDBBtn>
    
                  <Link to={`/book/${id}`}><MDBBtn className='mx-3' >Book Appointment</MDBBtn></Link>
                  </div>
                </div>

                {/* User information card */}
                <MDBCardBody className="text-black p-4">
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1">About</p>
                    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Full Name</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                          <MDBCardText className="text-muted">{userFullName}</MDBCardText>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Email</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                            <MDBCardText className="text-muted">{userEmail}</MDBCardText>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>Phone</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                          <MDBCardText className="text-muted">{userPhone}</MDBCardText>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="3">
                          <MDBCardText>City</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="9">
                          <MDBCardText className="text-muted">
                          <MDBCardText className="text-muted">{userCity}</MDBCardText>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </div>
                  </div>
                  {/* Trainer videos */}
                  <MDBRow md='4'>
                    {videos ? <VideoCard videos={videos} /> : ''}
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
  );
}