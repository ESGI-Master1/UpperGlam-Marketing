import { RouterProvider, type RouterProviderProps } from 'react-router-dom'

type AppProps = Pick<RouterProviderProps, 'router'>

export function App({ router }: AppProps) {
  return <RouterProvider router={router} />
}
