import { Component, TagComponent } from 'ecsy'
import { registerComponent } from '../../register-component'

/** Example of a more complex component with custom copy and reset methods. */
@registerComponent
export class ColorComponent extends Component<ColorComponent> {
    value: { r: number, g: number, b: number }

    constructor(props?: false | Partial<Pick<ColorComponent, "value">>) {
        super(false) // false means disable schema usage
        this.value = { r: 0, g: 0, b: 0 }
    }

    copy(src: this): this {
        this.value.r = src.value.r
        this.value.g = src.value.g
        this.value.b = src.value.b
        return this
    }

    reset(): void {
        this.value.r = 0
        this.value.g = 0
        this.value.b = 0
    }
}

/** Example of a tag component (does not contain data, used for flagging entities). */
@registerComponent
export class Player extends TagComponent {}
