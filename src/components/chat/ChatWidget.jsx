import { useEffect, useRef, useState } from 'react'
import { STEPS, agentRespond, submitLead } from './agent.js'
import { QUICK_REPLIES } from '../../data/knowledge.js'
import WhatsAppLink from '../WhatsAppLink.jsx'

const GREETING = [
  'Welcome to By-Bookey. I am the studio concierge — ask me about collections, the craft, commissions, or press.',
  'If I cannot answer, I will send your query straight to the studio inbox.',
]

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.13-2.9-7-1.87-1.87-4.36-2.9-7.01-2.92zm5.83 14.1c-.25.7-1.45 1.34-2 1.4-.51.05-1.15.22-3.88-.81-3.27-1.29-5.36-4.6-5.52-4.81-.16-.22-1.33-1.77-1.33-3.38 0-1.61.84-2.4 1.14-2.73.3-.33.65-.41.87-.41l.62.01c.2.01.47-.08.73.56.27.65.91 2.24.99 2.4.08.16.13.35.03.57-.11.22-.16.35-.32.54l-.48.57c-.16.16-.33.34-.14.66.19.33.84 1.39 1.81 2.25 1.24 1.11 2.29 1.45 2.62 1.62.33.16.52.14.71-.08.19-.22.81-.95 1.03-1.28.22-.33.44-.27.73-.16.3.11 1.9.9 2.23 1.06.33.16.54.25.62.38.08.14.08.79-.16 1.54z" />
  </svg>
)

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-5 w-5" aria-hidden="true">
    <path d="M21 12c0 4.418-4.03 8-9 8-1.03 0-2.02-.154-2.94-.437L4 21l1.56-4.15C4.58 15.51 4 13.82 4 12c0-4.418 4.03-8 9-8s8 3.582 8 8z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-5 w-5" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
)

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() =>
    GREETING.map((text) => ({ role: 'bot', text })),
  )
  const [input, setInput] = useState('')
  const [step, setStep] = useState(STEPS.CHAT)
  const [lead, setLead] = useState({})
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open, typing])

  const pushBotMessages = (texts, delay = 500) =>
    new Promise((resolve) => {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMessages((prev) => [...prev, ...texts.map((text) => ({ role: 'bot', text }))])
        resolve()
      }, delay)
    })

  const handleSend = async (raw) => {
    const query = (raw ?? input).trim()
    if (!query || typing) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: query }])

    const { messages: replies, nextStep, lead: nextLead, submit } = agentRespond(query, step, lead)
    setLead(nextLead)
    setStep(nextStep)

    if (replies.length > 0) await pushBotMessages(replies)

    if (submit) {
      await pushBotMessages(['Sending your query to the studio…'], 400)
      const result = await submitLead(nextLead)
      if (result.ok) {
        await pushBotMessages(
          [
            'Done — your query is on its way to the studio inbox. Expect a reply by email shortly.',
            'Anything else I can help with? You can also continue the conversation on WhatsApp.',
          ],
          700,
        )
      } else {
        await pushBotMessages(
          [
            'The direct line is unavailable right now, so I have opened an email draft addressed to the studio instead — please press send there.',
          ],
          700,
        )
      }
      setStep(STEPS.CHAT)
      setLead({})
    }
  }

  const showQuickReplies = step === STEPS.CHAT && !typing

  const placeholderByStep = {
    [STEPS.ASK_NAME]: 'Your name…',
    [STEPS.ASK_EMAIL]: 'Your email address…',
    [STEPS.ASK_MESSAGE]: 'Your message to the studio…',
    [STEPS.CONFIRM]: 'yes / no',
  }

  return (
    <>
      {/* ——— Floating dock: WhatsApp + chat toggle ——— */}
      <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3 sm:right-8 sm:bottom-8">
        <WhatsAppLink
          aria-label="Chat with By-Bookey on WhatsApp"
          className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 bg-bone text-ink shadow-[0_2px_16px_rgba(18,17,16,0.10)] transition-all duration-300 ease-out hover:bg-ink hover:text-bone"
        >
          <WhatsAppIcon />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#25d366]" aria-hidden="true" />
          <span className="pointer-events-none absolute right-full mr-4 hidden translate-x-1 rounded-none bg-ink px-3 py-1.5 text-[10px] tracking-[0.2em] whitespace-nowrap text-bone uppercase opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
            WhatsApp
          </span>
        </WhatsAppLink>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close studio chat' : 'Open studio chat'}
          aria-expanded={open}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-bone shadow-[0_2px_16px_rgba(18,17,16,0.18)] transition-all duration-300 ease-out hover:bg-charcoal"
        >
          {open ? <CloseIcon /> : <ChatIcon />}
        </button>
      </div>

      {/* ——— Chat panel ——— */}
      <div
        className={`fixed right-5 bottom-24 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden border border-ink/10 bg-bone shadow-[0_8px_40px_rgba(18,17,16,0.14)] transition-all duration-500 ease-out sm:right-8 sm:bottom-28 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-5 opacity-0'
        }`}
        role="dialog"
        aria-label="By-Bookey studio concierge chat"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="border-b border-ink/10 px-6 py-5">
          <p className="text-[10px] tracking-[0.35em] uppercase text-umber">By&#8211;Bookey</p>
          <p className="mt-1 font-serif text-lg text-ink">Studio Concierge</p>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex h-80 flex-col gap-3 overflow-y-auto px-5 py-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                message.role === 'user'
                  ? 'self-end bg-ink text-bone'
                  : 'self-start bg-linen text-charcoal'
              }`}
            >
              {message.text}
            </div>
          ))}

          {typing && (
            <div className="flex items-center gap-1.5 self-start bg-linen px-4 py-3" aria-label="Concierge is typing">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-charcoal/50"
                  style={{ animationDelay: `${dot * 180}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick replies */}
        {showQuickReplies && (
          <div className="flex flex-wrap gap-2 px-5 pb-4">
            {QUICK_REPLIES.map(({ label, query }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleSend(query)}
                className="border border-ink/15 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase text-charcoal/70 transition-colors duration-300 hover:border-ink hover:text-ink"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-3 border-t border-ink/10 px-5 py-4"
        >
          <input
            ref={inputRef}
            type={step === STEPS.ASK_EMAIL ? 'email' : 'text'}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleSend()
              }
            }}
            placeholder={placeholderByStep[step] ?? 'Ask about collections, craft, commissions…'}
            aria-label="Message the studio concierge"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ash focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="text-[10px] tracking-[0.3em] uppercase text-ink transition-opacity duration-300 disabled:opacity-30"
          >
            Send
          </button>
        </form>
      </div>
    </>
  )
}
