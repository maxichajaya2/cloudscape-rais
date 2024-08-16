import {
  Alert,
  Box,
  Button,
  ColumnLayout,
  Container,
  FormField,
  Header,
  Input,
  Modal,
  SpaceBetween,
  Spinner,
  Table,
  TokenGroup,
} from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import axiosBase from "../../../../../api/axios";

export default ({ id, close }) => {
  //  States
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  //  Functions
  const getData = async () => {
    const res = await axiosBase.get(
      "investigador/publicaciones/utils/infoPublicacion",
      {
        params: {
          id,
        },
      }
    );
    const data = res.data;
    setData(data);
    setLoadingData(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Modal
      visible
      size="large"
      onDismiss={close}
      header={<Header>Solicitar ser incluído como autor</Header>}
      footer={
        <Box float="right">
          <Button variant="normal" onClick={close}>
            Cerrar
          </Button>
        </Box>
      }
    >
      {loadingData ? (
        <>
          <Spinner /> Cargando datos
        </>
      ) : (
        <SpaceBetween size="m">
          <Alert header="Esta publicación ya está registrada">
            En caso quiera ser incluído en la lista de autores de esta
            publicación comuníquese con el personal del RAIS.
          </Alert>
          <Container>
            <SpaceBetween size="s">
              <FormField label="Título" stretch>
                <Input value={data.titulo} readOnly />
              </FormField>
              <FormField label="Tipo de publicación" stretch>
                <Input value={data.tipo_publicacion} readOnly />
              </FormField>
            </SpaceBetween>
          </Container>
          <Container>
            <SpaceBetween size="s">
              <ColumnLayout columns={2}>
                <FormField
                  label="Doi"
                  info={
                    <Button
                      iconName="external"
                      variant="inline-icon"
                      target="_blank"
                      href={`https://doi.org/${data.doi ?? ""}`}
                    />
                  }
                  stretch
                >
                  <Input value={data.doi} readOnly />
                </FormField>
                <FormField label="Fecha de publicación" stretch>
                  <Input value={data.fecha_publicacion} readOnly />
                </FormField>
              </ColumnLayout>
              <FormField label="Palabras clave" stretch>
                {data.palabras_clave.length > 0 ? (
                  <TokenGroup items={data.palabras_clave} readOnly />
                ) : (
                  <>No tiene palabras clave</>
                )}
              </FormField>
            </SpaceBetween>
          </Container>
          <Container>
            <SpaceBetween size="s">
              <FormField label="Revista" stretch>
                <Input value={data.publicacion_nombre} readOnly />
              </FormField>
              <FormField label="Indexada" stretch>
                {data.index.length > 0 ? (
                  <TokenGroup items={data.index} readOnly />
                ) : (
                  <>No está indexada a ninguna revista</>
                )}
              </FormField>
              <ColumnLayout columns={2}>
                <FormField
                  label="ISSN"
                  info={
                    <Button
                      iconName="external"
                      variant="inline-icon"
                      target="_blank"
                      href={`https://portal.issn.org/resource/ISSN/${
                        data.issn ?? ""
                      }`}
                    />
                  }
                  stretch
                >
                  <Input value={data.issn} readOnly />
                </FormField>
                <FormField
                  label="ISSN-E"
                  info={
                    <Button
                      iconName="external"
                      variant="inline-icon"
                      target="_blank"
                      href={`https://portal.issn.org/resource/ISSN/${
                        data.issn_e ?? ""
                      }`}
                    />
                  }
                  stretch
                >
                  <Input value={data.issn_e} readOnly />
                </FormField>
              </ColumnLayout>
              <ColumnLayout columns={4} minColumnWidth={120}>
                <FormField label="Volumen" stretch>
                  <Input value={data.volumen} readOnly />
                </FormField>
                <FormField label="Número" stretch>
                  <Input value={data.edicion} readOnly />
                </FormField>
                <FormField label="Pag. inicial" stretch>
                  <Input value={data.pagina_inicial} readOnly />
                </FormField>
                <FormField label="Pag. final" stretch>
                  <Input value={data.pagina_final} readOnly />
                </FormField>
              </ColumnLayout>
            </SpaceBetween>
          </Container>
          <Table
            header={<Box variant="strong">Proyectos asociados</Box>}
            columnDefinitions={[
              {
                id: "codigo_proyecto",
                header: "Código",
                cell: (item) => item.codigo_proyecto,
                isRowHeader: true,
              },
              {
                id: "nombre_proyecto",
                header: "Nombre",
                cell: (item) => item.nombre_proyecto,
              },
              {
                id: "entidad_financiadora",
                header: "Entidad financiadora",
                cell: (item) => item.entidad_financiadora,
              },
            ]}
            columnDisplay={[
              { id: "codigo_proyecto", visible: true },
              { id: "nombre_proyecto", visible: true },
              { id: "entidad_financiadora", visible: true },
            ]}
            items={data.proyectos}
            wrapLines
            empty={
              <Box
                margin={{ vertical: "xs" }}
                textAlign="center"
                color="inherit"
              >
                <SpaceBetween size="m">
                  <b>No hay registros...</b>
                </SpaceBetween>
              </Box>
            }
          />
          <Table
            header={<Box variant="strong">Autores</Box>}
            columnDefinitions={[
              {
                id: "autor",
                header: "Nombre",
                cell: (item) => item.autor,
                isRowHeader: true,
              },
              {
                id: "categoria",
                header: "Categoría",
                cell: (item) => item.categoria,
              },
              {
                id: "tipo",
                header: "Tipo",
                cell: (item) => item.tipo,
              },
            ]}
            columnDisplay={[
              { id: "autor", visible: true },
              { id: "categoria", visible: true },
              { id: "tipo", visible: true },
            ]}
            items={data.autores}
            wrapLines
            empty={
              <Box
                margin={{ vertical: "xs" }}
                textAlign="center"
                color="inherit"
              >
                <SpaceBetween size="m">
                  <b>No hay registros...</b>
                </SpaceBetween>
              </Box>
            }
          />
        </SpaceBetween>
      )}
    </Modal>
  );
};