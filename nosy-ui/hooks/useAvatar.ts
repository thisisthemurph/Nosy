import { User } from "@supabase/supabase-js";
import { supabase } from "config";
import { ProfileAvatar } from "types/User";

const useAvatar = () => {
	const getDefaultAvatar = async (): Promise<ProfileAvatar | null> => {
		const { data: avatar, error } = await supabase
			.from<ProfileAvatar>("avatars")
			.select("name, avatar")
			.eq("name", "Default")
			.maybeSingle();

		if (error) {
			console.error(error);
			return null;
		}

		return avatar;
	};

	const getAllAvatars = async (): Promise<ProfileAvatar[]> => {
		const { data: allAvatars, error } = await supabase
			.from<ProfileAvatar>("avatars")
			.select("name, avatar");

		if (error) {
			console.error(error);
			return [];
		}

		if (!allAvatars) {
			console.warn("No avatars were found");
			return [];
		}

		return allAvatars;
	};

	const getAvatar = async (name: string): Promise<ProfileAvatar | null> => {
		const { data: avatar, error } = await supabase
			.from<ProfileAvatar>("avatars")
			.select("name, avatar")
			.eq("name", name)
			.maybeSingle();

		if (error) {
			console.error(error);
			return null;
		}

		if (avatar === null) {
			return await getDefaultAvatar();
		}

		return avatar;
	};

	const getUserAvatar = async (user: User): Promise<ProfileAvatar | null> => {
		let avatarName = user?.user_metadata.avatarName as string | undefined;
		return await getAvatar(avatarName || "Default");
	};

	const updateAvatar = async (avatarName: string) => {
		const user = supabase.auth.user();

		if (!user) {
			console.warn("Could not update avatar. No user.");
			return;
		}

		const { error } = await supabase.auth.update({
			data: { ...user.user_metadata, avatarName },
		});

		if (error) {
			console.error(error);
		}
	};

	return { getAllAvatars, getAvatar, getUserAvatar, getDefaultAvatar, updateAvatar };
};

export default useAvatar;
