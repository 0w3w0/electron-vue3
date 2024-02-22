export type TemplateValueProps<T extends Object> = (props:T)=>string|number;
export type StyleTemplateValue<T extends Object> = TemplateValueProps<T>|string|number;