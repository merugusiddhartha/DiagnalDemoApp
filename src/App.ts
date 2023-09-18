import { Lightning, Utils } from '@lightningjs/sdk'
import { Header } from './Header'
import { Content } from './Content'

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
  Background: object
  Header: typeof Header,
  Content: typeof Content
}

export class App
  extends Lightning.Component<AppTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec>
{
  readonly Content = this.getByRef('Content')!
  static override _template(): Lightning.Component.Template<AppTemplateSpec> {
    return {
      Background: {
        w: 1920, h: 1080, color: 0xff141414, rect: true, zIndex: -1,
      },
      Header: {
        type: Header, w: 1920
      },
      Content: {
        type: Content, y: 150, x: 30
      }
    }
  }

  static getFonts() {
    return[
      { family: 'Regular', url: Utils.asset('fonts/TitilliumWeb-Regular.ttf') },
      { family: 'Light', url: Utils.asset('fonts/TitilliumWeb-Light.ttf') }
    ]
  }

  _getFocused() {
    return this.Content;
  }

}
