'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { experiences } from '@/data/experience'

/**
 * D3.js Interactive Timeline Chart
 * Visualizes work experience with an interactive SVG timeline
 * Shows company nodes, duration, and allows for exploration
 */
export function TimelineChart() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Dimensions
    const margin = { top: 40, right: 20, bottom: 40, left: 20 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = 200

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Parse dates
    const parseDate = (dateStr: string) => {
      if (dateStr === 'Present') return new Date()
      const [month, year] = dateStr.split(' ')
      const monthNum = new Date(Date.parse(month + ' 1, 2000')).getMonth()
      return new Date(parseInt(year), monthNum)
    }

    // Prepare data
    const timelineData = experiences.map((exp) => ({
      company: exp.company,
      role: exp.role,
      startDate: parseDate(exp.startDate),
      endDate: parseDate(exp.endDate),
      current: exp.current,
      color: exp.company === 'BDIPlus' ? '#4C8572' : '#F2B647',
    }))

    // Create time scale
    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(timelineData, (d) => d.startDate)!,
        d3.max(timelineData, (d) => d.endDate)!,
      ])
      .range([0, width])

    // Draw timeline line
    svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', height / 2)
      .attr('x2', width)
      .attr('y2', height / 2)
      .attr('stroke', '#E0EFE9')
      .attr('stroke-width', 2)

    // Create company nodes
    const nodes = svg
      .selectAll('.node')
      .data(timelineData)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${xScale(d.startDate)},${height / 2})`)

    // Add circles for companies
    nodes
      .append('circle')
      .attr('r', 12)
      .attr('fill', (d) => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).transition().duration(200).attr('r', 16)
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(200).attr('r', 12)
      })

    // Add labels
    nodes
      .append('text')
      .attr('y', -25)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1F2933')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text((d) => d.company)

    nodes
      .append('text')
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6B7280')
      .attr('font-size', '11px')
      .text((d) => {
        const duration = d3.timeYear.count(d.startDate, d.endDate)
        const months = d3.timeMonth.count(d.startDate, d.endDate) % 12
        return `${duration}y ${months}m`
      })

    // Add axis
    const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat((d) => d3.timeFormat('%Y')(d as Date))

    svg
      .append('g')
      .attr('transform', `translate(0,${height - 20})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#6B7280')
      .attr('font-size', '12px')

    svg.selectAll('.domain, .tick line').attr('stroke', '#E0EFE9')
  }, [])

  return (
    <div className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        className="w-full min-w-[600px]"
        style={{ minHeight: '280px' }}
      />
    </div>
  )
}
