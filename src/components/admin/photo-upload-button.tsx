"use client"

import { Upload } from "lucide-react"
import { useRef, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { uploadProductPhoto } from "@/lib/admin/actions"
import {
  UPLOAD_MESSAGES,
  UPLOAD_TYPES,
  uploadFileProblem,
} from "@/lib/admin/upload-rules"
import { toast } from "@/lib/toast"

interface PhotoUploadButtonProps {
  /** The photo's number in the form, from 1, for the button's name */
  number: number
  /** Puts the uploaded photo's address in the form */
  onUploaded: (src: string) => void
}

/**
 * Uploads a photo from the owner's device: the file is checked here first (its type and size), then
 * sent to the server, which prepares its copies and keeps them in Supabase Storage.
 */
export function PhotoUploadButton({
  number,
  onUploaded,
}: PhotoUploadButtonProps) {
  const input = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()

  function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Cleared, so the same file can be chosen again after a problem
    event.target.value = ""
    if (!file) return
    const problem = uploadFileProblem(file)
    if (problem) {
      toast.error(problem)
      return
    }
    const form = new FormData()
    form.append("photo", file)
    startTransition(async () => {
      try {
        const result = await uploadProductPhoto(form)
        if (!result.ok) {
          toast.error(result.problem)
          return
        }
        onUploaded(result.src)
        toast("رُفعت الصورة. احفظ المنتج لتظهر في المتجر.")
      } catch {
        // The request itself failed: the connection, or a file larger than the server takes
        toast.error(UPLOAD_MESSAGES.unreachable)
      }
    })
  }

  return (
    <>
      <input
        ref={input}
        type="file"
        accept={UPLOAD_TYPES.join(",")}
        hidden
        onChange={upload}
      />
      <Button
        variant="outline"
        size="xl"
        disabled={pending}
        aria-label={pending ? undefined : `رفع الصورة ${number}`}
        onClick={() => input.current?.click()}
      >
        <Upload aria-hidden="true" />
        {pending ? "جارٍ الرفع..." : "رفع"}
      </Button>
    </>
  )
}
