type AppMockupProps = {
  compact?: boolean
}

export function AppMockup({ compact = false }: AppMockupProps) {
  return (
    <figure
      className={compact ? 'app-mockup app-mockup--compact' : 'app-mockup'}
    >
      <div className="app-mockup__halo" />
      <div className="app-mockup__stage">
        <div className="app-mockup__phone app-mockup__phone--left">
          <span className="app-mockup__label">Découvrir</span>
          <img
            alt="Résultats de recherche de prestataires beauté dans Upper Glam"
            className="app-mockup__screen"
            height="2400"
            loading={compact ? 'eager' : 'lazy'}
            src="/media/app/customer-search.png"
            width="1080"
          />
        </div>
        <div className="app-mockup__phone app-mockup__phone--main">
          <span className="app-mockup__label">Choisir</span>
          <img
            alt="Fiche détaillée d’une professionnelle de la beauté dans Upper Glam"
            className="app-mockup__screen"
            height="2400"
            loading={compact ? 'eager' : 'lazy'}
            src="/media/app/customer-provider.png"
            width="1080"
          />
        </div>
        <div className="app-mockup__phone app-mockup__phone--right">
          <span className="app-mockup__label">Réserver</span>
          <img
            alt="Choix d’une date et d’un horaire pour une réservation Upper Glam"
            className="app-mockup__screen"
            height="2400"
            loading="lazy"
            src="/media/app/customer-booking.png"
            width="1080"
          />
        </div>
      </div>
      <figcaption>
        Parcours client réel <span>•</span> Recherche, profil et réservation
      </figcaption>
    </figure>
  )
}
