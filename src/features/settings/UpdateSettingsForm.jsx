import { useQuery } from "@tanstack/react-query";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { getSettings } from "../../services/apiSettings";
import Spinner from "../../ui/Spinner";
import useUpdateSetting from "./useUpdateSetting";

function UpdateSettingsForm() {
  const { UpdateSettingMutate, isEditing } = useUpdateSetting();
  const { isLoading, data } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  function handleUpdate(e, column) {
    const { value } = e.target;
    if (!value || parseInt(value) === parseInt(data[column])) return;
    UpdateSettingMutate({ [column]: value });
  }

  return (
    <Form>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <FormRow label="Minimum nights per booking">
            <Input
              type="number"
              id="min-nights"
              disabled={isEditing}
              defaultValue={data.minBookingLength}
              onBlur={(e) => handleUpdate(e, "minBookingLength")}
            />
          </FormRow>
          <FormRow label="Maximum nights per booking">
            <Input
              type="number"
              id="max-nights"
              disabled={isEditing}
              defaultValue={data.maxBookingLength}
              onBlur={(e) => handleUpdate(e, "maxBookingLength")}
            />
          </FormRow>
          <FormRow label="Maximum guests per booking">
            <Input
              type="number"
              id="max-guests"
              disabled={isEditing}
              defaultValue={data.maxGuestsPerBooking}
              onBlur={(e) => handleUpdate(e, "maxGuestsPerBooking")}
            />
          </FormRow>
          <FormRow label="Breakfast price">
            <Input
              type="number"
              id="breakfast-price"
              disabled={isEditing}
              defaultValue={data.breakfastPrice}
              onBlur={(e) => handleUpdate(e, "breakfastPrice")}
            />
          </FormRow>
        </>
      )}
    </Form>
  );
}

export default UpdateSettingsForm;
