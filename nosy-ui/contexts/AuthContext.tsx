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
import { useProfile } from "hooks/useProfile";
import { ProfileTable } from "types/Database";

interface SupabaseAuthContext {
	user: User | null;
	profile: ProfileTable | null;
	loadingProfile: boolean;
	updateProfile: {
		avatar: (avatar: string) => Promise<void>;
		email: (email: string, password: string) => Promise<void>;
		username: (username: string) => Promise<void>;
	};
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
	user: null,
	profile: null,
	loadingProfile: false,
	updateProfile: {
		avatar: (avatar: string) => new Promise((resolve) => resolve()),
		email: (email: string) => new Promise((resolve) => resolve()),
		username: (username: string) => new Promise((resolve) => resolve()),
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
	const { loading: loadingProfile, profile, update: updateProfile } = useProfile(user);

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

	const value = {
		user,
		profile,
		loadingProfile,
		updateProfile,
		signUp: (data: UserCredentials) => supabase.auth.signUp(data),
		signIn: (data: UserCredentials) => supabase.auth.signIn(data),
		signOut: handleSignOut,
		isAuthenticated: () => !!supabase.auth.session(),
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSupabaseAuth = () => {
	return useContext(AuthContext);
};
