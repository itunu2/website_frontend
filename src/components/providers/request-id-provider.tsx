"use client";

import type { PropsWithChildren } from "react";
import { RequestIdContext } from "@/contexts/request-id-context";

interface RequestIdProviderProps extends PropsWithChildren {
  value: string;
}

export const RequestIdProvider = ({ value, children }: RequestIdProviderProps) => {
  return <RequestIdContext.Provider value={value}>{children}</RequestIdContext.Provider>;
};
