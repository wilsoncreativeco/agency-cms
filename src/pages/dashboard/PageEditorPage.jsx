import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Globe, Loader2, Eye, Zap, LayoutList, PencilLine } from 'lucide-react'
import { pageService }        from '@/services/page.service'
import { useContentBlocks }   from '@/hooks/useContentBlocks'
import { useClient }          from '@/hooks/useClient'
import { useToast }           from '@/components/ui/toast-provider'
import { BlockList }          from '@/components/editor/BlockList'
import { BlockEditor }        from '@/components/editor/BlockEditor'
import { SeoPanel }           from '@/components/editor/SeoPanel'
import { Button }             from '@/components/ui/button'
import { Badge }              from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export default function PageEditorPage() {
  const { pageId }    = useParams()
  const navigate      = useNavigate()
  const { toast }     = useToast()
  const { clientId, client } = useClient()

  const [page,        setPage]        = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [publishing,  setPublishing]  = useState(false)
  const [selectedBlock, setSelectedBlock] = useState(null)
  // Mobile: 'sections' | 'editor'
  const [mobilePanel, setMobilePanel] = useState('sections')

  const { blocks, setBlocks, loading: blocksLoading } = useContentBlocks(pageId)

  useEffect(() => {
    if (!pageId) return
    pageService.get(pageId)
      .then(p => { setPage(p); setPageLoading(false) })
      .catch(() => { navigate('/dashboard/pages') })
  }, [pageId])

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
      const updated = page.status === 'published'
        ? await pageService.unpublish(pageId)
        : await pageService.publish(pageId)
      setPage(updated)
      toast({
        title: updated.status === 'published' ? '🟢 Page published' : 'Page unpublished',
        variant: 'success',
      })
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setPublishing(false)
    }
  }

  const previewUrl = client?.custom_domain
    ? `https://${client.custom_domain}/${page?.slug}`
    : null

  if (pageLoading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 lg:-m-8">

      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 lg:px-6">
        <Link to="/dashboard/pages">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate">{page?.name}</h1>
          <Badge variant={page?.status === 'published' ? 'success' : 'secondary'} className="text-[10px] shrink-0">
            {page?.status}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {previewUrl && (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs hidden sm:flex" asChild>
              <a href={previewUrl} target="_blank" rel="noreferrer">
                <Eye className="h-3.5 w-3.5" /> Preview
              </a>
            </Button>
          )}
          <Button
            size="sm"
            className={cn('h-8 gap-1.5 text-xs', page?.status === 'published' ? 'bg-emerald-600 hover:bg-emerald-700' : '')}
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : page?.status === 'published'
                ? <><Globe className="h-3.5 w-3.5" /><span className="hidden sm:inline"> Published</span></>
                : <><Zap   className="h-3.5 w-3.5" /><span className="hidden sm:inline"> Publish</span></>
            }
          </Button>
        </div>
      </div>

      {/* Mobile panel switcher */}
      <div className="flex border-b lg:hidden shrink-0">
        <button
          onClick={() => setMobilePanel('sections')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
            mobilePanel === 'sections'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          )}
        >
          <LayoutList className="h-4 w-4" />
          Sections
        </button>
        <button
          onClick={() => setMobilePanel('editor')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
            mobilePanel === 'editor'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          )}
        >
          <PencilLine className="h-4 w-4" />
          {selectedBlock ? `Edit: ${selectedBlock.block_type}` : 'Edit'}
        </button>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: block list — full width on mobile when panel = sections */}
        <div className={cn(
          'border-r flex flex-col overflow-hidden',
          // Mobile: full width when sections panel active, hidden otherwise
          'w-full lg:w-56 lg:shrink-0',
          mobilePanel === 'sections' ? 'flex' : 'hidden lg:flex'
        )}>
          <Tabs defaultValue="sections" className="flex flex-col flex-1 overflow-hidden">
            <TabsList className="mx-3 mt-3 mb-0 h-8 text-xs">
              <TabsTrigger value="sections" className="text-xs flex-1">Sections</TabsTrigger>
              <TabsTrigger value="seo"      className="text-xs flex-1">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
              {blocksLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <BlockList
                  blocks={blocks}
                  setBlocks={setBlocks}
                  clientId={clientId}
                  pageId={pageId}
                  selectedId={selectedBlock?.id}
                  onSelect={handleSelectBlock}
                />
              )}
            </TabsContent>

            <TabsContent value="seo" className="flex-1 overflow-y-auto mt-0">
              <SeoPanel page={page} onUpdated={setPage} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: block editor — full width on mobile when editor panel active */}
        <div className={cn(
          'flex-1 overflow-hidden bg-muted/20',
          mobilePanel === 'editor' ? 'flex flex-col' : 'hidden lg:block'
        )}>
          {mobilePanel === 'editor' && !selectedBlock && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 lg:hidden">
              <LayoutList className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm font-medium">No section selected</p>
              <p className="text-xs text-muted-foreground">Go to Sections and tap a block to edit it.</p>
              <Button variant="outline" size="sm" onClick={() => setMobilePanel('sections')}>
                Go to Sections
              </Button>
            </div>
          )}
          <BlockEditor
            block={selectedBlock}
            onUpdated={(updated) => {
              setBlocks(prev => prev.map(b => b.id === updated.id ? updated : b))
              setSelectedBlock(updated)
            }}
          />
        </div>
      </div>
    </div>
  )
}
