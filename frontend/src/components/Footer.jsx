export default function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-sm2 bg-teal text-white grid place-items-center font-mono text-[10px]">PS</span>
          <span className="font-display font-medium text-sm">PolySelect</span>
          <span className="font-mono text-xs text-inkfaint">— decision-support, not a chatbot</span>
        </div>
        <p className="font-mono text-[11px] text-inkfaint max-w-xl leading-relaxed">
          Results are preliminary material-selection guidance based on generalized property data.
          They do not replace engineering validation, standards testing, or supplier grade datasheets.
        </p>
      </div>
    </footer>
  );
}
