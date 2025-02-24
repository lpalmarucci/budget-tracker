declare namespace JSX {
  interface IntrinsicElements {
    "em-emoji": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      shortcodes: string | null;
      size?: string;
    };
  }
}
