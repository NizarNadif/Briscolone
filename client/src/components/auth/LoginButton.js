import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function LoginButton() {
	const { loginWithRedirect, isAuthenticated } = useAuth0();

	if (isAuthenticated) return <></>;

	return (
		<button className="btn-login" onClick={() => loginWithRedirect()}>
			Log In
		</button>
	);
}

export default LoginButton;
