import { PageMeta } from '../components/common/PageMeta'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { siteCopy } from '../content/copy'

export function AboutPage() {
  return (
    <>
      <PageMeta
        description="A propos de la vision Upper Glam: relier experience client premium et croissance des professionnels beaute."
        title="A propos"
      />
      <Section>
        <div className="space-y-8">
          <div className="space-y-3">
            <Badge>A propos</Badge>
            <h1 className="text-4xl sm:text-5xl">A propos de nous</h1>
            <p className="text-sm text-[var(--ug-muted)]">
              Pauline Lavergne & Senda Ballin
            </p>
          </div>
          <Card className="space-y-3">
            <p className="max-w-4xl text-sm leading-relaxed text-[var(--ug-muted)]">
              Deux passionnees de beaute et de nouvelles technologies, animees
              par une mission simple: rendre la beaute accessible, rapide et
              sans stress.
            </p>
            <p className="max-w-4xl text-sm leading-relaxed text-[var(--ug-muted)]">
              Chez Upper Glam, nous avons imagine une solution pour repondre aux
              besoins des client(e)s comme des professionnel(le)s.
            </p>
            <p className="max-w-4xl text-sm leading-relaxed text-[var(--ug-muted)]">
              Trouver un(e) expert(e) de la beaute, c est parfois un veritable
              casse-tete, meme avec les reseaux sociaux. Entre les profils peu
              clairs, les avis douteux et les recherches interminables, denicher
              la perle rare releve souvent du parcours du combattant.
            </p>
            <p className="max-w-4xl text-sm leading-relaxed text-[var(--ug-muted)]">
              C est pour ca que nous avons cree Upper Glam: une plateforme
              transparente et intuitive.
            </p>
            <p className="max-w-4xl text-sm leading-relaxed text-[var(--ug-muted)]">
              Pour les client(e)s: des photos authentiques, des evaluations
              verifiees, et une interface qui te permet de choisir facilement
              le/la professionnel(le) qui correspond a tes attentes.
            </p>
            <p className="max-w-4xl text-sm leading-relaxed text-[var(--ug-muted)]">
              Pour les professionnel(le)s: un moyen efficace de remplir votre
              agenda avec des demandes qualifiees, et une mise en avant de votre
              talent aupres de potentiel(le)s client(e)s.
            </p>
            <p className="max-w-4xl text-sm leading-relaxed text-[var(--ug-muted)]">
              Nous croyons en une beaute simple, accessible et connectee, et
              avec Upper Glam, nous voulons revolutionner la facon dont
              client(e)s et professionnel(le)s se rencontrent.
            </p>
            <p className="max-w-4xl text-sm leading-relaxed text-[var(--ug-muted)]">
              Tu es pret(e) a rejoindre l'aventure ?
            </p>
            <p className="max-w-4xl text-sm leading-relaxed text-[var(--ug-muted)]">
              Instagram: {siteCopy.instagramHandle}
            </p>
          </Card>
          <Card className="text-sm text-[var(--ug-muted)]">
            [PLACEHOLDER_GALLERY_IMAGES]
          </Card>
        </div>
      </Section>
    </>
  )
}
