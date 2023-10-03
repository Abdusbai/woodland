import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";
import CabinRow from "./CabinRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";

function CabinTable() {
  const { isLoading, data } = useQuery({
    queryKey: ["cabin"],
    queryFn: getCabins,
  });

  const [searchParams] = useSearchParams();

  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;
  let sortCabins;
  if (data !== undefined) {
    if (filterValue === "all") {
      filteredCabins = data;
    } else if (filterValue === "no-discount") {
      filteredCabins = data.filter((cabin) => cabin.discount === 0);
    } else if (filterValue === "with-discount") {
      filteredCabins = data.filter((cabin) => cabin.discount > 0);
    }

    const sortValue = searchParams.get("sortBy") || "name-asc";
    const [field, direction] = sortValue.split("-");
    const modifier = direction === "asc" ? 1 : -1;
    sortCabins = filteredCabins.sort((a, b) => {
      if (a[field] < b[field]) {
        return -1 * modifier;
      }
      if (a[field] > b[field]) {
        return 1 * modifier;
      }
      return 0;
    });
  }

  console.log(sortCabins);

  return (
    <Menus>
      <Table $columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1.5fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div>Creation date</div>
          <div></div>
        </Table.Header>
        <Table.Body
          isLoading={isLoading}
          data={sortCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
