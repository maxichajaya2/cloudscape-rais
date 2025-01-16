import { Button, Header, SpaceBetween, Alert } from "@cloudscape-design/components";
import Constancia from "./constancia";
import Solicitar from "./solicitar";
import ModalSolicitud from "./modalSolicitud";
import { useState } from "react";

export default ({ data, reload }) => {
  //  States
  const [modal, setModal] = useState("");
  console.log(data.solicitar.req1.renacyt);
  console.log(data.solicitar.req1);
  return (
    <SpaceBetween size="m">


      <Constancia data={data.constancia} />
      <SpaceBetween size="xs">
        {/* Verificación de renacyt o nivel_renacyt */}
        {(!data.solicitar.req1.renacyt || !data.solicitar.req1.renacyt_nivel) ? (
          <Alert
            statusIconAriaLabel="Info"
            header="Alerta: Vigencia de Renacyt"
          >
            Su Vigencia de Renacyt ha caducado o no está registrada.
            <br />
            Por favor, renueve su Vigencia de Renacyt en el siguiente portal:{" "}
            <a
              href="https://servicio-renacyt.concytec.gob.pe/busqueda-de-investigadores/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portal de Renacyt
            </a>
          </Alert>
        ) : (
          <>
            <Header
              variant="h3"
              description="Puede solicitar una nueva constancia a 2 meses del vencimiento de su constancia vigente."
              actions={
                <Button variant="primary" onClick={() => setModal("solicitar")}>
                  Solicitar renovación
                </Button>
              }
            >
              Solicitar CDI
            </Header>
            <Solicitar data={data.solicitar} />
            {modal === "solicitar" && (
              <ModalSolicitud
                data={data.solicitar.rrhh}
                actividades={data.solicitar.actividades_extra}
                close={() => setModal("")}
                reload={reload}
              />
            )}
          </>
        )}
      </SpaceBetween>

      {modal == "solicitar" && (
        <ModalSolicitud
          data={data.solicitar.rrhh}
          actividades={data.solicitar.actividades_extra}
          close={() => setModal("")}
          reload={reload}
        />
      )}

    </SpaceBetween>
  );
};
