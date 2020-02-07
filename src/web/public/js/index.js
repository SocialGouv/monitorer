import checkpoint from "./services/checkpoint.js";

const $charts = document.querySelectorAll(".js-chart");
[...$charts].forEach(async $chart => {
  const { uri } = $chart.dataset;

  const rawData = await checkpoint.index(uri);

  const data = rawData.map(({ date, latency }) => ({ x: date, y: latency }));

  new Chart($chart, {
    data: {
      datasets: [
        {
          data,
          label: "Latency",
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            distribution: "linear",
            labelString: "Date",
            time: {
              unit: "hour",
            },
            type: "time",
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.yLabel + "s";
          },
        },
      },
    },
    type: "bar",
  });
});
