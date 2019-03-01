import { BlogPreview } from 'components';

/* eslint max-len: off */
function getWrapper () {
    const props = {
        title: 'PowerPoint-利用母片繪製相同底圖的圖片',
        thumb: 'https://pic.pimg.tw/isvincent/1538094949-1955800924.png',
        url: 'http://isvincent.pixnet.net/blog/post/48586071',
        desc: '學校的工作中，有時候需要利用相同底圖繪製多張標示用途的圖片案',
        gtmAction: ''
    };

    return render(<FormGroups {...props} />);
}

describe('FormGroups', () => {
    describe('有 thumb 時，顯示 image', () => {
        const wrapperDesktop = getWrapper('desktop');
        const wrapperMobile = getWrapper('mobile');

        it('should has image', () => {
            expect(wrapperDesktop.find('img').length).toEqual(1);
        });

        it('should be equal PowerPoint-利用母片繪製相同底圖的圖片 for text', () => {
            expect(wrapperDesktop.find('p').first().text()).toEqual('PowerPoint-利用母片繪製相同底圖的圖片');
        });

        it('should be equal http://isvincent.pixnet.net/blog/post/48586071 for link', () => {
            expect($(wrapperDesktop, 'a').attr('href')).toEqual('http://isvincent.pixnet.net/blog/post/48586071');
        });

        it('should be match snapshot', () => {
            expect(toJson(wrapperDesktop)).toMatchSnapshot();
            expect(toJson(wrapperMobile)).toMatchSnapshot();
        });
    });
});
