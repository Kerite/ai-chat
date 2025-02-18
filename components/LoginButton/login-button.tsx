"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export function LoginButton() {
  const { user } = useUser();

  if (user) {
    return (<>
      <div>
        <span>{user.name}</span>
        <a href="/api/auth/logout?returnTo=http://localhost:3000/login">(Sign Out)</a>
      </div>
    </>)
  }

  return (
    <div>
      <a href="/api/auth/login">Sign In</a>
    </div>
  )
}