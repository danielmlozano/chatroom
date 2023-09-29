import { createApp, provide, h } from "vue"
import { createPinia } from "pinia"
import { ApolloClient, InMemoryCache } from "@apollo/client/core"
import { DefaultApolloClient } from "@vue/apollo-composable"

import "./style.scss"
import App from "./App.vue"

const pinia = createPinia()

const cache = new InMemoryCache()
const graphqlUrl = import.meta.env.VITE_SOCKET_URL
const apolloClient = new ApolloClient({
	cache,
	uri: `${graphqlUrl}/graphql`,
})

const app = createApp({
	setup() {
		provide(DefaultApolloClient, apolloClient)
	},
	render: () => h(App),
})

app.use(pinia).mount("#app")
