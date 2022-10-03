import { User } from "@supabase/supabase-js";

export interface ProfileUser extends User {
	username: string;
	avatarName: string;
}

export interface ProfileAttributes {
	username: string | undefined;
	avatarName: string | undefined;
}

export interface ProfileAvatar {
	name: string;
	avatar: string;
}
