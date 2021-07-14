import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';



class Line_Chart extends React.Component {
  constructor(props) {
    super(props);
    this.draw = this.draw.bind(this);
    this.get_canvas = this.get_canvas.bind(this);
    this.draw_line = this.draw_line.bind(this);
    this.myRef = React.createRef(); 
  }


  componentDidMount() {
    console.log(this.props.data);
    this.draw();

  }

  get_canvas(){
    var x = d3.scaleTime()
    .domain([new Date(this.props.startDate), new Date(this.props.endDate)])
    .range([ 0, this.props.width ]);
  
    var y = d3.scaleLinear()
    .domain([1,20])
    .range([ this.props.height,0]);
    const svg = d3.select(this.myRef.current)
    .append('svg')
    .attr('width', this.props.width+(this.props.margin*2))
    .attr('height', this.props.height+(this.props.margin*10));
    
    svg.append('g')
    .attr("transform", "translate(30,0)")
    .call(d3.axisLeft(y))
    .append('g')
    .attr("transform", `translate(0,${this.props.height})`)  
    .call(d3.axisBottom(x).tickSize(10));
    return {svg,x,y}

  }

  draw_line(svg,x,y,xName,yName,color){
    svg.append('path')
    .attr("transform", "translate(30,0)")
    .datum(this.props.data)
    .attr('fill','none')
    .attr("stroke", color)
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return x(new Date(d[xName])) })
        .y(function(d) { return y(d[yName]) })
        )
    return svg
  }

  draw() {

    let get_canvas = this.get_canvas();
    let svg = get_canvas.svg;
    let x = get_canvas.x;
    let y = get_canvas.y;
    svg = this.draw_line(svg,x,y,'Date','Benchmark','#FF5733');
    svg = this.draw_line(svg,x,y,'Date','Base','black');
  }

  render() {
    return (
      <div ref={this.myRef}></div>
    )
  }

}


export default Line_Chart