export type FaqItem = {
  answer: string
  question: string
}

export const faqItems: FaqItem[] = [
  {
    question: 'Comment reserver un service ?',
    answer:
      'Vous choisissez un besoin, vous comparez les profils verifies, puis vous confirmez votre reservation en quelques clics.',
  },
  {
    question: 'Les professionnels sont-ils verifies ?',
    answer:
      'Oui. Chaque profil passe une verification basique et peut afficher ses realisations et avis clients.',
  },
  {
    question: 'Puis-je reserver pour un evenement ?',
    answer:
      'Oui. La plateforme est pensee pour les rendez-vous quotidiens et les besoins evenementiels.',
  },
  {
    question: 'Y a-t-il des frais pour les clients ?',
    answer:
      'Le mode de facturation depend du type de prestation. Les details sont visibles avant validation.',
  },
  {
    question: 'Comment puis-je m inscrire en tant que pro ?',
    answer:
      'La page Professionnel(le) vous guide pas a pas vers la creation de profil et la mise en ligne de vos services.',
  },
]
