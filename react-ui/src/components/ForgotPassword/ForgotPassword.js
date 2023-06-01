import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBIcon, MDBTypography } from 'mdb-react-ui-kit'
import './forgotPassword.css'
import axios from 'axios'
import qs from 'qs' // needed for axios post to work properly

const ForgotPassword = () => {
  const [email, setEmail] = useState(''); // String
  const [error, setError] = useState(''); // String
  const [reqSent, setReqSent] = useState(''); // Boolean

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
          email: email
      };

      setReqSent(true);
      instance.post('/auth/forgotPassword', qs.stringify(formData))
        .then((res) => {
          setReqSent(true);
        })
        .catch((err) => {
          if (err) setError(err.response.data);
        });
  }

  const emailValidation = (event) => {
    setError(!(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).test(email) ? 'Invalid email!' : '');
  }

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  }
  
  return (
    <form onSubmit={onSubmit}>
      <MDBContainer fluid>
        <MDBCard className='text-black m-5' style={{ borderRadius: '25px' }}>
          <MDBCardBody>
            <MDBCol>
              <MDBRow md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                <p className="text-center h1 fw-bold mb-2 mx-1 mx-md-4 mt-4">Forgot your password?</p>
                <p className="text-center mb-3 mx-1 mx-md-4 mt-4">Please enter the email address you'd like your 
                password reset information sent to.</p>

                <div className="d-flex flex-column align-items-center mb-2">
                <div className="d-flex flex-row align-items-center mb-1">
                  <MDBIcon fas icon="envelope me-3" size='lg' />
                  <MDBInput label='Email' id='form2' value={email} onBlur={emailValidation} onChange={onEmailChange} type='email' />
                </div>
                </div>

                { error ? 
                    <MDBTypography id="danger-text" note noteColor='danger'>
                      <strong>{error}</strong>
                    </MDBTypography> : ""
                }
                { reqSent ? 
                    <MDBTypography id="node-success" note noteColor='success'>
                      <strong>Your email should arive within 5 minutes! If it doesn't, please try again!</strong>
                    </MDBTypography> : ""
                }

                <MDBBtn style={{ width:"200px", height:"50px" }} className='mb-4 register' size='lg' disabled={error || !email} >
                  Request reset link
                </MDBBtn>

              </MDBRow>

            </MDBCol>
          </MDBCardBody>
        </MDBCard>

      </MDBContainer>
    </form>
  );
}

export default ForgotPassword;