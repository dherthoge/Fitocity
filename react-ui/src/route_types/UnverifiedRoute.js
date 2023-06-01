import React, { useEffect } from 'react'
import { Navigate, useSearchParams }  from 'react-router-dom'
import axios from 'axios'
import util from 'util'

function UnverifiedRoute({ children }) {
    // Get session infomation from local storage or from searchParameters if not present in local storage
    const [searchParams] = useSearchParams();
    const authToken = localStorage.getItem('authToken') ? localStorage.getItem('authToken')
                                                            : searchParams.get('authToken');
    const refreshToken = localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken')
                                                                  : searchParams.get('refreshToken') || '';
    const mfaRequired = localStorage.getItem('mfaRequired') ? localStorage.getItem('mfaRequired')
                                                                : searchParams.get('mfaRequired') || '';
    const mfaVerified = localStorage.getItem('mfaVerified') ? localStorage.getItem('mfaVerified')
                                                                : searchParams.get('mfaVerified') || '';
    
    // If the session info came from the search params it needs to be set in local storage
    if (authToken !== '')
        localStorage.setItem('authToken', authToken);
    if (refreshToken !== '')
        localStorage.setItem('refreshToken', refreshToken);
    if (mfaRequired !== '')
        localStorage.setItem('mfaRequired', mfaRequired);
    if (mfaVerified !== '')
        localStorage.setItem('mfaVerified', mfaVerified);

    // Make a request to the backend to check the validity of the user's session information
    useEffect(() => {
        const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const instance = axios.create({
            baseURL: 'http://localhost:5000',
            withCredentials: true,
            headers: headers
        });

        instance.get('/auth/sessionInfo', {}).then((res) => {
            const authTokenValid = res.data.authTokenValid;
            const mfaRequired = res.data.mfaRequired;
            const mfaVerified = res.data.mfaVerified;
            const email = res.data.email;

            // If the auth token is not valid remove session info from local storage
            if (!authTokenValid) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('mfaVerified');
                localStorage.removeItem('mfaRequired');
                localStorage.removeItem('email');
            }
            else {
                localStorage.setItem('email', email);
                localStorage.setItem('mfaRequired', mfaRequired+'');
                localStorage.setItem('mfaVerified', mfaVerified+'');
            }
        })
        .catch((err) => {
            if (err) console.error(err);
        });

    }, [authToken]);

    // If the user has both auth and refresh tokens and if the user is required to use
    // mfa and but has not been verified proceed to the requested route. Otherwise 
    // redirect to home
    return authToken.length > 0 && refreshToken.length > 0 && mfaRequired === 'true' && 
            mfaVerified === 'false' ? children : <Navigate to='/'/>;
}

export default UnverifiedRoute;