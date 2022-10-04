import React, { createContext, useContext, useEffect, useState } from "react";
import {
	ApiError,
	AuthChangeEvent,
	Provider,
	Session,
	User,
	UserCredentials,
} from "@supabase/supabase-js";

import { supabase } from "config";
import { ProfileAttributes, ProfileUser } from "types/User";

interface SupabaseAuthContext {
	profile: ProfileUser | null;
	getProfileAttributes: () => ProfileAttributes;
	updateProfileAttributes: (attributes: ProfileAttributes) => void;
	signUp: (data: UserCredentials) => Promise<{
		user: User | null;
		session: Session | null;
		error: ApiError | null;
	}>;
	signIn: (data: UserCredentials) => Promise<{
		session: Session | null;
		user: User | null;
		provider?: Provider | undefined;
		url?: string | null | undefined;
		error: ApiError | null;
	}>;
	signOut: () => Promise<{ error: ApiError | null }>;
	isAuthenticated: () => boolean;
}

const defaultValue: SupabaseAuthContext = {
	profile: null,
	getProfileAttributes: () => ({ username: undefined, avatarName: undefined }),
	updateProfileAttributes: (attributes: ProfileAttributes) => {
		return;
	},
	signUp: () =>
		new Promise((resolve) =>
			resolve({
				user: null,
				session: null,
				error: null,
			})
		),
	signIn: () =>
		new Promise((resolve) =>
			resolve({
				session: null,
				user: null,
				provider: undefined,
				url: undefined,
				error: null,
			})
		),
	signOut: () => new Promise((resolve) => resolve({ error: null })),
	isAuthenticated: () => false,
};

const AuthContext = createContext<SupabaseAuthContext>(defaultValue);

type SupabaseAuthProviderProps = { children: React.ReactNode };

export const SupabaseAuthProvider = ({ children }: SupabaseAuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const setCookie = async (event: AuthChangeEvent, session: Session) => {
			await fetch("/api/auth/set", {
				method: "POST",
				headers: new Headers({ "Content-Type": "application/json" }),
				credentials: "same-origin",
				body: JSON.stringify({ event, session }),
			});
		};

		const session = supabase.auth.session();

		setUser(session?.user ?? null);
		setLoading(true);

		const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);

			if (session !== null) {
				setCookie(event, session).catch(console.error);
			}
		});

		return () => listener?.unsubscribe();
	}, []);

	const handleSignOut = async (): Promise<{ error: ApiError | null }> => {
		await fetch("/api/auth/remove", { method: "POST" });
		return supabase.auth.signOut();
	};

	const updateProfileAttributes = async (attributes: ProfileAttributes) => {
		const { error } = await supabase.auth.update({ data: attributes });

		if (error) {
			console.error(error);
		}
	};

	const getProfileAttributes = (): ProfileAttributes => {
		return user?.user_metadata as ProfileAttributes;
	};

	const value: SupabaseAuthContext = {
		profile: null,
		getProfileAttributes: getProfileAttributes,
		updateProfileAttributes: updateProfileAttributes,
		signUp: (data: UserCredentials) => supabase.auth.signUp(data),
		signIn: (data: UserCredentials) => supabase.auth.signIn(data),
		signOut: handleSignOut,
		isAuthenticated: () => !!supabase.auth.session(),
	};

	if (user) {
		const profile: ProfileUser = {
			...user,
			username: user?.user_metadata.username as string,
			avatarName: user?.user_metadata.avatarName as string,
		};

		value.profile = profile;
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSupabaseAuth = () => {
	return useContext(AuthContext);
};
