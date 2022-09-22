import { supabase } from "config";
import { useEffect, useState } from "react";

interface UserProfile {
	id?: string;
	username: string;
	email: string;
	avatar: string;
}

type Props = { session: string };

const Profile = ({ session }: Props) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>();
	const [profile, setProfile] = useState<UserProfile | undefined>();

	useEffect(() => {
		getProfile();
	}, [session]);

	async function getProfile() {
		try {
			setLoading(true);
			const user = supabase.auth.user();
			if (!user) {
				return;
			}

			let { data, error, status } = await supabase
				.from<UserProfile>("profile")
				.select("id, username, email, avatar")
				.eq("id", user.id)
				.single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setProfile(data);
			}
		} catch (e) {
			let errorMessage = "There has been an issue loading your profile";
			if (typeof e === "string") {
				errorMessage = e;
			} else if (e instanceof Error) {
				errorMessage = e.message;
			}

			alert(errorMessage);
		} finally {
			setLoading(false);
		}
	}

	async function updateProfile({ username, email }: UserProfile) {
		try {
			setLoading(true);
			const user = supabase.auth.user();
			if (!user) {
				return;
			}

			const updates = { id: user.id, username, email, updated_at: new Date() };

			let { error } = await supabase.from("profiles").upsert(updates, {
				returning: "minimal",
			});

			if (error) {
				throw error;
			}

			alert("Profile updated");
		} catch (e) {
			let errorMessage = "There has been an issue updating your profile";
			if (typeof e === "string") {
				errorMessage = e;
			} else if (e instanceof Error) {
				errorMessage = e.message;
			}

			alert(errorMessage);
		} finally {
			setLoading(false);
		}
	}

	if (!profile) {
		return <p>No profile information to display!</p>;
	}

	if (error) {
		return (
			<div>
				<p>There has been an error:</p>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div>
			<h3>{profile.username}</h3>
			<p>Email: {profile.email}</p>
			<img src={`data:image/png;base64, ${profile.avatar}`} alt="profile image" />
		</div>
	);
};

export default Profile;
