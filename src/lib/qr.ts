import "server-only"; // QR rendering runs on the server only; a client import fails the build
import QRCode from "qrcode";

export const MAX_QR_PAYLOAD_LENGTH = 512;

/**
 * Renders `payload` (e.g. a VietQR string from buildVietQrPayload) as an SVG data URI.
 *
 * Server-only. The result is meant for `GiftView.qrSvg` and must be rendered with
 * `<img src={qrSvg}>`: SVG loaded through <img> never runs scripts, unlike inline SVG /
 * dangerouslySetInnerHTML. Never store the result in the DB and never accept it from input.
 */
export async function qrSvgDataUri(payload: string): Promise<string> {
  if (typeof payload !== "string" || payload.length === 0) {
    throw new Error("QR payload must not be empty");
  }
  if (payload.length > MAX_QR_PAYLOAD_LENGTH) {
    throw new Error(`QR payload must not exceed ${MAX_QR_PAYLOAD_LENGTH} characters`);
  }
  const svg = await QRCode.toString(payload, { type: "svg", errorCorrectionLevel: "M", margin: 2 });
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}
