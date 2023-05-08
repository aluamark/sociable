import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import { IoMdClose } from "react-icons/io";
import { TbDragDrop } from "react-icons/tb";
import { FaSpinner } from "react-icons/fa";
import Dropzone from "react-dropzone";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const loginSchema = yup.object().shape({
	email: yup.string().email("invalid email").required("required"),
	password: yup.string().required("required"),
});

const initialValuesLogin = {
	email: "",
	password: "",
};

const registerSchema = yup.object().shape({
	firstName: yup.string().required("required"),
	lastName: yup.string().required("required"),
	email: yup.string().email("invalid email").required("required"),
	password: yup.string().required("required"),
	location: yup.string().required("required"),
	gender: yup.string().required("required"),
	pictureFile: yup.mixed().required(""),
});

const initialValuesRegister = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	location: "",
	gender: "",
	pictureFile: "",
};

const LoginPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [loginLoading, setLoginLoading] = useState(false);
	const [signupLoading, setSignupLoading] = useState(false);

	const successNotif = () =>
		toast.success("You are now registered.", {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		});

	const failNotif = (message) =>
		toast.error(message, {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		});

	const handleLogin = async (values) => {
		setLoginLoading(true);
		const formData = new FormData();
		for (let value in values) {
			formData.append(value, values[value]);
		}

		try {
			const response = await axios
				.post("https://smashbook-server.vercel.app/auth/login", formData, {
					headers: { "Content-Type": "application/json" },
				})
				.catch((error) => {
					return error.response.data;
				});

			if (response.error) {
				failNotif(response.error);
			} else {
				dispatch(
					setLogin({
						user: response.data.user,
						token: response.data.token,
					})
				);
				navigate("/home");
			}
		} catch (error) {
			throw new Error({ error: error.message });
		}
		setLoginLoading(false);
	};

	const handleRegister = async (values, onSubmitProps) => {
		setSignupLoading(true);
		const formData = new FormData();
		for (let value in values) {
			formData.append(value, values[value]);
		}

		try {
			const response = await axios
				.post("https://smashbook-server.vercel.app/auth/register", formData)
				.catch((error) => {
					return error.response.data;
				});

			if (response.error) {
				if (response.error.slice(0, 6) === "E11000") {
					failNotif("Email already registered.");
				} else {
					failNotif(response.error);
				}
			} else {
				onSubmitProps.resetForm();
				setShowModal(false);
				successNotif();
			}
		} catch (error) {
			throw new Error({ error: error.message });
		}
		setSignupLoading(false);
	};

	const handleFormSubmit = (values, onSubmitProps) => {
		if (!showModal) {
			handleLogin(values, onSubmitProps);
		} else {
			handleRegister(values, onSubmitProps);
		}
	};

	return (
		<div className="bg-neutral-100">
			<ToastContainer />
			<div className="h-screen flex flex-col md:flex-row justify-center items-center max-w-screen-xl mx-auto px-10">
				<div className="p-10 md:p-0 md:pr-10 text-center md:text-left max-w-md">
					<h1 className="text-blue-600 text-5xl font-bold pb-5">sociable</h1>
					<p className="text-2xl">
						Connect with friends and the world around you on Sociable.
					</p>
				</div>
				<div className="border bg-white rounded-xl shadow-xl p-5">
					<Formik
						onSubmit={handleFormSubmit}
						initialValues={initialValuesLogin}
						validationSchema={loginSchema}
					>
						{({
							values,
							handleBlur,
							handleChange,
							handleSubmit,
							resetForm,
						}) => (
							<form
								className="flex flex-col text-center w-80 md:w-96"
								onSubmit={handleSubmit}
							>
								<input
									className="my-1 p-3 border border-neutral-400 rounded"
									type="email"
									placeholder="Email address"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.email}
									name="email"
								/>
								<input
									className="my-1 p-3 border border-neutral-400 rounded"
									type="password"
									placeholder="Password"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.password}
									name="password"
								/>
								{loginLoading ? (
									<button
										type="submit"
										className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded my-3 px-5 py-3"
									>
										<FaSpinner className="my-1 mx-auto animate-spin" />
									</button>
								) : (
									<button
										type="submit"
										className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded my-3 px-5 py-3"
									>
										Log In
									</button>
								)}

								<div className="flex-none mb-3">
									<button className="text-blue-600 hover:text-blue-700">
										Forgot password?
									</button>
								</div>

								<hr />

								<div className="flex-none">
									<button
										type="button"
										onClick={() => {
											resetForm();
											setShowModal(true);
										}}
										className="bg-green-600 hover:bg-green-700 text-white font-bold rounded mt-5 px-5 py-3"
									>
										Create new account
									</button>
								</div>
							</form>
						)}
					</Formik>
				</div>
			</div>
			{showModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-[27rem] my-6 mx-auto max-w-3xl">
							{/*content*/}
							<Formik
								onSubmit={handleFormSubmit}
								initialValues={initialValuesRegister}
								validationSchema={registerSchema}
							>
								{({
									values,
									handleBlur,
									handleChange,
									handleSubmit,
									setFieldValue,
									resetForm,
								}) => (
									<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
										{/*header*/}

										<div className="flex items-start justify-between py-3 border-b border-solid border-slate-300 rounded-t">
											<div className="px-4">
												<h3 className="text-4xl font-semibold">Sign Up</h3>
												<p className="pt-1">It's quick and easy.</p>
											</div>

											<button
												className="pr-2 ml-auto text-neutral-600 float-right text-3xl"
												onClick={() => {
													resetForm();
													setShowModal(false);
												}}
											>
												<IoMdClose />
											</button>
										</div>
										{/*body*/}
										<div className="relative p-4">
											<form
												className="flex flex-col text-center"
												onSubmit={handleSubmit}
											>
												<div className="flex gap-3">
													<input
														className="px-3 py-2 bg-gray-200 border border-neutral-400 rounded w-1/2"
														type="text"
														placeholder="First name"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.firstName}
														name="firstName"
													/>
													<input
														className="px-3 py-2 bg-gray-200 border border-neutral-400 rounded w-1/2"
														type="text"
														placeholder="Last name"
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.lastName}
														name="lastName"
													/>
												</div>
												<input
													className="mt-3 px-3 py-2 bg-gray-200 border border-neutral-400 rounded"
													type="email"
													placeholder="Email address"
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.email}
													name="email"
												/>
												<input
													className="mt-3 px-3 py-2 bg-gray-200 border border-neutral-400 rounded"
													type="password"
													placeholder="New password"
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.password}
													name="password"
												/>
												<input
													className="mt-3 px-3 py-2 bg-gray-200 border border-neutral-400 rounded"
													type="text"
													placeholder="Location"
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.location}
													name="location"
												/>
												<input
													className="mt-3 px-3 py-2 bg-gray-200 border border-neutral-400 rounded"
													type="text"
													placeholder="Gender"
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.gender}
													name="gender"
												/>

												<span className="text-sm text-left mt-3">
													Profile picture
												</span>

												<Dropzone
													acceptedFiles=".jpg,.jpeg,.png"
													multiple={false}
													onDrop={(acceptedFiles) => {
														setFieldValue("pictureFile", acceptedFiles[0]);
													}}
												>
													{({ getRootProps, getInputProps }) => (
														<div
															className="px-3 py-2 border border-neutral-400 rounded cursor-pointer"
															{...getRootProps()}
														>
															<input
																{...getInputProps()}
																accept="image/png, image,jpg, image/jpeg,"
															/>
															{!values.pictureFile ? (
																<p className="flex justify-center items-center gap-1 border border-zinc-500 border-dashed">
																	<span>
																		<TbDragDrop />
																	</span>
																	Select/Drop picture{" "}
																</p>
															) : (
																<div>{values.pictureFile.name}</div>
															)}
														</div>
													)}
												</Dropzone>

												<span className="text-xs text-left mt-3">
													People who use our service may have uploaded your
													contact information to Smashbook.
												</span>
												<span className="text-xs text-left mt-3">
													By clicking Sign Up, you agree to our Terms, Privacy
													Policy and Cookies Policy. You may receive SMS
													Notifications from us and can opt out any time.
												</span>

												<div className="flex-none mb-3">
													{signupLoading ? (
														<button
															type="submit"
															className="bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded mt-5 px-16 pt-1 pb-2"
														>
															<FaSpinner className="my-1 mx-5 animate-spin" />
														</button>
													) : (
														<button
															type="submit"
															className="bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded mt-5 px-16 pt-1 pb-2"
														>
															Signup
														</button>
													)}
												</div>
											</form>
										</div>
									</div>
								)}
							</Formik>
						</div>
					</div>
					<div className="opacity-50 fixed inset-0 z-40 bg-neutral-300"></div>
				</>
			) : null}
		</div>
	);
};

export default LoginPage;
