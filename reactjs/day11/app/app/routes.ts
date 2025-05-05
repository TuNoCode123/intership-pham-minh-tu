import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home page
  index("routes/home.tsx"),

  // Static routes
  route("day11", "day11/index.tsx"),
  route("day12", "day12/couterApp.tsx"), // Note: Possible typo 'couterApp' -> 'counterApp'
  route("day13", "day13/app.tsx"),
  route("day14-15", "day14-15/index.tsx"),
  route("cart", "day14-15/cart.tsx"),
  route("day16", "totalday16/day16/home.tsx"),
  route("day16/cart", "totalday16/day16/cart.tsx"),
  route("day16/:id", "totalday16/products/[id].tsx", { id: "day16-detail" }),
  route("day17", "totalday17/day17/home.tsx"),
  route("day17/cart", "totalday17/day17/cart.tsx"),
  route("day17/:id", "totalday17/products/[id].tsx", { id: "day17-detail" }),
  route("day18", "miniProject/index.tsx"),
] satisfies RouteConfig;
