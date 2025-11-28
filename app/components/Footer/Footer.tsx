import "./styles.css";

export default function Footer() {
	return (
		<footer className="footer">
			<p>
				Copyright &copy; {new Date().getFullYear()}{" "}
				<a href="https://dirtroad.dev" target="_blank" rel="noopener noreferrer">
					Dirt Road
				</a>
			</p>
		</footer>
	);
}
