import React, { useLayoutEffect } from 'react'

import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

export const ExampleGraph: React.FC = () => {
  useLayoutEffect(() => {
    const exampleRoot = am5.Root.new('example')

    exampleRoot.setThemes([am5themes_Animated.new(exampleRoot)])

    const chart = exampleRoot.container.children.push(
      am5xy.XYChart.new(exampleRoot, {
        panY: false,
        layout: exampleRoot.verticalLayout,
      }),
    )

    // Define data
    const data = [
      {
        category: 'Research',
        value1: 1000,
        value2: 588,
      },
      {
        category: 'Marketing',
        value1: 1200,
        value2: 1800,
      },
      {
        category: 'Sales',
        value1: 850,
        value2: 1230,
      },
    ]

    // Create Y-axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(exampleRoot, {
        renderer: am5xy.AxisRendererY.new(exampleRoot, {}),
      }),
    )

    // Create X-Axis
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(exampleRoot, {
        renderer: am5xy.AxisRendererX.new(exampleRoot, {}),
        categoryField: 'category',
      }),
    )

    xAxis.data.setAll(data)

    // Create series
    const series1 = chart.series.push(
      am5xy.ColumnSeries.new(exampleRoot, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value1',
        categoryXField: 'category',
      }),
    )

    series1.data.setAll(data)

    const series2 = chart.series.push(
      am5xy.ColumnSeries.new(exampleRoot, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value2',
        categoryXField: 'category',
      }),
    )

    series2.data.setAll(data)

    // Add legend
    const legend = chart.children.push(am5.Legend.new(exampleRoot, {}))
    legend.data.setAll(chart.series.values)

    // Add cursor
    chart.set('cursor', am5xy.XYCursor.new(exampleRoot, {}))

    return () => {
      exampleRoot.dispose()
    }
  }, [])

  return (
    <section>
      <h2>Grafico de ejemplo</h2>
      <div
        id="example"
        style={{ width: '500px', height: '500px' }}
      ></div>
    </section>
  )
}
