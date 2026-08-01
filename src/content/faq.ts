export type FaqItem = {
  answer: string
  question: string
}

export const faqItems: FaqItem[] = [
  {
    question: 'Comment réserver un service ?',
    answer:
      'Vous choisissez un besoin, vous comparez les profils vérifiés, puis vous confirmez votre réservation en quelques clics.',
  },
  {
    question: 'Les professionnels sont-ils vérifiés ?',
    answer:
      "Au lancement, chaque profil professionnel fait l'objet d'un contrôle des informations transmises. Le niveau de vérification et les justificatifs disponibles seront indiqués clairement sur le profil.",
  },
  {
    question: 'Puis-je réserver pour un événement ?',
    answer:
      'Oui. La plateforme est pensée pour les rendez-vous quotidiens comme pour les besoins liés à un mariage ou un événement.',
  },
  {
    question: 'Y a-t-il des frais pour les clients ?',
    answer:
      'Le mode de facturation dépend du type de prestation. Les détails seront toujours visibles avant validation.',
  },
  {
    question: "Comment puis-je m'inscrire en tant que professionnel ?",
    answer:
      'La page Professionnel vous guide vers la pré-inscription. Vous pourrez y décrire votre activité, vos spécialités et votre zone.',
  },
]
