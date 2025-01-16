import {
  Box,
  Button,
  Header,
  SpaceBetween,
  Pagination,
  PropertyFilter,
  Select,
  Table,
  Container,
  ColumnLayout
} from "@cloudscape-design/components";
import { useState, useEffect, useContext } from "react";
import axiosBase from "../../../../../../api/axios";
import NotificationContext from "../../../../../../providers/notificationProvider";
import { useCollection } from "@cloudscape-design/collection-hooks";

const columnDefinitions = [
  {
    id: "tipo",
    header: "Tipo",
    cell: (item) => item.tipo,
    minWidth: 100,
  },
  {
    id: "partida",
    header: "Partida",
    cell: (item) => item.partida,
    sortingField: "partida",
    minWidth: 300,
  },
  {
    id: "monto",
    header: "Presupuesto asignado (S/)",
    cell: (item) => parseFloat(item.monto).toFixed(3),
    sortingField: "monto",
    minWidth: 150,
  },
  {
    id: "monto_rendido_enviado",
    header: "Monto rendido enviado (S/)",
    cell: (item) => parseFloat(item.monto_rendido_enviado).toFixed(3),
    sortingField: "monto_rendido_enviado",
    minWidth: 150,
  },
  {
    id: "monto_rendido",
    header: "Monto rendido validado DPGIP (S/)",
    cell: (item) => parseFloat(item.monto_rendido).toFixed(3),
    sortingField: "monto_rendido",
    minWidth: 150,
  },
  {
    id: "saldo_rendicion",
    header: "Saldo rendición (S/)",
    cell: (item) =>
      parseFloat(item.monto - item.monto_rendido - item.monto_rendido_enviado).toFixed(3),
    sortingField: "saldo_rendicion",
    minWidth: 150,
  },
  {
    id: "monto_excedido",
    header: "Excedido (S/)",
    cell: (item) => parseFloat(item.monto_excedido).toFixed(3),
    sortingField: "monto_excedido",
    minWidth: 150,
  },
  {
    id: "monto_total",
    header: "Monto Total (S/)", // Nueva columna de ejemplo
    cell: (item) => parseFloat(item.monto_total).toFixed(3), // Accede a monto_total
    sortingField: "monto_total",
    minWidth: 150,
  },
];

const columnDisplay = [
  { id: "tipo", visible: true },
  { id: "partida", visible: true },
  { id: "monto", visible: true },
  { id: "monto_rendido_enviado", visible: true },
  { id: "monto_rendido", visible: true },
  { id: "saldo_rendicion", visible: true },
  { id: "monto_excedido", visible: true },
];



export default ({ id }) => {
  //  Context
  const { notifications, pushNotification } = useContext(NotificationContext);

  //  Data states
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [distributions, setDistribution] = useState([]);

  const {
    items,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    propertyFilterProps,
    actions,
  } = useCollection(distributions, {


    pagination: { pageSize: 10 },
    sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
    selection: {},
  });

  const getData = async () => {
    setLoading(true);
    const res = await axiosBase.get(
      "admin/economia/comprobantes/listadoPartidasProyecto",
      {
        params: {
          geco_proyecto_id: id,
        },
      }
    );
    const data = res.data.map((partida) => ({
      ...partida,
      monto_total: partida.monto + partida.monto_rendido + partida.monto_excedido, // Ejemplo de nueva propiedad
    }));
    setDistribution(data);
    setLoading(false);
  };

 
  const recalcular = async () => {
    setLoadingBtn(true);
    const res = await axiosBase.get(
      "admin/economia/comprobantes/recalcularMontos",
      {
        params: {
          geco_proyecto_id: id,
        },
      }
    );
    const data = res.data;
    pushNotification(data.detail, data.message, notifications.length + 1);
    setLoadingBtn(false);
    getData();
  };

  //  Effects
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Table
        trackBy="codigo"
        items={[
          ...distributions,]}
        columnDefinitions={columnDefinitions}
        columnDisplay={columnDisplay}
        loading={loading}
        loadingText="Cargando datos"
        wrapLines
        onRowClick={({ detail }) => actions.setSelectedItems([detail.item])}
        header={
          <Header
            counter={"(" + distributions.length + ")"}
            actions={
              <Button onClick={recalcular} loading={loadingBtn}>
                Recalcular montos
              </Button>
            }
          >
            Listado de partidas
          </Header>
        }
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No hay registros...</b>
            </SpaceBetween>
          </Box>
        }
      />

    </>
  );
};
