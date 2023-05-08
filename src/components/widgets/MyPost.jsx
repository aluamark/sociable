import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { TbDragDrop } from "react-icons/tb";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAllPosts } from "../../state";
import { PropagateLoader } from "react-spinners";

const MyPost = ({ setNewPostLoading, isProfile, profileLoading }) => {
	const dispatch = useDispatch();
	const dark = useSelector((state) => state.dark);
	const { _id } = useSelector((state) => state.user);
	const token = useSelector((state) => state.token);
	const [post, setPost] = useState("");
	const [image, setImage] = useState(null);
	const { picturePath } = useSelector((state) => state.user);
	const [loading, setLoading] = useState(null);

	const successNotif = () =>
		toast.success("Posted.", {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: dark ? "dark" : "light",
		});

	const failNotif = () =>
		toast.error("Unable to post. Please try again.", {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: dark ? "dark" : "light",
		});

	const handlePostSubmit = () => {
		if (post.trim() !== "" || image !== null) {
			const submitPost = async () => {
				setLoading(true);
				setNewPostLoading(true);
				const formData = new FormData();
				formData.append("userId", _id);
				formData.append("description", post);

				if (image) {
					formData.append("pictureFile", image);
				}

				try {
					const posts = await axios.post(
						"https://smashbook-server.vercel.app/posts",
						formData,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					if (isProfile) {
						dispatch(
							setAllPosts({
								posts: posts.data.filter((post) => post.userId === _id),
							})
						);
					} else {
						dispatch(setAllPosts({ posts: posts.data }));
					}
					setImage(null);
					setPost("");
				} catch (error) {
					throw new Error({ error: error.message });
				}
				setNewPostLoading(false);
				setLoading(false);
			};

			submitPost().then(
				() => {
					successNotif();
				},
				() => {
					failNotif();
				}
			);
		}
	};

	return (
		<div className="bg-white dark:bg-zinc-800 dark:text-neutral-300 border dark:border-zinc-800 rounded-xl shadow px-4">
			{profileLoading ? (
				<div className="text-center py-20">
					<PropagateLoader color="#3B82F6" height={10} width={300} />
				</div>
			) : (
				<>
					<ToastContainer />
					<div className="flex items-center gap-3 border-b border-neutral-300 dark:border-zinc-700">
						<div className="flex-none">
							<img
								src={picturePath}
								alt={picturePath}
								className="w-14 h-14 object-cover rounded-full mx-auto"
							/>
						</div>

						<textarea
							className="w-full my-3 p-3 bg-slate-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 outline-none cursor-pointer rounded"
							type="text"
							placeholder="What's on your mind?"
							name="post"
							value={post}
							onChange={(e) => setPost(e.target.value)}
							required
						/>
					</div>

					<div className="flex justify-end items-center gap-3">
						<div className="flex border border-zinc-500 border-dashed items-center rounded">
							<Dropzone
								acceptedFiles=".jpg,.jpeg,.png"
								multiple={false}
								onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
							>
								{({ getRootProps, getInputProps }) => (
									<div
										className="py-1.5 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700"
										{...getRootProps()}
									>
										<input
											{...getInputProps()}
											accept="image/png, image,jpg, image/jpeg,"
										/>
										{!image ? (
											<p className="flex justify-center items-center gap-1 px-3">
												<span>
													<TbDragDrop />
												</span>
												Photo{" "}
											</p>
										) : (
											<span className="px-3">{image.name}</span>
										)}
									</div>
								)}
							</Dropzone>
							{image && (
								<div
									onClick={() => setImage(null)}
									className="border-l border-zinc-500 border-dashed group cursor-pointer p-2 hover:bg-zinc-300 group"
								>
									<MdDelete className="fill-red-600 group-hover:fill-red-500 w-5 h-6" />
								</div>
							)}
						</div>

						{loading ? (
							<button className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-sm font-semibold rounded m-3 px-10 py-3">
								<FaSpinner className="mx-3 w-5 h-5 animate-spin" />
							</button>
						) : (
							<button
								onClick={handlePostSubmit}
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-sm font-semibold rounded my-3 px-10 py-2.5"
							>
								POST
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default MyPost;
