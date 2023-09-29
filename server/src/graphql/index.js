const { ApolloServer } = require("apollo-server-express")
const {
	ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core")
const { loadFiles } = require("@graphql-tools/load-files")
const resolvers = require("./resolvers")

const useGraphql = async (app) => {
	const server = new ApolloServer({
		typeDefs: await loadFiles(`${__dirname}/**/*.gql`),
		resolvers,
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
		playground: true,
	})
	await server.start()
	server.applyMiddleware({ app })
}

module.exports = useGraphql