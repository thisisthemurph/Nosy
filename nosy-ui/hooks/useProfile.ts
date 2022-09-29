import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { supabase } from "config";
import { ProfileTable } from "types/Database";

export const useProfile = (user: User | null) => {
	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState<ProfileTable | null>(null);

	useEffect(() => {
		const userId = user?.id;

		if (loading && userId !== undefined) {
			getProfileData(userId)
				.then((pd) => {
					setProfile(pd);
				})
				.catch(console.error)
				.finally(() => {
					setLoading(false);
				});
		}
	}, [user?.id, loading]);

	const getProfileData = async (userId: string): Promise<ProfileTable | null> => {
		const { data, error } = await supabase
			.from<ProfileTable>("profiles")
			.select()
			.eq("id", userId)
			.maybeSingle();

		if (error) {
			console.error(error);
			return null;
		}

		return data;
	};

	const updateUsername = async (username: string): Promise<void> => {
		if (!profile?.id || profile.username === username) {
			return;
		}

		const updates = {
			id: profile?.id,
			username,
		};

		const { error } = await supabase
			.from("profiles")
			.upsert(updates, { returning: "minimal" });

		if (error) {
			console.error(error);
		}
	};

	const updateEmail = async (email: string, password: string): Promise<void> => {
		if (!user?.id || user?.email === email) {
			return;
		}

		const result = await supabase.auth.update({
			email,
			password,
			data: { hello: "world" },
		});

		if (result.error) {
			console.error(result.error);
		}

		console.log(result);
	};

	const updateAvatar = async (avatar: string): Promise<void> => {
		if (!profile?.id || profile.avatar === avatar) {
			return;
		}

		const updates = {
			id: profile.id,
			avatar,
		};

		const { error } = await supabase
			.from("profiles")
			.update(updates, { returning: "minimal" });

		if (error) {
			console.error(error);
		}
	};

	return {
		loading,
		profile,
		update: {
			avatar: updateAvatar,
			email: updateEmail,
			username: updateUsername,
		},
	};
};
