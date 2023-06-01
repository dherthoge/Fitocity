import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom'
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBInput, MDBIcon, MDBTypography } from 'mdb-react-ui-kit'
import './resetPassword.css'
import axios from 'axios'
import qs from 'qs' // needed for axios post to work properly

  const ResetPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [password, setPassword] = useState(''); // String
  const [confirmPassword, setConfirmPassword] = useState(''); // String
  const [resetPasswordToken, setResetPasswordToken] = 
      useState(searchParams.get('resetPasswordToken')); // String
  const [success, setSuccess] = useState(''); // Boolean
  const [error, setError] = useState(''); // String

  const onSubmit = async (event) => {
      event.preventDefault();
      
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
      };
      const instance = axios.create({
          baseURL: 'http://localhost:5000',
          withCredentials: true,
          headers: headers
      });

      const formData = {
          password: password,
          resetPasswordToken: resetPasswordToken
      }    
      
      instance.post('/auth/resetPassword', qs.stringify(formData))
        .then((res) => {
          setSuccess(true);
        })
        .catch((error) => {
          if (error) setError(error.response.data);
        });

  }

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const onConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  }
  
  return (
    <form onSubmit={onSubmit}>
      <MDBContainer fluid>
        <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                <p className="text-center h1 fw-bold mb-1 mx-1 mx-md-4 mt-4">Reset Password</p>
                <p className="text-center mb-3 mx-1 mx-md-4 mt-4">Please and confirm you new password.</p>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="lock me-3" size='lg' />
                  <MDBInput label='Password' id='form3' value={password} onChange={onPasswordChange} type='password' />
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="key me-3" size='lg' />
                  <MDBInput label='Confirm Password' value={confirmPassword} onChange={onConfirmPasswordChange} id='form4' type='password' />
                </div>

                {confirmPassword !== password ?
                  <MDBTypography id="danger-text" note noteColor='danger'>
                    <strong>Passwords do not match</strong>
                  </MDBTypography> : ""}
                {error ?
                  <MDBTypography id="danger-text" note noteColor='danger'>
                    <strong>{error}</strong>
                  </MDBTypography> : ""}
                <MDBBtn className='mb-4 register' size='lg' disabled={(confirmPassword !== password)}>Reset password</MDBBtn>
                { success ? 
                    <MDBTypography id="node-success" note noteColor='success'>
                      <strong>Password reset successfully! Click <Link to='/login'>here</Link> to log in!</strong>
                    </MDBTypography> : ""
                }
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </form>
  );
}

export default ResetPassword;