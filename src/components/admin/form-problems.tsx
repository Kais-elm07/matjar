interface FormProblemsProps {
  /** The problems the server found, in Arabic */
  problems: string[]
}

/** The list of what to fix before an admin form can be saved, read out to screen readers. */
export function FormProblems({ problems }: FormProblemsProps) {
  if (problems.length === 0) return null
  return (
    <div
      role="alert"
      className="space-y-2 rounded-2xl border border-destructive/60 bg-card p-4"
    >
      <p className="font-bold text-destructive">لم يُحفظ شيء. صحّح ما يلي:</p>
      <ul className="list-disc space-y-1 ps-5 text-sm">
        {problems.map((problem) => (
          <li key={problem}>{problem}</li>
        ))}
      </ul>
    </div>
  )
}
