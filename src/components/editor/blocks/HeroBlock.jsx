import { Label }    from '@/components/ui/label'
import { Input }    from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button }   from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { MediaPickerField } from '@/components/media/MediaPickerField'

export function HeroBlock({ content, onChange }) {
  const set    = (key, value) => onChange({ ...content, [key]: value })
  const stats  = content.stats ?? []
  const setStats = (next) => set('stats', next)
  const addStat    = () => setStats([...stats, { id: crypto.randomUUID(), value: '', suffix: '', label: '' }])
  const removeStat = (id) => setStats(stats.filter(s => s.id !== id))
  const updateStat = (id, k, v) => setStats(stats.map(s => s.id === id ? { ...s, [k]: v } : s))

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        📍 This is the <strong>banner section</strong> at the very top of your page.
      </div>

      <div className="space-y-2">
        <Label>Main heading</Label>
        <Input value={content.heading ?? ''} onChange={e => set('heading', e.target.value)} placeholder="e.g. Gold Coast's Best Formwork" />
        <p className="text-xs text-muted-foreground">The big text visitors see first.</p>
      </div>

      <div className="space-y-2">
        <Label>Subheading</Label>
        <Textarea value={content.subheading ?? ''} onChange={e => set('subheading', e.target.value)} placeholder="A short sentence about what you do" rows={2} />
        <p className="text-xs text-muted-foreground">One or two lines under the heading.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Button text</Label>
          <Input value={content.cta_primary ?? content.cta_text ?? ''} onChange={e => set('cta_primary', e.target.value)} placeholder="Get a Quote" />
        </div>
        <div className="space-y-2">
          <Label>2nd button text</Label>
          <Input value={content.cta_secondary ?? ''} onChange={e => set('cta_secondary', e.target.value)} placeholder="Our Projects" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Phone number</Label>
        <Input value={content.phone ?? ''} onChange={e => set('phone', e.target.value)} placeholder="+61 474 731 763" />
        <p className="text-xs text-muted-foreground">Shown as a clickable link in the top bar.</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label>Stats / highlights</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Numbers shown across the hero (e.g. 500+ Projects)</p>
          </div>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={addStat}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {stats.map((s) => (
          <div key={s.id} className="rounded-lg border bg-muted/30 p-3 grid grid-cols-[1fr_60px_1fr_auto] gap-2 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Number</Label>
              <Input value={s.value ?? ''} onChange={e => updateStat(s.id, 'value', e.target.value)} placeholder="500" className="h-8" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Symbol</Label>
              <Input value={s.suffix ?? ''} onChange={e => updateStat(s.id, 'suffix', e.target.value)} placeholder="+" className="h-8 text-center" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Label</Label>
              <Input value={s.label ?? ''} onChange={e => updateStat(s.id, 'label', e.target.value)} placeholder="Projects" className="h-8" />
            </div>
            <button onClick={() => removeStat(s.id)} className="mb-0.5 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Background image</Label>
        <MediaPickerField value={content.background_image ?? ''} onChange={url => set('background_image', url)} />
        <p className="text-xs text-muted-foreground">The image behind the heading text.</p>
      </div>
    </div>
  )
}
