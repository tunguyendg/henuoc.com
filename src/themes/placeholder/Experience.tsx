"use client";

import type { ReactNode } from "react";
import { Envelope } from "../_shared/Envelope";
import { MusicToggle } from "../_shared/MusicToggle";
import { useMusic } from "../_shared/use-music";
import type { ThemeProps } from "../types";

// The one client leaf of this theme. Functions (music.unlock) cannot cross the Server → Client
// boundary as props, so the hook, the envelope and the ♪ button must live in the same client tree.
// The cover (names + date) arrives as server-rendered `children`.
//
// NOTE: useMusic is still the empty stub (Tony writes it, docs/07 §3). Until then the ♪ button shows
// and can be pressed, but no sound plays. That is the expected state for now.

interface ExperienceProps {
  musicSrc?: string;
  mode: ThemeProps["mode"];
  children: ReactNode;
}

export function Experience({ musicSrc, mode, children }: ExperienceProps) {
  // preview = builder: no music at all (docs/07 §10).
  const music = useMusic(musicSrc, { disabled: mode === "preview" });
  return (
    <>
      <Envelope onOpen={music.unlock}>{children}</Envelope>
      <MusicToggle music={music} hidden={!musicSrc || mode === "preview"} />
    </>
  );
}
