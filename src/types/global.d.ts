import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

declare global {
  declare module '*.svg' {
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
  }

  type NextPageWithLayout = NextPage & {
    Layout?: React.ComponentType;
  };

  type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
  };

  interface Window {
    coin98?: true;
  }
}
