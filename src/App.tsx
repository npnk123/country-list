import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/home";
import Detailpage from "./pages/detail";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/detail/:code",
      element: <Detailpage />,
    },
  ]);

  return (
  <div className="bg-[url('/worldmap3.png')] min-h-[100vh]">
    <RouterProvider router={router} />
  </div>
  )

}

export default App;
