import {
  Autosuggest,
  Badge,
  Box,
  ButtonDropdown,
  FormField,
  Header,
  Pagination,
  PropertyFilter,
  SpaceBetween,
  Table,
} from "@cloudscape-design/components";
import { useState, useEffect } from "react";
import { useCollection } from "@cloudscape-design/collection-hooks";
import axiosBase from "../../../../../api/axios";
import { useAutosuggest } from "../../../../../hooks/useAutosuggest";
import queryString from "query-string";
import ModalAudit from "../components/modalAudit";

const stringOperators = [":", "!:", "=", "!=", "^", "!^"];

const FILTER_PROPS = [
  {
    propertyLabel: "ID",
    key: "id",
    groupValuesLabel: "IDS",
    operators: stringOperators,
  },
  {
    propertyLabel: "Código de registro",
    key: "codigo_registro",
    groupValuesLabel: "Códigos de registro",
    operators: stringOperators,
  },
  {
    propertyLabel: "Tipo",
    key: "tipo",
    groupValuesLabel: "Tipos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Tipo de patente",
    key: "tipo_patente",
    groupValuesLabel: "Tipos de patente",
    operators: stringOperators,
  },
  {
    propertyLabel: "Isbn",
    key: "isbn",
    groupValuesLabel: "Isbns",
    operators: stringOperators,
  },
  {
    propertyLabel: "Issn",
    key: "issn",
    groupValuesLabel: "Issns",
    operators: stringOperators,
  },
  {
    propertyLabel: "Editorial",
    key: "editorial",
    groupValuesLabel: "Editoriales",
    operators: stringOperators,
  },
  {
    propertyLabel: "Nombre de evento",
    key: "evento_nombre",
    groupValuesLabel: "Nombres de eventos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Título",
    key: "titulo",
    groupValuesLabel: "Títulos",
    operators: stringOperators,
  },
  {
    propertyLabel: "Fecha de publicación",
    key: "fecha_publicacion",
    groupValuesLabel: "Fechas",
    operators: stringOperators,
  },
  {
    propertyLabel: "Fecha de creación",
    key: "created_at",
    groupValuesLabel: "Fechas",
    operators: stringOperators,
  },
  {
    propertyLabel: "Fecha de actualización",
    key: "updated_at",
    groupValuesLabel: "Fechas",
    operators: stringOperators,
  },
  {
    propertyLabel: "Estado",
    key: "estado",
    groupValuesLabel: "Estados",
    operators: stringOperators,
  },
  {
    propertyLabel: "Procedencia",
    key: "procedencia",
    groupValuesLabel: "Procedencias",
    operators: stringOperators,
  },
];

const columnDefinitions = [
  {
    id: "id",
    header: "ID",
    cell: (item) => item.id,
    sortingField: "id",
    isRowHeader: true,
  },
  {
    id: "codigo_registro",
    header: "Código de registro",
    cell: (item) => item.codigo_registro,
    sortingField: "codigo_registro",
  },
  {
    id: "codigo_proyecto",
    header: "Código",
    cell: (item) => item.codigo_proyecto,
    sortingField: "codigo_proyecto",
  },
  {
    id: "tipo",
    header: "Tipo",
    cell: (item) => item.tipo,
    sortingField: "tipo",
  },
  {
    id: "tipo_patente",
    header: "Tipo de patente",
    cell: (item) => item.tipo_patente,
    sortingField: "tipo_patente",
  },
  {
    id: "isbn",
    header: "Isbn",
    cell: (item) => item.isbn,
    sortingField: "isbn",
  },
  {
    id: "titulo",
    header: "Título",
    cell: (item) => item.titulo,
    minWidth: 400,
    sortingField: "titulo",
  },
  {
    id: "issn",
    header: "Issn",
    cell: (item) => item.issn,
    sortingField: "issn",
  },
  {
    id: "editorial",
    header: "Editorial",
    cell: (item) => item.editorial,
    sortingField: "editorial",
  },
  {
    id: "evento_nombre",
    header: "Nombre de evento",
    cell: (item) => item.evento_nombre,
    sortingField: "evento_nombre",
  },
  {
    id: "fecha_publicacion",
    header: "Fecha de publicación",
    cell: (item) => item.fecha_publicacion,
    sortingField: "fecha_publicacion",
  },
  {
    id: "created_at",
    header: "Fecha de creación",
    cell: (item) => item.created_at,
    sortingField: "created_at",
  },
  {
    id: "updated_at",
    header: "Fecha de actualización",
    cell: (item) => item.updated_at,
    sortingField: "updated_at",
  },
  {
    id: "estado",
    header: "Estado",
    cell: (item) => (
      <Badge
        color={
          item.estado == "Eliminado"
            ? "red"
            : item.estado == "Registrado"
            ? "green"
            : item.estado == "Observado"
            ? "red"
            : item.estado == "Enviado"
            ? "blue"
            : item.estado == "En proceso"
            ? "grey"
            : item.estado == "Anulado"
            ? "red"
            : item.estado == "No registrado"
            ? "grey"
            : item.estado == "Duplicado"
            ? "red"
            : "red"
        }
      >
        {item.estado}
      </Badge>
    ),
    sortingField: "estado",
  },
  {
    id: "procedencia",
    header: "Procedencia",
    cell: (item) => item.procedencia,
    sortingField: "procedencia",
  },
];

const columnDisplay = [
  { id: "id", visible: true },
  { id: "codigo_registro", visible: true },
  { id: "tipo", visible: true },
  { id: "tipo_patente", visible: true },
  { id: "titulo", visible: true },
  { id: "isbn", visible: true },
  { id: "issn", visible: true },
  { id: "editorial", visible: true },
  { id: "evento_nombre", visible: true },
  { id: "fecha_publicacion", visible: true },
  { id: "created_at", visible: true },
  { id: "updated_at", visible: true },
  { id: "estado", visible: true },
  { id: "procedencia", visible: true },
];

export default () => {
  //  States
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({});
  const [distributions, setDistribution] = useState([]);
  const [type, setType] = useState("");

  //  Hooks
  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    propertyFilterProps,
  } = useCollection(distributions, {
    propertyFiltering: {
      filteringProperties: FILTER_PROPS,
      empty: (
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="m">
            <b>No hay registros...</b>
          </SpaceBetween>
        </Box>
      ),
      noMatch: (
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="m">
            <b>No hay coincidencias</b>
          </SpaceBetween>
        </Box>
      ),
    },
    pagination: { pageSize: 10 },
    sorting: {},
    selection: {},
  });
  const { loading, options, setOptions, value, setValue, setAvoidSelect } =
    useAutosuggest("admin/admin/usuarios/searchInvestigadorBy");

  //  Functions
  const getData = async () => {
    setLoadingData(true);
    const res = await axiosBase.get("admin/estudios/publicaciones/listado", {
      params: {
        investigador_id: form.investigador_id,
      },
    });
    const data = res.data;
    setDistribution(data);
    setLoadingData(false);
  };

  const reporte = async () => {
    setLoadingBtn(true);
    const res = await axiosBase.get("admin/estudios/publicaciones/reporte", {
      params: {
        id: collectionProps.selectedItems[0].id,
        tipo: collectionProps.selectedItems[0].tipo_publicacion,
      },
      responseType: "blob",
    });
    setLoadingBtn(false);
    const blob = res.data;
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  //  Effects
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (Object.keys(form).length != 0) {
      getData();
    }
  }, [form]);

  return (
    <>
      <Table
        {...collectionProps}
        stickyHeader
        trackBy="id"
        items={items}
        columnDefinitions={columnDefinitions}
        columnDisplay={columnDisplay}
        loading={loadingData}
        loadingText="Cargando datos"
        resizableColumns
        enableKeyboardNavigation
        selectionType="single"
        onRowClick={({ detail }) => actions.setSelectedItems([detail.item])}
        wrapLines
        header={
          <Header
            counter={"(" + distributions.length + ")"}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <ButtonDropdown
                  items={[
                    {
                      text: "Artículo de revista",
                      id: "articulo",
                      disabled: false,
                    },
                    {
                      text: "Capítulo de libro",
                      id: "capitulo",
                      disabled: false,
                    },
                    {
                      text: "Libro",
                      id: "libro",
                      disabled: false,
                    },
                    {
                      text: "Evento científico",
                      id: "evento",
                      disabled: false,
                    },
                    {
                      text: "Tesis propia",
                      id: "tesis",
                      disabled: false,
                    },
                    {
                      text: "Tesis asesoría",
                      id: "tesis-asesoria",
                      disabled: false,
                    },
                  ]}
                  onItemClick={({ detail }) => {
                    window.location.href =
                      "gestion_publicaciones/nuevo?tipo=" + detail.id;
                  }}
                >
                  Nuevo
                </ButtonDropdown>
                <ButtonDropdown
                  variant="primary"
                  disabled={!collectionProps.selectedItems.length}
                  items={[
                    {
                      id: "action_1_1",
                      text: "Editar",
                      iconName: "edit",
                    },
                    {
                      id: "action_1_2",
                      text: "Reporte",
                      iconName: "file",
                    },
                    {
                      id: "action_1_3",
                      text: "Auditoría",
                      iconName: "check",
                    },
                  ]}
                  onItemClick={({ detail }) => {
                    if (detail.id == "action_1_1") {
                      const query = queryString.stringify({
                        id: collectionProps.selectedItems[0]["id"],
                      });
                      //  Redirigir a patentes
                      if (
                        collectionProps.selectedItems[0]["tipo"] == "Patente"
                      ) {
                        window.location.href =
                          "gestion_publicaciones/patente?" + query;
                      } else {
                        window.location.href =
                          "gestion_publicaciones/detalle?" + query;
                      }
                    } else if (detail.id == "action_1_2") {
                      reporte();
                    } else if (detail.id == "action_1_3") {
                      setType("audit");
                    }
                  }}
                  loading={loadingBtn}
                >
                  Acciones
                </ButtonDropdown>
              </SpaceBetween>
            }
          >
            Publicaciones
          </Header>
        }
        filter={
          <PropertyFilter
            {...propertyFilterProps}
            filteringPlaceholder="Buscar publicación"
            countText={`${filteredItemsCount} coincidencias`}
            expandToViewport
            virtualScroll
            customControl={
              <FormField label="Buscar por investigador" stretch>
                <Autosuggest
                  onChange={({ detail }) => {
                    setOptions([]);
                    setValue(detail.value);
                    if (detail.value == "") {
                      setForm({});
                    }
                  }}
                  onSelect={({ detail }) => {
                    if (detail.selectedOption.investigador_id != undefined) {
                      setAvoidSelect(false);
                      const { value, ...rest } = detail.selectedOption;
                      setForm(rest);
                    }
                  }}
                  value={value}
                  options={options}
                  loadingText="Cargando data"
                  placeholder="Código, dni o nombre del investigador"
                  statusType={loading ? "loading" : "finished"}
                  empty="No se encontraron resultados"
                />
              </FormField>
            }
          />
        }
        pagination={<Pagination {...paginationProps} />}
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No hay registros...</b>
            </SpaceBetween>
          </Box>
        }
      />
      {type == "audit" && (
        <ModalAudit
          close={() => setType("")}
          item={collectionProps.selectedItems[0]}
        />
      )}
    </>
  );
};
