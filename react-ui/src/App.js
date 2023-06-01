import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css';
import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Register from './components/Register/Register';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import TwoFactor from './components/TwoFactor/TwoFactor';
import WorkoutDetails from './components/WorkoutDetails';
import MealLog from './components/MealLog/MealLog';
import SleepLog from './components/SleepLog/SleepLog';
import WorkoutLog from './components/WorkoutLog/WorkoutLog';
import Profile from './components/Profile/Profile';
import Search from './components/Search/Search';
import Chat from './components/Chat/Chat';
import Settings from './components/Settings/Settings';
import Recommendation from './components/Recommendation/Recommendation'
import PrivateRoute from './route_types/PrivateRoute';
import UnauthenticatedRoute from './route_types/UnauthenticatedRoute';
import UnverifiedRoute from './route_types/UnverifiedRoute';
import store from './state/store';
import { AuthContext } from './components/auth/auth';
import { Provider } from 'react-redux';
import TrainerProfile from './components/Profile/TrainerProfile';
import PubNub from 'pubnub';
import { PubNubProvider, usePubNub } from 'pubnub-react';
import TrainerMessages from './components/Chat/TrainerMessages';
import BookAppointment from './components/Profile/BookAppointment';
import Admin from './components/Admin/Admin'
import AdminDash from './components/Admin/AdminDash'
import ShowTrainers from './components/Admin/ShowTrainers'
import ShowUsers from './components/Admin/ShowUsers'
import ApproveTrainers from './components/Admin/ApproveTrainers'
import Adminprofile from './components/Admin/Adminprofile'
import ShowVideos from './components/Admin/ShowVideos';

const pubnub = new PubNub({
  publishKey: 'pub-c-1a2459c5-bfde-409d-8ddb-86e9f45aaaa7',
  subscribeKey: 'sub-c-1ec1cb78-6393-4f79-83e0-696211f566b1',
  uuid: 'sec-c-M2RjNzAxOTItNjdhMi00ZWI4LTgyNzYtOTUwNzNiY2VlNGQz'
});

function App() {
    // Auth token and refresh token state
    const existingAuthtoken = localStorage.getItem('authToken') || '';
    const existingRefreshtoken = localStorage.getItem('refreshToken') || '';
    const [authToken, setAuthtoken] = useState(existingAuthtoken);
    const [refreshToken, setRefreshtoken] = useState(existingRefreshtoken);

    return (
        <Provider store={store}>
        <AuthContext.Provider value = {{ authToken, setAuthToken: setAuthtoken, refreshToken, setRefreshToken: setRefreshtoken }}>
        <BrowserRouter>
        <Routes>
            <Route path='/' element={
                <UnauthenticatedRoute>
                    <Home />
                </UnauthenticatedRoute>    
            }/>
            <Route path='/login' element={
                <UnauthenticatedRoute>
                    <Login />
                </UnauthenticatedRoute>    
            }/>
            <Route path='/twoFactor' element={
                <UnverifiedRoute>
                    <TwoFactor />
                </UnverifiedRoute>    
            }/>
            <Route path='/register' element={
                <UnauthenticatedRoute>
                    <Register />
                </UnauthenticatedRoute>    
            }/>
            <Route path='/forgotPassword' element={
                <UnauthenticatedRoute>
                    <ForgotPassword />
                </UnauthenticatedRoute>    
            }/>
            
            <Route path='/resetPassword' element={
                <UnauthenticatedRoute>
                    <ResetPassword />
                </UnauthenticatedRoute>    
            }/>
            <Route path='/dashboard' element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>    
            }/>
            <Route path='/mealLog' element={
                <PrivateRoute>
                    <MealLog/>
                </PrivateRoute>    
            }/>
            <Route path='/recommendation' element={
                <PrivateRoute>
                    <Recommendation/>
                </PrivateRoute>    
            }/>
            <Route path='/sleepLog' element={
                <PrivateRoute>
                    <SleepLog/>
                </PrivateRoute>    
            }/>
            <Route path='/workoutLog' element={
                <PrivateRoute>
                    <WorkoutLog/>
                </PrivateRoute>    
            }/>
            <Route path='/homepage' element={
                <PrivateRoute>
                    <Navigate to="/dashboard" />
                </PrivateRoute>    
            }/>
            <Route path='/dashboard/:id' element={
                <PrivateRoute>
                    <WorkoutDetails />
                </PrivateRoute>    
            }/>
            <Route path='/profile' element={
                <PrivateRoute>
                    <Profile />
                </PrivateRoute>    
            }/>
            <Route path='/profile/:id' element={
                <PrivateRoute>
                    <TrainerProfile/>
                </PrivateRoute>    
            }/>
            <Route path='/settings' element={
                <PrivateRoute>
                    <Settings />
                </PrivateRoute>
            }/>
            <Route path='/search' element={
                <PrivateRoute>
                    <Search /> 
                </PrivateRoute>    
            }/>
            <Route path='/book/:profileId' element={
                <PrivateRoute>
                    <BookAppointment /> 
                </PrivateRoute>    
            }/>
            <Route path='/chat' element={
                <PrivateRoute>
                    <PubNubProvider client={pubnub}>
                        <Chat />
                    </PubNubProvider>
                </PrivateRoute>    
            }/>
            <Route path='/messages' element={
                <PrivateRoute>
                    <PubNubProvider client={pubnub}>
                        <TrainerMessages />
                    </PubNubProvider>
                </PrivateRoute>    
            }/>
            <Route path='/admin' element={
                <PrivateRoute>
                    <Admin></Admin>
                </PrivateRoute>    
            }/>
            <Route path='/admindash' element={
                <PrivateRoute>
                    <AdminDash></AdminDash>
                </PrivateRoute>    
            }/>
            <Route path='/showtrainers' element={
                <PrivateRoute>
                    <ShowTrainers></ShowTrainers>
                </PrivateRoute>
            }/>
            <Route path='/showusers' element={
                <PrivateRoute>
                    <ShowUsers></ShowUsers>
                </PrivateRoute>
            }/>

            <Route path='/approvetrainers' element={
                <PrivateRoute>
                    <ApproveTrainers></ApproveTrainers>
                </PrivateRoute>
            }/>
            <Route path='/approvetrainers/:id' element={
                <PrivateRoute>
                    <ApproveTrainers></ApproveTrainers>
                </PrivateRoute>
            }/>
            <Route path='/adminprofile' element={
                <PrivateRoute>
                    <Adminprofile></Adminprofile>
                </PrivateRoute>
            }/>
            <Route path='/showvideos' element={
                <PrivateRoute>
                    <ShowVideos></ShowVideos>
                </PrivateRoute>
            }/>

        </Routes>
        </BrowserRouter>
        </AuthContext.Provider>
        </Provider>
    );
};

export default App;