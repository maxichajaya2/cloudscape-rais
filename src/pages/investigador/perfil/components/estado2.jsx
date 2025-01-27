import { Button, Header, SpaceBetween } from "@cloudscape-design/components";
import Solicitar from "./solicitar";
import ModalSolicitud from "./modalSolicitud";
import { useState } from "react";

export default ({ data, reload }) => {
  //  States
  const [modal, setModal] = useState("");

  return (
    <SpaceBetween size="xs">
      <Header
        variant="h3"
        actions={
          <Button variant="primary" onClick={() => setModal("solicitar")}>
            Solicitar
          </Button>
        }
      >
        Solicitar constancia
      </Header>
      <Solicitar data={data.solicitar} />
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
