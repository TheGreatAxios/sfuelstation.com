import Image from "next/image";
import "./styles.css";

export default function Navigation() {
	return (
		<nav className="navigation" role="navigation" aria-label="Main navigation">
			<a
				href="https://skale.space"
				target="_blank"
				rel="noopener noreferrer"
				className="navigation__logo"
				aria-label="Visit SKALE Network homepage"
			>
				<Image 
					src="/skale_logo_w.svg" 
					alt="SKALE Network Logo" 
					width={100}
					height={50}
					aria-hidden="false"
				/>
			</a>
		</nav>
	);
}
