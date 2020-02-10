import checkpoint from "../services/checkpoint.js";

export default class LatencyChart {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      this.data = [];
      this.uri = $node.dataset.uri;

      /** @type {import("chart.js").Chart} */
      this.chartJs = new Chart($node, {
        data: {
          datasets: [
            {
              borderColor: "rgb(0, 0, 0)",
              borderWidth: 1,
              data: [],
              fill: false,
              label: "Latency",
              lineTension: 0,
              pointRadius: 0,
            },
          ],
        },
        options: {
          animation: {
            duration: 0,
          },
          legend: {
            display: false,
          },
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
            yAxes: [
              {
                labelString: "Latency",
                ticks: {
                  beginAtZero: true,
                },
                type: "linear",
              },
            ],
          },
          tooltips: {
            enabled: false,
          },
        },
        type: "line",
      });

      this.update();
    } catch (err) {
      console.error(`[web] [public/js/components/LatencyChart()] Error: ${err.message}`);
    }
  }

  /**
   * Update chart data.
   *
   * @returns {Promise<void>}
   */
  async update() {
    try {
      const rawData = await checkpoint.index(this.uri);
      const data = rawData.map(({ date, latency }) => ({ x: date, y: latency }));

      const newDataset = { ...this.chartJs.data.datasets[0] };
      newDataset.data = data;
      this.chartJs.data.datasets.pop();
      this.chartJs.data.datasets.push(newDataset);
      this.chartJs.update();

      setTimeout(this.update.bind(this), 1000);
    } catch (err) {
      console.error(`[web] [public/js/components/LatencyChart#update()] Error: ${err.message}`);
    }
  }
}
