import { Lightning, Registry } from '@lightningjs/sdk'

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
    Title: object,
    Clock: object
}

export class Header
  extends Lightning.Component<AppTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec>
{
    readonly Title = this.getByRef('Title')!
    readonly Clock = this.getByRef('Clock')!
  static override _template(): Lightning.Component.Template<AppTemplateSpec> {
    return {
        Title: {
            x: 960, y: 50, mount: 0.5,
            text: {
                text: "LIGHTNING WORKSHOP", fontSize: 40, fontFace: "Light"
            }
        },
        Clock: {
            x: 1850, y: 50, mountY: 0.5, mountX: 1,
            text: { text: "", fontSize: 48, fontFace: "Light", textColor: 0xff747474 }
        }
    }
  }
  _active() {
    this._timer()
    }

    _timer() {
        Registry.setInterval(() => {
            this.Clock.patch({
                text: { text: new Date().toTimeString().slice(0, 5) }
            })
        }, 1000);
    }
}
