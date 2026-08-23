export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-14">
      <span className="eyebrow">About</span>
      <h1 className="text-3xl font-semibold mt-2 mb-6">An expert system, not a chatbot</h1>

      <div className="space-y-6 text-ink leading-relaxed">
        <p>
          PolySelect is a <strong>decision-support system</strong> for polymer material selection. It does not
          claim to find "the" correct material — in real engineering, several materials can be
          suitable depending on trade-offs. Instead, PolySelect filters unsuitable candidates,
          scores what remains, ranks them, and explains every point of every score.
        </p>

        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-3">Hard constraints vs. soft preferences</h2>
          <p className="text-sm text-inkfaint">
            If a material cannot physically satisfy a requirement — like surviving your specified
            operating temperature — it is removed outright as a <strong>hard constraint</strong>. Everything
            else is a <strong>soft preference</strong>: a material can still rank well even if it isn't the
            cheapest or most sustainable option, as long as its overall weighted score is strong.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-3">Nothing is arbitrary</h2>
          <p className="text-sm text-inkfaint">
            Every score is the output of a documented formula in the recommendation engine —
            never a random or hard-coded number. The engine is a standalone module, separate
            from the API routes, so it can be inspected and tested independently.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg mb-3">Accuracy &amp; limitations</h2>
          <p className="text-sm text-inkfaint">
            Property values are educational approximations compiled from standard polymer
            engineering references. Real datasheet values vary by grade, additive package, and
            manufacturer. PolySelect's output is <strong>preliminary guidance</strong> — it does not replace
            engineering validation, standards compliance testing, or supplier-specific datasheets.
          </p>
        </div>
      </div>
    </div>
  );
}
