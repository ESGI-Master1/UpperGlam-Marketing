import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { homeCopy } from '../content/copy'

export function HowItWorksPage() {
  return (
    <>
      <PageMeta
        description="Decouvrez le fonctionnement Upper Glam en 3 etapes simples, du besoin a la reservation."
        title="Comment ca marche"
      />
      <Section>
        <div className="space-y-8">
          <div className="space-y-3">
            <Badge>Comment ca marche</Badge>
            <h1 className="text-4xl sm:text-5xl">
              Une methode simple et elegante
            </h1>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {homeCopy.howItWorks.map((step) => (
              <Card key={step.title}>
                <h2 className="text-2xl">{step.title}</h2>
                <p className="mt-3 text-sm text-[var(--ug-muted)]">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
          <Card className="text-sm text-[var(--ug-muted)]">
            [PLACEHOLDER_MOCKUP_APP]
          </Card>
        </div>
      </Section>
    </>
  )
}
