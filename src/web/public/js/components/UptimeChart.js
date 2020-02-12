import { EVENT } from "../constants.js";
import checkpoint from "../services/checkpoint.js";

export default class UptimeChart {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      this.data = [];
      this.length = "1D";
      this.uri = $node.dataset.uri;

      this.chartJs = new Chart($node, {
        data: {
          datasets: [
            {
              backgroundColor: ({ dataIndex, dataset }) =>
                dataset.data[dataIndex] === undefined || dataset.data[dataIndex].y !== 1
                  ? "red"
                  : "green",
              barPercentage: 1,
              categoryPercentage: 1,
              data: [],
              label: "Uptime",
              minBarLength: 1,
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
                display: 0,
                labelString: "Uptime",
                suggestedMax: 1,
                suggestedMin: -1,
                ticks: {
                  max: 1,
                  min: -1,
                  stepSize: 1,
                },
                type: "linear",
              },
            ],
          },
          tooltips: {
            enabled: false,
          },
        },
        type: "bar",
      });

      this.bindEvents();
      this.update();
    } catch (err) {
      console.error(`[web] [public/js/components/UptimeChart()] Error: ${err.message}`);
    }
  }

  /**
   * Bind events.
   *
   * @returns {void}
   */
  bindEvents() {
    try {
      document.addEventListener(EVENT.UPDATE_CHART_LENGTH, this.updateLength.bind(this));
    } catch (err) {
      console.error(`[web] [public/js/components/UptimeChart#bindEvents()] Error: ${err.message}`);
    }
  }

  /**
   * Update chart length.
   *
   * @param {MouseEvent} event
   *
   * @returns {void}
   */
  async updateLength(event) {
    try {
      clearTimeout(this.timeout);

      const { detail: length } = event;

      this.length = length;
      await this.update();
    } catch (err) {
      console.error(
        `[web] [public/js/components/UptimeChart#updateLength()] Error: ${err.message}`,
      );
    }
  }

  /**
   * Update chart data.
   *
   * @returns {Promise<void>}
   */
  async update() {
    try {
      const rawData = await checkpoint.index(this.uri, this.length);
      const data = rawData.map(({ date, isUp }) => ({ x: date, y: isUp ? 1 : -1 }));

      const newDataset = { ...this.chartJs.data.datasets[0] };
      newDataset.data = data;
      this.chartJs.data.datasets.pop();
      this.chartJs.data.datasets.push(newDataset);
      this.chartJs.update();

      this.timeout = setTimeout(this.update.bind(this), 10000);
    } catch (err) {
      console.error(`[web] [public/js/components/UptimeChart#update()] Error: ${err.message}`);
    }
  }
}
