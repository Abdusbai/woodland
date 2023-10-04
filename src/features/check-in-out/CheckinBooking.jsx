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
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
      }),
    onSuccess: (data) => {
      toast.success(`Booking ${data.id} successfully checked in`);
      queryClient.invalidateQueries({
        queryKey: ["booking"],
      });
      navigate("/bookings");
    },
    onError: () => toast.error("There was an error while checking in"),
  });
  function handleCheckIn() {
    if (!confirmPaid) return;
    checkIn(bookingId);
  }

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{data.id}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={data} />

      <Box>
        <Checkbox
          checked={addBreakFast}
          onChange={() => {
            setAddBreakFast((breakFast) => !breakFast);
            setConfirmedPaid(false);
          }}
          id="breakfast"
        >
          Want to add breakfast for x?
        </Checkbox>
      </Box>

      <Box>
        <Checkbox
          checked={confirmPaid}
          disabled={confirmPaid || isCheckingIn}
          id="confirm"
          onChange={() => setConfirmedPaid((confirm) => !confirm)}
        >
          I confirm that <strong>{data.guests.fullName} </strong> has{" "}
          <strong>paid</strong> the total amount of{" "}
          {formatCurrency(data.totalPrice)}
        </Checkbox>
      </Box>
      <ButtonGroup>
        <Button disabled={!confirmPaid || isCheckingIn} onClick={handleCheckIn}>
          {isCheckingIn ? <SpinnerMini /> : `Check in booking #${data.id}`}
        </Button>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
