import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Hotels from "./pages/Hotels/Hotels";
import Home from "./pages/Home/Home";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import NotFound from "./pages/NotFound";

export function App() {
  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    credentials: "include",
    cache: new InMemoryCache(),
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/search",
      element: <Hotels />,
    },
    {
      path: "*",
      element: <NotFound />,
      
    }
    
  ]);

  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  )
}

export default App
