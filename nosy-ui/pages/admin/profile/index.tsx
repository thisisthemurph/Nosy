import { useSupabaseAuth } from "contexts/AuthContext";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import Avatar from "components/Avatar";
import { ProfileAttributes, ProfileAvatar } from "types/User";

import styles from "styles/Profile.module.scss";
import useAvatar from "hooks/useAvatar";

interface IFormInput {
	username: string;
	email: string;
	currentPassword: string;
}

const Profile = () => {
	const auth = useSupabaseAuth();
	const { updateAvatar } = useAvatar();

	const [passworVerificationdRequired, setPassworVerificationRequired] = useState<
		false | string
	>(false);

	const { register, handleSubmit } = useForm<IFormInput>();

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		const attributes = auth.getProfileAttributes();
		const updates: ProfileAttributes = { ...attributes, username: data.username };

		auth.updateProfileAttributes(updates);
	};

	const handleEmailChange = (value: string) => {
		const emailHasChanged = auth.profile?.email !== value;
		setPassworVerificationRequired(
			emailHasChanged ? "You must verify your current password." : false
		);
	};

	const registerEmail = () => {
		const registration = register("email", {
			required: "Your email address cannot be blank.",
		});

		return {
			...registration,
			onChange: (e: { target: any; type?: any }) => {
				handleEmailChange(e.target.value);
				registration.onChange(e);
			},
		};
	};

	const handleAvatarChange = async (avatar: ProfileAvatar) => {
		await updateAvatar(avatar.name);
	};

	if (!auth.profile) {
		return <h3>Loading...</h3>;
	}

	return (
		<form className={styles.profileContainer} onSubmit={handleSubmit(onSubmit)}>
			<Avatar
				variant="Normal"
				avatar={auth.profile.avatarName}
				onClick={undefined}
				onSelect={handleAvatarChange}
			/>

			<fieldset>
				<label htmlFor="username">Username: </label>
				<input
					{...register("username", {
						required: "Your username cannot be blank.",
						minLength: 3,
					})}
					defaultValue={auth.profile?.username}
				/>
			</fieldset>

			<fieldset>
				<label htmlFor="email">Email: </label>
				<input type="email" {...registerEmail()} defaultValue={auth.profile?.email} />
			</fieldset>

			{passworVerificationdRequired && (
				<fieldset>
					<label htmlFor="currentPassword">Current password: </label>
					<input
						type="password"
						{...register("currentPassword", { required: passworVerificationdRequired })}
					/>
				</fieldset>
			)}

			<fieldset>
				<button type="submit">Update</button>
			</fieldset>
		</form>
	);
};

export default Profile;
