// app/Providers.tsx

"use client";

import { SessionProvider } from "next-auth/react";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;
