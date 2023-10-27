import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBooking, updateBooking } from "../../services/apiBookings";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";
import Checkbox from "../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import toast from "react-hot-toast";
import SpinnerMini from "../../ui/SpinnerMini";
import { getSettings } from "../../services/apiSettings";

const Box = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  const [confirmPaid, setConfirmedPaid] = useState(false);
  const [addBreakFast, setAddBreakFast] = useState(false);

  const { bookingId } = useParams();
  const { isLoading, data } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false,
  });

  useEffect(() => setConfirmedPaid(data?.isPaid ?? false), [data]);

  const queryClient = useQueryClient();
  const { mutate: checkIn, isLoading: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakFast }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakFast,
      }),
    onSuccess: (data) => {
      toast.success(`Booking ${data.id} successfully checked in`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: () => toast.error("There was an error while checking in"),
  });

  function handleCheckIn() {
    if (!confirmPaid) return;

    if (data.status === "checked-in") {
      toast(`Booking ${data.id} already checked in`, {
        icon: "✅",
      });
    } else {
      if (addBreakFast) {
        checkIn({
          bookingId,
          breakFast: {
            hasBreakfast: true,
            extrasPrice: OptionalBreakFastPrice,
            totalPrice: data.totalPrice + OptionalBreakFastPrice,
          },
        });
      } else {
        checkIn({ bookingId, breakFast: {} });
      }
    }
  }

  //breakfast
  const { isLoading: isLoadingSettings, data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const OptionalBreakFastPrice =
    settings?.breakfastPrice * data?.numNights * data?.numGuests;

  if (isLoading || isLoadingSettings) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{data.id}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={data} />

      {!data.hasBreakfast && data.status !== "checked-in" ? (
        <Box>
          <Checkbox
            checked={addBreakFast}
            onChange={() => {
              setAddBreakFast((breakFast) => !breakFast);
              setConfirmedPaid(false);
            }}
            id="breakfast"
          >
            Want to add breakfast for {formatCurrency(OptionalBreakFastPrice)}?
          </Checkbox>
        </Box>
      ) : (
        ""
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          disabled={confirmPaid || isCheckingIn}
          id="confirm"
          onChange={() => setConfirmedPaid((confirm) => !confirm)}
        >
          I confirm that <strong>{data.guests.fullName} </strong> has paid the
          total amount of{" "}
          {addBreakFast
            ? `${formatCurrency(
                data.totalPrice + OptionalBreakFastPrice
              )} (${formatCurrency(data.totalPrice)} + ${formatCurrency(
                OptionalBreakFastPrice
              )})`
            : formatCurrency(data.totalPrice)}
        </Checkbox>
      </Box>
      <ButtonGroup>
        <Button disabled={!confirmPaid || isCheckingIn} onClick={handleCheckIn}>
          {isCheckingIn && <SpinnerMini />}
          {`Check in booking #${data.id}`}
        </Button>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
