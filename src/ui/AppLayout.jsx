import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div>
      <p>App Layout</p>
      <Outlet />
    </div>
  );
}

export default AppLayout;
