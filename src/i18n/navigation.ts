import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation helpers. usePathname() returns the pathname WITHOUT
// the locale prefix, and useRouter().replace(path, { locale }) emits the correct
// URL for the target locale under localePrefix: "as-needed" (default locale → "/").
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
