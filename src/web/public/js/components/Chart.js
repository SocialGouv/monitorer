import { CHART_LENGTH, EVENT } from "../constants.js";
import checkpoint from "../services/checkpoint.js";

const CHART_LENGTH_DIVIDER = {
  "1D": 6, // => 240 checkpoints
  "1H": 1, // => 60 checkpoints
  "1W": 6 * 7, // => 240 checkpoints
};
const CHART_TICKS = [0, 150, 1500, 15000];
const CHART_TIME_UNIT = {
  "1D": "hour",
  "1H": "minute",
  "1W": "day",
};

export default class Chart {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      const defaultLength = CHART_LENGTH["1D"];

      this.data = [];
      this.length = defaultLength;
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
                time: {
                  displayFormats: {
                    minute: "HH:mm",
                  },
                  time: CHART_TIME_UNIT[defaultLength],
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
                  max: CHART_TICKS[CHART_TICKS.length - 1],
                  // min: CHART_TICKS[0],
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

      this.bindEvents();
      this.update();
    } catch (err) {
      console.error(`[web] [public/js/components/Chart()] Error: ${err.message}`);
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
      console.error(`[web] [public/js/components/Chart#bindEvents()] Error: ${err.message}`);
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
      this.chartJs.options.scales.xAxes[0].time.unit = CHART_TIME_UNIT[length];
      await this.update(true);
    } catch (err) {
      console.error(`[web] [public/js/components/Chart#updateLength()] Error: ${err.message}`);
    }
  }

  /**
   * Update chart data.
   *
   * @param {boolean=} isForced
   *
   * @returns {Promise<void>}
   */
  async update(isForced = false) {
    try {
      const checkpoints = await checkpoint.index(this.uri, this.length);
      if (checkpoints.length !== 0) {
        if (!isForced && checkpoints[0].date === this.lastCheckpointDate) return;
        this.lastCheckpointDate = checkpoints[0].date;
      }

      const aggregatedCheckpoints = this.aggregate(checkpoints);
      this.data = aggregatedCheckpoints.map(({ date, latency }) => ({ x: date, y: latency }));
      this.render();

      this.timeout = setTimeout(this.update.bind(this), 1000);
    } catch (err) {
      console.error(`[web] [public/js/components/Chart#update()] Error: ${err.message}`);
    }
  }

  /**
   * Render chart.
   *
   * @returns {void}
   */
  render() {
    try {
      const newLatencyDataset = { ...this.chartJs.data.datasets[0] };
      newLatencyDataset.data = this.data;
      this.chartJs.data.datasets.pop();
      this.chartJs.data.datasets.push(newLatencyDataset);
      this.chartJs.update();
    } catch (err) {
      console.error(`[web] [public/js/components/Chart#render()] Error: ${err.message}`);
    }
  }

  aggregate(checkpoints) {
    try {
      const divider = CHART_LENGTH_DIVIDER[this.length];

      return divider === 1
        ? checkpoints
        : window.R.pipe(
            window.R.splitEvery(divider),
            window.R.map(checkpointsCluster => {
              const aggregatedCheckpoint = window.R.reduce(
                (prev, checkpoint) => ({
                  ...prev,
                  isUp: prev.isUp && checkpoint.isUp,
                  latency: prev.latency + checkpoint.latency,
                }),
                checkpointsCluster[0],
              )(checkpointsCluster.slice(1));

              return {
                ...aggregatedCheckpoint,
                latency: aggregatedCheckpoint.isUp
                  ? Math.round(aggregatedCheckpoint.latency / divider)
                  : 0,
              };
            }),
          )(checkpoints);
    } catch (err) {
      console.error(`[web] [public/js/components/Chart#aggregate()] Error: ${err.message}`);
    }
  }
}
