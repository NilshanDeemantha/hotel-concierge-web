"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { AUTH_TEXT } from "@/content/auth";
import { frameClass, inputClass, toggleClass } from "./PasswordField.styles";
import type { PasswordFieldProps } from "./PasswordField.types";

/** A password input with a show/hide button. */
export function PasswordField({ id, value, onChange, autoComplete, minLength, hint }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {AUTH_TEXT.passwordLabel}
      </label>
      <div className={frameClass}>
        <input
          id={id}
          className={inputClass}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          aria-label={show ? AUTH_TEXT.hidePassword : AUTH_TEXT.showPassword}
          aria-pressed={show}
          className={toggleClass}
          onClick={() => setShow((shown) => !shown)}
        >
          <Icon strokeWidth={1.8}>
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
            {show && <path d="M4 4l16 16" />}
          </Icon>
        </button>
      </div>
      {hint && <p className="text-[13px] font-normal text-muted">{hint}</p>}
    </div>
  );
}
