import { useRef, useLayoutEffect } from 'react'

import { Grid2, Typography } from '@mui/material'

import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

export const ExpensesIncomesScreen: React.FC = () => {
  const expensesChart = useRef<HTMLDivElement>(null)
  const incomesChart = useRef<HTMLDivElement>(null)

  const data = [
    {
      tipoDeGasto: 'Personal',
      tipoDeIngreso: 'Proyecto',
      gastos: 4565820.56,
      ingreso: 5565920.56,
      color: am5.color(0x86c7f3),
    },
    {
      tipoDeGasto: 'RRHH',
      tipoDeIngreso: 'Publicidad',
      gastos: 2282910.28,
      ingreso: 3212910.28,
      color: am5.color(0x4caf50),
    },
    {
      tipoDeGasto: 'Base de datos',
      tipoDeIngreso: 'Licitacion',
      gastos: 2282910.28,
      ingreso: 822910.28,
      color: am5.color(0xffa1b5),
    },
  ]

  const dataSorted = [...data].sort((a, b) => b.gastos - a.gastos)
  const dataSortedByIncome = [...data].sort((a, b) => b.ingreso - a.ingreso)

  useLayoutEffect(() => {
    if (!expensesChart.current) return
    if (!incomesChart.current) return

    const root = am5.Root.new(expensesChart.current)
    const root2 = am5.Root.new(incomesChart.current)

    root.setThemes([am5themes_Animated.new(root)])
    root2.setThemes([am5themes_Animated.new(root2)])

    const chartPie = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        radius: am5.percent(50),
        y: am5.percent(30),
      }),
    )

    const chartPie2 = root2.container.children.push(
      am5percent.PieChart.new(root2, {
        layout: root2.verticalLayout,
        radius: am5.percent(50),
        innerRadius: am5.percent(50),
        y: am5.percent(30),
      }),
    )

    const series = chartPie.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'gastos',
        categoryField: 'tipoDeGasto',
        fillField: 'color',
      }),
    )

    const series2 = chartPie2.series.push(
      am5percent.PieSeries.new(root2, {
        valueField: 'ingreso',
        categoryField: 'tipoDeIngreso',
        fillField: 'color',
      }),
    )

    series.slices.template.setAll({
      fillOpacity: 0.8,
      strokeWidth: 4,
      strokeOpacity: 1,
      stroke: am5.color(0xffffff),
    })

    series2.slices.template.setAll({
      fillOpacity: 0.8,
      strokeWidth: 4,
      strokeOpacity: 1,
      stroke: am5.color(0xffffff),
    })

    const legend = chartPie.children.push(
      am5.Legend.new(root, {
        nameField: 'Tipo de gatos',
        fillField: 'color',
        strokeField: 'color',
        layout: root.verticalLayout,

        x: am5.percent(50),
        centerX: am5.percent(50),
        y: am5.percent(0),
        centerY: am5.percent(50),
      }),
    )

    const legend2 = chartPie2.children.push(
      am5.Legend.new(root2, {
        nameField: 'Tipo de ingreso',
        fillField: 'color',
        strokeField: 'color',
        layout: root2.verticalLayout,

        x: am5.percent(50),
        centerX: am5.percent(50),
        y: am5.percent(0),
        centerY: am5.percent(50),
      }),
    )

    legend.valueLabels.template.set('forceHidden', true)
    legend.labels.template.set('text', '{name}')
    legend.labels.template.adapters.add('text', (text, target) => {
      const dataItem = target.dataItem?.dataContext as {
        gastos: number
        tipoDeGasto: string
      }

      if (dataItem) {
        return `${dataItem.tipoDeGasto}: $${dataItem.gastos.toLocaleString(
          'en-US',
          { minimumFractionDigits: 2 },
        )}`
      }

      return text
    })

    legend2.valueLabels.template.set('forceHidden', true)
    legend2.labels.template.set('text', '{name}')
    legend2.labels.template.adapters.add('text', (text, target) => {
      const dataItem = target.dataItem?.dataContext as {
        ingreso: number
        tipoDeIngreso: string
      }

      if (dataItem) {
        return `${dataItem.tipoDeIngreso}: $${dataItem.ingreso.toLocaleString(
          'en-US',
          { minimumFractionDigits: 2 },
        )}`
      }

      return text
    })

    chartPie.appear()
    series.appear()
    chartPie2.appear()
    series2.appear()

    series.data.setAll(dataSorted)
    legend.data.setAll(series.dataItems)
    series2.data.setAll(dataSortedByIncome)
    legend2.data.setAll(series2.dataItems)

    return () => {
      root.dispose()
      root2.dispose()
    }
  }, [dataSorted, dataSortedByIncome])

  return (
    <section>
      <h2>Gastos e ingresos por cliente</h2>
      <h3>Campos ordenados por gasto e ingresos</h3>
      <Typography
        variant="h6"
        component="p"
        color="primary"
        sx={{ textAlign: 'center' }}
      >
        Gastos e ingresos del cliente IRSA
      </Typography>
      <Grid2
        container
        justifyContent="space-evenly"
        alignItems="center"
        flexWrap="wrap"
        gap={5}
      >
        <Grid2
          sx={{ width: '45dvw', height: '350px' }}
          ref={expensesChart}
          aria-label="Grafica de gastos por cliente"
        ></Grid2>
        <Grid2
          sx={{ width: '45dvw', height: '350px' }}
          ref={incomesChart}
          aria-label="Grafica de ingresos por cliente"
        ></Grid2>
      </Grid2>
    </section>
  )
}
