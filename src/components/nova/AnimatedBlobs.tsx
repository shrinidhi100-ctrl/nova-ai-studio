export function AnimatedBlobs({ dense = false }: { dense?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-blob absolute -left-40 -top-52 size-[38rem] rounded-full opacity-40 blur-[110px]"
        style={{ background: "var(--violet)" }}
      />
      <div
        className="animate-blob absolute -right-52 -top-24 size-[34rem] rounded-full opacity-30 blur-[120px]"
        style={{ background: "var(--blue)", animationDelay: "-7s" }}
      />
      {dense && (
        <div
          className="animate-blob absolute -bottom-64 left-1/3 size-[32rem] rounded-full opacity-20 blur-[130px]"
          style={{ background: "var(--cyan)", animationDelay: "-13s" }}
        />
      )}
      <div className="grid-bg absolute inset-0" />
    </div>
  );
}
