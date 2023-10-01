import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting } from "../../services/apiSettings";

export default function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: UpdateSettingMutate, isLoading: isEditing } = useMutation({
    mutationFn: (column) => updateSetting(column),
    onSuccess: () => {
      toast.success("Setting successfully updated");
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { UpdateSettingMutate, isEditing };
}
