import { Label }    from '@/components/ui/label'
import { Input }    from '@/components/ui/input'
import { MediaPickerField } from '@/components/media/MediaPickerField'
import { RichTextEditor }   from '@/components/editor/RichTextEditor'

export function AboutBlock({ content, onChange }) {
  const set = (key, value) => onChange({ ...content, [key]: value })

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        📍 This is the <strong>About section</strong> — a photo and text that tells your story.
      </div>
      <div className="space-y-2">
        <Label>Section heading</Label>
        <Input value={content.heading ?? ''} onChange={e => set('heading', e.target.value)} placeholder="About Us" />
      </div>
      <div className="space-y-2">
        <Label>Story / body text</Label>
        <RichTextEditor value={content.body ?? ''} onChange={v => set('body', v)} />
        <p className="text-xs text-muted-foreground">Tell visitors who you are, your experience and what makes you different.</p>
      </div>
      <div className="space-y-2">
        <Label>Photo / image</Label>
        <MediaPickerField value={content.image_url ?? content.image ?? ''} onChange={url => set('image_url', url)} />
        <p className="text-xs text-muted-foreground">A photo of your team, your work, or your location.</p>
      </div>
    </div>
  )
}
