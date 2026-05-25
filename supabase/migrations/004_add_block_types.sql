-- 004_add_block_types.sql
-- Extends the content_blocks block_type check constraint to include
-- 'projects' and 'team' block types used by the client editor.
--
-- Run in: Supabase → SQL Editor → New query → paste → Run

ALTER TABLE public.content_blocks
  DROP CONSTRAINT content_blocks_block_type_check;

ALTER TABLE public.content_blocks
  ADD CONSTRAINT content_blocks_block_type_check
  CHECK (block_type IN (
    'hero', 'about', 'services', 'gallery',
    'testimonials', 'faq', 'cta', 'contact', 'richtext',
    'projects', 'team'
  ));
