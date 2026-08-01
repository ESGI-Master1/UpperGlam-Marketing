import { PageMeta } from '../components/common/PageMeta'
import { Accordion } from '../components/ui/Accordion'
import { Badge } from '../components/ui/Badge'
import { Section } from '../components/ui/Section'
import { faqItems } from '../content/faq'

const faqSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
      name: item.question,
    })),
  },
]

export function FAQPage() {
  return (
    <>
      <PageMeta
        description="Réponses aux questions fréquentes sur les professionnels, les réservations, les paiements et Upper Glam."
        jsonLd={faqSchema}
        title="FAQ"
      />
      <Section>
        <div className="space-y-8">
          <div className="space-y-3">
            <Badge>FAQ</Badge>
            <h1 className="text-4xl sm:text-5xl">Questions fréquentes</h1>
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
