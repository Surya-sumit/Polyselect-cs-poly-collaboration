export function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 text-inkfaint font-mono text-sm py-10 justify-center">
      <span className="w-3 h-3 rounded-full bg-teal animate-pulse" />
      {label}…
    </div>
  );
}

export function ErrorNote({ message }) {
  return (
    <div className="card border-danger/40 bg-danger/5 p-4 text-sm text-danger font-mono">
      {message || "Something went wrong talking to the backend. Is the API server running?"}
    </div>
  );
}
