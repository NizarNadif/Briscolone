import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// it redirects to "/" path (home page) if not logged in
function PrivateRoute({ component: Component, ...rest }) {
	const { isAuthenticated } = useAuth0();
	return (
		<Route
			{...rest}
			render={(props) => {
				return isAuthenticated ? <Component {...props} /> : <Redirect to="/" />;
			}}
		/>
	);
}

export default PrivateRoute;
