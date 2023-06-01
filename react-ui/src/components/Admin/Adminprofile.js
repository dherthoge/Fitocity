import React from 'react'
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
    MDBTextArea
  } from 'mdb-react-ui-kit';
  import '../../App.css'; 
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';


export default function Adminprofile() {
  return (
    <>
    <Sidebar></Sidebar>
    <AdminHeader></AdminHeader>
    <div className='home-section' style={{width:'150vh',marginLeft:'60px'}}>
        <div className="row">
        <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5"><img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" /><span className="font-weight-bold">User </span><span className="text-black-50">User Email: xyz@mail.com.my</span><span> </span></div>
      
        </div>
      <div className="col-md-5 border-right">
            <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-right">Profile Settings</h4>
                </div>
                  <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Full Name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        <MDBInput label='Name' 
                          type='text' />
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <br />
          
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        <MDBInput label='Email' 
                          type='text' />
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <br/>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Phone</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        <MDBInput label='Phone' 
                          type='text' />
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <br/>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>City</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        <MDBInput label='City' 
                          type='text' />
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
                <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="button">Save Profile</button></div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center experience"><span><h5>Tell Us more about yourself!</h5></span></div><br/>
                
              <form >
                      <MDBTextArea  id='textAreaExample' rows={10} />
                      <MDBBtn style={{ 'margin-top': '10px'}} >Submit</MDBBtn>
                    </form>
            </div>
        </div>
    </div>
      </div>
</>
  )
}
