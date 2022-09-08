type PostgrestError = {
  message: string;
  details: string;
  hint: string;
  code: string;
};

export type SupabaseResponse<T> = { data: T; error: PostgrestError | null };
