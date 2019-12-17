import React from "react";
import Chart from "chart.js";

export default class BarChart extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * @see https://www.chartjs.org/docs/latest/axes/cartesian/time.html
   */
  componentDidMount() {
    const { data } = this.props;

    this.myChart = new Chart(this.$canvas, {
      type: "bar",
      data: {
        datasets: [
          {
            label: "Latency",
            data
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              labelString: "Date",
              type: "time",
              distribution: "linear",
              time: {
                minUnit: "minute"
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.yLabel + "s";
            }
          }
        }
      }
    });
  }

  render() {
    return <canvas ref={node => (this.$canvas = node)} />;
  }
}
