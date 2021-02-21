$(".form-check").css("display","none");
$(".form-check.form_Fertiliser_Sales").css("display","block");
$(".form-check.form2_Fertiliser_sales").css("display","block");
d3.select("#collapseTwo2").style("display","block");


var sector_selected,
    unit_selected,
    explanation_selected,
	indicator_selected,
	option_selected,
	subcat_selected,
	subcat3_selected,
	data_aspect,
	data_default
	data_trail="";

queue()
    .defer(d3.csv, 'assets/data/aspectid.csv')
    .defer(d3.csv, 'assets/data/master_list_default.csv')   
    .await(getmasterdata)

  function getmasterdata(error,data_asp,data_def){
	  
	data_aspect= data_asp;	
	data_default= data_def	
	 
	  
  }
  
  


sector_selected = "Fertiliser sales"
unit_selected="Metric tonne"
explanation_selected="Fertiliser sales at POS"
indicator_selected = "POS sales"
option_selected= "POS"


		 
$(".sector_button").click(function()

{
	
	//Initialisation of sx
$('#input_switch1').attr('checked',true);
$('#input_switch1').prop('disabled',false);
////
	
	sector_selected = $(this).attr("data-name");
	/* unit_selected = data_aspect.filter(function(d){return d.sector==sector_selected})
	unit_selected = unit_selected[0].unit */
	//console.log(sector_selected)
	////
	if (sector_selected=="Rainfall")
	{
		var classList = $(".switch_div .btn.active")[0].className.split(/\s+/);
 
if (classList.indexOf("text1") == -1) {
	
	//if clicked button is same as active one, make no change
	
 $(".switch_div .btn").toggleClass("active")
		
	 
        d3.select("#legendhead").transition().text("Actual");
		// $('#input_switch1').attr('checked',false);
		 //$('#input_switch1').prop('disabled',true);
	}
	
	}
	//*********svg-rect- fill **********//
	$(".Rectangle_sector").css("fill","transparent");
	classname= "sector_"+sector_selected.split(' ').join('_');
	$('.Rectangle_sector.'+classname).css("fill","rgba(89,64,92,1)");
	$(".sector_button").css("color","rgba(173,142,158,1)");
	$('.sector_button[data-name="'+sector_selected+'"]').css("color","rgba(255,255,255,1)")
	
 
	 var result = checkindicators();
	 
	
	 getdata(result);
	//////////////
	
	
	if (sector_selected == "Companies and Establishments")
	{
		d3.select("#Economic_Activity_Tracker").select("span").transition().text("Companies Tracker")

	d3.select("#Economic_Activity_Tracker1").select("span").transition().text("Companies timeline")

	d3.select("#Economic_Activity_Tracker2").select("span").transition().text("Companies tabular data")
		
	}
	else
	{
	d3.select("#Economic_Activity_Tracker").select("span").transition().text(sector_selected+" Tracker")

	d3.select("#Economic_Activity_Tracker1").select("span").transition().text(sector_selected+" timeline")

	d3.select("#Economic_Activity_Tracker2").select("span").transition().text(sector_selected+" tabular data")
	
	}
	
	

} 
)

$("#collapseOne1 .form-check-input").click(function()
{
	indicator_selected = $(this).attr("data-name");
	indicatorchange();
	
}
)

$("#collapseTwo2 .form-check-input").click(function()
{
	option_selected = $(this).attr("data-name");
	
	var res = checksubcat2();
	getdata(res)
}
)

$("#collapse3 .form-check-input").click(function()
{
	subcat_selected = $(this).attr("data-name");
	
	var res = checksubcat3();
	getdata(res)
}
)

function checkindicators()

{
	//retrieve all indicator for this sector
	indicator_selected = (data_default.filter(function(d)
	{return d.indicator==sector_selected}) )[0]["default"]
	
	date_i = (data_default.filter(function(d){return d.indicator==sector_selected}) )[0]["date"]
	//console.log(indicator_selected)
	
	indicators = data_aspect.filter(function(d)
									{return d.sector == sector_selected})
	indicators = indicators.map(function(d) {return d.indicator})								
	unique_indicators=[];
	 
	$.each(indicators, function(i, el){
		if($.inArray(el, unique_indicators) === -1) unique_indicators.push(el);
	});									
	
 
	
	d3.select("#collapseOne1").select(".card-body")
	.selectAll(".form-check").remove();
	
	unique_indicators.forEach(function(d)
	{
	 
	v= d3.select("#collapseOne1").select(".card-body").append("div")
			.attr("class","form-check form1")
			.append("label").attr("class","form-check-label")
			
			v.append("input").attr("type","radio")
							.attr("class","form-check-input")
							.attr("name","optradio")
							.attr("data-name",d)
							.attr("checked", function()
							{ if (indicator_selected == d) 
								{return true}
								
							})
			v.append("text").text(d)				
	})
	$("#collapseOne1 input.form-check-input").click(function()
	
	{
		indicator_selected = $(this).attr("data-name");
	     var res = indicatorchange();
		getdata(res)
		
	})
	var result= checkoptions();
	
	
 
}


function checkoptions()
{
	//retrieve all indicator for this sector
	option_selected = data_default.filter(function(d)
	{return d.indicator==(sector_selected)+"*"+indicator_selected})
	
	if (option_selected.length>0)
	{	
	date_i = option_selected[0]["date"]
	option_selected=option_selected[0]["default"]
	
	//console.log(option_selected)
	
	
	options = data_aspect.filter(function(d)
									{return d.sector == sector_selected 
									     && d.indicator == indicator_selected})
	options = options.map(function(d) {return d.subcategory})								
	
	unique_options=[];
	 
	$.each(options, function(i, el){
		if($.inArray(el, unique_options) === -1) unique_options.push(el);
	});							
	
	

	d3.select(".side_panel_subcategory").style("display","block");
	
	d3.select("#collapseTwo2").style("display","block");
	d3.select("#collapseTwo2").select(".card-body")
	.selectAll(".form-check").remove();
	
	unique_options.forEach(function(d)
	{
	 
	v= d3.select("#collapseTwo2").select(".card-body").append("div")
			.attr("class","form-check form2")
			.append("label").attr("class","form-check-label")
			
			v.append("input").attr("type","radio")
							.attr("class","form-check-input")
							.attr("name","optradio2")
							.attr("data-name",d)
							.attr("checked", function()
							{ if (option_selected == d) 
								{return true}
								
							})
			v.append("text").text(d)				
	})
	$("#collapseTwo2 .form-check-input").click(function()
{
	option_selected = $(this).attr("data-name");
	
	var res = checksubcat2();
	getdata(res)
}
)

	checksubcat2()
	} 
	
	else //if no check options available
	
	{
		option_selected="";
		
		d3.select("#collapseTwo2").select(".card-body")
	.selectAll(".form-check").remove();
	
		//d3.select(".side_panel_subcategory").style("display","none");
		d3.select(".side_panel_subcategory").style("display","none");
		
		
		
		subcat_selected="";
		
		d3.select("#collapse3").select(".card-body")
	.selectAll(".form-check").remove();
	
		
		d3.select(".side_panel_subcategory2").style("display","none");
		
		subcat3_selected = "";
		d3.select(".side_panel_subcategory3").style("display","none")
		
		
	}
}
function checksubcat2()
{
	//retrieve all indicator for this sector
	subcat_selected = data_default.filter(function(d)
	{return d.indicator==
	(sector_selected)+"*"+indicator_selected+"*"+option_selected
	
	})
	
	if (subcat_selected.length>0)
	{	
	
	date_i = subcat_selected[0]["date"]
	subcat_selected=subcat_selected[0]["default"]
	
	//console.log(subcat_selected)
	
	
	subcat2 = data_aspect.filter(function(d)
									{return d.sector == sector_selected 
									     && d.indicator == indicator_selected
										 && d.subcategory == option_selected 
										 
										 })
	subcat2 = subcat2.map(function(d) {return d.subcategory2})								
	
	unique_subcat2=[];
	 
	$.each(subcat2, function(i, el){
		if($.inArray(el, unique_subcat2) === -1) unique_subcat2.push(el);
	});							
	
	
	d3.select(".side_panel_subcategory2").style("display","block");
	d3.select("#collapse3").style("display","block");
	d3.select("#collapse3").select(".card-body")
	.selectAll(".form-check").remove();
	
	unique_subcat2.forEach(function(d)
	{
	 
	v= d3.select("#collapse3").select(".card-body").append("div")
			.attr("class","form-check form2")
			.append("label").attr("class","form-check-label")
			
			v.append("input").attr("type","radio")
							.attr("class","form-check-input")
							.attr("name","optradio3")
							.attr("data-name",d)
							.attr("checked", function()
							{ if (subcat_selected == d) 
								{return true}
								
							})
			v.append("text").text(d)				
	})
	
$("#collapse3 .form-check-input").click(function()
{
	subcat_selected = $(this).attr("data-name");
	var res=checksubcat3(); 
	getdata(res)
}
)
checksubcat3()
	
	} 
	
	else //if no check options available
	
	{
		subcat_selected="";
		
		d3.select("#collapse3").select(".card-body")
	.selectAll(".form-check").remove();
	
		
		d3.select(".side_panel_subcategory2").style("display","none");
		
		subcat3_selected = "";
		d3.select(".side_panel_subcategory3").style("display","none")
		
		
	}
}


function checksubcat3()
{
	//retrieve all indicator for this sector
	subcat3_selected = data_default.filter(function(d)
	{return d.indicator==
	(sector_selected)+"*"+indicator_selected+"*"+option_selected+"*"+subcat_selected
	
	})
	
	if (subcat3_selected.length>0)
	{	


	
	 
	d3.select(".side_panel_subcategory3").style("display","block")
	
	date_i = subcat3_selected[0]["date"]
	subcat3_selected=subcat3_selected[0]["default"]
	
	//console.log(subcat3_selected)
	
	
	subcat3 = data_aspect.filter(function(d)
									{return d.sector == sector_selected 
									     && d.indicator == indicator_selected
										 && d.subcategory == option_selected 
										 && d.subcategory2 == subcat_selected 
										 
										 })
	subcat3 = subcat3.map(function(d) {return d.subcategory3})								
	
	unique_subcat3=[];
	 
	$.each(subcat3, function(i, el){
		if($.inArray(el, unique_subcat3) === -1) unique_subcat3.push(el);
	});							
	
	 	 d3.select(".modal-content").select("div.modal-body").remove();
			
			d3.select(".modal-content").append("div")
			.attr("class","modal_heading")
			
			
	v= d3.select(".modal-content").append("div")
			.attr("class","modal-body")
			.append("ul").attr("class","FilterDirectory-list")
			.attr("id","modal_list")
	

			
	unique_subcat3.forEach(function(d)
	{

			
			l= v.append("li").append("label")	
			
			l.append("input").attr("type","radio")
							.attr("class","form-check-input")
							.attr("name","optradio4")
							.attr("data-name",d)
							.attr("checked", function()
							{ if (subcat3_selected == d) 
								{return true}
								
							})
			l.append("text").text(d)				
	})
	
$("#collapse4 .form-check-input").click(function()
{
	subcat3_selected = $(this).attr("data-name");
	 
	getdata()
}
)
//checksubcat4()
	
	} 
	
	else //if no check options available
	
	{
		
		subcat3_selected = "";
		d3.select(".side_panel_subcategory3").style("display","none")
	
		
		 
	}
}




 function indicatorchange()
 
 {
	
	 var result2 = checkoptions();
	 
	
	 getdata(result2);
	
}


// Get the modal
var modal = document.getElementById("collapse4");

// Get the button that opens the modal
var btn = document.getElementById("link_to_modal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


$("#link_to_modal").click(function()
{
	
	 modal.style.display = "block";
	
})

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 


$(document).ready(function(){
  $(".modal-search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#modal_list li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});