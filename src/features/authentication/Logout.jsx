import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "../../ui/ButtonIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logOut } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import SpinnerMini from "../../ui/SpinnerMini";

function Logout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
  });
  return (
    <ButtonIcon disabled={isLoading} onClick={mutate}>
      {isLoading ? <SpinnerMini /> : <HiArrowRightOnRectangle />}
    </ButtonIcon>
  );
}

export default Logout;
