import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Globe, Loader2, Zap, LayoutList, PencilLine, CheckCircle2,
} from 'lucide-react'
import { pageService }      from '@/services/page.service'
import { useContentBlocks } from '@/hooks/useContentBlocks'
import { useClient }        from '@/hooks/useClient'
import { useToast }         from '@/components/ui/toast-provider'
import { BlockEditor }      from '@/components/editor/BlockEditor'
import { Button }           from '@/components/ui/button'
import { cn }               from '@/lib/utils'

// Plain-English names for clients
const SECTION_LABELS = {
  hero:         'Top Banner',
  about:        'About Us',
  services:     'Services',
  gallery:      'Photo Gallery',
  testimonials: 'Reviews',
  faq:          'FAQs',
  cta:          'Call to Action',
  contact:      'Contact',
  richtext:     'Text Section',
  team:         'Meet the Team',
  projects:     'Our Work',
  marquee:      'Ticker Banner',
}

const SECTION_DESCRIPTIONS = {
  hero:         'The big header at the top of your page',
  about:        'Your story and background',
  services:     'What you offer — the cards visitors browse',
  gallery:      'A grid of your photos',
  testimonials: 'Reviews and quotes from your clients',
  faq:          'Common questions and your answers',
  cta:          'A section with a button prompting action',
  contact:      'Your contact details and enquiry form',
  richtext:     'A block of text',
  team:         'Your team members with photos and bios',
  projects:     'Photos and details of your recent work',
  marquee:      'The scrolling text banner',
}

const SECTION_ICONS = {
  hero:         '🏔',
  about:        '👤',
  services:     '⚡',
  gallery:      '🖼',
  testimonials: '⭐',
  faq:          '💬',
  cta:          '🎯',
  contact:      '📬',
  richtext:     '📝',
  team:         '👥',
  projects:     '🏗',
  marquee:      '📢',
}

export default function ClientPageEditor() {
  const { pageId }   = useParams()
  const navigate     = useNavigate()
  const { toast }    = useToast()
  const { clientId, client } = useClient()

  const [page,        setPage]        = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [publishing,  setPublishing]  = useState(false)
  const [selectedBlock, setSelectedBlock] = useState(null)
  // Mobile panel: 'sections' | 'editor'
  const [mobilePanel, setMobilePanel] = useState('sections')

  const { blocks, setBlocks, loading: blocksLoading } = useContentBlocks(pageId)

  useEffect(() => {
    if (!pageId) return
    setPageLoading(true)
    pageService.get(pageId)
      .then(p => { setPage(p); setPageLoading(false) })
      .catch(() => navigate('/edit'))
  }, [pageId])

  // Keep selectedBlock in sync with blocks state
  useEffect(() => {
    if (selectedBlock) {
      const updated = blocks.find(b => b.id === selectedBlock.id)
      if (updated) setSelectedBlock(updated)
    }
  }, [blocks])

  const handleSelectBlock = (block) => {
    setSelectedBlock(block)
    setMobilePanel('editor')
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const updated = await pageService.publish(pageId)
      setPage(updated)
      toast({ title: '🟢 Published! Your site is now live.', variant: 'success' })
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setPublishing(false)
    }
  }

  const isPublished = page?.status === 'published'

  if (pageLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Publish bar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          {isPublished ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">
                Your site is <strong className="text-foreground">live</strong>
              </span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-sm text-muted-foreground">
                You have <strong className="text-foreground">unpublished changes</strong>
              </span>
            </>
          )}
        </div>
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={publishing || isPublished}
          className={cn(
            'h-8 gap-1.5 text-xs font-semibold',
            isPublished
              ? 'bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/10 cursor-default border border-emerald-600/20'
              : 'bg-[hsl(var(--brand-gold))] text-black hover:opacity-90'
          )}
        >
          {publishing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isPublished ? (
            <><Globe className="h-3.5 w-3.5" /> Published</>
          ) : (
            <><Zap className="h-3.5 w-3.5" /> Publish changes</>
          )}
        </Button>
      </div>

      {/* ── Mobile panel switcher ────────────────────────────────── */}
      <div className="flex border-b lg:hidden shrink-0">
        <button
          onClick={() => setMobilePanel('sections')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
            mobilePanel === 'sections'
              ? 'border-b-2 border-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold))]'
              : 'text-muted-foreground'
          )}
        >
          <LayoutList className="h-4 w-4" /> Sections
        </button>
        <button
          onClick={() => setMobilePanel('editor')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
            mobilePanel === 'editor'
              ? 'border-b-2 border-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold))]'
              : 'text-muted-foreground'
          )}
        >
          <PencilLine className="h-4 w-4" />
          {selectedBlock ? 'Edit section' : 'Edit'}
        </button>
      </div>

      {/* ── Editor body ──────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: section list */}
        <div className={cn(
          'border-r flex flex-col overflow-hidden bg-muted/10',
          'w-full lg:w-72 lg:shrink-0',
          mobilePanel === 'sections' ? 'flex' : 'hidden lg:flex',
        )}>
          <div className="px-4 py-3 border-b shrink-0">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Your sections
            </p>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">
              Click a section to edit its content
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {blocksLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : blocks.filter(b => b.visible).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No sections yet.</p>
            ) : (
              blocks.filter(b => b.visible).map(block => {
                const label   = SECTION_LABELS[block.block_type]      ?? block.block_type
                const desc    = SECTION_DESCRIPTIONS[block.block_type] ?? 'Edit this section'
                const icon    = SECTION_ICONS[block.block_type]        ?? '📄'
                const preview = block.content_json?.heading
                  ?? block.content_json?.title
                  ?? null
                const isSelected = selectedBlock?.id === block.id

                return (
                  <button
                    key={block.id}
                    onClick={() => handleSelectBlock(block)}
                    className={cn(
                      'w-full text-left rounded-xl border p-4 transition-all duration-150 group',
                      isSelected
                        ? 'border-[hsl(var(--brand-gold)/0.7)] bg-[hsl(var(--brand-gold)/0.06)] shadow-sm'
                        : 'border-border hover:border-[hsl(var(--brand-gold)/0.3)] hover:bg-[hsl(var(--brand-gold)/0.02)] bg-card'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl transition-colors',
                        isSelected ? 'bg-[hsl(var(--brand-gold)/0.15)]' : 'bg-muted group-hover:bg-[hsl(var(--brand-gold)/0.08)]'
                      )}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm font-semibold leading-tight',
                          isSelected ? 'text-[hsl(var(--brand-gold))]' : 'text-foreground'
                        )}>
                          {label}
                        </p>
                        {preview ? (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {preview}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground/60 mt-0.5">
                            {desc}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <div className="shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-[hsl(var(--brand-gold))]" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right: block editor */}
        <div className={cn(
          'flex-1 overflow-hidden bg-background',
          mobilePanel === 'editor' ? 'flex flex-col' : 'hidden lg:block',
        )}>
          {/* Mobile: prompt when nothing selected */}
          {mobilePanel === 'editor' && !selectedBlock && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 lg:hidden">
              <div className="text-4xl">👈</div>
              <p className="text-sm font-medium">No section selected</p>
              <p className="text-xs text-muted-foreground">Go back to Sections and tap one to edit it.</p>
              <Button variant="outline" size="sm" onClick={() => setMobilePanel('sections')}>
                Back to sections
              </Button>
            </div>
          )}

          <BlockEditor
            block={selectedBlock}
            simplified
            onUpdated={(updated) => {
              setBlocks(prev => prev.map(b => b.id === updated.id ? updated : b))
              setSelectedBlock(updated)
              // Auto-publish on save so clients don't have to think about it
              if (page?.status !== 'published') {
                pageService.publish(pageId).then(setPage).catch(() => {})
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
