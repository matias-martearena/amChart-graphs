import { useRef, useLayoutEffect } from 'react'

import { Grid2, Typography } from '@mui/material'

import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

export const ExpensesPerClientScreen: React.FC = () => {
  const chart = useRef<HTMLDivElement>(null)

  const data = [
    {
      tipoDeGasto: 'Personal',
      gastos: 4565820.56,
      color: am5.color(0x86c7f3),
    },
    {
      tipoDeGasto: 'RRHH',
      gastos: 2282910.28,
      color: am5.color(0x4caf50),
    },
    {
      tipoDeGasto: 'Base de datos',
      gastos: 2282910.28,
      color: am5.color(0xffa1b5),
    },
  ]

  const dataSorted = [...data].sort((a, b) => b.gastos - a.gastos)

  useLayoutEffect(() => {
    if (!chart.current) return

    // Paso 1: Creamos el objeto root
    const root = am5.Root.new(chart.current)

    // Paso opcional: Configuramos las animaciones
    root.setThemes([am5themes_Animated.new(root)])

    // Paso 2: Creamos el objeto chart del tipo que se busca
    const chartPie = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        radius: am5.percent(50), // Maneja el radio exterior del grafico (Tamaño)
        // innerRadius: am5.percent(25), // Maneja el radio interior del grafico (Hueco)
      }),
    )

    // Paso 3: Creamos las series del grafico
    const series = chartPie.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'gastos',
        categoryField: 'tipoDeGasto',
        fillField: 'color',
      }),
    )

    // Paso Opcional: Personalizamos las series
    series.slices.template.setAll({
      fillOpacity: 0.8, // Opacidad del color
      strokeWidth: 4, // Ancho del borde
      strokeOpacity: 1, // Opacidad del borde
      stroke: am5.color(0xffffff), // Color del borde
    })

    // Paso 4 opcional: Creamos el objeto legenda
    const legend = chartPie.children.push(
      am5.Legend.new(root, {
        nameField: 'Tipo de gatos',
        fillField: 'color',
        strokeField: 'color',
        layout: root.horizontalLayout, // horizontalLayout \ verticalLayout: Muestra como se ven los textos si apilados o en filas

        x: am5.percent(50),
        centerX: am5.percent(50), // Maneja la centralizacion positiva o negativa del eje Y o X
        y: am5.percent(10),
        centerY: am5.percent(0), // Maneja la centralizacion positiva o negativa del eje Y o X
      }),
    )

    // Paso opcional: Personalizamos las etiquetas de la leyenda
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

    // Paso opcional: Animaciones de aparicion
    chartPie.appear()
    series.appear()

    // Paso 5: Seteamos los datos
    series.data.setAll(dataSorted)
    legend.data.setAll(series.dataItems)

    return () => {
      root.dispose()
    }
  }, [dataSorted])

  return (
    <section>
      <h2>Gastos por cliente</h2>
      <h3>Campos ordenados por gasto</h3>
      <Grid2
        container
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Typography
          variant="h6"
          component="p"
          color="primary"
        >
          Gastos del cliente Direct TV
        </Typography>
        <Grid2
          sx={{ width: '100dvw', height: '500px', marginTop: '-50px' }}
          ref={chart}
          aria-label="Grafica de gastos por cliente"
        ></Grid2>
      </Grid2>
    </section>
  )
}
