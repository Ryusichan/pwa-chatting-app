"use client";

import { signOut } from "next-auth/react";
import React from "react";

const Users = () => {
  return <button onClick={() => signOut()}>Hello Users!</button>;
};

export default Users;
