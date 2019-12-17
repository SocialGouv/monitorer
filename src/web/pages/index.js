import axios from "axios";
import React from "react";

import BarChart from "../components/BarChart";

export default class IndexPage extends React.Component {
  static async getInitialProps() {
    const services = await axios.get("/api/services");
    const checkpoints = [];

    return { checkpoints, services };
  }

  renderService({ displayName, uri }) {
    const { checkpoints } = this.props;
    const data = checkpoints
      .filter(checkpoint => checkpoint.uri === uri)
      .map(({ date, latency }) => ({ x: date, y: latency }));

    return (
      <div key={uri}>
        <h2>{displayName}</h2>
        <BarChart data={data} />
      </div>
    );
  }

  render() {
    const { services } = this.props;

    return (
      <div>
        <h1>Monitor</h1>
        {services.map(this.renderService.bind(this))}
      </div>
    );
  }
}
