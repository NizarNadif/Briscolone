import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Redirect, Link } from "react-router-dom";
import LogButton from "./LogButton";
import "../../assets/styles/home.css";

function HomePage() {
	return (
		<>
			<NavBar />
			<Content />
			<Footer />
		</>
	);
}

function NavBar() {
	return (
		<div className="navbar">
			<div>Briscolone online</div>
			<LogButton />
		</div>
	);
}

function Footer() {
	return (
		<div className="footer">
			<div className="copyright-container">
				<i className="far fa-copyright" aria-hidden="true"></i>
				<div className="autori">
					<p>Cornacchiari Roberto</p>
					<p>Nadif Nizar</p>
				</div>
			</div>
			<a href="https://github.com/NizarNadif/Briscolone" target="_blank">
				<i className="fab fa-github" aria-hidden="true"></i>
			</a>
		</div>
	);
}

function Content() {
	const { user, isAuthenticated, isLoading } = useAuth0();

	return (
		<div className="content">
			{isLoading ? (
				<div className="text">Loading ...</div>
			) : isAuthenticated ? (
				<>
					<div className="user">Welcome {user.name}</div>
					<Link to={`/board`} className="join">
						Join the game
					</Link>
				</>
			) : (
				<div className="text">You're not logged in</div>
			)}
		</div>
	);
}

export default HomePage;
