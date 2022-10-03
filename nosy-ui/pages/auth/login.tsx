import { ChangeEvent, FormEvent, useReducer, useState } from "react";
import { useRouter } from "next/router";

import { useSupabaseAuth } from "contexts/AuthContext";

interface LoginFormData {
	email: string;
	password: string;
}

const formReducer = (state: LoginFormData, target: { name: string; value: string }) => {
	return {
		...state,
		[target.name]: target.value,
	};
};

const Login = () => {
	const router = useRouter();
	const auth = useSupabaseAuth();

	const { email } = router.query;

	const [error, setError] = useState<string | undefined>();
	const [formData, setFormData] = useReducer(formReducer, {
		email: "",
		password: "",
	});

	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Clicked Login");

		const { user, session, error } = await auth.signIn(formData);
		console.log({ user, session, error });

		if (error) {
			setError(error.message);
			console.log("Errored");
			return;
		}

		if (!user?.user_metadata.username) {
			router.push("/auth/completeAccount");
			console.log("No user metadata");
			return;
		}

		console.log("Navigating to /admin");
		router.push("/admin");
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({ name: e.target.name, value: e.target.value });
	};

	return (
		<>
			<form onSubmit={handleLogin}>
				<h2>Login</h2>

				{error && <p>{error}</p>}

				{email && (
					<p>Thank you for registering, confirm your email address and then log in.</p>
				)}

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
					<button type="submit">Login</button>
				</fieldset>
				<pre>{JSON.stringify({ auth }, null, 4)}</pre>
			</form>
		</>
	);
};

export default Login;
