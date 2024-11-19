import { useRef, useLayoutEffect } from 'react'

import Grid2 from '@mui/material/Grid2'

import AnimatedTheme from '@amcharts/amcharts5/themes/Animated'
import { Root, percent, color, Label } from '@amcharts/amcharts5'
import { ValueAxis, AxisBullet } from '@amcharts/amcharts5/xy'
import { RadarChart } from '@amcharts/amcharts5/.internal/charts/radar/RadarChart'
import { AxisRendererCircular } from '@amcharts/amcharts5/.internal/charts/radar/AxisRendererCircular'
import { ClockHand } from '@amcharts/amcharts5/.internal/charts/radar/ClockHand'

export const ClockRentabilityScreen: React.FC = () => {
  const clockRentability = useRef<HTMLDivElement>(null) // Referencia a elemento HTML
  const rentabilityPercent: number = 23 // Valor del porcentaje de rentabilidad

  useLayoutEffect(() => {
    if (!clockRentability.current) return

    const root = Root.new(clockRentability.current) // Paso 1: Creacion de root

    root.setThemes([AnimatedTheme.new(root)]) // Seteo de animaciones

    // Paso 2: Creacion del contenedor
    const chart = root.container.children.push(
      RadarChart.new(root, {
        panX: false,
        panY: false,
        startAngle: 180, // Punto de inicio
        endAngle: 360, // Punto de fin
      }),
    )

    // Paso 3: Creacion del radio interno
    const axisRenderer = AxisRendererCircular.new(root, {
      innerRadius: -40, // Tamaño del radio interno (+ menor radio, - mayor radio)
    })

    // Paso 4: Creacion del eje X
    const xAxis = chart.xAxes.push(
      ValueAxis.new(root, {
        maxDeviation: 0,
        min: -20, // Porcentaje minimo del radio
        max: 100, // Porcentaje maximo del radio
        strictMinMax: true,
        renderer: axisRenderer,
      }),
    )

    // Paso 5: Creacion de la aguja
    const axisDataItem = xAxis.makeDataItem({})

    // Paso 6: Creacion de rango de valores
    xAxis.createAxisRange(axisDataItem)

    axisDataItem.set('value', rentabilityPercent) // Valor de la aguja

    const clockHand = ClockHand.new(root, {
      pinRadius: 50, // Contorno del porcentaje interno
      innerRadius: 50, // Contorno del porcentaje externo
      bottomWidth: 0, // Junta ambas lineas
      topWidth: 0, // Junta ambas lineas
      radius: percent(100), // Largo de la linea del porcentaje
    })

    // Radio con porcentaje
    clockHand.pin.setAll({
      fillOpacity: 0.1, // Color de fondo del porcentaje
      strokeOpacity: 0.8, // Opacidad del radio puntaedo del porcentaje
      stroke: color(0xffa1b5),
    })

    // Brazos de la aguja
    clockHand.hand.setAll({
      fill: color(0xffa1b5),
      stroke: color(0xffa1b5),
      strokeOpacity: 0.8,
    })

    const bullet = axisDataItem.set(
      'bullet',
      AxisBullet.new(root, {
        sprite: clockHand,
      }),
    )

    // Funcion que setea el texto de la aguja
    const bulletFn = () => {
      const value = axisDataItem.get('value') as number
      label.set('text', Math.round(value).toString() + '%')
    }

    bullet.get('sprite').on('rotation', bulletFn)

    // Configuracion del label
    const label = chart.radarContainer.children.push(
      Label.new(root, {
        fontSize: '1.3em',
        textAlign: 'center',
        centerX: percent(50),
        centerY: percent(50),
        fill: color(0x0a0a0a),
      }),
    )

    // Primer rango del radio
    const axisRange0 = xAxis.createAxisRange(
      xAxis.makeDataItem({
        above: true, // Pone el color por encima
        value: -20, // El porcentaje donde comenzara el color
        endValue: 100, // El porcentaje donde terminara el color
      }),
    )

    axisRange0.get('axisFill')?.setAll({
      visible: true,
      fill: color(0x86c7f3),
    })

    // Segundo rango del radio
    const axisRange1 = xAxis.createAxisRange(
      xAxis.makeDataItem({
        above: true,
        value: rentabilityPercent, // Porcentaje donde comenzara el color
        endValue: 100, // Porcentaje donde terminara el color
      }),
    )

    axisRange1.get('axisFill')?.setAll({
      visible: true,
      fill: color(0x4caf50),
    })

    chart.getNumberFormatter().set('numberFormat', "#'%'")
    chart.appear(1000)

    return () => {
      root.dispose()
    }
  }, [])

  return (
    <section>
      <h2>Grafico de porcentaje de rentabilidad</h2>
      <Grid2
        container
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid2
          sx={{ width: '50dvw', height: '500px' }}
          ref={clockRentability}
          aria-label="Grafica de porcentaje de rentabilidad por proyecto"
        ></Grid2>
      </Grid2>
    </section>
  )
}
