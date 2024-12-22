import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes"; // Correct path to your router file
import toast, { Toaster } from 'react-hot-toast';
const App = () => (
    <>

    <RouterProvider router={router} />
    <Toaster/>
    </>
);

export default App;
