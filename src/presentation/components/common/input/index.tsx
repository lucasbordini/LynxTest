import { useState } from '@lynx-js/react';
import './styles.css';

interface InputProps {
  initialValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Input({
  initialValue,
  placeholder,
  onValueChange,
  className,
}: InputProps) {
  const [value, setValue] = useState(initialValue);

  const handleInput = (event: any) => {
    const newValue = event.detail.value;
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <input
      // @ts-ignore
      bindinput={handleInput}
      className={className}
      id="inputBox"
      placeholder={placeholder}
      value={value}
    />
  );
}
