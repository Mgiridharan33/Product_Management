import { Power } from "lucide-react";

export default function StatusBadge({ status, onToggle }) {
  const isActive = status === "Active";
  const className = `status-badge ${isActive ? "is-active" : "is-inactive"}`;

  if (!onToggle) {
    return <span className={className}>{status}</span>;
  }

  return (
    <button type="button" className={className} onClick={onToggle} title="Click to toggle status">
      <Power size={12} />
      {status}
    </button>
  );
}
