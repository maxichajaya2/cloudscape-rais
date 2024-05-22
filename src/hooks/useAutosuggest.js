import { useState, useEffect } from "react";
import axiosBase from "../api/axios";

const useAutosuggest = (type) => {
  //  States
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");
  const [avoidSelect, setAvoidSelect] = useState(true);

  //  Functions
  const getData = async () => {
    setLoading(true);
    switch (type) {
      case "investigador":
        {
          const res = await axiosBase.get(
            "admin/admin/usuarios/searchInvestigadorBy/" + value
          );
          const data = await res.data;
          const opt = data.map((item) => {
            return {
              detail: item.id,
              value: `${item.codigo} | ${item.doc_numero} | ${item.apellido1} ${item.apellido2}, ${item.nombres}`,
            };
          });
          setOptions(opt);
        }
        break;
      case "rrhh":
        {
          const res = await axiosBase.get(
            "admin/estudios/grupos/searchDocenteRrhh",
            {
              params: {
                query: value,
              },
            }
          );
          const data = await res.data;
          setOptions(data);
        }
        break;
      default:
        break;
    }
    setLoading(false);
  };

  //  Effects
  useEffect(() => {
    const temp = setTimeout(() => {
      if (value && avoidSelect) {
        getData();
      } else {
        setAvoidSelect(true);
      }
    }, 1000);
    return () => clearTimeout(temp);
  }, [value]);

  return { loading, options, setOptions, value, setValue, setAvoidSelect };
};

export { useAutosuggest };