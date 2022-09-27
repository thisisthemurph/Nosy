export interface ArticlesTable {
	id?: number;
	slug: string;
	createdAt?: string;
	title: string;
	content: string;
	author: string;
}

export interface ProfileTable {
	id: string;
	updated_at: string;
	username: string;
	avatar: string;
}
