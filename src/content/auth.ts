export const AUTH_COPY = {
  login: {
    pageTitle: "Log in",
    title: "Welcome back",
    intro: "Log in to chat with Xenia, our AI concierge.",
    submit: "Log in",
    busy: "Logging in…",
    switchText: "New here?",
    switchLink: "Create an account",
    switchHref: "/signup",
  },
  signup: {
    pageTitle: "Sign up",
    title: "Create your account",
    intro: "Create an account to chat with Xenia, our AI concierge. It takes a minute.",
    submit: "Create account",
    busy: "Creating account…",
    switchText: "Already have an account?",
    switchLink: "Log in",
    switchHref: "/login",
  },
} as const;

export const AUTH_TEXT = {
  hello: "Hello",
  signOut: "Sign out",
  nameLabel: "Name",
  namePlaceholder: "Your full name",
  phoneLabel: "Phone",
  phoneOptional: "(optional)",
  phonePlaceholder: "+94 77 123 4567",
  phoneHint: "6 to 20 digits. You can use +, spaces, brackets and dashes.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  passwordLabel: "Password",
  passwordHint: "At least 8 characters.",
  showPassword: "Show password",
  hidePassword: "Hide password",
  demoNote: "Demo site: please don't use a password you use anywhere else.",
  sideTitle: "Slow days between the palms and the sea",
} as const;

const WRONG_CREDENTIALS = "The email or password is wrong.";
const EMAIL_SIGN_IN_OFF = "Email sign-in is not turned on for this site yet.";

export const NO_CONNECTION = "No connection. Check your internet and try again.";
export const GENERIC_ERROR = "Something went wrong. Please try again.";
export const MISSING_API_URL = "Sign-up is not set up: NEXT_PUBLIC_API_URL is missing.";

export const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credential": WRONG_CREDENTIALS,
  // Older projects and the emulator report these two instead of the one above.
  "auth/wrong-password": WRONG_CREDENTIALS,
  "auth/user-not-found": WRONG_CREDENTIALS,
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": NO_CONNECTION,
  "auth/operation-not-allowed": EMAIL_SIGN_IN_OFF,
  "auth/configuration-not-found": EMAIL_SIGN_IN_OFF,
};
