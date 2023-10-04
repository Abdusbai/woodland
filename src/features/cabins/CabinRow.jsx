import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import CreateCabinForm from "./CreateCabinForm";
import useDeleteCabin from "./useDeleteCabin";
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { format } from "date-fns";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

const CreationDate = styled.div`
  font-weight: 500;
  color: var(--color-grey-600);
`;

function CabinRow({ cabin }) {
  const { isDeleting, mutateDeleteCabin } = useDeleteCabin();
  return (
    <Table.Row role="row">
      <Img src={cabin.image} />
      <Cabin>{cabin.name}</Cabin>
      <div>Fits up to {cabin.maxCapacity} guests</div>
      <Price>{formatCurrency(cabin.regularPrice)}</Price>
      {cabin.discount ? (
        <Discount>{formatCurrency(cabin.discount)}</Discount>
      ) : (
        "-"
      )}
      <CreationDate>
        {format(new Date(cabin.created_at), "MM/dd/yyyy hh:mm a")}
      </CreationDate>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabin.id} />

            <Menus.List id={cabin.id}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateCabinForm cabin={cabin} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="cabin"
                elementName={cabin.name}
                disabled={isDeleting}
                onConfirm={() => mutateDeleteCabin(cabin.id)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
