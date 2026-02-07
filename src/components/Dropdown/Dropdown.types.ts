import type { ReactNode } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface DropdownProps {
  id?: string;
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  withSearch?: boolean;
  outlined?: boolean;
  portal?: boolean;
  zIndex?: number;
  renderOption?: (option: DropdownOption, selected: boolean) => ReactNode;
}
