define(["jquery","jquery-ui","websockets/binary_websockets","navigation/navigation","jquery-growl","common/util"],function(a,b,c,d){"use strict";function e(b){a.isArray(b)&&(b.sort(sortAlphaNum("display_name")),a.each(b,function(b,c){a.each(c,function(b,c){a.isArray(c)&&e(c)})}))}function f(b){require(["validation/validation","charts/chartWindow"],function(c,d){if(!c.validateIfNoOfChartsCrossingThreshold(d.totalWindows()))return void a.growl.error({message:"No more charts allowed!"});var e=a("#instrumentsDialog").dialog("option","title"),f=a("#instrumentsDialog").data("symbol"),h=a("#instrumentsDialog").data("delay_amount"),i=convertToTimeperiodObject(b),j=null;i?c.validateNumericBetween(i.intValue(),parseInt(a("#timePeriod").attr("min")),parseInt(a("#timePeriod").attr("max")))?h<=i.timeInSeconds()/60?(d.addNewWindow(f,e,b,null,isTick(b)?"line":"candlestick"),g.call(a("#instrumentsDialog"))):j="Charts of less than "+convertToTimeperiodObject(h+"m").humanReadableString()+" are not available for the "+e+".":j="Only numbers between "+a("#timePeriod").attr("min")+" to "+a("#timePeriod").attr("max")+" is allowed for "+a("#units option:selected").text()+"!":j="Only numbers between 1 to 100 is allowed!",j&&(a("#timePeriod").addClass("ui-state-error"),a.growl.error({message:"Only numbers between 1 to 100 is allowed!"}))})}function g(){a(this).dialog("close"),a(this).find("*").removeClass("ui-state-error")}function h(b,c){a.each(c,function(c,d){var e=d.submarkets||d.instruments,i="<span class='nav-submenu-caret'></span>",j=e?d.display_name+i:d.display_name,k=a("<a href='#'>"+j+"</a>");e&&k.addClass("nav-dropdown-toggle");var l=a("<li>").append(k).data("symbol",d.symbol).data("delay_amount",d.delay_amount).appendTo(b);if(e){var m=a("<ul>");m.appendTo(l),h(m,d.submarkets||d.instruments)}else k.click(function(){0==a("#instrumentsDialog").length?a.get("instruments/instruments.html",function(b){a(b).css("display","none").appendTo("body"),a("#standardPeriodsButtonContainer").find("button").click(function(){f(a(this).attr("id"))}).button(),a("#units").change(function(){if("t"==a(this).val())a("#timePeriod").val("1").attr("disabled","disabled").attr("min",1).attr("max",1);else{a("#timePeriod").removeAttr("disabled");var b=a("#units").val(),c={m:59,h:23,d:3}[b]||120;a("#timePeriod").attr("max",c)}}),a("#units").trigger("change"),a("#instrumentsDialog").dialog({autoOpen:!1,resizable:!1,width:260,my:"center",at:"center",of:window,buttons:[{text:"Ok",click:function(){f(a("#timePeriod").val()+a("#units").val())}},{text:"Cancel",click:function(){g.call(this)}}]}),a("#instrumentsDialog").dialog("option","title",l.text()).data("symbol",l.data("symbol")).data("delay_amount",l.data("delay_amount")),a("#instrumentsDialog").dialog("open"),a("#instrumentSelectionMenuDIV").hide()}):(a("#instrumentsDialog").dialog("option","title",a(this).text()).data("symbol",a(this).data("symbol")).data("delay_amount",a(this).data("delay_amount")),a("#instrumentsDialog").dialog("open"),a("#instrumentSelectionMenuDIV").hide()),a(document).click()})})}function i(a){j=a.trading_times.markets.map(function(a){var b={name:a.name,display_name:a.name};return b.submarkets=a.submarkets.map(function(a){var b={name:a.name,display_name:a.name};return b.instruments=a.symbols.map(function(a){return{symbol:a.symbol,display_name:a.name,delay_amount:a.delay_amount}}),b}),b}),e(j)}var j=[];return{init:function(b){a.isEmptyObject(j)&&(loadCSS("instruments/instruments.css"),c.cached.send({trading_times:(new Date).toISOString().slice(0,10)}).then(function(c){if(!a.isEmptyObject(c)){i(c);var e=a("#nav-menu").find(".instruments"),f=a("<ul>");f.appendTo(e),h(f,j),d.updateDropdownToggles(),b&&b(j)}})["catch"](void 0))},getMarketData:function(){return j},isMarketDataPresent:function(b,c){var d=!1;c||(c=j);var e=this;return a.each(c,function(c,f){return f.submarkets||f.instruments?d=e.isMarketDataPresent(b,f.submarkets||f.instruments):a.trim(f.display_name)==a.trim(b)&&(d=!0),!d}),d},getSpecificMarketData:function(b,c){var d={};c||(c=j);var e=this;return a.each(c,function(c,f){return f.submarkets||f.instruments?d=e.getSpecificMarketData(b,f.submarkets||f.instruments):a.trim(f.display_name)==a.trim(b)&&(d=f),a.isEmptyObject(d)}),d}}});