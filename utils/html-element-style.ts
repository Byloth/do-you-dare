export interface Axes3D { x?: number | null; y?: number | null; z?: number | null; unit?: string }
export interface Transform { rotate?: Axes3D | null, translate?: Axes3D | null }
export interface Transition { boxShadow: any; transform: any }

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
    public static readonly DEFAULT_UNIT = "px";

    protected _x: number | null;
    protected _y: number | null;
    protected _z: number | null;

    protected _unit: string;

    protected _setter: (coord: string, value: number | null) => void;

    public get x(): number | null
    {
        return this._x;
    }
    public set x(value: number | null)
    {
        this._x = value;

        this._setter("X", value);
    }

    public get y(): number | null
    {
        return this._y;
    }
    public set y(value: number | null)
    {
        this._y = value;

        this._setter("Y", value);
    }

    public get z(): number | null
    {
        return this._z;
    }
    public set z(value: number | null)
    {
        this._z = value;

        this._setter("Z", value);
    }

    public get unit(): string
    {
        return this._unit;
    }
    public set unit(value: string)
    {
        this._unit = value;

        this.x = this._x;
        this.y = this._y;
        this.z = this._z;
    }

    public constructor(element: HTMLElement, property: string, name: string,
        unit = Axes3DValue.DEFAULT_UNIT)
    {
        super(element);

        this._x = null;
        this._y = null;
        this._z = null;

        this._unit = unit;

        this._setter = (coord: string, value: number | null): void =>
        {
            const matchingRegexp = new RegExp(`${name}${coord}\\(([-0-9\\.]*?)(\\w*?)\\)`, "g");
            const propertyValue = element.style.getPropertyValue(property);

            const replacingValue = (value !== null) ? `${name}${coord}(${value}${this._unit})` : "";

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
        return { x: this._x, y: this._y, z: this._z, unit: this._unit };
    }
    public set(axes: Axes3D | null)
    {
        if (axes === null) { axes = { x: null, y: null, z: null }; }
        if (axes.unit !== undefined) { this._unit = axes.unit; }
        if (axes.x !== undefined) { this.x = axes.x; }
        if (axes.y !== undefined) { this.y = axes.y; }
        if (axes.z !== undefined) { this.z = axes.z; }
    }
}

export class TransformProperty extends BaseStyle implements Transform
{
    public readonly rotate: Axes3DValue;
    public readonly translate: Axes3DValue;

    public constructor(element: HTMLElement)
    {
        super(element);

        this.rotate = new Axes3DValue(element, "transform", "rotate", "deg");
        this.translate = new Axes3DValue(element, "transform", "translate");
    }

    public get(): Transform
    {
        return { rotate: this.rotate.get(), translate: this.translate.get() };
    }
    public set(transform: Transform | null)
    {
        if (transform === null) { transform = { rotate: null, translate: null }; }
        if (transform.rotate !== undefined) { this.rotate.set(transform.rotate); }
        if (transform.translate !== undefined) { this.translate.set(transform.translate); }
    }
}

export class TransitionValue extends BaseStyle
{
    public static readonly DEFAULT_DURATION = 400;
    public static readonly DEFAULT_TIMING_FUNCTION = "linear";
    public static readonly DEFAULT_DELAY = 0;
    public static readonly DEFAULT_UNIT = "ms";

    protected _setter: (value: number | null) => void;

    public duration: number;
    public timingFunction: string;
    public delay: number;
    public unit: string;

    public constructor(element: HTMLElement, property: string, name: string,
        duration = TransitionValue.DEFAULT_DURATION,
        timingFunction = TransitionValue.DEFAULT_TIMING_FUNCTION,
        delay = TransitionValue.DEFAULT_DELAY,
        unit = TransitionValue.DEFAULT_UNIT)
    {
        super(element);

        this._setter = (value: number | null): void =>
        {
            const matchingRegexp = new RegExp(`${name}${coord}\\(([-0-9\\.]*?)(\\w*?)\\)`, "g");
            const propertyValue = element.style.getPropertyValue(property);

            const replacingValue = (value !== null) ? `${name}${coord}(${value}${this._unit})` : "";

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

        this.duration = duration;
        this.timingFunction = timingFunction;
        this.delay = delay;
        this.unit = unit;
    }
}

export class TransitionProperty extends Array<any> implements Transition
{
    public readonly boxShadow: TransitionValue;
    public readonly transform: TransitionValue;

    public constructor(element: HTMLElement)
    {
        super(element);

        this.boxShadow = new TransitionValue(element, "transition", "box-shadow");
        this.transform = new TransitionValue(element, "transition", "transform");
    }

    [position: number]: any;

    public length: number;
    public push(item: any): number {
        throw new Error("Method not implemented.");
    }
}

export default class HTMLElementStyle extends BaseStyle
{
    public readonly transform: TransformProperty;
    public readonly transition: TransitionProperty;

    public constructor(element: HTMLElement)
    {
        super(element);

        this.transform = new TransformProperty(element);
        this.transition = new TransitionProperty(element);
    }
}
