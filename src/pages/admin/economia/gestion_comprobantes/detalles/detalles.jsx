import {
  Box,
  ColumnLayout,
  Container,
  Header,
  SpaceBetween,
  Spinner,
  StatusIndicator,
  Button,
  Link,
  Icon,
} from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import axiosBase from "../../../../../api/axios";

export default ({ id }) => {
  //  States
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [detalles, setDetalles] = useState({});
  //  Functions
  const getData = async () => {
    const res = await axiosBase.get(
      "admin/economia/comprobantes/detalleProyecto",
      {
        params: {
          geco_id: id,
        },
      }
    );
    const data = res.data;
    setData(data);
    setLoading(false);
  };


  const reporte = async () => {
    setLoadingBtn(true);
    const res = await axiosBase.get(
      "admin/economia/comprobantes/detalleGasto",
      {
        params: {
          geco_proyecto_id: id,
        },
        responseType: "blob",
      }
    );
    const blob = await res.data;
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setLoadingBtn(false);
  };

  const reporteHojaResumen = async () => {
    setLoadingBtn(true);
    const res = await axiosBase.get(
      "admin/economia/comprobantes/hojaResumen",
      {
        params: {
          id: id,
        },
        responseType: "blob",
      }
    );
    const blob = await res.data;
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setLoadingBtn(false);
  };

    const detalle = async () => {
      setLoading(true);
      const res = await axiosBase.get(
        "admin/economia/comprobantes/detalles",
        {
          params: {
            id: id,
          },
        }
      );
      const data = res.data;
      console.log(data);
      setDetalles(data);
      setLoading(false);
    };

   
     
  //  Effects
  useEffect(() => {
    getData();
    detalle();
  }, []);

  return (
    <>
      <Container header={<Header variant="h2">Detalles del proyecto</Header>}>
        <ColumnLayout columns={3} variant="text-grid">
          <SpaceBetween size="s" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            
            <div>
              <Box variant="awsui-key-label">Porcentaje rendido</Box>
              {loading ? (
                <Spinner size="large" />
              ) : (
                <Link variant="awsui-value-large" href="#">
                {detalles.cifras?.rendido ?? "-"}%
                </Link>
              )}
              <Box variant="awsui-key-label">Comprobantes aprobados</Box>
              {loading ? (
                <Spinner size="large" />
              ) : (
                <Link variant="awsui-value-large" href="#">
                  <Icon name="file" size="inherit" />    {detalles.cifras?.comprobantes ?? "-"}
                </Link>
              )}
            </div>

            <div>
              <Box variant="awsui-key-label">Transferencias aprobadas</Box>
              {loading ? (
                <Spinner size="large" />
              ) : (
                <Link variant="awsui-value-large" href="#">
                  <Icon name="check" size="inherit" />   {detalles.cifras?.transferencias ?? "-"}
                </Link>
              )}
              <Box variant="awsui-key-label">Cantidad de partidas</Box>
              {loading ? (
                <Spinner size="large" />
              ) : (
                <Link variant="awsui-value-large" href="#">
                  <Icon name="search" size="inherit" />   {detalles.cifras?.partidas ?? "-"}
                </Link>
              )}
            </div>
          </SpaceBetween>
          <SpaceBetween size="s">
            <div>
              <Box variant="awsui-key-label">Tipo</Box>
              {loading ? <Spinner /> : <div>{data.tipo_proyecto}</div>}
            </div>
            <div>
              <Box variant="awsui-key-label">Título</Box>
              {loading ? <Spinner /> : <div>{data.titulo}</div>}
            </div>
            <div>
              <Box variant="awsui-key-label">Código de proyecto</Box>
              {loading ? <Spinner /> : <div>{data.codigo_proyecto}</div>}
            </div>
            <div>
              <Box variant="awsui-key-label">Estado</Box>
              {loading ? (
                <Spinner />
              ) : (
                <StatusIndicator
                  type={
                    data.estado == 0
                      ? "info"
                      : data.estado == 1
                        ? "success"
                        : "error"
                  }
                >
                  {data.estado == 0
                    ? "Pendiente"
                    : data.estado == 1
                      ? "Completado"
                      : "error"}
                </StatusIndicator>
              )}
            </div>
          </SpaceBetween>
          <SpaceBetween size="s">
            <div>
              <Box variant="awsui-key-label">Responsable</Box>
              {loading ? <Spinner /> : <div>{data.responsable}</div>}
            </div>
            <div>
              <Box variant="awsui-key-label">Correo</Box>
              {loading ? <Spinner /> : <div>{data.email3}</div>}
            </div>
            <div>
              <Box variant="awsui-key-label">Teléfono</Box>
              {loading ? <Spinner /> : <div>{data.telefono_movil}</div>}
            </div>


            <div>

              <Button
                variant="primary"
                iconName="download"
                onClick={reporteHojaResumen}
                loading={loadingBtn}
                disabled={loading}
              >
                Hoja de resumen
              </Button>
              <Button
                disabled={loading}
                loading={loadingBtn}
                onClick={reporte}
                iconName="file"
              >
                Detalle de gasto
              </Button>
            </div>


          </SpaceBetween>
        </ColumnLayout>

      </Container>

    </>
  );
};
