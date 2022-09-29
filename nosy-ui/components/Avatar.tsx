import { supabase } from "config";
import { useEffect, useState } from "react";

import CloseButton from "./CloseButton";

import styles from "styles/Avatar.module.scss";

interface Avatar {
	name: string;
	avatar: string;
}

type Props = { avatar: string; onSelect: (avatar: string) => void };

const Avatar = ({ avatar, onSelect }: Props) => {
	const [avatars, setAvatars] = useState<Avatar[]>([]);
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		getAllAvatars()
			.then((a) => setAvatars(a))
			.catch(console.error);
	});

	const getAllAvatars = async () => {
		const { data: allAvatars, error } = await supabase
			.from<Avatar>("avatars")
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

	const handleAvatarSelect = (avatar: string) => {
		onSelect(avatar);
		setEditing(false);
	};

	return (
		<>
			<button className={styles.avatar} onClick={() => setEditing(!editing)}>
				<img src={`data:image/png;base64, ${avatar}`} alt="profile image" />
			</button>

			{editing && (
				<section className={styles.avatarSelectContainer}>
					<header>
						<CloseButton click={() => setEditing(false)} />
					</header>
					<main>
						{avatars.map((a) => (
							<button key={a.name} onClick={() => handleAvatarSelect(a.avatar)}>
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
