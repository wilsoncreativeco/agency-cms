// ZantaraEditor.jsx
// Purpose-built editor for Zantara Formwork & Labour Hire.
// To add a new section: add to SECTIONS, add a case in SectionForm, build a Form component.

import { useState, useEffect, useRef } from 'react'
import {
  Loader2, CheckCircle2, ChevronRight,
  Plus, Trash2, Upload, Globe,
} from 'lucide-react'
import { useAuth }            from '@/contexts/AuthContext'
import { useClient }          from '@/hooks/useClient'
import { usePages }           from '@/hooks/usePages'
import { useContentBlocks }   from '@/hooks/useContentBlocks'
import { contentService }     from '@/services/content.service'
import { mediaService }       from '@/services/media.service'
import { pageService }        from '@/services/page.service'
import { useToast }           from '@/components/ui/toast-provider'
import { Button }             from '@/components/ui/button'
import { Input }              from '@/components/ui/input'
import { Textarea }           from '@/components/ui/textarea'
import { cn }                 from '@/lib/utils'

// ─── Section registry ───────────────────────────────────────────────────────
const SECTIONS = [
  { type: 'hero',     icon: '🏔', label: 'Top Banner',    desc: 'The big header at the top of your site' },
  { type: 'services', icon: '⚡', label: 'Services',      desc: 'Your two core service cards' },
  { type: 'about',    icon: '👤', label: 'About Us',      desc: 'Your story and background' },
  { type: 'projects', icon: '🏗', label: 'Our Work',      desc: 'Photos and details of recent projects' },
  { type: 'team',     icon: '👥', label: 'Meet the Team', desc: 'Your crew with photos and bios' },
  { type: 'faq',      icon: '💬', label: 'FAQs',          desc: 'Common questions and answers' },
  { type: 'contact',  icon: '📬', label: 'Contact',       desc: 'Your contact details and form' },
]

// ─── Main component ──────────────────────────────────────────────────────────
export default function ZantaraEditor() {
  const { user }              = useAuth()
  const { clientId }          = useClient()
  const { pages, loading: pagesLoading } = usePages()
  const { toast }             = useToast()

  const [page,       setPage]       = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [selected,   setSelected]   = useState('hero')

  // Find home page once pages load
  useEffect(() => {
    if (pagesLoading || !pages.length) return
    const home = pages.find(p =>
      p.slug === 'home' || p.slug === '' || p.slug === '/'
    ) ?? pages[0]
    setPage(home)
  }, [pages, pagesLoading])

  const { blocks, loading: blocksLoading, reload } = useContentBlocks(page?.id)

  const getBlock = (type) => blocks.find(b => b.block_type === type) ?? null

  const handlePublish = async () => {
    if (!page) return
    setPublishing(true)
    try {
      const updated = await pageService.publish(page.id)
      setPage(updated)
      toast({ title: '🟢 Your site is now live!', variant: 'success' })
    } catch (e) {
      toast({ title: 'Publish failed', description: e.message, variant: 'destructive' })
    } finally {
      setPublishing(false)
    }
  }

  const isPublished = page?.status === 'published'

  if (pagesLoading || blocksLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const selectedSection = SECTIONS.find(s => s.type === selected)
  const selectedBlock   = getBlock(selected)

  return (
    <div className="flex flex-col h-full">

      {/* ── Publish bar ──────────────────────────────────────────────────── */}
      <div className="flex h-12 shrink-0 items-center justify-between px-5 border-b bg-background">
        <div className="flex items-center gap-2">
          {isPublished ? (
            <>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-600">Live</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-xs font-medium text-amber-600">Unpublished changes</span>
            </>
          )}
        </div>
        <Button
          size="sm"
          disabled={publishing}
          onClick={handlePublish}
          className={cn(
            'h-8 gap-1.5 text-xs font-bold',
            isPublished
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-[hsl(var(--brand-gold))] hover:bg-[hsl(var(--brand-gold)/0.85)] text-[#07060a]'
          )}
        >
          {publishing
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : isPublished
              ? <><Globe className="h-3.5 w-3.5" /> Published</>
              : '⚡ Publish changes'
          }
        </Button>
      </div>

      {/* ── 2-column layout ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: section list */}
        <aside className="w-60 shrink-0 border-r overflow-y-auto bg-muted/10">
          <div className="p-3 space-y-1">
            {SECTIONS.map(section => {
              const isActive = selected === section.type
              return (
                <button
                  key={section.type}
                  onClick={() => setSelected(section.type)}
                  className={cn(
                    'w-full text-left flex items-center gap-3 rounded-xl p-3.5 border transition-all',
                    isActive
                      ? 'border-[hsl(var(--brand-gold)/0.6)] bg-[hsl(var(--brand-gold)/0.07)] shadow-sm'
                      : 'border-transparent hover:border-border hover:bg-card'
                  )}
                >
                  <span className="text-xl shrink-0 leading-none">{section.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-semibold leading-tight',
                      isActive ? 'text-[hsl(var(--brand-gold))]' : 'text-foreground'
                    )}>
                      {section.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5 truncate">
                      {section.desc}
                    </p>
                  </div>
                  <ChevronRight className={cn(
                    'h-3.5 w-3.5 shrink-0 transition-transform',
                    isActive
                      ? 'text-[hsl(var(--brand-gold))] rotate-90'
                      : 'text-muted-foreground/30'
                  )} />
                </button>
              )
            })}
          </div>
        </aside>

        {/* Right: form */}
        <main className="flex-1 overflow-hidden bg-background">
          {selectedBlock ? (
            <SectionForm
              key={selectedBlock.id}
              section={selectedSection}
              block={selectedBlock}
              clientId={clientId}
              userId={user?.id}
              onSaved={() => {
                reload()
                if (isPublished) setPage(p => ({ ...p, status: 'draft' }))
              }}
            />
          ) : (
            <div className="flex flex-col h-full items-center justify-center gap-2 text-center px-8">
              <p className="text-sm font-medium text-foreground">
                {selectedSection?.icon} {selectedSection?.label}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                This section hasn't been created yet. Run the seed script to set up all sections,
                or contact Wilson Creative Co.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ─── Section form router ─────────────────────────────────────────────────────
function SectionForm({ section, block, clientId, userId, onSaved }) {
  switch (section.type) {
    case 'hero':     return <HeroForm     block={block} clientId={clientId} userId={userId} onSaved={onSaved} />
    case 'services': return <ServicesForm block={block}                                     onSaved={onSaved} />
    case 'about':    return <AboutForm    block={block} clientId={clientId} userId={userId} onSaved={onSaved} />
    case 'projects': return <ProjectsForm block={block} clientId={clientId} userId={userId} onSaved={onSaved} />
    case 'team':     return <TeamForm     block={block} clientId={clientId} userId={userId} onSaved={onSaved} />
    case 'faq':      return <FaqForm      block={block}                                     onSaved={onSaved} />
    case 'contact':  return <ContactForm  block={block}                                     onSaved={onSaved} />
    default:         return null
  }
}

// ─── Shared UI helpers ───────────────────────────────────────────────────────

function useSave(block, onSaved) {
  const [saveState, setSaveState] = useState('idle') // 'idle' | 'saving' | 'saved'
  const { toast } = useToast()

  const save = async (contentJson) => {
    setSaveState('saving')
    try {
      await contentService.updateBlock(block.id, { content_json: contentJson })
      setSaveState('saved')
      onSaved()
      setTimeout(() => setSaveState('idle'), 2500)
    } catch (e) {
      setSaveState('idle')
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' })
    }
  }

  return { saveState, save }
}

function FormShell({ icon, title, children, onSave, saveState }) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none">{icon}</span>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <SaveButton saveState={saveState} onClick={onSave} />
      </div>

      {/* Scrollable form fields */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {children}
      </div>

      {/* Footer save */}
      <div className="px-6 py-4 border-t shrink-0 flex justify-end bg-background">
        <SaveButton saveState={saveState} onClick={onSave} />
      </div>
    </div>
  )
}

function SaveButton({ saveState, onClick }) {
  return (
    <Button
      size="sm"
      onClick={onClick}
      disabled={saveState === 'saving'}
      className={cn(
        'h-8 min-w-[120px] text-xs font-bold transition-all',
        saveState === 'saved'
          ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
          : 'bg-[hsl(var(--brand-gold))] hover:bg-[hsl(var(--brand-gold)/0.85)] text-[#07060a]'
      )}
    >
      {saveState === 'saving' && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
      {saveState === 'saved'  && <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />}
      {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved!' : 'Save changes'}
    </Button>
  )
}

function Field({ label, hint, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted-foreground leading-snug">{hint}</p>}
      {children}
    </div>
  )
}

function PhotoUpload({ value, onChange, clientId, userId, label = 'Photo', square = false }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver,  setDragOver]  = useState(false)
  const inputRef = useRef(null)
  const { toast } = useToast()

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const media = await mediaService.upload(clientId, file, userId)
      onChange(media.file_url)
    } catch (e) {
      toast({ title: 'Upload failed', description: e.message, variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
      className={cn(
        'relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-colors',
        square ? 'h-28 w-28' : 'h-36 w-full',
        dragOver
          ? 'border-[hsl(var(--brand-gold))] bg-[hsl(var(--brand-gold)/0.05)]'
          : 'border-border hover:border-[hsl(var(--brand-gold)/0.5)]'
      )}
    >
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
      {value ? (
        <div className="relative h-full group">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <p className="text-white text-xs font-semibold">Click to change</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-1.5 text-muted-foreground/50 px-3 text-center">
          <Upload className="h-5 w-5" />
          <p className="text-[11px] leading-snug">Drag photo here<br />or click to browse</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  )
}

function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--brand-gold))] hover:text-[hsl(var(--brand-gold)/0.75)] transition-colors"
    >
      <Plus className="h-3.5 w-3.5" /> {label}
    </button>
  )
}

function CardHeader({ label, onRemove }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/20 shrink-0">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive transition-colors"
        title="Remove"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function HeroForm({ block, onSaved }) {
  const [c, setC] = useState(block.content_json)
  const { saveState, save } = useSave(block, onSaved)

  const set = (k, v) => setC(p => ({ ...p, [k]: v }))
  const setStat = (i, k, v) => setC(p => ({
    ...p,
    stats: (p.stats ?? []).map((s, idx) => idx === i ? { ...s, [k]: v } : s),
  }))

  return (
    <FormShell icon="🏔" title="Top Banner" onSave={() => save(c)} saveState={saveState}>
      <Field label="Main heading" hint="The big text visitors see first">
        <Input value={c.heading ?? ''} onChange={e => set('heading', e.target.value)}
          placeholder="Gold Coast's Trusted Formwork Specialists" />
      </Field>
      <Field label="Subheading">
        <Textarea rows={3} value={c.subheading ?? ''} onChange={e => set('subheading', e.target.value)}
          placeholder="A short line about what you do and where." />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary button">
          <Input value={c.cta_primary ?? ''} onChange={e => set('cta_primary', e.target.value)}
            placeholder="Get a Quote" />
        </Field>
        <Field label="Secondary button">
          <Input value={c.cta_secondary ?? ''} onChange={e => set('cta_secondary', e.target.value)}
            placeholder="Our Projects" />
        </Field>
      </div>
      <Field label="Phone number">
        <Input value={c.phone ?? ''} onChange={e => set('phone', e.target.value)}
          placeholder="+61 400 000 000" />
      </Field>

      {(c.stats ?? []).length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">Stats banner</p>
          <div className="grid grid-cols-3 gap-3">
            {c.stats.map((stat, i) => (
              <div key={stat.id ?? i} className="space-y-2 p-3 rounded-lg bg-muted/40 border">
                <div className="flex gap-1.5">
                  <Input
                    className="text-center font-bold text-sm h-8"
                    value={stat.value ?? ''}
                    onChange={e => setStat(i, 'value', e.target.value)}
                    placeholder="500"
                  />
                  <Input
                    className="w-14 text-center text-sm h-8"
                    value={stat.suffix ?? ''}
                    onChange={e => setStat(i, 'suffix', e.target.value)}
                    placeholder="+"
                  />
                </div>
                <Input
                  className="text-sm h-8"
                  value={stat.label ?? ''}
                  onChange={e => setStat(i, 'label', e.target.value)}
                  placeholder="Projects"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </FormShell>
  )
}

// ─── Services ────────────────────────────────────────────────────────────────
function ServicesForm({ block, onSaved }) {
  const [c, setC] = useState(block.content_json)
  const { saveState, save } = useSave(block, onSaved)

  const set = (k, v) => setC(p => ({ ...p, [k]: v }))
  const setItem = (i, k, v) => setC(p => ({
    ...p,
    items: (p.items ?? []).map((item, idx) => idx === i ? { ...item, [k]: v } : item),
  }))

  return (
    <FormShell icon="⚡" title="Services" onSave={() => save(c)} saveState={saveState}>
      <Field label="Section heading">
        <Input value={c.heading ?? ''} onChange={e => set('heading', e.target.value)} />
      </Field>
      <Field label="Section subheading">
        <Input value={c.subheading ?? ''} onChange={e => set('subheading', e.target.value)} />
      </Field>
      <div className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide text-xs">Service cards</p>
        {(c.items ?? []).map((item, i) => (
          <div key={item.id ?? i} className="border rounded-xl bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b bg-muted/20">
              <p className="text-sm font-semibold">{item.icon} {item.title || `Service ${i + 1}`}</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title">
                  <Input value={item.title ?? ''} onChange={e => setItem(i, 'title', e.target.value)} />
                </Field>
                <Field label="Icon (emoji)">
                  <Input value={item.icon ?? ''} onChange={e => setItem(i, 'icon', e.target.value)}
                    placeholder="👷" className="text-center text-xl" />
                </Field>
              </div>
              <Field label="Short description (shown on the card)">
                <Textarea rows={2} value={item.description ?? ''} onChange={e => setItem(i, 'description', e.target.value)} />
              </Field>
              <Field label="Full description (shown on hover/flip)">
                <Textarea rows={3} value={item.back ?? ''} onChange={e => setItem(i, 'back', e.target.value)} />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </FormShell>
  )
}

// ─── About ───────────────────────────────────────────────────────────────────
function AboutForm({ block, clientId, userId, onSaved }) {
  const [c, setC] = useState(block.content_json)
  const { saveState, save } = useSave(block, onSaved)

  const set = (k, v) => setC(p => ({ ...p, [k]: v }))

  return (
    <FormShell icon="👤" title="About Us" onSave={() => save(c)} saveState={saveState}>
      <Field label="Heading">
        <Input value={c.heading ?? ''} onChange={e => set('heading', e.target.value)}
          placeholder="Built on the Tools" />
      </Field>
      <Field label="Body text" hint="You can use basic HTML tags like <p>, <strong>, <em>">
        <Textarea rows={8} value={c.body ?? ''} onChange={e => set('body', e.target.value)}
          placeholder="<p>Tell your story here...</p>" />
      </Field>
      <Field label="Photo">
        <PhotoUpload
          value={c.image_url ?? c.image ?? ''}
          onChange={url => set('image_url', url)}
          clientId={clientId}
          userId={userId}
        />
      </Field>
    </FormShell>
  )
}

// ─── Projects ────────────────────────────────────────────────────────────────
function ProjectsForm({ block, clientId, userId, onSaved }) {
  const [c, setC] = useState(block.content_json)
  const { saveState, save } = useSave(block, onSaved)

  const set = (k, v) => setC(p => ({ ...p, [k]: v }))
  const setItem = (i, k, v) => setC(p => ({
    ...p,
    items: (p.items ?? []).map((item, idx) => idx === i ? { ...item, [k]: v } : item),
  }))
  const addItem = () => setC(p => ({
    ...p,
    items: [...(p.items ?? []), {
      id: crypto.randomUUID(), title: '', description: '',
      status: 'Completed', location: '', image: '',
    }],
  }))
  const removeItem = (i) => setC(p => ({
    ...p,
    items: (p.items ?? []).filter((_, idx) => idx !== i),
  }))

  return (
    <FormShell icon="🏗" title="Our Work" onSave={() => save(c)} saveState={saveState}>
      <Field label="Section heading">
        <Input value={c.heading ?? ''} onChange={e => set('heading', e.target.value)} />
      </Field>
      <Field label="Section subheading">
        <Input value={c.subheading ?? ''} onChange={e => set('subheading', e.target.value)} />
      </Field>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Projects</p>
          <AddButton onClick={addItem} label="Add project" />
        </div>

        {(c.items ?? []).length === 0 && (
          <button
            onClick={addItem}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-[hsl(var(--brand-gold)/0.4)] hover:text-foreground transition-colors"
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm">Add your first project</span>
          </button>
        )}

        {(c.items ?? []).map((item, i) => (
          <div key={item.id ?? i} className="border rounded-xl overflow-hidden bg-card">
            <CardHeader
              label={item.title || `Project ${i + 1}`}
              onRemove={() => removeItem(i)}
            />
            <div className="p-4 space-y-3">
              <Field label="Project photo">
                <PhotoUpload
                  value={item.image ?? ''}
                  onChange={url => setItem(i, 'image', url)}
                  clientId={clientId}
                  userId={userId}
                  label="Project photo"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Project name">
                  <Input value={item.title ?? ''} onChange={e => setItem(i, 'title', e.target.value)}
                    placeholder="Surfers Paradise High-Rise" />
                </Field>
                <Field label="Location">
                  <Input value={item.location ?? ''} onChange={e => setItem(i, 'location', e.target.value)}
                    placeholder="Gold Coast" />
                </Field>
              </div>
              <Field label="Description">
                <Textarea rows={2} value={item.description ?? ''} onChange={e => setItem(i, 'description', e.target.value)}
                  placeholder="Brief description of the project…" />
              </Field>
              <Field label="Status">
                <select
                  value={item.status ?? 'Completed'}
                  onChange={e => setItem(i, 'status', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Coming Soon</option>
                </select>
              </Field>
            </div>
          </div>
        ))}
      </div>
    </FormShell>
  )
}

// ─── Team ────────────────────────────────────────────────────────────────────
function TeamForm({ block, clientId, userId, onSaved }) {
  const [c, setC] = useState(block.content_json)
  const { saveState, save } = useSave(block, onSaved)

  const set = (k, v) => setC(p => ({ ...p, [k]: v }))
  const setMember = (i, k, v) => setC(p => ({
    ...p,
    members: (p.members ?? []).map((m, idx) => idx === i ? { ...m, [k]: v } : m),
  }))
  const addMember = () => setC(p => ({
    ...p,
    members: [...(p.members ?? []), {
      id: crypto.randomUUID(), name: '', role: '', years: '', bio: '', photo: '',
    }],
  }))
  const removeMember = (i) => setC(p => ({
    ...p,
    members: (p.members ?? []).filter((_, idx) => idx !== i),
  }))

  return (
    <FormShell icon="👥" title="Meet the Team" onSave={() => save(c)} saveState={saveState}>
      <Field label="Section heading">
        <Input value={c.heading ?? ''} onChange={e => set('heading', e.target.value)} />
      </Field>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Team members</p>
          <AddButton onClick={addMember} label="Add member" />
        </div>

        {(c.members ?? []).length === 0 && (
          <button
            onClick={addMember}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-[hsl(var(--brand-gold)/0.4)] hover:text-foreground transition-colors"
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm">Add your first team member</span>
          </button>
        )}

        {(c.members ?? []).map((member, i) => (
          <div key={member.id ?? i} className="border rounded-xl overflow-hidden bg-card">
            <CardHeader
              label={member.name || `Team Member ${i + 1}`}
              onRemove={() => removeMember(i)}
            />
            <div className="p-4 space-y-3">
              <div className="flex gap-4 items-start">
                <div className="shrink-0">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Photo</p>
                  <PhotoUpload
                    value={member.photo ?? ''}
                    onChange={url => setMember(i, 'photo', url)}
                    clientId={clientId}
                    userId={userId}
                    label="Photo"
                    square
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <Field label="Full name">
                    <Input value={member.name ?? ''} onChange={e => setMember(i, 'name', e.target.value)}
                      placeholder="John Smith" />
                  </Field>
                  <Field label="Role / Title">
                    <Input value={member.role ?? ''} onChange={e => setMember(i, 'role', e.target.value)}
                      placeholder="Formwork Foreman" />
                  </Field>
                  <Field label="Years experience">
                    <Input value={member.years ?? ''} onChange={e => setMember(i, 'years', e.target.value)}
                      placeholder="12" type="number" />
                  </Field>
                </div>
              </div>
              <Field label="Bio">
                <Textarea rows={2} value={member.bio ?? ''} onChange={e => setMember(i, 'bio', e.target.value)}
                  placeholder="Brief description of their background…" />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </FormShell>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FaqForm({ block, onSaved }) {
  const [c, setC] = useState(block.content_json)
  const { saveState, save } = useSave(block, onSaved)

  const set = (k, v) => setC(p => ({ ...p, [k]: v }))
  const setItem = (i, k, v) => setC(p => ({
    ...p,
    items: (p.items ?? []).map((item, idx) => idx === i ? { ...item, [k]: v } : item),
  }))
  const addItem = () => setC(p => ({
    ...p,
    items: [...(p.items ?? []), { id: crypto.randomUUID(), question: '', answer: '' }],
  }))
  const removeItem = (i) => setC(p => ({
    ...p,
    items: (p.items ?? []).filter((_, idx) => idx !== i),
  }))

  return (
    <FormShell icon="💬" title="FAQs" onSave={() => save(c)} saveState={saveState}>
      <Field label="Section heading">
        <Input value={c.heading ?? ''} onChange={e => set('heading', e.target.value)} />
      </Field>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Questions & Answers</p>
          <AddButton onClick={addItem} label="Add question" />
        </div>

        {(c.items ?? []).map((item, i) => (
          <div key={item.id ?? i} className="border rounded-xl bg-card overflow-hidden">
            <CardHeader
              label={item.question ? `Q: ${item.question.slice(0, 40)}${item.question.length > 40 ? '…' : ''}` : `Question ${i + 1}`}
              onRemove={() => removeItem(i)}
            />
            <div className="p-4 space-y-3">
              <Field label="Question">
                <Input value={item.question ?? ''} onChange={e => setItem(i, 'question', e.target.value)}
                  placeholder="What areas do you cover?" />
              </Field>
              <Field label="Answer">
                <Textarea rows={3} value={item.answer ?? ''} onChange={e => setItem(i, 'answer', e.target.value)}
                  placeholder="Your answer here…" />
              </Field>
            </div>
          </div>
        ))}

        {(c.items ?? []).length === 0 && (
          <button
            onClick={addItem}
            className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-[hsl(var(--brand-gold)/0.4)] hover:text-foreground transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm">Add your first FAQ</span>
          </button>
        )}
      </div>
    </FormShell>
  )
}

// ─── Contact ─────────────────────────────────────────────────────────────────
function ContactForm({ block, onSaved }) {
  const [c, setC] = useState(block.content_json)
  const { saveState, save } = useSave(block, onSaved)

  const set = (k, v) => setC(p => ({ ...p, [k]: v }))

  return (
    <FormShell icon="📬" title="Contact" onSave={() => save(c)} saveState={saveState}>
      <Field label="Section heading">
        <Input value={c.heading ?? ''} onChange={e => set('heading', e.target.value)} />
      </Field>
      <Field label="Email address">
        <Input type="email" value={c.email ?? ''} onChange={e => set('email', e.target.value)}
          placeholder="hello@zantara.com.au" />
      </Field>
      <Field label="Phone number">
        <Input value={c.phone ?? ''} onChange={e => set('phone', e.target.value)}
          placeholder="+61 400 000 000" />
      </Field>
      <Field label="Address">
        <Input value={c.address ?? ''} onChange={e => set('address', e.target.value)}
          placeholder="Gold Coast, QLD 4217" />
      </Field>

      <Field label="Show enquiry form on the site?">
        <button
          type="button"
          onClick={() => set('show_form', !c.show_form)}
          className="flex items-center gap-3 group"
        >
          <span className={cn(
            'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
            c.show_form ? 'bg-[hsl(var(--brand-gold))]' : 'bg-muted border border-input'
          )}>
            <span className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
              c.show_form ? 'translate-x-6' : 'translate-x-1'
            )} />
          </span>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {c.show_form ? 'Yes — show the enquiry form' : 'No — contact details only'}
          </span>
        </button>
      </Field>
    </FormShell>
  )
}
