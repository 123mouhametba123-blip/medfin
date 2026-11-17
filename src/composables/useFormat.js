// 1200 -> "1 200 FCFA"
export function formatPrice(value) {
  const nombre = new Intl.NumberFormat('fr-FR').format(value)
  return nombre.replace(/\u202f|\u00a0/g, ' ') + ' FCFA'
}

// Texte de disponibilité selon la quantité en stock
export function stockLabel(quantity) {
  if (quantity <= 0) return 'Rupture'
  if (quantity <= 5) return 'Plus que ' + quantity
  return 'En stock'
}

export function stockLevel(quantity) {
  if (quantity <= 0) return 'out'
  if (quantity <= 5) return 'low'
  return 'ok'
}

// "il y a 2 h", "hier", "il y a 5 jours"…
export function timeAgo(dateString) {
  if (!dateString) return 'date inconnue'

  const date = new Date(dateString)
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000)

  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return 'il y a ' + minutes + ' min'

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return 'il y a ' + hours + ' h'

  const days = Math.floor(hours / 24)
  if (days === 1) return 'hier'
  if (days < 30) return 'il y a ' + days + ' jours'

  return 'le ' + date.toLocaleDateString('fr-FR')
}

// 1.234 -> "à 1,2 km"
export function formatDistance(km) {
  return 'à ' + Number(km).toFixed(1).replace('.', ',') + ' km'
}

// Une disponibilité de plus de 7 jours est signalée comme ancienne
export function isOld(dateString) {
  if (!dateString) return true
  const days = (Date.now() - new Date(dateString).getTime()) / 86400000
  if (days > 7) return true
  return false
}
