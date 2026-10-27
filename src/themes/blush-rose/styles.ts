// Class names defined in theme.css (global CSS, br- prefix). One object so call sites read like a
// CSS module (`s.title`) and typos fail type-checking.
export const s = {
  root: "br-root",
  paper: "br-paper",
  title: "br-title",
  script: "br-script",
  main: "br-main",
  stage: "br-stage",
  layer: "br-layer",
  envBack: "br-env-back",
  envFront: "br-env-front",
  flap: "br-flap",
  photo: "br-photo",
  seal: "br-seal",
  overlay: "br-overlay",
  heart: "br-heart",
  track: "br-track",
  slide: "br-slide",
  lixi: "br-lixi",
  lixiFlap: "br-lixi-flap",
} as const;
