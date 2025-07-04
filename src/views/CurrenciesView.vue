<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Currency Management</h1>
        <p class="text-gray-600">Manage currencies and exchange rates</p>
      </div>
      <div class="flex space-x-3">
        <button @click="updateRates" class="btn-secondary" :disabled="loading">
          Update Rates
        </button>
        <button @click="showCreateModal = true" class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          Add Currency
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="card mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Available Currencies</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Currency
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="currency in currencies" :key="currency.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ currency.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ currency.code }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ currency.symbol }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="currency.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'"
                    >
                      {{ currency.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="currency.is_base_currency" class="text-blue-600 font-medium">
                      Base Currency
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Exchange Rate History</h3>
          
          <div class="mb-4">
            <div class="flex space-x-4">
              <select v-model="fromCurrency" class="form-input">
                <option value="">From Currency</option>
                <option v-for="currency in currencies" :key="currency.id" :value="currency.code">
                  {{ currency.code }} - {{ currency.name }}
                </option>
              </select>
              <select v-model="toCurrency" class="form-input">
                <option value="">To Currency</option>
                <option v-for="currency in currencies" :key="currency.id" :value="currency.code">
                  {{ currency.code }} - {{ currency.name }}
                </option>
              </select>
              <button @click="fetchHistory" class="btn-secondary">
                Load History
              </button>
            </div>
          </div>

          <div v-if="rateHistory.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="rate in rateHistory" :key="rate.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ rate.from_currency.code }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ rate.to_currency.code }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ rate.rate.toFixed(6) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(rate.effective_date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ rate.source }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div class="card mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Currency Converter</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input v-model="convertAmount" type="number" class="form-input" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
              <select v-model="convertFrom" class="form-input">
                <option v-for="currency in currencies" :key="currency.id" :value="currency.code">
                  {{ currency.code }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
              <select v-model="convertTo" class="form-input">
                <option v-for="currency in currencies" :key="currency.id" :value="currency.code">
                  {{ currency.code }}
                </option>
              </select>
            </div>
            
            <button @click="convertCurrency" class="btn-primary w-full" :disabled="loading">
              Convert
            </button>
            
            <div v-if="convertResult" class="p-3 bg-green-50 rounded-lg">
              <p class="text-sm text-green-800">
                {{ convertAmount }} {{ convertFrom }} = 
                {{ convertResult.converted_amount.toLocaleString() }} {{ convertTo }}
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Currencies</span>
              <span class="font-medium">{{ currencies.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Active</span>
              <span class="font-medium text-green-600">{{ activeCurrencies }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Base Currency</span>
              <span class="font-medium text-blue-600">{{ baseCurrency?.code }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Currency Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">Add New Currency</h3>
        </div>
        <form @submit.prevent="createCurrency">
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
              <input v-model="newCurrency.code" type="text" required class="form-input" placeholder="USD" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Currency Name</label>
              <input v-model="newCurrency.name" type="text" required class="form-input" placeholder="US Dollar" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
              <input v-model="newCurrency.symbol" type="text" required class="form-input" placeholder="$" />
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showCreateModal = false" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="btn-primary">
              Add Currency
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { apiService } from '../services/api';
import { PlusIcon } from '@heroicons/vue/24/outline';

const currencies = ref([]);
const rateHistory = ref([]);
const loading = ref(false);
const showCreateModal = ref(false);

const fromCurrency = ref('');
const toCurrency = ref('');
const convertAmount = ref(1);
const convertFrom = ref('USD');
const convertTo = ref('ZAR');
const convertResult = ref(null);

const newCurrency = reactive({
  code: '',
  name: '',
  symbol: '',
});

const activeCurrencies = computed(() => 
  currencies.value.filter(c => c.is_active).length
);

const baseCurrency = computed(() => 
  currencies.value.find(c => c.is_base_currency)
);

onMounted(async () => {
  await fetchCurrencies();
});

const fetchCurrencies = async () => {
  try {
    loading.value = true;
    const response = await apiService.getCurrencies();
    currencies.value = response;
  } catch (error) {
    console.error('Failed to fetch currencies:', error);
  } finally {
    loading.value = false;
  }
};

const createCurrency = async () => {
  try {
    loading.value = true;
    await apiService.createCurrency(newCurrency);
    await fetchCurrencies();
    showCreateModal.value = false;
    Object.assign(newCurrency, { code: '', name: '', symbol: '' });
  } catch (error) {
    console.error('Failed to create currency:', error);
  } finally {
    loading.value = false;
  }
};

const updateRates = async () => {
  try {
    loading.value = true;
    await apiService.updateExchangeRates();
    // Optionally refresh history if loaded
    if (rateHistory.value.length > 0) {
      await fetchHistory();
    }
  } catch (error) {
    console.error('Failed to update rates:', error);
  } finally {
    loading.value = false;
  }
};

const fetchHistory = async () => {
  try {
    loading.value = true;
    const response = await apiService.getExchangeRateHistory(fromCurrency.value, toCurrency.value);
    rateHistory.value = response;
  } catch (error) {
    console.error('Failed to fetch history:', error);
  } finally {
    loading.value = false;
  }
};

const convertCurrency = async () => {
  try {
    loading.value = true;
    const response = await apiService.convertAmount(convertAmount.value, convertFrom.value, convertTo.value);
    convertResult.value = response;
  } catch (error) {
    console.error('Failed to convert currency:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>
