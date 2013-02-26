var layers=[];
var crammingAllPointsFeatures = crammingAllPoint.features;
var crammingAllSumFeatures=crammingAllSum.features;
var crammingSubFeatures=crammingSub.features;
var type = 'alltype';
var statename,state;
var lastFeature=null;
var statType="count";
var statTypes={"count":"count","numcarrier":"numcarrier","dispute":"dispute","refund":"refund"};
var statBreakByType={"count":[0,10,20,50,100,1000],
					 "numcarrier":[0,5,10,15,20,100],
					 "dispute":[0,1000,2000,5000,10000,100000],
					 "refund":[0,1000,2000,5000,10000,100000]};

OpenLayers.IMAGE_RELOAD_ATTEMPTS = 4;  // Avoid pink tiles
OpenLayers.Util.onImageLoadErrorColor = 'transparent';
OpenLayers.Util.onImageLoadError = function(){
    this.src = "../img/blank.gif";
};

var fullExtent = new OpenLayers.Bounds(
        -17107255, 2910721, -4740355, 6335100
    );
//OpenLayers.DOTS_PER_INCH = 90.71428571428572;
var map = new OpenLayers.Map({
    div: "map",
    projection: "EPSG:900913",
    displayProjection: "EPSG:4326",
    allOverlays:true,
    numZoomLevels:17,
    maxExtent: new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7),
	units: "meters"
});

var mapboxLight = new OpenLayers.Layer.XYZ(
	    "Mapbox Nightvision map",
	    [
	        "http://a.tiles.mapbox.com/v3/mapbox.mapbox-light/${z}/${x}/${y}.png",
	        "http://b.tiles.mapbox.com/v3/mapbox.mapbox-light/${z}/${x}/${y}.png",
	        "http://c.tiles.mapbox.com/v3/mapbox.mapbox-light/${z}/${x}/${y}.png",
	        "http://d.tiles.mapbox.com/v3/mapbox.mapbox-light/${z}/${x}/${y}.png"
	    ], {
	        attribution:"Data &copy; <a href='http://www.openstreetmap.org/'>OpenStreetMap</a> " +
            "and contributors, CC-BY-SA",
	        sphericalMercator: true,
	        wrapDateLine: true,
	        numZoomLevels:17,
	        transitionEffect: "resize",
	        buffer: 1
	    }
	);
layers.push(mapboxLight);


var baseMap = new OpenLayers.Layer.XYZ(
	    "Auction base map",
	    [
	     	"http://a.tiles.mapbox.com/v3/fcc.mobility_base/${z}/${x}/${y}.png",
	     	"http://b.tiles.mapbox.com/v3/fcc.mobility_base/${z}/${x}/${y}.png",
	     	"http://c.tiles.mapbox.com/v3/fcc.mobility_base/${z}/${x}/${y}.png",
	     	"http://d.tiles.mapbox.com/v3/fcc.mobility_base/${z}/${x}/${y}.png"
	    ], {
	        sphericalMercator: true,
	        wrapDateLine: true,
	        transitionEffect: "resize",
	        buffer: 1
	    }
	);
layers.push(baseMap);

var radiusStyle = new OpenLayers.StyleMap({
    "default": new OpenLayers.Style({
    	strokeColor: "#1B1EE0",
		strokeOpacity: 1,
    	strokeWidth: 2,
		fillColor: "#1B1EE0",
		fillOpacity: 0.0
    }),
    "temporary": new OpenLayers.Style({
        strokeColor: "#F09100",
		strokeWidth:2
    })
});
var radiusLayer= new OpenLayers.Layer.Vector("Contours",{
		styleMap: radiusStyle,					
		displayInLayerSwitcher:true
	});
layers.push(radiusLayer);

var templateStyle

var itemSumStyle = new OpenLayers.StyleMap({
    "default": new OpenLayers.Style({
		strokeColor: "#E01B4C",
		fillColor:"#E01B4C",
		fillOpacity: 0.6,
		pointRadius: 18,
		label : "${getLabel}",      
        fontColor: "white",
        fontSize: "12px",
        fontFamily: "Courier New, monospace",
        fontWeight: "bold",
        labelAlign: "cm",
        labelOutlineColor: "black",
        labelOutlineWidth: 4},
        {context:{
        	getLabel:getLabelByType
        }
    }),
	"temporary": new OpenLayers.Style({
		strokeColor: "#E01B4C",			
	}),
	"select": new OpenLayers.Style({
		strokeColor: "#165DF5",			
	})
});
       
var itemSumLayer = new OpenLayers.Layer.Vector("itemSum", {
	styleMap: itemSumStyle,
	rendererOptions: {zIndexing: true}
});

layers.push(itemSumLayer);

var itemPointStyle = new OpenLayers.StyleMap({
    "default": new OpenLayers.Style({
		strokeColor: "#E01B4C",
		fillColor:"#E01B4C",
		pointRadius: 8
    }),
    "temporary": new OpenLayers.Style({
		strokeColor: "#165DF5",			
	}),
	"select": new OpenLayers.Style({
		strokeColor: "#E01B4C",			
	})
});
       
var itemPointLayer = new OpenLayers.Layer.Vector("itemPoint", {
	styleMap: itemPointStyle,
	rendererOptions: {zIndexing: true}
});

layers.push(itemPointLayer);

var highlightCtrl = new OpenLayers.Control.SelectFeature([itemPointLayer,itemSumLayer], { 
	hover: true, highlightOnly: true, renderIntent: "temporary",
	eventListeners: { featurehighlighted: hoverSelect, 
	featureunhighlighted: hoverUnselect } });	
//highlightCtrl.handlers.feature.stopDown=false;

var selectCtrl = new OpenLayers.Control.SelectFeature([itemPointLayer,itemSumLayer],
        {onSelect:clickSelect}
    );

map.addLayers(layers);
//map.addControl(new OpenLayers.Control.MousePosition());
map.addControl(new OpenLayers.Control.Attribution());
map.addControl(new OpenLayers.Control.Navigation());
map.addControl(highlightCtrl);
map.addControl(selectCtrl);
highlightCtrl.activate();
selectCtrl.activate();

map.events.on({ "zoomend": function (e) {	
//	var itemPoint_exist=false;
//	if (map.getLayersByName("itemPoint").length>0){
//		itemPoint_exist=true;
//	}
	
	if (this.getZoom()>9) {
		//map.zoomTo(10);
		mapboxLight.setVisibility(true);
		baseMap.setVisibility(false);
//		if (!itemPoint_exist){
//			map.addLayer(itemPointLayer);
//		}
	}
	else{
		mapboxLight.setVisibility(false);
		baseMap.setVisibility(true);
//		if (itemPoint_exist){
//			map.removeLayer(itemPointLayer);
//		}
		
	}
		
	if (this.getZoom()>16){
		map.zoomTo(16);
	}
}
});

setItemPointLayerRule();
getItemSumAll(type);
setItemSumLayerRule();
map.zoomToExtent(fullExtent);
map.zoomTo(4);	

function getItemSumAll(type){
	itemSumLayer.removeAllFeatures();
	var features=[];
	if (type=="alltype"){
		for (i=0;i<crammingAllSumFeatures.length;i++){
			var feature = new OpenLayers.Feature.Vector(
			    	new OpenLayers.Geometry.Point(
			    			crammingAllSumFeatures[i].geometry.coordinates[0],
			    			crammingAllSumFeatures[i].geometry.coordinates[1]
			    	).transform(map.displayProjection, map.projection), {
			    		dispute:crammingAllSumFeatures[i].properties.dispute,
			    		refund: crammingAllSumFeatures[i].properties.refund,
			    		count: parseInt(crammingAllSumFeatures[i].properties.count),
			    		numcarrier:crammingAllSumFeatures[i].properties.numcarrier,
			    		statename:crammingAllSumFeatures[i].properties.statename,
			    		state:crammingAllSumFeatures[i].properties.stateabbr
			    	}
				);
			features.push(feature);
		}
	}
	else{
		var typeName = getTypeNameByType(type);
		//console.log(type + " " + typeName)
		for (i=0;i<crammingSubFeatures.length;i++){
			if (crammingSubFeatures[i].properties.complai_03 ==typeName){
				var feature = new OpenLayers.Feature.Vector(
				    	new OpenLayers.Geometry.Point(
				    			crammingSubFeatures[i].geometry.coordinates[0],
				    			crammingSubFeatures[i].geometry.coordinates[1]
				    	).transform(map.displayProjection, map.projection), {
				    		dispute:crammingSubFeatures[i].properties.dispute,
				    		refund: crammingSubFeatures[i].properties.refund,
				    		count: parseInt(crammingSubFeatures[i].properties.count),
				    		numcarrier:crammingSubFeatures[i].properties.numcarrier,
				    		statename:crammingSubFeatures[i].properties.statename,
				    		state:crammingSubFeatures[i].properties.stateabbr
				    	}
					);
				features.push(feature);
			}
			
		}
	}
	
	itemSumLayer.addFeatures(features);
}

function setItemPointLayerRule(){
	var itemPointRule = [new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.EQUAL_TO,
				property: "searchLocation", 
				value:"YES"
			}),
			// if a feature matches the above filter, use this symbolizer
			symbolizer: {
				pointRadius:8
			}
		}), new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.EQUAL_TO,
				property: "searchLocation",
				value:"NO"
			}),
			// if a feature matches the above filter, use this symbolizer
			symbolizer: {
				pointRadius:6,
				strokeColor: "#1BE056",
				fillColor:"#1BE056"
			}
		}), new OpenLayers.Rule({
			elseFilter:true,
			symbolizer: {
				pointRadius:6,
				strokeColor: "#1BE056",
				fillColor:"#1BE056"
			}
		})];	
		itemPointStyle["styles"]["default"].addRules(itemPointRule);
}

function setItemSumLayerRule(){
	var itemSumRule = [new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.BETWEEN,
				property: statTypes[statType], 
				lowerBoundary: statBreakByType[statType][0],
				upperBoundary:  statBreakByType[statType][1]
			}),
			// if a feature matches the above filter, use this symbolizer
			symbolizer: {
				pointRadius:10
				//label : getLabelByType("${" + statTypes[statType] +"}")//getLabelByType(${statTypes[statType]})", 
			}
		}), new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.BETWEEN,
				property: statTypes[statType], 
				lowerBoundary: statBreakByType[statType][1]+1,
				upperBoundary:  statBreakByType[statType][2]
			}),
			// if a feature matches the above filter, use this symbolizer
			symbolizer: {
				pointRadius:15
				//label : getLabelByType("${" + statTypes[statType] +"}")//getLabelByType(${statTypes[statType]})", 
			}
		}), new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.BETWEEN,
				property: statTypes[statType], 
				lowerBoundary: statBreakByType[statType][2]+1,
				upperBoundary:  statBreakByType[statType][3]
			}),
			// if a feature matches the above filter, use this symbolizer
			symbolizer: {
				pointRadius:20
				//label : getLabelByType("${" + statTypes[statType] +"}")//getLabelByType(${statTypes[statType]})", 
			}
		}), new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.BETWEEN,
				property: statTypes[statType], 
				lowerBoundary: statBreakByType[statType][3]+1,
				upperBoundary:  statBreakByType[statType][4]
			}),
			// if a feature matches the above filter, use this symbolizer
			symbolizer: {
				pointRadius:25
				//label : getLabelByType("${" + statTypes[statType] +"}")//getLabelByType(${statTypes[statType]})", 
			}
		}), new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.BETWEEN,
				property: statTypes[statType], 
				lowerBoundary: statBreakByType[statType][4]+1,
				upperBoundary:  statBreakByType[statType][5]
			}),
			// if a feature matches the above filter, use this symbolizer
			symbolizer: {
				pointRadius:30
				//label : getLabelByType("${" + statTypes[statType] +"}")//getLabelByType(${statTypes[statType]})", 
			}
		})];	
		itemSumStyle["styles"]["default"].addRules(itemSumRule);
}
	


function refreshMap(layers) {

}

function showTableContent(feature) {
  statename = feature.attributes.statename;
  state = feature.attributes.state;
  var numCases = feature.attributes.count;
  var numCarriers
  var content = " ";
 var typeByState = getTypeByState(statename);
  var numPercent = (numCases * 100) / crammingAllPointsFeatures.length;
	
  if (type == "alltype") {
    content += "<h2>Cramming details in " + statename + "</h2>";
    content += "<h4>Total Cramming cases: <span class='red'>" + numCases + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;Percent of total cases: <span class='red'>" + parseFloat(numPercent).toFixed(1) + "%</span></h4>";
   // content += "<h4>Percent of total cases: <span class='red'>" + parseFloat(numPercent).toFixed(1) + "%</span></h4>";
    content += "<h4>Total Dispute Amount: <span class='red'>$" +feature.attributes.dispute + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;Total Refund Amount:$ <span class='red'>$" +feature.attributes.refund + "</span</h4>";
 //   content += "<h4>Total Refund Amount:& <span class='red'>" +feature.attributes.refund + "</span></h4>";
    content += "<h4>Total Carriers: <span class='red'>" +feature.attributes.numcarrier + "</span></h4>";
    
    content += "<table id='tbl-summary'><tr><th>Type</th><th>Cases</th><th>Dispute</th><th>Refund</th><th>No. Carriers</th></tr>";

    if (typeByState[0] == 0) {
      content += "<tr><td>By Carrier</td>";
    } else {
      content += "<tr><td><a id='byCarrier' class='lnk-actionDetails' href='#void'>By Carriers</a></td>";
    }

    content += "<td>" + typeByState[0] + "</td>";
    content += "<td>$" + typeByState[1] + "</td>";
    content += "<td>$" + typeByState[2] + "</td>";
    content += "<td>" + typeByState[3] + "</td></tr>";

    if (typeByState[4] == 0) {
      content += "<tr><td>Third Party</td>";
    } else {
      content += "<tr><td><a id='thirdParty' class='lnk-actionDetails' href='#void'>Third Party</a></td>";
    }

    content += "<td>" + typeByState[4] + "</td>";
    content += "<td>$" + typeByState[5] + "</td>";
    content += "<td>$" + typeByState[6] + "</td>";
    content += "<td>" + typeByState[7] + "</td></tr>";

    if (typeByState[8] == 0) {
      content += "<tr><td>Cramming(RCRM) </td>";
    } else {
      content += "<tr><td><a id='cramming' class='lnk-actionDetails' href='#void'>Cramming(RCRM)</a></td>";
    }
    content += "<td>" + typeByState[8] + "</td>";
    content += "<td>$" + typeByState[9] + "</td>"
    content += "<td>$" + typeByState[10] + "</td>";
    content += "<td>" + typeByState[11] + "</td></tr>";

    if (typeByState[12] == 0) {
      content += "<tr><td>Not Specified</td>";
    } else {
      content += "<tr><td><a id='notSpecified' class='lnk-actionDetails' href='#void'>Not Specified</a></td>";
    }
    content += "<td>" + typeByState[12] + "</td>";
    content += "<td>$" + typeByState[13] + "</td>"
    content += "<td>$" + typeByState[14] + "</td>";
    content += "<td>" + typeByState[15] + "</td></tr>"; 
    content += "</table>";
  } 
  else{
	  var typeName = getTypeNameByType(type);
	  content += "<h2>Cramming details in " + statename + "</h2>";
	    content += "<h4>Total Cramming cases: <span class='red'>" + numCases + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;Percent of total cases: <span class='red'>" + parseFloat(numPercent).toFixed(1) + "%</span></h4>";
	   // content += "<h4>Percent of total cases: <span class='red'>" + parseFloat(numPercent).toFixed(1) + "%</span></h4>";
	    content += "<h4>Total Dispute Amount: <span class='red'>$" +feature.attributes.dispute + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;Total Refund Amount:$ <span class='red'>$" +feature.attributes.refund + "</span</h4>";
	 //   content += "<h4>Total Refund Amount:& <span class='red'>" +feature.attributes.refund + "</span></h4>";
	    content += "<h4>Total Carriers: <span class='red'>" +feature.attributes.numcarrier + "</span></h4>";
	    content += getActionDetails(state, type);
  }
  
  
  
//  else if (type == "nouo") {
//    content += "<h2>Pirate NOUO action details in " + statename + ":</h2>";
//    content += "<h4>Total pirate NOUO action cases: <span class='red'>" + num + "</span></h4>";
//    content += "<em>Click for a breakdown of all NAL actions.</em>";
//    if (action == "click") {
//      content += getActionDetails(state, type);
//    }
//  } else if (type == "forf_order") {
//    content += "<h2>Pirate Forfeiture Order action details in " + statename + ":</h2>";
//    content += "<h4>Total pirate Forfeiture Order action cases: <span class='red'>" + num + "</span></h4>";
//    content += "<h4>Total amount of Forfeiture Order: <span class='red'>$" + typeByState[5] + "</span></h4>"
//    content += "<em>Click for a breakdown of all Forfeiture Order actions.</em>";
//    if (action == "click") {
//      content += getActionDetails(state, type);
//    }
//  } else if (type == "other") {
//    var totalAmount = typeByState[7] + typeByState[9];
//    content += "<h2>Pirate Other type action details in " + statename + ":</h2>";
//    content += "<h4>Total pirate Other type action cases: <span class='red'>" + num + "</span></h4>";
//    content += "<h4>Total amount of Other type: <span class='red'>$" + totalAmount + "</span></h4>"
//    content += "<em>Click for a breakdown of all Other type actions.</em>";
//    if (action == "click") {
//      content += getActionDetails(state, type);
//    }
//  }

  return content;
}

function getTypeByState(statename) {
	  var typeByState = [];
	  var carrierCount = 0,carrierDispute=0,carrierRefund=0,carrierNum=0;
	  var thirdPartyCount = 0,thirdPartyDispute=0,thirdPartyRefund=0,thirdPartyNum=0;
	  var crammingCount = 0,crammingDispute=0,crammingRefund=0,crammingNum=0;
	  var notSpecifiedCount = 0,notSpecifiedDispute=0,notSpecifiedRefund=0,notSpecifiedNum=0;

  for (i = 0; i < crammingSubFeatures.length; i++) {
    if (crammingSubFeatures[i].properties.statename == statename) {
      if (crammingSubFeatures[i].properties.complai_03 == "By Carrier") {
        carrierCount=crammingSubFeatures[i].properties.count;
        carrierDispute=crammingSubFeatures[i].properties.dispute;
        carrierRefund=crammingSubFeatures[i].properties.refund;
        carrierNum = crammingSubFeatures[i].properties.numcarrier;
      }else if (crammingSubFeatures[i].properties.complai_03 == "By Third Party") {
          thirdPartyCount=crammingSubFeatures[i].properties.count;
          thirdPartyDispute=crammingSubFeatures[i].properties.dispute;
          thirdPartyRefund=crammingSubFeatures[i].properties.refund;
          thirdPartyNum = crammingSubFeatures[i].properties.numcarrier;
      }else if (crammingSubFeatures[i].properties.complai_03 == "Cramming (RCRM)") {
          crammingCount=crammingSubFeatures[i].properties.count;
          crammingDispute=crammingSubFeatures[i].properties.dispute;
          crammingRefund=crammingSubFeatures[i].properties.refund;
          crammingNum = crammingSubFeatures[i].properties.numcarrier;
      }
      else if (crammingSubFeatures[i].properties.complai_03 == "Not Specified") {
          notSpecifiedCount=crammingSubFeatures[i].properties.count;
          notSpecifiedDispute=crammingSubFeatures[i].properties.dispute;
          notSpecifiedRefund=crammingSubFeatures[i].properties.refund;
          notSpecifiedNum = crammingSubFeatures[i].properties.numcarrier;
      }
    }
  }
  typeByState.push(carrierCount);
  typeByState.push(carrierDispute);
  typeByState.push(carrierRefund);
  typeByState.push(carrierNum);
  typeByState.push(thirdPartyCount);
  typeByState.push(thirdPartyDispute);
  typeByState.push(thirdPartyRefund);
  typeByState.push(thirdPartyNum);
  typeByState.push(crammingCount);
  typeByState.push(crammingDispute);
  typeByState.push(crammingRefund);
  typeByState.push(crammingNum);
  typeByState.push(notSpecifiedCount);
  typeByState.push(notSpecifiedDispute);
  typeByState.push(notSpecifiedRefund);
  typeByState.push(notSpecifiedNum);
  return typeByState;
}

function getActionDetails(state, type) {
  var content = "";
  var dataType=getTypeNameByType(type);
  //console.log("type " + type + " dataType " + dataType);
  
  content += "<table id='tbl-actionDetails' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>No. &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Carrier &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Dispute &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Refund &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>status&nbsp;<span class='sort'></span></div></th><th>Detail</th></tr></thead>";

 for (i = 0; i < crammingAllPointsFeatures.length; i++) {
      if (crammingAllPointsFeatures[i].properties.stateabbr == state && crammingAllPointsFeatures[i].properties.complai_03 == dataType) {
    	  content += "<tr><td>" + crammingAllPointsFeatures[i].properties.complaint_ + "</td>";
        content += "<td>" + crammingAllPointsFeatures[i].properties.carrier_na + "</td>";
        content += "<td>" + crammingAllPointsFeatures[i].properties.dispute_am + "</td>";
        content += "<td>$" + crammingAllPointsFeatures[i].properties.refund_amo + "</td>";
        content += "<td>" + crammingAllPointsFeatures[i].properties.dispositio + "</td>";

        content += "<td><a href='#' onclick=mapItem("+crammingAllPointsFeatures[i].geometry.coordinates[0]+","+
        			crammingAllPointsFeatures[i].geometry.coordinates[1]+","+"'"+
			        crammingAllPointsFeatures[i].properties.complaint_.split(' ').join('|')+"',"+"'"+
					crammingAllPointsFeatures[i].properties.form_type.split(' ').join('|')+"',"+ "'"+
					crammingAllPointsFeatures[i].properties.complai_01.split(' ').join('|')+"',"+"'"+
					crammingAllPointsFeatures[i].properties.consumer_n.split(' ').join('|')+"',"+"'"+
					crammingAllPointsFeatures[i].properties.complai_02.split(' ').join('|')+"',"+"'"+
					crammingAllPointsFeatures[i].properties.complai_03.split(' ').join('|')+"',"+"'"+
					crammingAllPointsFeatures[i].properties.dispute_am+"',"+"'"+
					crammingAllPointsFeatures[i].properties.refund_amo+"',"+"'"+
					crammingAllPointsFeatures[i].properties.carrier_na.split(' ').join('|')+"',"+"'"+
					crammingAllPointsFeatures[i].properties.address.split(' ').join('|')+"',"+"'"+
					crammingAllPointsFeatures[i].properties.city.split(' ').join('|')+"',"+"'"+
					crammingAllPointsFeatures[i].properties.stateabbr+"',"+"'"+
					crammingAllPointsFeatures[i].properties.zip_code+"',"+"'"+
					crammingAllPointsFeatures[i].properties.phone.split(' ').join('|')+"',"+"'"+
					crammingAllPointsFeatures[i].properties.email.split(' ').join('|')+"',"+"'"+
					crammingAllPointsFeatures[i].properties.dispositio.split(' ').join('|')+"'"+")>Show</a></td></tr>";
      //  console.log(content);
        //content += "<tr onclick=mapItem('" + biddingItemsByState[j].id + "')><td>" + biddingItemsByState[j].item_id + "</td>";
      }
    } 

 content += "</table>";
 return content;
  
//  if (type == "nal") {
//    content += "<table id='tbl-actionDetails' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>File &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Date &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Name &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>City &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Amt. &nbsp;<span class='sort'></span></div></th><th>URL</th></tr></thead>";
//    for (i = 0; i < features.length; i++) {
//      if (features[i].properties.state == state && features[i].properties.actiontype == "NAL") {
//        content += "<tr><td>" + features[i].properties.caseno + "</td>";
//        content += "<td>" + features[i].properties.date + "</td>";
//        content += "<td>" + features[i].properties.casename + "</td>";
//        content += "<td>" + features[i].properties.city + "</td>";
//        content += "<td>$" + features[i].properties.amount + "</td>";
//        content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
//      }
//    }
//  } else if (type == "nouo") {
//    content += "<table id='tbl-nouo' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>File &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Date &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Address &nbsp;<span class='sort'></span></div></th><th>URL</th></tr></thead>";
//    for (i = 0; i < features.length; i++) {
//      if (features[i].properties.state == state && features[i].properties.actiontype == "NOUO") {
//        content += "<tr><td>" + features[i].properties.file + "</td>";
//        content += "<td>" + features[i].properties.date + "</td>";
//        content += "<td>" + features[i].properties.addressee + "</td>";
//        content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
//      }
//    }
//  } else if (type == "forf_order") {
//    content += "<table id='tbl-actionDetails' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>File &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Date &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Address &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Amt. &nbsp;<span class='sort'></span></div></th><th>URL</th></tr></thead>";
//    for (i = 0; i < features.length; i++) {
//      if (features[i].properties.state == state && features[i].properties.actiontype == "FORFEITURE ORDER") {
//        content += "<tr><td>" + features[i].properties.file + "</td>";
//        content += "<td>" + features[i].properties.date + "</td>";
//        content += "<td>" + features[i].properties.addressee + "</td>";
//        content += "<td>$" + parseAmount(features[i].properties.fortamt) + "</td>";
//        content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
//      }
//    }
//  } else if (type == "other") {
//    content += "<table id='tbl-other' class='tablesorter'><thead><tr><th><div class='sort-wrapper'>Type &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>File &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Date &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Address &nbsp;<span class='sort'></span></div></th><th><div class='sort-wrapper'>Amt. &nbsp;<span class='sort'></span></div></th><th>URL</th></tr></thead>";
//    for (i = 0; i < features.length; i++) {
//      if (features[i].properties.state == state && features[i].properties.actiontype != "NAL" && features[i].properties.actiontype != "NOUO" && features[i].properties.actiontype != "FORFEITURE ORDER") {
//        content += "<tr><td>" + features[i].properties.actiontype + "</td>";
//        content += "<td>" + features[i].properties.file + "</td>";
//        content += "<td>" + features[i].properties.date + "</td>";
//        content += "<td>" + features[i].properties.addressee + "</td>";
//        content += "<td>$" + parseAmount(features[i].properties.fortamt) + "</td>";
//        content += "<td><a href='" + features[i].properties.url + "' target='_blank'>link</a></td></tr>";
//      }
//    }
//  }

}

function mapItem(lon,lat,complaintNumber,formType,complaintType,consumerName,complaintCategory,complaintSubcategory,disputeAmount,refundAmount,carrierName,address,city,stateabbr,zipcode,phone,email,dispositionStatus){
	removePopup(lastFeature);
	itemPointLayer.removeAllFeatures();
	var feature = new OpenLayers.Feature.Vector(
        	new OpenLayers.Geometry.Point(lon,lat)
        	.transform(map.displayProjection, map.projection), {
        		complaintNumber:complaintNumber.split('|').join(' '),
        		formType:formType.split('|').join(' '),
        		complaintType:complaintType.split('|').join(' '),
        		consumerName:consumerName.split('|').join(' '),
        		complaintCategory:complaintCategory.split('|').join(' '),
        		complaintSubcategory:complaintSubcategory.split('|').join(' '),
        		disputeAmount:disputeAmount,
				refundAmount:refundAmount,
				carrierName:carrierName.split('|').join(' '),
				address:address.split('|').join(' '),
				location:city.split('|').join(' ') + "," + stateabbr + " " + zipcode,
				phone:phone.split('|').join(' '),
				email:email,
				dispositionStatus:dispositionStatus.split('|').join(' ')
        	}
    	);
	itemPointLayer.addFeatures([feature]);
	var itemExtent = itemPointLayer.getDataExtent();
	map.zoomToExtent(itemExtent);
	if (itemPointLayer.features.length==1){
		map.zoomTo(16);
	}
}

function removePopup(feature){
	 if(feature != null && feature.popup != null){
         map.removePopup(feature.popup);
         feature.popup.destroy();
         delete feature.popup;
         tooltipPopup = null;
         lastFeature = null;
     }
}

function hoverSelect(event){
	//console.log("hover");
    var feature = event.feature;
    var selectedFeature = feature;
	var content="&nbsp;</br>&nbsp;";
	if (feature.layer.name=="itemPoint" ){
		if (typeof(feature.attributes["searchLocation"])=="undefined"){
			content += "Complaint Number: " + feature.attributes.complaintNumber + "<br/>&nbsp;" +
			"formType: " + feature.attributes.formType + "<br/>&nbsp;" +
			"complaintType: " + feature.attributes.complaintType + "<br/>&nbsp;" +
			"consumerName: " + feature.attributes.consumerName + "<br/>&nbsp;" +
			"complaintCategory: " + feature.attributes.complaintCategory + "<br/>&nbsp;" +
			"complaintSubcategory: " + feature.attributes.complaintSubcategory + "<br/>&nbsp;" +
			"disputeAmount: " + feature.attributes.disputeAmount + "<br/>&nbsp;" +
			"refundAmount: " + feature.attributes.refundAmount + "<br/>&nbsp;" +
			"fcarrierName: " + feature.attributes.carrierName + "<br/>&nbsp;" +
			"address: " + feature.attributes.address + "<br/>&nbsp;" +
			"phone: " + feature.attributes.phone + "<br/>&nbsp;" +
			"email: " + feature.attributes.email + "<br/>&nbsp;" +
			"dispositionStatus: " + feature.attributes.dispositionStatus + "<br/>&nbsp;"
		}
		else{
			if (feature.attributes["searchLocation"]=="YES"){
				content+="Display Name: " + feature.attributes["displayName"]+"<br/>&nbsp;";
				content+="Place Type: " + feature.attributes["placeType"]+"<br/>&nbsp;";
			}
			else if (feature.attributes["searchLocation"]=="NO"){
				content+="Address: " + feature.attributes["address"]+"<br/>&nbsp;";
				content+="Distance: " + parseFloat(feature.attributes["distance"]/1000).toFixed(1) + "(km)"+"<br/>&nbsp;";
			}
		}
				
	
		//if there is already an opened details window, don\'t draw the tooltip
		if (feature.popup != null) {
			return;
		}
		//if there are other tooltips active, destroy them
		if (tooltipPopup != null) {
			map.removePopup(tooltipPopup);
			tooltipPopup.destroy();
			if (lastFeature != null) {
				delete lastFeature.popup;
				tooltipPopup = null;
			}
		}
		lastFeature = feature;	
		var tooltipPopup = new OpenLayers.Popup("activetooltip", 
						feature.geometry.getBounds().getCenterLonLat(), 
						new OpenLayers.Size(60, 10), 
						content,false);
		setPopupStyle(tooltipPopup);
		feature.popup = tooltipPopup;
		map.addPopup(tooltipPopup);
	}
	
}
function hoverUnselect(event){
	 var feature = event.feature;
     if(feature != null && feature.popup != null){
         map.removePopup(feature.popup);
         feature.popup.destroy();
         delete feature.popup;
         tooltipPopup = null;
         lastFeature = null;
     }
}

function clickSelect(feature){
	//itemSumLayer.styleMap.styles.select.defaultStyle.strokeColor='#165DF5';
	//itemSumLayer.redraw();
	//console.log(feature);
    //var feature = event.feature;
	s=feature;
	if(feature.layer.name=="itemSum"){
		  $('#tooltips').html('<div class="inner">' + showTableContent(feature) + '</div>');
	}
	else if (feature.layer.name=="itemPoint"){		
		removePopup(lastFeature);
	}
	  
}


function setPopupStyle(tooltipPopup){
tooltipPopup.contentDiv.style.backgroundColor = "#81C9D4";//'#6B6A6A';
tooltipPopup.contentDiv.style.color="white";
tooltipPopup.contentDiv.style.fontsize="xx-small";
tooltipPopup.contentDiv.style.overflow = 'auto';
tooltipPopup.contentDiv.style.padding = '1px';
tooltipPopup.contentDiv.style.margin = '0px';
tooltipPopup.closeOnMove = false;
tooltipPopup.autoSize = true;
//tooltipPopup.panMapIfOutOfView=true;
}

function parseAmount(amt) {
  if (!isNaN(amt)) {
    return 0;
  } else {
    amt = amt.replace("$", "");
    amt = amt.replace(",", "");
    return parseFloat(amt);
  }
}


function initTblSort() {
  if (jQuery('#tbl-actionDetails') && jQuery('#tbl-actionDetails tbody tr').length > 1) {
    jQuery('#tbl-actionDetails').dataTable({
      "aoColumns": [
      null, null,
      {
        "sType": "currency"
      },
      {
          "sType": "currency"
        },
      null,null],
      "aaSorting": [
        [1, "desc"]
      ],
      "bDestroy": true,
      "bFilter": false,
      "bInfo": false,
      "bPaginate": false,
      "bLengthChange": false
    });
//  } else if (jQuery('#tbl-nouo') && jQuery('#tbl-nouo tbody tr').length > 1) {
//    jQuery('#tbl-nouo').dataTable({
//      "aaSorting": [
//        [1, "desc"]
//      ],
//      "bDestroy": true,
//      "bFilter": false,
//      "bInfo": false,
//      "bPaginate": false,
//      "bLengthChange": false
//    });
//  } else if (jQuery('#tbl-other') && jQuery('#tbl-other tbody tr').length > 1) {
//    jQuery('#tbl-other').dataTable({
//      "aaSorting": [
//        [2, "desc"]
//      ],
//      "bDestroy": true,
//      "bFilter": false,
//      "bInfo": false,
//      "bPaginate": false,
//      "bLengthChange": false
//    });
  }
}

function getTypeNameByType(type){
	var typeName;
	switch (type) {
		case 'byCarrier': {
				typeName = 'By Carrier'
				break;
			}
		case 'thirdParty': {
				typeName = 'By Third Party'
				break;
			}
		case 'cramming': {
				typeName = 'Cramming (RCRM)'
				break;
			}
		case 'notSpecified': {
				typeName = 'Not Specified'
				break;
			}
	}
	return typeName;
}

function setMapDefault(){
	itemPointLayer.removeAllFeatures();
	radiusLayer.removeAllFeatures();
	map.zoomToExtent(fullExtent);
	map.zoomTo(4);	
}

$(document).ready(function () {
  $('.description').hide();
  $('#description-alltype').show();

  // Layer Selection
  jQuery('a.candidate-tab').click(function (e) {
    type = jQuery(this).attr('id');
    e.preventDefault();

    jQuery('a.candidate-tab').removeClass('active');
    jQuery(this).addClass('active');

    jQuery('.description').hide();
    jQuery('#description-' + type).show();
    $('#tooltips').empty();
    getItemSumAll(type);
    setMapDefault();

  });

  jQuery('#tooltips').on('click', '.lnk-actionDetails', function (e) {

    var type = jQuery(this).attr('id');
   // console.log(type);
	var typeName = getTypeNameByType(type);
    var actionD = getActionDetails(state, type);	
	e.preventDefault();
    jQuery('#sect-actionDetails').remove();
    jQuery('#tooltips .inner').append('<div id="sect-actionDetails"><h2>' + typeName + ' Cases in ' + statename + '</h2>' + actionD + '</div>');
    initTblSort();
    setMapDefault();
  });
  
  $('ul.macro li a').click(function() {
      $('ul.macro li a').removeClass('active');
      $(this).addClass('active');
	  statType=this.id;
	  setItemSumLayerRule();
	  itemSumLayer.redraw();
  });
});

// Handle geocoder form submission
var input = $('#addressTxt');
    inputTitle = 'Enter a place or zip code';
    input.val(inputTitle);   

// Remove default val on blur
input.blur(function() {
    if (input.val() === '') {
        input.val(inputTitle);
    }
    }).focus(function() {
        if (input.val() === inputTitle) {
            input.val('');
        }
});

$('#goClose').on('click',function(e){
	var inputValue = $('#addressTxt').val();
    encodedInput = encodeURIComponent(inputValue);
    geocode(encodedInput,'close');
	
});
$('#goDis').on('click',function(e){
	var inputValue = $('#addressTxt').val();
    encodedInput = encodeURIComponent(inputValue);
    geocode(encodedInput,'distance');
	
});

function geocode(query,type) {
    $.getJSON('http://open.mapquestapi.com/nominatim/v1/search?format=json&countrycodes=us&limit=1&q=' + query + "&callback=callback",
    		function(value){
		    	 value = value[0];
		    	 console.log(value);
		         if (value === undefined) {
		             alert('<p>The search you tried did not return a result.</p>');
		         } else {
		        	 showSearchResult(value.lon,value.lat,type, value.display_name,value.type);
		         }
    		});
}

function showSearchResult(lon,lat,searchType,displayName,placeType){
	removePopup(lastFeature);
	itemPointLayer.removeAllFeatures();
	radiusLayer.removeAllFeatures();
	var sql,sql1;
	var features = [];
	var feature = new OpenLayers.Feature.Vector(
        	new OpenLayers.Geometry.Point(lon,lat)
        	.transform(map.displayProjection, map.projection), {
        		displayName:displayName,
        		placeType:placeType,
        		searchLocation:"YES"

        	}
    	);
	features.push(feature);
	
	if (searchType=="close"){
		var num = parseInt($("#closestCases").val());
		sql = "http://xmgeo.cartodb.com/api/v2/sql?format=geojson&q=SELECT address, " + "" +
				"st_distance(st_transform(the_geom,2163),st_transform(st_setsrid(st_makepoint(" +
				lon + "," + lat + "),4326),2163)) as distance,the_geom FROM cramming_final where the_geom is not null " +
				"order by the_geom<->st_setsrid(st_makepoint(" + lon + "," + lat + "),4326) limit  " + num + "&callback=?";

		$.getJSON(sql, function(data){
			console.log(data);
			var feas = data.features;
			for (i=0;i<feas.length;i++){
				var fea = new OpenLayers.Feature.Vector(
				    	new OpenLayers.Geometry.Point(
				    			feas[i].geometry.coordinates[0],
				    			feas[i].geometry.coordinates[1]
				    	).transform(map.displayProjection, map.projection), {
				    		address:feas[i].properties.address,
				    		distance:feas[i].properties.distance,
				    		searchLocation:"NO"

				    	}
					);
				features.push(fea);
			}
			itemPointLayer.addFeatures(features);
			var itemExtent = itemPointLayer.getDataExtent();
			map.zoomToExtent(itemExtent);
		})
	}
	else if (searchType=="distance"){
		
		var num = parseInt($("#distance").val())*1000;
		sql1="http://xmgeo.cartodb.com/api/v2/sql?format=geojson&q=select the_geom, st_asgeojson(st_transform(st_buffer(st_transform(st_setsrid(st_makepoint(" +
				lon + "," + lat + "),4326),2163)," + num + "),4326)) as buffer from cramming_final limit 1";
		
		sql = "http://xmgeo.cartodb.com/api/v2/sql?format=geojson&q=select address," + 
				"st_distance(st_transform(the_geom,2163),st_transform(st_setsrid(st_makepoint(" +
				lon + "," + lat + "),4326),2163)) as distance,the_geom from cramming_final " +
				"where st_intersects(the_geom,st_transform(st_buffer(st_transform(st_setsrid" +
				"(st_makepoint(" + lon + "," + lat + "),4326),2163)," + num + "),4326)) and the_geom is not null&callback=?";
		
		$.getJSON(sql1,function(data){
			var pointList=[]; 
			var polygonFeature;
			 coordinates=eval('(' + data.features[0].properties.buffer + ')').coordinates[0];
		    for (j=0;j<coordinates.length;j++){
		        var newPoint = new OpenLayers.Geometry.Point(coordinates[j][0], coordinates[j][1]);
		        pointList.push(newPoint)
		     }
		     pointList.push(pointList[0]);
		    var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
		    var radiusFeature = new OpenLayers.Feature.Vector(
		        new OpenLayers.Geometry.Polygon([linearRing]).transform(map.displayProjection, map.projection),
		        {});
		    radiusLayer.addFeatures([radiusFeature]);
			$.getJSON(sql, function(data){
				var feas = data.features;
				console.log(feas);
				if (feas.length>0){
					for (i=0;i<feas.length;i++){
						var fea = new OpenLayers.Feature.Vector(
						    	new OpenLayers.Geometry.Point(
						    			feas[i].geometry.coordinates[0],
						    			feas[i].geometry.coordinates[1]
						    	).transform(map.displayProjection, map.projection), {
						    		address:feas[i].properties.address,
						    		distance:feas[i].properties.distance,
						    		searchLocation:"NO"
		
						    	}
							);
						features.push(fea);
					}
					itemPointLayer.addFeatures(features);
					var radiusExtent = radiusLayer.getDataExtent();
					map.zoomToExtent(radiusExtent);
				}
				else{
					alert("no cramming case found. Plase increase the distance");
				}
				
			})
		})
	}
}

function getLabelByType(feature){
	var label;
	if (statType=="count"){
		label=feature.attributes.count;
	}
	else if (statType=="numcarrier"){
		label=feature.attributes.numcarrier;
	}
	else if (statType=="dispute" || statType=="refund"){
		label=(Math.floor(parseFloat(feature.attributes[statType])/1000));
		if (label==0){
			label = "";
		}
		else{
			label = label+"k";
		}
	}
	return label;
}



