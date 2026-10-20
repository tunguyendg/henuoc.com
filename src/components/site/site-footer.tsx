import Link from "next/link";
import { Container } from "@/components/ui/container";
import { footerNav, site } from "@/lib/site";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-muted">{site.description}</p>
        </div>

        {footerNav.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-rose-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>
            © 2026 {site.name} · {site.domain}
          </p>
          <p>Làm bằng cả trái tim tại Việt Nam.</p>
        </Container>
      </div>
    </footer>
  );
}
