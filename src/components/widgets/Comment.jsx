import React from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

const Comment = ({ comment }) => {
	const commentDate = new Date(comment.createdAt);

	return (
		<div key={comment._id} className="flex gap-1.5 pt-1.5">
			<div className="flex-none">
				<Link
					to={`/profile/${comment.userId}`}
					className="flex-none hover:brightness-110 rounded-full"
				>
					<img
						src={comment.userPicturePath}
						alt={comment.userPicturePath}
						className="w-9 h-9 object-cover rounded-full"
					/>
				</Link>
			</div>

			<div className="flex flex-col px-3 py-2 rounded-2xl bg-neutral-100 dark:bg-zinc-700">
				<div className="flex gap-1">
					<Link
						to={`/profile/${comment.userId}`}
						className="text-sm font-semibold hover:underline"
					>
						<span className="">{`${
							comment.firstName.charAt(0).toUpperCase() +
							comment.firstName.slice(1)
						} ${
							comment.lastName.charAt(0).toUpperCase() +
							comment.lastName.slice(1)
						}`}</span>
					</Link>
					<span className="text-zinc-500 dark:text-zinc-400 text-xs pt-0.5">
						<ReactTimeAgo
							date={commentDate}
							locale="en-US"
							timeStyle="twitter"
						/>
					</span>
				</div>
				<p className="text-sm">{comment.comment}</p>
			</div>
		</div>
	);
};

export default Comment;
