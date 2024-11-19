import { useRef, useLayoutEffect } from 'react'

import Grid2 from '@mui/material/Grid2'

import AnimatedTheme from '@amcharts/amcharts5/themes/Animated'
import {
  Root,
  color,
  Container,
  p100,
  p50,
  Label,
  Slice,
} from '@amcharts/amcharts5'
import {
  ValueAxis,
  XYChart,
  AxisRendererY,
  CategoryAxis,
  AxisRendererX,
  ColumnSeries,
} from '@amcharts/amcharts5/xy'
import { PieChart, PieSeries } from '@amcharts/amcharts5/percent'

interface CustomDataItem {
  get(key: 'category' | 'valuePercentTotal'): string | undefined
}

export const HybridGraphScreen: React.FC = () => {
  const hybridGraph = useRef<HTMLDivElement>(null) // Referencia a elemento HTML

  useLayoutEffect(() => {
    const data = [
      {
        category: 'Gastos',
        value: 175386, // Valor acumulado por gastos
        sliceSettings: {
          fill: color(0x4caf50),
        },
        breakdown: [
          {
            category: 'Sales inquiries',
            value: 65231,
          },
          {
            category: 'Support requests',
            value: 76660,
          },
          {
            category: 'Bug reports',
            value: 23542,
          },
          {
            category: 'Other',
            value: 9953,
          },
        ],
      },
      {
        category: 'Ingresos',
        value: 249127, // Valor acumulado por ingresos
        sliceSettings: {
          fill: color(0x86c7f3),
        },
        breakdown: [
          {
            category: 'Personal',
            value: 84212,
          },
          {
            category: 'RRHH',
            value: 32663,
          },
          {
            category: 'Publicity',
            value: 122251,
          },
          {
            category: 'Other',
            value: 10001,
          },
        ],
      },
    ]

    if (!hybridGraph.current) return

    const root = Root.new(hybridGraph.current)

    root.setThemes([AnimatedTheme.new(root)])

    const container = root.container.children.push(
      Container.new(root, {
        width: p100,
        height: p100,
        layout: root.horizontalLayout,
      }),
    )

    const columnChart = container.children.push(
      XYChart.new(root, {
        width: p50,
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
        layout: root.verticalLayout,
      }),
    )

    const yRenderer = AxisRendererY.new(root, {})

    yRenderer.grid.template.setAll({
      location: 1,
    })

    const yAxis = columnChart.yAxes.push(
      CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: yRenderer,
      }),
    )

    const xAxis = columnChart.xAxes.push(
      ValueAxis.new(root, {
        renderer: AxisRendererX.new(root, {
          strokeOpacity: 0.1,
        }),
      }),
    )

    const columnSeries = columnChart.series.push(
      ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: 'value',
        categoryYField: 'category',
      }),
    )

    columnSeries.columns.template.setAll({
      tooltipText: '{categoryY}: {valueX}',
    })

    columnSeries.data.setAll(data)
    columnChart.appear(1000, 100)

    // --- Grafico de pie ---

    const pieChart = container.children.push(
      PieChart.new(root, {
        width: p50,
        innerRadius: p50,
      }),
    )

    const pieSeries = pieChart.series.push(
      PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        fillField: 'color',
      }),
    )

    pieSeries.slices.template.setAll({
      templateField: 'sliceSettings',
      strokeOpacity: 0,
    })

    let currentSlice: Slice | null = null

    const label1: Label = pieChart.seriesContainer.children.push(
      Label.new(root, {
        text: '',
        fontSize: 35,
        fontWeight: 'bold',
        centerX: p50,
        centerY: p50,
      }),
    )

    const label2: Label = pieChart.seriesContainer.children.push(
      Label.new(root, {
        text: '',
        fontSize: 12,
        centerX: p50,
        centerY: p50,
        dy: 30,
      }),
    )

    pieSeries.slices.template.on(
      'active',
      function (active: boolean | undefined, slice: Slice | undefined) {
        if (currentSlice && currentSlice !== slice && active) {
          currentSlice.set('active', false)
        }

        if (!slice) return

        const color = slice.get('fill')

        const dataItem = slice.dataItem as CustomDataItem

        label1.setAll({
          fill: color,
          text: root.numberFormatter.format(
            dataItem?.get('valuePercentTotal') ?? 0,
            "#.'%'",
          ),
        })

        label2.set('text', dataItem?.get('category') ?? '')

        const breakdown =
          (slice.dataItem?.dataContext as { breakdown: string[] | number[] })
            ?.breakdown || []

        const fillColor = slice.get('fill')

        columnSeries.columns.template.setAll({
          fill: fillColor,
          stroke: fillColor,
        })

        columnSeries.data.setAll(breakdown)
        yAxis.data.setAll(breakdown)

        currentSlice = slice
      },
    )

    pieSeries.events.on('datavalidated', function () {
      pieSeries.slices.getIndex(0)?.set('active', true)
    })

    pieSeries.labels.template.set('forceHidden', true)
    pieSeries.ticks.template.set('forceHidden', true)
    pieSeries.data.setAll(data)

    pieChart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [])

  return (
    <section>
      <h2>Grafico de gastos e ingresos</h2>
      <Grid2
        container
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid2
          sx={{ width: '50dvw', height: '500px' }}
          ref={hybridGraph}
          aria-label="Grafica de gastos/ingresos por proyecto"
        ></Grid2>
      </Grid2>
    </section>
  )
}
