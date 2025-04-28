import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // Existing index route
  route("day11", "day11/index.tsx"), // New route for /about
  route("day12", "day12/couterApp.tsx"), // New route for /about
  route("day13", "day13/app.tsx"), // New route for /about
  route("day14-15", "day14-15/index.tsx"), // New route for /about
  route("day14-15/cart", "day14-15/cart.tsx"), // New route for /about
] satisfies RouteConfig;
