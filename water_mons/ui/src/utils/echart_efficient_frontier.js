import * as React from "react";
import { render } from "react-dom";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts/core";

class Efficient_Frontier extends React.Component {
  constructor(props) {
    super(props);
    this.getFronterData = this.getFronterData.bind(this);
    this.draw = this.draw.bind(this);
    this.eChartsRef = React.createRef();
  }
  async componentDidMount() {
    let data = await this.getFronterData();
    this.draw(data);
  }
  async componentDidUpdate() {
    let data = await this.getFronterData();
    this.draw(data);
  }

  async getFronterData() {
    let data = await fetch(
      "http://localhost:5000/risk/efficientFrontier",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            'tickers':this.props.tickerList,
            'method':this.props.method,
            'startDate':this.props.startDate,
            'endDate':this.props.endDate}),
      }
    ).then((d) => d.json());;
    console.log(data);
    return data
  }

  draw(data) {
    console.log(data);
    let option = {
      tooltip: {
        trigger: 'axis'
    },
      xAxis: {
          min:Math.min(...data['lineStd']),
          type:'value',
        },
      yAxis: {
        min:Math.min(...data['lineRe']),
        type: "value",
      },
      series: [{
        type:'line',
        data:data['frontierLine'],
        markPoint: {
          data: [
            {name: 'optimal_point', value: 'optimal', xAxis: data['pav'], yAxis: data['par']}
          ]
      },
      markLine: {
        data: [
            {type: 'average', name: '平均值'}
        ]
    }
        }],
    };
    console.log(option);
    this.eChartsRef.current
      ?.getEchartsInstance()
      .setOption(option, { notMerge: true });
  }

  render() {
    let option = {};
    console.log("render");
    return <ReactEcharts option={option} ref={this.eChartsRef} />;
  }
}

export default Efficient_Frontier;
