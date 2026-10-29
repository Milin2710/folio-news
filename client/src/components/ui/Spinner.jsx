export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="center-message" role="status">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
