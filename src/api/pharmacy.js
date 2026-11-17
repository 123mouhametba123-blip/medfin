import client from './client'

export const getProfile = () => client.get('/pharmacy/profile')
export const updateProfile = (data) => client.put('/pharmacy/profile', data)

export const getStocks = () => client.get('/pharmacy/stocks')
export const addStock = (data) => client.post('/pharmacy/stocks', data)
export const updateStock = (id, data) => client.put('/pharmacy/stocks/' + id, data)
export const deleteStock = (id) => client.delete('/pharmacy/stocks/' + id)

export const getStockHistory = () => client.get('/pharmacy/stock-history')

export const getDutyPeriods = () => client.get('/pharmacy/duty-periods')
export const addDutyPeriod = (data) => client.post('/pharmacy/duty-periods', data)
export const deleteDutyPeriod = (id) => client.delete('/pharmacy/duty-periods/' + id)
