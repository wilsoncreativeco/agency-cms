import { useRef, useState } from 'react'
import { ImagePlus, X, FolderOpen, Loader2 } from 'lucide-react'
import { Button }   from '@/components/ui/button'
import { MediaPickerModal } from './MediaPickerModal'
import { useAuth }       from '@/contexts/AuthContext'
import { useClient }     from '@/hooks/useClient'
import { mediaService }  from '@/services/media.service'
import { useToast }      from '@/components/ui/toast-provider'
import { cn } from '@/lib/utils'

export function MediaPickerField({ value, onChange, label }) {
  const { user }     = useAuth()
  const { clientId } = useClient()
  const { toast }    = useToast()
  const inputRef     = useRef()
  const [open,      setOpen]      = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragging,  setDragging]  = useState(false)

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const media = await mediaService.upload(clientId, file, user.id)
      onChange(media.file_url)
    } catch (e) {
      toast({ title: 'Upload failed', description: e.message, variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const onDragOver  = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false) }
  const onDrop      = (e) => { e.preventDefault(); setDragging(false); uploadFile(e.dataTransfer.files[0]) }

  if (value) {
    return (
      <div className="relative group rounded-lg border overflow-hidden">
        <img src={value} alt="Selected" className="h-32 w-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" className="h-8 text-xs gap-1" onClick={() => setOpen(true)}>
            <FolderOpen className="h-3.5 w-3.5" /> Change
          </Button>
          <Button size="sm" variant="secondary" className="h-8 text-xs gap-1" onClick={() => inputRef.current.click()}>
            <ImagePlus className="h-3.5 w-3.5" /> Upload
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={() => onChange('')}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { uploadFile(e.target.files[0]); e.target.value = '' }}
        />
        <MediaPickerModal
          open={open}
          onClose={() => setOpen(false)}
          onSelect={(url) => { onChange(url); setOpen(false) }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-7 cursor-pointer transition-colors',
          dragging   ? 'border-primary bg-primary/5' : 'hover:bg-muted/30',
          uploading  && 'pointer-events-none opacity-60'
        )}
        onClick={() => !uploading && inputRef.current.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {uploading
          ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          : <ImagePlus className="h-6 w-6 text-muted-foreground" />
        }
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {uploading ? 'Uploading…' : 'Drag photo here'}
          </p>
          {!uploading && <p className="text-xs text-muted-foreground/60 mt-0.5">or click to browse</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { uploadFile(e.target.files[0]); e.target.value = '' }}
      />

      <button
        type="button"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        onClick={() => setOpen(true)}
      >
        Pick from media library
      </button>

      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(url) => { onChange(url); setOpen(false) }}
      />
    </div>
  )
}
