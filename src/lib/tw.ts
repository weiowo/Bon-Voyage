/* eslint-disable react/jsx-props-no-spreading */
// Named, class-only components built from Tailwind classes:
//
//   const Card = tw.div`flex rounded-[8px] max-[800px]:hidden`;
//   const Tab = tw.button<{ active?: boolean }>`
//     px-[12px] ${(p) => (p.active ? 'bg-black text-white' : 'bg-white')}
//   `;
//   const Wide = tw(Card)`w-full`;   // extends Card; later classes win
//
// Props are forwarded like styled-components did: DOM elements only receive
// valid HTML attributes, components receive everything except `$`-prefixed props.

import isPropValid from '@emotion/is-prop-valid';
import {
  createElement,
  forwardRef,
  type ComponentPropsWithRef,
  type ElementType,
  type ForwardRefExoticComponent,
  type JSX,
} from 'react';
import { twMerge } from 'tailwind-merge';

type Falsy = false | null | undefined | '';
type Interpolation<P> = string | ((props: P) => string | Falsy);

type TwComponent<C extends ElementType, P> = ForwardRefExoticComponent<
Omit<ComponentPropsWithRef<C>, keyof P> & P
>;

type Factory<C extends ElementType> = <P extends object = object>(
  strings: TemplateStringsArray,
  ...interpolations: Interpolation<P>[]
) => TwComponent<C, P>;

function forwardableProps(component: ElementType, props: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  const isDom = typeof component === 'string';
  Object.keys(props).forEach((key) => {
    if (isDom ? isPropValid(key) : !key.startsWith('$')) out[key] = props[key];
  });
  return out;
}

function create<C extends ElementType>(component: C): Factory<C> {
  return <P extends object = object>(
    strings: TemplateStringsArray,
    ...interpolations: Interpolation<P>[]
  ) => {
    const Component = forwardRef<unknown, Record<string, unknown>>((props, ref) => {
      let classes = '';
      strings.forEach((chunk, i) => {
        classes += chunk;
        if (i < interpolations.length) {
          const value = interpolations[i];
          classes += ` ${(typeof value === 'function' ? value(props as P) : value) || ''} `;
        }
      });
      const { className, ...rest } = props;
      return createElement(component, {
        ...forwardableProps(component, rest),
        ref,
        className: twMerge(classes.replace(/\s+/g, ' ').trim(), className as string | undefined),
      });
    });
    Component.displayName = `tw(${typeof component === 'string' ? component : (component as { displayName?: string }).displayName ?? 'Component'})`;
    return Component as unknown as TwComponent<C, P>;
  };
}

type Tw = (<C extends ElementType>(component: C) => Factory<C>) & {
  [K in keyof JSX.IntrinsicElements]: Factory<K>;
};

const tw = new Proxy(create, {
  get: (_target, tag: string) => create(tag as keyof JSX.IntrinsicElements),
}) as Tw;

export default tw;
