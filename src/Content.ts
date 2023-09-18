import { Lightning } from '@lightningjs/sdk'
import { getPageContent } from './lib/api'
import { MovieTile } from "./MovieTile";

interface AppTemplateSpec extends Lightning.Component.TemplateSpec {
    Wrapper: {
        Title: object,
        Overview: object,
        Content: {
            Heading: object,
            List: {
                MovieTile: object,
            }
        }
    },
   
}


function addZeroWidthSpaces(text:any) {
    return text.slice(0, 75) + "\u200B" + text.slice(75) ;
}

const tileW = 240
const tileGap = 18

export class Content
  extends Lightning.Component<AppTemplateSpec>
  implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec>
{

    private _currentPageData: any;
	private _activeItemIndex: any;
	private _loadedPagesData: any;
    
    readonly Wrapper = this.getByRef('Wrapper')!
    readonly Title = this.Wrapper.getByRef('Title')!
    readonly Overview = this.Wrapper.getByRef('Overview')!
    readonly Content = this.Wrapper.getByRef('Content')!
    readonly List = this.Content.getByRef('List')!

  static override _template(): Lightning.Component.Template<AppTemplateSpec> {
        return {
            Wrapper: {
                Title: {
                    text: { fontStyle: "Bold", text: "Rear Window", fontSize: 40 }
                },
                Overview: {
                    y: 100, text: {
                        maxLines: 2,
                        maxLinesSuffix: "...",
                        wordWrapWidth: 960,
                        wordWrap: true,
                        textOverflow: 'ellipsis',
                        fontSize: 32, fontFace: "Light", lineHeight: 40,
                    }
                },
                Content: {
                    Heading: {
                        y: 250,
                        text: { text: "Romantic Comedy", fontStyle: "Bold", fontSize: 40 }
                    },
                    List: {

                    }
                }
            }
        }
    }
     _init() {
        this._currentPageData = 0
        this._activeItemIndex = 0
        this._loadedPagesData = []
    }

    _active() {
        this.List.children = this.addContent()
        this._setState("Active")
    }


    addContent() {
        const pageData = getPageContent(this._currentPageData)
        this._loadedPagesData.push(...pageData["content-items"].content)

        const lastEle = this.List.childList.last;
        let lastEleX = 0;
        if (lastEle) {
            lastEleX = lastEle.x;
            lastEleX += (tileW + tileGap)
        }

        const childrens = pageData["content-items"].content.map((item: object, index: number) => {
            return {
                type: MovieTile,
                item,
                x: lastEleX + (index * tileW) + (index * tileGap),
                y: 340
            }
        })
        return childrens
    }


    static _states() {
        return [
            class Active extends this {
                $enter() {
                    this.updateInfo()
                }

                updateInfo() {
                    this.Title.patch({ text: { text: this._loadedPagesData[this._activeItemIndex].name } })
                     if(this._loadedPagesData[this._activeItemIndex].description !== undefined) {
                      this.Overview.patch({ text: addZeroWidthSpaces(this._loadedPagesData[this._activeItemIndex].description) })
                    } else {
                      this.Overview.patch({ text: { text: "Information is not available" } })
                    }
                  }

                _getFocused() {
                    return this.List.children && this.List.children[this._activeItemIndex]
                }

                _handleRight() {
                    if (this._activeItemIndex < (this._loadedPagesData.length - 1)) {
                        this._activeItemIndex++
                        this.updateInfo()
                        if (this._activeItemIndex >= 7) {
                            this.moveRight()
                            if ((this._loadedPagesData.length - this._activeItemIndex) == 2 && this._currentPageData < 2) {
                                this._currentPageData++;
                                this.List.children = [...this.List.children, ...this.addContent()]
                            }
                        }
                    }
                }

                _handleLeft() {
                    if (this._activeItemIndex > 0) {
                        this._activeItemIndex--
                        this.updateInfo()
                        if (this._activeItemIndex >= 6) {
                            this.moveLeft()
                        }
                    }
                }

                moveRight() {
                    this.List.children.forEach((element: any, index: number) => {
                        element.x = element.x - tileW - tileGap
                    });
                }

                moveLeft() {
                    this.List.children.forEach((element: any, index: number) => {
                        element.x = element.x + tileW + tileGap
                    });
                }
            }
        ]
    }
}
