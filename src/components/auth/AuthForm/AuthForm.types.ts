export type Mode = "login" | "signup";
export type AuthFormProps = { mode: Mode };
export type ProfileFieldsProps = {
  name: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
};
