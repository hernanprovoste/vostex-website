import { notFound } from "next/navigation";

// Catch-all so unknown URLs under a locale (/foo, /es/foo) render inside the
// [locale] layout and use its translated not-found page, instead of Next's
// English default.
export default function CatchAllPage() {
  notFound();
}
