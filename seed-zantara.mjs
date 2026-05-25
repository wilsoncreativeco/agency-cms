// seed-zantara.mjs
// Usage: node seed-zantara.mjs <service-role-key>
// Seeds the Zantara client's home page with all real site content.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ubkomeuvbrhphmajeltl.supabase.co'

const [,, serviceKey] = process.argv
if (!serviceKey) {
  console.error('Usage: node seed-zantara.mjs <service-role-key>')
  console.error('Get it from: Supabase → Settings → API Keys → Legacy → service_role (Reveal)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

const BLOCKS = [
  {
    block_type: 'hero',
    sort_order: 0,
    visible: true,
    content_json: {
      heading: "Gold Coast's Trusted\nFormwork Specialists",
      subheading: 'Trade-qualified crews delivering slab, wall and column formwork across South East Queensland. No compromises, every pour.',
      cta_primary: 'Get a Quote',
      cta_secondary: 'Our Projects',
      phone: '+61 474 731 763',
      background_image: '',
      stats: [
        { id: uid(), value: '500', suffix: '+', label: 'Projects' },
        { id: uid(), value: '15',  suffix: '+', label: 'Years'    },
        { id: uid(), value: '100', suffix: '%', label: 'Client Satisfaction' },
      ],
    },
  },
  {
    block_type: 'services',
    sort_order: 1,
    visible: true,
    content_json: {
      heading: 'What We Do',
      subheading: 'Two core services, delivered with precision.',
      items: [
        {
          id: uid(),
          title: 'Labour Hire',
          icon: '👷',
          description: 'Trade-qualified formwork labourers, inducted and ready to deploy.',
          back: 'We supply experienced, site-ready formwork labourers for short or long-term engagements. All workers are trade-qualified, safety-inducted and familiar with Gold Coast and Brisbane project requirements. Flexible arrangements — from a single worker to a full forming crew.',
        },
        {
          id: uid(),
          title: 'Formwork Stripping',
          icon: '🏗',
          description: 'Systematic de-propping and stripping once design strength is confirmed.',
          back: 'Our crews safely strip formed concrete structures once design strength is achieved. We work methodically to protect structural integrity and keep your project on program. Available across Gold Coast, Brisbane and wider SEQ.',
        },
      ],
    },
  },
  {
    block_type: 'about',
    sort_order: 2,
    visible: true,
    content_json: {
      heading: 'Built on the Tools',
      body: '<p>Zantara was founded by tradespeople who came up through the ranks on Gold Coast high-rise and commercial projects. We know what a reliable crew looks like — because we\'ve been that crew.</p><p>Today we deliver formwork, concrete stripping and labour hire across South East Queensland. Always trade-qualified, always safety-first, always on program.</p>',
      image_url: '/construct.jpg',
    },
  },
  {
    block_type: 'projects',
    sort_order: 3,
    visible: true,
    content_json: {
      heading: 'Projects',
      subheading: 'Current and recent work across South East Queensland.',
      items: [
        { id: uid(), title: 'Coming Soon', description: 'Coming Soon', status: 'Coming Soon', location: '', image: '' },
        { id: uid(), title: 'Coming Soon', description: 'Coming Soon', status: 'Coming Soon', location: '', image: '' },
        { id: uid(), title: 'Coming Soon', description: 'Coming Soon', status: 'Coming Soon', location: '', image: '' },
      ],
    },
  },
  {
    block_type: 'team',
    sort_order: 4,
    visible: true,
    content_json: {
      heading: 'Meet the Team',
      members: [
        { id: uid(), name: 'Coming Soon', role: 'Coming Soon', years: '', bio: 'Coming Soon', photo: '' },
        { id: uid(), name: 'Coming Soon', role: 'Coming Soon', years: '', bio: 'Coming Soon', photo: '' },
        { id: uid(), name: 'Coming Soon', role: 'Coming Soon', years: '', bio: 'Coming Soon', photo: '' },
        { id: uid(), name: 'Coming Soon', role: 'Coming Soon', years: '', bio: 'Coming Soon', photo: '' },
        { id: uid(), name: 'Coming Soon', role: 'Coming Soon', years: '', bio: 'Coming Soon', photo: '' },
      ],
    },
  },
  {
    block_type: 'faq',
    sort_order: 5,
    visible: true,
    content_json: {
      heading: 'Frequently Asked Questions',
      items: [
        { id: uid(), question: 'What areas do you cover?', answer: 'We service the Gold Coast and Greater Brisbane area, including Logan, Ipswich and the Sunshine Coast. Contact us for project locations further afield.' },
        { id: uid(), question: 'What types of formwork do you do?', answer: 'We specialise in slab, wall, column and post-tension formwork for residential, commercial and civil projects.' },
        { id: uid(), question: 'Can I hire a single labourer or a full crew?', answer: 'Both. We supply individual trade-qualified labourers or full forming crews depending on your project needs and program.' },
        { id: uid(), question: 'Are your workers safety-inducted?', answer: 'Yes. All Zantara workers hold current White Cards and site-specific inductions. Safety is non-negotiable on every project.' },
        { id: uid(), question: 'How quickly can you mobilise?', answer: 'In most cases we can mobilise within 48–72 hours for labour hire. Formwork projects are scheduled based on program requirements — contact us to discuss your timeline.' },
        { id: uid(), question: 'Do you provide stripping / de-propping?', answer: 'Yes. Concrete stripping is one of our core services. We strip systematically once design strength is confirmed by your engineer.' },
      ],
    },
  },
  {
    block_type: 'contact',
    sort_order: 6,
    visible: true,
    content_json: {
      heading: 'Get in Touch',
      email: 'admin@zantara.com.au',
      phone: '+61 474 731 763',
      address: 'Gold Coast, QLD 4217',
      show_form: true,
    },
  },
]

async function seed() {
  console.log('🔑 Using service role key — bypassing auth...')

  // Verify this looks like a service_role key (not anon)
  try {
    const payload = JSON.parse(Buffer.from(serviceKey.split('.')[1], 'base64').toString())
    if (payload.role !== 'service_role') {
      console.error('❌ Wrong key! You passed the anon key, not the service_role key.')
      console.error('   Get it from: Supabase → Settings → API → service_role (click Reveal)')
      process.exit(1)
    }
  } catch { /* ignore parse errors, just try anyway */ }

  // Find or create Zantara client
  console.log('🔍 Looking up Zantara client...')
  const { data: clients, error: clientError } = await supabase
    .from('clients')
    .select('id, business_name, slug')
    .ilike('slug', '%zantara%')
  if (clientError) { console.error('❌ Client query failed:', clientError.message); process.exit(1) }

  let client = clients?.[0]

  if (!client) {
    console.log('➕ No Zantara client found — creating one...')
    const { data: newClient, error: createClientError } = await supabase
      .from('clients')
      .insert({
        business_name: 'Zantara',
        slug:          'zantara',
        plan:          'starter',
        is_active:     true,
        settings:      {},
      })
      .select()
      .single()
    if (createClientError) { console.error('❌ Client creation failed:', createClientError.message); process.exit(1) }
    client = newClient
    console.log(`✅ Created client: ${client.business_name} (${client.id})`)
  } else {
    console.log(`✅ Found client: ${client.business_name} (${client.id})`)
  }

  // Find or create home page
  console.log('🔍 Looking up home page...')
  const { data: pages, error: pageError } = await supabase
    .from('pages')
    .select('id, name, slug')
    .eq('client_id', client.id)
  if (pageError) { console.error('❌ Pages query failed:', pageError.message); process.exit(1) }

  let page = pages?.find(p => p.slug === 'home' || p.slug === '' || p.slug === '/') ?? pages?.[0]
  if (!page) {
    console.log('📄 No page found — creating home page...')
    const { data: newPage, error: createError } = await supabase
      .from('pages')
      .insert({ client_id: client.id, name: 'Home', slug: 'home', status: 'published' })
      .select().single()
    if (createError) { console.error('❌ Page creation failed:', createError.message); process.exit(1) }
    page = newPage
  }
  console.log(`✅ Using page: ${page.name} (${page.id})`)

  // Delete existing blocks
  console.log('🗑  Clearing existing blocks...')
  const { error: deleteError } = await supabase
    .from('content_blocks')
    .delete()
    .eq('page_id', page.id)
  if (deleteError) { console.error('❌ Delete failed:', deleteError.message); process.exit(1) }

  // Insert new blocks
  console.log('📦 Inserting blocks...')
  const rows = BLOCKS.map(b => ({ ...b, client_id: client.id, page_id: page.id }))
  const { error: insertError } = await supabase.from('content_blocks').insert(rows)
  if (insertError) { console.error('❌ Insert failed:', insertError.message); process.exit(1) }

  console.log(`\n✅ Done! Seeded ${rows.length} blocks for ${client.business_name}.`)
  console.log('   Open the CMS and edit the Home page to see everything pre-filled.')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
