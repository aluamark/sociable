import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDark, setLogout } from "../../state/index";
import { useNavigate } from "react-router-dom";
import { MdLightMode, MdDarkMode, MdLogout, MdArrowBack } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Search from "./Search";
import axios from "axios";

const Navbar = () => {
	const user = useSelector((state) => state.user);
	const token = useSelector((state) => state.token);
	const [toggle, setToggle] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [toggleSearch, setToggleSearch] = useState(false);
	const [loading, setLoading] = useState(false);
	let menuRef = useRef();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const picture = useSelector((state) => state.user.picturePath);
	const dark = useSelector((state) => state.dark);
	const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

	const handleScrollToTop = () => {
		window.scrollTo({ top: 0 });
	};

	const searchUsers = async () => {
		setLoading(true);
		try {
			if (!specialChars.test(searchValue.trim())) {
				const response = await axios.get(
					`https://smashbook-server.vercel.app/users/search/${searchValue.trim()}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const resultUsers = response.data;
				setSearchResults(resultUsers);
			} else {
				setSearchResults([]);
			}
		} catch (error) {
			setLoading(false);
			throw new Error(error);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (dark === true) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [dark]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchValue.trim() !== "") {
				setToggleSearch(true);
				searchUsers();
			} else {
				setToggleSearch(false);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [searchValue]);

	useEffect(() => {
		const closeDropdown = (e) => {
			if (!menuRef.current.contains(e.target)) {
				setToggle(false);
				setToggleSearch(false);
			}
		};

		document.addEventListener("mousedown", closeDropdown);

		return () => document.removeEventListener("mousedown", closeDropdown);
	}, []);

	return (
		<nav ref={menuRef} className="fixed w-full">
			<div className="border-b dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-neutral-300 px-2 shadow-sm">
				<div className="md:flex justify-between mx-auto items-center">
					<div className="flex justify-between items-center py-1.5">
						<div className="flex items-center">
							{!toggleSearch && (
								<Link to="/">
									<h1
										onClick={() => {
											navigate("/");
											handleScrollToTop();
										}}
										className="p-2 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-blue-500 text-xl font-bold cursor-pointer rounded"
									>
										sociable
									</h1>
								</Link>
							)}

							{toggleSearch && (
								<div
									onClick={() => setToggleSearch(false)}
									className="flex hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer p-2 rounded-full gap-3"
								>
									<MdArrowBack className="w-5 h-5" />
								</div>
							)}

							<div className="md:w-64 mx-2 py-0.5">
								<Search
									searchValue={searchValue}
									setSearchValue={setSearchValue}
									setSearchResults={setSearchResults}
									setToggleSearch={setToggleSearch}
								/>
							</div>
						</div>

						<button
							className="flex md:hidden hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded p-2.5"
							onClick={() => {
								setToggle(!toggle);
								setToggleSearch(false);
							}}
						>
							{toggle ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="dark:fill-neutral-300 w-6 h-6"
									viewBox="0 0 320 512"
								>
									<path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="dark:fill-neutral-300 w-6 h-6"
									viewBox="0 0 448 512"
								>
									<path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
								</svg>
							)}
						</button>
					</div>
					<div
						className={`${toggle ? "block" : "hidden"} md:block pb-3 md:p-0`}
					>
						<ul className="md:flex rounded-b-xl items-center gap-2">
							<Link to="/home">
								<li className="flex md:bg-zinc-200 md:dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 md:dark:hover:bg-zinc-600 cursor-pointer p-3 rounded-full gap-3">
									<FaHome className="w-5 h-5" />
									<span className="md:hidden">Home</span>
								</li>
							</Link>
							<Link to={`/profile/${user._id}`}>
								<li className="flex items-center md:bg-zinc-200 md:dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 md:dark:hover:bg-zinc-600 cursor-pointer rounded-full pl-2 py-2 md:p-0 gap-2 md:gap-0">
									<img
										src={picture}
										alt={picture}
										className="w-8 h-8 md:w-11 md:h-11 rounded-full object-cover hover:brightness-110"
									/>
									<span className="md:hidden">Profile</span>
								</li>
							</Link>
							<li
								onClick={() => {
									dispatch(setLogout());
									navigate("/");
								}}
								className="flex md:bg-zinc-200 md:dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 md:dark:hover:bg-zinc-600 cursor-pointer p-3 rounded-full gap-3"
							>
								<MdLogout className="w-5 h-5" />
								<span className="md:hidden">Logout</span>
							</li>
							<li
								onClick={() => dispatch(setDark())}
								className="md:bg-zinc-200 md:dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 md:dark:hover:bg-zinc-600 cursor-pointer p-3 rounded-full group"
							>
								{dark ? (
									<div className="flex gap-3">
										<MdLightMode className="w-5 h-5 group-hover:fill-yellow-500" />
										<span className="md:hidden">Switch to light mode</span>
									</div>
								) : (
									<div className="flex gap-3">
										<MdDarkMode className="w-5 h-5 group-hover:fill-yellow-500" />
										<span className="md:hidden">Switch to dark mode</span>
									</div>
								)}
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="w-[20rem] bg-white dark:bg-zinc-800 dark:text-neutral-300 rounded-b-md shadow-xl">
				{loading ? (
					<div className="text-center pb-10 pt-5">
						<PropagateLoader color="#3B82F6" height={10} width={300} />
					</div>
				) : (
					<div className={`${toggleSearch ? "flex flex-col py-2" : "hidden"}`}>
						{toggleSearch ? (
							searchResults.length !== 0 ? (
								searchResults.map((resultUser) => (
									<Link
										to={`/profile/${resultUser._id}`}
										key={resultUser._id}
										onClick={() => setToggleSearch(false)}
									>
										<div className="flex items-center text-sm dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 cursor-pointer px-3 py-2 mx-2 rounded-lg">
											<img
												src={resultUser.picturePath}
												alt={resultUser.picturePath}
												className="w-9 h-9 object-cover rounded-full"
											/>

											<div className="flex flex-col pl-3">
												<span className="font-semibold">{`${
													resultUser?.firstName?.charAt(0).toUpperCase() +
													resultUser?.firstName?.slice(1)
												} ${
													resultUser?.lastName?.charAt(0).toUpperCase() +
													resultUser?.lastName?.slice(1)
												}`}</span>
												{resultUser._id === user._id ? (
													<span className="text-xs text-neutral-500">You</span>
												) : null}
												{user.friends.filter(
													(friend) => friend._id === resultUser._id
												).length !== 0 ? (
													<span className="text-xs text-neutral-500 dark:text-zinc-400">
														Friend
													</span>
												) : null}
											</div>
										</div>
									</Link>
								))
							) : (
								<div className="px-3 py-2 mx-2">No user found</div>
							)
						) : null}
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
