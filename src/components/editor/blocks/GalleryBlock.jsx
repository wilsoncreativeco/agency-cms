import { useRef, useState } from 'react'
import { Trash2, Plus, Upload, ImagePlus, Loader2 } from 'lucide-react'
import { Label }    from '@/components/ui/label'
import { Input }    from '@/components/ui/input'
import { Button }   from '@/components/ui/button'
import { useAuth }  from '@/contexts/AuthContext'
import { useClient } from '@/hooks/useClient'
import { mediaService } from '@/services/media.service'
import { useToast }     from '@/components/ui/toast-provider'
import { cn } from '@/lib/utils'

export function GalleryBlock({ content, onChange }) {
  const { user }      = useAuth()
  const { clientId }  = useClient()
  const { toast }     = useToast()
  const inputRef      = useRef()
  const [uploading, setUploading] = useState(false)
  const [dragging,  setDragging]  = useState(false)

  const set       = (key, value) => onChange({ ...content, [key]: value })
  const images    = content.images ?? []
  const setImages = (next) => set('images', next)

  const handleFiles = async (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!imageFiles.length) return
    setUploading(true)
    const uploads = []
    for (const file of imageFiles) {
      try {
        const media = await mediaService.upload(clientId, file, user.id)
        uploads.push({ id: media.id, url: media.file_url, alt: '' })
      } catch (e) {
        toast({ title: `Upload failed: ${file.name}`, description: e.message, variant: 'destructive' })
      }
    }
    if (uploads.length) setImages([...images, ...uploads])
    setUploading(false)
  }

  const onDragOver  = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false) }
  const onDrop      = (e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }

  const updateAlt   = (id, alt) => setImages(images.map(i => i.id === id ? { ...i, alt } : i))
  const removeImage = (id)      => setImages(images.filter(i => i.id !== id))

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Section heading</Label>
        <Input value={content.heading ?? ''} onChange={e => set('heading', e.target.value)} placeholder="Gallery" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Images</Label>
          <Button
            size="sm" variant="outline" className="h-7 gap-1 text-xs"
            onClick={() => inputRef.current.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => { handleFiles(e.target.files); e.target.value = '' }}
          />
        </div>

        {images.length === 0 ? (
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-10 cursor-pointer transition-colors',
              dragging ? 'border-primary bg-primary/5' : 'hover:bg-muted/30',
              uploading && 'pointer-events-none opacity-60'
            )}
            onClick={() => inputRef.current.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {uploading
              ? <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
              : <ImagePlus className="h-7 w-7 text-muted-foreground" />
            }
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                {uploading ? 'Uploading photos…' : 'Drag photos here'}
              </p>
              {!uploading && <p className="text-xs text-muted-foreground/60 mt-0.5">or click to browse</p>}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'grid grid-cols-3 gap-2 rounded-lg transition-colors',
              dragging && 'outline outline-2 outline-primary outline-offset-2 bg-primary/5'
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {images.map(img => (
              <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border">
                <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                  <input
                    value={img.alt}
                    onChange={e => updateAlt(img.id, e.target.value)}
                    placeholder="Caption (optional)"
                    className="w-full rounded text-xs bg-white/20 text-white placeholder:text-white/60 px-2 py-1 border-0 outline-none text-center"
                    onClick={e => e.stopPropagation()}
                  />
                  <button onClick={() => removeImage(img.id)} className="text-white/80 hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add more tile */}
            <div
              className={cn(
                'flex flex-col aspect-square items-center justify-center gap-1 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
                uploading ? 'opacity-60 pointer-events-none' : 'hover:bg-muted/30'
              )}
              onClick={() => !uploading && inputRef.current.click()}
            >
              {uploading
                ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                : <>
                    <Plus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Add more</span>
                  </>
              }
            </div>
          </div>
        )}

        {images.length > 0 && (
          <p className="text-[11px] text-muted-foreground/60">
            Drag photos onto the grid to add more. Hover a photo to remove it.
          </p>
        )}
      </div>
    </div>
  )
}
