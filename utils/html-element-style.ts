export abstract class BaseStyle<T>
{
    protected _element: HTMLElement;

    public constructor(element: HTMLElement)
    {
        this._element = element;
    }

    public abstract get(): T;
    public abstract set(value: T | null): void;
}

export interface IAxes3DValue { x?: number | null; y?: number | null; z?: number | null; unit?: string }
export class Axes3DValue extends BaseStyle<IAxes3DValue> implements IAxes3DValue
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
            const matchingRegexp = new RegExp(`${name}${coord}\\(([-0-9\\.]+)([a-z]+)\\)`, "gi");
            const propertyValue = element.style.getPropertyValue(property);

            const replacingValue = (value !== null) ? `${name}${coord}(${value}${this._unit})` : "";

            const matches = matchingRegexp.exec(propertyValue);
            if (matches)
            {
                const replacedValue = propertyValue.replace(matchingRegexp, replacingValue).replace(/^\s|\s$/gi, "");

                if (propertyValue !== replacedValue)
                {
                    element.style.setProperty(property, replacedValue);
                }
            }
            else
            {
                const replacedValue = `${propertyValue} ${replacingValue}`.replace(/^\s|\s$/gi, "");

                if (propertyValue !== replacedValue)
                {
                    element.style.setProperty(property, replacedValue);
                }
            }
        };
    }

    public get(): IAxes3DValue
    {
        return { x: this._x, y: this._y, z: this._z, unit: this._unit };
    }
    public set(axes: IAxes3DValue | null): void
    {
        if (axes === null) { axes = { x: null, y: null, z: null }; }
        if (axes.unit !== undefined) { this._unit = axes.unit; }
        if (axes.x !== undefined) { this.x = axes.x; }
        if (axes.y !== undefined) { this.y = axes.y; }
        if (axes.z !== undefined) { this.z = axes.z; }
    }
}

export interface ITransformProperty { rotate?: IAxes3DValue | null, translate?: IAxes3DValue | null }
export class TransformProperty extends BaseStyle<ITransformProperty> implements ITransformProperty
{
    public readonly rotate: Axes3DValue;
    public readonly translate: Axes3DValue;

    public constructor(element: HTMLElement)
    {
        super(element);

        this.rotate = new Axes3DValue(element, "transform", "rotate", "deg");
        this.translate = new Axes3DValue(element, "transform", "translate");
    }

    public get(): ITransformProperty
    {
        return { rotate: this.rotate.get(), translate: this.translate.get() };
    }
    public set(transform: ITransformProperty | null): void
    {
        if (transform === null) { transform = { rotate: null, translate: null }; }
        if (transform.rotate !== undefined) { this.rotate.set(transform.rotate); }
        if (transform.translate !== undefined) { this.translate.set(transform.translate); }
    }
}

export interface ITransitionValue { duration?: number | null; timingFunction?: string; delay?: number; unit?: string }
export class TransitionValue extends BaseStyle<ITransitionValue> implements ITransitionValue
{
    public static readonly DEFAULT_TIMING_FUNCTION = "linear";
    public static readonly DEFAULT_DELAY = 0;
    public static readonly DEFAULT_UNIT = "ms";

    protected _duration: number | null;

    protected _timingFunction: string;
    protected _delay: number;
    protected _unit: string;

    protected _setter: () => void;

    public get duration(): number | null
    {
        return this._duration;
    }
    public set duration(value: number | null)
    {
        this._duration = value;

        this._setter();
    }

    public get timingFunction(): string
    {
        return this._timingFunction;
    }
    public set timingFunction(value: string)
    {
        this._timingFunction = value;

        this._setter();
    }

    public get delay(): number
    {
        return this._delay;
    }
    public set delay(value: number)
    {
        this._delay = value;

        this._setter();
    }

    public get unit(): string
    {
        return this._unit;
    }
    public set unit(value: string)
    {
        this._unit = value;

        this._setter();
    }

    public constructor(element: HTMLElement, property: string, name: string,
        timingFunction = TransitionValue.DEFAULT_TIMING_FUNCTION,
        delay = TransitionValue.DEFAULT_DELAY,
        unit = TransitionValue.DEFAULT_UNIT)
    {
        super(element);

        const matchingRegexp = new RegExp(`${name} ([0-9\\.]+)([a-z]+)(?: ([a-z-]+))?(?: ([0-9\\.]+)([a-z]+))?`, "gi");

        this._duration = 0;

        this._timingFunction = timingFunction;
        this._delay = delay;
        this._unit = unit;

        this._setter = (): void =>
        {
            const propertyValue = element.style.getPropertyValue(property);

            let replacingValue = "";

            if (this._duration !== null)
            {
                replacingValue = `${name} ${this._duration}${this._unit}`;

                if (this._timingFunction !== TransitionValue.DEFAULT_TIMING_FUNCTION)
                {
                    replacingValue += ` ${this._timingFunction}`;
                }
                if (this._delay !== TransitionValue.DEFAULT_DELAY)
                {
                    replacingValue += ` ${this._delay}${this._unit}`;
                }
            }

            const matches = matchingRegexp.exec(propertyValue);
            if (matches)
            {
                const replacedValue = propertyValue.replace(matchingRegexp, replacingValue).replace(/^,\s|,\s$/gi, "");

                if (propertyValue !== replacedValue)
                {
                    element.style.setProperty(property, replacedValue);
                }
            }
            else
            {
                const replacedValue = `${propertyValue}, ${replacingValue}`.replace(/^,\s|,\s$/gi, "");

                if (propertyValue !== replacedValue)
                {
                    element.style.setProperty(property, replacedValue);
                }
            }
        };
    }

    public get(): ITransitionValue
    {
        return { duration: this._duration, timingFunction: this._timingFunction, delay: this._delay, unit: this._unit };
    }
    public set(transition: ITransitionValue | null): void
    {
        if (transition === null) { transition = { duration: null }; }
        if (transition.duration !== undefined) { this._duration = transition.duration; }
        if (transition.timingFunction !== undefined) { this._timingFunction = transition.timingFunction; }
        if (transition.delay !== undefined) { this._delay = transition.delay; }
        if (transition.unit !== undefined) { this._unit = transition.unit; }

        this._setter();
    }
}

export interface ITransitionProperty { boxShadow?: ITransitionValue | null; transform?: ITransitionValue | null }
export class TransitionProperty extends BaseStyle<ITransitionProperty> implements ITransitionProperty
{
    public readonly boxShadow: TransitionValue;
    public readonly transform: TransitionValue;

    public constructor(element: HTMLElement)
    {
        super(element);

        this.boxShadow = new TransitionValue(element, "transition", "box-shadow");
        this.transform = new TransitionValue(element, "transition", "transform");
    }

    public get(): ITransitionProperty
    {
        return { boxShadow: this.boxShadow.get(), transform: this.transform.get() };
    }
    public set(transition: ITransitionProperty | null): void
    {
        if (transition === null) { transition = { boxShadow: null, transform: null }; }
        if (transition.boxShadow !== undefined) { this.boxShadow.set(transition.boxShadow); }
        if (transition.transform !== undefined) { this.transform.set(transition.transform); }
    }
}

export interface IHTMLElementStyle { transform?: ITransformProperty | null; transition?: ITransitionProperty | null }

export default class HTMLElementStyle extends BaseStyle<IHTMLElementStyle> // implements IHTMLElementStyle
{
    // public readonly transform: TransformProperty;
    // public readonly transition: TransitionProperty;

    public constructor(element: HTMLElement, propertyToEnable: { [key: string]: new(element: HTMLElement) => object })
    {
        super(element);

        propertyToEnable = { "transform": TransformProperty, "transition": TransitionProperty };

        for (const key in propertyToEnable)
        {
            const Class: new(element: HTMLElement) => Object = propertyToEnable[key];

            this[key] = new Class(element);
        }

        console.log(this);

        // this.transform = new TransformProperty(element);
        // this.transition = new TransitionProperty(element);
    }

    public get(): IHTMLElementStyle
    {
        return { transform: this.transform.get(), transition: this.transition.get() };
    }
    public set(style: IHTMLElementStyle): void
    {
        if (style === null) { style = { transform: null, transition: null }; }
        if (style.transform !== undefined) { this.transform.set(style.transform); }
        if (style.transition !== undefined) { this.transition.set(style.transition); }
    }

    // eslint-disable-next-line no-undef
    [key: string]: object;
}
