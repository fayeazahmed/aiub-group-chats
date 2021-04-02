import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Link } from "react-router-dom";

let socket;
let room;

const Chat = ({ match, user, bookmarks, setBookmarks }) => {
	const [text, setText] = useState("");
	const [messages, setMessages] = useState([]);
	const [bookmarked, setBookmarked] = useState(false);
	const [bmLoader, setBmLoader] = useState(false);
	const [userTyping, setUserTyping] = useState(false);
	const setRef = useCallback(
		(node) => node && node.scrollIntoView({ smooth: true }),
		[]
	);
	room = match.params.room;

	const sendMessage = (e) => {
		e.preventDefault();
		if (text !== "") {
			socket.emit("message", { text, user, room });
			setText("");
		}
	};

	const toggleBookmark = async () => {
		setBmLoader(true);
		try {
			if (bookmarked) {
				const { data } = await axios.delete(`/bookmarks/${user._id}`, {
					data: { room },
				});
				setBookmarked(false);
				setBookmarks((bookmarks) =>
					bookmarks.filter((b) => b._id !== data._id)
				);
				setBmLoader(false);
				return;
			}
			const { data } = await axios.post(`/bookmarks/${user._id}`, {
				room,
			});
			setBmLoader(false);
			setBookmarked(true);
			setBookmarks((bookmarks) => [...bookmarks, data]);
		} catch (e) {
			console.log(e.message);
		}
	};

	useEffect(() => {
		room = match.params.room;
		axios
			.get("/rooms/" + room)
			.then(({ data }) => {
				const formatted = data.map((message) => {
					message.createdAt = new Date(message.createdAt).toString();
					return message;
				});
				setMessages(formatted);
			})
			.catch(() => {});

		setBookmarked(false);
		if (bookmarks) {
			// eslint-disable-next-line
			bookmarks.map((b) => {
				if (b.room.courseNameFull === room) setBookmarked(true);
			});
		}

		socket = io("/");
		socket.emit("join", room);
		socket.on("message", (message) =>
			setMessages((messages) => [...messages, message])
		);

		socket.on("typing", () => {
			setUserTyping(true);
			setTimeout(() => {
				setUserTyping(false);
			}, 2500);
		});

		return () => socket.off();
		// eslint-disable-next-line
	}, [match.params.room]);

	useEffect(() => {
		setBookmarked(false);
		if (bookmarks) {
			// eslint-disable-next-line
			bookmarks.map((b) => {
				if (b.room.courseNameFull === room) setBookmarked(true);
			});
		}
		// eslint-disable-next-line
	}, [JSON.stringify(bookmarks)]);

	if (!user) return null;

	return (
		<div className="chat container">
			{bmLoader && (
				<i className="fa fa-circle-o-notch bmloader" aria-hidden="true"></i>
			)}
			<Link
				to="/"
				className="fa fa-angle-double-left btn btn-outline-dark backarrow"
				aria-hidden="true"
			></Link>
			<div onClick={toggleBookmark} className="chat__bookmark">
				<i
					className={`fa fa-bookmark${bookmarked ? "" : "-o"}`}
					aria-hidden="true"
				></i>
			</div>
			<div className="chat__header">
				<p>#</p>
				<h4>{room}</h4>
			</div>
			<div className="chat__container">
				{messages.length > 0 ? (
					messages.map((message, index) => {
						const { _id, text, user: sender, createdAt } = message;
						const dateArray = createdAt.split(" ");
						const month = dateArray[1];
						const date = dateArray[2];
						const year = dateArray[3];
						const time = dateArray[4];
						const lastMessage = messages.length - 1 === index;
						return (
							<div
								ref={lastMessage ? setRef : null}
								key={_id}
								className={`message ${
									sender._id === user._id ? "message--self" : ""
								}`}
							>
								<div className="message__dp">
									<i className="fa fa-user" aria-hidden="true"></i>
								</div>
								<div className="message__info">
									<div className="message__text">
										<p>{text}</p>
									</div>
									<div className="message__time">
										<h5>{sender.username}</h5>
										<h6>
											{" "}
											{month} {date} {year} - {time}
										</h6>
									</div>
								</div>
							</div>
						);
					})
				) : (
					<div className="message message--admin">
						<div className="message__dp">
							<i className="fa fa-user" aria-hidden="true"></i>
						</div>
						<div className="message__info">
							<div className="message__text">
								<p>
									Hey, looks like there hasn't been any messaging in this room
									yet. Care to start?
								</p>
							</div>
							<div className="message__time">
								<h5>ADMIN (no, bot... well hard coded html tbh)</h5>
								<h6>{new Date().toISOString()}</h6>
							</div>
						</div>
					</div>
				)}
			</div>
			{userTyping && (
				<div className="chat__typing">
					<p>An user is typing...</p>
				</div>
			)}
			<div className="chat__input">
				<form onSubmit={sendMessage}>
					<input
						value={text}
						onChange={(e) => {
							setText(e.target.value);
							socket.emit("typing", room);
						}}
						placeholder="Write a message..."
						type="text"
						className="form-control"
					/>
					<button className="btn btn-primary">
						<i className="fa fa-paper-plane-o" aria-hidden="true"></i>
					</button>
				</form>
			</div>
		</div>
	);
};

export default Chat;
