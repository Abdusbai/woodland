import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import { getBooking, updateBooking } from "../../services/apiBookings";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import { HiArrowUpOnSquare } from "react-icons/hi2";
import toast from "react-hot-toast";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import useDeleteBooking from "./useDeleteBooking";
import SpinnerMini from "../../ui/SpinnerMini";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { isDeleting, mutateDeleteBooking } = useDeleteBooking();
  const { bookingId } = useParams();

  const { isLoading, data } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false,
  });

  const queryClient = useQueryClient();
  const { mutate: checkOut, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    onSuccess: (data) => {
      toast.success(`Booking ${data.id} successfully checked out`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: () => toast.error("There was an error while checking out"),
  });

  const moveBack = useMoveBack();

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{data.id}</Heading>
          <Tag type={statusToTagName[data.status]}>
            {data.status.replace("-", " ")}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={data} />

      <ButtonGroup>
        {data.status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${data.id}`)}>
            Check in
          </Button>
        )}

        {data.status === "checked-in" && (
          <Button
            icon={<HiArrowUpOnSquare />}
            disabled={isCheckingOut}
            onClick={() => {
              checkOut(data.id);
            }}
          >
            {isCheckingOut && <SpinnerMini />}
            Check out
          </Button>
        )}
        <Modal>
          <Modal.Open opens="delete">
            <Button $variation="danger" onClick={moveBack}>
              Delete
            </Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="Booking"
              elementName={`#${data.id}`}
              disabled={isDeleting}
              onConfirm={() =>
                mutateDeleteBooking(data.id, {
                  onSuccess: navigate(-1),
                })
              }
            />
          </Modal.Window>
        </Modal>

        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
