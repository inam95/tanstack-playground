import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <div className="p-4 space-y-4">
        <nav className="space-x-4">
          <Link to="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </nav>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools />
    </>
  ),
});
