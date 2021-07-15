import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';



class Line_Chart extends React.Component {
  constructor(props) {
    super(props);
    this.draw = this.draw.bind(this);
    this.get_canvas = this.get_canvas.bind(this);
    this.draw_line = this.draw_line.bind(this);
    this.make_x_gridlines = this.make_x_gridlines.bind(this);
    this.make_y_gridlines = this.make_y_gridlines.bind(this);
    this.draw_legends = this.draw_legends.bind(this);
    this.get_max = this.get_max.bind(this);
    this.get_min = this.get_min.bind(this);
    this.myRef = React.createRef();
  }


  componentDidMount() {
    console.log(this.props.data);
    this.draw();
  }

  make_x_gridlines(x, tickNum) {
    return d3.axisBottom(x)
      .ticks(tickNum)
  }

  make_y_gridlines(y, tickNum) {
    return d3.axisLeft(y)
      .ticks(tickNum)
  }

  get_max(){
    let res = null;
    this.props.dataColor.forEach(element => {
      if (res === null){
        res = d3.max(this.props.data,d=>d[element.name]);
      }
      else {
        let tmp = d3.max(this.props.data,d=>d[element.name]);
        if(res < tmp){
          res = tmp
        }
      }
    });
    return res
  }

  get_min(){
    let res = null;
    this.props.dataColor.forEach(element => {
      if (res === null){
        res = d3.min(this.props.data,d=>d[element.name]);
      }
      else {
        let tmp = d3.min(this.props.data,d=>d[element.name]);
        if(res > tmp){
          res = tmp
        }
      }
    });
    return res
  }



  get_canvas() {
    let h = this.props.height + (this.props.margin * 2);
    let w = this.props.width + (this.props.margin * 2);
    let tickNum = Math.ceil(Math.sqrt(this.props.data.length));
    
    let x = d3.scaleTime()
      .domain([new Date(this.props.startDate), new Date(this.props.endDate)])
      .range([0, this.props.width]);

    let y = d3.scaleLinear()
      .domain([this.get_min(), this.get_max()])
      .range([this.props.height, this.props.margin/2]);

    const svg = d3.select(this.myRef.current)
      .append('svg')
      .attr('width', w)
      .attr('height', h);


    svg.append('rect')
      .attr("transform", `translate(30,0)`)
      .attr('width', this.props.width)
      .attr('height', this.props.height)
      .attr('fill', '#ECEBEB')

    svg.append('g')
      .attr("transform", "translate(30,0)")
      .call(d3.axisLeft(y))
      .append('g')
      .attr("transform", `translate(0,${this.props.height})`)
      .call(d3.axisBottom(x).tickSize(10));

    svg.append("g")
      .attr("class", "grid")
      .attr('stroke-width', '0.3')
      .attr("transform", "translate(0," + this.props.height + ")")
      .call(this.make_x_gridlines(x, tickNum)
        .tickSize(-this.props.height)
        .tickFormat("")
      )

    svg.append("g")
      .attr("class", "grid")
      .attr('stroke-width', '0.3')
      .attr("transform", "translate(30,0)")
      .call(this.make_y_gridlines(y)
        .tickSize(-this.props.width, tickNum)
        .tickFormat("")
      )
    return { svg, x, y }

  }

  draw_legends(svg, xpos, ypos, Name, color) {
    svg.append("rect")
      .attr("x", xpos)
      .attr("y", ypos)
      .attr("width", this.props.height * 0.01)
      .attr('height', this.props.height * 0.01)
      .style("fill", color)
      .attr("alignment-baseline", "middle")

    svg
      .append("text")
      .attr("x", xpos * 1.03)
      .attr("y", ypos * 1.1)
      .text(Name)
      .style("font-size", "10px")
      .attr("alignment-baseline", "middle")
  }


  draw_line(selection, x, y, xName, yName, color = 'black', dotColor = 'black', showLegend = true) {

  
    selection.append('path')
    .attr("transform", "translate(30,0)")
    .datum(this.props.data)
    .attr('fill', 'none')
    .attr("stroke", color)
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
    .x(function (d) { return x(new Date(d[xName])) })
    .y(function (d) { return y(d[yName]) })
    )

    selection.append('g')
      .attr("transform", "translate(30,0)")
      .selectAll('dot')
      .data(this.props.data)
      .enter()
      .append('circle')
      .attr("cx", function (d) { return x(new Date(d[xName])) })
      .attr("cy", function (d) { return y(d[yName]) })
      .attr("r", 2.5)
      .style("fill", dotColor)

  }

  draw() {
    let get_canvas = this.get_canvas();
    let svg = get_canvas.svg;
    let x = get_canvas.x;
    let y = get_canvas.y;

    this.props.dataColor.forEach((element, i) => {
      svg.call(
        (d) => this.draw_line(d, x, y, element.time, element.name, element.color, element.dot)
      )
        .call((d) => {
          this.draw_legends(
            d, this.props.width * 0.9,
            (i * 20) + this.props.width * 0.05,
            element.name, element.color)
        })
    });
  }

  render() {
    return (
      <div ref={this.myRef}></div>
    )
  }

}


export default Line_Chart