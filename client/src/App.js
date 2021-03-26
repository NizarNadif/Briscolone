import React from "react";
import LoginButton from "./components/auth/LoginButton";
import LogoutButton from "./components/auth/LogoutButton";
import MainPage from "./MainPage";

export function App() {
	return (
		<div className="app">
			<LoginButton />
			<LogoutButton />
			<MainPage />
		</div>
	);
}
