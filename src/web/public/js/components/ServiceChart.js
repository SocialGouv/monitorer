import { EVENT } from "../constants.js";

const CHART_TICKS = [
  0,
  100,
  150,
  200,
  250,
  300,
  400,
  500,
  1000,
  1500,
  2000,
  2500,
  3000,
  4000,
  5000,
  10000,
  15000,
];
const DURATION_CHART_TIME_UNIT = {
  ONE_DAY: "hour",
  ONE_HOUR: "minute",
  ONE_WEEK: "day",
};

export default class ServiceChart {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      const now = new Date();
      now.setSeconds(0, 0);

      /** @type {string} */
      this.uri = $node.dataset.uri;

      /** @type {import("chart.js").Chart} */
      this.chartJs = new window.Chart($node, {
        data: {
          datasets: [
            {
              borderColor: "rgb(0, 0, 0)",
              borderWidth: 1,
              data: this.data,
              fill: false,
              label: "Latency",
              lineTension: 0,
              pointRadius: 0,
            },
          ],
        },
        options: {
          animation: {
            // Disable animations:
            duration: 0,
          },
          aspectRatio: 3,
          elements: {
            line: {
              // Disable Bezier curves:
              tension: 0,
            },
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                distribution: "linear",
                labelString: "Date",
                ticks: {
                  autoSkip: true,
                  autoSkipPadding: 16,
                  maxRotation: 0,
                },
                time: {
                  displayFormats: {
                    minute: "HH:mm",
                  },
                },
                type: "time",
              },
            ],
            yAxes: [
              {
                afterBuildTicks: axis => (axis.ticks = CHART_TICKS),
                labelString: "Latency",
                ticks: {
                  beginAtZero: true,
                  callback: function(value) {
                    return value < 1000 ? `${value}ms` : `${value / 1000}s`;
                  },
                },
                type: "logarithmic",
              },
            ],
          },
          tooltips: {
            enabled: false,
          },
        },
        type: "line",
      });

      this.update = this.update.bind(this);

      this.bindEvents();
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceChart()] Error: ${err.message}`);
    }
  }

  /**
   * Bind events.
   *
   * @returns {void}
   */
  bindEvents() {
    try {
      document.addEventListener(EVENT.UPDATE_CHECKPOINTS, this.update);
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceChart#bindEvents()] Error: ${err.message}`);
    }
  }

  /**
   * Update chart data.
   *
   * @param {Event} event
   *
   * @returns {Promise<void>}
   */
  async update(event) {
    try {
      const detail = { ...event.detail };
      const { checkpoints, duration, uri } = detail;

      // Skip if it's not for this uri:
      if (uri !== this.uri) return;

      this.duration = duration;

      this.data = checkpoints.map(({ date, latency }) => ({ x: date, y: latency }));

      this.render();
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceChart#update()] Error: ${err.message}`);
    }
  }

  /**
   * Render chart.
   *
   * @returns {void}
   */
  render() {
    try {
      this.chartJs.options.scales.xAxes[0].time.unit = DURATION_CHART_TIME_UNIT[this.duration];

      const newLatencyDataset = { ...this.chartJs.data.datasets[0] };
      newLatencyDataset.data = this.data;
      this.chartJs.data.datasets.pop();
      this.chartJs.data.datasets.push(newLatencyDataset);

      this.chartJs.update();
    } catch (err) {
      console.error(`[web] [public/js/components/ServiceChart#render()] Error: ${err.message}`);
    }
  }
}
