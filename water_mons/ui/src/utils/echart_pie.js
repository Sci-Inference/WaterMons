import * as React from "react";
import { render } from "react-dom";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts/core";

class Basic_Pie extends React.Component {
  constructor(props) {
    super(props);
    this.getSeriesData = this.getSeriesData.bind(this);
    this.draw = this.draw.bind(this);
    this.eChartsRef = React.createRef();
  }

  componentDidMount() {
    this.draw();
  }
  componentDidUpdate() {
    this.draw();
  }

  getSeriesData() {
    if (this.props.data === undefined) return;
    let series = []
    this.props.data.map((d)=>{
      let tmp = {value:d[1],name:d[0]}
      series.push(tmp)
    })
    return series;
  }

  draw() {
    let option = {
      tooltip: {
          trigger: 'item'
      },
      legend: {
          orient: 'vertical',
          left: 'left',
      },
      series: [
          {
              type: 'pie',
              radius: '50%',
              data: this.getSeriesData(),
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 5,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  }
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

export default Basic_Pie;
