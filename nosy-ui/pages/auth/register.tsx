import { ChangeEvent, FormEvent, useReducer, useState } from "react";
import { useRouter } from "next/router";

import { supabase } from "config";
import { useSupabaseAuth } from "contexts/AuthContext";

interface RegisterFormData {
	username: string;
	email: string;
	password: string;
}

const formReducer = (
	state: RegisterFormData,
	target: { name: string; value: string }
) => {
	return {
		...state,
		[target.name]: target.value,
	};
};

const Register = () => {
	const auth = useSupabaseAuth();
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>();
	const [formData, setFormData] = useReducer(formReducer, {
		username: "",
		email: "",
		password: "",
	});

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Clicked Register");

		const { user, error } = await supabase.auth.signUp(formData);
		console.log({ user, error });

		if (error) {
			setError(error.message);
			return;
		}

		if (user?.email) {
			router.push(`/auth/login?email=${user.email}`);
			return;
		}

		router.push(`/auth/login`);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ name: e.target.name, value: e.target.value });
	};

	return (
		<>
			{error && <p>{error}</p>}

			<form className="form" onSubmit={handleSubmit}>
				<fieldset>
					<label htmlFor="username">Name: </label>
					<input
						type="username"
						name="username"
						id="username"
						className="username"
						value={formData.username}
						onChange={handleChange}
					/>
				</fieldset>
				<fieldset>
					<label htmlFor="email">Email: </label>
					<input
						type="email"
						name="email"
						id="email"
						className="email"
						value={formData.email}
						onChange={handleChange}
					/>
				</fieldset>
				<fieldset>
					<label htmlFor="password">Password: </label>
					<input
						type="password"
						name="password"
						id="password"
						className="password"
						value={formData.password}
						onChange={handleChange}
					/>
				</fieldset>
				<fieldset>
					<button type="submit">Sign up</button>
				</fieldset>
				<pre>{JSON.stringify(auth, null, 4)}</pre>
			</form>
		</>
	);
};

export default Register;
