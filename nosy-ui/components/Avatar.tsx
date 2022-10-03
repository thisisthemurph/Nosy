import { supabase } from "config";
import { useEffect, useState } from "react";

import CloseButton from "./CloseButton";
import { ProfileAvatar } from "types/User";

import styles from "styles/Avatar.module.scss";

type Props = { avatar: string | null; onSelect: (avatar: ProfileAvatar) => void };

const Avatar = ({ avatar, onSelect }: Props) => {
	const [editing, setEditing] = useState(false);
	const [avatars, setAvatars] = useState<ProfileAvatar[]>([]);
	const [defaultAvatar, setDefaultAvatar] = useState<string>("");

	useEffect(() => {
		getAllAvatars()
			.then((avatars) => {
				setAvatars(avatars);
				return avatars;
			})
			.then((avatars) => {
				const da = avatars.find((a) => a.name === "Default")?.avatar ?? "";
				setDefaultAvatar(da);
			})
			.catch(console.error);
	});

	const getAllAvatars = async () => {
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

	const handleAvatarSelect = (profileAvatar: ProfileAvatar) => {
		onSelect(profileAvatar);
		setEditing(false);
	};

	return (
		<>
			<button className={styles.avatar} onClick={() => setEditing(!editing)}>
				<img
					src={`data:image/png;base64, ${avatar ?? defaultAvatar}`}
					alt="profile image"
				/>
			</button>

			{editing && (
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
