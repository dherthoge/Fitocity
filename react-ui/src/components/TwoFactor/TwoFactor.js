import { React, useState } from 'react'
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBInput, MDBTypography } from 'mdb-react-ui-kit';
import './twoFactor.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import qs from 'qs'
import util from 'util'

export default function TwoFactor() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken') || '';

    const onCode = (event) => {
      setCode(event.target.value);
    };

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
  
        localStorage.clear();
        // Redirect to home
        navigate('/');
    };

    const onSubmit = (event) => {
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
        const formData = { code: code };
        
        instance.post('/auth/login/mfa', qs.stringify(formData)).then((res) => {            
            // Set the status of the verification
            console.log(`mfaVerified: ${res.data.mfaVerified}`);
            localStorage.setItem('mfaVerified', res.data.mfaVerified+'');
            navigate('/dashboard');
        })
        .catch((err) => {
            if (err) setError(err.response.data);
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <MDBContainer fluid className="p-3 my-5 h-custom">
                <MDBRow>
                    <MDBCol col='4' md='6' style={{ width: '500px', marginLeft:'auto', marginRight:'auto' }} >
                        <MDBRow>
                        <div className='d-flex align-items-center'>
                        <h1 className='center text-center text-md-start mt-4 pt-2'>MFA</h1>
                        </div>
                        <div className='d-flex align-items-center'>
                        <p className='center'>
                        Please enter the code displayed in your Google Authenticator app!
                        </p>
                        </div>
                        <MDBInput wrapperClass='mb-4' label='Code' value={code} onChange={onCode} id='formControlLg' type='text' size="lg" />

                        {error ?
                            <MDBTypography id="danger-text" note noteColor='danger'>
                                <strong>{error}</strong>
                            </MDBTypography> : ""}
                        <div className='d-flex align-items-center text-center text-md-start mt-1 pt-2'>
                            <MDBBtn className="center mb-0 px-5" size='lg'>Submit</MDBBtn>
                            <MDBBtn className="center mb-0 px-5" size='lg' onClick={onLogout} style={{ marginLeft: '30px' }}>
                            Logout
                            </MDBBtn>
                        </div>
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </form>
    );
};