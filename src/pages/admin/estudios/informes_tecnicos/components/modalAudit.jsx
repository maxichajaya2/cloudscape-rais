import {
  Box,
  Button,
  Modal,
  SpaceBetween,
  Table,
} from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import axiosBase from "../../../../../api/axios";

export default ({ close, id }) => {
  //  States
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Functions
  const getData = async () => {
    const res = await axiosBase.get(
      "admin/estudios/informesTecnicos/verAuditoria",
      {
        params: {
          id,
        },
      }
    );
    const data = res.data;
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Modal
      visible
      onDismiss={close}
      size="medium"
      header="Auditoría"
      footer={
        <Box float="right">
          <Button onClick={close}>Cerrar</Button>
        </Box>
      }
    >
      <Table
        trackBy="fecha"
        items={items}
        loading={loading}
        loadingText="Cargando datos"
        variant="embedded"
        wrapLines
        columnDefinitions={[
          {
            id: "fecha",
            header: "Fecha",
            cell: (item) => item.fecha,
            isRowHeader: true,
          },
          {
            id: "nombre",
            header: "Nombre",
            cell: (item) => item.nombres + " " + item.apellidos,
          },
        ]}
        columnDisplay={[
          { id: "fecha", visible: true },
          { id: "nombre", visible: true },
        ]}
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No hay registros...</b>
            </SpaceBetween>
          </Box>
        }
      />
    </Modal>
  );
};
