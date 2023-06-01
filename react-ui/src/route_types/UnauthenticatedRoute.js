import React from 'react'
import { Navigate }  from 'react-router-dom'

const UnauthenticatedRoute = ({ children }) => {
    const authToken = localStorage.getItem('authToken') || '';
    const refreshToken = localStorage.getItem('refreshToken') || '';

    // If the user does noth have either auth and refresh tokens proceed to 
    // the requested route. Otherwise redirect to their dashboard
    return authToken.length || refreshToken.length ? <Navigate to='/dashboard'/> : children;
}

export default UnauthenticatedRoute;