// Récupère un message lisible depuis une erreur Axios / Laravel
export function getErrorMessage(error) {
  if (!error.response) {
    return "Impossible de joindre le serveur. Vérifiez que l'API Laravel est lancée."
  }

  const data = error.response.data

  // Erreurs de validation Laravel : { errors: { champ: ["message"] } }
  if (data && data.errors) {
    const premierChamp = Object.keys(data.errors)[0]
    return data.errors[premierChamp][0]
  }

  if (data && data.message) {
    return data.message
  }

  return 'Une erreur est survenue.'
}
