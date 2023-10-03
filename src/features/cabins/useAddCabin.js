import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export default function useAddCabin() {
  const queryClient = useQueryClient();

  const { mutate: createCabinMutate, isLoading: isCreating } = useMutation({
    mutationFn: (cabin) => createEditCabin(cabin),
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return {
    createCabinMutate,
    isCreating,
  };
}
