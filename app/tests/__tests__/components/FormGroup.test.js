import { FormGroups } from 'components';

/* eslint max-len: off */
function getWrapper () {
    const props = {
        formData: [{
            key: 1,
            size: 8,
            name: 'periodUnlimit',
            target: 'schedule',
            inputType: 'radio',
            mainLabel: '選擇教室時間',
            className: 'fl',
            options: [
              {
                key: 1,
                radioKey: 'periodUnlimit-1',
                value: '不限時間',
                label: '不限時間'
              }
            ],
            isRequired: false,
            errorMessage: {
              required: '您尚未選擇週期'
            }
        }]
    };

    return render(<FormGroups {...props} />);
}

describe('FormGroups', () => {
    describe('input 需顯示欄位資料', () => {
        const wrapper = getWrapper();

        it('should empty at first', () => {
            expect(wrapper.find('.text-input').length).toEqual(0);
        });

        // it('should be equal PowerPoint-利用母片繪製相同底圖的圖片 for text', () => {
        //     expect(wrapper.find('p').first().text()).toEqual('PowerPoint-利用母片繪製相同底圖的圖片');
        // });

        // it('should be equal http://isvincent.pixnet.net/blog/post/48586071 for link', () => {
        //     expect($(wrapper, 'a').attr('href')).toEqual('http://isvincent.pixnet.net/blog/post/48586071');
        // });

        // it('should be match snapshot', () => {
        //     expect(toJson(wrapper)).toMatchSnapshot();
        // });
    });
});
