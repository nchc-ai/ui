import React from 'react';
import moment from 'moment';
import { push } from 'react-router-redux';
import _ from 'lodash';
import Moment from 'react-moment';
import { notify } from 'react-notify-toast';

export function bindFunctions(functions) {
	functions.forEach(f => {
		this[f] = this[f].bind(this);
	});
}

/*---------------------------
//  Status變換
----------------------------*/

export function formatStatus(str) {
  switch (str) {
  case 'Pending':
    return '已發出開啟訊號';
  case 'Ready':
    return '已開啟';
  default:
    return '已關閉';
  }
}


/*---------------------------
// format JOB
// 統一前端 job 規格
// common container vm
----------------------------*/

export function formatJob(datum) {
  return {
    courseId: _.get(datum, 'course_id'),
    id: _.get(datum, 'id'),
    name: _.get(datum, 'name'),
    introduction: _.get(datum, 'introduction'),
    level: _.get(datum, 'level'),
    image: _.get(datum, 'image'),
    service: _.get(datum, 'service'),
    startAt: _.get(datum, 'startAt'),
    status: _.get(datum, 'status'),

    dataset: _.get(datum, 'dataset'),
    gpu: _.get(datum, 'gpu'),

    extraports: _.get(datum, 'extraports'),
    flavor: _.get(datum, 'flavor'),
    floatingip: _.get(datum, 'floatingip'),
    privateip: _.get(datum, 'privateip'),
    sshkey: _.get(datum, 'sshkey'),
    vmname: _.get(datum, 'vmname'),
    volume: _.get(datum, 'volume')
  }
}

/*---------------------------
//	判斷是否為空的
----------------------------*/

export function isNotNull(string) {
  return !(string === "" || string === null);
}



/*---------------------------
//	轉換成有 dash 的 key 的 formObj
----------------------------*/

export const tempfyData = formData => ({
  username: formData.username,
  password: formData.password,
  cName: formData.cName,
  company: formData.company,
  'email-1': formData.email,
  'email-2': formData.secondaryEmail,
  phone: formData.phone,
  text: formData.text
});

/*---------------------------
  將某array分組
  依序給group的名字又不失為一個array
  以便for react去做mapping
----------------------------*/

export const groupArray = (arr, grpKey) => (
  _.chain(arr)
    .groupBy(grpKey)
    .map((v, i) => ({
      group: i,
      data: [...v]
    }))
    .value()
);

/*---------------------------
  ListView用
----------------------------*/


export function formatGender(num) {
  switch (num) {
  case 0:
    return '';
  case 1:
    return '男生';
  case 2:
    return '女生';
  default:
    return '';
  }
}


export const formatDate = (text) => {
  switch (text) {
  case '0000-00-00':
    return '';
  default:
    return <Moment format="YYYY/MM/DD" date={text} />;
  }
};


export const formatArr = arr => (
  <span className="list-view-arr-ul">
    {
      arr.map(datum => (
        <div className="list-view-arr-li">
          {datum}
          {/* <span className="comma">,</span> */}
        </div>
      ))
    }
  </span>
);

export const formatValue = (obj) => {

  switch (obj.type) {
  case 'gender':
    return formatGender(obj.value);
  case 'date':
    return formatDate(obj.value);
  case 'array':
    return formatArr(obj.value);
  default:
    return obj.value;
  }
};

/*---------------------------
// 組OAuth字串 for <MyoauthButton />
----------------------------*/

export function toParams(query) {
  const q = query.replace(/^\??\//, '');

  return q.split('&').reduce((values, param) => {
    const [key, value] = param.split('=');

    values[key] = value;

    return values;
  }, {});
}

export function toQuery(params, delimiter = '&') {
  const keys = Object.keys(params);

  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;

    if (index < (keys.length - 1)) {
      query += delimiter;
    }

    return query;
  }, '');
}

/*---------------------------
// 秒數換算
----------------------------*/

export const dayToSecond = (day) => 3600 * 24 * day;

/*---------------------------
// 存取token至localStorage
----------------------------*/

export const setToken = (idToken) => {
  // Saves user token to localStorage
  localStorage.setItem('id_token', idToken);
};

export const getToken = () => localStorage.getItem('id_token');

export const removeToken = () => {
  // Saves user token to localStorage
  localStorage.setItem('id_token', null);
};


/*---------------------------
  顯示 Hi~訪客 字樣
----------------------------*/

export const welcomeWords = (userInfo) => {
  if (_.get(userInfo, "nickName", false)) {
    return `Hi, ${userInfo.nickName}你好`;
  } else if (_.get(userInfo, "username", false)) {
    return `Hi, ${userInfo.username}你好`;
  }
  return null;

};

/*---------------------------
  判斷是否為 ”編輯模式“
----------------------------*/

export const isEditMode = match => !_.includes(match.url, "add");



/*---------------------------
// [分類] 獲取banner字幕
----------------------------*/

export function setBannerPageInCategoryPage(t, match) {
  const isSearch = match.url.includes("search");

  if (isSearch) {
    return [];
  }
  const cateName = cateNumToName(match.params.lv1);
  return [{
    words: null,
    src: `/images/category/${cateName}/${match.params.grpKey}-${match.params.grpVal}.png`,
    altText: null,
    caption: null,
    captionTitle: t(`category.${cateName}.${match.params.grpKey}.${match.params.grpVal}.bn-title`),
    captionInfo: t(`category.${cateName}.${match.params.grpKey}.${match.params.grpVal}.bn-info`),
  }];
}



/*---------------------------
//  從 localStorage 存入 ＆ 提取 obj
//  提取時要注意到底是不是
//  import { setLocalStorageItem } from "../libraries/utils";
----------------------------*/

export const resetLocalStorageItem = (key) => {
  localStorage.removeItem(key);
};

export const setLocalStorageItem = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj));
};

export const getLocalStorageItem = key => (
  JSON.parse(localStorage.getItem(key))
);

export const isItemExistInLocalStorage = key => (
  !(localStorage.getItem(key) === null)
);



/*---------------------------
//
//	針對陣列遞迴加總
//
----------------------------*/

export function deleteItemInArray(arr,item) {

	return arr.filter((v)=>{ return v.item_id != item.item_id });

}

export function isItemArrDuplicates(arr) {

	var valueArr = arr.map(function(item){ return item.item_id });
	var isDuplicate = valueArr.some(function(item, idx){
		return valueArr.indexOf(item) != idx
	});

	return isDuplicate;
}




export function getAllIndexes(arr, val) {
	const indexes = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === val) {
			indexes.push(i);
		}
	}
	return indexes;
}



export function range(n, m) {
	return Array.apply(null, Array(m - n)).map((x, i) => n + i);
}

export function rangeArray(rangeString) {
	const rangeStringArr = rangeString.split("-");
	return range(parseInt(rangeStringArr[0], 10), parseInt(rangeStringArr[1], 10) + 1);
}

export function isEmpty(obj) {
	return Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({});
}


// Returns a random integer between min (included) and max (excluded)
export function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}




export function init2dArray(n = 5, m = 10) {
	const newArray = Array.apply(null, Array(n)).map(() => new Array(m).fill(0));
	return newArray;
}

export function initArray(m = 10) {
	return new Array(m).fill(0);
}