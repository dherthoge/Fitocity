import { React, useState } from 'react'
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox, MDBTypography } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom'
import './login.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import qs from 'qs' // needed for axios post to work properly
import util from 'util'
import store from '../../state/store'

export default function Login() {
    const [email, setEmail] = useState(''); // String
    const [password, setPassword] = useState(''); // String
    const [error, setError] = useState(''); // String
    const navigate = useNavigate();

    const [role, setRole] = useState("user");
    let role_temp = ""
  

    const onEmailChange = (event) => {
      setEmail(event.target.value);
    }

    const onPasswordChange = (event) => {
      setPassword(event.target.value);
    }

    const emailValidation = (event) => {
      setError(!(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).test(email) ? 'Invalid email!' : '');
    }

    const onSubmit = (event) => {
        event.preventDefault();
        
        localStorage.clear();
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const instance = axios.create({
            baseURL: 'http://localhost:5000',
            withCredentials: true,
            headers: headers
        });

        instance
      .get("/api/users/profile/getdetails", { params: { email: email } })
      .then((res) => {
        setRole(res.data.role);
        role_temp = res.data.role
        console.log(res.data.role)
      })
      .catch((error) => {
        if (error.response) console.log(error.response.data);
      });

        const formData = {
            email: email,
            password: password
        };
        
        instance.post('/auth/login', qs.stringify(formData)).then((res) => {
            const accessToken = res.data.accessToken;
            const refreshToken = res.data.refreshToken;
            const mfaRequired = res.data.mfaRequired;
            const mfaVerified = res.data.mfaVerified;


            localStorage.setItem('authToken', accessToken); // for browser
            localStorage.setItem('refreshToken', refreshToken); // for browser
            localStorage.setItem('mfaRequired', mfaRequired); // for browser
            localStorage.setItem('mfaVerified', mfaVerified); // for browser
            store.dispatch({type: 'SET_EMAIL', payload: email});

            console.log(mfaRequired);
            // console.log(role)
            // console.log(role_temp)
            if (mfaRequired) {
                navigate('/twoFactor');
                return;
            }
            else if(role_temp==="admin"){
                navigate('/admindash')
            }
            else {
                navigate('/dashboard');
                console.log(role)
                return;
            }
        })
        .catch((error) => {
            if (error) setError(error.response.data);
        });
    };

    return (
        <div className='container'>
        <form onSubmit={onSubmit}>
            <MDBContainer fluid className="p-3 my-5 h-custom">
                <MDBRow>
                    <MDBCol col='10' md='6'>
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample" />
                    </MDBCol>

                    <MDBCol col='4' md='6'>

                        <div className="d-flex flex-row align-items-center justify-content-center">

                            <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                            <a href="http://localhost:5000/auth/google">
                                <MDBBtn floating size='md' tag='a' className='me-2'>
                                    <MDBIcon fab icon='google' />
                                </MDBBtn>
                            </a>


                        </div>

                        <div className="divider d-flex align-items-center my-4 or">
                            <p className="text-center fw-bold mx-3 mb-0">Or</p>
                        </div>

                        <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' value={email} onBlur={emailValidation}   onChange={onEmailChange} type='email' size="lg" />
                        <MDBInput wrapperClass='mb-4' label='Password' value={password} onChange={onPasswordChange} id='formControlLg' type='password' size="lg" />

                        <div className="d-flex justify-content-between mb-4">
                            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                            <Link to="/forgotPassword">Forgot password?</Link>
                        </div>
                        {error ?
                            <MDBTypography id="danger-text" note noteColor='danger'>
                                <strong>{error}</strong>
                            </MDBTypography> : ""}
                        <div className='text-center text-md-start mt-4 pt-2'>
                            <MDBBtn className="mb-0 px-5" size='lg'>Login</MDBBtn>
                            <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <Link to="/register" className="link-danger">Register</Link></p>
                        </div>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </form>
        </div>
    );
};