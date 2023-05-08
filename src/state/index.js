import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	dark: localStorage.getItem("theme") === "dark" ? true : false,
	user: null,
	profileUser: null,
	token: null,
	posts: [],
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setDark: (state) => {
			state.dark = !state.dark;
			localStorage.setItem("theme", state.dark ? "dark" : "light");
		},
		setLogin: (state, action) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
		setUpdatedUser: (state, action) => {
			for (let value in action.payload) {
				state.user[value] = action.payload[value];
			}

			for (let value in action.payload) {
				state.profileUser[value] = action.payload[value];
			}

			state.posts = state.posts.map((post) => {
				return {
					...post,
					userPicturePath: action.payload.picturePath,
					firstName: action.payload.firstName,
					lastName: action.payload.lastName,
				};
			});
		},
		setLogout: (state) => {
			state.user = null;
			state.profileUser = null;
			state.token = null;
			state.posts = [];
		},
		setFriends: (state, action) => {
			if (state.user) {
				state.user.friends = action.payload.friends;
			}
		},
		setProfileUser: (state, action) => {
			state.profileUser = action.payload.profileUser;
		},
		setProfileFriends: (state, action) => {
			if (state.profileUser) {
				state.profileUser.friends = action.payload.friends;
			}
		},
		setAllPosts: (state, action) => {
			state.posts = action.payload.posts;
		},
		setPost: (state, action) => {
			const updatedPostIndex = state.posts.findIndex(
				(post) => post._id === action.payload.post._id
			);
			state.posts[updatedPostIndex] = action.payload.post;
		},
	},
});

export const {
	setDark,
	setLogin,
	setUpdatedUser,
	setLogout,
	setFriends,
	setProfileUser,
	setProfileFriends,
	setAllPosts,
	setPost,
} = authSlice.actions;

export default authSlice.reducer;
