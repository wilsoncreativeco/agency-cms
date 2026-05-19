import { Plus, Trash2 } from 'lucide-react'
import { Label }    from '@/components/ui/label'
import { Input }    from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button }   from '@/components/ui/button'
import { MediaPickerField } from '@/components/media/MediaPickerField'

export function TeamBlock({ content, onChange }) {
  const set      = (key, value) => onChange({ ...content, [key]: value })
  const members  = content.members ?? []
  const setMembers = (next) => set('members', next)

  const addMember    = () => setMembers([...members, { id: crypto.randomUUID(), name: '', role: '', bio: '', years: '', photo: '' }])
  const removeMember = (id)        => setMembers(members.filter(m => m.id !== id))
  const updateMember = (id, k, v)  => setMembers(members.map(m => m.id === id ? { ...m, [k]: v } : m))

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        📍 This is the <strong>Meet the Team section</strong> — photos and bios of your crew.
      </div>
      <div className="space-y-2">
        <Label>Section heading</Label>
        <Input value={content.heading ?? ''} onChange={e => set('heading', e.target.value)} placeholder="Meet the Team" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Team members</Label>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={addMember}>
            <Plus className="h-3.5 w-3.5" /> Add member
          </Button>
        </div>

        {members.map((m, i) => (
          <div key={m.id} className="rounded-lg border bg-muted/30 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Member {i + 1}</span>
              <button onClick={() => removeMember(m.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Full name</Label>
                <Input value={m.name ?? ''} onChange={e => updateMember(m.id, 'name', e.target.value)} placeholder="Jane Smith" className="h-8" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Role / Job title</Label>
                <Input value={m.role ?? ''} onChange={e => updateMember(m.id, 'role', e.target.value)} placeholder="Site Supervisor" className="h-8" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Years of experience (optional)</Label>
              <Input value={m.years ?? ''} onChange={e => updateMember(m.id, 'years', e.target.value)} placeholder="8" className="h-8 w-24" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Short bio</Label>
              <Textarea value={m.bio ?? ''} onChange={e => updateMember(m.id, 'bio', e.target.value)} placeholder="A sentence or two about this person's background and expertise." rows={2} className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Photo</Label>
              <MediaPickerField value={m.photo ?? ''} onChange={url => updateMember(m.id, 'photo', url)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
