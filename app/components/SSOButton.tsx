// app/components/SSOButton.tsx

"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const SSOButton: React.FC = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white">Signed in as {session.user?.email}</span>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded ml-4"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-indigo-600 text-white px-4 py-2 rounded"
      onClick={() => signIn("google")}
    >
      Sign in with Google
    </button>
  );
};

export default SSOButton;
