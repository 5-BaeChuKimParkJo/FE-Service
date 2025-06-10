export interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
}

export interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
  minDate: Date;
}

export interface TimeSelectorProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
  minDate?: Date;
}

export interface DateOption {
  date: Date;
  label: string;
  value: number;
}

export interface DatePickerColumnProps {
  items: DateOption[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}

export interface PickerColumnProps {
  items: number[];
  selectedItem: number;
  onItemChange: (newItem: number) => void;
  label: 'hour';
}
