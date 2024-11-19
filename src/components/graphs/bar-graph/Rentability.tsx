import { useRef, useLayoutEffect } from 'react'

import Grid2 from '@mui/material/Grid2'

import AnimatedTheme from '@amcharts/amcharts5/themes/Animated'
import { Root, percent, color, Legend, Tooltip } from '@amcharts/amcharts5'
import {
  XYChart,
  XYCursor,
  CategoryAxis,
  ValueAxis,
  AxisRendererX,
  AxisRendererY,
  ColumnSeries,
} from '@amcharts/amcharts5/xy'

export const RentabilityScreen: React.FC = () => {
  const rentabilityRef = useRef<HTMLDivElement>(null)

  const clientes = [
    {
      nombreCliente: 'ASAP',
      gastos: 4565820.56,
      ingreso: 5565920.56,
      rentabilidad: 1000100,
    },
    {
      nombreCliente: 'IRSA',
      gastos: 2282910.28,
      ingreso: 3212910.28,
      rentabilidad: 930000,
    },
    {
      nombreCliente: 'Direct TV',
      gastos: 2282910.28,
      ingreso: 8822910.28,
      rentabilidad: 6540000,
    },
  ]

  const dataSorted = [...clientes].sort(
    (a, b) => b.rentabilidad - a.rentabilidad,
  )

  useLayoutEffect(() => {
    if (!rentabilityRef.current) return

    const root = Root.new(rentabilityRef.current)

    root.setThemes([AnimatedTheme.new(root)])

    const chart = root.container.children.push(
      XYChart.new(root, {
        panX: true,
        panY: true,
        paddingTop: 30,
      }),
    )

    const xAxis = chart.xAxes.push(
      CategoryAxis.new(root, {
        renderer: AxisRendererX.new(root, {}),
        categoryField: 'nombreCliente',
      }),
    )

    const yAxis = chart.yAxes.push(
      ValueAxis.new(root, {
        renderer: AxisRendererY.new(root, {}),
      }),
    )

    const rentability = chart.series.push(
      ColumnSeries.new(root, {
        name: 'Rentabilidad',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'rentabilidad',
        valueXField: 'nombreCliente',
        categoryXField: 'nombreCliente',
        fill: color(0xffa1b5),
        tooltip: Tooltip.new(root, {
          labelText: '[bold]{name}[/]\n{valueX}: ${valueY}',
        }),
      }),
    )

    const legend = chart.children.push(
      Legend.new(root, {
        nameField: 'Rentabilidad',
        fillField: 'color',
        strokeField: 'color',
        layout: root.horizontalLayout,

        x: percent(60),
        centerX: percent(60),
        y: percent(-10),
        centerY: percent(0),
      }),
    )

    chart.set('cursor', XYCursor.new(root, {}))

    chart.get('cursor')?.lineX.setAll({
      strokeOpacity: 0,
    })

    chart.get('cursor')?.lineY.setAll({
      strokeOpacity: 0,
    })

    chart.appear(1000, 100)
    rentability.appear(1000)

    xAxis.data.setAll(dataSorted)

    rentability.data.setAll(dataSorted)

    legend.data.setAll(chart.series.values)

    return () => {
      root.dispose()
    }
  }, [dataSorted])

  return (
    <section>
      <h3>Solo incluyendo rentabilidad</h3>
      <Grid2
        container
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid2
          sx={{ width: '50dvw', height: '50dvh' }}
          ref={rentabilityRef}
          aria-label="Grafica de rentabilidad por cliente"
        ></Grid2>
      </Grid2>
    </section>
  )
}
