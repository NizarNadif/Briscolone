import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function LogButton() {
	const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

	if (isAuthenticated)
		return (
			<button
				className="btn-logout"
				onClick={() => logout({ returnTo: window.location.origin })}
			>
				Log Out
				<i className="fas fas fa-door-open" aria-hidden="true"></i>
			</button>
		);

	return (
		<button className="btn-login" onClick={() => loginWithRedirect()}>
			Log In
			<i className="fas fa-sign-in-alt" aria-hidden="true"></i>
		</button>
	);
}
