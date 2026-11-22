import { inputClass, labelClass } from "./TextField.styles";
import type { TextFieldProps } from "./TextField.types";

/** A labelled text input. */
export function TextField({ label, ...input }: TextFieldProps) {
  return (
    <label className={labelClass}>
      {label}
      <input className={inputClass} {...input} />
    </label>
  );
}
