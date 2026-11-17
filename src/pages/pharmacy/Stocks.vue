<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getStocks, addStock, updateStock, deleteStock, getProfile } from '../../api/pharmacy'
import { getMedicines } from '../../api/public'
import { getErrorMessage } from '../../composables/useApiError'
import { formatPrice } from '../../composables/useFormat'

const stocks = ref([])
const medicines = ref([])
const approved = ref(true)
const error = ref('')
const message = ref('')

const form = reactive({ medicine_id: '', quantity: 0, price: 0 })
const editingId = ref(null)
const editForm = reactive({ quantity: 0, price: 0 })

async function load() {
  try {
    const profile = await getProfile()
    approved.value = profile.data.data.is_approved

    const [stockResponse, medicineResponse] = await Promise.all([getStocks(), getMedicines()])
    stocks.value = stockResponse.data.data
    medicines.value = medicineResponse.data.data
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}

onMounted(load)

async function add() {
  error.value = ''
  message.value = ''
  try {
    await addStock(form)
    message.value = 'Stock enregistré.'
    form.medicine_id = ''
    form.quantity = 0
    form.price = 0
    await load()
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}

function startEdit(stock) {
  editingId.value = stock.id
  editForm.quantity = stock.quantity
  editForm.price = stock.price
}

async function saveEdit(stock) {
  error.value = ''
  try {
    await updateStock(stock.id, editForm)
    editingId.value = null
    await load()
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}

async function remove(stock) {
  if (!confirm('Supprimer ' + stock.medicine.name + ' de votre stock ?')) return
  error.value = ''
  try {
    await deleteStock(stock.id)
    await load()
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}
</script>

<template>
  <h1>Mon stock</h1>

  <p v-if="error" class="alert alert-error">{{ error }}</p>
  <p v-if="message" class="alert alert-ok">{{ message }}</p>
  <p v-if="!approved" class="alert alert-warn">
    Votre pharmacie n'est pas encore validée : l'ajout de stock est désactivé.
  </p>

  <form class="card inline-form" @submit.prevent="add">
    <label class="field">
      <span>Médicament</span>
      <select v-model="form.medicine_id" required :disabled="!approved">
        <option value="" disabled>Choisir…</option>
        <option v-for="m in medicines" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
    </label>
    <label class="field">
      <span>Quantité</span>
      <input v-model.number="form.quantity" type="number" min="0" required :disabled="!approved" />
    </label>
    <label class="field">
      <span>Prix (FCFA)</span>
      <input v-model.number="form.price" type="number" min="0" required :disabled="!approved" />
    </label>
    <button class="btn btn-primary" type="submit" :disabled="!approved">Ajouter au stock</button>
  </form>

  <p v-if="stocks.length === 0" class="empty">Votre stock est vide. Ajoutez votre premier médicament ci-dessus.</p>

  <div v-else class="table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th>Médicament</th>
          <th>Quantité</th>
          <th>Prix</th>
          <th><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in stocks" :key="stock.id">
          <td>{{ stock.medicine.name }}</td>

          <template v-if="editingId === stock.id">
            <td><input v-model.number="editForm.quantity" type="number" min="0" class="small-input" /></td>
            <td><input v-model.number="editForm.price" type="number" min="0" class="small-input" /></td>
            <td class="actions">
              <button class="btn btn-primary" @click="saveEdit(stock)">Enregistrer</button>
              <button class="btn btn-ghost" @click="editingId = null">Annuler</button>
            </td>
          </template>

          <template v-else>
            <td>{{ stock.quantity }}</td>
            <td>{{ formatPrice(stock.price) }}</td>
            <td class="actions">
              <button class="btn btn-ghost" @click="startEdit(stock)">Modifier</button>
              <button class="btn btn-danger" @click="remove(stock)">Supprimer</button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
