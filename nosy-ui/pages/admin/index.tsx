import { useEffect } from "react";
import { useRouter } from "next/router";

import { useSupabaseAuth } from "contexts/AuthContext";

export const requiresAuth = true;

const AdminPage = () => {
	const router = useRouter();
	const auth = useSupabaseAuth();

	useEffect(() => {
		if (!auth?.isAuthenticated()) {
			router.push("/auth/login");
		}
	}, []);

	return (
		<>
			<h2>Admin</h2>
			<pre>{JSON.stringify(auth, null, 4)}</pre>
		</>
	);
};

export default AdminPage;
