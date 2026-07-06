import { KNOWLEDGE_BASE } from '../../data/knowledge.js'
import { CONTACT_EMAIL } from '../../config.js'

/* ——— Retrieval ——— */

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'is', 'are',
  'do', 'does', 'can', 'i', 'you', 'your', 'my', 'me', 'we', 'it', 'that',
  'this', 'with', 'about', 'have', 'has', 'what', 'how', 'would', 'like',
])

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
}

/**
 * Scores every knowledge-base entry against the query tokens and
 * returns the best match with its confidence score.
 */
export function retrieve(query) {
  const tokens = tokenize(query)
  if (tokens.length === 0) return { entry: null, score: 0 }

  let best = { entry: null, score: 0 }

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0
    for (const token of tokens) {
      for (const keyword of entry.keywords) {
        if (keyword === token) score += 2
        else if (keyword.startsWith(token) || token.startsWith(keyword)) score += 1
      }
    }
    if (score > best.score) best = { entry, score }
  }

  return best
}

/* ——— Conversation steps for the lead-capture flow ——— */

export const STEPS = {
  CHAT: 'chat',
  ASK_NAME: 'ask_name',
  ASK_EMAIL: 'ask_email',
  ASK_MESSAGE: 'ask_message',
  CONFIRM: 'confirm',
  DONE: 'done',
}

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

const wantsHandoff = (query) =>
  /\b(speak|talk|human|someone|agent|person|email|contact|reach|send|forward)\b/i.test(query)

/**
 * The agent "brain": given the visitor's message and the current step,
 * returns the bot's reply and the next step. Pure function — easy to test
 * and to swap for a hosted LLM endpoint later.
 */
export function agentRespond(query, step, lead) {
  switch (step) {
    case STEPS.ASK_NAME: {
      const name = query.trim()
      return {
        messages: [
          `Lovely to meet you, ${name}. What email address should the studio use to reply?`,
        ],
        nextStep: STEPS.ASK_EMAIL,
        lead: { ...lead, name },
      }
    }

    case STEPS.ASK_EMAIL: {
      if (!isValidEmail(query)) {
        return {
          messages: ['That does not look like a valid email — could you re-type it? (e.g. name@example.com)'],
          nextStep: STEPS.ASK_EMAIL,
          lead,
        }
      }
      return {
        messages: [
          'Perfect. Now tell me your query in full — commissions, press, consultations, anything. I will pass it on word for word.',
        ],
        nextStep: STEPS.ASK_MESSAGE,
        lead: { ...lead, email: query.trim() },
      }
    }

    case STEPS.ASK_MESSAGE: {
      const message = query.trim()
      return {
        messages: [
          `Here is what I will send to the studio:\n\n“${message}”\n\nShall I send it? (yes / no)`,
        ],
        nextStep: STEPS.CONFIRM,
        lead: { ...lead, message },
      }
    }

    case STEPS.CONFIRM: {
      if (/^(y|yes|yeah|yep|sure|ok|okay|send)/i.test(query.trim())) {
        return { messages: [], nextStep: STEPS.DONE, lead, submit: true }
      }
      return {
        messages: ['No problem — tell me the query again and I will re-draft it.'],
        nextStep: STEPS.ASK_MESSAGE,
        lead,
      }
    }

    /* Free chat: retrieve from the knowledge base, decide whether to answer
       or to hand off to the email-capture flow. */
    default: {
      if (/^(hi|hiya|hello|hey|good\s+(morning|afternoon|evening)|greetings)[\s!,.]*$/i.test(query)) {
        return {
          messages: [
            'Hello — welcome to By-Bookey. Ask me about the collections, the craft, commissions, press, or buyer consultations.',
          ],
          nextStep: STEPS.CHAT,
          lead,
        }
      }

      if (/^(thanks|thank you|great|perfect|bye|goodbye|cheers)[\s!,.]*$/i.test(query)) {
        return {
          messages: ['You are very welcome. The studio is always here — à bientôt.'],
          nextStep: STEPS.CHAT,
          lead,
        }
      }

      const { entry, score } = retrieve(query)

      if (entry && score >= 2 && !entry.handoff) {
        const messages = [entry.answer]
        if (entry.followUp) messages.push(entry.followUp)
        return { messages, nextStep: STEPS.CHAT, lead }
      }

      if ((entry && entry.handoff) || wantsHandoff(query)) {
        const intro = entry ? entry.answer : 'I will pass your query to the studio directly.'
        return {
          messages: [intro, 'May I take your name first?'],
          nextStep: STEPS.ASK_NAME,
          lead: { ...lead, topic: entry ? entry.id : 'general' },
        }
      }

      return {
        messages: [
          'I may not have that in my notes — but I can send your question straight to the studio and they will reply by email. May I take your name?',
        ],
        nextStep: STEPS.ASK_NAME,
        lead: { ...lead, topic: 'general', message: query.trim() },
      }
    }
  }
}

/* ——— Email delivery ——— */

const encode = (data) =>
  Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

/**
 * Sends the collected lead to the Netlify Form "chatbot-queries".
 * Netlify emails each submission to the address configured under
 * Forms → Notifications. Falls back to a mailto: draft when the
 * form endpoint is unavailable (e.g. local development).
 */
export async function submitLead(lead) {
  const payload = {
    'form-name': 'chatbot-queries',
    name: lead.name || '',
    email: lead.email || '',
    topic: lead.topic || 'general',
    message: lead.message || '',
    page: window.location.pathname,
  }

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(payload),
    })
    if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`)
    return { ok: true }
  } catch {
    const subject = encodeURIComponent(`By-Bookey enquiry (${payload.topic}) — ${payload.name}`)
    const body = encodeURIComponent(
      `Name: ${payload.name}\nEmail: ${payload.email}\nTopic: ${payload.topic}\n\n${payload.message}`,
    )
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_self')
    return { ok: false, fallback: true }
  }
}
