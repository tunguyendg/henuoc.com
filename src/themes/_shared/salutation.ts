const PREFIX = "kính mời";

const fold = (text: string) => text.normalize("NFC").toLocaleLowerCase("vi");

/**
 * One invitation line from `GuestContext.salutation`. The salutation normally carries its own
 * prefix ("Trân trọng kính mời Anh Minh"); a bare name gets "Kính mời " so it never reads as a label.
 */
export function inviteLine(salutation: string): string {
  const trimmed = salutation.trim();
  return fold(trimmed).includes(PREFIX) ? trimmed : `Kính mời ${trimmed}`;
}
