import { ref, computed } from 'vue'
import { getSettings, type UserSettings } from '../lib/settings'

const settings = ref<UserSettings>({
    ai_provider: 'ollama',
    ai_model: 'kimi-k2.5:cloud',
    api_key: '',
    base_url: 'http://localhost:11434'
})

const initialized = ref(false)

export function useSettings() {
    async function fetchSettings() {
        const data = await getSettings()
        if (data) {
            settings.value = data
            initialized.value = true
        }
    }

    const modelName = computed(() => {
        const model = settings.value.ai_model
        // Clean up common model names for display
        if (model === 'kimi-k2.5:cloud') return 'Kimi K2.5'
        if (model.includes('gpt-4o')) return 'GPT-4o'
        if (model.includes('llama')) return 'Llama'
        if (model.includes('deepseek')) return 'DeepSeek'
        return model
    })

    return {
        settings,
        initialized,
        fetchSettings,
        modelName
    }
}
