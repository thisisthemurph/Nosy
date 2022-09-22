import { Session } from "@supabase/supabase-js";
import { createContext, Dispatch, useContext, useReducer } from "react";

export enum ReducerActionType {
	Login = "LOGIN",
	Logout = "LOGOUT",
}

export type ReducerAction = { type: ReducerActionType; value: any };

const authReducer = (state: Session | null, action: ReducerAction) => {
	switch (action.type) {
		case ReducerActionType.Login:
			console.log("Logging in");

			if (!state) return null;

			console.log("Storing the session in local storage");
			localStorage.setItem("session", JSON.stringify(state));
			return state;

		case ReducerActionType.Logout:
			console.log("Logging out");
			return null;

		default:
			return state;
	}
};

const initialState = {
	session: null,
};

export const AuthContext = createContext<{
	state: { session: Session | null };
	dispatch: Dispatch<ReducerAction>;
}>({
	state: initialState,
	dispatch: () => null,
});

type Props = {
	children: JSX.Element;
};

export function AuthProvider({ children }: Props) {
	const [session, setSession] = useReducer(authReducer, null);

	return (
		<AuthContext.Provider
			value={{
				state: { session },
				dispatch: setSession,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used inside an `Auth Provider`");
	}

	return context;
}
