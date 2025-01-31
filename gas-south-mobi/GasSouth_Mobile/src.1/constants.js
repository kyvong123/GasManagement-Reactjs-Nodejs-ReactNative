import {without as _without} from 'lodash';
import ENV_VARIABLES from './config/';


export const NUMBER_ARTICLES_PER_PAGE = 20;

const convertObjectToQuery = (query) => {
    let queryString = [];

    let sortBy = query.sortBy || '';
    const order = query.order || '';
    if(sortBy&&order){
        sortBy= `sort=${sortBy}%20${order}`;
        queryString.push(sortBy);
    }
    // delete query.order;
    // delete query.sortBy;

    Object.keys(query).forEach(key=>{
        if(key ==='sortBy' || key === 'order'){
            return;
        }
        if(key==='lastModifiedDatePreSetting'&&query[key]===5){
            return;
        }
        if(query[key] !== null && query[key] !== undefined && query[key] !== ''){
            if(Array.isArray(query[key])){

                if(query[key].toString() !== ''){
                    queryString.push(`${key}=${_without(query[key],null).toString()}`);
                }
            } else{
                queryString.push(`${key}=${query[key]}`);
            }
        }
    });

    if (queryString.length) {
        queryString = '?'.concat(queryString.join('&'));
    } else {
      queryString = '';
    }
    return  queryString;
};
export const  COLOR = {
    GREEN: '#2A56C6',
    DARKGRAY:'#3B434F',
    GRAY:'#8E8E93',
    MEDIUMGRAY: '#80858D',
    ORANGE:'#FF9E16',
    LIGHTGRAY:'#D8D8D8',
    WHITE: '#FFF',
    LIGHTBLACK: '#4A4A4A',
    BACKGROUNDGRAY: '#F8F8F8',
    BACKGROUNDLIGHTGRAY: '#FAFAFA',
    BLACK: '#2B2B2A',
    RED: 'red'
};
export const END_POINT = {
    loginUser: {
        url: (ternant) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Auth/Token`,
        method: 'POST'
    },
    refreshToken: {
        url: (ternant, refreshToken) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Auth/Token/${refreshToken}`,
        method: 'GET'
    },
    userInfo: {
        url: (ternant) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Users/Identity`,
        method: 'GET'
    },
    getTernantByEmail: {
        url: (emailAddress) => `${ENV_VARIABLES.PROTOCOL}://cf.${ENV_VARIABLES.API_SERVER}/Corp/EmailAddresses/${emailAddress}/Tenants`,
        method: 'GET'
    },
    getArticles: {
        url : (ternant,query) => {
            if(!query || Object.keys(query).length < 1){
                return `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Admin/Articles`;
            }
            query.size = NUMBER_ARTICLES_PER_PAGE;
            query = convertObjectToQuery(query);
            return `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Admin/Articles${query}`;
        },
        method: 'GET'
    },
    getArticle: {
        url : (ternant,id) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Admin/Articles/${id}`,
        method: 'GET'
    },
    getArticleTypes: {
        url : (ternant) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Admin/ArticleTypes`,
        method: 'GET'
    },
    getArticleServices: {
        url : (ternant) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Admin/Services`,
        method: 'GET'
    },
    getArticleService: {
        url : (ternant, id) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Admin/Services/${id}`,
        method: 'GET'
    },
    postArticleComent:{
        url : (ternant, articleId, fieldId) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Admin/Articles/${articleId}/Fields/${fieldId}/Comments`,
        method: 'POST'
    },
    deleteArticleComent:{
        url : (ternant, commentId) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Admin/ArticleFieldComments/${commentId}`,
        method: 'DELETE'
    },
    getMetaData: {
        url : (ternant) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Public/SiteSettings`,
        method: 'GET'
    },
    getSSOToken: {
        url : (ternant, domainName) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/Admin/SSO/${domainName}`,
        method: 'GET'
    },
    switchDomainWithSSOToken: {
        url : (ternant, ssoToken) => `${ENV_VARIABLES.PROTOCOL}://${ternant}.${ENV_VARIABLES.API_SERVER}/SSO/${ssoToken}`,
        method: 'GET'
    }
};
export const sortBy = [
    {type:'id', description:'Article ID'}, 
    {type: 'title', description: 'Title'},
    // {type: 'service', description: 'Service'},
    // {type: 'createdAtUTC', description: 'Created date'},
    {type: 'lastUpdatedAtUTC', description: 'Last modified date'},
    {type: 'uses', description: 'Uses'},
    // {type: 'comments', description: 'Comments'},
    // {type: 'fcr', description: 'FCR'},
    // {type: 'numberOfLikes', description: 'Likes/Dislikes'},
    // {type: 'articleTyle', description: 'Type'},
    // {type: 'portfolio', description: 'Porfolio'},
    // {type: 'priority', description: 'Priority'},
    // {type: 'lastUpdatedByUser', description: 'Last modified by'},
    {type: 'views', description: 'Views'},
    // {type: 'lastViewedAtUTC', description: 'Last Viewed date'},
    // {type: 'createdByUser', description: 'Created by'},
    // {type: 'audience', description: 'Audience'},
    // {type: 'status', description: 'Status'}];
];
export  const AUDIENCE_FIELDS = [
    { id: 1, name: 'Internal', description: 'Internal' },
    { id: 2, name: 'Internal and external', description: 'Internal and external' },
  ];
export const ArticleStatus = {
    InProgress: 11,
    Draft: 22,
    Validated: 33,
    Archived: 44,
  };

export const STATUS_FIELDS = [
    { id: ArticleStatus.InProgress, name: 'InProgress', description: 'In progress' },
    { id: ArticleStatus.Draft, name: 'Draft', description: 'Draft' },
    { id: ArticleStatus.Validated, name: 'Validated', description: 'Validated' },
    { id: ArticleStatus.Archived, name: 'Archived', description: 'Archived' },
];
export const orderType = [
    {type: 'DESC', description: 'Descending'},
    {type: 'ASC', description: 'Ascending'}];

export const DATE_FORMAT = 'MM/DD/YYYY';

export const ANY_TIME = [
      { value: 'Any time', id: 5, key: 5 },
      { value: 'Today', id: 1, key: 1 },
      { value: 'This week', id: 2, key: 2 },
      { value: 'This month', id: 3, key: 3 },
      { value: 'This year', id: 4, key: 4 },
      { value: 'Custom range', id: null, key: null }
    ];
export  const quillStyle = 
    `.rn-article-title {
      font-size: 16px;
      padding: 24px 16px 3px;
      color: #2b2b2a;
    }
    .rn-article-content {
      display: block; 
      overflow: hidden; 
      padding: 0 16px;
    }
    .rn-article-tags {
      display: inline-block;
      margin-right: 6px;
    }
    .rn-line {
      height: 1px;
      width: 100%; 
      padding-top: 15px; 
      margin-bottom: 4px; 
      border-bottom: 1px solid #e0e0e0;
    }
    .rn-article-comments-total {
      padding: 0 16px;
      color: #2a56c6;
    }
    .rn-article-comments {
      padding: 16px;
    }
    .rn-article-attachments {
      padding: 16px;
    }
    .rn-article-comment{
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }
    .rn-article-comments .rn-article-comment:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }
    .rn-comment-user {
      font-size: 12px;
      padding-top: 3px;
      color: #9b9b9b;
    }
    .ql-editor {
      box-sizing: border-box;
      cursor: text;
      line-height: 1.42;
      height: 100%;
      outline: none;
      overflow-y: auto;
      padding: 12px 15px;
      tab-size: 4;
      -moz-tab-size: 4;
      text-align: left;
      word-wrap: break-word;
    }
    .ql-editor p,
    .ql-editor pre,
    .ql-editor blockquote,
    .ql-editor h1,
    .ql-editor h2,
    .ql-editor h3,
    .ql-editor h4,
    .ql-editor h5,
    .ql-editor h6 {
      margin: 0;
      padding: 0;
    }
    .ql-editor .ql-indent-1:not(.ql-direction-rtl) {
      padding-left: 3em;
    }
    .ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
      padding-left: 4.5em;
    }
    .ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
      padding-right: 3em;
    }
    .ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
      padding-right: 4.5em;
    }
    .ql-editor .ql-indent-2:not(.ql-direction-rtl) {
      padding-left: 6em;
    }
    .ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
      padding-left: 7.5em;
    }
    .ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
      padding-right: 6em;
    }
    .ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
      padding-right: 7.5em;
    }
    .ql-editor .ql-indent-3:not(.ql-direction-rtl) {
      padding-left: 9em;
    }
    .ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
      padding-left: 10.5em;
    }
    .ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
      padding-right: 9em;
    }
    .ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
      padding-right: 10.5em;
    }
    .ql-editor .ql-indent-4:not(.ql-direction-rtl) {
      padding-left: 12em;
    }
    .ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
      padding-left: 13.5em;
    }
    .ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
      padding-right: 12em;
    }
    .ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
      padding-right: 13.5em;
    }
    .ql-editor .ql-indent-5:not(.ql-direction-rtl) {
      padding-left: 15em;
    }
    .ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
      padding-left: 16.5em;
    }
    .ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
      padding-right: 15em;
    }
    .ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
      padding-right: 16.5em;
    }
    .ql-editor .ql-indent-6:not(.ql-direction-rtl) {
      padding-left: 18em;
    }
    .ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
      padding-left: 19.5em;
    }
    .ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
      padding-right: 18em;
    }
    .ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
      padding-right: 19.5em;
    }
    .ql-editor .ql-indent-7:not(.ql-direction-rtl) {
      padding-left: 21em;
    }
    .ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
      padding-left: 22.5em;
    }
    .ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
      padding-right: 21em;
    }
    .ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
      padding-right: 22.5em;
    }
    .ql-editor .ql-indent-8:not(.ql-direction-rtl) {
      padding-left: 24em;
    }
    .ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
      padding-left: 25.5em;
    }
    .ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
      padding-right: 24em;
    }
    .ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
      padding-right: 25.5em;
    }
    .ql-editor .ql-indent-9:not(.ql-direction-rtl) {
      padding-left: 27em;
    }
    .ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
      padding-left: 28.5em;
    }
    .ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
      padding-right: 27em;
    }
    .ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
      padding-right: 28.5em;
    }
    .ql-editor .ql-video {
      display: block;
      max-width: 100%;
    }
    .ql-editor .ql-video.ql-align-center {
      margin: 0 auto;
    }
    .ql-editor .ql-video.ql-align-right {
      margin: 0 0 0 auto;
    }
    .ql-editor .ql-bg-black {
      background-color: #000;
    }
    .ql-editor .ql-bg-red {
      background-color: #e60000;
    }
    .ql-editor .ql-bg-orange {
      background-color: #f90;
    }
    .ql-editor .ql-bg-yellow {
      background-color: #ff0;
    }
    .ql-editor .ql-bg-green {
      background-color: #008a00;
    }
    .ql-editor .ql-bg-blue {
      background-color: #06c;
    }
    .ql-editor .ql-bg-purple {
      background-color: #93f;
    }
    .ql-editor .ql-color-white {
      color: #fff;
    }
    .ql-editor .ql-color-red {
      color: #e60000;
    }
    .ql-editor .ql-color-orange {
      color: #f90;
    }
    .ql-editor .ql-color-yellow {
      color: #ff0;
    }
    .ql-editor .ql-color-green {
      color: #008a00;
    }
    .ql-editor .ql-color-blue {
      color: #06c;
    }
    .ql-editor .ql-color-purple {
      color: #93f;
    }
    .ql-editor .ql-font-serif {
      font-family: Georgia, Times New Roman, serif;
    }
    .ql-editor .ql-font-monospace {
      font-family: Monaco, Courier New, monospace;
    }
    .ql-editor .ql-size-small {
      font-size: 0.75em;
    }
    .ql-editor .ql-size-large {
      font-size: 1.5em;
    }
    .ql-editor .ql-size-huge {
      font-size: 2.5em;
    }
    .ql-editor .ql-direction-rtl {
      direction: rtl;
      text-align: inherit;
    }
    .ql-editor .ql-align-center {
      text-align: center;
    }
    .ql-editor .ql-align-justify {
      text-align: justify;
    }
    .ql-editor .ql-align-right {
      text-align: right;
    }
    .ql-editor.ql-blank::before {
      color: rgba(0,0,0,0.6);
      content: attr(data-placeholder);
      font-style: italic;
      pointer-events: none;
      position: absolute;
    }
    .ql-editor ol,
    .ql-editor ul {
      margin: 0;
      font-size: 13px;
    }
    .ql-editor.ql-blank::before {
      color: rgba(0,0,0,0.6);
      content: attr(data-placeholder);
      font-style: italic;
      pointer-events: none;
      position: absolute;
    }
    .ql-snow {
      box-sizing: border-box;
    }
    .ql-snow * {
      box-sizing: border-box;
    }
    .ql-snow .ql-hidden {
      display: none;
    }
    .ql-snow .ql-out-bottom,
    .ql-snow .ql-out-top {
      visibility: hidden;
    }
    .ql-snow .ql-stroke {
      fill: none;
      stroke: #444;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2;
    }
    .ql-snow .ql-stroke-miter {
      fill: none;
      stroke: #444;
      stroke-miterlimit: 10;
      stroke-width: 2;
    }
    .ql-snow .ql-fill,
    .ql-snow .ql-stroke.ql-fill {
      fill: #444;
    }
    .ql-snow .ql-empty {
      fill: none;
    }
    .ql-snow .ql-even {
      fill-rule: evenodd;
    }
    .ql-snow .ql-thin,
    .ql-snow .ql-stroke.ql-thin {
      stroke-width: 1;
    }
    .ql-snow .ql-transparent {
      opacity: 0.4;
    }
    .ql-snow .ql-direction svg:last-child {
      display: none;
    }
    .ql-snow .ql-direction.ql-active svg:last-child {
      display: inline;
    }
    .ql-snow .ql-direction.ql-active svg:first-child {
      display: none;
    }
    .ql-snow .ql-editor h1 {
      font-size: 2em;
    }
    .ql-snow .ql-editor h2 {
      font-size: 1.5em;
    }
    .ql-snow .ql-editor h3 {
      font-size: 1.17em;
    }
    .ql-snow .ql-editor h4 {
      font-size: 1em;
    }
    .ql-snow .ql-editor h5 {
      font-size: 0.83em;
    }
    .ql-snow .ql-editor h6 {
      font-size: 0.67em;
    }
    .ql-snow .ql-editor blockquote {
      border-left: 4px solid #ccc;
      margin-bottom: 5px;
      margin-top: 5px;
      padding-left: 16px;
    }
    .ql-snow .ql-editor code,
    .ql-snow .ql-editor pre {
      background-color: #f0f0f0;
      border-radius: 3px;
    }
    .ql-snow .ql-editor pre {
      white-space: pre-wrap;
      margin-bottom: 5px;
      margin-top: 5px;
      padding: 5px 10px;
    }
    .ql-snow .ql-editor code {
      font-size: 85%;
      padding-bottom: 2px;
      padding-top: 2px;
    }
    .ql-snow .ql-editor code:before,
    .ql-snow .ql-editor code:after {
      letter-spacing: -2px;
    }
    .ql-snow .ql-editor pre.ql-syntax {
      background-color: #23241f;
      color: #f8f8f2;
      overflow: visible;
    }
    .ql-snow .ql-editor img {
      max-width: 100%;
    }
    .ql-snow .ql-editor img.ql-img-align-left {
      display: inline;
      float: left;
      margin: 0 1em 1em 0;
    }
    .ql-snow .ql-editor img.ql-img-align-center {
      display: block;
      float: none;
      margin: auto;
    }
    .ql-snow .ql-editor img.ql-img-align-right {
      display: inline;
      float: right;
      margin: 0 0 1em 1em;
    }
    .ql-snow .ql-editor blockquote {
      font-family: serif;
      font-style: italic;
    }
  `;