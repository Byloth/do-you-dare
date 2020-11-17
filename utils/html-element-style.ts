export interface Axes3D { X?: number | null; Y?: number | null; Z?: number | null }
export interface Tranfsorm { rotate?: Axes3D | null, translate?: Axes3D | null }

export class BaseStyle
{
    protected _element: HTMLElement;

    public constructor(element: HTMLElement)
    {
        this._element = element;
    }
}

export class Axes3DValue extends BaseStyle implements Axes3D
{
    protected _getter: (coord: string) => number | null;
    protected _setter: (coord: string, value: number | null) => void;

    public get X(): number | null
    {
        return this._getter("X");
    }
    public set X(value: number | null)
    {
        this._setter("X", value);
    }

    public get Y(): number | null
    {
        return this._getter("Y");
    }
    public set Y(value: number | null)
    {
        this._setter("Y", value);
    }

    public get Z(): number | null
    {
        return this._getter("Z");
    }
    public set Z(value: number | null)
    {
        this._setter("Z", value);
    }

    public constructor(element: HTMLElement, property: string, name: string, unit: string)
    {
        super(element);

        this._getter = (coord: string): number | null =>
        {
            const matchingRegexp = new RegExp(`${name}${coord}\\(([-0-9\\.]*?)${unit}\\)`, "g");
            const propertyValue = element.style.getPropertyValue(property);

            const matches = matchingRegexp.exec(propertyValue);
            if (matches)
            {
                return parseFloat(matches[1]);
            }

            return null;
        };
        this._setter = (coord: string, value: number | null): void =>
        {
            const matchingRegexp = new RegExp(`${name}${coord}\\(([-0-9\\.]*?)${unit}\\)`, "g");
            const propertyValue = element.style.getPropertyValue(property);

            const replacingValue = (value !== null) ? `${name}${coord}(${value}${unit})` : "";

            const matches = matchingRegexp.exec(propertyValue);
            if (matches)
            {
                const replacedValue = propertyValue.replace(matchingRegexp, replacingValue).trim();

                if (propertyValue !== replacedValue)
                {
                    element.style.setProperty(property, replacedValue);
                }
            }
            else
            {
                const replacedValue = `${propertyValue} ${replacingValue}`.trim();

                if (propertyValue !== replacedValue)
                {
                    element.style.setProperty(property, replacedValue);
                }
            }
        };
    }

    public get(): Axes3D
    {
        return { X: this.X, Y: this.Y, Z: this.Z };
    }
    public set(axes: Axes3D | null)
    {
        if (axes === null) { axes = { X: null, Y: null, Z: null }; }
        if (axes.X !== undefined) { this.X = axes.X; }
        if (axes.Y !== undefined) { this.Y = axes.Y; }
        if (axes.Z !== undefined) { this.Z = axes.Z; }
    }
}

export class TransformProperty extends BaseStyle
{
    public readonly rotate: Axes3DValue;
    public readonly translate: Axes3DValue;

    public constructor(element: HTMLElement)
    {
        super(element);

        this.rotate = new Axes3DValue(element, "transform", "rotate", "deg");
        this.translate = new Axes3DValue(element, "transform", "translate", "px");
    }
}

export default class HTMLElementStyle extends BaseStyle
{
    public readonly transform: TransformProperty;

    public constructor(element: HTMLElement)
    {
        super(element);

        this.transform = new TransformProperty(element);
    }
}
