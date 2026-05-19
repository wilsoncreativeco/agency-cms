import { Label }    from '@/components/ui/label'
import { Input }    from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch }   from '@/components/ui/switch'

export function ContactBlock({ content, onChange }) {
  const set = (key, value) => onChange({ ...content, [key]: value })
  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        📍 This is the <strong>Contact section</strong> — where visitors reach out to you.
      </div>
      <div className="space-y-2">
        <Label>Heading</Label>
        <Input value={content.heading ?? ''} onChange={e => set('heading', e.target.value)} placeholder="Get in touch" />
      </div>
      <div className="space-y-2">
        <Label>Email address</Label>
        <Input type="email" value={content.email ?? ''} onChange={e => set('email', e.target.value)} placeholder="hello@yourbusiness.com.au" />
      </div>
      <div className="space-y-2">
        <Label>Phone number</Label>
        <Input value={content.phone ?? ''} onChange={e => set('phone', e.target.value)} placeholder="+61 400 000 000" />
      </div>
      <div className="space-y-2">
        <Label>Address (optional)</Label>
        <Textarea value={content.address ?? ''} onChange={e => set('address', e.target.value)} placeholder="123 Main St, Gold Coast QLD 4217" rows={2} />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Show enquiry form</p>
          <p className="text-xs text-muted-foreground">Let visitors send you a message directly from the page</p>
        </div>
        <Switch checked={content.show_form ?? true} onCheckedChange={v => set('show_form', v)} />
      </div>
    </div>
  )
}
