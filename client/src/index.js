import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const rootElement = document.getElementById("app");

ReactDOM.render(
	<Auth0Provider
		domain={process.env.REACT_APP_AUTH_DOMAIN}
		clientId={process.env.REACT_APP_AUTH_CLIENTID}
		redirectUri={window.location.origin}
	>
		<App />
	</Auth0Provider>,
	rootElement
);
