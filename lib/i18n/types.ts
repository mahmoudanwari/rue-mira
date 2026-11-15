import type en from "./en";

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };

/** Every locale must provide exactly the same keys as English. */
export type Dictionary = Widen<typeof en>;
