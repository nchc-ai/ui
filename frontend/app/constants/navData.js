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
    url: '/intro/class',
    isCate: true
  },
  {
    key: 1,
    name: 'navbar.intro',
    url: '/intro/intro',
    isCate: true
  },
  {
    key: 2,
    name: 'navbar.survey',
    url: '/intro/survey',
    isCate: true
  },
  {
    key: 3,
    name: 'navbar.contact',
    url: '/intro/contact',
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

export const footerMidInfoArr = [
  {
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
];

export const footerTopIconArr = [
  {
    url: 'https://www.facebook.com/KNOMOTW/',
    imgUrl: '/'
  }, {
    url: 'https://www.instagram.com/knomotaiwan',
    imgUrl: '/'
  }
];

export const footerBottomLeftArr = [
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
];

export const footerBottomRightArr = [
  {
    text: '© 2018 All rights reserved.'
  }
];

