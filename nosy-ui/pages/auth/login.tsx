import { Session } from "@supabase/supabase-js";
import { supabase } from "config";
import { AuthContext, ReducerActionType } from "contexts/AuthContext";
import {
	Dispatch,
	FormEvent,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

const Login = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>();

	const { state, dispatch } = useContext(AuthContext);

	useEffect(() => {
		dispatch({ type: ReducerActionType.Logout, state: null });

		supabase.auth.onAuthStateChange((event, session) => {
			dispatch({ type: ReducerActionType.Login, state: session });
		});
	}, []);

	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Clicked Login");

		dispatch({ type: ReducerActionType.Login });
	};

	return (
		<>
			<form action="" className="form" onSubmit={handleLogin}>
				<fieldset>
					<label htmlFor="username">Username: </label>
					<input type="text" name="username" id="username" className="username" />
				</fieldset>
				<fieldset>
					<label htmlFor="password">Password: </label>
					<input type="password" name="password" id="password" className="password" />
				</fieldset>
				<fieldset>
					<button type="submit">Login</button>
				</fieldset>
			</form>
		</>
	);
};

export default Login;
