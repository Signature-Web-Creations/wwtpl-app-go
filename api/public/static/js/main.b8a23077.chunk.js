(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{26:function(e,t,c){},28:function(e,t,c){},35:function(e,t,c){"use strict";c.r(t);var r=c(1),n=c.n(r),a=c(18),s=c.n(a),i=c(3),u=(c(26),c(2)),o=c(5),l={adminHome:"/admin",home:"/",login:"/login",logout:"/logout",showUsers:"/users",addUser:"/adduser",showSourceArchives:"/sourceArchives",addSourceArchive:"/addSourceArchive",newRecord:"/record/new",editRecord:{url:"/record/edit",params:{id:":id"}},viewRecord:{url:"/record/view",params:{id:":id"}}};function d(e,t){var c="";if(void 0===(c="string"===typeof l[e]?l[e]:void 0!==t?l[e].url+"/"+t.id:l[e].url+"/"+l[e].params.id))throw new Error("Route doesn't exist: ".concat(e));return c}var j=c(0);function h(e){return Object(j.jsx)("div",{className:"uk-margin-top",children:e.children})}function b(e){if(0===e.currentPage)return null;var t=e.type?e.type:"",c="/".concat(t,"?offset=").concat(e.currentPage-1);return Object(j.jsxs)("a",{href:c,children:[Object(j.jsx)("span",{className:"uk-margin-small-right","uk-pagination-previous":"true"}),"Previous"]})}function m(e){if(e.currentPage>=e.pages)return null;var t=e.type?e.type:"",c="/".concat(t,"?offset=").concat(e.currentPage+1);return Object(j.jsxs)("a",{href:c,children:["Next",Object(j.jsx)("span",{className:"uk-margin-small-left","uk-pagination-next":"true"})]})}function O(e){return null===e.pages?null:Object(j.jsxs)("ul",{className:"uk-pagination uk-margin-large-top",children:[Object(j.jsx)("li",{children:Object(j.jsx)(b,{currentPage:e.currentPage,type:e.type})}),Object(j.jsx)("li",{children:Object(j.jsx)("hr",{className:"uk-divider-vertical",style:{height:"30px",padding:"4px 0",borderWidth:"2px"}})}),Object(j.jsx)("li",{children:Object(j.jsx)(m,{currentPage:e.currentPage,pages:e.pages,type:e.type})})]})}c(28);function p(e){var t=Object(r.useState)(""),c=Object(u.a)(t,2),n=c[0],a=c[1],s=Object(r.useState)(""),i=Object(u.a)(s,2),o=i[0],l=i[1],d=Object(r.useState)(""),h=Object(u.a)(d,2),b=h[0],m=h[1],O=Object(r.useState)(""),p=Object(u.a)(O,2),f=p[0],x=p[1],v=Object(r.useState)(""),k=Object(u.a)(v,2),g=k[0],y=k[1],N=Object(r.useState)(""),S=Object(u.a)(N,2),w=S[0],T=S[1],C=Object(r.useState)(!1),A=Object(u.a)(C,2),R=A[0],P=A[1],U="advancedSearchOptions uk-grid-small ".concat(R?"show":""),I=void 0!==e.user&&"editor"!==e.user.role?"uk-width-1-4@s":"uk-width-1-3@s";return Object(j.jsxs)("form",{className:"uk-margin-large-top",onSubmit:function(t){t.preventDefault(),function(){var t={query:n,searchYear:o,searchCollection:b,searchSourceArchive:f,searchRecordType:g,searchStatus:w};e.onSubmit(t)}()},children:[Object(j.jsxs)("div",{className:"searchBar uk-grid-small","uk-grid":"true",children:[Object(j.jsx)("div",{className:"uk-width-expand@s",children:Object(j.jsx)("input",{className:"uk-input",value:n,type:"text",placeholder:"Search",onChange:function(e){a(e.target.value)}})}),Object(j.jsx)("div",{className:"uk-width-1-3@s",children:Object(j.jsxs)("select",{className:"uk-select",value:o,onChange:function(e){l(e.target.value)},children:[Object(j.jsx)("option",{value:"",children:"Year"}),e.years.map((function(e){return Object(j.jsxs)("option",{value:e,children:[" ",e," "]},e)}))]})}),Object(j.jsxs)("div",{className:"advancedSearchButton uk-width-auto@s uk-grid-small","uk-grid":"true",children:[Object(j.jsx)("div",{className:"uk-width-auto",children:Object(j.jsx)("button",{className:"uk-button uk-button-default","uk-icon":"more","uk-tooltip":"Advanced Search Options",onClick:function(){P(!R)}})}),Object(j.jsx)("div",{className:"uk-width-auto",children:Object(j.jsx)("button",{className:"uk-button uk-button-default",type:"submit","uk-icon":"refresh","uk-tooltip":"Clear Search",onClick:function(){a(""),l(""),m(""),x(""),y(""),T("")}})}),Object(j.jsx)("div",{className:"uk-width-auto",children:Object(j.jsx)("button",{className:"uk-button uk-button-primary searchButton",type:"submit","uk-icon":"search","uk-tooltip":"Search"})})]})]}),Object(j.jsxs)("div",{className:U,"uk-grid":"true",children:[Object(j.jsx)("div",{className:I,children:Object(j.jsxs)("select",{className:"uk-select",value:g,onChange:function(e){y(e.target.value)},children:[Object(j.jsx)("option",{value:"",children:" Type "}),e.recordTypes.map((function(e){var t=e.id,c=e.name;return Object(j.jsxs)("option",{value:t,children:[" ",c," "]},t)}))]})}),Object(j.jsx)("div",{className:I,children:Object(j.jsxs)("select",{className:"uk-select",value:f,onChange:function(e){x(e.target.value)},children:[Object(j.jsx)("option",{value:"",children:" Source Archive "}),e.sourceArchives.map((function(e){var t=e.id,c=e.name;return Object(j.jsxs)("option",{value:t,children:[" ",c," "]},t)}))]})}),Object(j.jsx)("div",{className:I,children:Object(j.jsxs)("select",{className:"uk-select",value:b,onChange:function(e){m(e.target.value)},children:[Object(j.jsx)("option",{value:"",children:" Collection "}),e.collections.map((function(e){var t=e.id,c=e.name;return Object(j.jsxs)("option",{value:t,children:[" ",c," "]},t)}))]})}),void 0!==e.user&&"editor"!==e.user.role&&Object(j.jsx)("div",{className:I,children:Object(j.jsxs)("select",{className:"uk-select",value:w,onChange:function(e){T(e.target.value)},children:[Object(j.jsx)("option",{value:"",children:"Status"}),e.status.map((function(e){var t=e.id,c=e.name;return Object(j.jsxs)("option",{value:t,children:[" ",c," "]},t)}))]})})]})]})}function f(e){return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:e.date}),Object(j.jsx)("td",{children:e.title}),Object(j.jsx)("td",{children:e.type}),Object(j.jsx)("td",{children:Object(j.jsxs)(i.b,{to:d("viewRecord",{id:e.id}),className:"uk-button uk-button-primary",children:[" ","View"," "]})})]})}function x(){return Object(j.jsx)("h1",{children:" Your search did not return any results. "})}function v(e){return Object(j.jsxs)("table",{className:"uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium",children:[Object(j.jsx)("thead",{children:Object(j.jsxs)("tr",{children:[Object(j.jsx)("th",{className:"uk-width-small",children:"Date"}),Object(j.jsx)("th",{children:"Title"}),Object(j.jsx)("th",{children:"Type"}),Object(j.jsx)("th",{className:"uk-table-shrink"})]})}),Object(j.jsx)("tbody",{children:e.records.map((function(e){var t=e.id,c=e.date,r=e.title,n=e.recordType;return Object(j.jsx)(f,{id:t,date:c,title:r,type:n.name},t)}))})]})}function k(e){return null===e.records?e.searched?Object(j.jsx)(x,{}):null:Object(j.jsx)(v,{records:e.records})}var g=c(4),y=c.n(g),N=c(10),S=function(e,t){var c=function(e){var t=[];return e.offset&&null!==e.offset&&t.push("offset=".concat(encodeURIComponent(e.offset))),e.query&&""!==e.query&&t.push("query=".concat(encodeURIComponent(e.query))),e.searchYear&&""!==e.searchYear&&t.push("year=".concat(encodeURIComponent(e.searchYear))),e.searchCollection&&""!==e.searchCollection&&t.push("collection=".concat(encodeURIComponent(e.searchCollection))),e.searchSourceArchive&&""!==e.searchSourceArchive&&t.push("sourceArchive=".concat(encodeURIComponent(e.searchSourceArchive))),e.searchRecordType&&""!==e.searchRecordType&&t.push("recordType=".concat(encodeURIComponent(e.searchRecordType))),e.searchRecordStatus&&""!==e.searchRecordStatus&&t.push("recordStatus=".concat(encodeURIComponent(e.searchRecordStatus))),t}(t);return 0!==c.length?e+"?".concat(c.join("&")):e};function w(e){var t=S("/api/records",e);return fetch(t).then((function(e){return e.json()}))}function T(e){var t=S("/api/public/records",e);return fetch(t).then((function(e){return e.json()}))}function C(){return(C=Object(N.a)(y.a.mark((function e(t){var c;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/records/".concat(t),{method:"GET",mode:"same-origin",cache:"no-cache",credentials:"include"});case 2:return c=e.sent,e.next=5,c.json();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function A(){return(A=Object(N.a)(y.a.mark((function e(t,c){var r,n;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r={username:t,password:c},e.next=3,fetch("/api/login",{method:"POST",mode:"same-origin",cache:"no-cache",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});case 3:return n=e.sent,e.abrupt("return",n.json());case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function R(){return(R=Object(N.a)(y.a.mark((function e(){return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch("/api/logout",{method:"POST",mode:"same-origin",cache:"no-cache",credentials:"include"}));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function P(){return(P=Object(N.a)(y.a.mark((function e(t){var c;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/user",{method:"POST",mode:"same-origin",cache:"no-cache",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 2:return c=e.sent,e.abrupt("return",c.json());case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function U(){return(U=Object(N.a)(y.a.mark((function e(){var t;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/users",{method:"GET",mode:"same-origin",cache:"no-cache",credentials:"include"});case 2:return t=e.sent,e.abrupt("return",t.json());case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function I(){return(I=Object(N.a)(y.a.mark((function e(){var t;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/user_roles",{method:"GET",mode:"same-origin",cache:"no-cache"});case 2:return t=e.sent,e.abrupt("return",t.json());case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function D(){return(D=Object(N.a)(y.a.mark((function e(t){var c;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/user/disable",{method:"POST",mode:"same-origin",cache:"no-cache",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:t})});case 2:return c=e.sent,e.abrupt("return",c.json());case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var E=function(e){var t=new FormData;return t.append("title",e.title),t.append("content",e.content),null!==e.file&&t.append("file",e.file),t.append("date",e.date),t.append("author",e.author),t.append("recordType",e.recordType),t.append("sourceArchive",e.sourceArchive),t.append("collections",e.collections),t.append("recordStatus",e.recordStatus),t};function Y(){return(Y=Object(N.a)(y.a.mark((function e(t){var c;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/records",{method:"POST",mode:"same-origin",cache:"no-cache",credentials:"include",body:E(t)});case 2:return c=e.sent,e.abrupt("return",c.json());case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function q(){return(q=Object(N.a)(y.a.mark((function e(t,c){var r;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/records/".concat(t),{method:"POST",mode:"same-origin",cache:"no-cache",credentials:"include",body:E(c)});case 2:return r=e.sent,e.abrupt("return",r.json());case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function L(){return(L=Object(N.a)(y.a.mark((function e(t,c){var r;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/records/status/".concat(t),{method:"POST",mode:"same-origin",cache:"no-cache",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({recordId:t,recordStatusId:c})});case 2:return r=e.sent,e.abrupt("return",r.json());case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function F(){return(F=Object(N.a)(y.a.mark((function e(t){var c;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/records/delete/".concat(t),{method:"POST",mode:"same-origin",cache:"no-cache",credentials:"include",headers:{"Content-Type":"application/json"}});case 2:return c=e.sent,e.abrupt("return",c);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function H(){return(H=Object(N.a)(y.a.mark((function e(t){var c;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/records/restore/".concat(t),{method:"POST",mode:"same-origin",cache:"no-cache",credentials:"include",headers:{"Content-Type":"application/json"}});case 2:return c=e.sent,e.abrupt("return",c);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var J=function(e,t){return e||t};function B(){return Object(j.jsx)("h1",{children:" Loading "})}function G(e){return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{className:"uk-width-medium",children:Object(j.jsx)("strong",{children:"Title"})}),Object(j.jsx)("td",{children:e.title})]})}function M(e){return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)("strong",{children:" Document "})}),Object(j.jsx)("td",{children:Object(j.jsx)("embed",{src:"/media/".concat(e.src),type:"application/pdf",width:"100%",height:"600px"})})]})}function z(e){return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)("strong",{children:"Image"})}),Object(j.jsx)("td",{children:Object(j.jsx)("img",{alt:e.alt,src:"/media/".concat(e.src)})})]})}function V(e){return console.log("FileAttachment: ",e.attachmentType),null===e.attachmentType?null:"document"===e.attachmentType?(console.log("Loading a pdf"),Object(j.jsx)(M,{src:e.fileName})):"image"===e.attachmentType?Object(j.jsx)(z,{alt:e.title,src:e.fileName}):null}function W(e){var t=""===e.content?"No content":e.content;return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)("strong",{children:"Text"})}),Object(j.jsxs)("td",{children:[" ",t," "]})]})}var _=function(e){var t=e.match(/(\d{4})-(\d{2})-(\d{2})/);if(null!==t){var c=t[1],r=t[2],n=t[3];return"".concat(r,"/").concat(n,"/").concat(c)}return e};function K(e){return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)("strong",{children:"Date"})}),Object(j.jsxs)("td",{children:[""===e.date?"Date unknown":_(e.date)," "]})]})}function Q(e){return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)("strong",{children:"Origin"})}),Object(j.jsx)("td",{children:J(e.origin,"Origin Unknown")})]})}function X(e){return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)("strong",{children:"Author"})}),Object(j.jsx)("td",{children:J(e.author,"Unknown")})]})}function Z(e){return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)("strong",{children:"Type"})}),Object(j.jsx)("td",{children:J(e.recordType.name,"Unknown")})]})}function $(e){return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)("strong",{children:"Source Archive"})}),Object(j.jsx)("td",{children:J(e.sourceArchive.name,"Unknown")})]})}function ee(e){var t=function(e){return e?e.split(";"):[]}(e.collections);return 0===t.length&&t.push("Collection Unknown"),Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)("strong",{children:"Collection"})}),Object(j.jsx)("td",{children:t.map((function(e){return Object(j.jsxs)("span",{className:"uk-label",children:[" ",e," "]},e)}))})]})}function te(e){var t=e.record;return Object(j.jsx)("table",{className:"uk-table uk-table-small uk-table-divider uk-margin-medium",children:Object(j.jsxs)("tbody",{children:[Object(j.jsx)(G,{title:t.title}),Object(j.jsx)(V,{title:t.title,attachmentType:t.attachmentType,fileName:t.fileName}),Object(j.jsx)(W,{content:t.content}),Object(j.jsx)(K,{date:t.date}),Object(j.jsx)(Q,{origin:t.origin}),Object(j.jsx)(X,{author:t.author}),Object(j.jsx)(Z,{recordType:t.recordType}),Object(j.jsx)($,{sourceArchive:t.sourceArchive}),Object(j.jsx)(ee,{collections:t.collections})]})})}var ce=function(e){var t=Object(o.h)().id,c=Object(r.useState)(null),n=Object(u.a)(c,2),a=n[0],s=n[1];return Object(r.useEffect)((function(){(function(e){return fetch("/api/public/records/".concat(e)).then((function(e){return e.json()}))})(t).then(s)}),[t]),a?Object(j.jsx)(te,{record:a}):Object(j.jsx)(B,{})},re=c(16),ne=c(21),ae=Object(r.createContext)();function se(){return Object(r.useContext)(ae)}function ie(){var e=Object(r.useState)(!1),t=Object(u.a)(e,2),c=t[0],n=t[1];Object(r.useEffect)((function(){fetch("/api/user").then((function(e){return e.json()})).then((function(e){e.username&&n(e)}))}),[]);return{user:c,signin:function(e,t,c){(function(e,t){return A.apply(this,arguments)})(e,t).then((function(e){e.success?n(e.user):c("invalid username/password")}))},signout:function(){n(!1),function(){R.apply(this,arguments)}()}}}function ue(e){var t=e.children,c=ie();return Object(j.jsx)(ae.Provider,{value:c,children:t})}function oe(e){var t=e.children,c=Object(ne.a)(e,["children"]),r=se();return Object(j.jsx)(o.b,Object(re.a)(Object(re.a)({},c),{},{render:function(){return r.user?t:Object(j.jsx)(o.a,{to:"/"})}}))}var le=function(e){var t="";return t="error"===e.type?"uk-alert-danger":"warning"===e.type?"uk-alert-warning":"uk-alert-success",Object(j.jsxs)("div",{"uk-alert":"true",className:t,children:["warning"!==e.type&&Object(j.jsx)("button",{className:"uk-alert-close","uk-close":"true",onClick:e.onClick}),Object(j.jsx)("p",{children:e.message})]})};function de(e){var t=se(),c=Object(r.useState)(""),n=Object(u.a)(c,2),a=n[0],s=n[1],i=Object(r.useState)(""),l=Object(u.a)(i,2),d=l[0],h=l[1],b=Object(r.useState)(null),m=Object(u.a)(b,2),O=m[0],p=m[1];return t.user?Object(j.jsx)(o.a,{to:"/dashboard"}):Object(j.jsxs)("form",{className:"uk-form-stacked uk-form-width-large uk-margin-top",onSubmit:function(e){e.preventDefault(),t.signin(a,d,(function(e){return p(e)}))},children:[O&&Object(j.jsx)(le,{onClick:function(){p(null)},message:O,type:"error"}),Object(j.jsxs)("div",{children:[Object(j.jsx)("label",{className:"uk-form-label",children:" Username "}),Object(j.jsx)("input",{className:"uk-form-width-large uk-input",type:"text",name:"username",onChange:function(e){p(null),s(e.target.value)},value:a})]}),Object(j.jsxs)("div",{children:[Object(j.jsx)("label",{className:"uk-form-label",children:" Password "}),Object(j.jsx)("input",{className:"uk-form-width-large uk-input",type:"password",name:"password",onChange:function(e){p(null),h(e.target.value)},value:d})]}),Object(j.jsx)("input",{className:"uk-button uk-button-primary uk-margin-top",type:"submit",value:"login"})]})}function je(){return new URLSearchParams(Object(o.g)().search)}var he=function(e){var t=se(),c=function(e){return"unpublished"===e?"uk-label uk-label-warning":"deleted"===e?"uk-label uk-label-error":"uk-label uk-label-success"},r=d("editRecord",{id:e.id});return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)(i.b,{to:r,className:"uk-icon-link uk-margin-small-right","uk-icon":"file-edit"})}),"admin"===t.user.role&&Object(j.jsx)("td",{children:Object(j.jsx)("button",{onClick:e.onDelete,className:"uk-icon-link uk-margin-small-right","uk-icon":e.deleted?"refresh":"trash"})}),Object(j.jsx)("td",{children:e.date}),Object(j.jsx)("td",{children:e.title}),Object(j.jsx)("td",{children:e.deleted?Object(j.jsx)("span",{className:c("deleted"),children:" Deleted "}):Object(j.jsx)("span",{className:c(e.status.name),children:e.status.name})})]})};function be(){return Object(j.jsx)("h1",{children:" Your search did not return any results. "})}function me(e){return Object(j.jsxs)("table",{className:"uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium",children:[Object(j.jsx)("thead",{children:Object(j.jsxs)("tr",{children:[Object(j.jsx)("th",{className:"uk-table-small"}),void 0!==e.user&&"admin"===e.user.role&&Object(j.jsx)("th",{className:"uk-table-small"}),Object(j.jsx)("th",{className:"uk-width-small",children:"Date"}),Object(j.jsx)("th",{children:"Title"}),Object(j.jsx)("th",{children:"Status"})]})}),Object(j.jsx)("tbody",{children:e.records.map((function(t){var c=t.id,r=t.date,n=t.title,a=t.recordStatus,s=t.deleted;return Object(j.jsx)(he,{id:c,date:r,title:n,status:a,deleted:s,onDelete:function(){e.onDelete(c)}},c)}))})]})}function Oe(e){return null===e.records?e.searched?Object(j.jsx)(be,{}):null:Object(j.jsx)(me,{records:e.records,onDelete:e.onDelete})}function pe(){var e=se(),t=function(e){var t=e.get("offset");if(null===t)return 0;var c=parseInt(t);return isNaN(c)?0:c}(je()),c=Object(r.useState)(null),n=Object(u.a)(c,2),a=n[0],s=n[1],o=Object(r.useState)([]),l=Object(u.a)(o,2),h=l[0],b=l[1],m=Object(r.useState)(null),f=Object(u.a)(m,2),x=f[0],v=f[1],k=Object(r.useState)([]),g=Object(u.a)(k,2),y=g[0],N=g[1],S=Object(r.useState)([]),T=Object(u.a)(S,2),C=T[0],A=T[1],R=Object(r.useState)([]),P=Object(u.a)(R,2),U=P[0],I=P[1],D=Object(r.useState)([]),E=Object(u.a)(D,2),Y=E[0],q=E[1],L=Object(r.useState)(!1),J=Object(u.a)(L,2),B=J[0],G=J[1];return Object(r.useEffect)((function(){w({offset:t}).then((function(e){var t=e.records,c=e.pages,r=e.years,n=e.collections,a=e.sourceArchives,i=e.recordTypes,u=e.recordStatus;s(t),v(c),b(r),A(n.collections),I(a),N(i),q(u)}))}),[t,e.user]),Object(j.jsxs)(j.Fragment,{children:["admin"===e.user.role&&Object(j.jsxs)(i.b,{to:d("showUsers"),className:"uk-button uk-button-default uk-margin-right",children:[" ","Manage Users"," "]}),"admin"===e.user.role&&Object(j.jsxs)(i.b,{to:d("showSourceArchives"),className:"uk-button uk-button-default uk-margin-right",children:[" ","Manage Source Archives"," "]}),Object(j.jsxs)(i.b,{to:d("newRecord"),className:"uk-button uk-button-default",children:[" ","New Record"," "]}),Object(j.jsx)(p,{years:h||[],recordTypes:y,collections:C,sourceArchives:U,status:Y,user:e.user,onSubmit:function(c){if(e.user){var r=c.query,n=c.searchYear,a=c.searchCollection,i=c.searchSourceArchive,u=c.searchRecordType,o=c.searchStatus;w({offset:t,query:r,searchYear:n,searchCollection:a,searchSourceArchive:i,searchRecordType:u,searchStatus:o}).then((function(e){var t=e.records,c=e.pages,r=e.years;s(t),v(c),b(r),G(!0)}))}}}),Object(j.jsx)(O,{currentPage:t||0,pages:x,type:"admin"}),Object(j.jsx)(Oe,{searched:B,records:a,user:e.user,onDelete:function(e){var t=!1,c=a.map((function(c){return c.id===e?(c.deleted=!c.deleted,t=c.deleted,c):c}));t?function(e){F.apply(this,arguments)}(e):function(e){H.apply(this,arguments)}(e),s(c)}})]})}function fe(e){return 0===e.trim().length}function xe(e){return Object(j.jsxs)("label",{className:"uk-form-danger",children:[" *",e.error," "]})}var ve=function(e){var t=Object(o.h)().id,c=Object(r.useState)(""),n=Object(u.a)(c,2),a=n[0],s=n[1],i=Object(r.useState)(""),l=Object(u.a)(i,2),d=l[0],h=l[1],b=Object(r.useState)(null),m=Object(u.a)(b,2),O=m[0],p=m[1],f=Object(r.useState)(""),x=Object(u.a)(f,2),v=x[0],k=x[1],g=Object(r.useState)(""),y=Object(u.a)(g,2),N=y[0],S=y[1],w=Object(r.useState)(""),T=Object(u.a)(w,2),A=T[0],R=T[1],P=Object(r.useState)(""),U=Object(u.a)(P,2),I=U[0],D=U[1],E=Object(r.useState)(""),F=Object(u.a)(E,2),H=F[0],J=F[1],B=Object(r.useState)([]),G=Object(u.a)(B,2),M=G[0],z=G[1],V=Object(r.useState)(null),W=Object(u.a)(V,2),_=W[0],K=W[1],Q=void 0===t,X=Object(r.useState)({message:null,type:null}),Z=Object(u.a)(X,2),$=Z[0],ee=Z[1],te=Object(r.useState)({title:null,date:null,recordType:null,sourceArchive:null,collections:null}),ce=Object(u.a)(te,2),re=ce[0],ne=ce[1],ae=function(e){if(void 0===re[e])throw new Error("Cannot create helper function for unknown field: ".concat(e));return function(){if(re[e]){var t={};t[e]=null,ne(Object.assign(re,t))}}},se=ae("title"),ie=ae("date"),ue=ae("recordType"),oe=ae("sourceArchive"),de=ae("collections"),je=function(){var e=!0,t={};return fe(a)&&(t.title="Title is required",e=!1),t.date=fe(v)?"Date is required.":null,e=e&&null===t.date,""===I&&(t.recordType="You need to select a record type",e=!1),""===H&&(t.sourceArchive="You need to select a source archive",e=!1),0===M.length&&(t.collections="You need to select at least one collection"),ne(Object.assign(re,t)),e};Object(r.useEffect)((function(){Q||function(e){return C.apply(this,arguments)}(t).then((function(c){if(c.record){var r=c.record;s(r.title),h(r.content),k(r.date),S(r.origin),R(r.author),null!==r.recordType&&D(r.recordType.id),null!==r.sourceArchive&&J(r.sourceArchive.id),3===r.recordStatus.id?(!function(e,t){L.apply(this,arguments)}(t,4),K(4)):K(r.recordStatus.id);var n=[];r.collections.split(";").forEach((function(t){e.collectionToId[t]&&n.push(e.collectionToId[t])})),z(n)}}))}),[Q,t,e.collectionToId]);var he=function(e){var t=parseInt(e);if(isNaN(t))throw new Error("Couldn't parse int on string: ".concat(e));return t},be=function(e){if(je()){var c={title:a.trim(),content:d.trim(),file:O,date:v.trim(),origin:N.trim(),author:A.trim(),recordType:he(I),sourceArchive:he(H),collections:M.map(he),recordStatus:null===e?1:e};Q?function(e){return Y.apply(this,arguments)}(c).then((function(e){e.error?ee({message:e.error,type:"error"}):(s(""),h(""),k(""),S(""),R(""),D(""),J(""),z([]),ee({message:e.success,type:"success"}))})):function(e,t){return q.apply(this,arguments)}(he(t),c).then((function(e){e.error?ee({message:e.error,type:"error"}):ee({message:e.success,type:"success"})}))}else ee({message:"Please fill out required fields correctly",type:"error"})},me=Q?"New Record":"Edit Record";return Object(j.jsxs)("form",{className:"uk-form-horizontal uk-margin-large uk-margin-top",encType:"multipart/form-data",onSubmit:be,children:[$.message&&Object(j.jsx)(le,{onChange:function(){ee({message:null,type:null})},message:$.message,type:$.type}),"unpublished"===_&&Object(j.jsx)(le,{message:"The record has been unpublished while in edit mode!",type:"warning"}),Object(j.jsxs)("h1",{children:[" ",me," "]}),Object(j.jsxs)("div",{className:"uk-margin",children:[Object(j.jsx)("label",{className:"uk-form-label",children:" Title "}),Object(j.jsx)("div",{className:"uk-form-controls",children:Object(j.jsx)("input",{className:"uk-form-width-large uk-input "+(re.title&&"uk-form-danger"),type:"text",value:a,onChange:function(e){se(),s(e.target.value)}})})]}),Object(j.jsxs)("div",{className:"uk-margin",children:[Object(j.jsx)("label",{htmlFor:"file",className:"uk-form-label",children:" Image "}),Object(j.jsx)("div",{className:"uk-form-controls",children:Object(j.jsx)("input",{type:"file",name:"file",accept:".jpg, .jpeg, .png",onChange:function(e){p(e.target.files[0])}})})]}),Object(j.jsxs)("div",{className:"uk-margin",children:[Object(j.jsx)("label",{className:"uk-form-label",children:" Content "}),Object(j.jsx)("div",{className:"uk-form-controls",children:Object(j.jsx)("textarea",{className:"uk-form-width-large uk-textarea",value:d,onChange:function(e){h(e.target.value)}})})]}),Object(j.jsxs)("div",{className:"uk-margin",children:[Object(j.jsx)("label",{className:"uk-form-label",children:" Date "}),Object(j.jsx)("div",{className:"uk-form-controls",children:Object(j.jsx)("input",{className:"uk-form-width-large uk-input "+(re.date&&"uk-form-danger"),type:"date",value:v,onChange:function(e){ie(),k(e.target.value)}})})]}),Object(j.jsxs)("div",{className:"uk-margin",children:[Object(j.jsx)("label",{className:"uk-form-label",children:" Origin "}),Object(j.jsx)("div",{className:"uk-form-controls",children:Object(j.jsx)("input",{className:"uk-form-width-large uk-input",type:"text",value:N,onChange:function(e){S(e.target.value)}})})]}),Object(j.jsxs)("div",{className:"uk-margin",children:[Object(j.jsx)("label",{className:"uk-form-label",children:" Author "}),Object(j.jsx)("div",{className:"uk-form-controls",children:Object(j.jsx)("input",{className:"uk-form-width-large uk-input",type:"text",value:A,onChange:function(e){R(e.target.value)}})})]}),Object(j.jsxs)("div",{className:"uk-margin",children:[Object(j.jsx)("label",{className:"uk-form-label",children:" Record Type "}),Object(j.jsx)("div",{className:"uk-form-controls",children:Object(j.jsxs)("select",{className:"uk-form-width-large uk-select "+(re.recordType&&"uk-form-danger"),value:I,onChange:function(e){ue(),D(e.target.value)},children:[Object(j.jsx)("option",{value:"",children:" No Record Type "}),e.recordTypes.map((function(e){var t=e.id,c=e.name;return Object(j.jsxs)("option",{value:t,children:[" ",c," "]},t)}))]})})]}),Object(j.jsxs)("div",{className:"uk-margin",children:[Object(j.jsx)("label",{className:"uk-form-label",children:" Source Archive "}),Object(j.jsx)("div",{className:"uk-form-controls",children:Object(j.jsxs)("select",{className:"uk-form-width-large uk-select "+(re.sourceArchive&&"uk-form-danger"),value:H,onChange:function(e){oe(),J(e.target.value)},children:[Object(j.jsx)("option",{value:"",children:" No Source Archive "}),e.sourceArchives.map((function(e){var t=e.id,c=e.name;return Object(j.jsxs)("option",{value:t,children:[" ",c," "]},t)}))]})})]}),Object(j.jsxs)("div",{className:"uk-margin",children:[Object(j.jsx)("label",{className:"uk-form-label",children:" Collections "}),Object(j.jsxs)("div",{className:"uk-form-controls uk-form-controls-text",children:[Object(j.jsx)("div",{children:re.collections&&Object(j.jsx)(xe,{error:re.collections})}),Object(j.jsx)("div",{className:"uk-grid-small uk-child-width-1-2 uk-grid",children:e.collections.map((function(e){var t=e.id,c=e.name;return Object(j.jsxs)("label",{children:[Object(j.jsx)("input",{className:"uk-checkbox",type:"checkbox",name:"collections",value:t,checked:M.includes(t),onChange:function(){de(),function(e){M.includes(e)?z(M.filter((function(t){return t!==e}))):z(M.concat(e))}(t)}},t),"\xa0\xa0 ",c]},t)}))})]})]}),Object(j.jsxs)("div",{className:"uk-form-width-large",children:[Object(j.jsx)("input",{className:"uk-button uk-button-default uk-margin-top uk-margin-right",onClick:function(){be(_)},type:"button",value:"Save"}),!Q&&1!==_&&Object(j.jsx)("input",{className:"uk-button uk-button-primary uk-margin-top",onClick:function(){be(3)},type:"button",value:"Save & Publish"}),(Q||1===_)&&Object(j.jsx)("input",{className:"uk-button uk-button-primary uk-margin-top",onClick:function(){be(2)},type:"button",value:"Submit for Approval"})]})]})};var ke=function(){var e=Object(r.useState)(""),t=Object(u.a)(e,2),c=t[0],n=t[1],a=Object(r.useState)(""),s=Object(u.a)(a,2),i=s[0],o=s[1],l=Object(r.useState)(""),d=Object(u.a)(l,2),h=d[0],b=d[1],m=Object(r.useState)(""),O=Object(u.a)(m,2),p=O[0],f=O[1],x=Object(r.useState)(1),v=Object(u.a)(x,2),k=v[0],g=v[1],y=Object(r.useState)([]),N=Object(u.a)(y,2),S=N[0],w=N[1],T=Object(r.useState)(null),C=Object(u.a)(T,2),A=C[0],R=C[1],U=Object(r.useState)(null),D=Object(u.a)(U,2),E=D[0],Y=D[1];return Object(r.useEffect)((function(){(function(){return I.apply(this,arguments)})().then((function(e){e.roles&&w(e.roles)}))}),[]),Object(j.jsxs)("form",{className:"uk-form-stacked uk-form-width-large uk-margin-top",onSubmit:function(e){e.preventDefault(),function(e){return P.apply(this,arguments)}({firstName:c,lastName:i,username:h,password:p,roleId:k}).then((function(e){e.success?(Y(e.success),n(""),o(""),b(""),f(""),g(1)):R(e.error)}))},children:[E&&Object(j.jsx)(le,{onClick:function(){Y(null)},message:E,type:"success"}),A&&Object(j.jsx)(le,{onClick:function(){R(null)},message:A,type:"error"}),Object(j.jsxs)("div",{children:[Object(j.jsx)("label",{className:"uk-form-label uk-margin-top",children:"First Name"}),Object(j.jsx)("input",{className:"uk-form-width-large uk-input",type:"text",name:"firstName",onChange:function(e){n(e.target.value)},value:c})]}),Object(j.jsxs)("div",{children:[Object(j.jsx)("label",{className:"uk-form-label uk-margin-top",children:"Last Name"}),Object(j.jsx)("input",{className:"uk-form-width-large uk-input",type:"text",name:"lastName",onChange:function(e){o(e.target.value),b(c.charAt(0).toLowerCase()+e.target.value.toLowerCase())},value:i})]}),Object(j.jsxs)("div",{children:[Object(j.jsx)("label",{className:"uk-form-label uk-margin-top",children:"Username"}),Object(j.jsx)("input",{className:"uk-form-width-large uk-input",type:"text",name:"username",onChange:function(e){b(e.target.value)},value:h})]}),Object(j.jsxs)("div",{children:[Object(j.jsx)("label",{className:"uk-form-label uk-margin-top",children:"Password"}),Object(j.jsx)("input",{className:"uk-form-width-large uk-input",type:"password",name:"password",onChange:function(e){f(e.target.value)},value:p})]}),Object(j.jsxs)("div",{children:[Object(j.jsx)("label",{className:"uk-form-label uk-margin-top",children:"Role"}),Object(j.jsx)("select",{className:"uk-select",value:k,onChange:function(e){var t=parseInt(e.target.value);isNaN(t)?g(1):g(t)},children:0!==S.length&&S.map((function(e){var t,c=e.id,r=e.name;return Object(j.jsxs)("option",{value:c,children:[" ",(t=r,t.length>0?t[0].toUpperCase()+t.slice(1):t)," "]},c)}))})]}),Object(j.jsx)("input",{className:"uk-button uk-button-primary uk-margin-top",type:"submit",value:"Create User"})]})};function ge(e){var t=e.id,c=e.firstName,r=e.lastName,n=e.username,a=e.role;return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)(i.b,{to:"/editUser/".concat(t),className:"uk-icon-link uk-margin-small-right","uk-icon":"file-edit"})}),Object(j.jsx)("td",{children:Object(j.jsx)(i.b,{onClick:function(e){e.preventDefault();var c=parseInt(t);isNaN(c)&&console.log("Id was not a number"),function(e){return D.apply(this,arguments)}(t).then((function(e){e.error?console.log(e.error):console.log(e.success)}))},className:"uk-icon-link uk-margin-small-right","uk-icon":"trash"})}),Object(j.jsx)("td",{children:r}),Object(j.jsx)("td",{children:c}),Object(j.jsx)("td",{children:n}),Object(j.jsx)("td",{children:a})]})}function ye(e){var t=Object(r.useState)([]),c=Object(u.a)(t,2),n=c[0],a=c[1];return Object(r.useEffect)((function(){(function(){return U.apply(this,arguments)})().then((function(e){e.users&&a(e.users)}))}),[]),Object(j.jsxs)("div",{children:[Object(j.jsxs)(i.b,{to:d("addUser"),className:"uk-button uk-button-primary uk-margin-right",children:[" ","Add New User"," "]}),Object(j.jsxs)("table",{className:"uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium",children:[Object(j.jsx)("thead",{children:Object(j.jsxs)("tr",{children:[Object(j.jsx)("th",{className:"uk-table-small"}),Object(j.jsx)("th",{className:"uk-table-small"}),Object(j.jsx)("th",{className:"uk-width-small",children:"Last Name"}),Object(j.jsx)("th",{children:"First Name"}),Object(j.jsx)("th",{children:"Username"}),Object(j.jsx)("th",{children:"Role"})]})}),Object(j.jsx)("tbody",{children:n.map((function(e){var t=e.id,c=e.firstName,r=e.lastName,n=e.username,a=e.role;return Object(j.jsx)(ge,{id:t,firstName:c,lastName:r,username:n,role:a})}))})]})]})}function Ne(e){var t=e.id,c=e.name;return Object(j.jsxs)("tr",{children:[Object(j.jsx)("td",{children:Object(j.jsx)(i.b,{to:"/editSourceArchive/".concat(t),className:"uk-icon-link uk-margin-small-right","uk-icon":"file-edit"})}),Object(j.jsx)("td",{children:c})]})}function Se(e){var t=Object(r.useState)([]),c=Object(u.a)(t,2),n=c[0],a=c[1];return Object(r.useEffect)((function(){fetch("/api/sourceArchives",{method:"GET",mode:"same-origin",cache:"no-cache",credentials:"include",headers:{"Content-Type":"application/json"}}).then((function(e){e.sourceArchives&&a(e.sourceArchives)}))}),[]),Object(j.jsxs)("div",{children:[Object(j.jsxs)(i.b,{to:d("addSourceArchive"),className:"uk-button uk-button-primary uk-margin-right",children:[" ","Add New Source Archive"," "]}),Object(j.jsxs)("table",{className:"uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium",children:[Object(j.jsx)("thead",{children:Object(j.jsxs)("tr",{children:[Object(j.jsx)("th",{className:"uk-table-small"}),Object(j.jsx)("th",{className:"uk-table-small"}),Object(j.jsx)("th",{className:"uk-width-small",children:"Name"})]})}),Object(j.jsx)("tbody",{children:n.map((function(e){var t=e.id,c=e.name;return Object(j.jsx)(Ne,{id:t,name:c})}))})]})]})}var we=function(){var e=se(),t=function(e){var t=e.get("offset");if(null===t)return 0;var c=parseInt(t);return isNaN(c)?0:c}(je()),c=Object(r.useState)(null),n=Object(u.a)(c,2),a=n[0],s=n[1],l=Object(r.useState)([]),b=Object(u.a)(l,2),m=b[0],f=b[1],x=Object(r.useState)(null),v=Object(u.a)(x,2),g=v[0],y=v[1],N=Object(r.useState)([]),S=Object(u.a)(N,2),w=S[0],C=S[1],A=Object(r.useState)([]),R=Object(u.a)(A,2),P=R[0],U=R[1],I=Object(r.useState)({}),D=Object(u.a)(I,2),E=D[0],Y=D[1],q=Object(r.useState)([]),L=Object(u.a)(q,2),F=L[0],H=L[1],J=Object(r.useState)([]),B=Object(u.a)(J,2),G=B[0],M=B[1],z=Object(r.useState)(!1),V=Object(u.a)(z,2),W=V[0],_=V[1];return Object(r.useEffect)((function(){T({offset:t}).then((function(e){var t=e.records,c=e.pages,r=e.years,n=e.collections,a=e.sourceArchives,i=e.recordTypes,u=e.recordStatus;s(t),y(c),f(r),U(n.collections),Y(n.collectionToId),H(a),C(i),M(u)}))}),[t]),Object(j.jsxs)("div",{className:"uk-marign-top",children:[Object(j.jsxs)("header",{children:[Object(j.jsx)("h1",{children:" History Database "}),Object(j.jsxs)("nav",{className:"uk-navbar",children:[Object(j.jsx)("div",{className:"uk-nav-bar-left",children:Object(j.jsx)("ul",{className:"uk-navbar-nav",children:e.user?Object(j.jsx)("li",{children:Object(j.jsx)(i.b,{to:d("adminHome"),children:" Dashboard "})}):Object(j.jsx)("li",{children:Object(j.jsx)(i.b,{to:d("home"),children:" Home "})})})}),Object(j.jsx)("div",{className:"uk-navbar-right",children:Object(j.jsx)("ul",{className:"uk-navbar-nav",children:e.user?Object(j.jsx)("li",{children:Object(j.jsxs)(i.b,{to:d("logout"),onClick:function(){e.signout()},children:[" ","Logout"," "]})}):Object(j.jsx)("li",{children:Object(j.jsx)(i.b,{to:d("login"),children:" Login "})})})})]})]}),Object(j.jsxs)(o.d,{children:[Object(j.jsxs)(o.b,{path:d("viewRecord"),children:[Object(j.jsx)(h,{children:Object(j.jsx)("h1",{className:"uk-text-lead",children:" History Record "})}),Object(j.jsx)(ce,{records:a})]}),Object(j.jsx)(o.b,{path:d("login"),children:Object(j.jsx)(de,{})}),Object(j.jsx)(oe,{path:d("newRecord"),children:Object(j.jsx)(ve,{recordTypes:w,collections:P,sourceArchives:F,recordStatus:G,buttonText:"Add"})}),Object(j.jsx)(oe,{path:d("editRecord"),children:Object(j.jsx)(ve,{recordTypes:w,collections:P,sourceArchives:F,recordStatus:G,collectionToId:E,buttonText:"Update"})}),Object(j.jsx)(oe,{path:d("adminHome"),children:Object(j.jsx)(pe,{records:a})}),Object(j.jsx)(oe,{path:d("addUser"),children:Object(j.jsx)(ke,{})}),Object(j.jsx)(oe,{path:d("showSourceArchives"),children:Object(j.jsx)(Se,{})}),Object(j.jsx)(oe,{path:d("showUsers"),children:Object(j.jsx)(ye,{})}),Object(j.jsx)(o.b,{path:d("logout"),children:Object(j.jsx)(o.a,{to:d("home")})}),Object(j.jsx)(o.b,{path:d("home"),children:e.user?Object(j.jsx)(o.a,{to:d("adminHome")}):Object(j.jsxs)(j.Fragment,{children:[Object(j.jsxs)(h,{children:[Object(j.jsx)("h1",{className:"uk-text-lead",children:" History Listing "}),Object(j.jsx)(p,{years:m||[],recordTypes:w,collections:P,sourceArchives:F,onSubmit:function(e){var c=e.query,r=e.searchYear,n=e.searchCollection,a=e.searchSourceArchive,i=e.searchRecordType;T({offset:t,query:c,searchYear:r,searchCollection:n,searchSourceArchive:a,searchRecordType:i}).then((function(e){var t=e.records,c=e.pages,r=e.years;s(t),y(c),f(r),_(!0)}))}}),Object(j.jsx)(O,{currentPage:t||0,pages:g})]}),Object(j.jsx)(k,{searched:W,records:a})]})})]})]})},Te=function(e){e&&e instanceof Function&&c.e(3).then(c.bind(null,36)).then((function(t){var c=t.getCLS,r=t.getFID,n=t.getFCP,a=t.getLCP,s=t.getTTFB;c(e),r(e),n(e),a(e),s(e)}))};s.a.render(Object(j.jsx)(ue,{children:Object(j.jsx)(i.a,{children:Object(j.jsx)(n.a.StrictMode,{children:Object(j.jsx)(we,{})})})}),document.getElementById("root")),Te()}},[[35,1,2]]]);
//# sourceMappingURL=main.b8a23077.chunk.js.map