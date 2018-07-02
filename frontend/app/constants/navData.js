// import footerFbIcon from '../images/common/footer-ic-fb.png';
// import footerIgIcon from '../images/common/footer-ic-ig.png';
// import icMember from '../images/common/NavBar/common-ic-user.png';
// import icCart from '../images/common/NavBar/common-ic-cart.png';
// import icMemberAfter from '../images/common/NavBar/common-ic-user-after.png';
// import icCartAfter from '../images/common/NavBar/common-ic-cart-after.png';



export const mainNav = [
  {
    key: 0,
    name: 'navbar.class',
    nameCh: '課程介紹',
    url: '/course',
    // url: '/intro/class',
    isCate: true
  },
  {
    key: 2,
    name: 'navbar.intro',
    nameCh: '基礎課程',
    anchorTarget: 'intro',
    url: '/course/basic',
    // url: '/intro/intro',
    isCate: true
  },
  {
    key: 3,
    name: 'navbar.intro',
    nameCh: '進階課程',
    anchorTarget: 'intro',
    url: '/course/advance',
    // url: '/intro/intro',
    isCate: true
  }, {
    key: 4,
    name: 'navbar.survey',
    nameCh: '需求調查表',
    url: '/',
    // url: '/intro/survey',
    isCate: true
  },
  {
    key: 5,
    name: 'navbar.contact',
    nameCh: '聯絡我們',
    url: '/contact',
    // url: '/intro/contact',
    isCate: true
  }
];

export const subNav = [
  {
    key: 0,
    imgUrl: null,
    imgUrlAfter: null,
    url: '/member/orders',
    badge: false
  }, {
    key: 1,
    imgUrl: null,
    imgUrlAfter: null,
    url: '/cart/1',
    badge: true
  }
];

export const footer = {
  topIconArr: [
    {
      url: 'https://www.facebook.com/KNOMOTW/',
      imgUrl: '/'
    }, {
      url: 'https://www.instagram.com/knomotaiwan',
      imgUrl: '/'
    }
  ],
  midBriefArr: [
    {
      key: 0,
      name: 'navbar.class',
      nameCh: '登入',
      url: '/',
      // url: '/intro/class',
      isCate: true
    },
    {
      key: 1,
      name: 'navbar.intro',
      nameCh: '課程介紹',
      url: '/',
      // url: '/intro/intro',
      isCate: true
    },
    {
      key: 2,
      name: 'navbar.survey',
      nameCh: '中心介紹',
      url: '/',
      // url: '/intro/survey',
      isCate: true
    },
    {
      key: 3,
      name: 'navbar.contact',
      nameCh: '聯絡我們',
      url: '/',
      // url: '/intro/contact',
      isCate: true
    }
  ],
  midInfoArr: [
    {
      key: 1,
      title: '關於AI教育',
      className: 'col-md-2 offset-md-2 col-sm-12 col-xs-12',
      infoArr: [
        {
          text: '課程介紹',
          icon: null,
          href: true,
          url: '/info/class',
          isLink: true
        }, {
          text: '中心介紹',
          icon: null,
          href: true,
          url: '/info/center',
          isLink: true
        }
      ]
    }, {
      key: 2,
      title: '關於我們',
      className: 'col-md-2 col-sm-12 col-xs-12',
      infoArr: [
        {
          text: '財團法人國家實驗研究院',
          icon: null,
          url: '/info/qa',
          active: true,
          isLink: true
        }, {
          text: '國家高速網路與計算中心',
          icon: null,
          url: '/info/store',
          active: true,
          isLink: true
        }
      ]
    }, {
      key: 3,
      title: null,
      className: 'col-md-2 col-sm-12 col-xs-12',
      infoArr: [{
        text: 'AI企業列車',
        icon: null,
        url: '#',
        href: false,
        isLink: false
      }]
    }, {
      key: 4,
      title: '追蹤我們',
      className: 'col-md-4 col-sm-12 col-xs-12',
      infoArr: [{
        text: 'icon',
        icon: null,
        url: '#',
        href: false,
        isLink: false
      }]
    }
  ],
  bottomText: '© All Rights Reserved 2005-2014 國家高速網路與計算中心｜網站管理員信箱 webmaster@narlabs.org.tw',
  bottomLeftArr: [
    {
      text: 'About Martaup',
      url: '/rules/intellPropRight',
      isLink: true
    }, {
      text: 'Help',
      url: '/rules/privacy',
      isLink: true
    }, {
      text: 'Privacy Policy',
      url: '/rules/privacy',
      isLink: true
    }
  ],
  bottomRightArr: [
    {
      text: '© 2018 All rights reserved.'
    }
  ]
};


export const sideNav = [
  {
    key: 0,
    url: '/user/course',
    text: '課程列表',
    isMain: true,
    isLink: true
  }, {
    key: 1,
    url: '/user/work',
    text: '工作清單',
    isMain: false,
    isLink: true
  }, {
    key: 2,
    url: '/user/info',
    text: '個人資料',
    isMain: false,
    isLink: true
  }, {
    key: 3,
    url: '/user/member',
    text: '計畫人員',
    isMain: false,
    isLink: true
  }, {
    key: 4,
    url: '/logout',
    text: '登出',
    isMain: false,
    isLink: true
  }
];
