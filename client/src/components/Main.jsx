import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Bookmarks from "./Bookmarks";

const Main = ({
	user,
	bookmarks,
	setBookmarks,
	searchResult,
	setSearchResult,
}) => {
	const { username, _id } = user;
	const [query, setQuery] = useState("");
	const [newName, setNewName] = useState(username);
	const [loading, setLoading] = useState(false);
	const [changeNameForm, setChangeNameForm] = useState(false);
	const [nameError, setNameError] = useState(false);

	const search = async (e) => {
		setQuery(e.target.value);
		if (e.target.value.length > 2) {
			setLoading(true);
			try {
				const { data } = await axios.post(`/rooms/search`, {
					query: e.target.value,
				});
				setSearchResult(data);
			} catch (error) {
				if (error.response.status !== 404) console.log(error.message);
			}
			setLoading(false);
		}
	};

	const changeName = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(`/users/${_id}`, {
				username: newName,
			});
			setNewName(data.username);
			localStorage.setItem("aiub-gc-id", data.username);
			setChangeNameForm(false);
		} catch (error) {
			if (error.response.status === 406) {
				setNewName(username);
				setNameError(true);
				console.log("entered");
				setTimeout(() => {
					setNameError(false);
					setChangeNameForm(false);
				}, 2000);
			}
		}
	};

	if (!user) return null;

	return (
		<div className="main">
			<div className="main__welcome">
				<h4>
					Hello, <span>{newName}</span>
				</h4>
				<h5>
					This is just a random id generated as your username. Your chats will
					be preserved for the semester as long as you don't clear the browsing
					data. So you can edit your username{" "}
					<span onClick={() => setChangeNameForm(true)}>clicking here</span>.
					But upon clearing localstorage, the reference to this account will be
					gone. It's not necessary anyway, so didn't implement any login system.
				</h5>
				{changeNameForm && (
					<form onSubmit={changeName}>
						{nameError && (
							<div className="alert alert-warning">Username already taken!</div>
						)}
						<i
							onClick={() => setChangeNameForm(false)}
							className="fa fa-times-circle"
							aria-hidden="true"
						></i>
						<input
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							className="form-control"
							type="text"
						/>
					</form>
				)}
			</div>
			<div className="main__form">
				{loading && (
					<i className="fa fa-circle-o-notch formloader" aria-hidden="true"></i>
				)}
				<form onSubmit={(e) => e.preventDefault()}>
					<label htmlFor="courseName">Search for a course: </label>
					<input
						value={query}
						onChange={search}
						className="form-control"
						type="text"
						name="courseName"
						id="courseName"
						placeholder="e.g. physics 2, introduction to... (cse courses)"
					/>
				</form>
				{searchResult.length > 0 ? (
					<div
						onClick={() => {
							setQuery("");
							setSearchResult([]);
						}}
						className="searchResults"
					>
						<p className="searchResults__info">RESULTS: </p>
						<button
							onClick={() => {
								setQuery("");
								setSearchResult([]);
							}}
							className="btn btn-outline-danger btn-sm"
						>
							<i className="fa fa-times-circle" aria-hidden="true"></i>
						</button>
						{searchResult.map(({ courseNameFull, _id }) => (
							<Link
								to={`/${courseNameFull}`}
								key={_id}
								href="/"
								className="searchResults__element"
							>
								<i className="fa fa-comments-o" aria-hidden="true"></i>
								<p>{courseNameFull}</p>
							</Link>
						))}
					</div>
				) : null}
			</div>
			<Bookmarks
				bookmarks={bookmarks}
				setBookmarks={setBookmarks}
				user={user}
			/>
		</div>
	);
};

export default Main;
