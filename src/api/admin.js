import client from './client'

export const getDashboard = () => client.get('/admin/dashboard')

export const getAdminPharmacies = (status) =>
  client.get('/admin/pharmacies', { params: { status } })
export const approvePharmacy = (id) => client.patch('/admin/pharmacies/' + id + '/approve')
export const suspendPharmacy = (id) => client.patch('/admin/pharmacies/' + id + '/suspend')

export const getReports = (status) => client.get('/admin/reports', { params: { status } })
export const resolveReport = (id) => client.patch('/admin/reports/' + id + '/resolve')

export const createMedicine = (data) => client.post('/admin/medicines', data)
export const updateMedicine = (id, data) => client.put('/admin/medicines/' + id, data)
export const deleteMedicine = (id) => client.delete('/admin/medicines/' + id)
