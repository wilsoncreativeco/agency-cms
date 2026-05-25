// ClientPageEditor.jsx
// Routes each client to their purpose-built editor based on their slug.
// To add a new client: add their slug → lazy import below, build their editor file.

import { lazy, Suspense } from 'react'
import { Loader2 }        from 'lucide-react'
import { useClient }      from '@/hooks/useClient'

// ─── Register client editors here ────────────────────────────────────────────
const CLIENT_EDITORS = {
  'zantara': lazy(() => import('./editors/ZantaraEditor')),
  // 'new-client-slug': lazy(() => import('./editors/NewClientEditor')),
}

function Spinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function ClientPageEditor() {
  const { client, loading } = useClient()

  if (loading) return <Spinner />

  const slug   = client?.slug?.toLowerCase()
  const Editor = slug ? CLIENT_EDITORS[slug] : null

  if (!Editor) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center px-8">
        <p className="text-2xl mb-2">🔧</p>
        <p className="text-sm font-semibold">Editor not set up yet</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Contact Wilson Creative Co. to get your site editor configured.
        </p>
      </div>
    )
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Editor />
    </Suspense>
  )
}
