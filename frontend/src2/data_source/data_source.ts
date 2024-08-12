import { call } from 'frappe-ui';
import { reactive, ref } from 'vue';
import { useTimeAgo } from '@vueuse/core'

const basePath = 'insights.insights.doctype.insights_data_source_v3.insights_data_source_v3.'

export type DataSourceListItem = {
	title: string
	name: string
	owner: string
	status: 'Active' | 'Inactive'
	database_type: 'MariaDB' | 'PostgreSQL' | 'SQLite'
	creation: string
	modified: string
	created_from_now: string
	modified_from_now: string
}
const sources = ref<DataSourceListItem[]>([])

const loading = ref(false)
async function getSources() {
	loading.value = true
	sources.value = await call(basePath + 'get_data_sources')
	sources.value = sources.value.map((source: any) => ({
		...source,
		created_from_now: useTimeAgo(source.creation),
		modified_from_now: useTimeAgo(source.modified),
	}))
	loading.value = false
	return sources.value
}

export default function useDataSourceStore() {
	if (!sources.value.length) {
		getSources()
	}

	return reactive({
		sources,
		loading,
		getSources,
	})
}
