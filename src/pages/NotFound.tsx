import { Link } from 'react-router-dom'
import { PageMeta } from '../components/common/PageMeta'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { buttonClasses } from '../components/ui/buttonClasses'

export function NotFoundPage() {
  return (
    <>
      <PageMeta
        description="La page demandee est introuvable."
        title="Page introuvable"
      />
      <Section>
        <Card className="space-y-4 text-center">
          <h1 className="text-4xl">404</h1>
          <p className="text-sm text-[var(--ug-muted)]">
            Cette page n existe pas ou a ete deplacee.
          </p>
          <div>
            <Link className={buttonClasses('primary')} to="/">
              Retour a l'accueil
            </Link>
          </div>
        </Card>
      </Section>
    </>
  )
}
