export interface ProductImage {
  key: string;
  order: number;
  file?: File;
  url?: string;
}

export interface FormFieldProps {
  error?: string;
  required?: boolean;
}

export interface DragDropContextProps {
  onDragStart?: (event: unknown) => void;
  onDragEnd?: (event: unknown) => void;
  activeId?: string | null;
}
