import { useState } from 'react'
import { trackEvent } from '../../lib/analytics'
import { cn } from './cn'

export type AccordionItem = {
  answer: string
  id: string
  question: string
}

type AccordionProps = {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div
            className="overflow-hidden rounded-2xl border border-[var(--ug-border)]"
            key={item.id}
          >
            <button
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 bg-[color:var(--ug-card-bg)] px-5 py-4 text-left text-sm font-medium"
              onClick={() => {
                const nextState = isOpen ? 'closed' : 'opened'
                setOpenId(isOpen ? null : item.id)
                trackEvent('faq_item_toggle', {
                  item_id: item.id,
                  question: item.question,
                  state: nextState,
                })
              }}
              type="button"
            >
              <span>{item.question}</span>
              <span
                className={cn(
                  'text-lg leading-none text-[var(--ug-accent)] transition-transform',
                  isOpen && 'rotate-45'
                )}
              >
                +
              </span>
            </button>
            <div
              className={cn(
                'grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="min-h-0">
                <div className="border-t border-[var(--ug-border)] px-5 py-4 text-sm text-[var(--ug-muted)]">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
