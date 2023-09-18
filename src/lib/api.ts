
import page1 from './CONTENTLISTINGPAGE-PAGE1.json'
import page2 from './CONTENTLISTINGPAGE-PAGE2.json'
import page3 from './CONTENTLISTINGPAGE-PAGE3.json'

export const getPageContent = (pageIndex) => {
    const content = pageIndex == 0 ? page1 : pageIndex == 1 ? page2 : page3;
    return content.page;
}
