import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setProfileUser, setProfileFriends, setFriends } from "../../state";
import {
	MdEdit,
	MdEmail,
	MdPersonAddAlt1,
	MdPersonRemoveAlt1,
} from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { IoMdPerson, IoMdClose } from "react-icons/io";
import { ImFacebook, ImTwitter, ImHome3 } from "react-icons/im";
import axios from "axios";
import EditProfile from "./EditProfile";
import { PropagateLoader } from "react-spinners";

const Profile = ({ isProfile, setProfileLoading }) => {
	const dispatch = useDispatch();
	const { userId } = useParams();
	const { _id } = useSelector((state) => state.user);
	const token = useSelector((state) => state.token);
	const profileUserState = useSelector((state) => state.profileUser);
	const userState = useSelector((state) => state.user);
	const profileUser = isProfile ? profileUserState : userState;
	const [loading, setLoading] = useState(false);
	const [addLoading, setAddLoading] = useState(false);
	const [showPicture, setShowPicture] = useState(false);
	const [showEdit, setShowEdit] = useState(false);

	const getUser = async () => {
		setProfileLoading(true);
		setLoading(true);
		const response = await axios.get(
			`https://smashbook-server.vercel.app/users/${userId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		dispatch(setProfileUser({ profileUser: response.data }));

		const friends = await axios.get(
			`https://smashbook-server.vercel.app/users/${
				isProfile ? userId : _id
			}/friends`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		if (isProfile) {
			dispatch(setProfileFriends({ friends: friends.data }));
		} else {
			dispatch(setFriends({ friends: friends.data }));
		}
		setLoading(false);
		setProfileLoading(false);
	};

	const handleAddRemoveFriend = async () => {
		setAddLoading(true);
		const response = await fetch(
			`https://smashbook-server.vercel.app/users/${userId}/${_id}`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);
		const data = await response.json();

		dispatch(setProfileFriends({ friends: data }));
		setAddLoading(false);
	};

	useEffect(() => {
		if (isProfile) {
			getUser();
		}
	}, [userId, isProfile]);

	return (
		<div className="bg-white dark:bg-zinc-800 dark:text-neutral-300 border dark:border-zinc-800 rounded-xl shadow">
			{loading ? (
				<div className="text-center py-48 mb-3">
					<PropagateLoader color="#3B82F6" height={10} width={300} />
				</div>
			) : (
				<div>
					{profileUser && (
						<div>
							{showEdit ? (
								<EditProfile user={profileUser} setShowEdit={setShowEdit} />
							) : (
								<div className="p-4">
									<div className="flex pb-3">
										<img
											src={profileUser?.picturePath}
											alt={profileUser?.picturePath}
											className="flex-none hover:brightness-110 w-14 h-14 object-cover rounded-full cursor-pointer"
											onClick={() => setShowPicture(true)}
										/>

										<div className="flex flex-col pl-3 justify-center">
											<span className="font-bold">{`${
												profileUser.firstName?.charAt(0).toUpperCase() +
												profileUser?.firstName?.slice(1)
											} ${
												profileUser.lastName?.charAt(0).toUpperCase() +
												profileUser.lastName?.slice(1)
											}`}</span>
											<span className="text-sm">
												{profileUser.friends?.length}{" "}
												{`${
													profileUser.friends?.length > 1 ? "friends" : "friend"
												}`}
											</span>
										</div>
										{isProfile ? (
											<div className="ml-auto">
												{addLoading ? (
													<FaSpinner className="fill-blue-600 w-5 h-5 animate-spin" />
												) : (
													<div>
														{profileUser._id === _id ? (
															<MdEdit
																className="hover:fill-blue-500 fill-blue-600 w-5 h-5 cursor-pointer"
																onClick={() => setShowEdit(true)}
															/>
														) : (
															<div>
																{profileUser.friends.find(
																	(friend) => friend._id === _id
																) ? (
																	<div
																		onClick={() => handleAddRemoveFriend()}
																		className="flex items-center gap-1 text-xs bg-zinc-300 dark:bg-zinc-700 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white px-2 py-1 rounded cursor-pointer"
																	>
																		<MdPersonRemoveAlt1 className="w-5 h-5" />
																	</div>
																) : (
																	<div
																		onClick={() => handleAddRemoveFriend()}
																		className="flex items-center gap-1 text-xs bg-zinc-300 dark:bg-zinc-700 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white px-2 py-1 rounded cursor-pointer"
																	>
																		<MdPersonAddAlt1 className="w-5 h-5" />
																	</div>
																)}
															</div>
														)}
													</div>
												)}
											</div>
										) : null}
									</div>

									<div className="border-y border-neutral-300 dark:border-zinc-700 flex flex-col gap-2 py-3 text-sm">
										<div className="flex gap-2 items-center">
											<ImHome3 className="w-5 h-5" />
											<div>
												Lives in{" "}
												<span className="font-semibold">
													{profileUser.location}
												</span>
											</div>
										</div>
										<div className="flex gap-2 items-center">
											<IoMdPerson className="w-5 h-5" />
											{profileUser.gender}
										</div>
									</div>

									<div className="flex flex-col py-3">
										<div className="flex justify-between text-sm">
											<span>Profile views</span>
											<span className="font-semibold">
												{profileUser.viewedProfile}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Posts engagements</span>
											<span className="font-semibold">
												{profileUser.impressions}
											</span>
										</div>
									</div>

									<div className="border-t border-neutral-300 dark:border-zinc-700 pt-2">
										<span className="font-semibold text-sm">
											Social Profiles
										</span>
										<div className="flex flex-col gap-1">
											<div className="flex items-center gap-2 text-sm">
												<MdEmail className="w-5 h-5" />
												<div className="flex flex-col">
													<span>Email</span>
													<span>{profileUser.email}</span>
												</div>
											</div>
											<div className="flex items-center gap-2 text-sm">
												<ImFacebook className="w-5 h-5" />
												<div className="flex flex-col">
													<span>Facebook</span>
													{profileUser.facebook ? (
														<a
															href={`https://facebook.com/${profileUser.facebook}`}
															target="blank"
															className="text-blue-500"
														>
															facebook.com/{profileUser.facebook}
														</a>
													) : (
														"Facebook not linked"
													)}
												</div>
											</div>
											<div className="flex items-center gap-2 text-sm">
												<ImTwitter className="w-5 h-5" />
												<div className="flex flex-col">
													<span>Twitter</span>
													{profileUser.twitter ? (
														<a
															href={`https://twitter.com/${profileUser.twitter}`}
															className="text-blue-500"
															target="blank"
														>
															twitter.com/{profileUser.twitter}
														</a>
													) : (
														"Twitter not linked"
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			)}

			{showPicture && (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-[35rem] mx-auto">
							<div className="flex flex-col py-3">
								<button
									className="pr-2 ml-auto text-neutral-600 text-3xl"
									onClick={() => {
										setShowPicture(false);
									}}
								>
									<IoMdClose />
								</button>
								<div className="px-10">
									<img
										src={profileUser?.picturePath}
										alt={profileUser?.picturePath}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-80 fixed inset-0 z-40 bg-neutral-300"></div>
				</>
			)}
		</div>
	);
};

export default Profile;
