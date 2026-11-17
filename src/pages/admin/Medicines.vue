<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getMedicines } from '../../api/public'
import { createMedicine, updateMedicine, deleteMedicine } from '../../api/admin'
import { getErrorMessage } from '../../composables/useApiError'

const medicines = ref([])
const error = ref('')
const editingId = ref(null) // null = on ajoute, sinon on modifie ce médicament

const form = reactive({ name: '', generic_name: '', dosage: '', form: '', description: '', requires_prescription: false })

async function load() {
  const response = await getMedicines()
  medicines.value = response.data.data
}

onMounted(load)

function resetForm() {
  editingId.value = null
  form.name = ''
  form.generic_name = ''
  form.dosage = ''
  form.form = ''
  form.description = ''
  form.requires_prescription = false
}

function startEdit(m) {
  editingId.value = m.id
  form.name = m.name
  form.generic_name = m.generic_name || ''
  form.dosage = m.dosage || ''
  form.form = m.form || ''
  form.description = m.description || ''
  form.requires_prescription = m.requires_prescription
}

async function save() {
  error.value = ''
  try {
    if (editingId.value === null) {
      await createMedicine(form)
    } else {
      await updateMedicine(editingId.value, form)
    }
    resetForm()
    await load()
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}

async function remove(m) {
  if (!confirm('Supprimer ' + m.name + ' du catalogue ? Les stocks liés seront supprimés.')) return
  await deleteMedicine(m.id)
  await load()
}
</script>

<template>
  <h1>Catalogue de médicaments</h1>

  <p v-if="error" class="alert alert-error">{{ error }}</p>

  <form class="card form" @submit.prevent="save">
    <h2>{{ editingId === null ? 'Ajouter un médicament' : 'Modifier le médicament' }}</h2>

    <label class="field">
      <span>Nom</span>
      <input v-model="form.name" type="text" required />
    </label>
    <label class="field">
      <span>Nom générique / DCI (facultatif)</span>
      <input v-model="form.generic_name" type="text" placeholder="Ex : Paracétamol" />
    </label>
    <label class="field">
      <span>Dosage (facultatif)</span>
      <input v-model="form.dosage" type="text" placeholder="Ex : 1000 mg" />
    </label>
    <label class="field">
      <span>Forme (facultatif)</span>
      <input v-model="form.form" type="text" placeholder="Ex : comprimé, sirop, gélule, injection" />
    </label>
    <label class="field">
      <span>Description (facultatif)</span>
      <input v-model="form.description" type="text" />
    </label>
    <label class="check">
      <input v-model="form.requires_prescription" type="checkbox" />
      Ordonnance obligatoire
    </label>

    <div class="actions">
      <button class="btn btn-primary" type="submit">
        {{ editingId === null ? 'Ajouter au catalogue' : 'Enregistrer les modifications' }}
      </button>
      <button v-if="editingId !== null" class="btn btn-ghost" type="button" @click="resetForm">Annuler</button>
    </div>
  </form>

  <p v-if="medicines.length === 0" class="empty">Le catalogue est vide. Ajoutez un premier médicament.</p>

  <div v-else class="table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Ordonnance</th>
          <th><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in medicines" :key="m.id">
          <td>
            {{ m.name }}
            <div class="muted">
              <span v-if="m.generic_name">{{ m.generic_name }}</span>
              <span v-if="m.dosage"> · {{ m.dosage }}</span>
              <span v-if="m.form"> · {{ m.form }}</span>
            </div>
            <div class="muted">{{ m.description }}</div>
          </td>
          <td>{{ m.requires_prescription ? 'Oui' : 'Non' }}</td>
          <td class="actions">
            <button class="btn btn-ghost" @click="startEdit(m)">Modifier</button>
            <button class="btn btn-danger" @click="remove(m)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
