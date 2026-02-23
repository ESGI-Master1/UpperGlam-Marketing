import { PageMeta } from '../components/common/PageMeta'
import { Accordion } from '../components/ui/Accordion'
import { Badge } from '../components/ui/Badge'
import { Section } from '../components/ui/Section'
import { faqItems } from '../content/faq'

export function FAQPage() {
  return (
    <>
      <PageMeta
        description="Retrouvez les reponses aux questions frequentes sur Upper Glam."
        title="FAQ"
      />
      <Section>
        <div className="space-y-8">
          <div className="space-y-3">
            <Badge>FAQ</Badge>
            <h1 className="text-4xl sm:text-5xl">Questions frequentes</h1>
          </div>
          <Accordion
            items={faqItems.map((item, index) => ({
              ...item,
              id: `faq-${index}`,
            }))}
          />
        </div>
      </Section>
    </>
  )
}
