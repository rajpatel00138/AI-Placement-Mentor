"use client";

import { useMemo, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const value = useMemo(() => ({ isAuthenticated, setIsAuthenticated }), [isAuthenticated]);

  return value;
}
