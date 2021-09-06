import * as React from "react";
import { render } from "react-dom";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts/core";

class Efficient_Frontier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieInfo: 'optimal',
    };
    this.getFronterData = this.getFronterData.bind(this);
    this.draw = this.draw.bind(this);
    this.eChartsRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
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
    let data = await fetch("http://localhost:5000/risk/efficientFrontier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tickers: this.props.tickerList,
        method: this.props.method,
        startDate: this.props.startDate,
        endDate: this.props.endDate,
      }),
    }).then((d) => d.json());
    return data;
  }

  getWeightsData(weight,tickers){
    console.log('getWeights');
    let res = [];
    tickers.map((e,ix)=>{
      res.push({'value':weight[ix],'name':e})
    })
    return res
  }

  draw(data) {
    console.log(data['weiLine'])
    let pieWeight = 'optimal'
    if (this.state.pieInfo == 'optimal'){
      pieWeight = data['weights'];
    }
    else{
      pieWeight = data['weiLine'][parseInt(this.state.pieInfo)];
    }
    let option = {
      tooltip: {
      },
      xAxis: {
        min: Math.min(...data["lineStd"]),
        type: "value",
      },
      yAxis: {
        min: Math.min(...data["lineRe"]),
        type: "value",
      },
      grid: {top: '40%'},
      series: [
        {
          type: "line",
          data: data["frontierLine"],
          markPoint: {
            data: [
              {
                name: "optimal_point",
                value: "optimal",
                xAxis: data["pav"],
                yAxis: data["par"],
              },
            ],
          },
        },
        {
          name: 'Optimal Weight',
          type: 'pie',
          selectedMode: 'single',
          selectedOffset: 30,
          clockwise: true,
          radius: '25%',
          center: ['50%', '25%'],
          label: {
            show: true
        },
          emphasis: {
            label: {
                show: true
            }
          },
          data: this.getWeightsData(pieWeight,data['tickers']),
      }
      ],
    };
    this.eChartsRef.current
      ?.getEchartsInstance()
      .setOption(option, { notMerge: true });
  }

  handleClick(params){
    if (params.componentType =='series'){
      if (params.componentSubType == 'line'){
        this.setState({'pieInfo':params.dataIndex})
      }
    }
    else{
      if(params.componentType=='markPoint'){
        this.setState({'pieInfo':'optimal'})
      }
    }
  }

  render() {
    let option = {};
    console.log("render");
    return <ReactEcharts option={option} ref={this.eChartsRef} 
    onEvents={{
      'click':this.handleClick,
    }}/>;
  }
}

export default Efficient_Frontier;
