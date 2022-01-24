import React, { useEffect, useState } from "react";
import axios from "axios";

import { Container, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

var precios = [10.0, 11.0, 15.5, 9.1, 9.8, 13.0];
var titulo = "0x9ec8e8f64ec6bb47d944b4b830130b5fcf2da182";

function Crypto() {
  const [value, setValue] = useState([]);
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    const llamada = async () => {
      try {
        const configGET = {
          method: "get",
          url: "http://localhost/api/whale/",
        };

        const response = await axios(configGET);

        setValue(crearMovimientos(response.data.value));
        setFechas(transformarFechas(response.data.timestamp));
      } catch (error) {
        console.log(error);
      }
    };
    llamada();
  }, []);

  let options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: titulo,
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  let data = {
    labels: fechas,
    datasets: [
      {
        label: "Monedas almacenadas",
        data: value,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Precio de moneda",
        data: precios,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
      },
    ],
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Line options={options} data={data} />
        </Col>
      </Row>
    </Container>
  );
}

function crearMovimientos(compras) {
  var compra = [];
  var suma = 0;
  var i;
  for (i = 0; i < compras.length; i++) {
    suma = suma + transformarValores(compras[i], 18);
    compra.push(suma);
  }
  return compra;
}

function transformarFechas(timestamps) {
  var time = [];
  var i;
  for (i = 0; i < timestamps.length; i++) {
    time.push(timestampToDate(timestamps[i]));
  }
  return time;
}

function timestampToDate(timestamp) {
  var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
    ampm = "AM",
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    h = 12;
    ampm = "PM";
  } else if (hh == 0) {
    h = 12;
  }

  // ie: 2013-02-18, 8:35 AM
  time = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;

  return time;
}

function transformarValores(valor, decimales) {
  return valor / Math.pow(10, decimales);
}

export default Crypto;
