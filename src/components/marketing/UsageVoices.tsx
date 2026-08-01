const benefits = [
  {
    label: 'Décider sans attendre',
    text: 'Les disponibilités, les prestations et le prix sont visibles avant de réserver.',
  },
  {
    label: 'Centraliser son activité',
    text: 'Le profil, l’agenda et les demandes restent réunis dans un même espace.',
  },
  {
    label: 'Garder une vision claire',
    text: 'Chaque rendez-vous conserve son horaire, son lieu, son statut et son montant.',
  },
]

export function UsageVoices() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {benefits.map((benefit) => (
        <article
          className="border-t border-[var(--ug-accent)] pt-5"
          key={benefit.label}
        >
          <h3 className="text-lg text-[var(--ug-text)]">{benefit.label}</h3>
          <p className="mt-3 leading-relaxed text-[var(--ug-muted)]">
            {benefit.text}
          </p>
        </article>
      ))}
    </div>
  )
}
