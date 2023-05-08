import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import Dropzone from "react-dropzone";
import { MdEmail, MdLocationPin } from "react-icons/md";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { ImFacebook, ImTwitter } from "react-icons/im";
import { setUpdatedUser, setProfileFriends } from "../../state";
import axios from "axios";

const EditProfile = ({ user, setShowEdit }) => {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.token);
	const [loading, setLoading] = useState(false);

	const initialValues = {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		location: user.location,
		gender: user.gender,
		pictureFile: user.pictureFile,
		facebook: user.facebook,
		twitter: user.twitter,
	};

	const handleEditUser = async (values) => {
		setLoading(true);

		const formData = new FormData();
		for (let value in values) {
			formData.append(value, values[value]);
		}

		formData.append("userId", user._id);
		formData.delete("preview");

		let myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${token}`);

		var requestOptions = {
			method: "PATCH",
			headers: myHeaders,
			body: formData,
			redirect: "follow",
		};

		const response = fetch(
			"https://smashbook-server.vercel.app/users/updateUser",
			requestOptions
		)
			.then((response) => response.json())
			.then((result) => result)
			.catch((error) => {
				throw new Error({ error: error.message });
			});

		const data = await response;

		dispatch(setUpdatedUser(data));

		const friendsResponse = await axios.get(
			`https://smashbook-server.vercel.app/users/${user._id}/friends`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const friendsData = friendsResponse.data;

		dispatch(setProfileFriends({ friends: friendsData }));
		setLoading(false);
		setShowEdit(false);
	};

	return (
		<Formik onSubmit={handleEditUser} initialValues={initialValues}>
			{({ values, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
				<form onSubmit={handleSubmit}>
					<div className="flex p-3">
						<Dropzone
							acceptedFiles=".jpg,.jpeg,.png"
							multiple={false}
							onDrop={(acceptedFiles) => {
								setFieldValue("pictureFile", acceptedFiles[0]);
								setFieldValue("preview", URL.createObjectURL(acceptedFiles[0]));
							}}
						>
							{({ getRootProps, getInputProps }) => (
								<div {...getRootProps()} className="flex-none cursor-pointer">
									<input
										{...getInputProps()}
										accept="image/png, image,jpg, image/jpeg,"
									/>
									{!values.pictureFile ? (
										<img
											src={user?.picturePath}
											alt={user?.picturePath}
											className="hover:brightness-125 w-14 h-14 object-cover rounded-full"
											name="pictureFile"
										/>
									) : (
										<img
											src={values.preview}
											alt={values.preview}
											className="hover:brightness-125 w-14 h-14 object-cover rounded-full"
										/>
									)}
								</div>
							)}
						</Dropzone>

						<div className="flex flex-col pl-3 gap-1 justify-center">
							<span className="flex">
								<input
									type="text"
									className="border border-neutral-400 dark:border-zinc-400 rounded dark:bg-zinc-700 outline-none cursor-pointer px-1"
									placeholder={`${
										user.firstName?.charAt(0).toUpperCase() +
										user?.firstName?.slice(1)
									}`}
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.firstName}
									name="firstName"
								/>
							</span>
							<span>
								<input
									type="text"
									className="border border-neutral-400 dark:border-zinc-400 rounded dark:bg-zinc-700 outline-none cursor-pointer px-1"
									placeholder={`${
										user.lastName?.charAt(0).toUpperCase() +
										user.lastName?.slice(1)
									}`}
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.lastName}
									name="lastName"
								/>
							</span>
						</div>
						<div className="ml-auto">
							{loading ? (
								<FaSpinner className="fill-blue-600 w-5 h-5 animate-spin" />
							) : (
								<button type="submit">
									<FaCheck className="ml-3 hover:fill-blue-500 fill-blue-600 w-5 h-5" />
								</button>
							)}
						</div>
					</div>

					<div className="px-3">
						<hr />
					</div>

					<div className="flex flex-col gap-1 p-3 text-sm">
						<div className="flex gap-1 items-center">
							<MdLocationPin className="w-5 h-5" />
							<input
								className="border border-neutral-400 dark:border-zinc-400 rounded dark:bg-zinc-700 outline-none cursor-pointer px-1"
								type="text"
								placeholder={user.location}
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.location}
								name="location"
							/>
						</div>
						<div className="flex gap-1 items-center">
							<IoMdPerson className="w-5 h-5" />
							<input
								className="border border-neutral-400 dark:border-zinc-400 rounded dark:bg-zinc-700 outline-none cursor-pointer px-1"
								type="text"
								placeholder={user.gender}
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.gender}
								name="gender"
							/>
						</div>
					</div>

					<div className="px-3">
						<hr />
					</div>

					<div className="flex flex-col p-3">
						<div className="flex justify-between text-sm">
							<span>Profile views</span>
							<span className="font-semibold">{user.viewedProfile}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span>Posts engagements</span>
							<span className="font-semibold">{user.impressions}</span>
						</div>
					</div>

					<div className="px-3">
						<hr />
					</div>

					<div className="p-3">
						<span className="font-semibold text-sm">Social Profiles</span>
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-2 text-sm">
								<MdEmail className="w-5 h-5" />
								<div className="flex flex-col">
									<span>Email</span>
									<input
										className="border border-neutral-400 dark:border-zinc-400 rounded dark:bg-zinc-700 outline-none cursor-pointer px-1"
										placeholder={user.email}
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.email}
										name="email"
									/>
								</div>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<ImFacebook className="w-5 h-5" />
								<div className="flex flex-col">
									<span>Facebook</span>
									<div className="flex">
										facebook.com/
										<input
											className="border border-neutral-400 dark:border-zinc-400 rounded dark:bg-zinc-700 outline-none cursor-pointer px-1"
											type="text"
											placeholder={user.facebook}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.facebook}
											name="facebook"
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<ImTwitter className="w-5 h-5" />
								<div className="flex flex-col">
									<span>Twitter</span>
									<div className="flex">
										twitter.com/
										<input
											className="border border-neutral-400 dark:border-zinc-400 rounded dark:bg-zinc-700 outline-none cursor-pointer px-1"
											type="text"
											placeholder={user.twitter}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.twitter}
											name="twitter"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			)}
		</Formik>
	);
};

export default EditProfile;
