import { Lightning, Utils } from '@lightningjs/sdk'
import { Content } from './Content';

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
    Wrapper: {
        RectBorder: object,
        Content: object,
        Title: object
    },
    Clock: object
}

export class MovieTile
  extends Lightning.Component<AppTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec>
{
    public _item: any;
    readonly Wrapper = this.getByRef('Wrapper')!
    readonly Content = this.Wrapper.getByRef('Content')!
    readonly Title = this.Wrapper.getByRef('Title')!
    readonly RectBorder = this.Wrapper.getByRef('RectBorder')!

  static override _template(): Lightning.Component.Template<AppTemplateSpec> {
    return {
        Wrapper: {
            RectBorder: {
                alpha: 0,
                x: -5, y: -5,
                zIndex: -1,
                texture: Lightning.Tools.getRoundRect(163, 243, 5, 5, 0xff00ff00, false, null),
            },
            Content: {
                w: 160, h: 240, rect: true, shader: { type: Lightning.shaders.RoundedRectangle, radius: 5 }
            },
            Title: {
                y: 255,
                text: { fontSize: 16, FontFace: "Light", wordWrapWidth: 160, maxLines: 2, maxLinesSuffix: "...",}
            }
        }
    }
  }

    _init() {
        this.Content.on('txError', () => {
            this.Content.src = Utils.asset('images/placeholder_for_missing_posters.png')
        })
    }

    _focus() {
        this.RectBorder.alpha = 1
    }

    _unfocus() {
        this.RectBorder.alpha = 0
    }

    set item(v:any) {
        this._item = v;
        this.Content.src = Utils.asset(`images/${v['poster-image']}`)
        this.Title.patch({ text: { text: v.name } })
    }
  
}
