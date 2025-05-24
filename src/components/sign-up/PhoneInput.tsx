import { Input } from '../ui/input';

interface PhoneInputProps {
  phoneNumber: string;
  phoneError: string;
  openKeyboard: () => void;
}

export function PhoneInput({
  phoneNumber,
  phoneError,
  openKeyboard,
}: PhoneInputProps) {
  return (
    <Input
      label='휴대폰 번호'
      value={phoneNumber}
      readOnly
      onClick={openKeyboard}
      error={phoneError}
    />
  );
}
