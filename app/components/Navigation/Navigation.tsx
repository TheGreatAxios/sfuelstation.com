import Image from "next/image";
import "./styles.css";

export default function Navigation() {
	return (
		<nav className="navigation">
			<a
				href="https://skale.space"
				target="_blank"
				rel="noopener noreferrer"
				className="navigation__logo"
			>
				<Image 
					src="/skale_logo_w.svg" 
					alt="SKALE Network" 
					width={100}
					height={50}
				/>
			</a>
		</nav>
	);
}
