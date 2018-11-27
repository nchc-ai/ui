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
    url: '/course/intro',
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
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSd3WTXGCQX0tjILHn6Dvlmnkzs3lLBdVX1Xfsuq0m0WzZfXzQ/viewform?usp=pp_url',
    // url: '/intro/survey',
    isCate: true,
    isOuter: true
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
      url: 'https://www.facebook.com',
      imgUrl: '/'
    }, {
      url: 'https://www.instagram.com',
      imgUrl: '/'
    }
  ],
  midBriefArr: [
    {
      key: 0,
      name: 'navbar.class',
      nameCh: '登入',
      url: '/login',
      // url: '/intro/class',
      isCate: true,
      isOuter: false
    },
    {
      key: 1,
      name: 'navbar.intro',
      nameCh: '課程介紹',
      url: '/course/intro',
      // url: '/intro/intro',
      isCate: true,
      isOuter: false
    },
    {
      key: 2,
      // name: 'navbar.survey',
      // nameCh: '中心介紹',
      // url: '/',
      // // url: '/intro/survey',
      // isCate: true,
      // isOuter: false
      text: '中心介紹',
      nameCh: '中心介紹',
      icon: null,
      href: true,
      url: '/info/center',
      isLink: true,
      anchorTarget: 'intro',
      isAnchor: true,
      offset: -60
    },
    {
      key: 3,
      name: 'navbar.contact',
      nameCh: '聯絡我們',
      url: '/contact',
      // url: '/intro/contact',
      isCate: true,
      isOuter: false
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
          nameCh: '中心介紹',
          icon: null,
          href: true,
          url: '/info/center',
          isLink: true,
          anchorTarget: 'intro',
          isAnchor: true,
          offset: 10
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
    url: '/classroom-manage/list',
    urlPrefix: '/classroom-manage',
    text: '教室管理',
    isMain: true,
    isLink: true
  }, {
    key: 1,
    url: '/classroom-time',
    urlPrefix: '/classroom-time',
    text: '教室時間',
    isMain: true,
    isLink: true
  }, {
    key: 2,
    url: '/ongoing-course/list',
    urlPrefix: '/ongoing-course',
    text: '開課列表',
    isMain: true,
    isLink: true
  }, {
    key: 3,
    url: '/classroom-group',
    urlPrefix: '/classroom-group',
    text: '教室列表',
    isMain: false,
    isLink: true
  }, {
    key: 4,
    url: '/job/list',
    urlPrefix: '/job',
    text: '工作清單',
    isMain: false,
    isLink: true
  }, {
    key: 5,
    url: '/profile/list',
    urlPrefix: '/profile',
    text: '個人資料',
    isMain: false,
    isLink: true
  }, {
    key: 6,
    url: '/password-setting',
    urlPrefix: '/password',
    text: '密碼設定',
    isMain: false,
    isLink: true
  }, {
    key: 7,
    url: '/logout',
    urlPrefix: '/logout',
    text: '登出',
    isMain: false,
    isLink: true
  }
];
