import { supabase } from "config";
import { useEffect, useState } from "react";

import CloseButton from "./CloseButton";
import { ProfileAvatar } from "types/User";

import styles from "styles/Avatar.module.scss";
import { join } from "helpers/css";
import useAvatar from "hooks/useAvatar";
import { useSupabaseAuth } from "contexts/AuthContext";

type Variant = "Icon" | "Normal";

type Props = {
	avatar: string | null;
	variant: Variant;
	onClick: (() => void) | undefined;
	onSelect: ((avatar: ProfileAvatar) => void) | undefined;
};

const Avatar = ({ avatar: avatarName, variant, onClick, onSelect }: Props) => {
	const avatar = useAvatar();
	const auth = useSupabaseAuth();

	const [editing, setEditing] = useState(false);
	const [avatars, setAvatars] = useState<ProfileAvatar[]>([]);
	const [defaultAvatar, setDefaultAvatar] = useState<ProfileAvatar | null>(null);
	const [currentAvatar, setCurrentAvatar] = useState<ProfileAvatar | null>(null);

	useEffect(() => {
		// Get a list of avatars if required

		if (variant === "Icon") {
			return;
		}

		avatar
			.getAllAvatars()
			.then((avatars) => {
				setAvatars(avatars);
				return avatars;
			})
			.then((avatars) => {
				const avatar = avatars.find((a) => a.name === "Default") ?? null;
				setDefaultAvatar(avatar);
			})
			.catch(console.error);
	}, [variant]);

	useEffect(() => {
		// Get the avatar for the main icon

		if (!avatarName) {
			setCurrentAvatar(defaultAvatar);
			return;
		}

		avatar
			.getAvatar(avatarName)
			.then((a) => setCurrentAvatar(a))
			.catch(console.error);
	}, [avatarName]);

	const handleOnClick = () => {
		if (onClick !== undefined) {
			onClick();
		}

		if (variant !== "Icon") {
			setEditing(!editing);
		}
	};

	const handleAvatarSelect = (profileAvatar: ProfileAvatar) => {
		if (onSelect === undefined) {
			return;
		}

		onSelect(profileAvatar);
		setEditing(false);
	};

	const mainStyle = join(styles.avatar, variant === "Icon" ? styles.avatar__icon : "");

	return (
		<>
			<button className={mainStyle} onClick={handleOnClick}>
				<img
					src={`data:image/png;base64, ${currentAvatar?.avatar}`}
					alt="profile image"
				/>
			</button>

			{editing && variant !== "Icon" && (
				<section className={styles.avatarSelectContainer}>
					<header>
						<CloseButton click={() => setEditing(false)} />
					</header>
					<main>
						{avatars.map((a) => (
							<button key={a.name} onClick={() => handleAvatarSelect(a)}>
								<img src={`data:image/png;base64, ${a.avatar}`} />
							</button>
						))}
					</main>
				</section>
			)}
		</>
	);
};

export default Avatar;
