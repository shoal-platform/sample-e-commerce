"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [image, setImage] = useState(user.image ?? "");

  return (
    <form className="rounded-lg border bg-card p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Account details for {user.email}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Display name
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Email
          <Input value={user.email} disabled />
        </label>
        <label className="space-y-2 text-sm font-medium sm:col-span-2">
          Avatar URL
          <Input value={image} onChange={(event) => setImage(event.target.value)} />
        </label>
      </div>
      <div className="mt-5 flex justify-end">
        <Button type="button" disabled>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
