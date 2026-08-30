import { Card } from "./Card";

export function EmptyState({ icon, title, description, action }: { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <Card className="flex flex-col items-center gap-2.5 p-8 text-center">
      {icon ? <div className="text-primary">{icon}</div> : null}
      <div className="font-semibold">{title}</div>
      {description ? <p className="max-w-sm text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </Card>
  );
}
