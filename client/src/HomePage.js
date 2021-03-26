import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Redirect, Link } from "react-router-dom";
import { LoginButton, LogoutButton } from "./components/auth/log-buttons";

function HomePage() {
	const { user, isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return <div>Loading ...</div>;
	}

	console.log("welcome to the home page!");

	return (
		<>
			{isAuthenticated && <Link to={`/board`}>Enter the main board</Link>}
			<LoginButton />
			<LogoutButton />
		</>
	);
}

export default HomePage;
