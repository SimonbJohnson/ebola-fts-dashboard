var funder_chart = dc.rowChart("#funder");
var organisation_chart = dc.rowChart("#organisation");
var where_chart = dc.pieChart("#where");
var amount_chart = dc.pieChart("#amount");

var cf = crossfilter(data);

cf.funder = cf.dimension(function(d){ return d.Donor; });
cf.organisation = cf.dimension(function(d){ return d.Channel; });
cf.where = cf.dimension(function(d){ return d.Area; });
cf.amount = cf.dimension(function(d){ return d.Committed; });

var funder = cf.funder.group().reduceSum(function(d) {return d.Funding;});
var organisation = cf.organisation.group().reduceSum(function(d) {return d.Funding;});
var where = cf.where.group().reduceSum(function(d) {return d.Funding;});
var amount = cf.amount.group().reduceSum(function(d) {return d.Funding;});
var fundingall = cf.groupAll().reduceSum(function(d) {return d.Funding;});
var all = cf.groupAll();

funder_chart.width(330).height(550)
        .margins({top: 0, left: 10, right: 40, bottom: 40})
        .dimension(cf.funder)
        .group(funder)
        .elasticX(true)
        .data(function(group) {
            return group.top(20);
        })
        .colors(['#81d4fa',
                 '#4fc3f7',
                 '#29b6f6',
                 '#03a9f4',
                 '#039be5',
                 '#0288d1',
                 '#0277bd',
                 '#01579b'
            ])
        .colorDomain([0,8])
        .colorAccessor(function(d, i){return i%8;})
        .title(function(d){
            return formatTitle(d.key,d.value);
            })
        .xAxis().ticks(3);

organisation_chart.width(330).height(550)
        .margins({top: 0, left: 10, right: 40, bottom: 40})
        .dimension(cf.organisation)
        .group(organisation)
        .elasticX(true)
        .data(function(group) {
            return group.top(20);
        })
        .colors(['#81d4fa',
                 '#4fc3f7',
                 '#29b6f6',
                 '#03a9f4',
                 '#039be5',
                 '#0288d1',
                 '#0277bd',
                 '#01579b'
            ])
        .colorDomain([0,8])
        .colorAccessor(function(d, i){return i%8;})
        .title(function(d){
            return formatTitle(d.key,d.value);
            })
        .xAxis().ticks(3);

where_chart.width(260).height(200)
        .dimension(cf.where)
        .group(where)
        .colors(['#ffe082',
                 '#ffd54f',
                 '#ffca28',
                 '#ffc107',
                 '#ffb300',
                 '#ffa000',
                 '#ff8f00',
                 '#ff6f00'
            ])
        .colorDomain([1,8])
        .colorAccessor(function(d, i){return i%7+1;})
        .title(function(d){
            return formatTitle(d.key,d.value);
            })
        .slicesCap(4);

amount_chart.width(260).height(200)
        .dimension(cf.amount)
        .group(amount)
        .colors(['#4CAF50','#FFD600'])
        .colorDomain([0,1])
        .colorAccessor(function(d, i){return i;})
        .filter(["Committed"])
        .title(function(d){
            return formatTitle(d.key,d.value);
            });

dc.dataCount("#fundingtotal")
	.dimension(cf)
	.group(fundingall);

dc.dataCount("#count-info")
	.dimension(cf)
	.group(all);
        

dc.renderAll();

var g = d3.selectAll("#organisation").select("svg").append("g");
    
    g.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", 160)
        .attr("y", 542)
        .text("US Dollars");

var g = d3.selectAll("#funder").select("svg").append("g");
    
    g.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", 160)
        .attr("y", 542)
        .text("US Dollars");

function formatTitle(key, value){
    var v;
    if(value>1000000){
        value=value/1000000;
        v=value.toFixed(2)+" million";
    } else {
        v=value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return key+": $"+v;
}