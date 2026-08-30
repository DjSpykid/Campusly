export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="skeleton h-9 w-72" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-64" />)}</div>
    </div>
  );
}
