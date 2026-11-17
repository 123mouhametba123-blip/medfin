import client from './client'

export const searchStocks = (params) => client.get('/search', { params })
export const getMedicines = () => client.get('/medicines')
export const getPharmacies = (params) => client.get('/pharmacies', { params })

export const getMedicine = (id) => client.get('/medicines/' + id)
export const getMedicineAvailability = (id) => client.get('/medicines/' + id + '/availability')
export const getPharmacy = (id) => client.get('/pharmacies/' + id)

export const createReport = (data) => client.post('/reports', data)
