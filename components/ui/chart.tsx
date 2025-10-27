/**
 * @file components/ui/chart.tsx
 * @description This file provides a robust and customizable charting solution built on Recharts, offering a wide range of chart types and interactive features.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'

import { cn } from '@/lib/utils'

/**
 * @overview Defines the available themes and their corresponding CSS selectors for chart styling.
 * @constant {object} THEMES
 * @property {string} light - CSS selector for the light theme.
 * @property {string} dark - CSS selector for the dark theme.
 */
const THEMES = { light: '', dark: '.dark' } as const

/**
 * @typedef {object} ChartConfig
 * @property {object} [k] - Dynamic keys representing different data series or elements in the chart.
 * @property {React.ReactNode} [k.label] - A human-readable label for the chart element.
 * @property {React.ComponentType} [k.icon] - An optional icon component to represent the chart element.
 * @property {string} [k.color] - The color for the chart element (if not using theme-based colors).
 * @property {Record<keyof typeof THEMES, string>} [k.theme] - Theme-specific colors for the chart element.
 */
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

/**
 * @typedef {object} ChartContextProps
 * @property {ChartConfig} config - The chart configuration object.
 */
type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

/**
 * @overview A hook to access the Chart context.
 * Must be used within a `<ChartContainer />` component.
 * 
 * @throws {Error} If used outside of a `<ChartContainer />` component.
 * @returns {ChartContextProps} The chart context object.
 */
function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}

/**
 * @overview The ChartContainer component.
 * This is the main container for all Recharts-based charts, providing context for chart configuration and styling.
 * It also handles responsive rendering of the charts.
 * 
 * @param {object} props - The properties for the ChartContainer component.
 * @param {string} [props.id] - An optional ID for the chart container. A unique ID will be generated if not provided.
 * @param {string} [props.className] - Optional CSS class names to apply to the container.
 * @param {React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']} props.children - The Recharts components to be rendered within the responsive container.
 * @param {ChartConfig} props.config - The configuration object for the chart, defining labels, icons, and colors.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ChartContainer component.
 */
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >['children']
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = 'Chart'

/**
 * @overview The ChartStyle component.
 * Dynamically generates a `<style>` block to apply theme-aware colors to chart elements based on the provided `ChartConfig`.
 * 
 * @param {object} props - The properties for the ChartStyle component.
 * @param {string} props.id - The unique ID of the chart to which these styles apply.
 * @param {ChartConfig} props.config - The chart configuration object containing color definitions.
 * 
 * @returns {JSX.Element | null} The style element or null if no color configuration is present.
 */
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color,
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  )
}

/**
 * @overview Re-export of the `RechartsPrimitive.Tooltip` component.
 * Used to display detailed information about a data point when hovered over on a chart.
 * 
 * @see http://recharts.org/en-US/api/Tooltip
 * 
 * @returns {JSX.Element} The ChartTooltip component.
 */
const ChartTooltip = RechartsPrimitive.Tooltip

/**
 * @overview The ChartTooltipContent component.
 * Provides customizable content for chart tooltips, displaying data point information with optional icons and formatting.
 * It dynamically adjusts based on active payload and chart configuration.
 * 
 * @param {object} props - The properties for the ChartTooltipContent component.
 * @param {boolean} [props.active] - Indicates if the tooltip is active and should be displayed.
 * @param {Array} [props.payload] - The data payload for the tooltip, containing information about hovered data points.
 * @param {string} [props.className] - Optional CSS class names to apply to the tooltip content wrapper.
 * @param {('line' | 'dot' | 'dashed')} [props.indicator='dot'] - The style of the indicator for each data item (line, dot, or dashed).
 * @param {boolean} [props.hideLabel=false] - If true, the main label of the tooltip will be hidden.
 * @param {boolean} [props.hideIndicator=false] - If true, the color indicator next to each item will be hidden.
 * @param {React.ReactNode} [props.label] - The main label to display at the top of the tooltip.
 * @param {Function} [props.labelFormatter] - A formatter function for the main label.
 * @param {string} [props.labelClassName] - Optional CSS class names for the main label.
 * @param {Function} [props.formatter] - A formatter function for individual payload values.
 * @param {string} [props.color] - A default color to use for indicators if not specified in the payload or config.
 * @param {string} [props.nameKey] - The key to use for extracting the name from payload items.
 * @param {string} [props.labelKey] - The key to use for extracting the label from payload items.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element | null} The ChartTooltipContent component or null if not active or no payload.
 */
const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<'div'> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: 'line' | 'dot' | 'dashed'
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || 'value'}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === 'string'
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn('font-medium', labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn('font-medium', labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot'

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center',
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                            {
                              'h-2.5 w-2.5': indicator === 'dot',
                              'w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            },
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center',
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
ChartTooltipContent.displayName = 'ChartTooltip'

/**
 * @overview Re-export of the `RechartsPrimitive.Legend` component.
 * Used to display a legend for the chart data series.
 * 
 * @see http://recharts.org/en-US/api/Legend
 * 
 * @returns {JSX.Element} The ChartLegend component.
 */
const ChartLegend = RechartsPrimitive.Legend

/**
 * @overview The ChartLegendContent component.
 * Provides customizable content for chart legends, displaying series names, icons, and colors based on chart configuration.
 * 
 * @param {object} props - The properties for the ChartLegendContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the legend container.
 * @param {boolean} [props.hideIcon=false] - If true, the icon next to each legend item will be hidden.
 * @param {Array} [props.payload] - The data payload for the legend, containing information about data series.
 * @param {('top' | 'bottom' | 'left' | 'right' | 'middle')} [props.verticalAlign='bottom'] - Vertical alignment of the legend.
 * @param {string} [props.nameKey] - The key to use for extracting the name from payload items.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element | null} The ChartLegendContent component or null if no payload.
 */
const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> &
    Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey },
    ref,
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-4',
          verticalAlign === 'top' ? 'pb-3' : 'pt-3',
          className,
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || 'value'}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={
                'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
              }
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  },
)
ChartLegendContent.displayName = 'ChartLegend'

/**
 * @overview Helper function to extract item configuration from a payload based on `ChartConfig`.
 * It looks up the configuration for a given key within the chart's config, considering potential nested payload structures.
 * 
 * @param {ChartConfig} config - The overall chart configuration object.
 * @param {unknown} payload - The raw payload object from Recharts (e.g., from Tooltip or Legend).
 * @param {string} key - The key to use for looking up the item configuration in `config`.
 * 
 * @returns {object | undefined} The configuration object for the specified item, or `undefined` if not found.
 */
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
