import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";
import { setFriends } from "../../state";

const Liker = ({ liker, setShowLikers }) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const token = useSelector((state) => state.token);
	const [addLoading, setAddLoading] = useState(false);

	const handleAddRemoveFriend = async (friendId) => {
		setAddLoading(true);
		const response = await fetch(
			`https://smashbook-server.vercel.app/users/${user._id}/${friendId}`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);
		const data = await response.json();

		dispatch(setFriends({ friends: data }));

		setAddLoading(false);
	};

	return (
		<div key={liker.userId} className="flex items-center text-sm py-2">
			<Link
				to={`/profile/${liker.userId}`}
				key={liker._id}
				onClick={() => setShowLikers(false)}
			>
				<img
					src={liker.userPicturePath}
					alt={liker.userPicturePath}
					className="w-9 h-9 object-cover rounded-full hover:brightness-110"
				/>
			</Link>

			<Link
				to={`/profile/${liker.userId}`}
				key={liker._id}
				onClick={() => setShowLikers(false)}
			>
				<div className="flex flex-col pl-3 hover:underline">
					<span className="font-semibold">{`${
						liker.firstName?.charAt(0).toUpperCase() + liker.firstName?.slice(1)
					} ${
						liker.lastName?.charAt(0).toUpperCase() + liker.lastName?.slice(1)
					}`}</span>
				</div>
			</Link>
			<div className="ml-auto">
				{liker.userId === user._id ? (
					<span className="text-xs text-neutral-500 dark:text-zinc-400">
						You
					</span>
				) : null}
				{user.friends.filter((friend) => friend._id === liker.userId).length !==
				0 ? (
					<span className="text-xs text-neutral-500 dark:text-zinc-400">
						Friend
					</span>
				) : null}
				{liker.userId !== user._id &&
					user.friends.filter((friend) => friend._id === liker.userId)
						.length === 0 && (
						<div>
							{addLoading ? (
								<div
									onClick={() => handleAddRemoveFriend(liker.userId)}
									className="flex items-center gap-1 text-xs bg-zinc-300 dark:bg-zinc-700 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white px-2 py-1 rounded cursor-pointer"
								>
									<FaSpinner className="w-5 h-5 animate-spin" />
									<span className="font-semibold">Follow</span>
								</div>
							) : (
								<div
									onClick={() => handleAddRemoveFriend(liker.userId)}
									className="flex items-center gap-1 text-xs bg-zinc-300 dark:bg-zinc-700 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white px-2 py-1 rounded cursor-pointer"
								>
									<MdPersonAddAlt1 className="w-5 h-5" />
									<span className="font-semibold">Follow</span>
								</div>
							)}
						</div>
					)}
			</div>
		</div>
	);
};

export default Liker;
