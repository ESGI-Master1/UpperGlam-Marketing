type AppMockupProps = {
  compact?: boolean
}

export function AppMockup({ compact = false }: AppMockupProps) {
  return (
    <figure
      className={compact ? 'app-mockup app-mockup--compact' : 'app-mockup'}
    >
      <div className="app-mockup__halo" />
      <div className="app-mockup__phone">
        <div className="app-mockup__speaker" />
        <img
          alt="Ouverture de l’application mobile Upper Glam sur Android"
          className="app-mockup__screen"
          height="936"
          loading={compact ? 'lazy' : 'eager'}
          src="/media/app/upperglam-launch.gif"
          width="432"
        />
      </div>
      <figcaption>
        Capture réelle sur Android <span>•</span> Application Upper Glam
      </figcaption>
    </figure>
  )
}
