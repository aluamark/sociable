import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Profile from "../widgets/Profile";
import FriendList from "../widgets/FriendList";
import MyPost from "../widgets/MyPost";
import Posts from "../widgets/Posts";
import { PropagateLoader } from "react-spinners";

const ProfilePage = () => {
	const { userId } = useParams();
	const { _id } = useSelector((state) => state.user);
	const [profileLoading, setProfileLoading] = useState(false);
	const [newPostLoading, setNewPostLoading] = useState(false);

	return (
		<div className="pt-[59px] max-w-screen-xl px-5 lg:px-10 mx-auto">
			<div className="md:flex justify-between gap-4">
				<div className="pt-5 md:w-3/5">
					<Profile isProfile={true} setProfileLoading={setProfileLoading} />
					<div className="pt-4">
						<FriendList
							isProfile={true}
							userId={userId}
							profileLoading={profileLoading}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-4 pt-3 md:pt-5 w-full">
					{_id === userId && (
						<MyPost
							setNewPostLoading={setNewPostLoading}
							isProfile={true}
							profileLoading={profileLoading}
						/>
					)}
					{newPostLoading && (
						<div className="text-center py-10">
							<PropagateLoader color="#3B82F6" height={10} width={300} />
						</div>
					)}
					<Posts isProfile={true} profileLoading={profileLoading} />
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
