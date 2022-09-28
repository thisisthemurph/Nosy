import { useSupabaseAuth } from "contexts/AuthContext";
import { useState } from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import styles from "styles/Profile.module.scss";

interface IFormInput {
	username: string;
	email: string;
	currentPassword: string;
}

const Profile = () => {
	const { user, profile, loadingProfile, updateProfile } = useSupabaseAuth();
	const [currentPasswordRequired, setCurrentPasswordRequired] = useState<false | string>(
		false
	);

	const { register, handleSubmit } = useForm<IFormInput>();

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		console.log(data);

		await updateProfile.username(data.username);
		await updateProfile.email(data.email, data.currentPassword);

		console.log("Upadted the username");
	};

	const handleEmailChange = (value: string) => {
		const emailHasChanged = user?.email !== value;
		setCurrentPasswordRequired(
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

	if (!user || loadingProfile || !profile) {
		return <h3>Loading... = {`${loadingProfile}`}</h3>;
	}

	return (
		<form className={styles.profileContainer} onSubmit={handleSubmit(onSubmit)}>
			<img
				className={styles.avatar}
				src={`data:image/png;base64, ${profile.avatar}`}
				alt="profile image"
			/>

			<fieldset>
				<label htmlFor="username">Username: </label>
				<input
					{...register("username", {
						required: "Your username cannot be blank.",
						minLength: 3,
					})}
					defaultValue={profile.username}
				/>
			</fieldset>

			<fieldset>
				<label htmlFor="email">Email: </label>
				<input type="email" {...registerEmail()} defaultValue={user.email} />
			</fieldset>

			{currentPasswordRequired && (
				<fieldset>
					<label htmlFor="currentPassword">Current password: </label>
					<input
						type="password"
						{...register("currentPassword", { required: currentPasswordRequired })}
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
