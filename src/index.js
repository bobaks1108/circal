import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as d3 from "d3";



const PADDING = 10
const HOURS = ['Jan', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
//const BG_COLOR = '#123';
const COLOR = '#fff';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const theYear = 2019;


function daysInMonth(iMonth, iYear)
{
  return 32 - new Date(iYear, iMonth, 32).getDate();
}

function noDaysInYear(iYear) 
{
  return isLeapYear(iYear) ? 366 : 365;
}

function isLeapYear(iYear) {
     return iYear % 400 === 0 || (iYear % 100 !== 0 && iYear % 4 === 0);
}

function dateFromDay(year, day){
  var date = new Date(year, 0); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}

function dayOfMonthFromDay(year, day){
  var theDate = dateFromDay(year, day)
  //console.log(theDate.getUTCDate())
  return theDate.getDate()
}

function calcIfRotate(angle) {
  const HALF_CIRCLE_PI_FACTOR = Math.PI/180
  if (angle > 90 * HALF_CIRCLE_PI_FACTOR && angle < 270 * HALF_CIRCLE_PI_FACTOR) {
    return true
  } else {
    return false
  }
}

class ClockControl extends React.Component {
	
	componentDidMount() {
    console.log("v1.2")
    this.drawDonut()
    this.drawFrame()	
  	this.drawDays()
    this.drawHands()
    this.updateTime()

  }
  
  drawFrame() {

		const center = this.props.size / 2
    const addCircle = (radius, border, color) => 
      this.svg.append('circle')
			  .attr('cx', center)
			  .attr('cy', center)
			  .attr('r', radius)
			  .style('stroke', border)
			  .style('fill', color)

		const radius = center - PADDING
		addCircle(radius + 2, COLOR, 'none')
		addCircle(radius, COLOR, 'none')
		addCircle(radius * 0.075, 'none', COLOR)
  }
  
  drawDigits() {
		const center = this.props.size / 2
		const radius = center - PADDING
    
    const fontSize = `${Math.floor(radius / 8)}px`
		const drawHourDigit = (v, i) => {
      const transformG = `rotate(${(i+1) * 30},${center},${center})`
      const transformT = `scale(1,3) translate(${center}, ${center - radius * 0.92})`
    	const g = this.svg.append('g')
				.attr('transform', transformG)
    	g.append('text').text(v)
				.attr('text-anchor', 'middle')
        .attr('transform', transformT)
        .style('fill', COLOR)
        .style('font-size', fontSize)
    } 
		HOURS.forEach(drawHourDigit)	
  }

  drawMonths() {
		const center = this.props.size / 2
		const radius = center - PADDING
    
		const drawHourDigit = (v, i) => {
      const transformG = `rotate(${((i+1) * 30 - 15)},${center},${center})`
      const transformT = `scale(1,1) translate(${center}, ${center - radius * 0.92})`
    	const g = this.svg.append('g')
				.attr('transform', transformG)
    	g.append('text').text(v)
				.attr('text-anchor', 'top')
        .attr('transform', transformT)
        .style('fill', COLOR)
    } 
		MONTHS.forEach(drawHourDigit)	
  }

  drawDonut() {
    const center = this.props.size / 2
		const radius = center - PADDING

    const screenWidth = window.innerWidth;

    const margin = {left: 20, top: 20, right: 20, bottom: 20},

      width = Math.min(screenWidth, 500) - margin.left - margin.right,
      height = Math.min(screenWidth, 500) - margin.top - margin.bottom;

      console.log(width)
      console.log(height)
          
     const g = this.svg
           .append("g").attr("class", "wrapper")
           .attr("transform", "translate(" + (center) + "," + (center) + ")");


    //Some random data
    const donutData = [
      {name: "Jan", 	value: daysInMonth(0,theYear)},
      {name: "Feb",   value: daysInMonth(1,theYear)},
      {name: "Mar", 	value: daysInMonth(2,theYear)},
      {name: "Apr", 	value: daysInMonth(3,theYear)},
      {name: "May",	  value: daysInMonth(4,theYear)},
      {name: "Jun", 	value: daysInMonth(5,theYear)},
      {name: "Jul",   value: daysInMonth(6,theYear)},
      {name: "Aug", 	value: daysInMonth(7,theYear)},
      {name: "Sept", 	value: daysInMonth(8,theYear)},
      {name: "Oct", 	value: daysInMonth(9,theYear)},
      {name: "Nov", 	value: daysInMonth(10,theYear)},
      {name: "Dec", 	value: daysInMonth(11,theYear)}
    ];

    // console.log("================================")
    // console.log(donutData)
    
    //Create a color scale
    // const colorScale = d3.scale.linear()
    //     .domain([1,3.5,6])
    //     .range(["#2c7bb6", "#ffffbf", "#d7191c"])
    //     .interpolate(d3.interpolateHcl);
    
    //Create an arc function   
    const arc = d3.arc()
      .innerRadius(radius-20) 
      .outerRadius(radius-10);
    
    //Turn the pie chart 90 degrees counter clockwise, so it starts at the left	
    const pie = d3.pie()
      .startAngle(0)
      .endAngle(-2*Math.PI)
      .value(function(d) { return d.value; })
      .padAngle(.001)
      .sort(null);

    // var enterAntiClockwise = {
    //   startAngle: Math.PI * 1.8,
    //   endAngle: Math.PI * -.2
    // };

    let invisibleArcs = [];
    let monthNumber = 0 

      //Create the donut slices and also the invisible arcs for the text 
    g.selectAll(".donutArcs")
    .data(pie(donutData))
    .enter().append("path")
    .attr("class", "donutArcs")
    .attr("d", arc)
    .attr("id", function(d,i) {
      return "DA"+i; 
    })
    .style("fill", function(d,i) {
      if(i === 7) return "#CCCCCC"; //Other
      else return "#dddddd"; 
    })
    .each(function(d,i) {
      //Search pattern for everything between the start and the first capital L
      let firstArcSection = /(^.+?)L/; 

      console.log(donutData[monthNumber].name)
      monthNumber++
      
      // console.log("d ~~~~~~~~~~~~~~~~~~~~~~~~~~~#")
      // console.log(d3.select(this).attr("d"))

      //Grab everything up to the first Line statement
      let newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];

      //Replace all the comma's so that IE can handle it
      newArc = newArc.replace(/,/g , " ");
      
      //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
      //flip the end and start position
      // console.log("new arc =============")
      // console.log(newArc)

      console.log("d.endAngle")
      console.log(d.endAngle)

      if (calcIfRotate(d.endAngle)) {
        console.log("Rotate")

        let startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
          middleLoc 	= /A(.*?)0 0 1/,	//Everything between the first capital A and 0 0 1
          endLoc 		= /0 0 1 (.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
        //Flip the direction of the arc by switching the start en end point (and sweep flag)
        //of those elements that are below the horizontal line
        let newStart = endLoc.exec( newArc )[1];
        let newEnd = startLoc.exec( newArc )[1];
        let middleSec = middleLoc.exec( newArc )[1];
        
        //Build up the new arc notation, set the sweep-flag to 0
        newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
      } //if
      
            //Create a new invisible arc that the text can flow along

      invisibleArcs.push(newArc)

      // this.svg.append("path")
      //   .attr("class", "hiddenDonutArcs")
      //   .attr("id", "donutArc"+i)
      //   .attr("d", newArc)
      //   .style("fill", "none");

    });      
  

    //invisibleArcs.each(function(d,i) {console.log(i)});

    for (var i = 0; i < invisibleArcs.length; i++) {
      g.append("path")
        .attr("class", "hiddenDonutArcs")
        .attr("id", "donutArc"+i)
        .attr("d", invisibleArcs[i])
        .style('stroke', "#ff00ff")
        .style('stroke-width', 3)
        .style("fill", "none");
    }

  
      
    //Append the label names on the outside
    g.selectAll(".donutText")
      .data(pie(donutData))
      .enter().append("text")
      .attr("class", "monthtext")
      //Move the labels below the arcs for those slices with an end angle greater than 90 degrees
      .attr("dy", function(d,i) { return (calcIfRotate(d.endAngle) ? -16 : -20); })
      .append("textPath")
      .attr("startOffset","50%")
      .style("text-anchor","middle")
      .style('fill', COLOR)
      .attr("xlink:href",function(d,i){return "#donutArc"+i;})
      .text(function(d){return d.data.name;});
  }

  
  drawDays() {
		const center = this.props.size / 2
		const radius = center - PADDING
  	const y1 = center - Math.floor(radius * 0.97)
    const y2 = center - Math.floor(radius * 0.95)
    let isFirstDayOfMonth=false;
		for(let day = 1; day <= noDaysInYear(theYear); day++) {

      const degreesToRotate = (360 / noDaysInYear(theYear)) * day-1
      const transform = `rotate(${degreesToRotate},${center},${center})`
      let theDate = dateFromDay(theYear, day)
      if (dayOfMonthFromDay(theYear, day)===1) {
        isFirstDayOfMonth=true;
      } else {
        isFirstDayOfMonth=false;
      }
      this.svg.append('line')
				.attr('x1', center)
				.attr('y1', y1)
				.attr('x2', center)
        .attr('y2', y2)
        .attr('id', theDate)
				.attr('transform', transform)
        .style('stroke', isFirstDayOfMonth ?  "#f00" : COLOR)
        .style('stroke-width', isFirstDayOfMonth ?  2 : 1)
    }
  }

  drawMarks() {
		const center = this.props.size / 2
		const radius = center - PADDING
  	const y1 = center - Math.floor(radius * 0.97)
  	const y2 = center - Math.floor(radius * 0.92)
		for(let mark = 0; mark < 365; mark++) {
			const transform = `rotate(${mark},${center},${center})`
      const isHourMark = (mark % 5) === 0
      this.svg.append('line')
				.attr('x1', center)
				.attr('y1', y1)
				.attr('x2', center)
				.attr('y2', y2)
				.attr('transform', transform)
				.style('stroke', COLOR)
        .style('stroke-width', isHourMark ?  3 : 1)
    }
  }
  
  drawHands() {
		const center = this.props.size / 2
    const drawHand = (type, width, length) => 
      this.svg.append('line')
    		.attr('hand-type', type)
      	.attr('x1', center)
      	.attr('y1', center)
      	.attr('x2', center)
      	.attr('y2', center - length)
      	.style('stroke', COLOR)
      	.style('stroke-width', width)
    
		const radius = center - PADDING
    drawHand('H', 5, radius * 0.5)
    drawHand('M', 3, radius * 0.7)
    drawHand('S', 2, radius * 0.9)
  }
  
  
  
  moveHand(type, angle) {
		const center = this.props.size / 2
    const transform = `rotate(${angle},${center},${center})`
    this.svg.select(`line[hand-type='${type}']`)
    	.attr('transform', transform)
  }
	
	componentDidUpdate() {
    this.updateTime()
  }
  
  updateTime() {
    const dt = new Date(this.props.time)
    const hourAngle = dt.getHours() * 30 + 
    	Math.floor(dt.getMinutes() / 12) * 6  
    this.moveHand('H', hourAngle)
    this.moveHand('M', dt.getMinutes() * 6)
    this.moveHand('S', dt.getSeconds() * 6)
  }
  
  render() {
    return (
      <svg width={this.props.size} height={this.props.size} 
        ref={handle => (this.svg = d3.select(handle))}>
      </svg>
    )
  }
}


class ClockApp extends React.Component {
  constructor(props) {
    super(props)
		this.state = {time: Date.now()}
  }
  
  componentDidMount() {
  	setInterval(() => {
    	this.setState({time: Date.now()})
    }, 1000)
  }
	
	render() {
    return (
      <div>
        <ClockControl size='600' time={this.state.time}/>
      </div>
    )
	}
}

ReactDOM.render(<ClockApp/>, document.querySelector("#app"))


/* To do
variable / implement anti clock
show weeks
create a variable to start at 12 oclock 0 degress etc.. 
rotate months if upside down
indent start of weeks 
start year at right point of week
add months arcs different colours / average temperature colour behind days
add clock hand
date text
resize centre clock
resize whole thing
implement settings (start pos, Locale)
add ability to add events
*/
