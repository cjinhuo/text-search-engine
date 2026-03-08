declare const _default: <T extends {
    colorSchemeSelector?: string | undefined;
    colorSchemes?: Record<string, any> | undefined;
    defaultColorScheme?: string | undefined;
    cssVarPrefix?: string | undefined;
}>(theme: T) => (colorScheme: keyof T['colorSchemes'] | undefined, css: Record<string, any>) => string | {
    ':root': Record<string, any>;
    '@media (prefers-color-scheme: dark) { :root': Record<string, any>;
} | {
    [x: string]: Record<string, any>;
    ':root'?: undefined;
    '@media (prefers-color-scheme: dark) { :root'?: undefined;
} | {
    ':root': {
        [x: string]: any;
    };
    '@media (prefers-color-scheme: dark) { :root'?: undefined;
};
export default _default;
