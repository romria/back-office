// Environment variables injected by webpack DefinePlugin via dotenv-webpack.
// Add a new entry here whenever a variable is added to .env.example / .env.
declare const process: {
  env: {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly APP_API_BASE_URL: string | undefined;
    readonly APP_FEATURE_DARK_MODE: string;
  };
};

declare module '*.css';
declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}
declare module '*.scss';
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  import type {FC, SVGProps} from 'react';
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
