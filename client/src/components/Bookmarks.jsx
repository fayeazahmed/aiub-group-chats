import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Bookmarks = ({ user, bookmarks, setBookmarks }) => {
	useEffect(() => {
		axios
			.get(`/bookmarks/${user._id}`)
			.then((res) => setBookmarks(res.data))
			.catch((e) => console.log(e.message));

		// eslint-disable-next-line
	}, [user, JSON.stringify(bookmarks)]);

	if (!user) return null;

	const handleDelete = async (e, room, id) => {
		e.preventDefault();
		await axios.delete(`/bookmarks/${user._id}`, {
			data: { room },
		});
		setBookmarks((bookmarks) => bookmarks.filter((b) => b._id !== id));
	};

	return (
		<div className="main__bookmarks">
			<header>
				Bookmarks &nbsp;
				<i className="fa fa-bookmark" aria-hidden="true"></i>
			</header>
			{bookmarks.length > 0 ? (
				bookmarks.map((bookmark) => {
					const { _id, room } = bookmark;
					return (
						<Link key={_id} to={`/${room.courseNameFull}`} className="bookmark">
							<i
								onClick={(e) => handleDelete(e, room.courseNameFull, _id)}
								className="fa fa-bookmark"
								aria-hidden="true"
							></i>
							<p>{room.courseNameFull}</p>
						</Link>
					);
				})
			) : (
				<div className="nobm">
					<p>You no bookmarks yet. Bookmark rooms for quick access.</p>
				</div>
			)}
		</div>
	);
};

export default Bookmarks;
