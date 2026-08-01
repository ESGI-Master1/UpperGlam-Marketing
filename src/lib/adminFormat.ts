export const formatAdminDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(
    new Date(value)
  )

export const formatAdminMoney = (cents: number) =>
  new Intl.NumberFormat('fr-FR', {
    currency: 'EUR',
    style: 'currency',
  }).format(cents / 100)
