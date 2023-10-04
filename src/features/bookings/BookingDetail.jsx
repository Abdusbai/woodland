import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import { getBooking } from "../../services/apiBookings";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import { HiArrowUpOnSquare } from "react-icons/hi2";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { bookingId } = useParams();

  const { isLoading, data } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false,
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
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
