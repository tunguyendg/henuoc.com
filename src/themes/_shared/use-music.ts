import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface MusicController {
  isPlaying: boolean;
  isMuted: boolean;
  unlock: () => void;
  toggle: () => void;
}

const noop = () => {};
const SILENT: MusicController = { isPlaying: false, isMuted: false, unlock: noop, toggle: noop };

// ── Phần 1: nhớ "khách đã tắt nhạc" trong phiên (sessionStorage) ──
const MUTED_KEY = "henuoc:music-muted";

function readMuted(): boolean {
  try {
    return sessionStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false; // Safari ẩn danh / webview chặn storage → coi như chưa tắt
  }
}

function writeMuted(muted: boolean) {
  try {
    if (muted) sessionStorage.setItem(MUTED_KEY, "1");
    else sessionStorage.removeItem(MUTED_KEY);
  } catch {
    // không lưu được thì thôi, nhạc vẫn chạy bình thường
  }
}

export function useMusic(src: string | undefined, opts?: { disabled?: boolean }): MusicController {
  const disabled = !src || opts?.disabled === true;

  // ── Phần 2: trạng thái ──
  const audioRef = useRef<HTMLAudioElement | null>(null); // MỘT thẻ audio duy nhất
  const mutedRef = useRef<boolean | null>(null); // null = chưa đọc sessionStorage
  const wasPlayingRef = useRef(false); // trước khi ẩn tab có đang phát không
  const [isPlaying, setPlaying] = useState(false);
  const [isMuted, setMuted] = useState(false);

  const isMutedNow = useCallback(() => {
    if (mutedRef.current === null) mutedRef.current = readMuted();
    return mutedRef.current;
  }, []);

  // ── Phần 3: tạo audio LƯỜI — chỉ khi khách chạm lần đầu ──
  const getAudio = useCallback(() => {
    if (disabled || !src) return null;
    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.preload = "none";
      audio.loop = true;
      // isPlaying lấy theo sự kiện thật của thẻ audio, không tự đoán
      audio.onplay = () => setPlaying(true);
      audio.onpause = () => setPlaying(false);
      audio.onended = () => setPlaying(false);
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [disabled, src]);

  // ── Phần 4: unlock — gọi NGAY trong cú chạm mở phong bì ──
  const unlock = useCallback(() => {
    if (isMutedNow()) {
      setMuted(true);
      return;
    }
    const audio = getAudio();
    if (!audio || !audio.paused) return; // gọi 2 lần không phát lại từ đầu
    audio.play().catch(() => setPlaying(false)); // trình duyệt từ chối → im lặng, thiệp vẫn mở
  }, [getAudio, isMutedNow]);

  // ── Phần 5: toggle — nút ♪ ──
  const toggle = useCallback(() => {
    const audio = getAudio();
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      mutedRef.current = true;
      writeMuted(true);
      setMuted(true);
    } else {
      mutedRef.current = false;
      writeMuted(false);
      setMuted(false);
      audio.play().catch(() => setPlaying(false));
    }
  }, [getAudio]);

  // ── Phần 6: chuyển tab / khoá màn hình ──
  useEffect(() => {
    if (disabled) return;
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        wasPlayingRef.current = !audio.paused;
        audio.pause();
      } else if (wasPlayingRef.current && !isMutedNow()) {
        audio.play().catch(() => setPlaying(false));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [disabled, isMutedNow]);

  // ── Phần 7: dọn dẹp khi rời trang hoặc đổi bài nhạc ──
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.onplay = audio.onpause = audio.onended = null;
        audio.pause();
        audio.src = "";
      }
      audioRef.current = null;
    };
  }, [src]);

  // ── Phần 8: trả về object ổn định ──
  return useMemo<MusicController>(
    () => (disabled ? SILENT : { isPlaying, isMuted, unlock, toggle }),
    [disabled, isPlaying, isMuted, unlock, toggle],
  );
}