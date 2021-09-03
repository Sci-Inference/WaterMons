import * as React from "react";
import { render } from "react-dom";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts/core";

class Efficient_Frontier extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.draw();
  }
  componentDidUpdate() {
    this.draw();
  }

  draw(){
    let option = {
        tooltip: {},
        xAxis: this.getAxisData(),
        yAxis: {
          type: "value",
          splitLine: {},
        },
        legend: { data: this.getLegend() },
        series: this.getSeriesData(),
      }
    console.log(option)
    this.eChartsRef.current?.getEchartsInstance().setOption(option,{notMerge:true})
  }

  render() {
    let option = {}
    console.log('render')
    return  <ReactEcharts option={option} ref={this.eChartsRef}/>
  }
}


export default Efficient_Frontier;
