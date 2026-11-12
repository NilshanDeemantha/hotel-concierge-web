// NEXT_PUBLIC_* values must be read as literal `process.env.NEXT_PUBLIC_X` so Next can inline them.
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Local testing only: set this to use the Firebase emulator instead of the live project.
export const AUTH_EMULATOR_URL = process.env.NEXT_PUBLIC_AUTH_EMULATOR_URL;
