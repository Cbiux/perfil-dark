import type { SocialLink } from "@/data/profile";

const iconClass = "h-5 w-5";

export function SocialIcon({ id }: { id: SocialLink["id"] }) {
  switch (id) {
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
          <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V23h-4V8.5z" transform="translate(1 0)" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.75 15.5v-7l6.2 3.5-6.2 3.5Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
          <path d="M14.5 3c.4 2.6 1.8 4.2 4.3 4.5v3.1c-1.46.14-2.8-.32-4.2-1.18v6.2c0 3.5-2.7 5.9-6.1 5.9A5.9 5.9 0 0 1 3.4 16c0-3.3 2.7-5.9 6.1-5.9.4 0 .8 0 1.2.1v3.2a2.9 2.9 0 0 0-1.2-.2 2.7 2.7 0 1 0 0 5.4c1.6 0 2.8-1.2 2.8-2.9V3h2.2Z" />
        </svg>
      );
    case "discord":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden>
          <path d="M19.3 5.2A18.4 18.4 0 0 0 14.8 4l-.2.4a16.6 16.6 0 0 1 3.3 1.3 12.8 12.8 0 0 0-11.8 0A16 16 0 0 1 9.3 4.4L9.1 4a18.5 18.5 0 0 0-4.5 1.2C2.2 8.6 1.5 12 1.7 15.3A18.6 18.6 0 0 0 7.4 18l.5-.8a12 12 0 0 1-1.8-.9l.4-.3c3.5 1.6 7.3 1.6 10.8 0l.4.3c-.57.35-1.17.65-1.8.9l.5.8a18.5 18.5 0 0 0 5.7-2.7c.4-4.1-.6-7.4-2.8-10.1ZM8.7 13.8c-.8 0-1.5-.8-1.5-1.7s.66-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Zm6.6 0c-.8 0-1.5-.8-1.5-1.7s.66-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z" />
        </svg>
      );
    case "website":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3.8 12h16.4M12 3.8c2.2 2.4 3.3 5.2 3.3 8.2s-1.1 5.8-3.3 8.2c-2.2-2.4-3.3-5.2-3.3-8.2s1.1-5.8 3.3-8.2Z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
  }
}
