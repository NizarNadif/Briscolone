import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Board } from "./Board";

function Profile() {
	const { user, isAuthenticated, isLoading } = useAuth0();
	const [enterBoard, setEnterBoard] = useState(false);

	if (isLoading) {
		return <div>Loading ...</div>;
	}

	console.log(user);

	return (
		isAuthenticated && (
			<>
				{!enterBoard && (
					<button
						onClick={() => {
							setEnterBoard(true);
						}}
					>
						Enter the main board
					</button>
				)}
				{enterBoard && <Board />}
			</>
		)
	);
}

export default Profile;
