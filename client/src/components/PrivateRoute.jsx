import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({
	user,
	bookmarks,
	setBookmarks,
	component: Component,
	...rest
}) => (
	<Route
		{...rest}
		render={(props) =>
			!user ? (
				<Redirect to="/" />
			) : (
				<Component
					{...props}
					bookmarks={bookmarks}
					setBookmarks={setBookmarks}
					user={user}
				/>
			)
		}
	/>
);

export default PrivateRoute;
