var ringNote = d3.ringNote()
	  .draggable(false); 
	  var week=1, date_i=1;
	 
	var annotations = [
	  
	   /* {
		"cx": 215,
		"cy": 164,
		"r": 1,
		"text": "South-Delhi*",
		"district_cd": "098",
		"classname":"ncr",
		"textWidth": 10,
		"textOffset": [
		  -35,
		  -25
		]
	  }, */
	  {
		"cx": 152,
		"cy": 314,
		"r": 1,
		"text": "Mumbai",
		"district_cd": "519",
		"classname":"mum",
		"textWidth": 10,
		"textOffset": [
		  -55,
		  10
		]
	  } ,
			{
		"cx": 260,
		"cy": 403,
		"r": 1,
		"text": "Chennai",
		"district_cd": "603",
		"classname":"chn",
		"textWidth": 25,
		"textOffset": [
		  50,
		  0
		]
	  },
		/*	{
		"cx": 86,
		"cy": 258,
		"r": 1,
		"text": "Kasargod*",
		"district_cd": "588",
		"classname":"chn",
		"textWidth": 10,
		"textOffset": [
		  35,
		  -25
		]
	  },*/
	  {"cx": 234.8,
		"cy":338.8691225,
		"r": 1,
		"text": "Hyderabad",
		"district_cd": "536",
		"classname":"ncr",
		"textWidth": 10,
		"textOffset": [
		  35,
		  -5
		]
	  },/*
	  {
		"cx": 91.52,
		"cy": 173.54,
		"r": 1,
		"text": "Indore",
		"district_cd": "439",
		"classname":"mum",
		"textWidth": 10,
		"textOffset": [
		  -40,
		  20
		]
	  } ,*/
			{
		"cx": 170.6,
		"cy": 320.9,
		"r": 1,
		"text": "Pune",
		"district_cd": "521",
		"classname":"chn",
		"textWidth": 10,
		"textOffset": [
		  5,
		  5
		]
	  },
			{
		"cx":194.5284535,
		"cy":188.7180375,
		"r": 1,
		"text": "Jaipur",
		"district_cd": "110",
		"classname":"chn",
		"textWidth": 10,
		"textOffset": [
		  -55,
		  0
		]
	  }, 
   {
		"cx":144.2192504,
		"cy":255.6677982,
		"r": 1,
		"text": "Ahmedabad",
		"district_cd": "474",
		"classname":"chn",
		"textWidth": 10,
		"textOffset": [
		  -15,
		  10
		]
	  }, /* 

	  {
		"cx": 72.25,
		"cy": 201.75,
		"r": 1,
		"text": "Thane*",
		"district_cd": "517",
		"classname":"chn",
		"textWidth": 10,
		"textOffset": [
		  15,
		  10
		]
	  } 
	   ,{
		"cx": 104.21,
		"cy": 167.07,
		"r": 1,
		"text": "Bhopal*",
		"district_cd": "444",
		"classname":"chn",
		"textWidth": 10,
		"textOffset": [
		  -65,
		  25
		]
	  }, */
	  	  {
		"cx": 215.218737,
		"cy": 162.5265782,
		"r": 1,
		"text": "New Delhi",
		"district_cd": "94",
		"classname":"chn",
		"textWidth": 10,
		"textOffset": [
		  50,
		  -25
		]
	  } 
	  
	];
	
	/////////////////////////////



var	parseDate = d3.timeParse("%d-%m-%Y"); 
var	parseDate2 = d3.timeFormat("%d-%b-%Y"); 
var	parseDate3 = d3.timeFormat("%b-%Y"); 

var	parseDate_rev = d3.timeFormat("%d-%m-%Y"); 
var json,latestdate, data_centroids,data_dist,json2;
var qtyById,qtyById2,data1;

var data_geo_ids,res; 

var colors=['#ffffcc','#a1dab4','#41b6c4','#225ea8'];	
 
colorscale3=d3.scaleQuantile().range(colors);//taken from colorbrewer2.org

var switch_val ="on"	   
mapwidth=600;
mapheight=450;

var projection=d3.geoMercator()
        .scale(600)
         .center([83,26])
        .translate([mapwidth/2,mapheight/2.2])
        .precision(.1)

var path = d3.geoPath()
    .projection(projection);

///////////////////////////////////////////////
var svg = d3.select("#perfmap")




queue()
    .defer(d3.json, "assets/json/india.json")
    .defer(d3.csv, "assets/data/data.csv")
    .defer(d3.csv, "assets/data/geography_ids.csv")
    .defer(d3.csv, "assets/data/state_centroids.csv")
	 
    .await(drawall)

  function drawall(error,areas2011,datad,data_geo,datac){
	  

data_centroids = datac;
data_dist=datad;
data_geo_ids = data_geo;
var projection=d3.geoMercator()
        .scale(790)
         .center([83,26])
        .translate([mapwidth/2,mapheight/2.5])
        .precision(.1)

var path = d3.geoPath()
    .projection(projection);






//////////////////////
 
	var districts =[];
mapdata = topojson.feature(areas2011, areas2011.objects.dist).features;	
 
var svg = d3.select("#perfmap").append("svg")
   .attr("viewBox","0 0 "+mapwidth+" "+mapheight)//changed for responsive
  .attr("preserveAspectRatio","xMidYMid meet")//changed for responsive
  .attr("class","svg-content")//to be changed for responsive
    //.append("g") 
 
 var g = svg.append("g").attr("class","main_grp");
 
 
	//svg.append("g")
     // .attr("class", "land")
    g.selectAll("path")
      .data( mapdata)
    .enter().append("path")
 .attr("class",function(d){return "state dist_"+(+d.properties.censuscode)})
  .attr("d", path)
  .on("mouseover", function(d) {
                d3.selectAll(".state").classed("highlight", 0).moveToBack();
                d3.select(this).classed("highlight", !0).moveToFront();
                displaytooltip(d.properties);
                
            })
            .on("mouseout", function(d) {
                d3.selectAll(".map-tooltip").style("opacity", 0);
				d3.selectAll(".state").classed("highlight", 0).moveToBack();
            })
			.on("click",function(d)
			{
				district_change(d.properties);
			})


 g.selectAll("bubble")
		.data(mapdata)
	  .enter().append("circle")
		.attr("transform", function(d) { 
		
		 
		  //console.log(d.properties.censuscode + "*"+((path.centroid(d)) [0]) + "*"+((path.centroid(d)) [1])) 	 
		return "translate(" + path.centroid(d) + ")"; })
		.attr("r", 0)
		
		
	g.selectAll("districttext")
		.data(mapdata)
	  .enter().append("text")
	  .attr("class",function(d){return "districttext d_"+d.properties.stname})
	  
		.text(function(d)
		{ return d.properties.DISTRICT
		}).attr("transform", function(d) { 
		
		 
		  //console.log(d.properties.censuscode + "*"+((path.centroid(d)) [0]) + "*"+((path.centroid(d)) [1])) 	 
		return "translate(" + path.centroid(d) + ")"; })
		
		/* .attr("fill","red")
		.style("fill-opacity",0.2)
		.style("opacity",0)
		.style("stroke","red")
		.style("stroke-width","0.5")
		; */
 /* annotations.forEach(function(d,i)
	 {

d.cx = top10[i].properties.cx
d.cy = top10[i].properties.cy
/*d.text = top10[i].properties.DISTRICT +"*"+ parseInt((top10[i].properties.growthrate2)*100)+"%" 


		 
	 })	 */	
	 
	 //g.append("g")
	//.attr("class", "annotations")
	//.call(ringNote, annotations)
	 
  
 
 
d3.select("#perfmap").select("svg").append("g").attr("class","legend").attr("id","legend2").attr("transform","translate("+(mapwidth-300)+","+(80)+")")

 

legend2=d3.select("#perfmap").select("g.legend").selectAll(".groups").data(colors)

d3.select("#legend2").append("text").text("Actual").attr("y",-3).attr("id","legendhead");



d3.select("#legend2").append("text").text("("+unit_selected+")").attr("y",-3).attr("id","legendhead_units").attr("x",30);

legend2.enter().append("g").attr("class","groups").attr("transform",function(d,i){return "translate("+(i*50)+",0)"}).append("rect").attr("width",48)
                      .attr("height",10).attr("class","legendrect")
					  .attr("fill",function(d){return d})
					  //.on("click",  colormap3)            
d3.select("#legend2").selectAll("g.groups").append("text")
//.style("font-size","120%")
.attr("dy","2em")

d3.selectAll(".legendrect").data(colorscale3.range())

d3.selectAll(".legendrect").transition()
					  .attr("fill",function(d)
					  {return d})

  }

var data_ajax= { "geographyid": "",
					"aspectid": 10170,
					"level":"1",
					"date":""  }


var data_ajax1= { "geographyid": "",
					"aspectid": 10170,
					"level":"2",
					"date":""  }


var data_ajax2= { "geographyid": "",
					"aspectid": 10170,
					"level":"3.1",
					"date":""  }
getdata();
//getdata2();

	
function getdata()
{
 
		  if($("#line-chart-1 .area"). length)
		  {
				  data_trail="";
				  res = data_aspect.filter(function(d)
									{
										 
										return d.sector == sector_selected 
									     && d.indicator == indicator_selected
										 }
										 
										 
										 )
					
					if (res.length>1 && option_selected.length >0 )
					{
						
						 
						res = res.filter(function(d)
									{return d.subcategory == option_selected}) 
						
					}
					
					if (res.length>1 && subcat_selected.length >0 )
					{    
						res = res.filter(function(d)
									{return d.subcategory2 == subcat_selected}) 
						
					}
					
					if (res.length>1 && subcat3_selected.length >0 )
					{
						 
						res = res.filter(function(d)
									{return d.subcategory3 == subcat3_selected}) 
						
					}
					
					explanation_selected=res[0].explanation
					unit_selected=res[0].unit
				res= res[0].aspectid
				
				
					///
					d3.select("#explanation_text").text(explanation_selected)

					///
				
				
				data_ajax= { "geographyid": "",
					"aspectid": res,
					"level":"1",
					"date":""  }
				
				data_ajax1= { "geographyid": "",
					"aspectid": res,
					"level":"2",
					"date":""  }
					
				data_ajax2= { "geographyid": "",
					"aspectid": res,
					"level":"3.1",
					"date":""  }
					
					
					
		  }			  
		else {res=10170
		
		}

$.ajax({
        url: "https://howindialives.com/economy-tracker/api.php",
        data: data_ajax,
        type: "POST",
        dataType: "json",
        success : function(json){
          
		  json=json;


		  uniquedates=[];
dates = (json.data).map(function(d) 
      {return parseDate(d.enddate)})
$.each(dates, function(i, el){
    
	if($.inArray(el, uniquedates) === -1) uniquedates.push(el);
	
	
})

uniquedates=uniquedates.sort(function(a,b){ return a-b});

d3.select("#date_select").selectAll("option").remove();

uniquedates.forEach(function(d,i)
{
	d3.select("#date_select").append("option")
							.attr("value",parseDate_rev(d)	)
							.text(parseDate3(d))
							.attr("selected",function()
							{
								if(i == uniquedates.length-(date_i)){return "selected"}}
							
							)
								
})

var latestdate = uniquedates[uniquedates.length -(date_i)]
	callbackfn(parseDate_rev(latestdate)	  )

		  
		  if($("#line-chart-1 .area"). length)
		  {
			updatelinechart(json);
		  //updateTable(json);  
		  }
		  
		  else
		  {
		  drawlinechart(json);
		  //addTable(json);
		  }
		  

  
        }
    }) 


 function getdata2()
{
	
	res_1 = data_aspect.filter(function(d)
									{
										 
										return d.sector == sector_selected 
									     && d.indicator == indicator_selected
										 }
										 
										 
										 )
					
					if (res_1.length>1 && option_selected.length >0 )
					{
						
						 
						res_1 = res_1.filter(function(d)
									{return d.subcategory == option_selected}) 
						
					}
					
					if (res_1.length>1 && subcat_selected.length >0 )
					{    
						res_1 = res_1.filter(function(d)
									{return d.subcategory2 == subcat_selected}) 
						
					}
					
					if (res_1.length>1 && subcat3_selected.length >0 )
					{
						 
						res_1 = res_1.filter(function(d)
									{return d.subcategory3 == subcat3_selected}) 
						
					}
					
	
	
  
    }

                  d3.select(".data-trail").select("text").remove();
				d3.select(".data-trail").append("text").text(data_trail);

}

function callbackfn(date)
{

 

latestdate =date;
	
 data_ajax2.date =  latestdate
 
 $.ajax({
        url: "https://howindialives.com/economy-tracker/api.php",
          data: data_ajax2,
        type: "POST",
        dataType: "json",
        success : function(json2){
          
		  
		  
		  colormap(json2);
		  
			  if ( ! $.fn.DataTable.isDataTable( '#data_table' ) )
				  {
	   
				addTable(json2); 
			  
			  }
			  
			  else
			  {
			  updateTable(json2);  
			   
			  }
        }
    });
}


 function colormap(json2) 
 
 {
	
qtyById ={};
qtyById2 ={};

json2=json2;



data1= (json2.data);
data_district_level= (json2.data);

switch_val= $(".switch_div .active").val();

  
if (switch_val =="off")
{
data1_domain = data1.map(function(d)

{if (d.change)
	return +d.change
	
	}
)



}
else
{
	
	data1_domain = data1.map(function(d)
	
	{
		d.data = (d.data) .toString();
		d.data= (d.data).replace(",","");
		if (d.data)
		{return +d.data}
	
	}
	)
	 
	
	}

data1.forEach(function(d)
{
		qtyById2[d.district] = +d.data;
								 
									if (d.change)
									{									
									qtyById[d.district] = +d.change;
									 
									
									}
									else
									{
									qtyById[d.district] = "";	
									
									}
									 
									 
})




data1_domain= data1_domain.sort(function(a,b){ return a-b});	 

colorscale3.domain(data1_domain);



	 d3.select("#perfmap").selectAll(".state").transition().attr("fill",function(d)
{
if (d.properties["censuscode"]!=undefined){
	
	                                    if (switch_val =="off")
											
											{
                                           if (qtyById[+d.properties.censuscode])
										   { return colorscale3(qtyById[+d.properties.censuscode])}
									   else
									  // {return "#F0F0F0"}
									   {return "lightgrey"}
												
												} 

									else
										{
                                           if (qtyById2[+d.properties.censuscode])
										   { return colorscale3(qtyById2[+d.properties.censuscode])}
									   else
									  // {return "#F0F0F0"}
									   {return "lightgrey"}
												
												}

}												



	
   })
	 
	legendtext=colorscale3.range().map(function(k,i){
 thisentry=colorscale3.invertExtent(k)
 {
	 if (thisentry[0])
		{	
			if (+thisentry[0]<10000)
			{return (thisentry[0]).toFixed(1)}
			else
			{return d3.format(".3s")(thisentry[0])}
		}
	else {return 0;}
 }
  
  })

if (unit_selected.length>0 && switch_val =="on")
{d3.select("#legendhead_units").transition()
.text("("+unit_selected+")");
d3.select("#yaxis_label").transition()
.text("("+unit_selected+")") 

}
else
{
	d3.select("#legendhead_units").transition()
.text();
d3.select("#yaxis_label").transition()
.text("")
}

d3.select("#perfmap").select("g.legend").selectAll(".groups").select("text").transition()
 .text(function(d,i)
 { 
        
		return legendtext[i]
   
		})  
 } // end of colormap fn
 
 
 function colormap_sw() 
 
 {
	

switch_val= $(".switch_div .active").val();

 
if (switch_val =="off")
{
data1_domain = data1.map(function(d){if(d.change)return +d.change})

d3.select("#legendhead_units").transition()
.text();
}
else
{
	
	data1_domain = data1.map(function(d)
	
	{
		d.data=(d.data).toString();
		d.data= (d.data).replace(",","");
		if(d.data){return +d.data}
	
	}
	)
	
 
	if (unit_selected.length>0  )
{d3.select("#legendhead_units").transition()
.text("("+unit_selected+")");} 
else
{
d3.select("#legendhead_units").transition()
.text();}

	}



data1_domain= data1_domain.sort(function(a,b){ return a-b});	 

colorscale3.domain(data1_domain);



	 d3.select("#perfmap").selectAll(".state").transition().attr("fill",function(d)
{
if (d.properties["censuscode"]!=undefined){
	
	                                    if (switch_val =="off")
											
											{
                                           if (qtyById[+d.properties.censuscode])
										   { return colorscale3(qtyById[+d.properties.censuscode])}
									   else
									  // {return "#F0F0F0"}
									   {return "lightgrey"}
												
												} 

									else
										{
                                           if (qtyById2[+d.properties.censuscode])
										   { return colorscale3(qtyById2[+d.properties.censuscode])}
									   else
									  // {return "#F0F0F0"}
									   {return "lightgrey"}
												
												} 
												
}



	
   })
	 
	legendtext=colorscale3.range().map(function(k,i){
 thisentry=colorscale3.invertExtent(k)
 {
	  if (thisentry[0])
		{	
			if (+thisentry[0]<10000)
			{return (thisentry[0]).toFixed(1)}
			else
			{return d3.format(".3s")(thisentry[0])}
		}
	else {return 0;}
 }
  
  })

 

d3.select("#perfmap").select("g.legend").selectAll(".groups").select("text").transition()
 .text(function(d,i)
 { 
        
		return legendtext[i]
   
		})  
 }
 
 
 function capitalizeFirstLetter(str) {
 
		if (str)
			{
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
		}
}

 
 
 
    // https://github.com/wbkd/d3-extended
        d3.selection.prototype.moveToFront = function() {
            return this.each(function() {
                this.parentNode.appendChild(this);
            });
        };
        d3.selection.prototype.moveToBack = function() {
            return this.each(function() {
                var firstChild = this.parentNode.firstChild;
                if (firstChild) {
                    this.parentNode.insertBefore(this, firstChild);
                }
            });
        }; 
		
 
 
 function displaytooltip(d)

        {
            
            var thisdiv = d3.select(".map-tooltip")
            var x0 = [d3.event.pageX, d3.event.pageY]

        
            $("#map-tooltip-header").empty();
            $("#map-tooltip-table tbody").empty();

            $("#map-tooltip-header").append("<text  style='text-align:center'> " + capitalizeFirstLetter(d.DISTRICT) + "</text><br>")
            $("#map-tooltip-header").append("<text style='text-align:center'> " + capitalizeFirstLetter(d.stname) + "</text>")
            
				if (qtyById2[+d.censuscode] === "" || qtyById2[+d.censuscode] == undefined )				
				 
				
              {
                $("#map-tooltip-table tbody").append("<tr><td>Actual:</td><td style='text-align:right'>" + "Data not available"+ "</td></tr>")
                 }
				  else 
           {
				 num =qtyById2[+d.censuscode] 
				 
				 
				 
                $("#map-tooltip-table tbody").append("<tr><tr><td>Actual:</td><td style='text-align:right'>" + (num)+ "</td></tr>")
                 }
	if (qtyById[+d.censuscode] === "" || qtyById[+d.censuscode] == undefined )				
				 
				
              {
                $("#map-tooltip-table tbody").append("<tr><td>% Change:</td><td style='text-align:right'>" + "Data not available"+ "</td></tr>")
                 }
				  else 
           {
				 num =qtyById[+d.censuscode] 
				 
				 
				 
                $("#map-tooltip-table tbody").append("<tr><td>% Change:</td><td style='text-align:right'>" + (num).toFixed(2)+ "%</td></tr>")
                 }


            var Elem = thisdiv.node().getBoundingClientRect()

            var mwidth = window.innerWidth
            var boxX, boxY


            boxY = x0[1] - Elem.height - 15
            if ((x0[0] + Elem.width - 10) <= mwidth) {
                boxX = x0[0] - 10
            } else {
                boxX = mwidth - Elem.width - 5
            }

            thisdiv
                .style("left", (boxX) + "px").style("top", (boxY) + "px").style("opacity", 0.9)




        }

 
 
 
 
 
$("#covid_state_select").change(function() {
 

  d3.selectAll(".state").classed("highlight", 0).moveToBack();
  $("#covid_dist_select").val('All'); 
  state = $('option:selected', this).val()

  // filterdata_location();

  d3.select("#covid_dist_select").selectAll('option').remove();

   
  data_dist.sort(function(x, y) {
    return d3.ascending(x.district, y.district);
  })
   
  var mySelect = $("#covid_dist_select");
  data_dist_f = data_dist.filter(function(d) {
    return +d.ST_CEN_CD == +state
  })


  mySelect.append(
    $('<option></option>').val("All").html("All districts").addClass("All")
  )

  temp_f = [];

  data_dist_f.forEach(function(d) {

    if (temp_f.indexOf(d.distname) == -1) {

      mySelect.append(
        $('<option></option>').val(d.district_cd).html(d.distname)
      );
      temp_f.push(d.distname);
    }

  }) //end of forEach






  if (state != "999") {
    var data_temp = data_centroids.filter(function(d) {
      return d.state_cd == state
    })
    
    state_sel = (data_temp[0].abbr).split(".")[1]

    x = projection([+data_temp[0].longitude, +data_temp[0].lat])[0]
    y = projection([+data_temp[0].longitude, +data_temp[0].lat])[1]
    k = +data_temp[0].k;


 d3.select(".main_grp").attr("transform", "translate(" + mapwidth / 2 + "," + mapheight / 2.2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	
	
	

   d3.select("#perfmap_svg").selectAll(".dist").style("opacity",function(d)
    {
    	if (state_abbrev[+d.properties.ST_CEN_CD]== state_sel)
    	{return "1"}
    else  return "0.1"});  

   d3.select("#perfmap").selectAll("path.state").style("display", function(d) {
      if (+d.properties.ST_CEN_CD == state) {
        return "block"
      } else return "none"
    })
	.style("stroke-width",function()
	{ return data_temp[0].highlight_stroke}) 
	
 
/* 
    d3.select("#perfmap").selectAll("path.dist").transition()
      .duration(750)
      .attr("transform", "translate(" + mapwidth / 2 + "," + mapheight / 2.2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")

    d3.select("#perfmap").selectAll("path.state").transition()
      .duration(750)
      .attr("transform", "translate(" + mapwidth / 2 + "," + mapheight / 2.2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
 */
 d3.selectAll(".annotations").style("display","none")
 
d3.select("#perfmap").selectAll(".districttext").style("display", function(d,i) {
      if (+d.properties.ST_CEN_CD == state && i%2==0) {
        return "block"
      } else return "none"
    }).style("font-size",function()
	{
		return data_temp[0].text_size+"px"
	})
	
d3.select(".highlight").style("stroke-width",function()
{
  return data_temp[0].highlight_stroke
	
})

  } else

  {

    x = projection([83,26])[0]
    y = projection([83,26])[1]
    k = 1;
	
	
 d3.select(".main_grp")
	  .transition()
      .duration(750)
	  .attr("transform", "translate(" + mapwidth / 2 + "," + mapheight / 2.2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	
	
/* 
    d3.select("#perfmap").selectAll("path").transition()
      .duration(750)
      .attr("transform", "translate(" + mapwidth / 2 + "," + mapheight / 2.2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
*/
    //d3.select("#perfmap_svg").selectAll(".dist").style("opacity","1");	
    d3.select("#perfmap").selectAll(".state").style("display", "block"); 
	d3.select("#perfmap").selectAll(".districttext").style("display", "none");
	//d3.selectAll(".annotations").style("display","block")
  }
 

}) //end of state change() function
    
 
 
 
 function district_change(d)
 
 {
	 
var geographyid = (data_geo_ids.filter(function(k)
					{return k.district==+d.censuscode})	)[0].geographyid

 var data_ajax_dist= { "geographyid": geographyid,
					"aspectid":res ,
					"level":"3.1",
					"date":""  } 
	 
	 
//console.log	 (data_ajax_dist)
$.ajax({
        url: "https://howindialives.com/economy-tracker/api.php",
        data: data_ajax_dist,
        type: "POST",
        dataType: "json",
        success : function(json){
          
	if($("#line-chart-1 .area"). length)
		  {
			updatelinechart(json);
		    updateTable(json);  
		  }
		  
		  	  
		  	 
 }
 
})

 } 
 
 
 
 function state_change(d)
 
 {

if (d!="999")
{	
var geographyid = (data_geo_ids.filter(function(k)
					{return k.state==+d && k.district == 0})	)
					
geographyid =geographyid[0].geographyid					

 var data_ajax_dist= { "geographyid": geographyid,
					"aspectid":res ,
					"level":"2",
					"date":""  } 
}

else

{

var data_ajax_dist= { "geographyid": "",
					"aspectid":res ,
					"level":"1",
					"date":""  } 


}	
	 
//console.log	 (data_ajax_dist)
$.ajax({
        url: "https://howindialives.com/economy-tracker/api.php",
        data: data_ajax_dist,
        type: "POST",
        dataType: "json",
        success : function(json){
          
	if($("#line-chart-1 .area"). length)
		  {
			updatelinechart(json);
		    updateTable(json);  
		  }
		  
		  	  
		  	 
 }
 
})

 }
 
 
 $("#covid_dist_select").change(function()
 
 {
	 var d= {"censuscode":""};
	d["censuscode"] = document.getElementById('covid_dist_select').value;
	
	if (d.censuscode =="All")
	{ var e = document.getElementById('covid_state_select').value;
	state_change(e)
	d3.selectAll(".state").classed("highlight", 0).moveToBack();
	 d3.selectAll(".state").classed("highlight2", 0).moveToBack();
	
	}
	else
	{
	district_change(d) ;
	
	 d3.selectAll(".state").classed("highlight", 0).moveToBack();
	 d3.selectAll(".state").classed("highlight2", 0).moveToBack();
 
	 d3.select("path.state.dist_"+d.censuscode).classed("highlight2", !0).moveToFront();
	
	
	}
	 
 })
 

firsttime = true;

function redraw() {
	
	 if (firsttime)
	 {
		 	 d3.select("#perfmap").call(d3.zoom().on("zoom", function () {
				d3.select("#perfmap").selectAll(".state").attr("transform", d3.event.transform)
				}))
	 
				.on("dblclick.zoom", null)
				//.on("mousedown.zoom", null)
				.on("wheel.zoom", null)
				    .on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null);
				firsttime=false;
	 }
 
	 
	 projection.translate([mapwidth/2, mapheight/2])
	.scale(830*zoomfactor)
	 .center([83,26])
	//.center([statedata["long"], statedata["lat"]])
	
    d3.select("#perfmap").selectAll(".state").attr("d", path);
    d3.select("#perfmap").selectAll(".state2").attr("d", path);
    d3.select("#perfmap").selectAll(".stateborder").attr("d", path);
    
	 
     
}

 
 zoomfactor=1;
 
 d3.select("#Icon__Add__Two-toned").on("click", function() {
    if(zoomfactor<2)
	{zoomfactor = zoomfactor + 0.25;
      
      
     zoom_button = "clicked";
    redraw()}
});
d3.select("#Icon__Add__Two-toned_g").on("click", function() {
	if(zoomfactor>0.25)
    {zoomfactor = zoomfactor - 0.25;zoom_button = "clicked";
      
    redraw()}
});

$(".switch_div .btn").click(function()

{
	var classList = this.className.split(/\s+/);
 
if (classList.indexOf("active") == -1) {
	
	//if clicked button is same as active one, make no change
	
 $(".switch_div .btn").toggleClass("active")
	
d3.select("#legendhead").transition().text(this.innerText);
colormap_sw();}

})

$("#date_select").change(function()


{
date_selected= document.getElementById('date_select').value;	

date_selected=(date_selected).toString();

console.log(date_selected);
callbackfn(date_selected)	
})


