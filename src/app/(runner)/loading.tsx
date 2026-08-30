export default function Loading() {
  return (
    <div className="flex min-h-screen bg-bg">
      <div className="hidden w-[248px] border-r border-border bg-surface lg:block" />
      <div className="flex flex-1 flex-col gap-6 p-8">
        <div className="skeleton h-9 w-64" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28" />)}</div>
        <div className="skeleton h-72" />
      </div>
    </div>
  );
}
