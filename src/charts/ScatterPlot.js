import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';


const ScatterPlot = ({ chartData }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (chartData && svgRef.current) {
      const svg = d3.select(svgRef.current);

      // Clear any existing elements in the SVG
      svg.selectAll('*').remove();

      // Set up the dimensions and margins
      const margin = { top: 60, right: 60, bottom: 60, left: 60 };
      const width = svg.attr('width') - margin.left - margin.right;
      const height = svg.attr('height') - margin.top - margin.bottom;

      // Create scales for x and y axes
      const x = d3.scaleLinear().domain([0, d3.max(chartData, d => d['Population_Density'])]).range([0, width]);
      const y = d3.scaleLinear().domain([0, d3.max(chartData, d => d['Population_Growth_Rate'])]).range([height, 0]);

      // Set the domain for x and y scales based on your data
      x.domain([0, d3.max(chartData, d => Number(d['Population_Density']))]);
      y.domain([0, d3.max(chartData, d => Number(d['Population_Growth_Rate']))]);

      svg.append('text')
  .attr('class', 'axis-title')
  .attr('x', width / 2)
  .attr('y', height + margin.bottom+50)
  .style('text-anchor', 'middle')
  .text('Population Density');

// Add the y-axis title
svg.append('text')
  .attr('class', 'axis-title')
  .attr('transform', 'rotate(-90)')
  .attr('x', -height / 2)
  .attr('y', -margin.left+50)
  .attr('dy', '2em')
  .style('text-anchor', 'middle')
  .text('Population Growth');

      // Set up scale for circle radius based on the value
      const radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(chartData, d => Number(d['Population (000s)']))])
        .range([2, 10]);

      // Add the x-axis
      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
        .call(d3.axisBottom(x));

      // Add the y-axis
      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(d3.axisLeft(y).tickFormat(d3.format('.0%')))
        ;

      // Add circles representing the data points
      svg
        .selectAll('circle')
        .data(chartData)
        .enter()
        .append('circle')
        .attr('cx', d => x(d['Population_Density']) + margin.left)
        .attr('cy', d => y(d['Population_Growth_Rate']) + margin.top)
        .attr('r', d => radiusScale(d['Population (000s)']))
        .style('fill', 'steelblue');
    }
  }, [chartData]);

  return (
    <svg ref={svgRef} width={700} height={500}></svg>
  );
};

export default ScatterPlot;