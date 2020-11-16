export class BaseStyle
{
    protected _element: HTMLElement;

    public constructor(element: HTMLElement)
    {
        this._element = element;
    }
}

export class Axes3D extends BaseStyle
{
    protected _getter: (coord: string) => number;
    protected _setter: (coord: string, value: number) => void;

    public get X(): number
    {
        return this._getter("X");
    }
    public set X(value: number)
    {
        this._setter("X", value);
    }

    public get Y(): number
    {
        return this._getter("Y");
    }
    public set Y(value: number)
    {
        this._setter("Y", value);
    }

    public get Z(): number
    {
        return this._getter("Z");
    }
    public set Z(value: number)
    {
        this._setter("Z", value);
    }

    public constructor(element: HTMLElement, property: string, name: string, unit: string)
    {
        super(element);

        this._getter = (coord: string): number =>
        {
            const matchingRegexp = new RegExp(`${name}${coord}\\(([0-9\\.]*?)${unit}\\)`, "g");
            const propertyValue = element.style.getPropertyValue(property);

            const matches = matchingRegexp.exec(propertyValue);
            if (matches)
            {
                return parseFloat(matches[1]);
            }

            return 0;
        };
        this._setter = (coord: string, value: number): void =>
        {
            const matchingRegexp = new RegExp(`${name}${coord}\\(([0-9\\.-]*?)(\\w*?)\\)`, "g");
            const propertyValue = element.style.getPropertyValue(property);

            const replacingValue = `${name}${coord}(${value}${unit})`;

            const matches = matchingRegexp.exec(propertyValue);
            if (matches)
            {
                const replacedValue = propertyValue.replace(matchingRegexp, replacingValue);

                if (propertyValue !== replacedValue)
                {
                    element.style.setProperty(property, replacedValue);
                }
            }
            else
            {
                element.style.setProperty(property, `${propertyValue} ${replacingValue}`);
            }
        };
    }
}

export class TransformProperty extends BaseStyle
{
    public readonly rotate: Axes3D;
    public readonly translate: Axes3D;

    public constructor(element: HTMLElement)
    {
        super(element);

        this.rotate = new Axes3D(element, "transform", "rotate", "deg");
        this.translate = new Axes3D(element, "transform", "translate", "px");
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
