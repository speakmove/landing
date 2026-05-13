import { cn } from '@/shared/model/libs/cn';

type TProps = {
  id?: string;
  errors?: string[] | string;
  className?: string;
};

export function FieldError({ id, errors, className }: TProps) {
  if (!errors) return null;
  const list = Array.isArray(errors) ? errors : [errors];
  if (list.length === 0) return null;

  if (list.length === 1) {
    return (
      <p id={id} role="alert" className={cn('mt-1 text-sm text-red-600', className)}>
        {list[0]}
      </p>
    );
  }
  return (
    <ul id={id} role="alert" className={cn('mt-1 list-disc space-y-0.5 pl-5 text-sm text-red-600', className)}>
      {list.map((err, i) => (
        <li key={`${err}-${i}`}>{err}</li>
      ))}
    </ul>
  );
}
