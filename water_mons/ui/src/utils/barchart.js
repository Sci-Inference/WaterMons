import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';



class Bar_Chart extends React.Component{
    constructor(props){
        super(props);
        this.myRef = React.createRef();
        this.get_max = this.get_max.bind(this);
        this.get_min = this.get_min.bind(this);
        this.make_x_gridlines = this.make_x_gridlines.bind(this);
        this.make_y_gridlines = this.make_y_gridlines.bind(this);
        this.draw = this.draw.bind(this);
        this.get_canvas = this.get_canvas.bind(this);
        this.draw_bar = this.draw_bar.bind(this);
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

      make_x_gridlines(x, tickNum) {
        return d3.axisBottom(x)
          .ticks(tickNum)
      }
    
      make_y_gridlines(y, tickNum) {
        return d3.axisLeft(y)
          .ticks(tickNum)
      }


    draw_bar(selection,x,y,barName){
        selection.append('g')
        .selectAll('g')
        .data(this.props.data)
        .join('rect')
        .attr('x',(d,i)=>{return x(new Date(d.Date))})
        .attr('y',(d,i)=>{return y(d.Base)})
        .attr('stroke-width',1.5)
        .attr("dy", ".71em")
        .attr("height", d => this.props.height- y(d[barName]))
        .attr("width", (this.props.width/this.props.data.length)/10)
    }


    componentDidMount() {
        console.log(this.props.data);
        this.draw();
      }
    
      get_canvas() {
        let h = this.props.height + (this.props.margin * 2);
        let w = this.props.width + (this.props.margin * 2);
        let tickNum = Math.ceil(Math.sqrt(this.props.data.length));
        let adjStartDate = new Date(this.props.startDate)
        adjStartDate.setDate(adjStartDate.getDate()-1)
        console.log(adjStartDate)
        let x = d3.scaleTime()
          .domain([adjStartDate, new Date(this.props.endDate)])
          .range([0, this.props.width]);
    
        let y = d3.scaleLinear()
          .domain([this.get_min(), this.get_max()])
          .range([this.props.height, this.props.margin/2]);
    
        const svg = d3.select(this.myRef.current)
          .append('svg')
          .attr('width', w)
          .attr('height', h);
    
    
        svg
          .append('g')
          .attr('id','canvas')
          .append('rect')
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


    draw(){
        let get_canvas = this.get_canvas();
        let svg = get_canvas.svg;
        let x = get_canvas.x;
        let y = get_canvas.y;
        this.props.dataColor.forEach(
            (element,i)=>{
                this.draw_bar(svg,x,y,element.name);
            }
        );
    }

    render(){
        return(
            <div ref={this.myRef}></div>
        )
    }
}


export default Bar_Chart;