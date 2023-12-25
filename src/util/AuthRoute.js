import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function AuthRoute({ element: Component, ...rest }) {
    const { user } = useContext(AuthContext);

    return user ? <Navigate to="/" /> : <Component {...rest} />;
}

export default AuthRoute;
