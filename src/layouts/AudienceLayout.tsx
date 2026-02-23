import { Outlet, useLocation } from 'react-router-dom'
import { AudienceSwitch } from '../components/common/AudienceSwitch'
import { Container } from '../components/layout/Container'
import { Badge } from '../components/ui/Badge'

export function AudienceLayout() {
  const location = useLocation()
  const isClient = location.pathname.startsWith('/client')

  return (
    <>
      <section className="pt-8 pb-2 sm:pt-10">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AudienceSwitch />
            <Badge>{isClient ? 'Client(e)' : 'Professionnel(le)'}</Badge>
          </div>
        </Container>
      </section>
      <Outlet />
    </>
  )
}
