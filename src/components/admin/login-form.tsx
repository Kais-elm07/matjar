"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/admin/actions"

/** The admin panel's sign-in: one password field. */
export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, { message: null })

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.message ? true : undefined}
          aria-describedby={state.message ? "password-error" : undefined}
        />
      </div>
      {state.message && (
        <p
          id="password-error"
          role="alert"
          className="text-sm font-medium text-destructive"
        >
          {state.message}
        </p>
      )}
      <Button
        type="submit"
        variant="cta"
        size="xl"
        className="w-full"
        disabled={pending}
      >
        {pending ? "جارٍ الدخول..." : "دخول"}
      </Button>
    </form>
  )
}
