import { React, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import downloadFromAppStoreSVG from '../../images/app-store-images/Black_lockup/SVG/Download_on_the_App_Store_Badge.svg'

export default function Settings() {
  let mfaRequired = localStorage.getItem('mfaRequired');
  const navigate = useNavigate();
  const role = useSelector(state => state.role)
  const [mfaQrCodeUrl, setMfaQrCodeUrl] = useState('')
  const [mfaSecret, setMfaSecret] = useState('')
  
  // Auth token and refresh token state
  const existingAuthtoken = localStorage.getItem('authToken') || '';
  const [authToken] = useState(existingAuthtoken);

  //todo
  //get user data
  useEffect(() => {
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
  }, [authToken, mfaRequired])

  const enroll = (event) => {
    event.preventDefault()

    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const instance = axios.create({
        baseURL: 'http://localhost:5000',
        withCredentials: true,
        headers: headers
    });
    
    // Get authenticator for the user from the backend
    instance.get('/auth/mfa/google/authenticator/info', {}).then((res) => {
      setMfaQrCodeUrl(res.data.qrImage);
      mfaRequired = 'true'; 
      localStorage.setItem('mfaRequired', 'true');
      localStorage.setItem('mfaVerified', 'true');
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  return (
    <div className="mainbody gradient-custom-2" style={{ backgroundColor: '#cbe2f7' }}>      
      
    <Navigation/>

    <div>
    <MDBContainer className="py-5 h-100 section">
      <MDBRow className="justify-content-center align-items-center h-100">
      <MDBCol lg="9" xl="7">
        <MDBCard className="mb-4">
          <MDBCardBody>

            <h1>MFA</h1>

            {/* Display mfa qrcode and code if the user is enrolled in mfa */}
            { mfaRequired === 'false' ? 
              <MDBRow className="justify-content-center align-items-center h-100">
                <MDBBtn style={{ 'margin-top': '10px', width: '200px' }} onClick={enroll}>Enable MFA</MDBBtn>
              </MDBRow>
            :
              <MDBRow>
              <MDBRow sm="8">
                <MDBCardText>
                  Please download the Google Authenticator app and use the qr code (or secret) below to set up
                  mfa! You will be required to enter a 6-digit code each time you log in to increase
                  the security of your account.
                </MDBCardText>
              </MDBRow>
              <MDBRow style={{ flex: 'left' }}>
                <MDBRow className="justify-content-center align-items-center" style={{flex: 'left'}}>
                <MDBCardImage src={downloadFromAppStoreSVG}
                              alt='Download Google Authenticator from the App Store!' 
                              href='https://apps.apple.com/us/app/google-authenticator/id388497605'
                              style={{ flex: 'left', width: '150px', marginLeft: '35px' }} 
                              fluid
                              />
                <MDBCardImage src={'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'}
                              alt='Get it on Google Play'
                              href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'
                              style={{ flex: 'right', width: '180px', marginLeft: '10px' }} 
                              fluid
                              />
                </MDBRow>
                <MDBRow className="justify-content-center align-items-center" style={{ flex: 'left', marginTop: '30px'}}>
                <div className='center d-flex align-items-center'>
                  <MDBCardImage className='center'
                                src={mfaQrCodeUrl} 
                                alt="MFA QR Code Url" 
                                style={{ 
                                  width: '200px',
                                }} 
                                fluid />
                </div>
                <div className='d-flex align-items-center'>
                  <h3 className='center' style={{ marginTop: '40px'}}>{mfaSecret}</h3>
                </div>
                </MDBRow>
              </MDBRow>
              </MDBRow>
            }
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      </MDBRow>
    </MDBContainer>
    </div>
    </div>
  );
}