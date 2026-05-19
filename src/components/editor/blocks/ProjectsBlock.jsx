import { Plus, Trash2 } from 'lucide-react'
import { Label }    from '@/components/ui/label'
import { Input }    from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button }   from '@/components/ui/button'
import { MediaPickerField } from '@/components/media/MediaPickerField'

export function ProjectsBlock({ content, onChange }) {
  const set      = (key, value) => onChange({ ...content, [key]: value })
  const items    = content.items ?? []
  const setItems = (next) => set('items', next)

  const addItem    = () => setItems([...items, { id: crypto.randomUUID(), title: '', description: '', status: '', location: '', image: '' }])
  const removeItem = (id)        => setItems(items.filter(i => i.id !== id))
  const updateItem = (id, k, v)  => setItems(items.map(i => i.id === id ? { ...i, [k]: v } : i))

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        📍 This is the <strong>Projects section</strong> — image cards showing your current and past work.
      </div>
      <div className="space-y-2">
        <Label>Section heading</Label>
        <Input value={content.heading ?? ''} onChange={e => set('heading', e.target.value)} placeholder="Projects" />
      </div>
      <div className="space-y-2">
        <Label>Section subheading</Label>
        <Input value={content.subheading ?? ''} onChange={e => set('subheading', e.target.value)} placeholder="Current and recent jobs" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Project cards</Label>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={addItem}>
            <Plus className="h-3.5 w-3.5" /> Add project
          </Button>
        </div>

        {items.map((item, i) => (
          <div key={item.id} className="rounded-lg border bg-muted/30 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Project {i + 1}</span>
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Project name</Label>
              <Input value={item.title ?? ''} onChange={e => updateItem(item.id, 'title', e.target.value)} placeholder="Broadbeach Rise — Level 4 Slab" className="h-8" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Status badge</Label>
                <Input value={item.status ?? ''} onChange={e => updateItem(item.id, 'status', e.target.value)} placeholder="In Progress" className="h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Location</Label>
                <Input value={item.location ?? ''} onChange={e => updateItem(item.id, 'location', e.target.value)} placeholder="Gold Coast" className="h-8" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Short description</Label>
              <Textarea value={item.description ?? ''} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="A brief description of this project." rows={2} className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Project photo</Label>
              <MediaPickerField value={item.image ?? ''} onChange={url => updateItem(item.id, 'image', url)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
