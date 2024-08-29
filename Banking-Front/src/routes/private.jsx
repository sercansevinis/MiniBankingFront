import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

const Home = React.lazy(() => import("./HomePage"));

const privateRoutes = [
  {
    path: "/home",
    element: Home,
    title: "Home Page",
    pageName: "Home",
    checkRole: true,
  },
];

const isAllowed = privateRoutes.find(
  (route) => route.path === location.pathname
);

function RenderRoutes() {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const navigated = location?.state?.navigated;

  const redirectPath = privateRoutes.find(
    (item) => item.path === localStorage.getItem("redirectPath")
  )?.path;

  const navigateToDefault = () => {
    navigate("/home", {
      state: {
        navigated: true,
      },
    });
  };

  useEffect(() => {
    // console.log(location);
    if (isAllowed) {
      navigate(isAllowed.path);
    }
    if (!isAllowed) {
      navigateToDefault();
    }
  }, [isAllowed]);

  return (
    <Suspense>
      <Routes>
        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Routes>
    </Suspense>
  );
}

export { privateRoutes };

export default RenderRoutes;
