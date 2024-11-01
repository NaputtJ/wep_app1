import { RouteObject } from "react-router-dom";
import HomePage from "./home";
import AppLayout from "./layout";

const appRouter: RouteObject = {
  path: "/",
  element: <AppLayout />,
  children: [
    {
      path: "",
      element: <HomePage />,
    },
  ],
};

export default appRouter