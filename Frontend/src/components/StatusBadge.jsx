import { Power } from "lucide-react";

// Small pill showing Active/Inactive. When `onToggle` is provided it
// becomes a clickable button (used in admin tables); otherwise it's
// just a read-only label (used on the customer-facing pages).
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
