import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { setAllPosts } from "../../state";
import axios from "axios";
import Post from "./Post";

const Posts = ({ isProfile, profileLoading }) => {
	const dispatch = useDispatch();
	const { userId } = useParams();
	const token = useSelector((state) => state.token);
	const statePosts = useSelector((state) => state.posts);
	const reversedCopy = statePosts?.slice(0);
	const reversedPosts = reversedCopy?.reverse();
	const [loading, setLoading] = useState(false);

	const getUserPosts = async () => {
		setLoading(true);
		const posts = await axios.get(
			`https://smashbook-server.vercel.app/posts/${userId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		dispatch(setAllPosts({ posts: posts.data }));
		setLoading(false);
	};

	const getPosts = async () => {
		setLoading(true);
		const posts = await axios.get(
			"https://smashbook-server.vercel.app/posts/all",
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		dispatch(setAllPosts({ posts: posts.data }));
		setLoading(false);
	};

	useEffect(() => {
		if (isProfile) {
			getUserPosts();
		} else {
			getPosts();
		}
	}, [userId]);

	return (
		<div className="pb-3">
			{loading || profileLoading ? (
				<div className="bg-white dark:bg-zinc-800 dark:text-neutral-300 border dark:border-zinc-800 rounded-xl shadow px-4 pt-3">
					<div className="text-center py-48">
						<PropagateLoader color="#3B82F6" height={10} width={300} />
					</div>
				</div>
			) : (
				<div>
					{reversedPosts?.length === 0 ? (
						<div className="text-center dark:text-neutral-300">
							No posts available.
						</div>
					) : (
						<div className="flex flex-col gap-4">
							{reversedPosts?.map((post) => {
								return <Post key={post._id} post={post} />;
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Posts;
