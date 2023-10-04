import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { getBookings } from "../../services/apiBookings";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../ui/Pagination";

function BookingTable() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  //Filter
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue, method: "eq" };

  //Sort
  const sortBy = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortBy.split("-");
  const newSortBy = { field, direction };

  //Pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const {
    isLoading,
    data: { data: bookings, count } = { data: [], count: 0 },
  } = useQuery({
    queryKey: ["bookings", filter, newSortBy, page],
    queryFn: () => getBookings({ filter, newSortBy, page }),
  });

  //Pre-fetch
  if (page < Math.ceil(count / 10)) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, newSortBy, page + 1],
      queryFn: () => getBookings({ filter, newSortBy, page: page + 1 }),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, newSortBy, page - 1],
      queryFn: () => getBookings({ filter, newSortBy, page: page - 1 }),
    });
  }

  return (
    <Menus>
      <Table $columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          isLoading={isLoading}
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />

        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
