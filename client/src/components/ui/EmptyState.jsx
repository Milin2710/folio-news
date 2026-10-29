export default function EmptyState({ title, message, tone = "neutral" }) {
  return (
    <div className={`center-message ${tone === "error" ? "center-message--error" : ""}`}>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}
