

document.addEventListener("DOMContentLoaded", function () {
    const req = new XMLHttpRequest();
    req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
    req.send();
    req.onload = function () {
        const json = JSON.parse(req.response);
        D3_RECT_BUILT_(json.data);
    };

    const D3_RECT_BUILT_ = function (data) {
        const h = 500;
        const w = 900;
        const padding = 50;

        let tooltip = d3
            .select('#svg')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        let overlay = d3
            .select('#svg')
            .append('div')
            .attr('class', 'overlay')

        // create SVG
        console.log(data.length);
        const svg = d3.select('#svg').append("svg").attr("height", h).attr("width", w);
        // define scales 
        const xScale = d3.scaleTime().domain([d3.min(data, (d) => new Date(d[0])), d3.max(data, (d) => new Date(d[0]))]).range([padding, w - padding]);
        const yScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d[1])]).range([h - padding, padding]);
        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale);
        // render axises
        svg.append("g").attr("id", "x-axis").attr("transform", "translate(0," + (h - padding) + ")").call(xAxis.ticks(14));
        svg.append("g").attr("id", "y-axis").attr("transform", "translate(" + padding + ",0)").call(yAxis);
        // create text left
        svg.append("text").attr("transform", "rotate(-90)").attr("x", -260).attr("y", 80).text("Gross Domestic Product").style("font-family", "verdana");
        svg.append("text").attr("x", 350).attr("y", 490).text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf").style("font-family", "verdana");

        const years = data.map((e) => {
            let month = e[0].split("-")[1];
            return e[0].split("-")[0] + " " + (month === "01" ? "Q1" : month === "04" ? "Q2" : month === "07" ? "Q3" : month === "10" ? "Q4" : null);
        });

        // create rect shape for each data row
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d) => xScale(new Date(d[0])))
            .attr("y", d => yScale(d[1]))
            .attr("class", "bar")
            .attr("index", (d, i) => i)
            .attr("width", (d, i) => (w - padding) / 275)
            .attr("height", d => h - padding - yScale(d[1]))
            .attr("fill", "#12c2e9")
            .attr('data-date', d => d[0])
            .attr('data-gdp', d => d[1])
            .on("mouseover", (e, d) => {
                let i = e.target.getAttribute("index");
                overlay
                    .transition()
                    .duration(0)
                    .style('height', h - padding - yScale(d[1]) + 'px')
                    .style('width', (w - padding) / 275 + 'px')
                    .style('opacity', 0.9)
                    .style('left', xScale(new Date(d[0])) + 'px')
                    .style('top', yScale(d[1]) + 'px')
                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip
                    .html(
                        years[i] +
                        '<br>' +
                        '$' +
                        data[i][1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
                        ' Billion'
                    )
                    .attr('data-date', data[i][0])
                    .style('left', xScale(new Date(d[0])) + 50 + 'px')
                    .style('top', (h - padding) / 1.5 + 'px')
            })
            .on('mouseout', function () {
                tooltip.transition().duration(300).style('opacity', 0);
                overlay.transition().duration(300).style('opacity', 0);
            });

    };

});