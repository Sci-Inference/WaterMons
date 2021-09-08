import * as React from "react";
import { render } from "react-dom";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts/core";

class Basic_Line extends React.Component {
  constructor(props) {
    super(props);
    this.getAxisData = this.getAxisData.bind(this);
    this.getSeriesData = this.getSeriesData.bind(this);
    this.getLegend = this.getLegend.bind(this);
    this.draw = this.draw.bind(this);
    this.eChartsRef = React.createRef();
  }

  componentDidMount(){
    this.draw();
  }
  componentDidUpdate(){
      this.draw();
  }

  getLegend(){
    if(this.props.data[0]===undefined) return
    let yCol = Object.keys(this.props.data[0]).filter(d => d != this.props.xCol)
    return yCol
  }

  getAxisData(){
      let xData = this.props.data.map((d)=>{
          return (
              d[this.props.xCol]
          )
      })
      return {
          type:"category",
          data:xData
      }
  }

  getSeriesData(){
      if(this.props.data[0]===undefined) return
      let yCol = Object.keys(this.props.data[0]).filter(d => d != this.props.xCol)
      let series = []
      yCol.map((c)=>{
          let yData = this.props.data.map((d)=>{
              return d[c]
          })
          let tmp = {
              name:c,
              data:yData,
              type:'line'
          }
          series.push(tmp)
      })
      return series
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

export default Basic_Line;
