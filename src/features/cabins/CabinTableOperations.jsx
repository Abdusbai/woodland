import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import Select from "../../ui/Select";
import { useSearchParams } from "react-router-dom";

function CabinTableOperations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") || "";

  function handleChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />
      <Select
        $type="white"
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "regularPrice-asc", label: "Sort by price (low first)" },
          { value: "regularPrice-desc", label: "Sort by price (high first)" },
          {
            value: "maxCapacity-asc",
            label: "Sort by capacity (low first)",
          },
          {
            value: "maxCapacity-desc",
            label: "Sort by capacity (high first)",
          },
          {
            value: "created_at-asc",
            label: "Sort by date (oldest first)",
          },
          {
            value: "created_at-desc",
            label: "Sort by date (newest first)",
          },
        ]}
        handleChange={handleChange}
        sortBy={sortBy}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
