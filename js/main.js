// Various variable declaration
var type = '', distance,
    twokm, threekm, fourkm,
    region = '', prefecture = '', prefecture_select = '', sub_prefecture = '', 
    geoData = null, dataLayer = null, markerGroup = null, 
    guineaAdminLayer0, guineaAdminLayer1, guineaAdminLayer2,
    region_layer = null, prefecture_layer = null, sub_prefecture_layer = null, bufferLayer = null,
    GINLabels = [],
    within, within_fc, buffered = null,
    GINAdmin2 = false,
    googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3']}),
    googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3']}),
    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18})

//Initiating and declaring leaflet map object
var map = L.map('map', {
    center: [9.6, -12.6],
    zoom: 7,
    animation: true,
    zoomControl: false,
    layers: [osm]
    //minZoom: 6

});
map.options.minZoom = 7;

var baseMaps = {
    "Google Satelite": googleSat,
    "OSM": osm,
    "Google Street": googleStreets
};

map.on('zoomend', function () {
    adjustLayerbyZoom(map.getZoom())
})


new L.Control.Zoom({
    position: 'topright'
}).addTo(map);

L.control.layers(baseMaps).addTo(map);

L.control.scale({
    position: 'bottomright',
    maxWidth: 100,
    metric: true,
    updateWhenIdle: true
}).addTo(map);

//Helps add label to the polygons for admin boundary at zoom level greater than 9
function adjustLayerbyZoom(zoomGIN) {

    if (zoomGIN > 9) {
        if (!GINAdmin2) {
            map.addLayer(guineaAdminLayer2)
                //Add labels to the Admin2
            for (var i = 0; i < GINLabels.length; i++) {
                GINLabels[i].addTo(map)

            }
            GINAdmin2 = true
        }
    } else {
        map.removeLayer(guineaAdminLayer2)
        for (var i = 0; i < GINLabels.length; i++) {
            map.removeLayer(GINLabels[i])

        }

        GINAdmin2 = false
    }

}

//This drives all the operation that will be rendering on the map
function triggerUiUpdate() {
    type = $('#hf_type').val()
    region = $('#region_scope').val()
    prefecture = $('#prefecture_scope').val()
    var query = buildQuery(type, region, prefecture, sub_prefecture)
    getData(query)
    prefecture_select = $('#region_scope').val()
}


//Read data from carto and filter via selection from the interface
function buildQuery(type, region, prefecture, sub_prefecture) {
  var needsAnd = false;
    query = 'https://femtope.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM guinea_hf';
   if (type.length > 0 || region.length > 0 || prefecture.length > 0 || sub_prefecture.length > 0){
       query = query.concat(' WHERE')
       if (type.length > 0){
      query = query.concat(" type = '".concat(type.concat("'")))
      needsAnd = true
    }

    if (region.length > 0){
      query = needsAnd  ? query.concat(" AND region = '".concat(region.concat("'"))) :  query.concat(" region = '".concat(region.concat("'")))
      needsAnd = true
    }

    if(prefecture.length > 0) {
      query = needsAnd  ? query.concat(" AND prefecture = '".concat(prefecture.concat("'"))) :  query.concat(" prefecture = '".concat(prefecture.concat("'")))
      needsAnd = true
    }

    if(sub_prefecture.length > 0) {
      query = needsAnd  ? query.concat(" AND sub_prefecture = '".concat(sub_prefecture.concat("'"))) :  query.concat(" sub_prefecture = '".concat(sub_prefecture.concat("'")))
      needsAnd = true
    }

   }
     else query = 'https://femtope.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM guinea_hf';
  return query

}


//Helps add data to the marker cluster and cluster to the map with icons
function addDataToMap(geoData) {
    // adjustLayerbyZoom(map.getZoom())
    //remove all layers first

    if (dataLayer != null)
        map.removeLayer(dataLayer)

    if (markerGroup != null)
        map.removeLayer(markerGroup)

    var _radius = 8
    var _outColor = "#fff"
    var _weight = 2
    var _opacity = 2
    var _fillOpacity = 2.0

    var markerHealth = L.icon({
        iconUrl: "image/Hospital_Logo_01.png",
        iconSize: [20, 20],
        iconAnchor: [25, 25]
    });



    $('#projectCount').text(geoData.features.length)

    markerGroup = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            removeOutsideVisibleBounds: true
        })
        dataLayer = L.geoJson(geoData, {
        pointToLayer: function (feature, latlng) {
            var marker = L.marker(latlng, {icon: markerHealth})
                //markerGroup.addLayer(marker);
            return marker
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.cartodb_id) {
                //layer.bindPopup(buildPopupContent(feature));
                layer.on('click', function () {
                    displayInfo(feature)
                })
            }

        }

    })

    markerGroup.addLayer(dataLayer);
    map.addLayer(markerGroup);
}


//Add administrative boundaries to the map and symbolizes them
function addAdminLayersToMap(layers) {
    var layerStyles = {
            'admin0': {
                "clickable": true,
                "color": '#B81609',
                "fillColor": '#ffffff',
                "weight": 2.0,
                "opacity": 1.5,
                "fillOpacity": 0.1
            },
            'admin2': {
                "clickable": true,
                "color": '#412406',
                "fillColor": '#80FFFFFF',
                "weight": 1.5,
                "opacity": 0.5,
                "fillOpacity": 0.1
            },
            'region': {
                "clickable": true,
                "color": '#e2095c',
                "fillColor": '#80FFFFFF',
                "weight": 2.0,
                "opacity": 0.7,
                "fillOpacity": 0.1
            },
            'prefecture': {
                "clickable": true,
                "color": '#e2095c',
                "fillColor": '#80FFFFFF',
                "weight": 2.5,
                "opacity": 0.7,
                "fillOpacity": 0.1
            },
            'sub_prefecture': {
                "clickable": true,
                "color": '#ff0000',
                "fillColor": '#80FFFFFF',
                "weight": 2.5,
                "opacity": 0.7,
                "fillOpacity": 0.1
            }
      }

    regionSelect = $('#region_scope').val()
    prefectureSelect = $('#prefecture_scope').val()
    guineaAdminLayer0 = L.geoJson(layers['guineaAdmin0'], {
        style: layerStyles['admin0']
    }).addTo(map)

    guineaAdminLayer2 = L.geoJson(layers['guineaAdmin2'], {
        style: layerStyles['region'],
        onEachFeature: function (feature, layer) {
            var labelIcon = L.divIcon({
                className: 'labelLga-icon',
                html: feature.properties.NAME_2
            })
            GINLabels.push(L.marker(layer.getBounds().getCenter(), {
                    icon: labelIcon
                }))

        }
    })

    //Zoom In to region level on selection
    if(region_layer != null)
      map.removeLayer(region_layer)

      region_layer = L.geoJson(layers['guineaAdmin1'], {
        filter: function(feature) {
          return feature.properties.NAME_1 === regionSelect
      },
      style: layerStyles['region'],
      }).addTo(map)
    map.fitBounds(region_layer.getBounds())

    //Zoom In to Prefecture Level on selection

    if(prefecture_layer != null)
      map.removeLayer(prefecture_layer)

      prefecture_layer = L.geoJson(layers['guineaAdmin2'], {
        filter: function(feature) {
          return feature.properties.NAME_2 === prefectureSelect
      },
      style: layerStyles['region'],
      }).addTo(map)
    map.fitBounds(prefecture_layer.getBounds())


}

//Help attached counts of verious multiselection via query to the interface
function displayInfo(feature) {
    var infoContent = buildPopupContent(feature)
    $('#infoContent').html(infoContent)
}


//Normalizaes the data pull from carto by removing unwanted spaces and charater
function normalizeName(source) {
    source = source.replace("_", " ").replace('of_', ' of ')
    source = source.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return source
}

//Help with popup information
function buildPopupContent(feature) {
    var subcontent = ''
    var propertyNames = ['country','region', 'prefecture', 'sub_prefecture', 'place', 'type', 'organization', 'center']
    for (var i = 0; i < propertyNames.length; i++) {
        subcontent = subcontent.concat('<p><strong>' + normalizeName(propertyNames[i]) + ': </strong>' + feature.properties[propertyNames[i]] + '</p>')

    }
    return subcontent;
}

function showLoader() {
    $('.fa-spinner').addClass('fa-spin')
    $('.fa-spinner').show()
}

function hideLoader() {
    $('.fa-spinner').removeClass('fa-spin')
    $('.fa-spinner').hide()
}


function getData(queryUrl) {
    showLoader()
    $.post(queryUrl, function (data) {
        hideLoader()
        addDataToMap(data)
        console.log('Data-Geo::  ', data);
    }).fail(function () {
        console.log("error!")
    });
}

function getAdminLayers() {
    showLoader()
    var adminLayers = {}

    //Add Admin Layers to Map
     $.get('resources/GIN_Admin0.json', function (guinea_admin0) {
        adminLayers['guineaAdmin0'] = guinea_admin0
        addAdminLayersToMap(adminLayers)
		}).fail(function () {
            logError(null)
        })

     $.get('resources/GIN_Admin1.json', function (guinea_admin1) {
        adminLayers['guineaAdmin1']= guinea_admin1
        addAdminLayersToMap(adminLayers)
		}).fail(function () {
            logError(null)
        })


     $.get('resources/GIN_Admin2.json', function (guinea_admin2) {
        adminLayers['guineaAdmin2'] = guinea_admin2
        addAdminLayersToMap(adminLayers)
		}).fail(function () {
            logError(null)
        })


}

function logError(error) {
    console.log("error!")
}



//Filtering Prefecture Based on Selected Region
$(document).ready(function () {
    var allOptions = $('#prefecture_scope option')
    $('#region_scope').change(function () {
        $('#prefecture_scope option').remove()
        var classN = $('#region_scope option:selected').prop('class');
        var opts = allOptions.filter('.' + classN);
        $.each(opts, function (i, j) {
            $(j).appendTo('#prefecture_scope');
        });
    });
});



function showPrefecture() {
    prefecture_show = document.getElementById("prefecture_id");
    prefecture_show1 = document.getElementById("prefecture_id1");
    if(prefecture_select != "") {
         prefecture_show.style.visibility = "visible"
         prefecture_show1.style.visibility = "visible"
    }

    else{
        prefecture_show.style.visibility = "hidden"
        prefecture_show1.style.visibility = "hidden"
    }

}



getAdminLayers()
hideLoader()
/*triggerUiUpdate()*/


//For Auto Date Generation
var monthtext=['January','February','March','April','May','June','July','August','September','October','November','December'];
function populatedropdown(dayfield, monthfield, yearfield){
	var today=new Date()
	var dayfield=document.getElementById(dayfield);
	var monthfield=document.getElementById(monthfield);
	var yearfield=document.getElementById(yearfield);
	for (var i=0; i<31; i++)
		dayfield.options[i]=new Option(i+1, i+1)
	dayfield.options[today.getDate()-1].selected=true;
	for (var m=0; m<12; m++)
		monthfield.options[m]=new Option(monthtext[m], monthtext[m])
	monthfield.options[today.getMonth()].selected=true;
	var thisyear=today.getFullYear()
	for (var y=0; y<20; y++){
		yearfield.options[y]=new Option(thisyear, thisyear)
		thisyear+=1
	}
yearfield.options[0]=new Option(today.getFullYear(), today.getFullYear(), true, true) //select today's year
}
onload=function(){
	 populatedropdown('d', 'm', 'y')
}

var d, m, y, date;
function changeDay(ev)
{
//    d = ev.value;
    d = ev.selectedIndex+1;
    console.log("Day: ", d);
}

function changeMonth(ev)
{
//    m = ev.value;
    m = ev.selectedIndex+1;
    console.log("Month: ", m);
}

function changeYear(ev)
{
    y =  ev.value;
//    y = ev.selectedIndex+2017;
    date = m+"/"+d+"/"+y; 
    console.log("Year: ", y);
    console.log("DATE: ", date);    
}