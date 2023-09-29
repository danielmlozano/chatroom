import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
} from "@apollo/client/core"
import gql from "graphql-tag"

const URL = (import.meta as any).env.VITE_SOCKET_URL as string

// HTTP connection to the API
const httpLink = createHttpLink({
	// You should use an absolute URL here
	uri: `${URL}/graphql`,
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
	link: httpLink,
	cache,
})

const useGraphql = () => {
	return {
		apolloClient,
		gql,
	}
}

export default useGraphql
