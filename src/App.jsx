import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./components/homePage/HomePage";
import LoginPage from "./components/loginPage/LoginPage";
import ProfilePage from "./components/profilePage/ProfilePage";

const App = () => {
	const user = useSelector((state) => state.user);

	return (
		<div className="min-h-screen dark:bg-zinc-900">
			{user && <Navbar />}
			<Routes>
				{user ? (
					<Route path="/" element={<HomePage />} />
				) : (
					<Route path="/" element={<LoginPage />} />
				)}
				<Route path="/home" element={<HomePage />} />
				<Route path="/profile/:userId" element={<ProfilePage />} />
			</Routes>
		</div>
	);
};

export default App;
