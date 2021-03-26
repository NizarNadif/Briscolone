import React from "react";
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import HomePage from "./HomePage";
import Board from "./components/board/Board";
import PrivateRoute from "./components/PrivateRoute";

export function App() {
	return (
		<>
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={HomePage} />
					<PrivateRoute exact path="/board" component={Board} />
				</Switch>
			</BrowserRouter>
		</>
	);
}
