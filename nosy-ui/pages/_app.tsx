import type { AppProps } from "next/app";

import Layout from "components/Layout";
import "styles/globals.scss";
import { AuthProvider } from "contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			<AuthProvider>
				<Component {...pageProps} />
			</AuthProvider>
		</Layout>
	);
}

export default MyApp;
