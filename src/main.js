import Vue from 'vue'
import App from './App.vue'
import VueApollo from 'vue-apollo'
// import ApolloClient from 'apollo-boost'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import Buefy from "buefy";

import 'buefy/dist/buefy.css'

Vue.use(Buefy)

Vue.use(VueApollo)

Vue.config.productionTip = false

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:3020/graphql',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
