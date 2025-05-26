import { Input } from '@/components/ui/input';

interface NameInputProps {
  name: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NameInput({ name, error, onChange }: NameInputProps) {
  return <Input label='이름' value={name} onChange={onChange} error={error} />;
}
