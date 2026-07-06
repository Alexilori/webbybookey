/**
 * Studio knowledge base used by the chatbot's retrieval step.
 * Each entry has weighted keywords for scoring and an editorial answer.
 * Extend freely — the agent picks the highest-scoring entry.
 */
export const KNOWLEDGE_BASE = [
  {
    id: 'brand',
    keywords: ['who', 'about', 'brand', 'bookey', 'studio', 'designer', 'story', 'philosophy', 'aesthetic'],
    answer:
      'By-Bookey is an independent fashion design studio exploring form, texture, and the art of tailoring. Every garment is conceived as sculpture — structural, minimalist, and finished by hand.',
    followUp: 'You can read more on the About page.',
  },
  {
    id: 'collections',
    keywords: ['collection', 'collections', 'work', 'capsule', 'season', 'lookbook', 'runway', 'meridian', 'pieces', 'garments', 'clothes'],
    answer:
      'Our seasonal collections and capsules — including Collection 01 “Meridian” (AW ’26) and the “Raw Seam” capsule (SS ’26) — live on the Work page, with runway shots, lookbook frames, and fabric details.',
    followUp: 'Is there a particular collection you would like to know more about?',
  },
  {
    id: 'process',
    keywords: ['process', 'craft', 'made', 'making', 'sketch', 'toile', 'pattern', 'tailoring', 'construction', 'atelier', 'handmade'],
    answer:
      'Each piece begins as a line on paper — a study of drape, tension, and proportion — then moves through mood boards, fabric research, toiles, and hand-finishing in the atelier. The Process page walks through the full journey.',
  },
  {
    id: 'commissions',
    keywords: ['commission', 'bespoke', 'custom', 'order', 'buy', 'purchase', 'price', 'cost', 'made-to-measure', 'tailor', 'fitting'],
    answer:
      'The studio takes on a limited number of private commissions and made-to-measure projects each season. Share a few details of what you have in mind and we will forward them directly to the studio.',
    handoff: true,
  },
  {
    id: 'press',
    keywords: ['press', 'media', 'interview', 'feature', 'editorial', 'magazine', 'publication', 'journalist', 'shoot'],
    answer:
      'For press enquiries, sample requests, and editorial features, we route messages straight to the studio inbox. Leave your details and we will come back to you promptly.',
    handoff: true,
  },
  {
    id: 'buyers',
    keywords: ['buyer', 'stockist', 'wholesale', 'retail', 'boutique', 'consultation', 'showroom', 'linesheet'],
    answer:
      'Buyer consultations and wholesale conversations are handled directly by the studio. Leave your details and the team will arrange a consultation.',
    handoff: true,
  },
  {
    id: 'materials',
    keywords: ['fabric', 'material', 'textile', 'sustainable', 'sustainability', 'sourcing', 'wool', 'silk', 'cotton', 'deadstock'],
    answer:
      'We work with natural and deadstock textiles selected for structure and hand-feel — the fabric always leads the silhouette. Material studies appear throughout the Process page.',
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'speak', 'talk', 'human', 'someone', 'enquiry', 'inquiry', 'whatsapp', 'phone', 'call', 'message'],
    answer:
      'Happy to connect you with the studio. You can reach us instantly on WhatsApp using the green-dot button beside this chat, or leave your query here and we will send it to the studio inbox.',
    handoff: true,
  },
  {
    id: 'location',
    keywords: ['where', 'location', 'based', 'city', 'country', 'visit', 'appointment'],
    answer:
      'The atelier receives visits by appointment only. Leave your details and the studio will arrange a suitable time.',
    handoff: true,
  },
]

export const QUICK_REPLIES = [
  { label: 'Collections', query: 'Tell me about your collections' },
  { label: 'Commissions', query: 'I would like to commission a piece' },
  { label: 'Press', query: 'I have a press enquiry' },
  { label: 'Talk to the studio', query: 'I want to talk to someone at the studio' },
]
