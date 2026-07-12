# Carousel

Scrollable slide container with navigation buttons and dot indicators.

[Source](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/recipes/carousel.tsx) | [Public exports](https://github.com/Newland-Payment-Technology-US-Co-Ltd/cloud-next-scaffold/blob/develop/packages/ui/src/components/ui/index.ts)

`Carousel` is a client component powered by `embla-carousel-react`. It is a set of composable parts — `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, and `CarouselDots` — plus the `useCarousel` hook and the `CarouselApi` type. Import them from `@cloud/ui` or `@cloud/ui/components/ui`.

## Development guidelines

Wrap the slides in `Carousel`, put them in a `CarouselContent` as `CarouselItem`s, and add `CarouselPrevious` / `CarouselNext` for the arrows and `CarouselDots` for the indicators.

`orientation` is `horizontal` (default) or `vertical`. `opts` passes Embla options straight through — `loop`, `align`, `slidesToScroll`, and the rest — and `plugins` takes Embla plugins, such as autoplay.

`setApi` hands you the Embla instance, so you can drive the carousel from outside — jump to a slide, listen for a change. Inside the tree, `useCarousel` gives you the same api plus `scrollPrev`, `scrollNext`, `canScrollPrev`, and `canScrollNext`; it throws outside a `<Carousel>`.

A carousel hides content behind an interaction, so most of it goes unseen. Use one only where the slides are genuinely peers and seeing them all at once isn't the point — a gallery of screenshots, a set of onboarding cards. Don't put a page's important content, or anything a user must act on, in slide three. In an admin console the honest answer is usually a grid or a list.

## General guidelines

### Do

- Use a carousel for peer content that is fine to browse, such as images.
- Include both the arrows and the dots, so the user can see there is more and how much.
- Pass Embla options through `opts` rather than reaching into the DOM.

### Don't

- Don't put important or actionable content in a carousel; most of it will never be seen.
- Don't autoplay a carousel with text in it — moving content that can't be read in time is an accessibility failure and, in this app, almost never worth it.
- Don't use a carousel where a grid or a list would show everything at once.

## Features

- #### Slides

  ```tsx
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselDots,
  } from "@cloud/ui";

  <Carousel opts={{ loop: true, align: "start" }}>
    <CarouselContent>
      {shots.map((shot) => (
        <CarouselItem key={shot.id} className="basis-1/2">
          <Image src={shot.src} alt={shot.alt} width={640} height={360} />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
    <CarouselDots />
  </Carousel>;
  ```

- #### Orientation

  `orientation="vertical"` stacks the slides and turns the arrows into up and down.

- #### The api

  `setApi` gives you the Embla instance; `useCarousel` gives the same, plus the scroll helpers, to anything inside the tree.

  ```tsx
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  <Carousel setApi={setApi}>…</Carousel>;
  ```

### States

- **At the bounds** — `CarouselPrevious` and `CarouselNext` disable themselves at the ends, unless `loop` is on.
- **Current** — `CarouselDots` marks the active slide.

## Writing guidelines

### General writing guidelines

- Use sentence case, and no terminal punctuation.

### Component-specific guidelines

- Every image slide needs real `alt` text. A carousel of unlabelled images is a carousel of nothing.

## Accessibility guidelines

### General accessibility guidelines

- The arrows are real buttons and disable at the bounds, so keyboard users know when they've reached the end.
- The carousel region is keyboard-scrollable, and the arrow keys move between slides when it has focus.
- Off-screen slides are still in the DOM. Make sure any interactive content in them is either reachable or not needed.

### Component-specific guidelines

- Don't autoplay. Moving content that a user cannot pause fails WCAG 2.2.2 and hurts anyone who reads slowly, uses a screen magnifier, or is distracted by motion. If you must, give it a visible pause control and honour `prefers-reduced-motion`.
