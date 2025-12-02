"use client";

import { useContext } from "react";
import { RequestIdContext } from "@/contexts/request-id-context";

export const useRequestId = () => {
  return useContext(RequestIdContext);
};
