
// after the HTML document is loaded to the browser
document.addEventListener("DOMContentLoaded", function (event) {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
        .then(response => response.json())
        .then(data => {
            RENDER_SCATTERPLOT_GRAPH_(data);
        });
});
// function to render the Sacatterplot graph
function RENDER_SCATTERPLOT_GRAPH_(data) {

    const h = 580;
    const w = 900;
    const padding = 70;
    // create tooltip
    var tooltip = d3.select("#svg").append("div").attr("id", "tooltip").style("opacity", 0);

    const parseTime = d3.timeParse("%M:%S");
    const parseYear = d3.timeParse("%Y");

    let times = data.map((e) => {
        let time = e["Time"].split(":");
        let date = new Date(1970, 0, 1, 0, time[0], time[1]);
        return date;
    });
    // create the svg node
    const svg = d3.select("#svg")
        .append("svg")
        .attr("height", h)
        .attr("width", w);
    // create Scales
    const yScale = d3.scaleTime().domain([d3.max(times), d3.min(times)]).range([h - padding, padding]);
    const xScale = d3.scaleTime().domain([d3.min(data, d => parseYear(d['Year'] - 1)), d3.max(data, d => parseYear(d['Year'] + 1))]).range([padding, w - padding]);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
    // Add Axis to the svg
    svg.append("g").attr("transform", "translate(0," + (h - padding) + ")").attr("id", "x-axis").call(xAxis);
    svg.append("g").attr("transform", "translate(" + padding + ",0)").attr("id", "y-axis").call(yAxis);

    // Add Left Axis title
    svg.append("text").attr("transform", "rotate(-90)").attr("x", -200).attr("y", 20).text("Time in Minutes").style("font-family", "verdana").style("font-size", "15px");

    // render circles
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(parseYear(d['Year'])))
        .attr("cy", d => yScale(new Date(1970, 0, 1, 0, d["Time"].split(":")[0], d["Time"].split(":")[1])))
        .attr("r", 5)
        .attr("fill", d => d['Doping'] === "" ? "rgba(255, 165, 0,0.6)" : "rgba(173,216,230,0.6)")
        .style("stroke", "black")
        .attr("class", "dot")
        .attr("data-xvalue", d => parseInt(d['Year']))
        .attr("data-yvalue", d => new Date(1970, 0, 1, 0, d["Time"].split(":")[0], d["Time"].split(":")[1]))
        .on("mouseover", (event, d) => {
            tooltip
                .transition().duration(400)
                .style("opacity", "0.9");
            tooltip
                .html(
                    d['Name'] + ":" + d["Nationality"]
                    + "<br />"
                    + "Year :" + d["Year"] + "," + "Time :" + d["Time"] +
                    "<br />"
                    + (d["Doping"] !== "" ? "<br>" + d["Doping"] : "")
                )
                .attr("data-year", parseInt(d['Year']))
                .style("left", xScale(parseYear(d['Year'])) + 5 + "px")
                .style("top", yScale(new Date(1970, 0, 1, 0, d["Time"].split(":")[0], d["Time"].split(":")[1])) - (tooltip.style("height").replace(/(px)/, "") / 2) - 5 + "px")
        })
        .on("mouseout", (event, d) => {
            tooltip
                .transition().duration(400)
                .style("opacity", "0");
        });

    // add rect for scale

    //No doping allegations
    d3.select("#svg").append("div").attr("class", "rectScale").attr("id", "legend").style('left', w - padding + 'px')
        .style('top', 200 + 'px').style("background-color", "rgb(255, 165, 0)").style("border", "1px solid black");
    svg.append("text").attr("x", w - padding - 90).attr("y", 210).text("No doping allegations").style("font-family", "verdana").style("font-size", "8px");
    // Riders with doping allegations
    d3.select("#svg").append("div").attr("class", "rectScale").style('left', w - padding + 'px')
        .style('top', 220 + 'px').style("background-color", "rgb(173,216,230)").style("border", "1px solid black");
    svg.append("text").attr("x", w - padding - 123).attr("y", 230).text("Riders with doping allegations").style("font-family", "verdana").style("font-size", "8px");



}