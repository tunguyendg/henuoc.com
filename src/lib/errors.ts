/**
 * Thrown when a record does not exist OR does not belong to the caller's wedding.
 * Both cases must look identical to the caller so an attacker cannot probe which ids exist.
 */
export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`);
    this.name = "NotFoundError";
  }
}
