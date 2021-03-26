import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function LoginButton() {
	const { loginWithRedirect, isAuthenticated } = useAuth0();

	if (isAuthenticated) return <></>;

	return (
		<button className="btn-login" onClick={() => loginWithRedirect()}>
			Log In
		</button>
	);
}

export function LogoutButton() {
	const { logout, isAuthenticated } = useAuth0();

	if (!isAuthenticated) return <></>;

	return (
		<button
			className="btn-logout"
			onClick={() => logout({ returnTo: window.location.origin })}
		>
			Log Out
		</button>
	);
}
