import React, { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AuthContext } from './providers/AuthProvider';

interface PrivateRouteProps extends RouteProps {
    component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null; // Or render some error UI
    }

    const { authToken } = authContext;

    return (
        <Route
            {...rest}
            render={props =>
                authToken ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;