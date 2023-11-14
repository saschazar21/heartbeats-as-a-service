import { uid } from "uid/secure";

const parsedLength = parseInt(process.env.UID_LENGTH!, 10);

export const DEFAULT_UID_LENGTH = 16;

export const getId = () =>
  uid(!isNaN(parsedLength) ? parsedLength : DEFAULT_UID_LENGTH);
