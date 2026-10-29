export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()} Folio News. Headlines and images belong to their original
          publishers.
        </p>
      </div>
    </footer>
  );
}
