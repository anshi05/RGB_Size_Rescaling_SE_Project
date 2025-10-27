/**
 * @file components/ui/carousel.tsx
 * @description This file contains the Carousel component and its sub-components, providing a flexible and accessible carousel (image slider) functionality. It leverages `embla-carousel-react`.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * @typedef {UseEmblaCarouselType[1]} CarouselApi
 * @description Type definition for the Embla Carousel API instance.
 */
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

/**
 * @typedef {object} CarouselProps
 * @property {CarouselOptions} [opts] - Options to pass to `embla-carousel-react`.
 * @property {CarouselPlugin} [plugins] - Plugins to pass to `embla-carousel-react`.
 * @property {('horizontal' | 'vertical')} [orientation='horizontal'] - The orientation of the carousel.
 * @property {(api: CarouselApi) => void} [setApi] - Callback to receive the Embla Carousel API instance.
 */
type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

/**
 * @typedef {object} CarouselContextProps
 * @property {ReturnType<typeof useEmblaCarousel>[0]} carouselRef - React ref for the carousel DOM element.
 * @property {ReturnType<typeof useEmblaCarousel>[1]} api - The Embla Carousel API instance.
 * @property {() => void} scrollPrev - Function to scroll to the previous slide.
 * @property {() => void} scrollNext - Function to scroll to the next slide.
 * @property {boolean} canScrollPrev - Indicates if there is a previous slide to scroll to.
 * @property {boolean} canScrollNext - Indicates if there is a next slide to scroll to.
 * @augments CarouselProps
 */
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

/**
 * @overview A hook to access the Carousel context.
 * Must be used within a `<Carousel />` component.
 * 
 * @throws {Error} If used outside of a `<Carousel />` component.
 * @returns {CarouselContextProps} The carousel context object.
 */
function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

/**
 * @overview The root Carousel component.
 * It provides the main container and context for a set of carousel items, handling navigation and state.
 * 
 * @param {object} props - The properties for the Carousel component.
 * @param {('horizontal' | 'vertical')} [props.orientation='horizontal'] - The orientation of the carousel.
 * @param {CarouselOptions} [props.opts] - Options to pass to `embla-carousel-react`.
 * @param {CarouselPlugin} [props.plugins] - Plugins to pass to `embla-carousel-react`.
 * @param {(api: CarouselApi) => void} [props.setApi] - Callback to receive the Embla Carousel API instance.
 * @param {string} [props.className] - Optional CSS class names to apply to the carousel container.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the carousel.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Carousel component.
 */
const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins,
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext],
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on('reInit', onSelect)
      api.on('select', onSelect)

      return () => {
        api?.off('select', onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api!,
          opts,
          orientation:
            orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  },
)
Carousel.displayName = 'Carousel'

/**
 * @overview The CarouselContent component.
 * This component acts as the container for individual carousel items, handling the overflow and layout based on orientation.
 * 
 * @param {object} props - The properties for the CarouselContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Carousel content component.
 */
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className,
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = 'CarouselContent'

/**
 * @overview The CarouselItem component.
 * Represents an individual slide within the carousel. Each item takes up the full width/height based on carousel orientation.
 * 
 * @param {object} props - The properties for the CarouselItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the item.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Carousel item component.
 */
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = 'CarouselItem'

/**
 * @overview The CarouselPrevious component.
 * A button for navigating to the previous carousel slide. It is disabled when there are no previous slides.
 * 
 * @param {object} props - The properties for the CarouselPrevious component.
 * @param {string} [props.className] - Optional CSS class names to apply to the button.
 * @param {('default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link')} [props.variant='outline'] - The visual variant of the button.
 * @param {('default' | 'sm' | 'lg' | 'icon')} [props.size='icon'] - The size of the button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The Carousel previous button component.
 */
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute  h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? '-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = 'CarouselPrevious'

/**
 * @overview The CarouselNext component.
 * A button for navigating to the next carousel slide. It is disabled when there are no more slides.
 * 
 * @param {object} props - The properties for the CarouselNext component.
 * @param {string} [props.className] - Optional CSS class names to apply to the button.
 * @param {('default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link')} [props.variant='outline'] - The visual variant of the button.
 * @param {('default' | 'sm' | 'lg' | 'icon')} [props.size='icon'] - The size of the button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The Carousel next button component.
 */
const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = 'CarouselNext'

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
