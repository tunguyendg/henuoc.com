import { createElement } from "react";
import { manifest as blushRoseManifest } from "./blush-rose/manifest";
import { manifest as placeholderManifest } from "./placeholder/manifest";
import type { ThemeManifest, ThemeModule, ThemeProps } from "./types";

export interface ThemeEntry {
  manifest: ThemeManifest<unknown>;
  load: () => Promise<ThemeModule<unknown>>;
}

/**
 * Binds a typed manifest to its lazily imported module and erases TOptions without a cast:
 * the returned component re-validates `options` with the theme's own schema and falls back to
 * `defaultOptions` on mismatch, so a stale/invalid options blob from the DB never crashes a page.
 * The wrapped module is memoized: one import and one wrapper component per theme.
 */
function defineTheme<TOptions>(
  manifest: ThemeManifest<TOptions>,
  load: () => Promise<ThemeModule<TOptions>>,
): ThemeEntry {
  let cached: Promise<ThemeModule<unknown>> | undefined;

  async function loadValidated(): Promise<ThemeModule<unknown>> {
    const { default: Theme } = await load();
    function ValidatedTheme(props: ThemeProps<unknown>) {
      const parsed = manifest.optionsSchema.safeParse(props.options);
      return createElement(Theme, {
        ...props,
        options: parsed.success ? parsed.data : manifest.defaultOptions,
      });
    }
    ValidatedTheme.displayName = `Theme(${manifest.slug})`;
    return { default: ValidatedTheme };
  }

  return {
    manifest,
    // A failed import must not stay memoized, otherwise the process fails until restart.
    load: () =>
      (cached ??= loadValidated().catch((error: unknown) => {
        cached = undefined;
        throw error;
      })),
  };
}

// Dynamic import → each theme is its own chunk; a wedding page only loads the theme it uses.
export const themeRegistry: Readonly<Record<string, ThemeEntry>> = Object.freeze({
  "blush-rose": defineTheme(blushRoseManifest, () => import("./blush-rose")),
  placeholder: defineTheme(placeholderManifest, () => import("./placeholder")),
});

export const themeSlugs: readonly string[] = Object.freeze(Object.keys(themeRegistry));

export function getThemeEntry(slug: string): ThemeEntry | undefined {
  return Object.hasOwn(themeRegistry, slug) ? themeRegistry[slug] : undefined;
}
