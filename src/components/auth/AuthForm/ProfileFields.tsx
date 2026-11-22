import { TextField } from "@/components/ui/TextField";
import { PHONE_PATTERN } from "@/constants";
import { AUTH_TEXT } from "@/content/auth";
import type { ProfileFieldsProps } from "./AuthForm.types";

/** The extra sign-up fields. */
export function ProfileFields({ name, phone, onNameChange, onPhoneChange }: ProfileFieldsProps) {
  return (
    <>
      <TextField
        label={AUTH_TEXT.nameLabel}
        type="text"
        autoComplete="name"
        placeholder={AUTH_TEXT.namePlaceholder}
        required
        maxLength={80}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <TextField
        label={
          <span>
            {`${AUTH_TEXT.phoneLabel} `}<span className="font-normal text-muted">{AUTH_TEXT.phoneOptional}</span>
          </span>
        }
        type="tel"
        autoComplete="tel"
        placeholder={AUTH_TEXT.phonePlaceholder}
        pattern={PHONE_PATTERN}
        title={AUTH_TEXT.phoneHint}
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
      />
    </>
  );
}
