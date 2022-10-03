import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { supabase } from "config";
import Avatar from "components/Avatar";
import useAvatar from "hooks/useAvatar";
import { ProfileAttributes, ProfileAvatar } from "types/User";

interface CompleteAccountFormData {
	username: string;
}

const CompleteAccount = () => {
	const router = useRouter();
	const avatar = useAvatar();
	const [selectedAvatar, setSelectedAvatar] = useState<ProfileAvatar | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CompleteAccountFormData>();

	useEffect(() => {
		// Fetch the user's default avatar
		const user = supabase.auth.user();
		if (!user) {
			return;
		}

		avatar.getUserAvatar(user).then(setSelectedAvatar).catch(console.error);
	}, []);

	const onSubmit: SubmitHandler<CompleteAccountFormData> = async (data) => {
		console.log(data);

		const attributes: ProfileAttributes = {
			username: data.username,
			avatarName: selectedAvatar?.name ?? "Default",
		};

		const { error } = await supabase.auth.update({ data: attributes });

		if (error) {
			console.error(error);
		}

		router.push("/admin");
	};

	const handleAvatarSelect = (selectedAvatar: ProfileAvatar) => {
		setSelectedAvatar(selectedAvatar);
		avatar.updateAvatar(selectedAvatar.name);
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<p>Select a profile avatar and let us know what you're called...</p>

				<Avatar avatar={selectedAvatar?.avatar ?? null} onSelect={handleAvatarSelect} />

				<fieldset>
					<label htmlFor="username">Name: </label>
					<input id="username" {...register("username", { required: true })} />
				</fieldset>

				<fieldset>
					<button type="submit">Complete account</button>
				</fieldset>
			</form>
		</>
	);
};

export default CompleteAccount;
