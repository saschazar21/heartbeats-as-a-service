import { uid } from "uid/secure";

export const DEFAULT_UID_LENGTH = 16;

export const getId = () => uid(DEFAULT_UID_LENGTH);
