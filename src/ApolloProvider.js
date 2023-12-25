import React from 'react';
// import ApolloClient from 'apollo-client';
// import { InMemoryCache, createHttpLink } from '@apollo/client'
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { createHttpLink } from 'apollo-link-http';
// import { ApolloProvider as Provider } from '@apollo/react-hooks';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider as Provider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const httpLink = createHttpLink({
    uri: 'http://localhost:5000'
});

const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken');
    return{
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});



const ApolloProvider = ({ children }) => (
    <Provider client={client}>
        {children}
    </Provider>
);

export default ApolloProvider;
