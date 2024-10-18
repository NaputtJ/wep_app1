import { createBrowserRouter } from "react-router-dom";
import appRouter from "./app/router";

const router = createBrowserRouter([
  appRouter,
]);

export default router