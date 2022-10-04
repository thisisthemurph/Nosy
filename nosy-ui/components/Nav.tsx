import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { join } from "helpers/css";
import CloseButton from "./CloseButton";
import Avatar from "components/Avatar";
import { useSupabaseAuth } from "contexts/AuthContext";

import styles from "styles/Nav.module.scss";

const Nav = () => {
	const router = useRouter();
	const auth = useSupabaseAuth();

	const [isOpen, setIsOpen] = useState(false);
	const openDrawer = () => setIsOpen(true);
	const closeDrawer = () => setIsOpen(false);
	const draweStyles = join(styles.nav__drawer, isOpen ? styles["nav__drawer--open"] : "");

	const handleSignOut = async (confirmSignOut: boolean = false) => {
		if (confirmSignOut) {
			const action = confirm("Would you like to log out?");
			if (!action) {
				return;
			}
		}

		const { error } = await auth.signOut();

		if (error) {
			console.error(`Error signing out: ${error.message}`);
		}

		closeDrawer();
		router.push("/auth/login");
	};

	return (
		<nav className={styles.nav}>
			<MenuButton click={openDrawer} />

			<div className={draweStyles}>
				<header className={styles.nav__header}>
					{auth.profile && (
						<Avatar
							avatar={auth.profile?.avatarName ?? null}
							variant="Icon"
							onClick={() => handleSignOut(true)}
							onSelect={undefined}
						/>
					)}

					{!auth.profile && <h2>Nosy</h2>}

					<CloseButton click={closeDrawer} />
				</header>

				<main className={styles.nav__main}>
					<Link href="/">
						<a className={styles.nav__link} onClick={closeDrawer}>
							Home
						</a>
					</Link>
					<Link href="/about">
						<a className={styles.nav__link} onClick={closeDrawer}>
							About
						</a>
					</Link>

					{auth.profile && (
						<>
							<Link href="/admin">
								<a className={styles.nav__link} onClick={closeDrawer}>
									Admin
								</a>
							</Link>
							<Link href="/admin/profile">
								<a className={styles.nav__link} onClick={closeDrawer}>
									Profile
								</a>
							</Link>
						</>
					)}
				</main>

				{auth.profile && (
					<footer className={styles.nav__footer}>
						<p>This is the footer of the navigation.</p>
					</footer>
				)}
			</div>
		</nav>
	);
};

type MenuButtonProps = { click: () => void };

const MenuButton = ({ click }: MenuButtonProps) => {
	return (
		<button className={styles.menuBtn} aria-label="Menu" onClick={click}>
			<svg height="15" viewBox="0 0 24 15" width="24" xmlns="http://www.w3.org/2000/svg">
				<g fill="#fff">
					<path d="m0 0h16v1h-16z"></path>
					<path d="m0 7h24v1h-24z"></path>
					<path d="m0 14h20v1h-20z"></path>
				</g>
			</svg>
		</button>
	);
};

export default Nav;
