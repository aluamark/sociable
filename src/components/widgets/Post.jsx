import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { FaCommentAlt, FaSpinner } from "react-icons/fa";
import { IoMdShareAlt, IoMdClose } from "react-icons/io";
import { MdSend } from "react-icons/md";
import { MdThumbUp } from "react-icons/md";
import { setPost } from "../../state";
import ReactTimeAgo from "react-time-ago";
import Comment from "./Comment";
import Liker from "./Liker";

const Post = ({ post }) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const token = useSelector((state) => state.token);
	const [comment, setComment] = useState("");
	const [commentLoading, setCommentLoading] = useState(false);
	const inputRef = useRef(null);
	const [showPicture, setShowPicture] = useState(false);
	const [showLikers, setShowLikers] = useState(false);
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const postDate = new Date(post.createdAt);

	const handleAddComment = async () => {
		if (comment) {
			setCommentLoading(true);
			const response = await fetch(
				`https://smashbook-server.vercel.app/posts/${post._id}/comment`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: user._id,
						comment,
						userPicturePath: user.picturePath,
						firstName: user.firstName,
						lastName: user.lastName,
					}),
				}
			);

			const data = await response.json();
			dispatch(setPost({ post: data }));
			setComment("");
			setCommentLoading(false);
		}
	};

	const patchLike = async (postId) => {
		const response = await fetch(
			`https://smashbook-server.vercel.app/posts/${postId}/like`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: user._id,
					userPicturePath: user.picturePath,
					firstName: user.firstName,
					lastName: user.lastName,
				}),
			}
		);

		const updatedPost = await response.json();

		dispatch(setPost({ post: updatedPost }));
	};

	const replacePostWithUrls = (post) => {
		return post.replace(urlRegex, '<a href="$1" target="blank">$1</a>');
	};

	return (
		<div className="bg-white dark:bg-zinc-800 dark:text-neutral-300 border dark:border-zinc-800 rounded-xl shadow px-4 pt-3">
			<div className="flex items-center">
				<Link
					to={`/profile/${post.userId}`}
					className="hover:brightness-110 rounded-full"
				>
					<img
						src={post.userPicturePath}
						alt={post.userPicturePath}
						className="w-10 h-10 object-cover rounded-full"
					/>
				</Link>

				<div className="flex flex-col pl-3 justify-center">
					<Link to={`/profile/${post.userId}`}>
						<div className="hover:underline">
							<span className="text-sm font-semibold">{`${
								post.firstName.charAt(0).toUpperCase() + post.firstName.slice(1)
							} ${
								post.lastName.charAt(0).toUpperCase() + post.lastName.slice(1)
							}`}</span>
						</div>
					</Link>
					<span className="text-zinc-500 dark:text-zinc-400 text-xs">
						<ReactTimeAgo date={postDate} locale="en-US" />
					</span>
				</div>
			</div>
			{post.description ? (
				<div className="pt-1">
					<span
						className="text-sm whitespace-pre-wrap post-links"
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(replacePostWithUrls(post.description)),
						}}
					></span>
				</div>
			) : null}

			{post.picturePath ? (
				<div className="flex pt-3">
					<img
						src={post.picturePath}
						alt={post.picturePath}
						onClick={() => setShowPicture(true)}
						className="mx-auto cursor-pointer"
					/>
				</div>
			) : null}

			{/* POST LIKES */}
			{post.likes.length !== 0 && (
				<div className="flex border-t border-neutral-300 dark:border-zinc-700 mt-3 text-zinc-500 dark:text-neutral-400 pt-2.5 text-sm">
					<span
						onClick={() => setShowLikers(true)}
						className="hover:underline cursor-pointer"
					>{`${post.likes.length} ${
						post.likes.length > 1 ? " likes" : " like"
					}`}</span>
				</div>
			)}

			{/* POST CONTROLS */}
			<div className="border-t border-neutral-300 dark:border-zinc-700 mt-3 text-zinc-500 dark:text-neutral-400">
				<div className="flex justify-around gap-1 text-sm font-semibold cursor-pointer my-1">
					<div
						className="flex justify-center items-center w-full hover:bg-neutral-100 dark:hover:bg-zinc-700 py-1 rounded duration"
						onClick={() => patchLike(post._id)}
					>
						{post.likes.filter((liker) => liker.userId === user._id).length !==
						0 ? (
							<div className="flex gap-2 text-blue-500">
								<MdThumbUp className="w-5 h-5" />
								Like
							</div>
						) : (
							<div className="flex gap-2">
								<MdThumbUp className="w-5 h-5" />
								Like
							</div>
						)}
					</div>
					<div
						className="flex justify-center items-center w-full gap-2 hover:bg-neutral-100 dark:hover:bg-zinc-700 py-1 rounded"
						onClick={() => {
							inputRef.current.focus();
						}}
					>
						<FaCommentAlt /> Comment
					</div>
					{/* <div className="flex justify-center items-center w-full gap-1 hover:bg-neutral-100 dark:hover:bg-zinc-700 py-1 rounded">
						<IoMdShareAlt className="w-6 h-6" /> Share
					</div> */}
				</div>
			</div>

			<div className="border-t border-neutral-300 dark:border-zinc-700">
				{post.comments.length !== 0 &&
					post.comments.map((comment) => (
						<Comment key={comment._id} comment={comment} />
					))}
			</div>

			<div className="flex gap-1.5 pb-2 pt-2.5">
				<div className="flex-none">
					<Link
						to={`/profile/${user._id}`}
						className="hover:brightness-110 rounded-full"
					>
						<img
							src={user.picturePath}
							alt={user.picturePath}
							className="w-9 h-9 object-cover rounded-full"
						/>
					</Link>
				</div>

				<input
					type="text"
					placeholder="Write a comment..."
					className="bg-slate-100 dark:border-zinc-700 dark:bg-zinc-700 px-3 w-full rounded-full outline-0"
					ref={inputRef}
					name="comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>

				{commentLoading ? (
					<button
						onClick={handleAddComment}
						type="submit"
						className="flex bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 cursor-pointer p-2 rounded-full gap-3"
					>
						<FaSpinner className="fill-blue-500 w-5 h-5 rounded-full animate-spin" />
					</button>
				) : (
					<button
						onClick={handleAddComment}
						type="submit"
						className="flex bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 cursor-pointer p-2 rounded-full gap-3"
					>
						<MdSend className="fill-blue-500 w-5 h-5 rounded-full" />
					</button>
				)}
			</div>

			{showPicture && (
				<>
					<div className="md:flex justify-end items-center overflow-x-hidden overflow-y-hidden fixed inset-0 z-30 outline-none focus:outline-none">
						<div className="flex flex-col items-center w-full md:h-full bg-black">
							<div className="bg-white dark:bg-zinc-800 w-full md:w-0 md:fixed left-0">
								<button
									className="m-3 p-1 bg-zinc-400 dark:bg-zinc-800 hover:bg-zinc-500 dark:hover:bg-zinc-700 rounded-full"
									onClick={() => {
										setShowPicture(false);
									}}
								>
									<IoMdClose className="w-6 h-6" />
								</button>
							</div>

							<div className="my-auto">
								<div className="w-auto mx-auto">
									<img
										src={post.picturePath}
										alt={post.picturePath}
										className="w-auto max-h-[35rem] md:max-h-[60rem] mx-auto"
									/>
								</div>
							</div>
						</div>
						<div className="h-full md:w-[416px] mx-auto border bg-white dark:bg-zinc-800 dark:text-neutral-300 dark:border-zinc-800 px-4 py-3">
							<div className="flex flex-col border-b border-neutral-300 dark:border-zinc-700">
								{/* POST USER */}
								<div className="flex items-center">
									<Link
										to={`/profile/${post.userId}`}
										className="hover:brightness-110 rounded-full"
									>
										<img
											src={post.userPicturePath}
											alt={post.userPicturePath}
											className="w-12 h-12 object-cover rounded-full"
										/>
									</Link>

									<div className="flex flex-col pl-3 justify-center">
										<Link to={`/profile/${post.userId}`}>
											<div className="hover:underline">
												<span className="font-semibold">{`${
													post.firstName.charAt(0).toUpperCase() +
													post.firstName.slice(1)
												} ${
													post.lastName.charAt(0).toUpperCase() +
													post.lastName.slice(1)
												}`}</span>
											</div>
										</Link>
										<span className="text-zinc-500 text-xs">
											<ReactTimeAgo date={postDate} locale="en-US" />
										</span>
									</div>
								</div>
								<div className="pt-2">
									<span
										className="text-sm whitespace-pre-wrap post-links"
										dangerouslySetInnerHTML={{
											__html: DOMPurify.sanitize(
												replacePostWithUrls(post.description)
											),
										}}
									></span>
								</div>

								{/* POST LIKES */}
								{post.likes.length !== 0 && (
									<div className="flex border-t border-neutral-300 dark:border-zinc-700 mt-3 text-zinc-500 dark:text-neutral-400 pt-2.5 text-sm">
										<span
											onClick={() => setShowLikers(true)}
											className="hover:underline cursor-pointer"
										>{`${post.likes.length} ${
											post.likes.length > 1 ? " likes" : " like"
										}`}</span>
									</div>
								)}

								{/* POST CONTROLS */}
								<div className="border-t border-neutral-300 dark:border-zinc-700 mt-3 text-zinc-500 dark:text-neutral-400">
									<div className="flex justify-around gap-1 text-sm font-semibold cursor-pointer my-1">
										<div
											className="flex justify-center items-center w-full hover:bg-neutral-100 dark:hover:bg-zinc-700 py-1 rounded duration"
											onClick={() => patchLike(post._id)}
										>
											{post.likes.filter((liker) => liker.userId === user._id)
												.length !== 0 ? (
												<div className="flex gap-2 text-blue-500">
													<MdThumbUp className="w-5 h-5" />
													Like
												</div>
											) : (
												<div className="flex gap-2">
													<MdThumbUp className="w-5 h-5" />
													Like
												</div>
											)}
										</div>
										<div
											className="flex justify-center items-center w-full gap-2 hover:bg-neutral-100 dark:hover:bg-zinc-700 py-1 rounded"
											onClick={() => {
												inputRef.current.focus();
											}}
										>
											<FaCommentAlt /> Comment
										</div>
										{/* <div className="flex justify-center items-center w-full gap-1 hover:bg-neutral-100 dark:hover:bg-zinc-700 py-1 rounded">
											<IoMdShareAlt className="w-6 h-6" /> Share
										</div> */}
									</div>
								</div>

								{/* COMMENTS */}
								<div className="border-t border-neutral-300 dark:border-zinc-700">
									{post.comments.length !== 0 &&
										post.comments.map((comment) => (
											<Comment key={comment._id} comment={comment} />
										))}
								</div>

								{/* INPUT COMMENT */}
								<div className="flex gap-1 pb-2 pt-2.5">
									<div className="flex-none">
										<Link
											to={`/profile/${user._id}`}
											className="hover:brightness-110 rounded-full"
										>
											<img
												src={user.picturePath}
												alt={user.picturePath}
												className="w-9 h-9 object-cover rounded-full"
											/>
										</Link>
									</div>

									<input
										type="text"
										placeholder="Write a comment..."
										className="bg-slate-100 dark:border-zinc-700 dark:bg-zinc-700 pl-3 w-full rounded-full outline-0"
										ref={inputRef}
										name="comment"
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>

									{commentLoading ? (
										<button
											onClick={handleAddComment}
											type="submit"
											className="flex bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 cursor-pointer p-2 rounded-full gap-3"
										>
											<FaSpinner className="fill-blue-500 w-5 h-5 rounded-full animate-spin" />
										</button>
									) : (
										<button
											onClick={handleAddComment}
											type="submit"
											className="flex bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 cursor-pointer p-2 rounded-full gap-3"
										>
											<MdSend className="fill-blue-500 w-5 h-5 rounded-full" />
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-80 fixed inset-0 z-20 bg-neutral-300"></div>
				</>
			)}

			{showLikers ? (
				<>
					<div className="flex justify-center items-center fixed inset-0 z-50">
						<div className="relative w-[33rem] my-6 md:mx-auto mx-1">
							{/*content*/}
							<div className="flex flex-col gap-3 rounded-lg bg-white dark:bg-zinc-800 px-4 py-3">
								{/*header*/}
								<div className="flex items-start justify-between">
									<div className="self-center font-semibold pb-2 px-3 border-b-2 border-blue-500 text-blue-500">
										Likes
									</div>

									<button
										className="ml-auto bg-neutral-200 dark:bg-zinc-700 hover:bg-neutral-300 dark:hover:bg-zinc-600 rounded-full p-2"
										onClick={() => {
											setShowLikers(false);
										}}
									>
										<IoMdClose className="w-5 h-5" />
									</button>
								</div>
								{/*body*/}

								{post.likes.map((liker) => (
									<Liker
										key={liker.userId}
										liker={liker}
										setShowLikers={setShowLikers}
									/>
								))}
							</div>
						</div>
					</div>
					<div className="opacity-50 fixed inset-0 z-40 bg-neutral-300 dark:bg-black"></div>
				</>
			) : null}
		</div>
	);
};

export default Post;
