export  const quillStyle = 
  `.ql-editor {
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
