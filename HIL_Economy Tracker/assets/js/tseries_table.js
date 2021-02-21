///////////////////////////////
		// Set the dimensions of the canvas / graph
		 var table;
var	margin = {top: 10, right: 10, bottom: 20, left: 18} 
	
// Parse the date / time
mapwidth = $("#line_series_div").width();
mapheight =200;
 width = mapwidth - margin.left - margin.right,
	height = 240 - margin.top - margin.bottom;
// Set the ranges
var	x_line = d3.scaleTime().range([margin.left, width]);
var	y_line = d3.scaleLinear().range([height, margin.top]);
 
// Define the axes
var	xAxis = d3.axisBottom(x_line)
	 .ticks(5)
	 .tickFormat(d3.timeFormat("%b-%y"))
	 ;
 
var	yAxis = d3.axisLeft(y_line)
	 .ticks(5)
	 .tickFormat(d3.format(".2s"))
	 ;
 
// Define the line
var	valueline = d3.line()
	.x(function(d) 
	{ return x_line(d.period); })
	.y(function(d) 
	{ return y_line(d.data); });
// define the area
var area = d3.area()
    .x(function(d) { return x_line(d.period); })
    .y0(height)
    .y1(function(d) { return y_line(d.data); }); 
 	
var lineChunked = d3.lineChunked()
  .x(function(d) 
	{ return x_line(d.period); })
	.y(function(d) 
	{ return y_line(d.data); }) 
  .curve(d3.curveLinear)
  .defined(function (d) { return d.data != null; })
  .lineStyles({
    stroke: '#0bb',
  });
 
	
var data_line;


var key_dates = [  
{"kdate":"24-03-2020","text":"Nationwide Lockdown"},
{"kdate":"08-06-2020","text":"Domestic travel ban lifted"},


]

	
	function drawlinechart(json)
	
	{
   
// Adds the svg canvas


d3.select("#line_series_div").append("svg").attr("id","line-chart-1")
//.attr("class","Path_220")
.attr("width", width+margin.left+margin.bottom) //changed for responsive
.attr("height", height+margin.top+margin.bottom) //changed for responsive
 .append("g").attr("class","svg_g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


var	svg2 = d3.select("#line-chart-1").select("g.svg_g")
	 
	data_line = json.data
	
	 
	
	data_line.forEach(function(d) {
		d.period = parseDate(d.enddate);
		d.data = +d["data"];
	});
 
	key_dates.forEach(function(d) {
		d.kdate = parseDate(d.kdate);
		 
	});
 
    data_line.sort(function(a, b) {
            return a.period - b.period;
        });
 
var bisectDate = d3.bisector(function(d) 

{ return d.period; }).left

 
 
 
	// Scale the range of the data
	x_line.domain(d3.extent(data_line, function(d) { return d.period; }));
	y_line.domain([0, d3.max(data_line, function(d) { return d.data; })]);
 
	// Add the area.
	svg2.append("path")	
		.attr("class", "area")
		.attr("d", area(data_line));
 
	// Add the key_dates.
	svg2.selectAll(".keyline")
      .data(key_dates)
	.enter().append("line")
			.attr("class","keyline")
            .attr("x1", function(d)
			{return x_line(d.kdate)})     // x position of the first end of the  
    .attr("y1", function(d,i){return (i+1)*15})      // y position of the first end of the line
    .attr("x2", function(d)
			{return x_line(d.kdate)})     // x position of the second end of the line
    .attr("y2", 150) 
    .style("stroke", "lightgray")
	.style("stroke-dasharray", ("3, 3"))
	;
			 
	svg2.selectAll(".keylinetext")
      .data(key_dates)
	.enter().append("text")
	.attr("class","keylinetext")
	.attr("x", function(d)
			{return x_line(d.kdate)})     // x position of the first end of the  
    .attr("y", function(d,i){return (i+1)*15-2})      // y position of the first end of the line
	.text(function(d){return parseDate2(d.kdate)+" "+d.text})
 
	
	
	// Add the valueline path.
	svg2
  .append('g').attr("class", "lineChunked")
    .datum(data_line)
    .transition()
    .duration(1000)
    .call(lineChunked);	
 
	// Add the X Axis
	svg2.append("g")		
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
 
	// Add the Y Axis
	svg2.append("g")		
		.attr("class", "y axis")
		.attr("transform", "translate("+margin.left+", +0)")
		.call(yAxis);
		
		 // text label for the y axis
  svg2.append("text")
      
      .attr("y", margin.top)
      .attr("x",margin.left)
      .attr("id", "yaxis_label")
      .attr("dy", "-0.5em")
      .attr("dx", "0.5em")
      .style("text-anchor", "middle")
      .text("(Metric tonne)")
	  ;      

 
  var focus = svg2.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 5);

        focus.append("rect")
            .attr("class", "tooltip-line-chart")
            .attr("width", 150)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-date")
            .attr("x", 18)
            .attr("y", -2);

        focus.append("text")
            .attr("x", 18)
            .attr("y", 18)
            .text("");

        focus.append("text")
            .attr("class", "tooltip-likes")
            .attr("x", 18)
            .attr("y", 18);

        svg2.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

  
		function mousemove() {
            var x0 = x_line.invert(d3.mouse(this)[0]),
                i = bisectDate(data_line, x0, 1),
                d0 = data_line[i - 1],
                d1 = data_line[i],
                d = x0 - d0.period > d1.period - x0 ? d1 : d0;
			focus.attr("transform", "translate(" + x_line(d.period) + "," + y_line(d.data) + ")");
			
			if ((x_line(d.period)+ 150) <width)
            {
				 focus.select("rect.tooltip-line-chart")
             .transition().duration(100)
            .attr("x", 10)
            .attr("y", -22)
            
			
			 focus.select(".tooltip-date").transition().duration(100)
            .attr("x", 18)
            .attr("y", -2);
                

        focus.select(".tooltip-likes").transition().duration(100)
            .attr("x", 18)
            .attr("y", 18);
				
				
			}
		
			else
			{
				var wx = x_line(d.period)+ 150 - width 
				wx= x_line(d.period)-wx 
				 focus.select("rect.tooltip-line-chart")
             .transition().duration(100)
            .attr("x",-170)
            
				
			 focus.select(".tooltip-date").transition().duration(100)
            .attr("x", -162)
           

        focus.select(".tooltip-likes").transition().duration(100)
            .attr("x", -162)
         
			}
            focus.select(".tooltip-date").text(parseDate2(d.period));
            focus.select(".tooltip-likes").text(d3.format(",")(d.data)+" "+unit_selected);
        }
	
	}

function updatelinechart(json) {
	 // Create the X axis:

 data_line=json.data;

	data_line.forEach(function(d) {
		d.period = parseDate(d.enddate);
		if (d.data)
		{d.data = +d["data"];}
	}); 
	
	data_line=data_line.sort(function(a,b){ return a.period-b.period});
	
x_line.domain(d3.extent(data_line, function(d) { return d.period; }));
//y_line.domain([0, d3.max(data_line, function(d) { return d.data; })]);
extent_domain=d3.extent(data_line, function(d) { if (d.data){return d.data;} })
if (extent_domain[0]<0)
{y_line.domain(extent_domain);}
else
{y_line.domain([0,extent_domain[1]]);}


  d3.selectAll("#line-chart-1 .x.axis").transition()
    .duration(3000)
    .call(xAxis);

  // create the Y axis
  
  d3.selectAll("#line-chart-1 .y.axis")
    .transition()
    .duration(3000)
    .call(yAxis);

  
d3.select("#line-chart-1 .line").transition().attr("d", valueline(data_line))
d3.select("#line-chart-1 .area").transition().attr("d", area(data_line))
d3.select("#line-chart-1 .lineChunked").datum(data_line)
    .transition()
    .duration(1000)
    .call(lineChunked);
	
if (key_dates[0].kdate>x_line.domain()[0])
{
	d3.selectAll(".keyline").data(key_dates).transition()
	.attr("x1", function(d)
			{return x_line(d.kdate)})     // x position of the first end of the  
    .attr("y1", function(d,i){return (i+1)*15})      // y position of the first end of the line
    .attr("x2", function(d)
			{return x_line(d.kdate)})     // x position of the second end of the line
    .attr("y2", 150) 	

d3.selectAll(".keylinetext").data(key_dates).transition()
.attr("x", function(d)
			{return x_line(d.kdate)})     // x position of the first end of the  
    .attr("y", function(d,i){return (i+1)*15-2})  


	d3.selectAll(".keyline").style("display","block");
	d3.selectAll(".keylinetext").style("display","block");
	}
else
{
	d3.selectAll(".keyline").style("display","none");
	d3.selectAll(".keylinetext").style("display","none");
}

 
 

}
 ///////////////////////////////TABLE////////////////////////////////////
 
/* var tables_indicators=

{
	"fertiliser_sales":
						{"columns":["date","data"], */
							
 

 function addTable(json)
	
	{
 

data11 = json.data
	
	 
	
	data11.forEach(function(d) {
		d.period = parseDate(d.enddate);
		if (d.data)
		{d.data = +d["data"];}
		d.data = d3.format(",")(d.data);
	});
$.fn.DataTable.ext.pager.numbers_length = 4;

table = $('#data_table').DataTable( {
			data: data11,
			 
			columns: [
				 
				  
				
				{ data: "enddate"  },
				{ data: "geography"  },
				{ data: "data"}
				
				] ,
				"dom": 'Bfrtip',
        "buttons": [//https://datatables.net/reference/button/collection
      {
        extend: 'csv',
        autoClose: 'true',
        text: '',
        tag: 'span',
        className: 'fa fa-download',
        exportOptions: {
        modifier: {
        	page: 'all'
        }
        }
	  }
        ],
				 "scrollY": "200px",
				 
				"order": [[ 2, "desc" ]],
				 initComplete: function() {
       	 var $buttons = $('.dt-buttons').hide();
         $('#exportLink').on('click', function() {
        
			btnClass=".buttons-csv"
				
            if (btnClass) $buttons.find(btnClass).click(); 
         })
       } 
        
				
				


	})
	
	$("#searchbox").keyup(function() {
   table.search(this.value).draw();
});
 //*[@id="data_table_filter"]/label/text()
var trex= ($("div#data_table_filter label").children())
$("div#data_table_filter label").text("");	
$("div#data_table_filter label").append(trex[0]);	
$(".dataTables_filter input").attr("placeholder", "Search");


	
	}
	
	function updateTable(json)
 		
{

//India
	
	datat=json.data;
	
	
	datat.forEach(function(d) {
		d.period = parseDate(d.enddate);
		if (d.data)
		{d.data = +d["data"];}
	});
	table.clear();
	table.rows.add(datat).draw();
	
}

