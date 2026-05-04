import { createBrowserRouter } from "react-router";

import { ProtectedRoute } from "./components/ProtectedRoute";
import BusinessLayout from "./layouts/BusinessLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import UserLayout from "./layouts/UserLayout";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import BusinessLocation from "./pages/business/BusinessLocation";
import EditBusinessProfile from "./pages/business/EditBusinessProfile";
import GalleryManagement from "./pages/business/GalleryManagement";
import ReviewManagement from "./pages/business/ReviewManagement";
import Forbidden from "./pages/errors/Forbidden";
import NotFound from "./pages/errors/NotFound";
import BusinessDetail from "./pages/owner/BusinessDetail";
import GlobalBusinessManagement from "./pages/owner/GlobalBusinessManagement";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import LandingPage from "./pages/public/LandingPage";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import BusinessCatalog from "./pages/user/BusinessCatalog";
import BusinessProfile from "./pages/user/BusinessProfile";
import CitySelector from "./pages/user/CitySelector";
import MapView from "./pages/user/MapView";
import PublishReview from "./pages/user/PublishReview";
import UserProfile from "./pages/user/UserProfile";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/403", Component: Forbidden },
  {
    Component: () => <ProtectedRoute allowedRoles={["end_user"]} />,
    children: [
      {
        path: "/user",
        Component: UserLayout,
        children: [
          { path: "city", Component: CitySelector },
          { path: "catalog", Component: BusinessCatalog },
          { path: "map", Component: MapView },
          { path: "profile", Component: UserProfile },
          { path: "business/:id", Component: BusinessProfile },
          { path: "business/:id/review", Component: PublishReview },
        ],
      },
    ],
  },
  {
    Component: () => <ProtectedRoute allowedRoles={["business_admin"]} />,
    children: [
      {
        path: "/business",
        Component: BusinessLayout,
        children: [
          { index: true, Component: BusinessDashboard },
          { path: "edit-profile", Component: EditBusinessProfile },
          { path: "location", Component: BusinessLocation },
          { path: "gallery", Component: GalleryManagement },
          { path: "reviews", Component: ReviewManagement },
        ],
      },
    ],
  },
  {
    Component: () => <ProtectedRoute allowedRoles={["owner"]} />,
    children: [
      {
        path: "/owner",
        Component: OwnerLayout,
        children: [
          { index: true, Component: OwnerDashboard },
          { path: "businesses", Component: GlobalBusinessManagement },
          { path: "businesses/:id", Component: BusinessDetail },
        ],
      },
    ],
  },
  { path: "*", Component: NotFound },
]);
