import { useContext, useEffect } from "react";
import { AuthContext } from "contexts/AuthContext";
import { useRouter } from "next/router";

const AdminPage = () => {
	const router = useRouter();
	const { state, dispatch } = useContext(AuthContext);
	const { session } = state;

	useEffect(() => {
		if (!session) {
			router.push("/auth/login");
		}
	}, []);

	return <h2>Admin</h2>;
};

export default AdminPage;
