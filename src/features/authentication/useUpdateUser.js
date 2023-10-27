import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateCurrentUser } from "../../services/apiAuth";

export default function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: editUserMutate, isLoading: isEditing } = useMutation({
    mutationFn: UpdateCurrentUser,
    onSuccess: () => {
      toast.success("User data successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { editUserMutate, isEditing };
}
