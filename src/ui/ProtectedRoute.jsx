import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/apiAuth";
import Spinner from "./Spinner";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  width: 100%;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  const { isLoading, data } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  useEffect(
    function () {
      if (data?.role !== "authenticated" && !isLoading) {
        navigate("/login");
      }
    },
    [data?.role, isLoading, navigate]
  );

  if (isLoading) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }

  if (data?.role === "authenticated") return children;
}

export default ProtectedRoute;
