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
import MealCard from './MealCard';
import Button from '@material-ui/core/Button';
import Navigation from '../Navigation/Navigation';
import './MealLog.css';

export default function MealLog() {
  let mfaRequired = localStorage.getItem('mfaRequired');
  const navigate = useNavigate();
  const selector = useSelector(state => state.email);
  const role = useSelector(state => state.role);
  const [dataFromState, setDataFromState] = useState(selector);
  const [dataFromStateRole, setDataFromStateRole] = useState(role);
  const [meals, setMeals] = useState([]);
  const [mealUploadModalVisible, setMealUploadModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [comments, setComments] = useState('');

  // User body measurements
  const [error, setError] = useState(''); // String

  // Auth token and refresh token state
  const existingAuthtoken = localStorage.getItem('authToken') || '';
  const [authToken] = useState(existingAuthtoken);

  // Get the user's meals and store them
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
    instance.get('/api/users/log/meal').then((res) => {
      const { data } = res;
      setMeals(data.data);
    }).catch((err) => {
      console.error(err);
    })
  }, [authToken, role, selector]);

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  }

  const onCaloriesChange = (event) => {
    setCalories(event.target.value);
  }

  const onFatChange = (event) => {
    setFat(event.target.value);
  }

  const onProteinChange = (event) => {
    setProtein(event.target.value);
  }

  const onCarbsChange = (event) => {
    setCarbs(event.target.value);
  }

  const onCommentsChange = (event) => {
    console.log('comment' + event.target.value);
    setComments(event.target.value);
  }

  // Updates the wellness information of the user's profile
  const addMeal = (event) => {
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
      title: title,
      calories: calories,
      fat: fat,
      protein: protein,
      carbs: carbs,
      comments: comments
    };
    // Add the meal the the database
    instance.post('/api/users/log/meal', qs.stringify(formData)).then((res) => {
      toast('Meal Added!')
      setMealUploadModalVisible(false);
    }).catch((err) => {
      toast('Something went wrong!')
    });

    window.location.reload(false); // reload the page
  };

  return (
    <div className="mainbody gradient-custom-2" style={{ backgroundColor: '#cbe2f7' }}>

      {/* Sidebar Navigation */}
      <Navigation/>

      {/* Meals section */}
      <div>
      <MDBContainer className="py-5 h-100 section">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol g="9" xl="7" className="subsection">

            {/* User Profile Card */}
            <MDBCard>
              {/* User information card */}
              <MDBCardBody className="text-black p-4">

                <MDBRow className="justify-content-left align-items-center" md='4' style={{ marginBottom: '60px' }}>
                  <h1 className="fw-bold mb-1" style={{ width: '300px'}}>Meal Log</h1>
                  <Button variant="contained" color="default"
                    className='material-button'
                    // startIcon={<AddRounded />}
                    style={{width: '220px'}}
                    onClick={() => {
                      setMealUploadModalVisible(!mealUploadModalVisible);
                    }}
                  >
                  Add Meal
                  </Button>
                </MDBRow>
                <MDBRow md='4' className="justify-content-center align-items-center h-100">
                  {meals ? <MealCard meals={meals} /> : ''}
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      </div>

      {/* Meal upload Modal */}
      <MDBModal show={mealUploadModalVisible} setShow={setMealUploadModalVisible} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
              <MDBModalHeader>
                <h2>Add Meal</h2>
              </MDBModalHeader>
              <MDBModalBody>
                <div className='mb-3'>
                  <h4>Title</h4>
                  <MDBInput
                    type='text'
                    value={title}
                    onChange={onTitleChange}
                    labelClass='col-form-label'
                    label='Title'
                  />
                </div>
                <hr/>
                <div className='mb-3'>
                  <h4>Calories</h4>
                  <MDBRow className='flex-left'>
                  <div className='gram-input'>
                  <MDBInput
                    type='number'
                    value={calories}
                    onChange={onCaloriesChange}
                    labelClass='col-form-label'
                    label='Calories'
                  />
                  </div>
                  <p className='gram'>g</p>
                  </MDBRow>
                </div>
                <hr/>
                <div className='mb-3'>
                  <h4>Fat</h4>
                  <MDBRow className='flex-left'>
                  <div className='gram-input'>
                  <MDBInput
                    type='number'
                    value={fat}
                    onChange={onFatChange}
                    labelClass='col-form-label'
                    label='Fat'
                  />
                  </div>
                  <p className='gram'>g</p>
                  </MDBRow>
                </div>
                <hr/>
                <div className='mb-3'>
                  <h4>Protein</h4>
                  <MDBRow className='flex-left'>
                  <div className='gram-input'>
                  <MDBInput
                    type='number'
                    value={protein}
                    onChange={onProteinChange}
                    labelClass='col-form-label'
                    label='Protein'
                  />
                  </div>
                  <p className='gram'>g</p>
                  </MDBRow>
                </div>
                <hr/>
                <div className='mb-3'>
                  <h4>Carbs</h4>
                  <MDBRow className='flex-left'>
                  <div className='gram-input'>
                    <MDBInput
                      type='number'
                      value={carbs}
                      onChange={onCarbsChange}
                      labelClass='col-form-label'
                      label='Carbs'
                    />
                  </div>
                  
                  <p className='gram'>g</p>
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
                <MDBBtn type='button' color='secondary' onClick={() => setMealUploadModalVisible(!mealUploadModalVisible)}>Close</MDBBtn>
                <MDBBtn onClick={addMeal}>Add</MDBBtn>
              </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
