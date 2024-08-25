// src/store/index.js
import { createStore } from 'vuex'
import Papa from 'papaparse'

export default createStore({
    state: {
        currentCrop: 'corn',
        currentYear: '2021',
        currentMonth: '0',
        currentProperty: 'pred',
        mapData: null,
        selectedLocation: null,
        csvData: null,
    },
    mutations: {
        setCrop(state, crop) {
            state.currentCrop = crop
        },
        setYear(state, year) {
            state.currentYear = year
        },
        setMonth(state, month) {
            state.currentMonth = month
        },
        setProperty(state, property) {
            state.currentProperty = property
        },
        setMapData(state, data) {
            state.mapData = data
        },
        setSelectedLocation(state, location) {
            state.selectedLocation = location
        },
        setCsvData(state, data) {
            state.csvData = data
          },
    },
    actions: {
        async fetchMapData({ commit, state }) {
            const { currentCrop, currentYear, currentMonth } = state
            try {
                const response = await fetch(`/data/${currentCrop}/${currentYear}/${currentMonth}.json`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                commit('setMapData', data)
            } catch (error) {
                console.error('Error fetching map data:', error)
            }
        },
        async loadCsvData({ state, commit }) {
            const { currentCrop, currentYear, currentMonth } = state
            const csvPath = `../csv/${currentCrop}/${currentYear}/${currentMonth}.csv`

            try {
            const response = await fetch(csvPath)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const csvText = await response.text()
            
            Papa.parse(csvText, {
                header: true,
                complete: (results) => {
                commit('setCsvData', results.data)
                },
                error: (error) => {
                console.error('Error parsing CSV:', error)
                }
            })
            } catch (error) {
            console.error('Error loading CSV data:', error)
            }
        }
    },
    getters: {
        getMapData: (state) => state.mapData,
    },
})