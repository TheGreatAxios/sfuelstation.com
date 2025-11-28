import "./styles.css";

export default function Footer() {
	return (
		<footer className="footer" role="contentinfo">
			<p>
				Copyright &copy; {new Date().getFullYear()}{" "}
				<a 
					href="https://dirtroad.dev" 
					target="_blank" 
					rel="noopener noreferrer"
					aria-label="Visit Dirt Road website (opens in new tab)"
				>
					Dirt Road
				</a>
			</p>
		</footer>
	);
}
