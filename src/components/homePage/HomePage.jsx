import React, { useState } from "react";
import { useSelector } from "react-redux";
import Profile from "../widgets/Profile";
import MyPost from "../widgets/MyPost";
import Posts from "../widgets/Posts";
import FriendList from "../widgets/FriendList";
import { PropagateLoader } from "react-spinners";

const Homepage = () => {
	const user = useSelector((state) => state.user);
	const [newPostLoading, setNewPostLoading] = useState(false);

	return (
		<div className="pt-[59px] max-w-screen-2xl mx-auto md:px-5">
			<div className="flex justify-between gap-4">
				<div className="hidden sm:block pt-5 w-3/5">
					<Profile isProfile={false} user={user} />
				</div>

				<div className="flex flex-col gap-4 pt-5 w-full">
					<MyPost setNewPostLoading={setNewPostLoading} isProfile={false} />
					{newPostLoading ? (
						<div className="text-center py-10">
							<PropagateLoader color="#3B82F6" height={10} width={300} />
						</div>
					) : null}
					<Posts isProfile={false} />
				</div>

				<div className="hidden lg:block pt-5 w-3/5">
					<FriendList isProfile={false} id={user._id} />
				</div>
			</div>
		</div>
	);
};

export default Homepage;
