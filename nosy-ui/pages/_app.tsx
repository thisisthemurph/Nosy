import type { AppProps } from "next/app";

import Layout from "components/Layout";
import { SupabaseAuthProvider } from "contexts/AuthContext";
import "styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SupabaseAuthProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</SupabaseAuthProvider>
	);
}

export default MyApp;
