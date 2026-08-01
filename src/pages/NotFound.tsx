import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'

export function NotFoundPage() {
  return (
    <>
      <PageMeta
        description="La page demandée est introuvable."
        noindex
        title="Page introuvable"
      />
      <Section>
        <Card className="space-y-4 text-center">
          <h1 className="text-4xl">404</h1>
          <p className="text-sm text-[var(--ug-muted)]">
            Cette page n'existe pas ou a été déplacée.
          </p>
          <div>
            <Link className={buttonClasses('primary')} to="/">
              Retour à l'accueil
            </Link>
          </div>
        </Card>
      </Section>
    </>
  )
}
