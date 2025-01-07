import { cn } from "@/lib";

interface StepItemProps {
  id: number;
  description: string;
}

export function StepItem({ id, description }: StepItemProps) {
  return (
    <div className={cn('flex items-start gap-3')}>
      <span className={cn('font-bold text-gray-700')}>{id}.</span>
      <span>{description}</span>
    </div>
  );
}
