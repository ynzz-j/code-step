var md=Object.defineProperty;var gd=(e,t,n)=>t in e?md(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var uo=(e,t,n)=>gd(e,typeof t!="symbol"?t+"":t,n);function hd(e,t){for(var n=0;n<t.length;n++){const r=t[n];if(typeof r!="string"&&!Array.isArray(r)){for(const i in r)if(i!=="default"&&!(i in e)){const l=Object.getOwnPropertyDescriptor(r,i);l&&Object.defineProperty(e,i,l.get?l:{enumerable:!0,get:()=>r[i]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const a of l.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(i){if(i.ep)return;i.ep=!0;const l=n(i);fetch(i.href,l)}})();function As(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var bs={exports:{}},vi={},Ds={exports:{}},R={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var or=Symbol.for("react.element"),vd=Symbol.for("react.portal"),yd=Symbol.for("react.fragment"),Sd=Symbol.for("react.strict_mode"),xd=Symbol.for("react.profiler"),wd=Symbol.for("react.provider"),kd=Symbol.for("react.context"),Cd=Symbol.for("react.forward_ref"),Ed=Symbol.for("react.suspense"),jd=Symbol.for("react.memo"),Nd=Symbol.for("react.lazy"),co=Symbol.iterator;function Md(e){return e===null||typeof e!="object"?null:(e=co&&e[co]||e["@@iterator"],typeof e=="function"?e:null)}var Is={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Fs=Object.assign,Us={};function mn(e,t,n){this.props=e,this.context=t,this.refs=Us,this.updater=n||Is}mn.prototype.isReactComponent={};mn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};mn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function $s(){}$s.prototype=mn.prototype;function da(e,t,n){this.props=e,this.context=t,this.refs=Us,this.updater=n||Is}var fa=da.prototype=new $s;fa.constructor=da;Fs(fa,mn.prototype);fa.isPureReactComponent=!0;var fo=Array.isArray,Hs=Object.prototype.hasOwnProperty,pa={current:null},Bs={key:!0,ref:!0,__self:!0,__source:!0};function Vs(e,t,n){var r,i={},l=null,a=null;if(t!=null)for(r in t.ref!==void 0&&(a=t.ref),t.key!==void 0&&(l=""+t.key),t)Hs.call(t,r)&&!Bs.hasOwnProperty(r)&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),u=0;u<o;u++)s[u]=arguments[u+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return{$$typeof:or,type:e,key:l,ref:a,props:i,_owner:pa.current}}function _d(e,t){return{$$typeof:or,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function ma(e){return typeof e=="object"&&e!==null&&e.$$typeof===or}function Pd(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var po=/\/+/g;function Fi(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Pd(""+e.key):t.toString(36)}function zr(e,t,n,r,i){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var a=!1;if(e===null)a=!0;else switch(l){case"string":case"number":a=!0;break;case"object":switch(e.$$typeof){case or:case vd:a=!0}}if(a)return a=e,i=i(a),e=r===""?"."+Fi(a,0):r,fo(i)?(n="",e!=null&&(n=e.replace(po,"$&/")+"/"),zr(i,t,n,"",function(u){return u})):i!=null&&(ma(i)&&(i=_d(i,n+(!i.key||a&&a.key===i.key?"":(""+i.key).replace(po,"$&/")+"/")+e)),t.push(i)),1;if(a=0,r=r===""?".":r+":",fo(e))for(var o=0;o<e.length;o++){l=e[o];var s=r+Fi(l,o);a+=zr(l,t,n,s,i)}else if(s=Md(e),typeof s=="function")for(e=s.call(e),o=0;!(l=e.next()).done;)l=l.value,s=r+Fi(l,o++),a+=zr(l,t,n,s,i);else if(l==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return a}function hr(e,t,n){if(e==null)return e;var r=[],i=0;return zr(e,r,"","",function(l){return t.call(n,l,i++)}),r}function Ld(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var ce={current:null},Ar={transition:null},Td={ReactCurrentDispatcher:ce,ReactCurrentBatchConfig:Ar,ReactCurrentOwner:pa};function Ws(){throw Error("act(...) is not supported in production builds of React.")}R.Children={map:hr,forEach:function(e,t,n){hr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return hr(e,function(){t++}),t},toArray:function(e){return hr(e,function(t){return t})||[]},only:function(e){if(!ma(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};R.Component=mn;R.Fragment=yd;R.Profiler=xd;R.PureComponent=da;R.StrictMode=Sd;R.Suspense=Ed;R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Td;R.act=Ws;R.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Fs({},e.props),i=e.key,l=e.ref,a=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,a=pa.current),t.key!==void 0&&(i=""+t.key),e.type&&e.type.defaultProps)var o=e.type.defaultProps;for(s in t)Hs.call(t,s)&&!Bs.hasOwnProperty(s)&&(r[s]=t[s]===void 0&&o!==void 0?o[s]:t[s])}var s=arguments.length-2;if(s===1)r.children=n;else if(1<s){o=Array(s);for(var u=0;u<s;u++)o[u]=arguments[u+2];r.children=o}return{$$typeof:or,type:e.type,key:i,ref:l,props:r,_owner:a}};R.createContext=function(e){return e={$$typeof:kd,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:wd,_context:e},e.Consumer=e};R.createElement=Vs;R.createFactory=function(e){var t=Vs.bind(null,e);return t.type=e,t};R.createRef=function(){return{current:null}};R.forwardRef=function(e){return{$$typeof:Cd,render:e}};R.isValidElement=ma;R.lazy=function(e){return{$$typeof:Nd,_payload:{_status:-1,_result:e},_init:Ld}};R.memo=function(e,t){return{$$typeof:jd,type:e,compare:t===void 0?null:t}};R.startTransition=function(e){var t=Ar.transition;Ar.transition={};try{e()}finally{Ar.transition=t}};R.unstable_act=Ws;R.useCallback=function(e,t){return ce.current.useCallback(e,t)};R.useContext=function(e){return ce.current.useContext(e)};R.useDebugValue=function(){};R.useDeferredValue=function(e){return ce.current.useDeferredValue(e)};R.useEffect=function(e,t){return ce.current.useEffect(e,t)};R.useId=function(){return ce.current.useId()};R.useImperativeHandle=function(e,t,n){return ce.current.useImperativeHandle(e,t,n)};R.useInsertionEffect=function(e,t){return ce.current.useInsertionEffect(e,t)};R.useLayoutEffect=function(e,t){return ce.current.useLayoutEffect(e,t)};R.useMemo=function(e,t){return ce.current.useMemo(e,t)};R.useReducer=function(e,t,n){return ce.current.useReducer(e,t,n)};R.useRef=function(e){return ce.current.useRef(e)};R.useState=function(e){return ce.current.useState(e)};R.useSyncExternalStore=function(e,t,n){return ce.current.useSyncExternalStore(e,t,n)};R.useTransition=function(){return ce.current.useTransition()};R.version="18.3.1";Ds.exports=R;var k=Ds.exports;const Ks=As(k),Od=hd({__proto__:null,default:Ks},[k]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Rd=k,zd=Symbol.for("react.element"),Ad=Symbol.for("react.fragment"),bd=Object.prototype.hasOwnProperty,Dd=Rd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Id={key:!0,ref:!0,__self:!0,__source:!0};function Qs(e,t,n){var r,i={},l=null,a=null;n!==void 0&&(l=""+n),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(a=t.ref);for(r in t)bd.call(t,r)&&!Id.hasOwnProperty(r)&&(i[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)i[r]===void 0&&(i[r]=t[r]);return{$$typeof:zd,type:e,key:l,ref:a,props:i,_owner:Dd.current}}vi.Fragment=Ad;vi.jsx=Qs;vi.jsxs=Qs;bs.exports=vi;var m=bs.exports,gl={},Js={exports:{}},we={},Gs={exports:{}},Ys={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(_,L){var O=_.length;_.push(L);e:for(;0<O;){var W=O-1>>>1,X=_[W];if(0<i(X,L))_[W]=L,_[O]=X,O=W;else break e}}function n(_){return _.length===0?null:_[0]}function r(_){if(_.length===0)return null;var L=_[0],O=_.pop();if(O!==L){_[0]=O;e:for(var W=0,X=_.length,mr=X>>>1;W<mr;){var kt=2*(W+1)-1,Ii=_[kt],Ct=kt+1,gr=_[Ct];if(0>i(Ii,O))Ct<X&&0>i(gr,Ii)?(_[W]=gr,_[Ct]=O,W=Ct):(_[W]=Ii,_[kt]=O,W=kt);else if(Ct<X&&0>i(gr,O))_[W]=gr,_[Ct]=O,W=Ct;else break e}}return L}function i(_,L){var O=_.sortIndex-L.sortIndex;return O!==0?O:_.id-L.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;e.unstable_now=function(){return l.now()}}else{var a=Date,o=a.now();e.unstable_now=function(){return a.now()-o}}var s=[],u=[],g=1,d=null,h=3,y=!1,S=!1,x=!1,j=typeof setTimeout=="function"?setTimeout:null,p=typeof clearTimeout=="function"?clearTimeout:null,c=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function f(_){for(var L=n(u);L!==null;){if(L.callback===null)r(u);else if(L.startTime<=_)r(u),L.sortIndex=L.expirationTime,t(s,L);else break;L=n(u)}}function v(_){if(x=!1,f(_),!S)if(n(s)!==null)S=!0,bi(C);else{var L=n(u);L!==null&&Di(v,L.startTime-_)}}function C(_,L){S=!1,x&&(x=!1,p(P),P=-1),y=!0;var O=h;try{for(f(L),d=n(s);d!==null&&(!(d.expirationTime>L)||_&&!re());){var W=d.callback;if(typeof W=="function"){d.callback=null,h=d.priorityLevel;var X=W(d.expirationTime<=L);L=e.unstable_now(),typeof X=="function"?d.callback=X:d===n(s)&&r(s),f(L)}else r(s);d=n(s)}if(d!==null)var mr=!0;else{var kt=n(u);kt!==null&&Di(v,kt.startTime-L),mr=!1}return mr}finally{d=null,h=O,y=!1}}var M=!1,E=null,P=-1,A=5,T=-1;function re(){return!(e.unstable_now()-T<A)}function yn(){if(E!==null){var _=e.unstable_now();T=_;var L=!0;try{L=E(!0,_)}finally{L?Sn():(M=!1,E=null)}}else M=!1}var Sn;if(typeof c=="function")Sn=function(){c(yn)};else if(typeof MessageChannel<"u"){var so=new MessageChannel,pd=so.port2;so.port1.onmessage=yn,Sn=function(){pd.postMessage(null)}}else Sn=function(){j(yn,0)};function bi(_){E=_,M||(M=!0,Sn())}function Di(_,L){P=j(function(){_(e.unstable_now())},L)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(_){_.callback=null},e.unstable_continueExecution=function(){S||y||(S=!0,bi(C))},e.unstable_forceFrameRate=function(_){0>_||125<_?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):A=0<_?Math.floor(1e3/_):5},e.unstable_getCurrentPriorityLevel=function(){return h},e.unstable_getFirstCallbackNode=function(){return n(s)},e.unstable_next=function(_){switch(h){case 1:case 2:case 3:var L=3;break;default:L=h}var O=h;h=L;try{return _()}finally{h=O}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(_,L){switch(_){case 1:case 2:case 3:case 4:case 5:break;default:_=3}var O=h;h=_;try{return L()}finally{h=O}},e.unstable_scheduleCallback=function(_,L,O){var W=e.unstable_now();switch(typeof O=="object"&&O!==null?(O=O.delay,O=typeof O=="number"&&0<O?W+O:W):O=W,_){case 1:var X=-1;break;case 2:X=250;break;case 5:X=1073741823;break;case 4:X=1e4;break;default:X=5e3}return X=O+X,_={id:g++,callback:L,priorityLevel:_,startTime:O,expirationTime:X,sortIndex:-1},O>W?(_.sortIndex=O,t(u,_),n(s)===null&&_===n(u)&&(x?(p(P),P=-1):x=!0,Di(v,O-W))):(_.sortIndex=X,t(s,_),S||y||(S=!0,bi(C))),_},e.unstable_shouldYield=re,e.unstable_wrapCallback=function(_){var L=h;return function(){var O=h;h=L;try{return _.apply(this,arguments)}finally{h=O}}}})(Ys);Gs.exports=Ys;var Fd=Gs.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ud=k,xe=Fd;function w(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Xs=new Set,Hn={};function Dt(e,t){an(e,t),an(e+"Capture",t)}function an(e,t){for(Hn[e]=t,e=0;e<t.length;e++)Xs.add(t[e])}var Ke=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),hl=Object.prototype.hasOwnProperty,$d=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,mo={},go={};function Hd(e){return hl.call(go,e)?!0:hl.call(mo,e)?!1:$d.test(e)?go[e]=!0:(mo[e]=!0,!1)}function Bd(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Vd(e,t,n,r){if(t===null||typeof t>"u"||Bd(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function de(e,t,n,r,i,l,a){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=a}var ne={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ne[e]=new de(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ne[t]=new de(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){ne[e]=new de(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ne[e]=new de(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ne[e]=new de(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){ne[e]=new de(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){ne[e]=new de(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){ne[e]=new de(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){ne[e]=new de(e,5,!1,e.toLowerCase(),null,!1,!1)});var ga=/[\-:]([a-z])/g;function ha(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(ga,ha);ne[t]=new de(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(ga,ha);ne[t]=new de(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(ga,ha);ne[t]=new de(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){ne[e]=new de(e,1,!1,e.toLowerCase(),null,!1,!1)});ne.xlinkHref=new de("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){ne[e]=new de(e,1,!1,e.toLowerCase(),null,!0,!0)});function va(e,t,n,r){var i=ne.hasOwnProperty(t)?ne[t]:null;(i!==null?i.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Vd(t,n,i,r)&&(n=null),r||i===null?Hd(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):i.mustUseProperty?e[i.propertyName]=n===null?i.type===3?!1:"":n:(t=i.attributeName,r=i.attributeNamespace,n===null?e.removeAttribute(t):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var Xe=Ud.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,vr=Symbol.for("react.element"),$t=Symbol.for("react.portal"),Ht=Symbol.for("react.fragment"),ya=Symbol.for("react.strict_mode"),vl=Symbol.for("react.profiler"),Zs=Symbol.for("react.provider"),qs=Symbol.for("react.context"),Sa=Symbol.for("react.forward_ref"),yl=Symbol.for("react.suspense"),Sl=Symbol.for("react.suspense_list"),xa=Symbol.for("react.memo"),et=Symbol.for("react.lazy"),eu=Symbol.for("react.offscreen"),ho=Symbol.iterator;function xn(e){return e===null||typeof e!="object"?null:(e=ho&&e[ho]||e["@@iterator"],typeof e=="function"?e:null)}var B=Object.assign,Ui;function Pn(e){if(Ui===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Ui=t&&t[1]||""}return`
`+Ui+e}var $i=!1;function Hi(e,t){if(!e||$i)return"";$i=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(u){var r=u}Reflect.construct(e,[],t)}else{try{t.call()}catch(u){r=u}e.call(t.prototype)}else{try{throw Error()}catch(u){r=u}e()}}catch(u){if(u&&r&&typeof u.stack=="string"){for(var i=u.stack.split(`
`),l=r.stack.split(`
`),a=i.length-1,o=l.length-1;1<=a&&0<=o&&i[a]!==l[o];)o--;for(;1<=a&&0<=o;a--,o--)if(i[a]!==l[o]){if(a!==1||o!==1)do if(a--,o--,0>o||i[a]!==l[o]){var s=`
`+i[a].replace(" at new "," at ");return e.displayName&&s.includes("<anonymous>")&&(s=s.replace("<anonymous>",e.displayName)),s}while(1<=a&&0<=o);break}}}finally{$i=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?Pn(e):""}function Wd(e){switch(e.tag){case 5:return Pn(e.type);case 16:return Pn("Lazy");case 13:return Pn("Suspense");case 19:return Pn("SuspenseList");case 0:case 2:case 15:return e=Hi(e.type,!1),e;case 11:return e=Hi(e.type.render,!1),e;case 1:return e=Hi(e.type,!0),e;default:return""}}function xl(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Ht:return"Fragment";case $t:return"Portal";case vl:return"Profiler";case ya:return"StrictMode";case yl:return"Suspense";case Sl:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case qs:return(e.displayName||"Context")+".Consumer";case Zs:return(e._context.displayName||"Context")+".Provider";case Sa:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case xa:return t=e.displayName||null,t!==null?t:xl(e.type)||"Memo";case et:t=e._payload,e=e._init;try{return xl(e(t))}catch{}}return null}function Kd(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return xl(t);case 8:return t===ya?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function ht(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function tu(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Qd(e){var t=tu(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,l=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(a){r=""+a,l.call(this,a)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(a){r=""+a},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function yr(e){e._valueTracker||(e._valueTracker=Qd(e))}function nu(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=tu(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Kr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function wl(e,t){var n=t.checked;return B({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n!=null?n:e._wrapperState.initialChecked})}function vo(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=ht(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function ru(e,t){t=t.checked,t!=null&&va(e,"checked",t,!1)}function kl(e,t){ru(e,t);var n=ht(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Cl(e,t.type,n):t.hasOwnProperty("defaultValue")&&Cl(e,t.type,ht(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function yo(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Cl(e,t,n){(t!=="number"||Kr(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Ln=Array.isArray;function qt(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t["$"+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty("$"+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=""+ht(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function El(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(w(91));return B({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function So(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(w(92));if(Ln(n)){if(1<n.length)throw Error(w(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:ht(n)}}function iu(e,t){var n=ht(t.value),r=ht(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function xo(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function lu(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function jl(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?lu(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Sr,au=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,i){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,i)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Sr=Sr||document.createElement("div"),Sr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Sr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Bn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Rn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Jd=["Webkit","ms","Moz","O"];Object.keys(Rn).forEach(function(e){Jd.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Rn[t]=Rn[e]})});function ou(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Rn.hasOwnProperty(e)&&Rn[e]?(""+t).trim():t+"px"}function su(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=ou(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,i):e[n]=i}}var Gd=B({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Nl(e,t){if(t){if(Gd[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(w(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(w(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(w(61))}if(t.style!=null&&typeof t.style!="object")throw Error(w(62))}}function Ml(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var _l=null;function wa(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Pl=null,en=null,tn=null;function wo(e){if(e=cr(e)){if(typeof Pl!="function")throw Error(w(280));var t=e.stateNode;t&&(t=ki(t),Pl(e.stateNode,e.type,t))}}function uu(e){en?tn?tn.push(e):tn=[e]:en=e}function cu(){if(en){var e=en,t=tn;if(tn=en=null,wo(e),t)for(e=0;e<t.length;e++)wo(t[e])}}function du(e,t){return e(t)}function fu(){}var Bi=!1;function pu(e,t,n){if(Bi)return e(t,n);Bi=!0;try{return du(e,t,n)}finally{Bi=!1,(en!==null||tn!==null)&&(fu(),cu())}}function Vn(e,t){var n=e.stateNode;if(n===null)return null;var r=ki(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(w(231,t,typeof n));return n}var Ll=!1;if(Ke)try{var wn={};Object.defineProperty(wn,"passive",{get:function(){Ll=!0}}),window.addEventListener("test",wn,wn),window.removeEventListener("test",wn,wn)}catch{Ll=!1}function Yd(e,t,n,r,i,l,a,o,s){var u=Array.prototype.slice.call(arguments,3);try{t.apply(n,u)}catch(g){this.onError(g)}}var zn=!1,Qr=null,Jr=!1,Tl=null,Xd={onError:function(e){zn=!0,Qr=e}};function Zd(e,t,n,r,i,l,a,o,s){zn=!1,Qr=null,Yd.apply(Xd,arguments)}function qd(e,t,n,r,i,l,a,o,s){if(Zd.apply(this,arguments),zn){if(zn){var u=Qr;zn=!1,Qr=null}else throw Error(w(198));Jr||(Jr=!0,Tl=u)}}function It(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function mu(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function ko(e){if(It(e)!==e)throw Error(w(188))}function ef(e){var t=e.alternate;if(!t){if(t=It(e),t===null)throw Error(w(188));return t!==e?null:e}for(var n=e,r=t;;){var i=n.return;if(i===null)break;var l=i.alternate;if(l===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===l.child){for(l=i.child;l;){if(l===n)return ko(i),e;if(l===r)return ko(i),t;l=l.sibling}throw Error(w(188))}if(n.return!==r.return)n=i,r=l;else{for(var a=!1,o=i.child;o;){if(o===n){a=!0,n=i,r=l;break}if(o===r){a=!0,r=i,n=l;break}o=o.sibling}if(!a){for(o=l.child;o;){if(o===n){a=!0,n=l,r=i;break}if(o===r){a=!0,r=l,n=i;break}o=o.sibling}if(!a)throw Error(w(189))}}if(n.alternate!==r)throw Error(w(190))}if(n.tag!==3)throw Error(w(188));return n.stateNode.current===n?e:t}function gu(e){return e=ef(e),e!==null?hu(e):null}function hu(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=hu(e);if(t!==null)return t;e=e.sibling}return null}var vu=xe.unstable_scheduleCallback,Co=xe.unstable_cancelCallback,tf=xe.unstable_shouldYield,nf=xe.unstable_requestPaint,K=xe.unstable_now,rf=xe.unstable_getCurrentPriorityLevel,ka=xe.unstable_ImmediatePriority,yu=xe.unstable_UserBlockingPriority,Gr=xe.unstable_NormalPriority,lf=xe.unstable_LowPriority,Su=xe.unstable_IdlePriority,yi=null,Fe=null;function af(e){if(Fe&&typeof Fe.onCommitFiberRoot=="function")try{Fe.onCommitFiberRoot(yi,e,void 0,(e.current.flags&128)===128)}catch{}}var Re=Math.clz32?Math.clz32:uf,of=Math.log,sf=Math.LN2;function uf(e){return e>>>=0,e===0?32:31-(of(e)/sf|0)|0}var xr=64,wr=4194304;function Tn(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Yr(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,i=e.suspendedLanes,l=e.pingedLanes,a=n&268435455;if(a!==0){var o=a&~i;o!==0?r=Tn(o):(l&=a,l!==0&&(r=Tn(l)))}else a=n&~i,a!==0?r=Tn(a):l!==0&&(r=Tn(l));if(r===0)return 0;if(t!==0&&t!==r&&!(t&i)&&(i=r&-r,l=t&-t,i>=l||i===16&&(l&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Re(t),i=1<<n,r|=e[n],t&=~i;return r}function cf(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function df(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,l=e.pendingLanes;0<l;){var a=31-Re(l),o=1<<a,s=i[a];s===-1?(!(o&n)||o&r)&&(i[a]=cf(o,t)):s<=t&&(e.expiredLanes|=o),l&=~o}}function Ol(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function xu(){var e=xr;return xr<<=1,!(xr&4194240)&&(xr=64),e}function Vi(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function sr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Re(t),e[t]=n}function ff(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var i=31-Re(n),l=1<<i;t[i]=0,r[i]=-1,e[i]=-1,n&=~l}}function Ca(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Re(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}var b=0;function wu(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var ku,Ea,Cu,Eu,ju,Rl=!1,kr=[],ot=null,st=null,ut=null,Wn=new Map,Kn=new Map,nt=[],pf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Eo(e,t){switch(e){case"focusin":case"focusout":ot=null;break;case"dragenter":case"dragleave":st=null;break;case"mouseover":case"mouseout":ut=null;break;case"pointerover":case"pointerout":Wn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Kn.delete(t.pointerId)}}function kn(e,t,n,r,i,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:l,targetContainers:[i]},t!==null&&(t=cr(t),t!==null&&Ea(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function mf(e,t,n,r,i){switch(t){case"focusin":return ot=kn(ot,e,t,n,r,i),!0;case"dragenter":return st=kn(st,e,t,n,r,i),!0;case"mouseover":return ut=kn(ut,e,t,n,r,i),!0;case"pointerover":var l=i.pointerId;return Wn.set(l,kn(Wn.get(l)||null,e,t,n,r,i)),!0;case"gotpointercapture":return l=i.pointerId,Kn.set(l,kn(Kn.get(l)||null,e,t,n,r,i)),!0}return!1}function Nu(e){var t=Mt(e.target);if(t!==null){var n=It(t);if(n!==null){if(t=n.tag,t===13){if(t=mu(n),t!==null){e.blockedOn=t,ju(e.priority,function(){Cu(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function br(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=zl(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);_l=r,n.target.dispatchEvent(r),_l=null}else return t=cr(n),t!==null&&Ea(t),e.blockedOn=n,!1;t.shift()}return!0}function jo(e,t,n){br(e)&&n.delete(t)}function gf(){Rl=!1,ot!==null&&br(ot)&&(ot=null),st!==null&&br(st)&&(st=null),ut!==null&&br(ut)&&(ut=null),Wn.forEach(jo),Kn.forEach(jo)}function Cn(e,t){e.blockedOn===t&&(e.blockedOn=null,Rl||(Rl=!0,xe.unstable_scheduleCallback(xe.unstable_NormalPriority,gf)))}function Qn(e){function t(i){return Cn(i,e)}if(0<kr.length){Cn(kr[0],e);for(var n=1;n<kr.length;n++){var r=kr[n];r.blockedOn===e&&(r.blockedOn=null)}}for(ot!==null&&Cn(ot,e),st!==null&&Cn(st,e),ut!==null&&Cn(ut,e),Wn.forEach(t),Kn.forEach(t),n=0;n<nt.length;n++)r=nt[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<nt.length&&(n=nt[0],n.blockedOn===null);)Nu(n),n.blockedOn===null&&nt.shift()}var nn=Xe.ReactCurrentBatchConfig,Xr=!0;function hf(e,t,n,r){var i=b,l=nn.transition;nn.transition=null;try{b=1,ja(e,t,n,r)}finally{b=i,nn.transition=l}}function vf(e,t,n,r){var i=b,l=nn.transition;nn.transition=null;try{b=4,ja(e,t,n,r)}finally{b=i,nn.transition=l}}function ja(e,t,n,r){if(Xr){var i=zl(e,t,n,r);if(i===null)el(e,t,r,Zr,n),Eo(e,r);else if(mf(i,e,t,n,r))r.stopPropagation();else if(Eo(e,r),t&4&&-1<pf.indexOf(e)){for(;i!==null;){var l=cr(i);if(l!==null&&ku(l),l=zl(e,t,n,r),l===null&&el(e,t,r,Zr,n),l===i)break;i=l}i!==null&&r.stopPropagation()}else el(e,t,r,null,n)}}var Zr=null;function zl(e,t,n,r){if(Zr=null,e=wa(r),e=Mt(e),e!==null)if(t=It(e),t===null)e=null;else if(n=t.tag,n===13){if(e=mu(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Zr=e,null}function Mu(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(rf()){case ka:return 1;case yu:return 4;case Gr:case lf:return 16;case Su:return 536870912;default:return 16}default:return 16}}var it=null,Na=null,Dr=null;function _u(){if(Dr)return Dr;var e,t=Na,n=t.length,r,i="value"in it?it.value:it.textContent,l=i.length;for(e=0;e<n&&t[e]===i[e];e++);var a=n-e;for(r=1;r<=a&&t[n-r]===i[l-r];r++);return Dr=i.slice(e,1<r?1-r:void 0)}function Ir(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Cr(){return!0}function No(){return!1}function ke(e){function t(n,r,i,l,a){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=l,this.target=a,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(n=e[o],this[o]=n?n(l):l[o]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Cr:No,this.isPropagationStopped=No,this}return B(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Cr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Cr)},persist:function(){},isPersistent:Cr}),t}var gn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ma=ke(gn),ur=B({},gn,{view:0,detail:0}),yf=ke(ur),Wi,Ki,En,Si=B({},ur,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:_a,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==En&&(En&&e.type==="mousemove"?(Wi=e.screenX-En.screenX,Ki=e.screenY-En.screenY):Ki=Wi=0,En=e),Wi)},movementY:function(e){return"movementY"in e?e.movementY:Ki}}),Mo=ke(Si),Sf=B({},Si,{dataTransfer:0}),xf=ke(Sf),wf=B({},ur,{relatedTarget:0}),Qi=ke(wf),kf=B({},gn,{animationName:0,elapsedTime:0,pseudoElement:0}),Cf=ke(kf),Ef=B({},gn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),jf=ke(Ef),Nf=B({},gn,{data:0}),_o=ke(Nf),Mf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},_f={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Pf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Lf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Pf[e])?!!t[e]:!1}function _a(){return Lf}var Tf=B({},ur,{key:function(e){if(e.key){var t=Mf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ir(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?_f[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:_a,charCode:function(e){return e.type==="keypress"?Ir(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ir(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Of=ke(Tf),Rf=B({},Si,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Po=ke(Rf),zf=B({},ur,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:_a}),Af=ke(zf),bf=B({},gn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Df=ke(bf),If=B({},Si,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Ff=ke(If),Uf=[9,13,27,32],Pa=Ke&&"CompositionEvent"in window,An=null;Ke&&"documentMode"in document&&(An=document.documentMode);var $f=Ke&&"TextEvent"in window&&!An,Pu=Ke&&(!Pa||An&&8<An&&11>=An),Lo=" ",To=!1;function Lu(e,t){switch(e){case"keyup":return Uf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Tu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Bt=!1;function Hf(e,t){switch(e){case"compositionend":return Tu(t);case"keypress":return t.which!==32?null:(To=!0,Lo);case"textInput":return e=t.data,e===Lo&&To?null:e;default:return null}}function Bf(e,t){if(Bt)return e==="compositionend"||!Pa&&Lu(e,t)?(e=_u(),Dr=Na=it=null,Bt=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Pu&&t.locale!=="ko"?null:t.data;default:return null}}var Vf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Oo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Vf[e.type]:t==="textarea"}function Ou(e,t,n,r){uu(r),t=qr(t,"onChange"),0<t.length&&(n=new Ma("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var bn=null,Jn=null;function Wf(e){Bu(e,0)}function xi(e){var t=Kt(e);if(nu(t))return e}function Kf(e,t){if(e==="change")return t}var Ru=!1;if(Ke){var Ji;if(Ke){var Gi="oninput"in document;if(!Gi){var Ro=document.createElement("div");Ro.setAttribute("oninput","return;"),Gi=typeof Ro.oninput=="function"}Ji=Gi}else Ji=!1;Ru=Ji&&(!document.documentMode||9<document.documentMode)}function zo(){bn&&(bn.detachEvent("onpropertychange",zu),Jn=bn=null)}function zu(e){if(e.propertyName==="value"&&xi(Jn)){var t=[];Ou(t,Jn,e,wa(e)),pu(Wf,t)}}function Qf(e,t,n){e==="focusin"?(zo(),bn=t,Jn=n,bn.attachEvent("onpropertychange",zu)):e==="focusout"&&zo()}function Jf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return xi(Jn)}function Gf(e,t){if(e==="click")return xi(t)}function Yf(e,t){if(e==="input"||e==="change")return xi(t)}function Xf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ae=typeof Object.is=="function"?Object.is:Xf;function Gn(e,t){if(Ae(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!hl.call(t,i)||!Ae(e[i],t[i]))return!1}return!0}function Ao(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function bo(e,t){var n=Ao(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ao(n)}}function Au(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Au(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function bu(){for(var e=window,t=Kr();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Kr(e.document)}return t}function La(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Zf(e){var t=bu(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Au(n.ownerDocument.documentElement,n)){if(r!==null&&La(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=n.textContent.length,l=Math.min(r.start,i);r=r.end===void 0?l:Math.min(r.end,i),!e.extend&&l>r&&(i=r,r=l,l=i),i=bo(n,l);var a=bo(n,r);i&&a&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==a.node||e.focusOffset!==a.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),l>r?(e.addRange(t),e.extend(a.node,a.offset)):(t.setEnd(a.node,a.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var qf=Ke&&"documentMode"in document&&11>=document.documentMode,Vt=null,Al=null,Dn=null,bl=!1;function Do(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;bl||Vt==null||Vt!==Kr(r)||(r=Vt,"selectionStart"in r&&La(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Dn&&Gn(Dn,r)||(Dn=r,r=qr(Al,"onSelect"),0<r.length&&(t=new Ma("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Vt)))}function Er(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Wt={animationend:Er("Animation","AnimationEnd"),animationiteration:Er("Animation","AnimationIteration"),animationstart:Er("Animation","AnimationStart"),transitionend:Er("Transition","TransitionEnd")},Yi={},Du={};Ke&&(Du=document.createElement("div").style,"AnimationEvent"in window||(delete Wt.animationend.animation,delete Wt.animationiteration.animation,delete Wt.animationstart.animation),"TransitionEvent"in window||delete Wt.transitionend.transition);function wi(e){if(Yi[e])return Yi[e];if(!Wt[e])return e;var t=Wt[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Du)return Yi[e]=t[n];return e}var Iu=wi("animationend"),Fu=wi("animationiteration"),Uu=wi("animationstart"),$u=wi("transitionend"),Hu=new Map,Io="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function yt(e,t){Hu.set(e,t),Dt(t,[e])}for(var Xi=0;Xi<Io.length;Xi++){var Zi=Io[Xi],ep=Zi.toLowerCase(),tp=Zi[0].toUpperCase()+Zi.slice(1);yt(ep,"on"+tp)}yt(Iu,"onAnimationEnd");yt(Fu,"onAnimationIteration");yt(Uu,"onAnimationStart");yt("dblclick","onDoubleClick");yt("focusin","onFocus");yt("focusout","onBlur");yt($u,"onTransitionEnd");an("onMouseEnter",["mouseout","mouseover"]);an("onMouseLeave",["mouseout","mouseover"]);an("onPointerEnter",["pointerout","pointerover"]);an("onPointerLeave",["pointerout","pointerover"]);Dt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Dt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Dt("onBeforeInput",["compositionend","keypress","textInput","paste"]);Dt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Dt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Dt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var On="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),np=new Set("cancel close invalid load scroll toggle".split(" ").concat(On));function Fo(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,qd(r,t,void 0,e),e.currentTarget=null}function Bu(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;e:{var l=void 0;if(t)for(var a=r.length-1;0<=a;a--){var o=r[a],s=o.instance,u=o.currentTarget;if(o=o.listener,s!==l&&i.isPropagationStopped())break e;Fo(i,o,u),l=s}else for(a=0;a<r.length;a++){if(o=r[a],s=o.instance,u=o.currentTarget,o=o.listener,s!==l&&i.isPropagationStopped())break e;Fo(i,o,u),l=s}}}if(Jr)throw e=Tl,Jr=!1,Tl=null,e}function I(e,t){var n=t[$l];n===void 0&&(n=t[$l]=new Set);var r=e+"__bubble";n.has(r)||(Vu(t,e,2,!1),n.add(r))}function qi(e,t,n){var r=0;t&&(r|=4),Vu(n,e,r,t)}var jr="_reactListening"+Math.random().toString(36).slice(2);function Yn(e){if(!e[jr]){e[jr]=!0,Xs.forEach(function(n){n!=="selectionchange"&&(np.has(n)||qi(n,!1,e),qi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[jr]||(t[jr]=!0,qi("selectionchange",!1,t))}}function Vu(e,t,n,r){switch(Mu(t)){case 1:var i=hf;break;case 4:i=vf;break;default:i=ja}n=i.bind(null,t,n,e),i=void 0,!Ll||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),r?i!==void 0?e.addEventListener(t,n,{capture:!0,passive:i}):e.addEventListener(t,n,!0):i!==void 0?e.addEventListener(t,n,{passive:i}):e.addEventListener(t,n,!1)}function el(e,t,n,r,i){var l=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var a=r.tag;if(a===3||a===4){var o=r.stateNode.containerInfo;if(o===i||o.nodeType===8&&o.parentNode===i)break;if(a===4)for(a=r.return;a!==null;){var s=a.tag;if((s===3||s===4)&&(s=a.stateNode.containerInfo,s===i||s.nodeType===8&&s.parentNode===i))return;a=a.return}for(;o!==null;){if(a=Mt(o),a===null)return;if(s=a.tag,s===5||s===6){r=l=a;continue e}o=o.parentNode}}r=r.return}pu(function(){var u=l,g=wa(n),d=[];e:{var h=Hu.get(e);if(h!==void 0){var y=Ma,S=e;switch(e){case"keypress":if(Ir(n)===0)break e;case"keydown":case"keyup":y=Of;break;case"focusin":S="focus",y=Qi;break;case"focusout":S="blur",y=Qi;break;case"beforeblur":case"afterblur":y=Qi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=Mo;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=xf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=Af;break;case Iu:case Fu:case Uu:y=Cf;break;case $u:y=Df;break;case"scroll":y=yf;break;case"wheel":y=Ff;break;case"copy":case"cut":case"paste":y=jf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=Po}var x=(t&4)!==0,j=!x&&e==="scroll",p=x?h!==null?h+"Capture":null:h;x=[];for(var c=u,f;c!==null;){f=c;var v=f.stateNode;if(f.tag===5&&v!==null&&(f=v,p!==null&&(v=Vn(c,p),v!=null&&x.push(Xn(c,v,f)))),j)break;c=c.return}0<x.length&&(h=new y(h,S,null,n,g),d.push({event:h,listeners:x}))}}if(!(t&7)){e:{if(h=e==="mouseover"||e==="pointerover",y=e==="mouseout"||e==="pointerout",h&&n!==_l&&(S=n.relatedTarget||n.fromElement)&&(Mt(S)||S[Qe]))break e;if((y||h)&&(h=g.window===g?g:(h=g.ownerDocument)?h.defaultView||h.parentWindow:window,y?(S=n.relatedTarget||n.toElement,y=u,S=S?Mt(S):null,S!==null&&(j=It(S),S!==j||S.tag!==5&&S.tag!==6)&&(S=null)):(y=null,S=u),y!==S)){if(x=Mo,v="onMouseLeave",p="onMouseEnter",c="mouse",(e==="pointerout"||e==="pointerover")&&(x=Po,v="onPointerLeave",p="onPointerEnter",c="pointer"),j=y==null?h:Kt(y),f=S==null?h:Kt(S),h=new x(v,c+"leave",y,n,g),h.target=j,h.relatedTarget=f,v=null,Mt(g)===u&&(x=new x(p,c+"enter",S,n,g),x.target=f,x.relatedTarget=j,v=x),j=v,y&&S)t:{for(x=y,p=S,c=0,f=x;f;f=Ut(f))c++;for(f=0,v=p;v;v=Ut(v))f++;for(;0<c-f;)x=Ut(x),c--;for(;0<f-c;)p=Ut(p),f--;for(;c--;){if(x===p||p!==null&&x===p.alternate)break t;x=Ut(x),p=Ut(p)}x=null}else x=null;y!==null&&Uo(d,h,y,x,!1),S!==null&&j!==null&&Uo(d,j,S,x,!0)}}e:{if(h=u?Kt(u):window,y=h.nodeName&&h.nodeName.toLowerCase(),y==="select"||y==="input"&&h.type==="file")var C=Kf;else if(Oo(h))if(Ru)C=Yf;else{C=Jf;var M=Qf}else(y=h.nodeName)&&y.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(C=Gf);if(C&&(C=C(e,u))){Ou(d,C,n,g);break e}M&&M(e,h,u),e==="focusout"&&(M=h._wrapperState)&&M.controlled&&h.type==="number"&&Cl(h,"number",h.value)}switch(M=u?Kt(u):window,e){case"focusin":(Oo(M)||M.contentEditable==="true")&&(Vt=M,Al=u,Dn=null);break;case"focusout":Dn=Al=Vt=null;break;case"mousedown":bl=!0;break;case"contextmenu":case"mouseup":case"dragend":bl=!1,Do(d,n,g);break;case"selectionchange":if(qf)break;case"keydown":case"keyup":Do(d,n,g)}var E;if(Pa)e:{switch(e){case"compositionstart":var P="onCompositionStart";break e;case"compositionend":P="onCompositionEnd";break e;case"compositionupdate":P="onCompositionUpdate";break e}P=void 0}else Bt?Lu(e,n)&&(P="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(P="onCompositionStart");P&&(Pu&&n.locale!=="ko"&&(Bt||P!=="onCompositionStart"?P==="onCompositionEnd"&&Bt&&(E=_u()):(it=g,Na="value"in it?it.value:it.textContent,Bt=!0)),M=qr(u,P),0<M.length&&(P=new _o(P,e,null,n,g),d.push({event:P,listeners:M}),E?P.data=E:(E=Tu(n),E!==null&&(P.data=E)))),(E=$f?Hf(e,n):Bf(e,n))&&(u=qr(u,"onBeforeInput"),0<u.length&&(g=new _o("onBeforeInput","beforeinput",null,n,g),d.push({event:g,listeners:u}),g.data=E))}Bu(d,t)})}function Xn(e,t,n){return{instance:e,listener:t,currentTarget:n}}function qr(e,t){for(var n=t+"Capture",r=[];e!==null;){var i=e,l=i.stateNode;i.tag===5&&l!==null&&(i=l,l=Vn(e,n),l!=null&&r.unshift(Xn(e,l,i)),l=Vn(e,t),l!=null&&r.push(Xn(e,l,i))),e=e.return}return r}function Ut(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Uo(e,t,n,r,i){for(var l=t._reactName,a=[];n!==null&&n!==r;){var o=n,s=o.alternate,u=o.stateNode;if(s!==null&&s===r)break;o.tag===5&&u!==null&&(o=u,i?(s=Vn(n,l),s!=null&&a.unshift(Xn(n,s,o))):i||(s=Vn(n,l),s!=null&&a.push(Xn(n,s,o)))),n=n.return}a.length!==0&&e.push({event:t,listeners:a})}var rp=/\r\n?/g,ip=/\u0000|\uFFFD/g;function $o(e){return(typeof e=="string"?e:""+e).replace(rp,`
`).replace(ip,"")}function Nr(e,t,n){if(t=$o(t),$o(e)!==t&&n)throw Error(w(425))}function ei(){}var Dl=null,Il=null;function Fl(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ul=typeof setTimeout=="function"?setTimeout:void 0,lp=typeof clearTimeout=="function"?clearTimeout:void 0,Ho=typeof Promise=="function"?Promise:void 0,ap=typeof queueMicrotask=="function"?queueMicrotask:typeof Ho<"u"?function(e){return Ho.resolve(null).then(e).catch(op)}:Ul;function op(e){setTimeout(function(){throw e})}function tl(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){e.removeChild(i),Qn(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);Qn(t)}function ct(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Bo(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var hn=Math.random().toString(36).slice(2),Ie="__reactFiber$"+hn,Zn="__reactProps$"+hn,Qe="__reactContainer$"+hn,$l="__reactEvents$"+hn,sp="__reactListeners$"+hn,up="__reactHandles$"+hn;function Mt(e){var t=e[Ie];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Qe]||n[Ie]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Bo(e);e!==null;){if(n=e[Ie])return n;e=Bo(e)}return t}e=n,n=e.parentNode}return null}function cr(e){return e=e[Ie]||e[Qe],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Kt(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(w(33))}function ki(e){return e[Zn]||null}var Hl=[],Qt=-1;function St(e){return{current:e}}function F(e){0>Qt||(e.current=Hl[Qt],Hl[Qt]=null,Qt--)}function D(e,t){Qt++,Hl[Qt]=e.current,e.current=t}var vt={},oe=St(vt),me=St(!1),Ot=vt;function on(e,t){var n=e.type.contextTypes;if(!n)return vt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var i={},l;for(l in n)i[l]=t[l];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function ge(e){return e=e.childContextTypes,e!=null}function ti(){F(me),F(oe)}function Vo(e,t,n){if(oe.current!==vt)throw Error(w(168));D(oe,t),D(me,n)}function Wu(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in t))throw Error(w(108,Kd(e)||"Unknown",i));return B({},n,r)}function ni(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||vt,Ot=oe.current,D(oe,e),D(me,me.current),!0}function Wo(e,t,n){var r=e.stateNode;if(!r)throw Error(w(169));n?(e=Wu(e,t,Ot),r.__reactInternalMemoizedMergedChildContext=e,F(me),F(oe),D(oe,e)):F(me),D(me,n)}var He=null,Ci=!1,nl=!1;function Ku(e){He===null?He=[e]:He.push(e)}function cp(e){Ci=!0,Ku(e)}function xt(){if(!nl&&He!==null){nl=!0;var e=0,t=b;try{var n=He;for(b=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}He=null,Ci=!1}catch(i){throw He!==null&&(He=He.slice(e+1)),vu(ka,xt),i}finally{b=t,nl=!1}}return null}var Jt=[],Gt=0,ri=null,ii=0,Ce=[],Ee=0,Rt=null,Be=1,Ve="";function Et(e,t){Jt[Gt++]=ii,Jt[Gt++]=ri,ri=e,ii=t}function Qu(e,t,n){Ce[Ee++]=Be,Ce[Ee++]=Ve,Ce[Ee++]=Rt,Rt=e;var r=Be;e=Ve;var i=32-Re(r)-1;r&=~(1<<i),n+=1;var l=32-Re(t)+i;if(30<l){var a=i-i%5;l=(r&(1<<a)-1).toString(32),r>>=a,i-=a,Be=1<<32-Re(t)+i|n<<i|r,Ve=l+e}else Be=1<<l|n<<i|r,Ve=e}function Ta(e){e.return!==null&&(Et(e,1),Qu(e,1,0))}function Oa(e){for(;e===ri;)ri=Jt[--Gt],Jt[Gt]=null,ii=Jt[--Gt],Jt[Gt]=null;for(;e===Rt;)Rt=Ce[--Ee],Ce[Ee]=null,Ve=Ce[--Ee],Ce[Ee]=null,Be=Ce[--Ee],Ce[Ee]=null}var Se=null,ye=null,U=!1,Oe=null;function Ju(e,t){var n=je(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Ko(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Se=e,ye=ct(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Se=e,ye=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Rt!==null?{id:Be,overflow:Ve}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=je(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,Se=e,ye=null,!0):!1;default:return!1}}function Bl(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Vl(e){if(U){var t=ye;if(t){var n=t;if(!Ko(e,t)){if(Bl(e))throw Error(w(418));t=ct(n.nextSibling);var r=Se;t&&Ko(e,t)?Ju(r,n):(e.flags=e.flags&-4097|2,U=!1,Se=e)}}else{if(Bl(e))throw Error(w(418));e.flags=e.flags&-4097|2,U=!1,Se=e}}}function Qo(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Se=e}function Mr(e){if(e!==Se)return!1;if(!U)return Qo(e),U=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Fl(e.type,e.memoizedProps)),t&&(t=ye)){if(Bl(e))throw Gu(),Error(w(418));for(;t;)Ju(e,t),t=ct(t.nextSibling)}if(Qo(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(w(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ye=ct(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ye=null}}else ye=Se?ct(e.stateNode.nextSibling):null;return!0}function Gu(){for(var e=ye;e;)e=ct(e.nextSibling)}function sn(){ye=Se=null,U=!1}function Ra(e){Oe===null?Oe=[e]:Oe.push(e)}var dp=Xe.ReactCurrentBatchConfig;function jn(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(w(309));var r=n.stateNode}if(!r)throw Error(w(147,e));var i=r,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(a){var o=i.refs;a===null?delete o[l]:o[l]=a},t._stringRef=l,t)}if(typeof e!="string")throw Error(w(284));if(!n._owner)throw Error(w(290,e))}return e}function _r(e,t){throw e=Object.prototype.toString.call(t),Error(w(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Jo(e){var t=e._init;return t(e._payload)}function Yu(e){function t(p,c){if(e){var f=p.deletions;f===null?(p.deletions=[c],p.flags|=16):f.push(c)}}function n(p,c){if(!e)return null;for(;c!==null;)t(p,c),c=c.sibling;return null}function r(p,c){for(p=new Map;c!==null;)c.key!==null?p.set(c.key,c):p.set(c.index,c),c=c.sibling;return p}function i(p,c){return p=mt(p,c),p.index=0,p.sibling=null,p}function l(p,c,f){return p.index=f,e?(f=p.alternate,f!==null?(f=f.index,f<c?(p.flags|=2,c):f):(p.flags|=2,c)):(p.flags|=1048576,c)}function a(p){return e&&p.alternate===null&&(p.flags|=2),p}function o(p,c,f,v){return c===null||c.tag!==6?(c=ul(f,p.mode,v),c.return=p,c):(c=i(c,f),c.return=p,c)}function s(p,c,f,v){var C=f.type;return C===Ht?g(p,c,f.props.children,v,f.key):c!==null&&(c.elementType===C||typeof C=="object"&&C!==null&&C.$$typeof===et&&Jo(C)===c.type)?(v=i(c,f.props),v.ref=jn(p,c,f),v.return=p,v):(v=Wr(f.type,f.key,f.props,null,p.mode,v),v.ref=jn(p,c,f),v.return=p,v)}function u(p,c,f,v){return c===null||c.tag!==4||c.stateNode.containerInfo!==f.containerInfo||c.stateNode.implementation!==f.implementation?(c=cl(f,p.mode,v),c.return=p,c):(c=i(c,f.children||[]),c.return=p,c)}function g(p,c,f,v,C){return c===null||c.tag!==7?(c=Tt(f,p.mode,v,C),c.return=p,c):(c=i(c,f),c.return=p,c)}function d(p,c,f){if(typeof c=="string"&&c!==""||typeof c=="number")return c=ul(""+c,p.mode,f),c.return=p,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case vr:return f=Wr(c.type,c.key,c.props,null,p.mode,f),f.ref=jn(p,null,c),f.return=p,f;case $t:return c=cl(c,p.mode,f),c.return=p,c;case et:var v=c._init;return d(p,v(c._payload),f)}if(Ln(c)||xn(c))return c=Tt(c,p.mode,f,null),c.return=p,c;_r(p,c)}return null}function h(p,c,f,v){var C=c!==null?c.key:null;if(typeof f=="string"&&f!==""||typeof f=="number")return C!==null?null:o(p,c,""+f,v);if(typeof f=="object"&&f!==null){switch(f.$$typeof){case vr:return f.key===C?s(p,c,f,v):null;case $t:return f.key===C?u(p,c,f,v):null;case et:return C=f._init,h(p,c,C(f._payload),v)}if(Ln(f)||xn(f))return C!==null?null:g(p,c,f,v,null);_r(p,f)}return null}function y(p,c,f,v,C){if(typeof v=="string"&&v!==""||typeof v=="number")return p=p.get(f)||null,o(c,p,""+v,C);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case vr:return p=p.get(v.key===null?f:v.key)||null,s(c,p,v,C);case $t:return p=p.get(v.key===null?f:v.key)||null,u(c,p,v,C);case et:var M=v._init;return y(p,c,f,M(v._payload),C)}if(Ln(v)||xn(v))return p=p.get(f)||null,g(c,p,v,C,null);_r(c,v)}return null}function S(p,c,f,v){for(var C=null,M=null,E=c,P=c=0,A=null;E!==null&&P<f.length;P++){E.index>P?(A=E,E=null):A=E.sibling;var T=h(p,E,f[P],v);if(T===null){E===null&&(E=A);break}e&&E&&T.alternate===null&&t(p,E),c=l(T,c,P),M===null?C=T:M.sibling=T,M=T,E=A}if(P===f.length)return n(p,E),U&&Et(p,P),C;if(E===null){for(;P<f.length;P++)E=d(p,f[P],v),E!==null&&(c=l(E,c,P),M===null?C=E:M.sibling=E,M=E);return U&&Et(p,P),C}for(E=r(p,E);P<f.length;P++)A=y(E,p,P,f[P],v),A!==null&&(e&&A.alternate!==null&&E.delete(A.key===null?P:A.key),c=l(A,c,P),M===null?C=A:M.sibling=A,M=A);return e&&E.forEach(function(re){return t(p,re)}),U&&Et(p,P),C}function x(p,c,f,v){var C=xn(f);if(typeof C!="function")throw Error(w(150));if(f=C.call(f),f==null)throw Error(w(151));for(var M=C=null,E=c,P=c=0,A=null,T=f.next();E!==null&&!T.done;P++,T=f.next()){E.index>P?(A=E,E=null):A=E.sibling;var re=h(p,E,T.value,v);if(re===null){E===null&&(E=A);break}e&&E&&re.alternate===null&&t(p,E),c=l(re,c,P),M===null?C=re:M.sibling=re,M=re,E=A}if(T.done)return n(p,E),U&&Et(p,P),C;if(E===null){for(;!T.done;P++,T=f.next())T=d(p,T.value,v),T!==null&&(c=l(T,c,P),M===null?C=T:M.sibling=T,M=T);return U&&Et(p,P),C}for(E=r(p,E);!T.done;P++,T=f.next())T=y(E,p,P,T.value,v),T!==null&&(e&&T.alternate!==null&&E.delete(T.key===null?P:T.key),c=l(T,c,P),M===null?C=T:M.sibling=T,M=T);return e&&E.forEach(function(yn){return t(p,yn)}),U&&Et(p,P),C}function j(p,c,f,v){if(typeof f=="object"&&f!==null&&f.type===Ht&&f.key===null&&(f=f.props.children),typeof f=="object"&&f!==null){switch(f.$$typeof){case vr:e:{for(var C=f.key,M=c;M!==null;){if(M.key===C){if(C=f.type,C===Ht){if(M.tag===7){n(p,M.sibling),c=i(M,f.props.children),c.return=p,p=c;break e}}else if(M.elementType===C||typeof C=="object"&&C!==null&&C.$$typeof===et&&Jo(C)===M.type){n(p,M.sibling),c=i(M,f.props),c.ref=jn(p,M,f),c.return=p,p=c;break e}n(p,M);break}else t(p,M);M=M.sibling}f.type===Ht?(c=Tt(f.props.children,p.mode,v,f.key),c.return=p,p=c):(v=Wr(f.type,f.key,f.props,null,p.mode,v),v.ref=jn(p,c,f),v.return=p,p=v)}return a(p);case $t:e:{for(M=f.key;c!==null;){if(c.key===M)if(c.tag===4&&c.stateNode.containerInfo===f.containerInfo&&c.stateNode.implementation===f.implementation){n(p,c.sibling),c=i(c,f.children||[]),c.return=p,p=c;break e}else{n(p,c);break}else t(p,c);c=c.sibling}c=cl(f,p.mode,v),c.return=p,p=c}return a(p);case et:return M=f._init,j(p,c,M(f._payload),v)}if(Ln(f))return S(p,c,f,v);if(xn(f))return x(p,c,f,v);_r(p,f)}return typeof f=="string"&&f!==""||typeof f=="number"?(f=""+f,c!==null&&c.tag===6?(n(p,c.sibling),c=i(c,f),c.return=p,p=c):(n(p,c),c=ul(f,p.mode,v),c.return=p,p=c),a(p)):n(p,c)}return j}var un=Yu(!0),Xu=Yu(!1),li=St(null),ai=null,Yt=null,za=null;function Aa(){za=Yt=ai=null}function ba(e){var t=li.current;F(li),e._currentValue=t}function Wl(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function rn(e,t){ai=e,za=Yt=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(pe=!0),e.firstContext=null)}function Me(e){var t=e._currentValue;if(za!==e)if(e={context:e,memoizedValue:t,next:null},Yt===null){if(ai===null)throw Error(w(308));Yt=e,ai.dependencies={lanes:0,firstContext:e}}else Yt=Yt.next=e;return t}var _t=null;function Da(e){_t===null?_t=[e]:_t.push(e)}function Zu(e,t,n,r){var i=t.interleaved;return i===null?(n.next=n,Da(t)):(n.next=i.next,i.next=n),t.interleaved=n,Je(e,r)}function Je(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var tt=!1;function Ia(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function qu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function We(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function dt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,z&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,Je(e,n)}return i=r.interleaved,i===null?(t.next=t,Da(r)):(t.next=i.next,i.next=t),r.interleaved=t,Je(e,n)}function Fr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ca(e,n)}}function Go(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};l===null?i=l=a:l=l.next=a,n=n.next}while(n!==null);l===null?i=l=t:l=l.next=t}else i=l=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:l,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function oi(e,t,n,r){var i=e.updateQueue;tt=!1;var l=i.firstBaseUpdate,a=i.lastBaseUpdate,o=i.shared.pending;if(o!==null){i.shared.pending=null;var s=o,u=s.next;s.next=null,a===null?l=u:a.next=u,a=s;var g=e.alternate;g!==null&&(g=g.updateQueue,o=g.lastBaseUpdate,o!==a&&(o===null?g.firstBaseUpdate=u:o.next=u,g.lastBaseUpdate=s))}if(l!==null){var d=i.baseState;a=0,g=u=s=null,o=l;do{var h=o.lane,y=o.eventTime;if((r&h)===h){g!==null&&(g=g.next={eventTime:y,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var S=e,x=o;switch(h=t,y=n,x.tag){case 1:if(S=x.payload,typeof S=="function"){d=S.call(y,d,h);break e}d=S;break e;case 3:S.flags=S.flags&-65537|128;case 0:if(S=x.payload,h=typeof S=="function"?S.call(y,d,h):S,h==null)break e;d=B({},d,h);break e;case 2:tt=!0}}o.callback!==null&&o.lane!==0&&(e.flags|=64,h=i.effects,h===null?i.effects=[o]:h.push(o))}else y={eventTime:y,lane:h,tag:o.tag,payload:o.payload,callback:o.callback,next:null},g===null?(u=g=y,s=d):g=g.next=y,a|=h;if(o=o.next,o===null){if(o=i.shared.pending,o===null)break;h=o,o=h.next,h.next=null,i.lastBaseUpdate=h,i.shared.pending=null}}while(!0);if(g===null&&(s=d),i.baseState=s,i.firstBaseUpdate=u,i.lastBaseUpdate=g,t=i.shared.interleaved,t!==null){i=t;do a|=i.lane,i=i.next;while(i!==t)}else l===null&&(i.shared.lanes=0);At|=a,e.lanes=a,e.memoizedState=d}}function Yo(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(w(191,i));i.call(r)}}}var dr={},Ue=St(dr),qn=St(dr),er=St(dr);function Pt(e){if(e===dr)throw Error(w(174));return e}function Fa(e,t){switch(D(er,t),D(qn,e),D(Ue,dr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:jl(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=jl(t,e)}F(Ue),D(Ue,t)}function cn(){F(Ue),F(qn),F(er)}function ec(e){Pt(er.current);var t=Pt(Ue.current),n=jl(t,e.type);t!==n&&(D(qn,e),D(Ue,n))}function Ua(e){qn.current===e&&(F(Ue),F(qn))}var $=St(0);function si(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var rl=[];function $a(){for(var e=0;e<rl.length;e++)rl[e]._workInProgressVersionPrimary=null;rl.length=0}var Ur=Xe.ReactCurrentDispatcher,il=Xe.ReactCurrentBatchConfig,zt=0,H=null,G=null,Z=null,ui=!1,In=!1,tr=0,fp=0;function ie(){throw Error(w(321))}function Ha(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ae(e[n],t[n]))return!1;return!0}function Ba(e,t,n,r,i,l){if(zt=l,H=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Ur.current=e===null||e.memoizedState===null?hp:vp,e=n(r,i),In){l=0;do{if(In=!1,tr=0,25<=l)throw Error(w(301));l+=1,Z=G=null,t.updateQueue=null,Ur.current=yp,e=n(r,i)}while(In)}if(Ur.current=ci,t=G!==null&&G.next!==null,zt=0,Z=G=H=null,ui=!1,t)throw Error(w(300));return e}function Va(){var e=tr!==0;return tr=0,e}function De(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Z===null?H.memoizedState=Z=e:Z=Z.next=e,Z}function _e(){if(G===null){var e=H.alternate;e=e!==null?e.memoizedState:null}else e=G.next;var t=Z===null?H.memoizedState:Z.next;if(t!==null)Z=t,G=e;else{if(e===null)throw Error(w(310));G=e,e={memoizedState:G.memoizedState,baseState:G.baseState,baseQueue:G.baseQueue,queue:G.queue,next:null},Z===null?H.memoizedState=Z=e:Z=Z.next=e}return Z}function nr(e,t){return typeof t=="function"?t(e):t}function ll(e){var t=_e(),n=t.queue;if(n===null)throw Error(w(311));n.lastRenderedReducer=e;var r=G,i=r.baseQueue,l=n.pending;if(l!==null){if(i!==null){var a=i.next;i.next=l.next,l.next=a}r.baseQueue=i=l,n.pending=null}if(i!==null){l=i.next,r=r.baseState;var o=a=null,s=null,u=l;do{var g=u.lane;if((zt&g)===g)s!==null&&(s=s.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),r=u.hasEagerState?u.eagerState:e(r,u.action);else{var d={lane:g,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};s===null?(o=s=d,a=r):s=s.next=d,H.lanes|=g,At|=g}u=u.next}while(u!==null&&u!==l);s===null?a=r:s.next=o,Ae(r,t.memoizedState)||(pe=!0),t.memoizedState=r,t.baseState=a,t.baseQueue=s,n.lastRenderedState=r}if(e=n.interleaved,e!==null){i=e;do l=i.lane,H.lanes|=l,At|=l,i=i.next;while(i!==e)}else i===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function al(e){var t=_e(),n=t.queue;if(n===null)throw Error(w(311));n.lastRenderedReducer=e;var r=n.dispatch,i=n.pending,l=t.memoizedState;if(i!==null){n.pending=null;var a=i=i.next;do l=e(l,a.action),a=a.next;while(a!==i);Ae(l,t.memoizedState)||(pe=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,r]}function tc(){}function nc(e,t){var n=H,r=_e(),i=t(),l=!Ae(r.memoizedState,i);if(l&&(r.memoizedState=i,pe=!0),r=r.queue,Wa(lc.bind(null,n,r,e),[e]),r.getSnapshot!==t||l||Z!==null&&Z.memoizedState.tag&1){if(n.flags|=2048,rr(9,ic.bind(null,n,r,i,t),void 0,null),q===null)throw Error(w(349));zt&30||rc(n,t,i)}return i}function rc(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=H.updateQueue,t===null?(t={lastEffect:null,stores:null},H.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ic(e,t,n,r){t.value=n,t.getSnapshot=r,ac(t)&&oc(e)}function lc(e,t,n){return n(function(){ac(t)&&oc(e)})}function ac(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ae(e,n)}catch{return!0}}function oc(e){var t=Je(e,1);t!==null&&ze(t,e,1,-1)}function Xo(e){var t=De();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:nr,lastRenderedState:e},t.queue=e,e=e.dispatch=gp.bind(null,H,e),[t.memoizedState,e]}function rr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=H.updateQueue,t===null?(t={lastEffect:null,stores:null},H.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function sc(){return _e().memoizedState}function $r(e,t,n,r){var i=De();H.flags|=e,i.memoizedState=rr(1|t,n,void 0,r===void 0?null:r)}function Ei(e,t,n,r){var i=_e();r=r===void 0?null:r;var l=void 0;if(G!==null){var a=G.memoizedState;if(l=a.destroy,r!==null&&Ha(r,a.deps)){i.memoizedState=rr(t,n,l,r);return}}H.flags|=e,i.memoizedState=rr(1|t,n,l,r)}function Zo(e,t){return $r(8390656,8,e,t)}function Wa(e,t){return Ei(2048,8,e,t)}function uc(e,t){return Ei(4,2,e,t)}function cc(e,t){return Ei(4,4,e,t)}function dc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function fc(e,t,n){return n=n!=null?n.concat([e]):null,Ei(4,4,dc.bind(null,t,e),n)}function Ka(){}function pc(e,t){var n=_e();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Ha(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function mc(e,t){var n=_e();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Ha(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function gc(e,t,n){return zt&21?(Ae(n,t)||(n=xu(),H.lanes|=n,At|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,pe=!0),e.memoizedState=n)}function pp(e,t){var n=b;b=n!==0&&4>n?n:4,e(!0);var r=il.transition;il.transition={};try{e(!1),t()}finally{b=n,il.transition=r}}function hc(){return _e().memoizedState}function mp(e,t,n){var r=pt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},vc(e))yc(t,n);else if(n=Zu(e,t,n,r),n!==null){var i=ue();ze(n,e,r,i),Sc(n,t,r)}}function gp(e,t,n){var r=pt(e),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(vc(e))yc(t,i);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var a=t.lastRenderedState,o=l(a,n);if(i.hasEagerState=!0,i.eagerState=o,Ae(o,a)){var s=t.interleaved;s===null?(i.next=i,Da(t)):(i.next=s.next,s.next=i),t.interleaved=i;return}}catch{}finally{}n=Zu(e,t,i,r),n!==null&&(i=ue(),ze(n,e,r,i),Sc(n,t,r))}}function vc(e){var t=e.alternate;return e===H||t!==null&&t===H}function yc(e,t){In=ui=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Sc(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ca(e,n)}}var ci={readContext:Me,useCallback:ie,useContext:ie,useEffect:ie,useImperativeHandle:ie,useInsertionEffect:ie,useLayoutEffect:ie,useMemo:ie,useReducer:ie,useRef:ie,useState:ie,useDebugValue:ie,useDeferredValue:ie,useTransition:ie,useMutableSource:ie,useSyncExternalStore:ie,useId:ie,unstable_isNewReconciler:!1},hp={readContext:Me,useCallback:function(e,t){return De().memoizedState=[e,t===void 0?null:t],e},useContext:Me,useEffect:Zo,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,$r(4194308,4,dc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return $r(4194308,4,e,t)},useInsertionEffect:function(e,t){return $r(4,2,e,t)},useMemo:function(e,t){var n=De();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=De();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=mp.bind(null,H,e),[r.memoizedState,e]},useRef:function(e){var t=De();return e={current:e},t.memoizedState=e},useState:Xo,useDebugValue:Ka,useDeferredValue:function(e){return De().memoizedState=e},useTransition:function(){var e=Xo(!1),t=e[0];return e=pp.bind(null,e[1]),De().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=H,i=De();if(U){if(n===void 0)throw Error(w(407));n=n()}else{if(n=t(),q===null)throw Error(w(349));zt&30||rc(r,t,n)}i.memoizedState=n;var l={value:n,getSnapshot:t};return i.queue=l,Zo(lc.bind(null,r,l,e),[e]),r.flags|=2048,rr(9,ic.bind(null,r,l,n,t),void 0,null),n},useId:function(){var e=De(),t=q.identifierPrefix;if(U){var n=Ve,r=Be;n=(r&~(1<<32-Re(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=tr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=fp++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},vp={readContext:Me,useCallback:pc,useContext:Me,useEffect:Wa,useImperativeHandle:fc,useInsertionEffect:uc,useLayoutEffect:cc,useMemo:mc,useReducer:ll,useRef:sc,useState:function(){return ll(nr)},useDebugValue:Ka,useDeferredValue:function(e){var t=_e();return gc(t,G.memoizedState,e)},useTransition:function(){var e=ll(nr)[0],t=_e().memoizedState;return[e,t]},useMutableSource:tc,useSyncExternalStore:nc,useId:hc,unstable_isNewReconciler:!1},yp={readContext:Me,useCallback:pc,useContext:Me,useEffect:Wa,useImperativeHandle:fc,useInsertionEffect:uc,useLayoutEffect:cc,useMemo:mc,useReducer:al,useRef:sc,useState:function(){return al(nr)},useDebugValue:Ka,useDeferredValue:function(e){var t=_e();return G===null?t.memoizedState=e:gc(t,G.memoizedState,e)},useTransition:function(){var e=al(nr)[0],t=_e().memoizedState;return[e,t]},useMutableSource:tc,useSyncExternalStore:nc,useId:hc,unstable_isNewReconciler:!1};function Le(e,t){if(e&&e.defaultProps){t=B({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Kl(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:B({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var ji={isMounted:function(e){return(e=e._reactInternals)?It(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=ue(),i=pt(e),l=We(r,i);l.payload=t,n!=null&&(l.callback=n),t=dt(e,l,i),t!==null&&(ze(t,e,i,r),Fr(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=ue(),i=pt(e),l=We(r,i);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=dt(e,l,i),t!==null&&(ze(t,e,i,r),Fr(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ue(),r=pt(e),i=We(n,r);i.tag=2,t!=null&&(i.callback=t),t=dt(e,i,r),t!==null&&(ze(t,e,r,n),Fr(t,e,r))}};function qo(e,t,n,r,i,l,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,l,a):t.prototype&&t.prototype.isPureReactComponent?!Gn(n,r)||!Gn(i,l):!0}function xc(e,t,n){var r=!1,i=vt,l=t.contextType;return typeof l=="object"&&l!==null?l=Me(l):(i=ge(t)?Ot:oe.current,r=t.contextTypes,l=(r=r!=null)?on(e,i):vt),t=new t(n,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=ji,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=l),t}function es(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&ji.enqueueReplaceState(t,t.state,null)}function Ql(e,t,n,r){var i=e.stateNode;i.props=n,i.state=e.memoizedState,i.refs={},Ia(e);var l=t.contextType;typeof l=="object"&&l!==null?i.context=Me(l):(l=ge(t)?Ot:oe.current,i.context=on(e,l)),i.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(Kl(e,t,l,n),i.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(t=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),t!==i.state&&ji.enqueueReplaceState(i,i.state,null),oi(e,n,i,r),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function dn(e,t){try{var n="",r=t;do n+=Wd(r),r=r.return;while(r);var i=n}catch(l){i=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:i,digest:null}}function ol(e,t,n){return{value:e,source:null,stack:n!=null?n:null,digest:t!=null?t:null}}function Jl(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Sp=typeof WeakMap=="function"?WeakMap:Map;function wc(e,t,n){n=We(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){fi||(fi=!0,ia=r),Jl(e,t)},n}function kc(e,t,n){n=We(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var i=t.value;n.payload=function(){return r(i)},n.callback=function(){Jl(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(n.callback=function(){Jl(e,t),typeof r!="function"&&(ft===null?ft=new Set([this]):ft.add(this));var a=t.stack;this.componentDidCatch(t.value,{componentStack:a!==null?a:""})}),n}function ts(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Sp;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(i.add(n),e=Rp.bind(null,e,t,n),t.then(e,e))}function ns(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function rs(e,t,n,r,i){return e.mode&1?(e.flags|=65536,e.lanes=i,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=We(-1,1),t.tag=2,dt(n,t,1))),n.lanes|=1),e)}var xp=Xe.ReactCurrentOwner,pe=!1;function se(e,t,n,r){t.child=e===null?Xu(t,null,n,r):un(t,e.child,n,r)}function is(e,t,n,r,i){n=n.render;var l=t.ref;return rn(t,i),r=Ba(e,t,n,r,l,i),n=Va(),e!==null&&!pe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,Ge(e,t,i)):(U&&n&&Ta(t),t.flags|=1,se(e,t,r,i),t.child)}function ls(e,t,n,r,i){if(e===null){var l=n.type;return typeof l=="function"&&!eo(l)&&l.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=l,Cc(e,t,l,r,i)):(e=Wr(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!(e.lanes&i)){var a=l.memoizedProps;if(n=n.compare,n=n!==null?n:Gn,n(a,r)&&e.ref===t.ref)return Ge(e,t,i)}return t.flags|=1,e=mt(l,r),e.ref=t.ref,e.return=t,t.child=e}function Cc(e,t,n,r,i){if(e!==null){var l=e.memoizedProps;if(Gn(l,r)&&e.ref===t.ref)if(pe=!1,t.pendingProps=r=l,(e.lanes&i)!==0)e.flags&131072&&(pe=!0);else return t.lanes=e.lanes,Ge(e,t,i)}return Gl(e,t,n,r,i)}function Ec(e,t,n){var r=t.pendingProps,i=r.children,l=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},D(Zt,ve),ve|=n;else{if(!(n&1073741824))return e=l!==null?l.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,D(Zt,ve),ve|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=l!==null?l.baseLanes:n,D(Zt,ve),ve|=r}else l!==null?(r=l.baseLanes|n,t.memoizedState=null):r=n,D(Zt,ve),ve|=r;return se(e,t,i,n),t.child}function jc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Gl(e,t,n,r,i){var l=ge(n)?Ot:oe.current;return l=on(t,l),rn(t,i),n=Ba(e,t,n,r,l,i),r=Va(),e!==null&&!pe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,Ge(e,t,i)):(U&&r&&Ta(t),t.flags|=1,se(e,t,n,i),t.child)}function as(e,t,n,r,i){if(ge(n)){var l=!0;ni(t)}else l=!1;if(rn(t,i),t.stateNode===null)Hr(e,t),xc(t,n,r),Ql(t,n,r,i),r=!0;else if(e===null){var a=t.stateNode,o=t.memoizedProps;a.props=o;var s=a.context,u=n.contextType;typeof u=="object"&&u!==null?u=Me(u):(u=ge(n)?Ot:oe.current,u=on(t,u));var g=n.getDerivedStateFromProps,d=typeof g=="function"||typeof a.getSnapshotBeforeUpdate=="function";d||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==r||s!==u)&&es(t,a,r,u),tt=!1;var h=t.memoizedState;a.state=h,oi(t,r,a,i),s=t.memoizedState,o!==r||h!==s||me.current||tt?(typeof g=="function"&&(Kl(t,n,g,r),s=t.memoizedState),(o=tt||qo(t,n,o,r,h,s,u))?(d||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=s),a.props=r,a.state=s,a.context=u,r=o):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,qu(e,t),o=t.memoizedProps,u=t.type===t.elementType?o:Le(t.type,o),a.props=u,d=t.pendingProps,h=a.context,s=n.contextType,typeof s=="object"&&s!==null?s=Me(s):(s=ge(n)?Ot:oe.current,s=on(t,s));var y=n.getDerivedStateFromProps;(g=typeof y=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==d||h!==s)&&es(t,a,r,s),tt=!1,h=t.memoizedState,a.state=h,oi(t,r,a,i);var S=t.memoizedState;o!==d||h!==S||me.current||tt?(typeof y=="function"&&(Kl(t,n,y,r),S=t.memoizedState),(u=tt||qo(t,n,u,r,h,S,s)||!1)?(g||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(r,S,s),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(r,S,s)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=S),a.props=r,a.state=S,a.context=s,r=u):(typeof a.componentDidUpdate!="function"||o===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),r=!1)}return Yl(e,t,n,r,l,i)}function Yl(e,t,n,r,i,l){jc(e,t);var a=(t.flags&128)!==0;if(!r&&!a)return i&&Wo(t,n,!1),Ge(e,t,l);r=t.stateNode,xp.current=t;var o=a&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&a?(t.child=un(t,e.child,null,l),t.child=un(t,null,o,l)):se(e,t,o,l),t.memoizedState=r.state,i&&Wo(t,n,!0),t.child}function Nc(e){var t=e.stateNode;t.pendingContext?Vo(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Vo(e,t.context,!1),Fa(e,t.containerInfo)}function os(e,t,n,r,i){return sn(),Ra(i),t.flags|=256,se(e,t,n,r),t.child}var Xl={dehydrated:null,treeContext:null,retryLane:0};function Zl(e){return{baseLanes:e,cachePool:null,transitions:null}}function Mc(e,t,n){var r=t.pendingProps,i=$.current,l=!1,a=(t.flags&128)!==0,o;if((o=a)||(o=e!==null&&e.memoizedState===null?!1:(i&2)!==0),o?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),D($,i&1),e===null)return Vl(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(a=r.children,e=r.fallback,l?(r=t.mode,l=t.child,a={mode:"hidden",children:a},!(r&1)&&l!==null?(l.childLanes=0,l.pendingProps=a):l=_i(a,r,0,null),e=Tt(e,r,n,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=Zl(n),t.memoizedState=Xl,e):Qa(t,a));if(i=e.memoizedState,i!==null&&(o=i.dehydrated,o!==null))return wp(e,t,a,r,o,i,n);if(l){l=r.fallback,a=t.mode,i=e.child,o=i.sibling;var s={mode:"hidden",children:r.children};return!(a&1)&&t.child!==i?(r=t.child,r.childLanes=0,r.pendingProps=s,t.deletions=null):(r=mt(i,s),r.subtreeFlags=i.subtreeFlags&14680064),o!==null?l=mt(o,l):(l=Tt(l,a,n,null),l.flags|=2),l.return=t,r.return=t,r.sibling=l,t.child=r,r=l,l=t.child,a=e.child.memoizedState,a=a===null?Zl(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},l.memoizedState=a,l.childLanes=e.childLanes&~n,t.memoizedState=Xl,r}return l=e.child,e=l.sibling,r=mt(l,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Qa(e,t){return t=_i({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Pr(e,t,n,r){return r!==null&&Ra(r),un(t,e.child,null,n),e=Qa(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function wp(e,t,n,r,i,l,a){if(n)return t.flags&256?(t.flags&=-257,r=ol(Error(w(422))),Pr(e,t,a,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=r.fallback,i=t.mode,r=_i({mode:"visible",children:r.children},i,0,null),l=Tt(l,i,a,null),l.flags|=2,r.return=t,l.return=t,r.sibling=l,t.child=r,t.mode&1&&un(t,e.child,null,a),t.child.memoizedState=Zl(a),t.memoizedState=Xl,l);if(!(t.mode&1))return Pr(e,t,a,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var o=r.dgst;return r=o,l=Error(w(419)),r=ol(l,r,void 0),Pr(e,t,a,r)}if(o=(a&e.childLanes)!==0,pe||o){if(r=q,r!==null){switch(a&-a){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|a)?0:i,i!==0&&i!==l.retryLane&&(l.retryLane=i,Je(e,i),ze(r,e,i,-1))}return qa(),r=ol(Error(w(421))),Pr(e,t,a,r)}return i.data==="$?"?(t.flags|=128,t.child=e.child,t=zp.bind(null,e),i._reactRetry=t,null):(e=l.treeContext,ye=ct(i.nextSibling),Se=t,U=!0,Oe=null,e!==null&&(Ce[Ee++]=Be,Ce[Ee++]=Ve,Ce[Ee++]=Rt,Be=e.id,Ve=e.overflow,Rt=t),t=Qa(t,r.children),t.flags|=4096,t)}function ss(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Wl(e.return,t,n)}function sl(e,t,n,r,i){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=r,l.tail=n,l.tailMode=i)}function _c(e,t,n){var r=t.pendingProps,i=r.revealOrder,l=r.tail;if(se(e,t,r.children,n),r=$.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ss(e,n,t);else if(e.tag===19)ss(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(D($,r),!(t.mode&1))t.memoizedState=null;else switch(i){case"forwards":for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&si(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),sl(t,!1,i,n,l);break;case"backwards":for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&si(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}sl(t,!0,n,null,l);break;case"together":sl(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Hr(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Ge(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),At|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(w(153));if(t.child!==null){for(e=t.child,n=mt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=mt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function kp(e,t,n){switch(t.tag){case 3:Nc(t),sn();break;case 5:ec(t);break;case 1:ge(t.type)&&ni(t);break;case 4:Fa(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,i=t.memoizedProps.value;D(li,r._currentValue),r._currentValue=i;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(D($,$.current&1),t.flags|=128,null):n&t.child.childLanes?Mc(e,t,n):(D($,$.current&1),e=Ge(e,t,n),e!==null?e.sibling:null);D($,$.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return _c(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),D($,$.current),r)break;return null;case 22:case 23:return t.lanes=0,Ec(e,t,n)}return Ge(e,t,n)}var Pc,ql,Lc,Tc;Pc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};ql=function(){};Lc=function(e,t,n,r){var i=e.memoizedProps;if(i!==r){e=t.stateNode,Pt(Ue.current);var l=null;switch(n){case"input":i=wl(e,i),r=wl(e,r),l=[];break;case"select":i=B({},i,{value:void 0}),r=B({},r,{value:void 0}),l=[];break;case"textarea":i=El(e,i),r=El(e,r),l=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=ei)}Nl(n,r);var a;n=null;for(u in i)if(!r.hasOwnProperty(u)&&i.hasOwnProperty(u)&&i[u]!=null)if(u==="style"){var o=i[u];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(Hn.hasOwnProperty(u)?l||(l=[]):(l=l||[]).push(u,null));for(u in r){var s=r[u];if(o=i!=null?i[u]:void 0,r.hasOwnProperty(u)&&s!==o&&(s!=null||o!=null))if(u==="style")if(o){for(a in o)!o.hasOwnProperty(a)||s&&s.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in s)s.hasOwnProperty(a)&&o[a]!==s[a]&&(n||(n={}),n[a]=s[a])}else n||(l||(l=[]),l.push(u,n)),n=s;else u==="dangerouslySetInnerHTML"?(s=s?s.__html:void 0,o=o?o.__html:void 0,s!=null&&o!==s&&(l=l||[]).push(u,s)):u==="children"?typeof s!="string"&&typeof s!="number"||(l=l||[]).push(u,""+s):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(Hn.hasOwnProperty(u)?(s!=null&&u==="onScroll"&&I("scroll",e),l||o===s||(l=[])):(l=l||[]).push(u,s))}n&&(l=l||[]).push("style",n);var u=l;(t.updateQueue=u)&&(t.flags|=4)}};Tc=function(e,t,n,r){n!==r&&(t.flags|=4)};function Nn(e,t){if(!U)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function le(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Cp(e,t,n){var r=t.pendingProps;switch(Oa(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return le(t),null;case 1:return ge(t.type)&&ti(),le(t),null;case 3:return r=t.stateNode,cn(),F(me),F(oe),$a(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Mr(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Oe!==null&&(oa(Oe),Oe=null))),ql(e,t),le(t),null;case 5:Ua(t);var i=Pt(er.current);if(n=t.type,e!==null&&t.stateNode!=null)Lc(e,t,n,r,i),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(w(166));return le(t),null}if(e=Pt(Ue.current),Mr(t)){r=t.stateNode,n=t.type;var l=t.memoizedProps;switch(r[Ie]=t,r[Zn]=l,e=(t.mode&1)!==0,n){case"dialog":I("cancel",r),I("close",r);break;case"iframe":case"object":case"embed":I("load",r);break;case"video":case"audio":for(i=0;i<On.length;i++)I(On[i],r);break;case"source":I("error",r);break;case"img":case"image":case"link":I("error",r),I("load",r);break;case"details":I("toggle",r);break;case"input":vo(r,l),I("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!l.multiple},I("invalid",r);break;case"textarea":So(r,l),I("invalid",r)}Nl(n,l),i=null;for(var a in l)if(l.hasOwnProperty(a)){var o=l[a];a==="children"?typeof o=="string"?r.textContent!==o&&(l.suppressHydrationWarning!==!0&&Nr(r.textContent,o,e),i=["children",o]):typeof o=="number"&&r.textContent!==""+o&&(l.suppressHydrationWarning!==!0&&Nr(r.textContent,o,e),i=["children",""+o]):Hn.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&I("scroll",r)}switch(n){case"input":yr(r),yo(r,l,!0);break;case"textarea":yr(r),xo(r);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(r.onclick=ei)}r=i,t.updateQueue=r,r!==null&&(t.flags|=4)}else{a=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=lu(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=a.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=a.createElement(n,{is:r.is}):(e=a.createElement(n),n==="select"&&(a=e,r.multiple?a.multiple=!0:r.size&&(a.size=r.size))):e=a.createElementNS(e,n),e[Ie]=t,e[Zn]=r,Pc(e,t,!1,!1),t.stateNode=e;e:{switch(a=Ml(n,r),n){case"dialog":I("cancel",e),I("close",e),i=r;break;case"iframe":case"object":case"embed":I("load",e),i=r;break;case"video":case"audio":for(i=0;i<On.length;i++)I(On[i],e);i=r;break;case"source":I("error",e),i=r;break;case"img":case"image":case"link":I("error",e),I("load",e),i=r;break;case"details":I("toggle",e),i=r;break;case"input":vo(e,r),i=wl(e,r),I("invalid",e);break;case"option":i=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},i=B({},r,{value:void 0}),I("invalid",e);break;case"textarea":So(e,r),i=El(e,r),I("invalid",e);break;default:i=r}Nl(n,i),o=i;for(l in o)if(o.hasOwnProperty(l)){var s=o[l];l==="style"?su(e,s):l==="dangerouslySetInnerHTML"?(s=s?s.__html:void 0,s!=null&&au(e,s)):l==="children"?typeof s=="string"?(n!=="textarea"||s!=="")&&Bn(e,s):typeof s=="number"&&Bn(e,""+s):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(Hn.hasOwnProperty(l)?s!=null&&l==="onScroll"&&I("scroll",e):s!=null&&va(e,l,s,a))}switch(n){case"input":yr(e),yo(e,r,!1);break;case"textarea":yr(e),xo(e);break;case"option":r.value!=null&&e.setAttribute("value",""+ht(r.value));break;case"select":e.multiple=!!r.multiple,l=r.value,l!=null?qt(e,!!r.multiple,l,!1):r.defaultValue!=null&&qt(e,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=ei)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return le(t),null;case 6:if(e&&t.stateNode!=null)Tc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(w(166));if(n=Pt(er.current),Pt(Ue.current),Mr(t)){if(r=t.stateNode,n=t.memoizedProps,r[Ie]=t,(l=r.nodeValue!==n)&&(e=Se,e!==null))switch(e.tag){case 3:Nr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Nr(r.nodeValue,n,(e.mode&1)!==0)}l&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Ie]=t,t.stateNode=r}return le(t),null;case 13:if(F($),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(U&&ye!==null&&t.mode&1&&!(t.flags&128))Gu(),sn(),t.flags|=98560,l=!1;else if(l=Mr(t),r!==null&&r.dehydrated!==null){if(e===null){if(!l)throw Error(w(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(w(317));l[Ie]=t}else sn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;le(t),l=!1}else Oe!==null&&(oa(Oe),Oe=null),l=!0;if(!l)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||$.current&1?Y===0&&(Y=3):qa())),t.updateQueue!==null&&(t.flags|=4),le(t),null);case 4:return cn(),ql(e,t),e===null&&Yn(t.stateNode.containerInfo),le(t),null;case 10:return ba(t.type._context),le(t),null;case 17:return ge(t.type)&&ti(),le(t),null;case 19:if(F($),l=t.memoizedState,l===null)return le(t),null;if(r=(t.flags&128)!==0,a=l.rendering,a===null)if(r)Nn(l,!1);else{if(Y!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(a=si(e),a!==null){for(t.flags|=128,Nn(l,!1),r=a.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)l=n,e=r,l.flags&=14680066,a=l.alternate,a===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=a.childLanes,l.lanes=a.lanes,l.child=a.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=a.memoizedProps,l.memoizedState=a.memoizedState,l.updateQueue=a.updateQueue,l.type=a.type,e=a.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return D($,$.current&1|2),t.child}e=e.sibling}l.tail!==null&&K()>fn&&(t.flags|=128,r=!0,Nn(l,!1),t.lanes=4194304)}else{if(!r)if(e=si(a),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Nn(l,!0),l.tail===null&&l.tailMode==="hidden"&&!a.alternate&&!U)return le(t),null}else 2*K()-l.renderingStartTime>fn&&n!==1073741824&&(t.flags|=128,r=!0,Nn(l,!1),t.lanes=4194304);l.isBackwards?(a.sibling=t.child,t.child=a):(n=l.last,n!==null?n.sibling=a:t.child=a,l.last=a)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=K(),t.sibling=null,n=$.current,D($,r?n&1|2:n&1),t):(le(t),null);case 22:case 23:return Za(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?ve&1073741824&&(le(t),t.subtreeFlags&6&&(t.flags|=8192)):le(t),null;case 24:return null;case 25:return null}throw Error(w(156,t.tag))}function Ep(e,t){switch(Oa(t),t.tag){case 1:return ge(t.type)&&ti(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return cn(),F(me),F(oe),$a(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return Ua(t),null;case 13:if(F($),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(w(340));sn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return F($),null;case 4:return cn(),null;case 10:return ba(t.type._context),null;case 22:case 23:return Za(),null;case 24:return null;default:return null}}var Lr=!1,ae=!1,jp=typeof WeakSet=="function"?WeakSet:Set,N=null;function Xt(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){V(e,t,r)}else n.current=null}function ea(e,t,n){try{n()}catch(r){V(e,t,r)}}var us=!1;function Np(e,t){if(Dl=Xr,e=bu(),La(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,l=r.focusNode;r=r.focusOffset;try{n.nodeType,l.nodeType}catch{n=null;break e}var a=0,o=-1,s=-1,u=0,g=0,d=e,h=null;t:for(;;){for(var y;d!==n||i!==0&&d.nodeType!==3||(o=a+i),d!==l||r!==0&&d.nodeType!==3||(s=a+r),d.nodeType===3&&(a+=d.nodeValue.length),(y=d.firstChild)!==null;)h=d,d=y;for(;;){if(d===e)break t;if(h===n&&++u===i&&(o=a),h===l&&++g===r&&(s=a),(y=d.nextSibling)!==null)break;d=h,h=d.parentNode}d=y}n=o===-1||s===-1?null:{start:o,end:s}}else n=null}n=n||{start:0,end:0}}else n=null;for(Il={focusedElem:e,selectionRange:n},Xr=!1,N=t;N!==null;)if(t=N,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,N=e;else for(;N!==null;){t=N;try{var S=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(S!==null){var x=S.memoizedProps,j=S.memoizedState,p=t.stateNode,c=p.getSnapshotBeforeUpdate(t.elementType===t.type?x:Le(t.type,x),j);p.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var f=t.stateNode.containerInfo;f.nodeType===1?f.textContent="":f.nodeType===9&&f.documentElement&&f.removeChild(f.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(w(163))}}catch(v){V(t,t.return,v)}if(e=t.sibling,e!==null){e.return=t.return,N=e;break}N=t.return}return S=us,us=!1,S}function Fn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var l=i.destroy;i.destroy=void 0,l!==void 0&&ea(t,n,l)}i=i.next}while(i!==r)}}function Ni(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function ta(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Oc(e){var t=e.alternate;t!==null&&(e.alternate=null,Oc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ie],delete t[Zn],delete t[$l],delete t[sp],delete t[up])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Rc(e){return e.tag===5||e.tag===3||e.tag===4}function cs(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Rc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function na(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ei));else if(r!==4&&(e=e.child,e!==null))for(na(e,t,n),e=e.sibling;e!==null;)na(e,t,n),e=e.sibling}function ra(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(ra(e,t,n),e=e.sibling;e!==null;)ra(e,t,n),e=e.sibling}var ee=null,Te=!1;function Ze(e,t,n){for(n=n.child;n!==null;)zc(e,t,n),n=n.sibling}function zc(e,t,n){if(Fe&&typeof Fe.onCommitFiberUnmount=="function")try{Fe.onCommitFiberUnmount(yi,n)}catch{}switch(n.tag){case 5:ae||Xt(n,t);case 6:var r=ee,i=Te;ee=null,Ze(e,t,n),ee=r,Te=i,ee!==null&&(Te?(e=ee,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):ee.removeChild(n.stateNode));break;case 18:ee!==null&&(Te?(e=ee,n=n.stateNode,e.nodeType===8?tl(e.parentNode,n):e.nodeType===1&&tl(e,n),Qn(e)):tl(ee,n.stateNode));break;case 4:r=ee,i=Te,ee=n.stateNode.containerInfo,Te=!0,Ze(e,t,n),ee=r,Te=i;break;case 0:case 11:case 14:case 15:if(!ae&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var l=i,a=l.destroy;l=l.tag,a!==void 0&&(l&2||l&4)&&ea(n,t,a),i=i.next}while(i!==r)}Ze(e,t,n);break;case 1:if(!ae&&(Xt(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(o){V(n,t,o)}Ze(e,t,n);break;case 21:Ze(e,t,n);break;case 22:n.mode&1?(ae=(r=ae)||n.memoizedState!==null,Ze(e,t,n),ae=r):Ze(e,t,n);break;default:Ze(e,t,n)}}function ds(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new jp),t.forEach(function(r){var i=Ap.bind(null,e,r);n.has(r)||(n.add(r),r.then(i,i))})}}function Pe(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var l=e,a=t,o=a;e:for(;o!==null;){switch(o.tag){case 5:ee=o.stateNode,Te=!1;break e;case 3:ee=o.stateNode.containerInfo,Te=!0;break e;case 4:ee=o.stateNode.containerInfo,Te=!0;break e}o=o.return}if(ee===null)throw Error(w(160));zc(l,a,i),ee=null,Te=!1;var s=i.alternate;s!==null&&(s.return=null),i.return=null}catch(u){V(i,t,u)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Ac(t,e),t=t.sibling}function Ac(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Pe(t,e),be(e),r&4){try{Fn(3,e,e.return),Ni(3,e)}catch(x){V(e,e.return,x)}try{Fn(5,e,e.return)}catch(x){V(e,e.return,x)}}break;case 1:Pe(t,e),be(e),r&512&&n!==null&&Xt(n,n.return);break;case 5:if(Pe(t,e),be(e),r&512&&n!==null&&Xt(n,n.return),e.flags&32){var i=e.stateNode;try{Bn(i,"")}catch(x){V(e,e.return,x)}}if(r&4&&(i=e.stateNode,i!=null)){var l=e.memoizedProps,a=n!==null?n.memoizedProps:l,o=e.type,s=e.updateQueue;if(e.updateQueue=null,s!==null)try{o==="input"&&l.type==="radio"&&l.name!=null&&ru(i,l),Ml(o,a);var u=Ml(o,l);for(a=0;a<s.length;a+=2){var g=s[a],d=s[a+1];g==="style"?su(i,d):g==="dangerouslySetInnerHTML"?au(i,d):g==="children"?Bn(i,d):va(i,g,d,u)}switch(o){case"input":kl(i,l);break;case"textarea":iu(i,l);break;case"select":var h=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!l.multiple;var y=l.value;y!=null?qt(i,!!l.multiple,y,!1):h!==!!l.multiple&&(l.defaultValue!=null?qt(i,!!l.multiple,l.defaultValue,!0):qt(i,!!l.multiple,l.multiple?[]:"",!1))}i[Zn]=l}catch(x){V(e,e.return,x)}}break;case 6:if(Pe(t,e),be(e),r&4){if(e.stateNode===null)throw Error(w(162));i=e.stateNode,l=e.memoizedProps;try{i.nodeValue=l}catch(x){V(e,e.return,x)}}break;case 3:if(Pe(t,e),be(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Qn(t.containerInfo)}catch(x){V(e,e.return,x)}break;case 4:Pe(t,e),be(e);break;case 13:Pe(t,e),be(e),i=e.child,i.flags&8192&&(l=i.memoizedState!==null,i.stateNode.isHidden=l,!l||i.alternate!==null&&i.alternate.memoizedState!==null||(Ya=K())),r&4&&ds(e);break;case 22:if(g=n!==null&&n.memoizedState!==null,e.mode&1?(ae=(u=ae)||g,Pe(t,e),ae=u):Pe(t,e),be(e),r&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!g&&e.mode&1)for(N=e,g=e.child;g!==null;){for(d=N=g;N!==null;){switch(h=N,y=h.child,h.tag){case 0:case 11:case 14:case 15:Fn(4,h,h.return);break;case 1:Xt(h,h.return);var S=h.stateNode;if(typeof S.componentWillUnmount=="function"){r=h,n=h.return;try{t=r,S.props=t.memoizedProps,S.state=t.memoizedState,S.componentWillUnmount()}catch(x){V(r,n,x)}}break;case 5:Xt(h,h.return);break;case 22:if(h.memoizedState!==null){ps(d);continue}}y!==null?(y.return=h,N=y):ps(d)}g=g.sibling}e:for(g=null,d=e;;){if(d.tag===5){if(g===null){g=d;try{i=d.stateNode,u?(l=i.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(o=d.stateNode,s=d.memoizedProps.style,a=s!=null&&s.hasOwnProperty("display")?s.display:null,o.style.display=ou("display",a))}catch(x){V(e,e.return,x)}}}else if(d.tag===6){if(g===null)try{d.stateNode.nodeValue=u?"":d.memoizedProps}catch(x){V(e,e.return,x)}}else if((d.tag!==22&&d.tag!==23||d.memoizedState===null||d===e)&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===e)break e;for(;d.sibling===null;){if(d.return===null||d.return===e)break e;g===d&&(g=null),d=d.return}g===d&&(g=null),d.sibling.return=d.return,d=d.sibling}}break;case 19:Pe(t,e),be(e),r&4&&ds(e);break;case 21:break;default:Pe(t,e),be(e)}}function be(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Rc(n)){var r=n;break e}n=n.return}throw Error(w(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(Bn(i,""),r.flags&=-33);var l=cs(e);ra(e,l,i);break;case 3:case 4:var a=r.stateNode.containerInfo,o=cs(e);na(e,o,a);break;default:throw Error(w(161))}}catch(s){V(e,e.return,s)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Mp(e,t,n){N=e,bc(e)}function bc(e,t,n){for(var r=(e.mode&1)!==0;N!==null;){var i=N,l=i.child;if(i.tag===22&&r){var a=i.memoizedState!==null||Lr;if(!a){var o=i.alternate,s=o!==null&&o.memoizedState!==null||ae;o=Lr;var u=ae;if(Lr=a,(ae=s)&&!u)for(N=i;N!==null;)a=N,s=a.child,a.tag===22&&a.memoizedState!==null?ms(i):s!==null?(s.return=a,N=s):ms(i);for(;l!==null;)N=l,bc(l),l=l.sibling;N=i,Lr=o,ae=u}fs(e)}else i.subtreeFlags&8772&&l!==null?(l.return=i,N=l):fs(e)}}function fs(e){for(;N!==null;){var t=N;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:ae||Ni(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!ae)if(n===null)r.componentDidMount();else{var i=t.elementType===t.type?n.memoizedProps:Le(t.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&Yo(t,l,r);break;case 3:var a=t.updateQueue;if(a!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Yo(t,a,n)}break;case 5:var o=t.stateNode;if(n===null&&t.flags&4){n=o;var s=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":s.autoFocus&&n.focus();break;case"img":s.src&&(n.src=s.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var g=u.memoizedState;if(g!==null){var d=g.dehydrated;d!==null&&Qn(d)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(w(163))}ae||t.flags&512&&ta(t)}catch(h){V(t,t.return,h)}}if(t===e){N=null;break}if(n=t.sibling,n!==null){n.return=t.return,N=n;break}N=t.return}}function ps(e){for(;N!==null;){var t=N;if(t===e){N=null;break}var n=t.sibling;if(n!==null){n.return=t.return,N=n;break}N=t.return}}function ms(e){for(;N!==null;){var t=N;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ni(4,t)}catch(s){V(t,n,s)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var i=t.return;try{r.componentDidMount()}catch(s){V(t,i,s)}}var l=t.return;try{ta(t)}catch(s){V(t,l,s)}break;case 5:var a=t.return;try{ta(t)}catch(s){V(t,a,s)}}}catch(s){V(t,t.return,s)}if(t===e){N=null;break}var o=t.sibling;if(o!==null){o.return=t.return,N=o;break}N=t.return}}var _p=Math.ceil,di=Xe.ReactCurrentDispatcher,Ja=Xe.ReactCurrentOwner,Ne=Xe.ReactCurrentBatchConfig,z=0,q=null,Q=null,te=0,ve=0,Zt=St(0),Y=0,ir=null,At=0,Mi=0,Ga=0,Un=null,fe=null,Ya=0,fn=1/0,$e=null,fi=!1,ia=null,ft=null,Tr=!1,lt=null,pi=0,$n=0,la=null,Br=-1,Vr=0;function ue(){return z&6?K():Br!==-1?Br:Br=K()}function pt(e){return e.mode&1?z&2&&te!==0?te&-te:dp.transition!==null?(Vr===0&&(Vr=xu()),Vr):(e=b,e!==0||(e=window.event,e=e===void 0?16:Mu(e.type)),e):1}function ze(e,t,n,r){if(50<$n)throw $n=0,la=null,Error(w(185));sr(e,n,r),(!(z&2)||e!==q)&&(e===q&&(!(z&2)&&(Mi|=n),Y===4&&rt(e,te)),he(e,r),n===1&&z===0&&!(t.mode&1)&&(fn=K()+500,Ci&&xt()))}function he(e,t){var n=e.callbackNode;df(e,t);var r=Yr(e,e===q?te:0);if(r===0)n!==null&&Co(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Co(n),t===1)e.tag===0?cp(gs.bind(null,e)):Ku(gs.bind(null,e)),ap(function(){!(z&6)&&xt()}),n=null;else{switch(wu(r)){case 1:n=ka;break;case 4:n=yu;break;case 16:n=Gr;break;case 536870912:n=Su;break;default:n=Gr}n=Vc(n,Dc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Dc(e,t){if(Br=-1,Vr=0,z&6)throw Error(w(327));var n=e.callbackNode;if(ln()&&e.callbackNode!==n)return null;var r=Yr(e,e===q?te:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=mi(e,r);else{t=r;var i=z;z|=2;var l=Fc();(q!==e||te!==t)&&($e=null,fn=K()+500,Lt(e,t));do try{Tp();break}catch(o){Ic(e,o)}while(!0);Aa(),di.current=l,z=i,Q!==null?t=0:(q=null,te=0,t=Y)}if(t!==0){if(t===2&&(i=Ol(e),i!==0&&(r=i,t=aa(e,i))),t===1)throw n=ir,Lt(e,0),rt(e,r),he(e,K()),n;if(t===6)rt(e,r);else{if(i=e.current.alternate,!(r&30)&&!Pp(i)&&(t=mi(e,r),t===2&&(l=Ol(e),l!==0&&(r=l,t=aa(e,l))),t===1))throw n=ir,Lt(e,0),rt(e,r),he(e,K()),n;switch(e.finishedWork=i,e.finishedLanes=r,t){case 0:case 1:throw Error(w(345));case 2:jt(e,fe,$e);break;case 3:if(rt(e,r),(r&130023424)===r&&(t=Ya+500-K(),10<t)){if(Yr(e,0)!==0)break;if(i=e.suspendedLanes,(i&r)!==r){ue(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=Ul(jt.bind(null,e,fe,$e),t);break}jt(e,fe,$e);break;case 4:if(rt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,i=-1;0<r;){var a=31-Re(r);l=1<<a,a=t[a],a>i&&(i=a),r&=~l}if(r=i,r=K()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*_p(r/1960))-r,10<r){e.timeoutHandle=Ul(jt.bind(null,e,fe,$e),r);break}jt(e,fe,$e);break;case 5:jt(e,fe,$e);break;default:throw Error(w(329))}}}return he(e,K()),e.callbackNode===n?Dc.bind(null,e):null}function aa(e,t){var n=Un;return e.current.memoizedState.isDehydrated&&(Lt(e,t).flags|=256),e=mi(e,t),e!==2&&(t=fe,fe=n,t!==null&&oa(t)),e}function oa(e){fe===null?fe=e:fe.push.apply(fe,e)}function Pp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],l=i.getSnapshot;i=i.value;try{if(!Ae(l(),i))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function rt(e,t){for(t&=~Ga,t&=~Mi,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Re(t),r=1<<n;e[n]=-1,t&=~r}}function gs(e){if(z&6)throw Error(w(327));ln();var t=Yr(e,0);if(!(t&1))return he(e,K()),null;var n=mi(e,t);if(e.tag!==0&&n===2){var r=Ol(e);r!==0&&(t=r,n=aa(e,r))}if(n===1)throw n=ir,Lt(e,0),rt(e,t),he(e,K()),n;if(n===6)throw Error(w(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,jt(e,fe,$e),he(e,K()),null}function Xa(e,t){var n=z;z|=1;try{return e(t)}finally{z=n,z===0&&(fn=K()+500,Ci&&xt())}}function bt(e){lt!==null&&lt.tag===0&&!(z&6)&&ln();var t=z;z|=1;var n=Ne.transition,r=b;try{if(Ne.transition=null,b=1,e)return e()}finally{b=r,Ne.transition=n,z=t,!(z&6)&&xt()}}function Za(){ve=Zt.current,F(Zt)}function Lt(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,lp(n)),Q!==null)for(n=Q.return;n!==null;){var r=n;switch(Oa(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&ti();break;case 3:cn(),F(me),F(oe),$a();break;case 5:Ua(r);break;case 4:cn();break;case 13:F($);break;case 19:F($);break;case 10:ba(r.type._context);break;case 22:case 23:Za()}n=n.return}if(q=e,Q=e=mt(e.current,null),te=ve=t,Y=0,ir=null,Ga=Mi=At=0,fe=Un=null,_t!==null){for(t=0;t<_t.length;t++)if(n=_t[t],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,l=n.pending;if(l!==null){var a=l.next;l.next=i,r.next=a}n.pending=r}_t=null}return e}function Ic(e,t){do{var n=Q;try{if(Aa(),Ur.current=ci,ui){for(var r=H.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}ui=!1}if(zt=0,Z=G=H=null,In=!1,tr=0,Ja.current=null,n===null||n.return===null){Y=1,ir=t,Q=null;break}e:{var l=e,a=n.return,o=n,s=t;if(t=te,o.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){var u=s,g=o,d=g.tag;if(!(g.mode&1)&&(d===0||d===11||d===15)){var h=g.alternate;h?(g.updateQueue=h.updateQueue,g.memoizedState=h.memoizedState,g.lanes=h.lanes):(g.updateQueue=null,g.memoizedState=null)}var y=ns(a);if(y!==null){y.flags&=-257,rs(y,a,o,l,t),y.mode&1&&ts(l,u,t),t=y,s=u;var S=t.updateQueue;if(S===null){var x=new Set;x.add(s),t.updateQueue=x}else S.add(s);break e}else{if(!(t&1)){ts(l,u,t),qa();break e}s=Error(w(426))}}else if(U&&o.mode&1){var j=ns(a);if(j!==null){!(j.flags&65536)&&(j.flags|=256),rs(j,a,o,l,t),Ra(dn(s,o));break e}}l=s=dn(s,o),Y!==4&&(Y=2),Un===null?Un=[l]:Un.push(l),l=a;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var p=wc(l,s,t);Go(l,p);break e;case 1:o=s;var c=l.type,f=l.stateNode;if(!(l.flags&128)&&(typeof c.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(ft===null||!ft.has(f)))){l.flags|=65536,t&=-t,l.lanes|=t;var v=kc(l,o,t);Go(l,v);break e}}l=l.return}while(l!==null)}$c(n)}catch(C){t=C,Q===n&&n!==null&&(Q=n=n.return);continue}break}while(!0)}function Fc(){var e=di.current;return di.current=ci,e===null?ci:e}function qa(){(Y===0||Y===3||Y===2)&&(Y=4),q===null||!(At&268435455)&&!(Mi&268435455)||rt(q,te)}function mi(e,t){var n=z;z|=2;var r=Fc();(q!==e||te!==t)&&($e=null,Lt(e,t));do try{Lp();break}catch(i){Ic(e,i)}while(!0);if(Aa(),z=n,di.current=r,Q!==null)throw Error(w(261));return q=null,te=0,Y}function Lp(){for(;Q!==null;)Uc(Q)}function Tp(){for(;Q!==null&&!tf();)Uc(Q)}function Uc(e){var t=Bc(e.alternate,e,ve);e.memoizedProps=e.pendingProps,t===null?$c(e):Q=t,Ja.current=null}function $c(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Ep(n,t),n!==null){n.flags&=32767,Q=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Y=6,Q=null;return}}else if(n=Cp(n,t,ve),n!==null){Q=n;return}if(t=t.sibling,t!==null){Q=t;return}Q=t=e}while(t!==null);Y===0&&(Y=5)}function jt(e,t,n){var r=b,i=Ne.transition;try{Ne.transition=null,b=1,Op(e,t,n,r)}finally{Ne.transition=i,b=r}return null}function Op(e,t,n,r){do ln();while(lt!==null);if(z&6)throw Error(w(327));n=e.finishedWork;var i=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(w(177));e.callbackNode=null,e.callbackPriority=0;var l=n.lanes|n.childLanes;if(ff(e,l),e===q&&(Q=q=null,te=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Tr||(Tr=!0,Vc(Gr,function(){return ln(),null})),l=(n.flags&15990)!==0,n.subtreeFlags&15990||l){l=Ne.transition,Ne.transition=null;var a=b;b=1;var o=z;z|=4,Ja.current=null,Np(e,n),Ac(n,e),Zf(Il),Xr=!!Dl,Il=Dl=null,e.current=n,Mp(n),nf(),z=o,b=a,Ne.transition=l}else e.current=n;if(Tr&&(Tr=!1,lt=e,pi=i),l=e.pendingLanes,l===0&&(ft=null),af(n.stateNode),he(e,K()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)i=t[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(fi)throw fi=!1,e=ia,ia=null,e;return pi&1&&e.tag!==0&&ln(),l=e.pendingLanes,l&1?e===la?$n++:($n=0,la=e):$n=0,xt(),null}function ln(){if(lt!==null){var e=wu(pi),t=Ne.transition,n=b;try{if(Ne.transition=null,b=16>e?16:e,lt===null)var r=!1;else{if(e=lt,lt=null,pi=0,z&6)throw Error(w(331));var i=z;for(z|=4,N=e.current;N!==null;){var l=N,a=l.child;if(N.flags&16){var o=l.deletions;if(o!==null){for(var s=0;s<o.length;s++){var u=o[s];for(N=u;N!==null;){var g=N;switch(g.tag){case 0:case 11:case 15:Fn(8,g,l)}var d=g.child;if(d!==null)d.return=g,N=d;else for(;N!==null;){g=N;var h=g.sibling,y=g.return;if(Oc(g),g===u){N=null;break}if(h!==null){h.return=y,N=h;break}N=y}}}var S=l.alternate;if(S!==null){var x=S.child;if(x!==null){S.child=null;do{var j=x.sibling;x.sibling=null,x=j}while(x!==null)}}N=l}}if(l.subtreeFlags&2064&&a!==null)a.return=l,N=a;else e:for(;N!==null;){if(l=N,l.flags&2048)switch(l.tag){case 0:case 11:case 15:Fn(9,l,l.return)}var p=l.sibling;if(p!==null){p.return=l.return,N=p;break e}N=l.return}}var c=e.current;for(N=c;N!==null;){a=N;var f=a.child;if(a.subtreeFlags&2064&&f!==null)f.return=a,N=f;else e:for(a=c;N!==null;){if(o=N,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:Ni(9,o)}}catch(C){V(o,o.return,C)}if(o===a){N=null;break e}var v=o.sibling;if(v!==null){v.return=o.return,N=v;break e}N=o.return}}if(z=i,xt(),Fe&&typeof Fe.onPostCommitFiberRoot=="function")try{Fe.onPostCommitFiberRoot(yi,e)}catch{}r=!0}return r}finally{b=n,Ne.transition=t}}return!1}function hs(e,t,n){t=dn(n,t),t=wc(e,t,1),e=dt(e,t,1),t=ue(),e!==null&&(sr(e,1,t),he(e,t))}function V(e,t,n){if(e.tag===3)hs(e,e,n);else for(;t!==null;){if(t.tag===3){hs(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(ft===null||!ft.has(r))){e=dn(n,e),e=kc(t,e,1),t=dt(t,e,1),e=ue(),t!==null&&(sr(t,1,e),he(t,e));break}}t=t.return}}function Rp(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=ue(),e.pingedLanes|=e.suspendedLanes&n,q===e&&(te&n)===n&&(Y===4||Y===3&&(te&130023424)===te&&500>K()-Ya?Lt(e,0):Ga|=n),he(e,t)}function Hc(e,t){t===0&&(e.mode&1?(t=wr,wr<<=1,!(wr&130023424)&&(wr=4194304)):t=1);var n=ue();e=Je(e,t),e!==null&&(sr(e,t,n),he(e,n))}function zp(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Hc(e,n)}function Ap(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(w(314))}r!==null&&r.delete(t),Hc(e,n)}var Bc;Bc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||me.current)pe=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return pe=!1,kp(e,t,n);pe=!!(e.flags&131072)}else pe=!1,U&&t.flags&1048576&&Qu(t,ii,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Hr(e,t),e=t.pendingProps;var i=on(t,oe.current);rn(t,n),i=Ba(null,t,r,e,i,n);var l=Va();return t.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ge(r)?(l=!0,ni(t)):l=!1,t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Ia(t),i.updater=ji,t.stateNode=i,i._reactInternals=t,Ql(t,r,e,n),t=Yl(null,t,r,!0,l,n)):(t.tag=0,U&&l&&Ta(t),se(null,t,i,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Hr(e,t),e=t.pendingProps,i=r._init,r=i(r._payload),t.type=r,i=t.tag=Dp(r),e=Le(r,e),i){case 0:t=Gl(null,t,r,e,n);break e;case 1:t=as(null,t,r,e,n);break e;case 11:t=is(null,t,r,e,n);break e;case 14:t=ls(null,t,r,Le(r.type,e),n);break e}throw Error(w(306,r,""))}return t;case 0:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Le(r,i),Gl(e,t,r,i,n);case 1:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Le(r,i),as(e,t,r,i,n);case 3:e:{if(Nc(t),e===null)throw Error(w(387));r=t.pendingProps,l=t.memoizedState,i=l.element,qu(e,t),oi(t,r,null,n);var a=t.memoizedState;if(r=a.element,l.isDehydrated)if(l={element:r,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){i=dn(Error(w(423)),t),t=os(e,t,r,n,i);break e}else if(r!==i){i=dn(Error(w(424)),t),t=os(e,t,r,n,i);break e}else for(ye=ct(t.stateNode.containerInfo.firstChild),Se=t,U=!0,Oe=null,n=Xu(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(sn(),r===i){t=Ge(e,t,n);break e}se(e,t,r,n)}t=t.child}return t;case 5:return ec(t),e===null&&Vl(t),r=t.type,i=t.pendingProps,l=e!==null?e.memoizedProps:null,a=i.children,Fl(r,i)?a=null:l!==null&&Fl(r,l)&&(t.flags|=32),jc(e,t),se(e,t,a,n),t.child;case 6:return e===null&&Vl(t),null;case 13:return Mc(e,t,n);case 4:return Fa(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=un(t,null,r,n):se(e,t,r,n),t.child;case 11:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Le(r,i),is(e,t,r,i,n);case 7:return se(e,t,t.pendingProps,n),t.child;case 8:return se(e,t,t.pendingProps.children,n),t.child;case 12:return se(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,i=t.pendingProps,l=t.memoizedProps,a=i.value,D(li,r._currentValue),r._currentValue=a,l!==null)if(Ae(l.value,a)){if(l.children===i.children&&!me.current){t=Ge(e,t,n);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var o=l.dependencies;if(o!==null){a=l.child;for(var s=o.firstContext;s!==null;){if(s.context===r){if(l.tag===1){s=We(-1,n&-n),s.tag=2;var u=l.updateQueue;if(u!==null){u=u.shared;var g=u.pending;g===null?s.next=s:(s.next=g.next,g.next=s),u.pending=s}}l.lanes|=n,s=l.alternate,s!==null&&(s.lanes|=n),Wl(l.return,n,t),o.lanes|=n;break}s=s.next}}else if(l.tag===10)a=l.type===t.type?null:l.child;else if(l.tag===18){if(a=l.return,a===null)throw Error(w(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),Wl(a,n,t),a=l.sibling}else a=l.child;if(a!==null)a.return=l;else for(a=l;a!==null;){if(a===t){a=null;break}if(l=a.sibling,l!==null){l.return=a.return,a=l;break}a=a.return}l=a}se(e,t,i.children,n),t=t.child}return t;case 9:return i=t.type,r=t.pendingProps.children,rn(t,n),i=Me(i),r=r(i),t.flags|=1,se(e,t,r,n),t.child;case 14:return r=t.type,i=Le(r,t.pendingProps),i=Le(r.type,i),ls(e,t,r,i,n);case 15:return Cc(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Le(r,i),Hr(e,t),t.tag=1,ge(r)?(e=!0,ni(t)):e=!1,rn(t,n),xc(t,r,i),Ql(t,r,i,n),Yl(null,t,r,!0,e,n);case 19:return _c(e,t,n);case 22:return Ec(e,t,n)}throw Error(w(156,t.tag))};function Vc(e,t){return vu(e,t)}function bp(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function je(e,t,n,r){return new bp(e,t,n,r)}function eo(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Dp(e){if(typeof e=="function")return eo(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Sa)return 11;if(e===xa)return 14}return 2}function mt(e,t){var n=e.alternate;return n===null?(n=je(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Wr(e,t,n,r,i,l){var a=2;if(r=e,typeof e=="function")eo(e)&&(a=1);else if(typeof e=="string")a=5;else e:switch(e){case Ht:return Tt(n.children,i,l,t);case ya:a=8,i|=8;break;case vl:return e=je(12,n,t,i|2),e.elementType=vl,e.lanes=l,e;case yl:return e=je(13,n,t,i),e.elementType=yl,e.lanes=l,e;case Sl:return e=je(19,n,t,i),e.elementType=Sl,e.lanes=l,e;case eu:return _i(n,i,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Zs:a=10;break e;case qs:a=9;break e;case Sa:a=11;break e;case xa:a=14;break e;case et:a=16,r=null;break e}throw Error(w(130,e==null?e:typeof e,""))}return t=je(a,n,t,i),t.elementType=e,t.type=r,t.lanes=l,t}function Tt(e,t,n,r){return e=je(7,e,r,t),e.lanes=n,e}function _i(e,t,n,r){return e=je(22,e,r,t),e.elementType=eu,e.lanes=n,e.stateNode={isHidden:!1},e}function ul(e,t,n){return e=je(6,e,null,t),e.lanes=n,e}function cl(e,t,n){return t=je(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Ip(e,t,n,r,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Vi(0),this.expirationTimes=Vi(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Vi(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function to(e,t,n,r,i,l,a,o,s){return e=new Ip(e,t,n,o,s),t===1?(t=1,l===!0&&(t|=8)):t=0,l=je(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ia(l),e}function Fp(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:$t,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Wc(e){if(!e)return vt;e=e._reactInternals;e:{if(It(e)!==e||e.tag!==1)throw Error(w(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ge(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(w(171))}if(e.tag===1){var n=e.type;if(ge(n))return Wu(e,n,t)}return t}function Kc(e,t,n,r,i,l,a,o,s){return e=to(n,r,!0,e,i,l,a,o,s),e.context=Wc(null),n=e.current,r=ue(),i=pt(n),l=We(r,i),l.callback=t!=null?t:null,dt(n,l,i),e.current.lanes=i,sr(e,i,r),he(e,r),e}function Pi(e,t,n,r){var i=t.current,l=ue(),a=pt(i);return n=Wc(n),t.context===null?t.context=n:t.pendingContext=n,t=We(l,a),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=dt(i,t,a),e!==null&&(ze(e,i,a,l),Fr(e,i,a)),a}function gi(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function vs(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function no(e,t){vs(e,t),(e=e.alternate)&&vs(e,t)}function Up(){return null}var Qc=typeof reportError=="function"?reportError:function(e){console.error(e)};function ro(e){this._internalRoot=e}Li.prototype.render=ro.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(w(409));Pi(e,t,null,null)};Li.prototype.unmount=ro.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;bt(function(){Pi(null,e,null,null)}),t[Qe]=null}};function Li(e){this._internalRoot=e}Li.prototype.unstable_scheduleHydration=function(e){if(e){var t=Eu();e={blockedOn:null,target:e,priority:t};for(var n=0;n<nt.length&&t!==0&&t<nt[n].priority;n++);nt.splice(n,0,e),n===0&&Nu(e)}};function io(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ti(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function ys(){}function $p(e,t,n,r,i){if(i){if(typeof r=="function"){var l=r;r=function(){var u=gi(a);l.call(u)}}var a=Kc(t,r,e,0,null,!1,!1,"",ys);return e._reactRootContainer=a,e[Qe]=a.current,Yn(e.nodeType===8?e.parentNode:e),bt(),a}for(;i=e.lastChild;)e.removeChild(i);if(typeof r=="function"){var o=r;r=function(){var u=gi(s);o.call(u)}}var s=to(e,0,!1,null,null,!1,!1,"",ys);return e._reactRootContainer=s,e[Qe]=s.current,Yn(e.nodeType===8?e.parentNode:e),bt(function(){Pi(t,s,n,r)}),s}function Oi(e,t,n,r,i){var l=n._reactRootContainer;if(l){var a=l;if(typeof i=="function"){var o=i;i=function(){var s=gi(a);o.call(s)}}Pi(t,a,e,i)}else a=$p(n,t,e,i,r);return gi(a)}ku=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Tn(t.pendingLanes);n!==0&&(Ca(t,n|1),he(t,K()),!(z&6)&&(fn=K()+500,xt()))}break;case 13:bt(function(){var r=Je(e,1);if(r!==null){var i=ue();ze(r,e,1,i)}}),no(e,1)}};Ea=function(e){if(e.tag===13){var t=Je(e,134217728);if(t!==null){var n=ue();ze(t,e,134217728,n)}no(e,134217728)}};Cu=function(e){if(e.tag===13){var t=pt(e),n=Je(e,t);if(n!==null){var r=ue();ze(n,e,t,r)}no(e,t)}};Eu=function(){return b};ju=function(e,t){var n=b;try{return b=e,t()}finally{b=n}};Pl=function(e,t,n){switch(t){case"input":if(kl(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var i=ki(r);if(!i)throw Error(w(90));nu(r),kl(r,i)}}}break;case"textarea":iu(e,n);break;case"select":t=n.value,t!=null&&qt(e,!!n.multiple,t,!1)}};du=Xa;fu=bt;var Hp={usingClientEntryPoint:!1,Events:[cr,Kt,ki,uu,cu,Xa]},Mn={findFiberByHostInstance:Mt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Bp={bundleType:Mn.bundleType,version:Mn.version,rendererPackageName:Mn.rendererPackageName,rendererConfig:Mn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Xe.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=gu(e),e===null?null:e.stateNode},findFiberByHostInstance:Mn.findFiberByHostInstance||Up,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Or=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Or.isDisabled&&Or.supportsFiber)try{yi=Or.inject(Bp),Fe=Or}catch{}}we.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Hp;we.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!io(t))throw Error(w(200));return Fp(e,t,null,n)};we.createRoot=function(e,t){if(!io(e))throw Error(w(299));var n=!1,r="",i=Qc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),t=to(e,1,!1,null,null,n,!1,r,i),e[Qe]=t.current,Yn(e.nodeType===8?e.parentNode:e),new ro(t)};we.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(w(188)):(e=Object.keys(e).join(","),Error(w(268,e)));return e=gu(t),e=e===null?null:e.stateNode,e};we.flushSync=function(e){return bt(e)};we.hydrate=function(e,t,n){if(!Ti(t))throw Error(w(200));return Oi(null,e,t,!0,n)};we.hydrateRoot=function(e,t,n){if(!io(e))throw Error(w(405));var r=n!=null&&n.hydratedSources||null,i=!1,l="",a=Qc;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),t=Kc(t,null,e,1,n!=null?n:null,i,!1,l,a),e[Qe]=t.current,Yn(e),r)for(e=0;e<r.length;e++)n=r[e],i=n._getVersion,i=i(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,i]:t.mutableSourceEagerHydrationData.push(n,i);return new Li(t)};we.render=function(e,t,n){if(!Ti(t))throw Error(w(200));return Oi(null,e,t,!1,n)};we.unmountComponentAtNode=function(e){if(!Ti(e))throw Error(w(40));return e._reactRootContainer?(bt(function(){Oi(null,null,e,!1,function(){e._reactRootContainer=null,e[Qe]=null})}),!0):!1};we.unstable_batchedUpdates=Xa;we.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Ti(n))throw Error(w(200));if(e==null||e._reactInternals===void 0)throw Error(w(38));return Oi(e,t,n,!1,r)};we.version="18.3.1-next-f1338f8080-20240426";function Jc(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Jc)}catch(e){console.error(e)}}Jc(),Js.exports=we;var Vp=Js.exports,Ss=Vp;gl.createRoot=Ss.createRoot,gl.hydrateRoot=Ss.hydrateRoot;/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function lr(){return lr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},lr.apply(this,arguments)}var at;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(at||(at={}));const xs="popstate";function Wp(e){e===void 0&&(e={});function t(r,i){let{pathname:l,search:a,hash:o}=r.location;return sa("",{pathname:l,search:a,hash:o},i.state&&i.state.usr||null,i.state&&i.state.key||"default")}function n(r,i){return typeof i=="string"?i:hi(i)}return Qp(t,n,null,e)}function J(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function lo(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function Kp(){return Math.random().toString(36).substr(2,8)}function ws(e,t){return{usr:e.state,key:e.key,idx:t}}function sa(e,t,n,r){return n===void 0&&(n=null),lr({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?vn(t):t,{state:n,key:t&&t.key||r||Kp()})}function hi(e){let{pathname:t="/",search:n="",hash:r=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(t+=r.charAt(0)==="#"?r:"#"+r),t}function vn(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substr(r),e=e.substr(0,r)),e&&(t.pathname=e)}return t}function Qp(e,t,n,r){r===void 0&&(r={});let{window:i=document.defaultView,v5Compat:l=!1}=r,a=i.history,o=at.Pop,s=null,u=g();u==null&&(u=0,a.replaceState(lr({},a.state,{idx:u}),""));function g(){return(a.state||{idx:null}).idx}function d(){o=at.Pop;let j=g(),p=j==null?null:j-u;u=j,s&&s({action:o,location:x.location,delta:p})}function h(j,p){o=at.Push;let c=sa(x.location,j,p);u=g()+1;let f=ws(c,u),v=x.createHref(c);try{a.pushState(f,"",v)}catch(C){if(C instanceof DOMException&&C.name==="DataCloneError")throw C;i.location.assign(v)}l&&s&&s({action:o,location:x.location,delta:1})}function y(j,p){o=at.Replace;let c=sa(x.location,j,p);u=g();let f=ws(c,u),v=x.createHref(c);a.replaceState(f,"",v),l&&s&&s({action:o,location:x.location,delta:0})}function S(j){let p=i.location.origin!=="null"?i.location.origin:i.location.href,c=typeof j=="string"?j:hi(j);return c=c.replace(/ $/,"%20"),J(p,"No window.location.(origin|href) available to create URL for href: "+c),new URL(c,p)}let x={get action(){return o},get location(){return e(i,a)},listen(j){if(s)throw new Error("A history only accepts one active listener");return i.addEventListener(xs,d),s=j,()=>{i.removeEventListener(xs,d),s=null}},createHref(j){return t(i,j)},createURL:S,encodeLocation(j){let p=S(j);return{pathname:p.pathname,search:p.search,hash:p.hash}},push:h,replace:y,go(j){return a.go(j)}};return x}var ks;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(ks||(ks={}));function Jp(e,t,n){return n===void 0&&(n="/"),Gp(e,t,n)}function Gp(e,t,n,r){let i=typeof t=="string"?vn(t):t,l=ao(i.pathname||"/",n);if(l==null)return null;let a=Gc(e);Yp(a);let o=null;for(let s=0;o==null&&s<a.length;++s){let u=sm(l);o=lm(a[s],u)}return o}function Gc(e,t,n,r){t===void 0&&(t=[]),n===void 0&&(n=[]),r===void 0&&(r="");let i=(l,a,o)=>{let s={relativePath:o===void 0?l.path||"":o,caseSensitive:l.caseSensitive===!0,childrenIndex:a,route:l};s.relativePath.startsWith("/")&&(J(s.relativePath.startsWith(r),'Absolute route path "'+s.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),s.relativePath=s.relativePath.slice(r.length));let u=gt([r,s.relativePath]),g=n.concat(s);l.children&&l.children.length>0&&(J(l.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+u+'".')),Gc(l.children,t,g,u)),!(l.path==null&&!l.index)&&t.push({path:u,score:rm(u,l.index),routesMeta:g})};return e.forEach((l,a)=>{var o;if(l.path===""||!((o=l.path)!=null&&o.includes("?")))i(l,a);else for(let s of Yc(l.path))i(l,a,s)}),t}function Yc(e){let t=e.split("/");if(t.length===0)return[];let[n,...r]=t,i=n.endsWith("?"),l=n.replace(/\?$/,"");if(r.length===0)return i?[l,""]:[l];let a=Yc(r.join("/")),o=[];return o.push(...a.map(s=>s===""?l:[l,s].join("/"))),i&&o.push(...a),o.map(s=>e.startsWith("/")&&s===""?"/":s)}function Yp(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:im(t.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const Xp=/^:[\w-]+$/,Zp=3,qp=2,em=1,tm=10,nm=-2,Cs=e=>e==="*";function rm(e,t){let n=e.split("/"),r=n.length;return n.some(Cs)&&(r+=nm),t&&(r+=qp),n.filter(i=>!Cs(i)).reduce((i,l)=>i+(Xp.test(l)?Zp:l===""?em:tm),r)}function im(e,t){return e.length===t.length&&e.slice(0,-1).every((r,i)=>r===t[i])?e[e.length-1]-t[t.length-1]:0}function lm(e,t,n){let{routesMeta:r}=e,i={},l="/",a=[];for(let o=0;o<r.length;++o){let s=r[o],u=o===r.length-1,g=l==="/"?t:t.slice(l.length)||"/",d=am({path:s.relativePath,caseSensitive:s.caseSensitive,end:u},g),h=s.route;if(!d)return null;Object.assign(i,d.params),a.push({params:i,pathname:gt([l,d.pathname]),pathnameBase:pm(gt([l,d.pathnameBase])),route:h}),d.pathnameBase!=="/"&&(l=gt([l,d.pathnameBase]))}return a}function am(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,r]=om(e.path,e.caseSensitive,e.end),i=t.match(n);if(!i)return null;let l=i[0],a=l.replace(/(.)\/+$/,"$1"),o=i.slice(1);return{params:r.reduce((u,g,d)=>{let{paramName:h,isOptional:y}=g;if(h==="*"){let x=o[d]||"";a=l.slice(0,l.length-x.length).replace(/(.)\/+$/,"$1")}const S=o[d];return y&&!S?u[h]=void 0:u[h]=(S||"").replace(/%2F/g,"/"),u},{}),pathname:l,pathnameBase:a,pattern:e}}function om(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),lo(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let r=[],i="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(a,o,s)=>(r.push({paramName:o,isOptional:s!=null}),s?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(r.push({paramName:"*"}),i+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?i+="\\/*$":e!==""&&e!=="/"&&(i+="(?:(?=\\/|$))"),[new RegExp(i,t?void 0:"i"),r]}function sm(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return lo(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function ao(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&r!=="/"?null:e.slice(n)||"/"}const um=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,cm=e=>um.test(e);function dm(e,t){t===void 0&&(t="/");let{pathname:n,search:r="",hash:i=""}=typeof e=="string"?vn(e):e,l;if(n)if(cm(n))l=n;else{if(n.includes("//")){let a=n;n=n.replace(/\/\/+/g,"/"),lo(!1,"Pathnames cannot have embedded double slashes - normalizing "+(a+" -> "+n))}n.startsWith("/")?l=Es(n.substring(1),"/"):l=Es(n,t)}else l=t;return{pathname:l,search:mm(r),hash:gm(i)}}function Es(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(i=>{i===".."?n.length>1&&n.pop():i!=="."&&n.push(i)}),n.length>1?n.join("/"):"/"}function dl(e,t,n,r){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function fm(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function Xc(e,t){let n=fm(e);return t?n.map((r,i)=>i===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function Zc(e,t,n,r){r===void 0&&(r=!1);let i;typeof e=="string"?i=vn(e):(i=lr({},e),J(!i.pathname||!i.pathname.includes("?"),dl("?","pathname","search",i)),J(!i.pathname||!i.pathname.includes("#"),dl("#","pathname","hash",i)),J(!i.search||!i.search.includes("#"),dl("#","search","hash",i)));let l=e===""||i.pathname==="",a=l?"/":i.pathname,o;if(a==null)o=n;else{let d=t.length-1;if(!r&&a.startsWith("..")){let h=a.split("/");for(;h[0]==="..";)h.shift(),d-=1;i.pathname=h.join("/")}o=d>=0?t[d]:"/"}let s=dm(i,o),u=a&&a!=="/"&&a.endsWith("/"),g=(l||a===".")&&n.endsWith("/");return!s.pathname.endsWith("/")&&(u||g)&&(s.pathname+="/"),s}const gt=e=>e.join("/").replace(/\/\/+/g,"/"),pm=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),mm=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,gm=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function hm(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const qc=["post","put","patch","delete"];new Set(qc);const vm=["get",...qc];new Set(vm);/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ar(){return ar=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},ar.apply(this,arguments)}const oo=k.createContext(null),ym=k.createContext(null),Ft=k.createContext(null),Ri=k.createContext(null),wt=k.createContext({outlet:null,matches:[],isDataRoute:!1}),ed=k.createContext(null);function Sm(e,t){let{relative:n}=t===void 0?{}:t;fr()||J(!1);let{basename:r,navigator:i}=k.useContext(Ft),{hash:l,pathname:a,search:o}=rd(e,{relative:n}),s=a;return r!=="/"&&(s=a==="/"?r:gt([r,a])),i.createHref({pathname:s,search:o,hash:l})}function fr(){return k.useContext(Ri)!=null}function pr(){return fr()||J(!1),k.useContext(Ri).location}function td(e){k.useContext(Ft).static||k.useLayoutEffect(e)}function nd(){let{isDataRoute:e}=k.useContext(wt);return e?Rm():xm()}function xm(){fr()||J(!1);let e=k.useContext(oo),{basename:t,future:n,navigator:r}=k.useContext(Ft),{matches:i}=k.useContext(wt),{pathname:l}=pr(),a=JSON.stringify(Xc(i,n.v7_relativeSplatPath)),o=k.useRef(!1);return td(()=>{o.current=!0}),k.useCallback(function(u,g){if(g===void 0&&(g={}),!o.current)return;if(typeof u=="number"){r.go(u);return}let d=Zc(u,JSON.parse(a),l,g.relative==="path");e==null&&t!=="/"&&(d.pathname=d.pathname==="/"?t:gt([t,d.pathname])),(g.replace?r.replace:r.push)(d,g.state,g)},[t,r,a,l,e])}function wm(){let{matches:e}=k.useContext(wt),t=e[e.length-1];return t?t.params:{}}function rd(e,t){let{relative:n}=t===void 0?{}:t,{future:r}=k.useContext(Ft),{matches:i}=k.useContext(wt),{pathname:l}=pr(),a=JSON.stringify(Xc(i,r.v7_relativeSplatPath));return k.useMemo(()=>Zc(e,JSON.parse(a),l,n==="path"),[e,a,l,n])}function km(e,t){return Cm(e,t)}function Cm(e,t,n,r){fr()||J(!1);let{navigator:i}=k.useContext(Ft),{matches:l}=k.useContext(wt),a=l[l.length-1],o=a?a.params:{};a&&a.pathname;let s=a?a.pathnameBase:"/";a&&a.route;let u=pr(),g;if(t){var d;let j=typeof t=="string"?vn(t):t;s==="/"||(d=j.pathname)!=null&&d.startsWith(s)||J(!1),g=j}else g=u;let h=g.pathname||"/",y=h;if(s!=="/"){let j=s.replace(/^\//,"").split("/");y="/"+h.replace(/^\//,"").split("/").slice(j.length).join("/")}let S=Jp(e,{pathname:y}),x=_m(S&&S.map(j=>Object.assign({},j,{params:Object.assign({},o,j.params),pathname:gt([s,i.encodeLocation?i.encodeLocation(j.pathname).pathname:j.pathname]),pathnameBase:j.pathnameBase==="/"?s:gt([s,i.encodeLocation?i.encodeLocation(j.pathnameBase).pathname:j.pathnameBase])})),l,n,r);return t&&x?k.createElement(Ri.Provider,{value:{location:ar({pathname:"/",search:"",hash:"",state:null,key:"default"},g),navigationType:at.Pop}},x):x}function Em(){let e=Om(),t=hm(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,i={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return k.createElement(k.Fragment,null,k.createElement("h2",null,"Unexpected Application Error!"),k.createElement("h3",{style:{fontStyle:"italic"}},t),n?k.createElement("pre",{style:i},n):null,null)}const jm=k.createElement(Em,null);class Nm extends k.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?k.createElement(wt.Provider,{value:this.props.routeContext},k.createElement(ed.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function Mm(e){let{routeContext:t,match:n,children:r}=e,i=k.useContext(oo);return i&&i.static&&i.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(i.staticContext._deepestRenderedBoundaryId=n.route.id),k.createElement(wt.Provider,{value:t},r)}function _m(e,t,n,r){var i;if(t===void 0&&(t=[]),n===void 0&&(n=null),r===void 0&&(r=null),e==null){var l;if(!n)return null;if(n.errors)e=n.matches;else if((l=r)!=null&&l.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let a=e,o=(i=n)==null?void 0:i.errors;if(o!=null){let g=a.findIndex(d=>d.route.id&&(o==null?void 0:o[d.route.id])!==void 0);g>=0||J(!1),a=a.slice(0,Math.min(a.length,g+1))}let s=!1,u=-1;if(n&&r&&r.v7_partialHydration)for(let g=0;g<a.length;g++){let d=a[g];if((d.route.HydrateFallback||d.route.hydrateFallbackElement)&&(u=g),d.route.id){let{loaderData:h,errors:y}=n,S=d.route.loader&&h[d.route.id]===void 0&&(!y||y[d.route.id]===void 0);if(d.route.lazy||S){s=!0,u>=0?a=a.slice(0,u+1):a=[a[0]];break}}}return a.reduceRight((g,d,h)=>{let y,S=!1,x=null,j=null;n&&(y=o&&d.route.id?o[d.route.id]:void 0,x=d.route.errorElement||jm,s&&(u<0&&h===0?(zm("route-fallback"),S=!0,j=null):u===h&&(S=!0,j=d.route.hydrateFallbackElement||null)));let p=t.concat(a.slice(0,h+1)),c=()=>{let f;return y?f=x:S?f=j:d.route.Component?f=k.createElement(d.route.Component,null):d.route.element?f=d.route.element:f=g,k.createElement(Mm,{match:d,routeContext:{outlet:g,matches:p,isDataRoute:n!=null},children:f})};return n&&(d.route.ErrorBoundary||d.route.errorElement||h===0)?k.createElement(Nm,{location:n.location,revalidation:n.revalidation,component:x,error:y,children:c(),routeContext:{outlet:null,matches:p,isDataRoute:!0}}):c()},null)}var id=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(id||{}),ld=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(ld||{});function Pm(e){let t=k.useContext(oo);return t||J(!1),t}function Lm(e){let t=k.useContext(ym);return t||J(!1),t}function Tm(e){let t=k.useContext(wt);return t||J(!1),t}function ad(e){let t=Tm(),n=t.matches[t.matches.length-1];return n.route.id||J(!1),n.route.id}function Om(){var e;let t=k.useContext(ed),n=Lm(),r=ad();return t!==void 0?t:(e=n.errors)==null?void 0:e[r]}function Rm(){let{router:e}=Pm(id.UseNavigateStable),t=ad(ld.UseNavigateStable),n=k.useRef(!1);return td(()=>{n.current=!0}),k.useCallback(function(i,l){l===void 0&&(l={}),n.current&&(typeof i=="number"?e.navigate(i):e.navigate(i,ar({fromRouteId:t},l)))},[e,t])}const js={};function zm(e,t,n){js[e]||(js[e]=!0)}function Am(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function Nt(e){J(!1)}function bm(e){let{basename:t="/",children:n=null,location:r,navigationType:i=at.Pop,navigator:l,static:a=!1,future:o}=e;fr()&&J(!1);let s=t.replace(/^\/*/,"/"),u=k.useMemo(()=>({basename:s,navigator:l,static:a,future:ar({v7_relativeSplatPath:!1},o)}),[s,o,l,a]);typeof r=="string"&&(r=vn(r));let{pathname:g="/",search:d="",hash:h="",state:y=null,key:S="default"}=r,x=k.useMemo(()=>{let j=ao(g,s);return j==null?null:{location:{pathname:j,search:d,hash:h,state:y,key:S},navigationType:i}},[s,g,d,h,y,S,i]);return x==null?null:k.createElement(Ft.Provider,{value:u},k.createElement(Ri.Provider,{children:n,value:x}))}function Dm(e){let{children:t,location:n}=e;return km(ua(t),n)}new Promise(()=>{});function ua(e,t){t===void 0&&(t=[]);let n=[];return k.Children.forEach(e,(r,i)=>{if(!k.isValidElement(r))return;let l=[...t,i];if(r.type===k.Fragment){n.push.apply(n,ua(r.props.children,l));return}r.type!==Nt&&J(!1),!r.props.index||!r.props.children||J(!1);let a={id:r.props.id||l.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(a.children=ua(r.props.children,l)),n.push(a)}),n}/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ca(){return ca=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},ca.apply(this,arguments)}function Im(e,t){if(e==null)return{};var n={},r=Object.keys(e),i,l;for(l=0;l<r.length;l++)i=r[l],!(t.indexOf(i)>=0)&&(n[i]=e[i]);return n}function Fm(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function Um(e,t){return e.button===0&&(!t||t==="_self")&&!Fm(e)}const $m=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],Hm="6";try{window.__reactRouterVersion=Hm}catch{}const Bm="startTransition",Ns=Od[Bm];function Vm(e){let{basename:t,children:n,future:r,window:i}=e,l=k.useRef();l.current==null&&(l.current=Wp({window:i,v5Compat:!0}));let a=l.current,[o,s]=k.useState({action:a.action,location:a.location}),{v7_startTransition:u}=r||{},g=k.useCallback(d=>{u&&Ns?Ns(()=>s(d)):s(d)},[s,u]);return k.useLayoutEffect(()=>a.listen(g),[a,g]),k.useEffect(()=>Am(r),[r]),k.createElement(bm,{basename:t,children:n,location:o.location,navigationType:o.action,navigator:a,future:r})}const Wm=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",Km=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Ye=k.forwardRef(function(t,n){let{onClick:r,relative:i,reloadDocument:l,replace:a,state:o,target:s,to:u,preventScrollReset:g,viewTransition:d}=t,h=Im(t,$m),{basename:y}=k.useContext(Ft),S,x=!1;if(typeof u=="string"&&Km.test(u)&&(S=u,Wm))try{let f=new URL(window.location.href),v=u.startsWith("//")?new URL(f.protocol+u):new URL(u),C=ao(v.pathname,y);v.origin===f.origin&&C!=null?u=C+v.search+v.hash:x=!0}catch{}let j=Sm(u,{relative:i}),p=Qm(u,{replace:a,state:o,target:s,preventScrollReset:g,relative:i,viewTransition:d});function c(f){r&&r(f),f.defaultPrevented||p(f)}return k.createElement("a",ca({},h,{href:S||j,onClick:x||l?r:c,ref:n,target:s}))});var Ms;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(Ms||(Ms={}));var _s;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(_s||(_s={}));function Qm(e,t){let{target:n,replace:r,state:i,preventScrollReset:l,relative:a,viewTransition:o}=t===void 0?{}:t,s=nd(),u=pr(),g=rd(e,{relative:a});return k.useCallback(d=>{if(Um(d,n)){d.preventDefault();let h=r!==void 0?r:hi(u)===hi(g);s(e,{replace:h,state:i,preventScrollReset:l,relative:a,viewTransition:o})}},[u,s,g,r,i,n,e,l,a,o])}const Jm=[{path:"/",label:"首页"},{path:"/about",label:"理念"},{path:"/courses",label:"课程"},{path:"/user-center",label:"学习中心"}];function Gm(){const e=pr();return m.jsxs("header",{className:"flex items-center justify-between px-6 py-3 bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm",children:[m.jsxs("div",{className:"flex items-center gap-6",children:[m.jsx(Ye,{to:"/",className:"flex items-center gap-2",children:m.jsx("span",{className:"text-xl font-bold text-primary-400",children:"CodeStep"})}),m.jsx("nav",{className:"flex items-center gap-1",children:Jm.map(t=>m.jsx(Ye,{to:t.path,className:`px-3 py-1.5 rounded-md text-sm transition-colors ${e.pathname===t.path?"bg-primary-500/20 text-primary-300":"text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"}`,children:t.label},t.path))})]}),m.jsx("div",{className:"flex items-center gap-3",children:m.jsx("span",{className:"text-xs text-gray-500",children:"v0.1.0"})})]})}function Ym({children:e}){return m.jsxs("div",{className:"flex flex-col h-screen w-screen overflow-hidden",children:[m.jsx(Gm,{}),m.jsx("main",{className:"flex-1 overflow-auto",children:e})]})}function Xm(){return m.jsx("div",{className:"flex flex-col items-center justify-center h-full px-8 animate-fade-in",children:m.jsxs("div",{className:"max-w-2xl text-center space-y-8",children:[m.jsx("h1",{className:"text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent",children:"CodeStep"}),m.jsx("p",{className:"text-xl text-gray-300",children:"一步步学编程，在 AI 时代打牢编程基础"}),m.jsx("p",{className:"text-gray-400 leading-relaxed",children:"通过「逐步显示、手敲代码、即时验证」的学习模式， 帮助你建立真正的编程能力和肌肉记忆。"}),m.jsxs("div",{className:"flex items-center justify-center gap-4 pt-4",children:[m.jsx(Ye,{to:"/courses",className:"px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors",children:"开始学习"}),m.jsx(Ye,{to:"/about",className:"px-6 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg font-medium transition-colors",children:"了解更多"})]})]})})}function Zm(){const e=[{title:"回归本质",description:"在 AI 时代回归编程动手实践的本质"},{title:"即时反馈",description:"逐字符验证，立即看到对错"},{title:"肌肉记忆",description:"通过打字练习建立代码书写习惯"},{title:"循序渐进",description:"分解复杂概念为小步骤，步步为营"}];return m.jsx("div",{className:"flex flex-col items-center justify-center h-full px-8 animate-fade-in",children:m.jsxs("div",{className:"max-w-3xl space-y-8",children:[m.jsx("h1",{className:"text-3xl font-bold text-center",children:"学习理念"}),m.jsx("p",{className:"text-gray-400 text-center leading-relaxed",children:"CodeStep 的灵感来源于语言学习应用 Duolingo，但专注于编程教育。 我们相信，即使在 AI 辅助编程的时代，扎实的编程基础仍然不可或缺。"}),m.jsx("div",{className:"grid grid-cols-2 gap-6 pt-4",children:e.map(t=>m.jsxs("div",{className:"p-6 rounded-xl bg-gray-800/50 border border-gray-700/50",children:[m.jsx("h3",{className:"text-lg font-semibold text-primary-300 mb-2",children:t.title}),m.jsx("p",{className:"text-gray-400 text-sm",children:t.description})]},t.title))})]})})}const qm={},Ps=e=>{let t;const n=new Set,r=(g,d)=>{const h=typeof g=="function"?g(t):g;if(!Object.is(h,t)){const y=t;t=(d!=null?d:typeof h!="object"||h===null)?h:Object.assign({},t,h),n.forEach(S=>S(t,y))}},i=()=>t,s={setState:r,getState:i,getInitialState:()=>u,subscribe:g=>(n.add(g),()=>n.delete(g)),destroy:()=>{(qm?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),n.clear()}},u=t=e(r,i,s);return s},eg=e=>e?Ps(e):Ps;var od={exports:{}},sd={},ud={exports:{}},cd={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var pn=k;function tg(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var ng=typeof Object.is=="function"?Object.is:tg,rg=pn.useState,ig=pn.useEffect,lg=pn.useLayoutEffect,ag=pn.useDebugValue;function og(e,t){var n=t(),r=rg({inst:{value:n,getSnapshot:t}}),i=r[0].inst,l=r[1];return lg(function(){i.value=n,i.getSnapshot=t,fl(i)&&l({inst:i})},[e,n,t]),ig(function(){return fl(i)&&l({inst:i}),e(function(){fl(i)&&l({inst:i})})},[e]),ag(n),n}function fl(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!ng(e,n)}catch{return!0}}function sg(e,t){return t()}var ug=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?sg:og;cd.useSyncExternalStore=pn.useSyncExternalStore!==void 0?pn.useSyncExternalStore:ug;ud.exports=cd;var cg=ud.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var zi=k,dg=cg;function fg(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var pg=typeof Object.is=="function"?Object.is:fg,mg=dg.useSyncExternalStore,gg=zi.useRef,hg=zi.useEffect,vg=zi.useMemo,yg=zi.useDebugValue;sd.useSyncExternalStoreWithSelector=function(e,t,n,r,i){var l=gg(null);if(l.current===null){var a={hasValue:!1,value:null};l.current=a}else a=l.current;l=vg(function(){function s(y){if(!u){if(u=!0,g=y,y=r(y),i!==void 0&&a.hasValue){var S=a.value;if(i(S,y))return d=S}return d=y}if(S=d,pg(g,y))return S;var x=r(y);return i!==void 0&&i(S,x)?(g=y,S):(g=y,d=x)}var u=!1,g,d,h=n===void 0?null:n;return[function(){return s(t())},h===null?void 0:function(){return s(h())}]},[t,n,r,i]);var o=mg(e,l[0],l[1]);return hg(function(){a.hasValue=!0,a.value=o},[o]),yg(o),o};od.exports=sd;var Sg=od.exports;const xg=As(Sg),dd={},{useDebugValue:wg}=Ks,{useSyncExternalStoreWithSelector:kg}=xg;let Ls=!1;const Cg=e=>e;function Eg(e,t=Cg,n){(dd?"production":void 0)!=="production"&&n&&!Ls&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),Ls=!0);const r=kg(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,n);return wg(r),r}const Ts=e=>{(dd?"production":void 0)!=="production"&&typeof e!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const t=typeof e=="function"?eg(e):e,n=(r,i)=>Eg(t,r,i);return Object.assign(n,t),n},jg=e=>e?Ts(e):Ts;async function qe(e,t={},n){return window.__TAURI_INTERNALS__.invoke(e,t,n)}const Os=[{id:"java-hello",title:"Java 入门：Hello World",description:"学习 Java 程序的基本结构，写出你的第一个程序",language:"java",category:"fundamentals",difficulty:"beginner",concepts:["基础语法","main 方法","输出语句"],estimatedMinutes:15,stepsCount:8},{id:"java-vars",title:"变量与数据类型",description:"掌握 Java 中的变量声明、赋值和基本数据类型",language:"java",category:"fundamentals",difficulty:"beginner",concepts:["变量","数据类型","运算符"],estimatedMinutes:20,stepsCount:10},{id:"java-if-for",title:"条件与循环",description:"使用 if/else 和循环控制程序流程",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["if/else","for 循环","while 循环","break","continue"],estimatedMinutes:25,stepsCount:12},{id:"java-method",title:"方法与函数",description:"学习方法的定义、参数、返回值和方法重载",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["方法定义","参数","返回值","方法重载","递归"],estimatedMinutes:20,stepsCount:10},{id:"java-array",title:"数组基础",description:"掌握 Java 数组的声明、初始化和使用",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["数组声明","数组初始化","数组遍历","数组应用"],estimatedMinutes:15,stepsCount:8},{id:"java-oop",title:"面向对象编程",description:"掌握类、对象、封装、继承和多态",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["类与对象","封装","构造方法","继承","多态","static","final"],estimatedMinutes:40,stepsCount:15},{id:"java-collection",title:"集合框架",description:"掌握 ArrayList、HashMap、HashSet 等常用集合",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["ArrayList","HashMap","HashSet","集合遍历","集合排序"],estimatedMinutes:30,stepsCount:12},{id:"java-exception",title:"异常处理",description:"掌握 try-catch、throw、throws 等异常处理机制",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["异常基础","try-catch","finally","throw","throws"],estimatedMinutes:20,stepsCount:8}],Rr={"java-hello":{id:"java-hello",title:"Java 入门：Hello World",description:"学习 Java 程序的基本结构，写出你的第一个程序",language:"java",category:"fundamentals",difficulty:"beginner",concepts:["基础语法","main 方法","输出语句"],estimatedMinutes:15,steps:[{id:"java-hello-1",type:"coding",title:"理解 Java 程序结构",concept:"基础语法",difficulty:"beginner",instruction:`每个 Java 程序都由一个类组成。类是 Java 程序的基本单位。

请在编辑器中写一个空的 Main 类。`,hint:"public class Main { }",starter:"",answer:`public class Main {

}`,expectedOutput:"",validation:{type:"contains",value:"class Main"},encouragement:"类名必须与文件名相同！"},{id:"java-hello-2",type:"typing",title:"添加 main 方法",concept:"main 方法",difficulty:"beginner",instruction:`main 方法是 Java 程序的入口。

请照着敲一遍，记住这个固定写法！`,hint:"这是 Java 最常用的代码片段",targetCode:`public class Main {
    public static void main(String[] args) {
        
    }
}`,encouragement:"main 方法是每个 Java 程序的起点！"},{id:"java-hello-3",type:"coding",title:"输出第一行文字",concept:"输出语句",difficulty:"beginner",instruction:`在 main 方法中使用 System.out.println() 输出文字。

在引号中填入你想输出的内容。`,hint:'System.out.println("Hello");',starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}`,expectedOutput:"Hello",validation:{type:"contains",value:"System.out.println("},encouragement:"这是你第一个输出语句！"},{id:"java-hello-4",type:"typing",title:"输出多行内容",concept:"输出语句",difficulty:"beginner",instruction:`使用两个 println() 分别输出 "Hello" 和 "World"。

照着敲！`,hint:"每个 println() 输出一行",targetCode:`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
        System.out.println("World");
    }
}`,expectedOutput:`Hello
World`,encouragement:"你学会了换行输出！"},{id:"java-hello-5",type:"coding",title:"print 和 println 的区别",concept:"print statement",difficulty:"beginner",instruction:`print 不换行，println 会换行。

请先用 print 输出 "Hello "，再用 println 输出 "World"。`,hint:"注意 print 没有 ln",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        System.out.print("Hello ");
        System.out.println("World");
    }
}`,expectedOutput:"Hello World",validation:{type:"contains",value:"System.out.print("},encouragement:"注意到区别了吗？print 不换行！"},{id:"java-hello-6",type:"coding",title:"输出数字",concept:"print statement",difficulty:"beginner",instruction:`System.out.println() 可以直接输出数字，不需要放在引号里。

请输出数字 2024。`,hint:"System.out.println(2024); 注意没有引号",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        System.out.println(2024);
    }
}`,expectedOutput:"2024",validation:{type:"contains",value:"System.out.println(2024)"},encouragement:"数字不需要引号！"},{id:"java-hello-7",type:"coding",title:"输出计算结果",concept:"print statement",difficulty:"beginner",instruction:`System.out.println() 可以直接输出表达式的计算结果。

请输出 10 + 20 的结果。`,hint:"System.out.println(10 + 20);",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        System.out.println(10 + 20);
    }
}`,expectedOutput:"30",validation:{type:"contains",value:"System.out.println(10 + 20)"},encouragement:"Java 可以直接做数学计算！"},{id:"java-hello-8",type:"typing",title:"完整 Hello World",concept:"综合练习",difficulty:"beginner",instruction:`综合练习：请照着敲完这个完整的 Java 程序。

这是你的第一个作品！`,hint:"注意注释用 //，字符串用双引号",targetCode:`// My first Java program
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,expectedOutput:"Hello, Java!",encouragement:"恭喜你完成了第一个 Java 程序！"}]},"java-vars":{id:"java-vars",title:"变量与数据类型",description:"掌握 Java 中的变量声明、赋值和基本数据类型",language:"java",category:"fundamentals",difficulty:"beginner",concepts:["变量","数据类型","运算符"],estimatedMinutes:20,steps:[{id:"java-vars-1",type:"coding",title:"声明 int 类型变量",concept:"variables",difficulty:"beginner",instruction:`在 Java 中，变量需要先声明类型再使用。

请在 main 方法中声明一个 int 类型的变量 x，并赋值为 10。`,hint:"int x = 10;",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int x = 10;
    }
}`,expectedOutput:"",validation:{type:"contains",value:"int x = 10"},encouragement:"变量声明成功！"},{id:"java-vars-2",type:"coding",title:"输出变量的值",concept:"variables",difficulty:"beginner",instruction:`声明变量后，可以用 System.out.println() 输出变量的值。

注意输出变量时不要加引号。`,hint:"System.out.println(x);",starter:`public class Main {
    public static void main(String[] args) {
        int x = 10;
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int x = 10;
        System.out.println(x);
    }
}`,expectedOutput:"10",validation:{type:"contains",value:"System.out.println(x)"},encouragement:"输出变量成功！"},{id:"java-vars-3",type:"coding",title:"变量的重新赋值",concept:"variables",difficulty:"beginner",instruction:`变量的值可以被修改。

对变量重新赋值不需要再写类型名。先将 x 赋值为 10，再改成 20，然后输出 x。`,hint:"x = 20; 前面不需要写 int",starter:`public class Main {
    public static void main(String[] args) {
        int x = 10;
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int x = 10;
        x = 20;
        System.out.println(x);
    }
}`,expectedOutput:"20",validation:{type:"contains",value:"x = 20"},encouragement:"重新赋值成功！变量是可以变的！"},{id:"java-vars-4",type:"coding",title:"声明多个变量",concept:"variables",difficulty:"beginner",instruction:`可以在同一行声明多个同类型的变量，用逗号分隔。

请声明三个 int 变量 a、b、c，分别赋值为 1、2、3，然后输出它们的和。`,hint:"int a = 1, b = 2, c = 3;",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int a = 1, b = 2, c = 3;
        System.out.println(a + b + c);
    }
}`,expectedOutput:"6",validation:{type:"contains",value:"int a = 1, b = 2, c = 3"},encouragement:"多变量声明，代码更简洁！"},{id:"java-vars-5",type:"coding",title:"认识 double 类型",concept:"data types",difficulty:"beginner",instruction:`double 类型用于存储小数（浮点数）。

请声明一个 double 变量 price，赋值为 9.99，然后输出它。`,hint:"double price = 9.99;",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        double price = 9.99;
        System.out.println(price);
    }
}`,expectedOutput:"9.99",validation:{type:"contains",value:"double price = 9.99"},encouragement:"小数要用 double 类型！"},{id:"java-vars-6",type:"coding",title:"认识 String 类型",concept:"data types",difficulty:"beginner",instruction:`String 用于存储文本（字符串）。

注意 String 的首字母是大写的 S。请声明一个 String 变量 name，赋值为 "Java"，然后输出。`,hint:'String name = "Java"; 注意字符串用双引号',starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        String name = "Java";
        System.out.println(name);
    }
}`,expectedOutput:"Java",validation:{type:"contains",value:'String name = "Java"'},encouragement:"String 的 S 是大写的！"},{id:"java-vars-7",type:"coding",title:"认识 boolean 类型",concept:"data types",difficulty:"beginner",instruction:`boolean 类型只有两个值：true 和 false。

请声明一个 boolean 变量 isFun，赋值为 true，然后输出它。`,hint:"boolean isFun = true;",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        boolean isFun = true;
        System.out.println(isFun);
    }
}`,expectedOutput:"true",validation:{type:"contains",value:"boolean isFun = true"},encouragement:"boolean 只有 true 和 false 两个值！"},{id:"java-vars-8",type:"coding",title:"字符串拼接",concept:"operators",difficulty:"beginner",instruction:`在 Java 中，用 + 可以拼接字符串。

请声明 String 变量 firstName 和 lastName，然后用 + 拼接并输出全名。`,hint:"System.out.println(firstName + lastName);",starter:`public class Main {
    public static void main(String[] args) {
        String firstName = "Code";
        String lastName = "Step";
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        String firstName = "Code";
        String lastName = "Step";
        System.out.println(firstName + lastName);
    }
}`,expectedOutput:"CodeStep",validation:{type:"contains",value:"System.out.println(firstName + lastName)"},encouragement:"字符串拼接，用 + 就行了！"},{id:"java-vars-9",type:"coding",title:"算术运算符",concept:"operators",difficulty:"beginner",instruction:`Java 支持基本的算术运算符：+ - * / 

请声明两个 int 变量 a=10, b=3，然后输出 a + b、a - b、a * b 和 a / b 的结果。`,hint:"除法 / 对于整数会舍去小数部分",starter:`public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;
        System.out.println(a + b);
        System.out.println(a - b);
        System.out.println(a * b);
        System.out.println(a / b);
    }
}`,expectedOutput:`13
7
30
3`,validation:{type:"contains",value:"System.out.println(a / b)"},encouragement:"整数除法会舍去小数部分！"},{id:"java-vars-10",type:"coding",title:"综合练习：个人名片",concept:"综合",difficulty:"beginner",instruction:"综合练习：请用变量存储你的姓名（String）、年龄（int），然后输出一句完整的自我介绍。",hint:"用 + 拼接字符串和变量",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        String name = "小明";
        int age = 20;
        System.out.println("我叫" + name + "，今年" + age + "岁");
    }
}`,expectedOutput:"我叫小明，今年20岁",validation:{type:"contains",value:"String name"},encouragement:"变量拼接字符串，你掌握得很棒！"}]},"java-if-for":{id:"java-if-for",title:"条件与循环",description:"使用 if/else 和循环控制程序流程",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["if/else","for 循环","while 循环","break","continue"],estimatedMinutes:25,steps:[{id:"java-if-for-1",type:"typing",title:"记住 if 的写法",concept:"条件判断",difficulty:"intermediate",instruction:`if 语句用于条件判断。

请照着敲一遍，记住这个固定格式！小括号里放条件，大括号里放要执行的代码。`,hint:"条件后面有括号，代码块前后有大括号",targetCode:`public class Main {
    public static void main(String[] args) {
        if (条件) {
            // condition为 true 时执行
        }
    }
}`,encouragement:"记住 if 的格式，以后会经常用到！"},{id:"java-if-for-2",type:"coding",title:"第一个 if 语句",concept:"条件判断",difficulty:"intermediate",instruction:'声明一个 int 变量 age = 18，然后用 if 判断：如果 age >= 18，就输出 "成年人"。',hint:'if (age >= 18) { System.out.println("成年人"); }',starter:`public class Main {
    public static void main(String[] args) {
        int age = 18;
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int age = 18;
        if (age >= 18) {
            System.out.println("Adult");
        }
    }
}`,expectedOutput:"Adult",validation:{type:"contains",value:"if (age >= 18)"},encouragement:"条件判断成功了！"},{id:"java-if-for-3",type:"coding",title:"if-else 结构",concept:"条件判断",difficulty:"intermediate",instruction:`if-else 表示「如果...否则...」。

声明 int score = 75，如果 score >= 60 输出 "及格"，否则输出 "不及格"。`,hint:"else 后面不需要再写条件",starter:`public class Main {
    public static void main(String[] args) {
        int score = 75;
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int score = 75;
        if (score >= 60) {
            System.out.println("Pass");
        } else {
            System.out.println("Fail");
        }
    }
}`,expectedOutput:"及格",validation:{type:"contains",value:"else"},encouragement:"if-else 两分支，你掌握了！"},{id:"java-if-for-4",type:"typing",title:"else-if 链",concept:"条件判断",difficulty:"intermediate",instruction:`多个条件用 else if 连接，从上到下依次判断。

照着敲，感受这个结构。`,hint:"最后一个 else 是不满足所有条件时执行的",targetCode:`public class Main {
    public static void main(String[] args) {
        int score = 85;
        if (score >= 90) {
            System.out.println("Excellent");
        } else if (score >= 80) {
            System.out.println("Good");
        } else if (score >= 60) {
            System.out.println("Pass");
        } else {
            System.out.println("Fail");
        }
    }
}`,encouragement:"多分支条件判断，代码更清晰！"},{id:"java-if-for-5",type:"coding",title:"嵌套 if",concept:"条件判断",difficulty:"intermediate",instruction:`if 里面还可以再写 if。

声明 int age = 20, boolean hasTicket = true。如果 age >= 18 且 hasTicket 为 true，输出 "允许入场"。`,hint:'用 && 表示"且"',starter:`public class Main {
    public static void main(String[] args) {
        int age = 20;
        boolean hasTicket = true;
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int age = 20;
        boolean hasTicket = true;
        if (age >= 18 && hasTicket) {
            System.out.println("允许入场");
        }
    }
}`,expectedOutput:"允许入场",validation:{type:"contains",value:"&&"},encouragement:"逻辑与 && ，两个条件都要满足！"},{id:"java-if-for-6",type:"typing",title:"for 循环的固定格式",concept:"循环",difficulty:"intermediate",instruction:`for 循环用于重复执行代码。

请照着敲，这是 Java 中最常用的循环格式！三部分：用分号分隔。`,hint:"初始化只执行一次，条件每次判断，增量每次执行完执行",targetCode:`public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
        }
    }
}`,encouragement:"for 循环三要素：初始化、条件、增量！"},{id:"java-if-for-7",type:"coding",title:"用 for 打印数字",concept:"循环",difficulty:"intermediate",instruction:`用 for 循环输出 1 到 5。

注意：输出的是数字，不是字符串。`,hint:"从 1 开始，i <= 5",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}`,expectedOutput:`1
2
3
4
5`,validation:{type:"contains",value:"for (int i = 1; i <= 5; i++)"},encouragement:"循环打印数字，自动化操作！"},{id:"java-if-for-8",type:"coding",title:"for 循环的三个表达式",concept:"循环",difficulty:"intermediate",instruction:`for 循环括号里有三部分：初始化、条件和增量。

请用 for 循环输出 0、2、4、6、8（偶数）。`,hint:"i += 2 每次加 2",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        for (int i = 0; i <= 8; i += 2) {
            System.out.println(i);
        }
    }
}`,expectedOutput:`0
2
4
6
8`,validation:{type:"contains",value:"i += 2"},encouragement:"i += 2 是 i = i + 2 的简写！"},{id:"java-if-for-9",type:"typing",title:"while loop",concept:"循环",difficulty:"intermediate",instruction:`while 循环在条件满足时重复执行。

照着敲，感受与 for 循环的区别。`,hint:"while 先判断条件，为 true 时执行循环体",targetCode:`public class Main {
    public static void main(String[] args) {
        int i = 0;
        while (i < 3) {
            System.out.println(i);
            i++;
        }
    }
}`,encouragement:"while 循环，条件驱动！"},{id:"java-if-for-10",type:"coding",title:"while vs for",concept:"循环",difficulty:"intermediate",instruction:`for 循环适合已知循环次数的场景，while 循环适合条件驱动。

用 while 循环输出 5、4、3、2、1、0（倒计时）。`,hint:"先定义 i = 5，条件 i >= 0，每次 i--",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int i = 5;
        while (i >= 0) {
            System.out.println(i);
            i--;
        }
    }
}`,expectedOutput:`5
4
3
2
1
0`,validation:{type:"contains",value:"while"},encouragement:"倒计时完成！while 循环也很强大！"},{id:"java-if-for-11",type:"coding",title:"break 和 continue",concept:"循环控制",difficulty:"intermediate",instruction:`break 跳出整个循环，continue 跳过本次循环。

用 for 循环输出 1-10，但跳过 5，用 break 在 i > 8 时停止。`,hint:"continue 跳过本次，break 跳出循环",starter:`public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            
        }
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            if (i == 5) {
                continue;
            }
            if (i > 8) {
                break;
            }
            System.out.println(i);
        }
    }
}`,expectedOutput:`1
2
3
4
6
7
8`,validation:{type:"contains",value:"continue"},encouragement:"break 和 continue 控制循环的利器！"},{id:"java-if-for-12",type:"typing",title:"综合练习",concept:"综合",difficulty:"intermediate",instruction:`综合练习：照着敲完这个程序。

使用 for 循环和 if-else，输出 1-10 中所有奇数的和。`,hint:"奇数就是 i % 2 == 1",targetCode:`public class Main {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            if (i % 2 == 1) {
                sum = sum + i;
            }
        }
        System.out.println(sum);
    }
}`,expectedOutput:"25",encouragement:"综合练习完成！条件、循环都掌握了！"}]},"java-method":{id:"java-method",title:"方法与函数",description:"学习方法的定义、参数、返回值和方法重载",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["方法定义","参数","返回值","方法重载","递归"],estimatedMinutes:20,steps:[{id:"java-method-1",type:"typing",title:"方法的固定格式",concept:"方法基础",difficulty:"intermediate",instruction:`方法是将代码封装起来反复使用的机制。

请照着敲，记住方法的固定格式！`,hint:"public static void 方法名() { }",targetCode:`public class Main {
    public static void sayHello() {
        System.out.println("Hello!");
    }

    public static void main(String[] args) {
        
    }
}`,encouragement:"方法定义成功！"},{id:"java-method-2",type:"coding",title:"定义并调用方法",concept:"方法基础",difficulty:"intermediate",instruction:`定义一个 sayHello 方法，然后在 main 中调用它。

方法定义后，用 方法名() 来调用。`,hint:"sayHello(); 在 main 方法中调用",starter:`public class Main {
    public static void sayHello() {
        System.out.println("Hello!");
    }

    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void sayHello() {
        System.out.println("Hello!");
    }

    public static void main(String[] args) {
        sayHello();
    }
}`,expectedOutput:"Hello!",validation:{type:"contains",value:"sayHello();"},encouragement:"方法调用成功！代码复用开始了！"},{id:"java-method-3",type:"typing",title:"方法的参数",concept:"方法参数",difficulty:"intermediate",instruction:`方法可以接收参数，在调用时传入具体值。

照着敲，感受参数的使用。`,hint:"参数写在方法名后面的小括号里",targetCode:`public class Main {
    public static void greet(String name) {
        System.out.println("你好，" + name + "！");
    }

    public static void main(String[] args) {
        greet("小明");
    }
}`,encouragement:"方法带参数，功能更强大！"},{id:"java-method-4",type:"coding",title:"方法参数练习",concept:"方法参数",difficulty:"intermediate",instruction:`定义一个 printMax 方法，接收两个 int 参数 a 和 b，输出较大的那个数。

然后在 main 中调用 printMax(10, 20)。`,hint:"用 Math.max(a, b) 或 if 比较",starter:`public class Main {
    public static void printMax(int a, int b) {
        
    }

    public static void main(String[] args) {
        printMax(10, 20);
    }
}`,answer:`public class Main {
    public static void printMax(int a, int b) {
        if (a > b) {
            System.out.println(a);
        } else {
            System.out.println(b);
        }
    }

    public static void main(String[] args) {
        printMax(10, 20);
    }
}`,expectedOutput:"20",validation:{type:"contains",value:"printMax(int a, int b)"},encouragement:"方法参数掌握得很好！"},{id:"java-method-5",type:"typing",title:"方法的返回值",concept:"方法返回值",difficulty:"intermediate",instruction:`方法可以返回值，使用 return 语句。

照着敲，注意返回类型和 return 的配合。`,hint:"void 表示无返回值，int 表示返回整数",targetCode:`public class Main {
    public static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int result = add(3, 5);
        System.out.println(result);
    }
}`,encouragement:"return 返回值，方法变成计算器！"},{id:"java-method-6",type:"coding",title:"返回值练习",concept:"方法返回值",difficulty:"intermediate",instruction:`定义一个方法 isEven，判断一个整数是否是偶数，返回 boolean。

在 main 中调用它，输出 result。`,hint:"偶数就是 n % 2 == 0",starter:`public class Main {
    public static boolean isEven(int n) {
        
    }

    public static void main(String[] args) {
        boolean result = isEven(7);
        System.out.println(result);
    }
}`,answer:`public class Main {
    public static boolean isEven(int n) {
        return n % 2 == 0;
    }

    public static void main(String[] args) {
        boolean result = isEven(7);
        System.out.println(result);
    }
}`,expectedOutput:"false",validation:{type:"contains",value:"return n % 2 == 0"},encouragement:"布尔返回值，用 return 直接返回比较结果！"},{id:"java-method-7",type:"typing",title:"overloading",concept:"overloading",difficulty:"intermediate",instruction:`方法重载：同一个方法名，参数不同（个数或类型）。

照着敲，感受方法重载的用法。`,hint:"编译器根据参数自动选择调用哪个方法",targetCode:`public class Main {
    public static int add(int a, int b) {
        return a + b;
    }

    public static double add(double a, double b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(add(1, 2));
        System.out.println(add(1.5, 2.5));
    }
}`,encouragement:"方法重载，同名不同参！"},{id:"java-method-8",type:"coding",title:"方法递归",concept:"方法递归",difficulty:"intermediate",instruction:`递归：方法调用自己。使用递归计算阶乘 5! = 5×4×3×2×1。

递归需要终止条件。`,hint:"factorial(5) = 5 * factorial(4)，终止条件是 n <= 1",starter:`public class Main {
    public static int factorial(int n) {
        
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,answer:`public class Main {
    public static int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,expectedOutput:"120",validation:{type:"contains",value:"return n * factorial(n - 1)"},encouragement:"递归，掌握了！"},{id:"java-method-9",type:"coding",title:"局部变量的作用域",concept:"作用域",difficulty:"intermediate",instruction:`方法内部定义的变量是局部变量，只能在方法内部使用。

定义两个方法，各有自己的局部变量。`,hint:"方法 a 的变量不能在方法 b 中使用",starter:`public class Main {
    public static void methodA() {
        
    }

    public static void methodB() {
        
    }

    public static void main(String[] args) {
        methodA();
        methodB();
    }
}`,answer:`public class Main {
    public static void methodA() {
        int x = 10;
        System.out.println(x);
    }

    public static void methodB() {
        int y = 20;
        System.out.println(y);
    }

    public static void main(String[] args) {
        methodA();
        methodB();
    }
}`,expectedOutput:`10
20`,validation:{type:"contains",value:"int x = 10"},encouragement:"作用域隔离，代码更安全！"},{id:"java-method-10",type:"coding",title:"综合练习",concept:"综合",difficulty:"intermediate",instruction:`综合练习：创建一个工具类，包含：
1. isPrime(int n) - 判断是否是质数
2. 在 main 中输出 1-20 中所有质数的和`,hint:"质数：只能被 1 和自身整除",starter:`public class Main {
    public static boolean isPrime(int n) {
        
    }

    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static boolean isPrime(int n) {
        if (n <= 1) {
            return false;
        }
        for (int i = 2; i < n; i++) {
            if (n % i == 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 20; i++) {
            if (isPrime(i)) {
                sum += i;
            }
        }
        System.out.println(sum);
    }
}`,expectedOutput:"77",validation:{type:"contains",value:"isPrime"},encouragement:"方法综合运用，你已经掌握了 Java 方法！"}]},"java-array":{id:"java-array",title:"数组基础",description:"掌握 Java 数组的声明、初始化和使用",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["数组声明","数组初始化","数组遍历","数组应用"],estimatedMinutes:15,steps:[{id:"java-array-1",type:"typing",title:"数组的声明",concept:"Arrays",difficulty:"intermediate",instruction:`数组用于存储多个同类型的值。

请照着敲，记住数组的声明格式！`,hint:"int[] 表示 int 类型的数组",targetCode:`public class Main {
    public static void main(String[] args) {
        // declare一个 int 数组
        int[] numbers;
        // 创建数组，指定长度
        numbers = new int[5];
        System.out.println(numbers.length);
    }
}`,encouragement:"数组声明成功！"},{id:"java-array-2",type:"coding",title:"数组的静态初始化",concept:"Arrays",difficulty:"intermediate",instruction:`声明数组时直接赋值，叫做静态初始化。

声明 int[] scores = {90, 85, 77}; 然后输出 scores 的长度。`,hint:"用大括号 {} 包裹多个值",starter:`public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int[] scores = {90, 85, 77};
        System.out.println(scores.length);
    }
}`,expectedOutput:"3",validation:{type:"contains",value:"int[] scores = {90, 85, 77}"},encouragement:"静态初始化，一步到位！"},{id:"java-array-3",type:"coding",title:"访问数组元素",concept:"Arrays",difficulty:"intermediate",instruction:`数组元素通过下标访问，下标从 0 开始。

声明 int[] arr = {10, 20, 30, 40, 50}; 然后输出第一个和第三个元素。`,hint:"arr[0] 是第一个，arr[2] 是第三个",starter:`public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        System.out.println(arr[0]);
        System.out.println(arr[2]);
    }
}`,expectedOutput:`10
30`,validation:{type:"contains",value:"arr[0]"},encouragement:"下标从 0 开始！"},{id:"java-array-4",type:"coding",title:"修改数组元素",concept:"Arrays",difficulty:"intermediate",instruction:`数组元素可以被修改。

声明 int[] arr = {1, 2, 3}，把第一个元素改为 100，然后输出整个数组（用循环）。`,hint:"用 arr[0] = 100 修改",starter:`public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        arr[0] = 100;
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}`,expectedOutput:`100
2
3`,validation:{type:"contains",value:"arr[0] = 100"},encouragement:"数组元素可以修改！"},{id:"java-array-5",type:"typing",title:"用循环遍历数组",concept:"array iteration",difficulty:"intermediate",instruction:`常用 for 循环遍历数组。

照着敲，感受遍历数组的标准写法。`,hint:"i 从 0 到 arr.length-1",targetCode:`public class Main {
    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 1, 9};
        for (int i = 0; i < arr.length; i++) {
            System.out.println("第" + i + "个元素: " + arr[i]);
        }
    }
}`,encouragement:"循环遍历数组，基本功！"},{id:"java-array-6",type:"coding",title:"增强 for 循环",concept:"array iteration",difficulty:"intermediate",instruction:`Java 5 引入了增强 for 循环（for-each），更简洁。

语法：for (类型 变量 : 数组) { }

用增强 for 循环输出 arr = {1, 2, 3, 4, 5} 的所有元素。`,hint:"for (int num : arr) { System.out.println(num); }",starter:`public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        for (int num : arr) {
            System.out.println(num);
        }
    }
}`,expectedOutput:`1
2
3
4
5`,validation:{type:"contains",value:"for (int num : arr)"},encouragement:"for-each 循环，简洁优雅！"},{id:"java-array-7",type:"coding",title:"数组求和与平均值",concept:"array applications",difficulty:"intermediate",instruction:`用数组存储成绩，计算总分和平均值。

int[] scores = {85, 92, 78, 95, 88}; 计算总分并输出。`,hint:"用循环累加所有元素",starter:`public class Main {
    public static void main(String[] args) {
        int[] scores = {85, 92, 78, 95, 88};
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int[] scores = {85, 92, 78, 95, 88};
        int sum = 0;
        for (int i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        System.out.println(sum);
    }
}`,expectedOutput:"438",validation:{type:"contains",value:"sum += scores[i]"},encouragement:"数组求和完成！"},{id:"java-array-8",type:"coding",title:"综合练习",concept:"综合",difficulty:"intermediate",instruction:`综合练习：找出数组中的最大值和最小值。

int[] nums = {23, 45, 12, 67, 34, 89, 11}; 输出最大值和最小值。`,hint:"设 max = nums[0]，遍历比较",starter:`public class Main {
    public static void main(String[] args) {
        int[] nums = {23, 45, 12, 67, 34, 89, 11};
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int[] nums = {23, 45, 12, 67, 34, 89, 11};
        int max = nums[0];
        int min = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > max) {
                max = nums[i];
            }
            if (nums[i] < min) {
                min = nums[i];
            }
        }
        System.out.println(max);
        System.out.println(min);
    }
}`,expectedOutput:`89
11`,validation:{type:"contains",value:"if (nums[i] > max)"},encouragement:"数组极值查找，掌握了！"}]},"java-oop":{id:"java-oop",title:"面向对象编程",description:"掌握类、对象、封装、继承和多态",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["类与对象","封装","构造方法","继承","多态","static","final"],estimatedMinutes:40,steps:[{id:"java-oop-1",type:"typing",title:"类的定义",concept:"class and object",difficulty:"intermediate",instruction:`类是对一类事物的抽象描述，是创建对象的模板。

请照着敲，感受类的定义格式。`,hint:"类名通常首字母大写",targetCode:`// define一个学生类
class Student {
    String name;
    int age;
}

public class Main {
    public static void main(String[] args) {
        
    }
}`,encouragement:"类定义成功！"},{id:"java-oop-2",type:"coding",title:"创建对象",concept:"class and object",difficulty:"intermediate",instruction:`类是模板，用 new 关键字创建对象。

定义 Student 类，然后用 new 创建两个学生对象 s1 和 s2。`,hint:"Student s1 = new Student();",starter:`class Student {
    String name;
    int age;
}

public class Main {
    public static void main(String[] args) {
        
    }
}`,answer:`class Student {
    String name;
    int age;
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();
        Student s2 = new Student();
    }
}`,expectedOutput:"",validation:{type:"contains",value:"new Student()"},encouragement:"对象创建成功！"},{id:"java-oop-3",type:"coding",title:"访问对象的属性和方法",concept:"class and object",difficulty:"intermediate",instruction:`用 对象.属性 和 对象.方法() 访问成员。

创建 Student 对象，给 name 和 age 赋值，然后输出。`,hint:'s1.name = "小明"; s1.age = 18;',starter:`class Student {
    String name;
    int age;
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();
        
    }
}`,answer:`class Student {
    String name;
    int age;
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.name = "小明";
        s1.age = 18;
        System.out.println(s1.name);
        System.out.println(s1.age);
    }
}`,expectedOutput:`小明
18`,validation:{type:"contains",value:"s1.name"},encouragement:"对象属性访问成功！"},{id:"java-oop-4",type:"coding",title:"封装：private 修饰符",concept:"encapsulation",difficulty:"intermediate",instruction:`private 修饰的成员只能在类内部访问，起到保护作用。

把 Student 的 name 和 age 设为 private，外部不能直接访问。`,hint:"private String name; private int age;",starter:`class Student {
    String name;
    int age;
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.name = "小明";
        s.age = 18;
    }
}`,answer:`class Student {
    private String name;
    private int age;
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        // name 和 age 是 private，不能直接访问
    }
}`,expectedOutput:"",validation:{type:"contains",value:"private String name"},encouragement:"private 保护数据！"},{id:"java-oop-5",type:"coding",title:"封装：getter 和 setter",concept:"encapsulation",difficulty:"intermediate",instruction:`private 属性通过 public 的 getter/setter 方法访问。

在 Student 类中添加 getName()、setName()、getAge()、setAge() 方法。`,hint:"public String getName() { return name; }",starter:`class Student {
    private String name;
    private int age;
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.setName("小明");
        s.setAge(18);
        System.out.println(s.getName());
    }
}`,answer:`class Student {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        s.setName("小明");
        s.setAge(18);
        System.out.println(s.getName());
    }
}`,expectedOutput:"小明",validation:{type:"contains",value:"public String getName()"},encouragement:"getter/setter，封装的基本功！"},{id:"java-oop-6",type:"typing",title:"constructor",concept:"constructor",difficulty:"intermediate",instruction:`构造方法在创建对象时自动调用，用于初始化。

请照着敲，感受构造方法的使用。`,hint:"构造方法名必须与类名相同",targetCode:`class Student {
    private String name;
    private int age;

    // constructor方法
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getInfo() {
        return name + ", " + age;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("小明", 18);
        System.out.println(s.getInfo());
    }
}`,encouragement:"构造方法，创建对象时自动调用！"},{id:"java-oop-7",type:"coding",title:"默认构造方法",concept:"constructor",difficulty:"intermediate",instruction:`如果没写构造方法，Java 会提供默认的无参构造方法。

定义一个无参构造方法，给 name 赋默认值 "未知"。`,hint:'public Student() { this.name = "未知"; }',starter:`class Student {
    private String name;
    private int age;

    public Student() {
        
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        System.out.println(s.getName());
    }
}`,answer:`class Student {
    private String name;
    private int age;

    public Student() {
        this.name = "未知";
    }

    public String getName() {
        return name;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        System.out.println(s.getName());
    }
}`,expectedOutput:"未知",validation:{type:"contains",value:"public Student()"},encouragement:"无参构造方法，给属性默认值！"},{id:"java-oop-8",type:"coding",title:"this 关键字",concept:"this 关键字",difficulty:"intermediate",instruction:`this 指向当前对象，用于区分成员变量和局部变量。

定义一个带参构造方法，用 this 区分同名的成员变量和参数。`,hint:"this.name = name; 用 this 指向成员变量",starter:`class Student {
    private String name;
    private int age;

    public Student(String name, int age) {
        
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("小明", 18);
        System.out.println(s.getName());
    }
}`,answer:`class Student {
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("小明", 18);
        System.out.println(s.getName());
    }
}`,expectedOutput:"小明",validation:{type:"contains",value:"this.name = name"},encouragement:"this 指向当前对象，区分同名变量！"},{id:"java-oop-9",type:"coding",title:"继承：基本语法",concept:"inheritance",difficulty:"intermediate",instruction:`继承用 extends 关键字，子类继承父类。

定义 Animal 类（父类），然后定义继承它的 Dog 类（子类）。`,hint:"class Dog extends Animal { }",starter:`class Animal {
    String name = "动物";
}

class Dog extends Animal {
    
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        System.out.println(d.name);
    }
}`,answer:`class Animal {
    String name = "动物";
}

class Dog extends Animal {
    
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        System.out.println(d.name);
    }
}`,expectedOutput:"动物",validation:{type:"contains",value:"extends Animal"},encouragement:"继承，子类拥有父类的属性！"},{id:"java-oop-10",type:"coding",title:"子类添加独有方法",concept:"inheritance",difficulty:"intermediate",instruction:`子类可以添加自己独有的属性和方法。

Dog 类添加 bark() 方法，输出 "汪汪汪"。`,hint:'public void bark() { System.out.println("汪汪汪"); }',starter:`class Animal {
    String name = "动物";
}

class Dog extends Animal {
    
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.bark();
    }
}`,answer:`class Animal {
    String name = "动物";
}

class Dog extends Animal {
    public void bark() {
        System.out.println("汪汪汪");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.bark();
    }
}`,expectedOutput:"汪汪汪",validation:{type:"contains",value:"public void bark()"},encouragement:"子类添加自己的方法！"},{id:"java-oop-11",type:"coding",title:"super 关键字",concept:"super 关键字",difficulty:"intermediate",instruction:`super 用于调用父类的构造方法或成员。

子类构造方法中用 super(name) 调用父类构造方法。`,hint:"super(name); 在子类构造方法第一行调用父类构造",starter:`class Animal {
    private String name;
    public Animal(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
}

class Dog extends Animal {
    public Dog(String name) {
        
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog("旺财");
        System.out.println(d.getName());
    }
}`,answer:`class Animal {
    private String name;
    public Animal(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
}

class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog("旺财");
        System.out.println(d.getName());
    }
}`,expectedOutput:"旺财",validation:{type:"contains",value:"super(name)"},encouragement:"super 调用父类构造方法！"},{id:"java-oop-12",type:"coding",title:"方法重写 @Override",concept:"方法重写",difficulty:"intermediate",instruction:`子类可以重写父类的方法。

在 Dog 类中重写 eat() 方法，输出 "狗吃骨头"。`,hint:"@Override 表示这是重写的方法",starter:`class Animal {
    public void eat() {
        System.out.println("吃东西");
    }
}

class Dog extends Animal {
    
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.eat();
    }
}`,answer:`class Animal {
    public void eat() {
        System.out.println("吃东西");
    }
}

class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println("狗吃骨头");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.eat();
    }
}`,expectedOutput:"狗吃骨头",validation:{type:"contains",value:"@Override"},encouragement:"方法重写，子类拥有自己的实现！"},{id:"java-oop-13",type:"typing",title:"polymorphism",concept:"polymorphism",difficulty:"intermediate",instruction:`多态：父类引用指向子类对象。

照着敲，感受多态的魅力。`,hint:"Animal 是父类，Dog 是子类，可以 Animal d = new Dog();",targetCode:`class Animal {
    public void sound() {
        System.out.println("...");
    }
}

class Dog extends Animal {
    @Override
    public void sound() {
        System.out.println("汪汪汪");
    }
}

class Cat extends Animal {
    @Override
    public void sound() {
        System.out.println("喵喵喵");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a1 = new Dog();
        Animal a2 = new Cat();
        a1.sound();
        a2.sound();
    }
}`,encouragement:"多态，同一个调用，不同的执行！"},{id:"java-oop-14",type:"coding",title:"static 关键字",concept:"static 关键字",difficulty:"intermediate",instruction:`static 修饰的成员属于类，不属于对象，所有对象共享。

定义 static 变量 count，统计创建了多少个 Student 对象。`,hint:"static int count = 0; 在构造方法中 count++",starter:`class Student {
    private String name;
    private static int count = 0;

    public Student(String name) {
        
    }

    public static int getCount() {
        return count;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("小明");
        Student s2 = new Student("小红");
        System.out.println(Student.getCount());
    }
}`,answer:`class Student {
    private String name;
    private static int count = 0;

    public Student(String name) {
        this.name = name;
        count++;
    }

    public static int getCount() {
        return count;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("小明");
        Student s2 = new Student("小红");
        System.out.println(Student.getCount());
    }
}`,expectedOutput:"2",validation:{type:"contains",value:"static int count"},encouragement:"static 变量，所有对象共享！"},{id:"java-oop-15",type:"coding",title:"final 关键字",concept:"final 关键字",difficulty:"intermediate",instruction:`final 修饰的变量是常量，不能被修改；修饰的方法不能被重写；修饰的类不能被继承。

定义 final 常量 PI = 3.14159。`,hint:"final double PI = 3.14159;",starter:`class MathUtils {
    
}

public class Main {
    public static void main(String[] args) {
        System.out.println(MathUtils.PI);
    }
}`,answer:`class MathUtils {
    public static final double PI = 3.14159;
}

public class Main {
    public static void main(String[] args) {
        System.out.println(MathUtils.PI);
    }
}`,expectedOutput:"3.14159",validation:{type:"contains",value:"final double PI"},encouragement:"final 常量，不可改变！"}]},"java-collection":{id:"java-collection",title:"集合框架",description:"掌握 ArrayList、HashMap、HashSet 等常用集合",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["ArrayList","HashMap","HashSet","集合遍历","集合排序"],estimatedMinutes:30,steps:[{id:"java-collection-1",type:"typing",title:"ArrayList 的创建",concept:"Collections Framework",difficulty:"intermediate",instruction:`ArrayList 是动态数组，可以自动扩容。

请照着敲，感受 ArrayList 的创建方式。`,hint:"ArrayList 需要 import java.util.ArrayList;",targetCode:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // 创建 ArrayList，泛型指定元素类型
        ArrayList<String> list = new ArrayList<>();
        System.out.println(list.size());
    }
}`,encouragement:"ArrayList 动态数组！"},{id:"java-collection-2",type:"coding",title:"添加元素",concept:"ArrayList",difficulty:"intermediate",instruction:`使用 add() 方法添加元素到列表末尾。

创建 ArrayList<String>，添加 "苹果"、"香蕉"、"橙子" 三个水果。`,hint:'list.add("苹果");',starter:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        
    }
}`,answer:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("苹果");
        list.add("香蕉");
        list.add("橙子");
        System.out.println(list.size());
    }
}`,expectedOutput:"3",validation:{type:"contains",value:'list.add("苹果")'},encouragement:"add() 添加元素成功！"},{id:"java-collection-3",type:"coding",title:"访问和修改元素",concept:"ArrayList",difficulty:"intermediate",instruction:`用 get(index) 获取元素，用 set(index, value) 修改元素。

获取第一个水果，然后把第二个水果改成 "葡萄"。`,hint:'list.set(1, "葡萄"); 修改指定位置的元素',starter:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("苹果");
        list.add("香蕉");
        list.add("橙子");
        
    }
}`,answer:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("苹果");
        list.add("香蕉");
        list.add("橙子");
        System.out.println(list.get(0));
        list.set(1, "葡萄");
        System.out.println(list.get(1));
    }
}`,expectedOutput:`苹果
葡萄`,validation:{type:"contains",value:'list.set(1, "葡萄")'},encouragement:"get 和 set，访问和修改！"},{id:"java-collection-4",type:"coding",title:"遍历 ArrayList",concept:"ArrayList",difficulty:"intermediate",instruction:`用 for 循环或增强 for 循环遍历 ArrayList。

用增强 for 循环输出所有水果。`,hint:"for (String fruit : list) { System.out.println(fruit); }",starter:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("苹果");
        list.add("香蕉");
        list.add("橙子");
        
    }
}`,answer:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("苹果");
        list.add("香蕉");
        list.add("橙子");
        for (String fruit : list) {
            System.out.println(fruit);
        }
    }
}`,expectedOutput:`苹果
香蕉
橙子`,validation:{type:"contains",value:"for (String fruit : list)"},encouragement:"增强 for 循环遍历列表！"},{id:"java-collection-5",type:"coding",title:"删除元素",concept:"ArrayList",difficulty:"intermediate",instruction:`用 remove(index) 按位置删除，或 remove(Object) 按内容删除。

添加水果，然后删除第一个水果。`,hint:"list.remove(0); 删除第一个元素",starter:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("苹果");
        list.add("香蕉");
        list.add("橙子");
        
    }
}`,answer:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("苹果");
        list.add("香蕉");
        list.add("橙子");
        list.remove(0);
        System.out.println(list.get(0));
    }
}`,expectedOutput:"香蕉",validation:{type:"contains",value:"list.remove(0)"},encouragement:"remove() 删除元素！"},{id:"java-collection-6",type:"typing",title:"HashMap 的创建",concept:"HashMap",difficulty:"intermediate",instruction:`HashMap 存储键值对（key-value）。

照着敲，感受 HashMap 的创建方式。`,hint:"HashMap 需要 import java.util.HashMap;",targetCode:`import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scores = new HashMap<>();
        scores.put("语文", 85);
        scores.put("数学", 92);
        scores.put("英语", 78);
        System.out.println(scores.size());
    }
}`,encouragement:"HashMap 键值对存储！"},{id:"java-collection-7",type:"coding",title:"HashMap 增删改查",concept:"HashMap",difficulty:"intermediate",instruction:`put() 添加/修改，get() 获取，remove() 删除。

创建 HashMap，添加水果价格，修改苹果的价格，然后获取香蕉的价格。`,hint:'scores.put("苹果", 5); scores.get("苹果");',starter:`import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> prices = new HashMap<>();
        
    }
}`,answer:`import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> prices = new HashMap<>();
        prices.put("苹果", 5);
        prices.put("香蕉", 3);
        prices.put("橙子", 4);
        prices.put("苹果", 6);
        System.out.println(prices.get("香蕉"));
    }
}`,expectedOutput:"3",validation:{type:"contains",value:'prices.get("香蕉")'},encouragement:"HashMap 增删改查全能！"},{id:"java-collection-8",type:"typing",title:"遍历 HashMap",concept:"HashMap",difficulty:"intermediate",instruction:`用 keySet() 获取所有键，用 entrySet() 获取键值对。

照着敲，用 entrySet 遍历 HashMap。`,hint:"for (Map.Entry<String, Integer> entry : map.entrySet())",targetCode:`import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scores = new HashMap<>();
        scores.put("语文", 85);
        scores.put("数学", 92);
        scores.put("英语", 78);

        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}`,encouragement:"entrySet 遍历键值对！"},{id:"java-collection-9",type:"coding",title:"HashSet 集合",concept:"HashSet",difficulty:"intermediate",instruction:`HashSet 是无序、不重复的集合。

添加几个名字到 HashSet，包括一个重复的名字，输出集合大小。`,hint:"Set 不允许重复元素",starter:`import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Set<String> names = new HashSet<>();
        
    }
}`,answer:`import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Set<String> names = new HashSet<>();
        names.add("小明");
        names.add("小红");
        names.add("小明");
        names.add("小华");
        System.out.println(names.size());
    }
}`,expectedOutput:"3",validation:{type:"contains",value:"Set<String> names"},encouragement:"HashSet 不重复！"},{id:"java-collection-10",type:"coding",title:"ArrayList 排序",concept:"集合应用",difficulty:"intermediate",instruction:`用 Collections.sort() 对 ArrayList 排序。

创建包含数字的 ArrayList，排序后输出。`,hint:"import java.util.Collections;",starter:`import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(5);
        nums.add(2);
        nums.add(8);
        nums.add(1);
        
    }
}`,answer:`import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(5);
        nums.add(2);
        nums.add(8);
        nums.add(1);
        Collections.sort(nums);
        for (int n : nums) {
            System.out.println(n);
        }
    }
}`,expectedOutput:`1
2
5
8`,validation:{type:"contains",value:"Collections.sort(nums)"},encouragement:"集合排序，Collections 工具类！"},{id:"java-collection-11",type:"coding",title:"查找元素",concept:"集合应用",difficulty:"intermediate",instruction:`ArrayList 用 contains() 查找元素，HashMap 用 containsKey()/containsValue()。

在列表中查找 "数学" 是否存在。`,hint:'list.contains("数学") 返回 boolean',starter:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> subjects = new ArrayList<>();
        subjects.add("语文");
        subjects.add("数学");
        subjects.add("英语");
        
    }
}`,answer:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> subjects = new ArrayList<>();
        subjects.add("语文");
        subjects.add("数学");
        subjects.add("英语");
        boolean found = subjects.contains("数学");
        System.out.println(found);
    }
}`,expectedOutput:"true",validation:{type:"contains",value:'subjects.contains("数学")'},encouragement:"contains() 查找元素！"},{id:"java-collection-12",type:"coding",title:"综合练习",concept:"综合",difficulty:"intermediate",instruction:`综合练习：统计一组分数中及格（>=60）的数量。

ArrayList<Integer> scores = {55, 78, 92, 45, 67, 88}; 统计及格人数并输出。`,hint:"遍历列表，统计 >= 60 的数量",starter:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(55);
        scores.add(78);
        scores.add(92);
        scores.add(45);
        scores.add(67);
        scores.add(88);
        
    }
}`,answer:`import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(55);
        scores.add(78);
        scores.add(92);
        scores.add(45);
        scores.add(67);
        scores.add(88);
        int count = 0;
        for (int score : scores) {
            if (score >= 60) {
                count++;
            }
        }
        System.out.println(count);
    }
}`,expectedOutput:"4",validation:{type:"contains",value:"if (score >= 60)"},encouragement:"集合综合运用，掌握了！"}]},"java-exception":{id:"java-exception",title:"异常处理",description:"掌握 try-catch、throw、throws 等异常处理机制",language:"java",category:"fundamentals",difficulty:"intermediate",concepts:["异常基础","try-catch","finally","throw","throws"],estimatedMinutes:20,steps:[{id:"java-exception-1",type:"typing",title:"认识异常",concept:"exception basics",difficulty:"intermediate",instruction:`异常是程序运行时的错误，会导致程序中断。

照着敲，感受除零异常。`,hint:"ArithmeticException 是算术运算异常",targetCode:`public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 0;
        System.out.println(a / b);
    }
}`,encouragement:"认识异常！"},{id:"java-exception-2",type:"typing",title:"try-catch 捕获异常",concept:"Exception Handling",difficulty:"intermediate",instruction:`用 try-catch 捕获异常，程序不会中断。

照着敲，感受异常捕获。`,hint:"try 尝试执行，catch 捕获异常",targetCode:`public class Main {
    public static void main(String[] args) {
        try {
            int a = 10;
            int b = 0;
            System.out.println(a / b);
        } catch (ArithmeticException e) {
            System.out.println("发生错误：除数不能为0");
        }
    }
}`,encouragement:"异常捕获，程序不崩溃！"},{id:"java-exception-3",type:"coding",title:"练习异常捕获",concept:"Exception Handling",difficulty:"intermediate",instruction:`数组访问越界也是一种异常（ArrayIndexOutOfBoundsException）。

用 try-catch 捕获数组越界异常。`,hint:"catch (ArrayIndexOutOfBoundsException e)",starter:`public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        try {
            System.out.println(arr[5]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("数组下标越界！");
        }
    }
}`,expectedOutput:"数组下标越界！",validation:{type:"contains",value:"catch (ArrayIndexOutOfBoundsException"},encouragement:"数组越界也能捕获！"},{id:"java-exception-4",type:"typing",title:"多个 catch",concept:"Exception Handling",difficulty:"intermediate",instruction:`一个 try 可以有多个 catch，捕获不同类型的异常。

照着敲，注意异常类型的顺序。`,hint:"子异常在前，父异常在后",targetCode:`public class Main {
    public static void main(String[] args) {
        try {
            int[] arr = {1, 2, 3};
            System.out.println(arr[5]);
        } catch (ArithmeticException e) {
            System.out.println("算术异常");
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("数组越界");
        } catch (Exception e) {
            System.out.println("其他异常");
        }
    }
}`,encouragement:"多个 catch，捕获不同异常！"},{id:"java-exception-5",type:"coding",title:"finally 语句块",concept:"Exception Handling",difficulty:"intermediate",instruction:`finally 块无论是否发生异常都会执行，常用于资源释放。

添加 finally，输出 "程序结束"。`,hint:"finally 写在所有 catch 之后",starter:`public class Main {
    public static void main(String[] args) {
        try {
            int a = 10 / 0;
        } catch (Exception e) {
            System.out.println("捕获异常");
        }
    }
}`,answer:`public class Main {
    public static void main(String[] args) {
        try {
            int a = 10 / 0;
        } catch (Exception e) {
            System.out.println("捕获异常");
        } finally {
            System.out.println("程序结束");
        }
    }
}`,expectedOutput:`捕获异常
程序结束`,validation:{type:"contains",value:"finally"},encouragement:"finally 总是执行！"},{id:"java-exception-6",type:"typing",title:"抛出异常 throw",concept:"Exception Handling",difficulty:"intermediate",instruction:`用 throw 主动抛出异常。

照着敲，感受抛出异常。`,hint:'throw new Exception("错误信息");',targetCode:`public class Main {
    public static void checkAge(int age) {
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("年龄不合法！");
        }
        System.out.println("年龄合法：" + age);
    }

    public static void main(String[] args) {
        checkAge(200);
    }
}`,encouragement:"throw 主动抛出异常！"},{id:"java-exception-7",type:"coding",title:"声明异常 throws",concept:"Exception Handling",difficulty:"intermediate",instruction:`方法可以用 throws 声明会抛出的异常，调用者需要处理。

定义一个 divide 方法，throws 声明 ArithmeticException。`,hint:"public int divide(int a, int b) throws ArithmeticException",starter:`public class Main {
    public static int divide(int a, int b) {
        return a / b;
    }

    public static void main(String[] args) {
        System.out.println(divide(10, 0));
    }
}`,answer:`public class Main {
    public static int divide(int a, int b) throws ArithmeticException {
        return a / b;
    }

    public static void main(String[] args) {
        try {
            System.out.println(divide(10, 0));
        } catch (ArithmeticException e) {
            System.out.println("除数不能为0");
        }
    }
}`,expectedOutput:"除数不能为0",validation:{type:"contains",value:"throws ArithmeticException"},encouragement:"throws 声明异常，调用者处理！"},{id:"java-exception-8",type:"coding",title:"综合练习",concept:"综合",difficulty:"intermediate",instruction:`综合练习：自定义一个异常类，实现除法运算并处理各种异常。

当除数为负数时抛出自定义异常。`,hint:'throw new Exception("除数不能为负数");',starter:`public class Main {
    public static int divide(int a, int b) {
        // 当 b < 0 时抛出异常
        
        return a / b;
    }

    public static void main(String[] args) {
        try {
            System.out.println(divide(10, -2));
        } catch (Exception e) {
            System.out.println("错误：" + e.getMessage());
        }
    }
}`,answer:`public class Main {
    public static int divide(int a, int b) throws Exception {
        if (b < 0) {
            throw new Exception("除数不能为负数");
        }
        return a / b;
    }

    public static void main(String[] args) {
        try {
            System.out.println(divide(10, -2));
        } catch (Exception e) {
            System.out.println("错误：" + e.getMessage());
        }
    }
}`,expectedOutput:"错误：除数不能为负数",validation:{type:"contains",value:"throw new Exception"},encouragement:"自定义异常，处理错误情况，异常处理掌握了！"}]}};function Ng(e){return{id:e.id,title:e.title,description:e.description,language:e.language,category:e.category,difficulty:e.difficulty,concepts:e.concepts,steps:e.steps.map((t,n)=>({...t,id:`${e.id}-${n+1}`})),estimatedMinutes:e.estimated_minutes}}function Mg(e){return{id:e.id,title:e.title,description:e.description,language:e.language,category:e.category,difficulty:e.difficulty,concepts:e.concepts,estimatedMinutes:e.estimated_minutes,stepsCount:e.steps_count}}class _g{constructor(){uo(this,"isTauriEnv");this.isTauriEnv=typeof window<"u"&&window.__TAURI__!==void 0,console.log("CourseService initialized, Tauri env:",this.isTauriEnv)}async getCourses(){if(!this.isTauriEnv)return console.log("Not in Tauri environment, returning mock courses"),Os;try{try{const n=await qe("debug_courses");console.log("[DEBUG] Course paths:",JSON.stringify(n,null,2))}catch(n){console.error("[DEBUG] Failed to get debug info:",n)}const t=await qe("get_courses");return console.log("[DEBUG] get_courses returned:",t.length,"courses"),t.map(Mg)}catch(t){return console.error("Failed to get courses from Tauri, falling back to mock:",t),Os}}async getCourse(t){if(!this.isTauriEnv){console.log("Not in Tauri environment, returning mock course:",t);const n=Rr[t];if(!n)throw new Error(`Course not found: ${t}`);return n}try{const n=await qe("get_course",{courseId:t});return Ng(n)}catch(n){console.error("Failed to get course from Tauri, falling back to mock:",n);const r=Rr[t];if(!r)throw new Error(`Course not found: ${t}`);return r}}async getStep(t,n){if(!this.isTauriEnv){const r=Rr[t];if(!r||n>=r.steps.length)throw new Error(`Step ${n} not found in course ${t}`);return r.steps[n]}try{return{...await qe("get_step",{courseId:t,stepIndex:n}),id:`${t}-${n+1}`}}catch(r){console.error("Failed to get step from Tauri, falling back to mock:",r);const i=Rr[t];if(!i||n>=i.steps.length)throw new Error(`Step ${n} not found in course ${t}`);return i.steps[n]}}async saveProgress(t,n,r,i){if(!this.isTauriEnv){console.log("Not in Tauri environment, skipping saveProgress:",{courseId:t,currentStep:n,completedSteps:r,timeSpent:i});return}try{await qe("save_progress",{courseId:t,currentStep:n,completedSteps:r,timeSpent:i})}catch(l){console.error("Failed to save progress:",l)}}async getProgress(t){if(!this.isTauriEnv)return null;try{const n=await qe("get_user_progress",{courseId:t});return n?{currentStep:n.current_step,completedSteps:n.completed_steps,timeSpent:n.time_spent}:null}catch(n){return console.error("Failed to get progress:",n),null}}async checkCourseUpdates(){if(!this.isTauriEnv)return[];try{return await qe("check_course_updates")}catch(t){return console.error("Failed to check updates:",t),[]}}}const _n=new _g,Ai=jg((e,t)=>({courses:[],filteredCourses:[],selectedCategory:"all",selectedLanguage:"all",currentCourse:null,currentStepIndex:0,currentStepCompleted:!1,completedSteps:new Set,typingStats:{wpm:0,accuracy:100,errors:0,totalKeystrokes:0,correctKeystrokes:0},typingStartTime:null,courseStartTime:null,isLoading:!1,error:null,courseProgress:{},loadCourses:async()=>{e({isLoading:!0,error:null});try{const n=await _n.getCourses();e({courses:n,isLoading:!1}),t().setCategory(t().selectedCategory)}catch(n){console.error("Failed to load courses:",n),e({error:"加载课程列表失败",isLoading:!1})}},setCategory:n=>{const{courses:r,selectedLanguage:i}=t(),l=r.filter(a=>{const o=n==="all"||a.category===n,s=i==="all"||a.language===i;return o&&s});e({selectedCategory:n,filteredCourses:l})},setLanguage:n=>{const{courses:r,selectedCategory:i}=t(),l=r.filter(a=>{const o=i==="all"||a.category===i,s=n==="all"||a.language===n;return o&&s});e({selectedLanguage:n,filteredCourses:l})},startCourse:async n=>{console.log("startCourse called with:",n),e({isLoading:!0,error:null});try{const r=await _n.getCourse(n);console.log("Course loaded:",r.title,"steps:",r.steps.length);const i=await _n.getProgress(n),l=i?{currentStep:i.currentStep,completedSteps:new Set(i.completedSteps)}:{currentStep:0,completedSteps:new Set};e({currentCourse:r,currentStepIndex:l.currentStep,currentStepCompleted:l.completedSteps.has(l.currentStep),completedSteps:l.completedSteps,typingStats:{wpm:0,accuracy:100,errors:0,totalKeystrokes:0,correctKeystrokes:0},typingStartTime:Date.now(),courseStartTime:Date.now(),isLoading:!1})}catch(r){console.error("Failed to load course:",r),e({error:`加载课程失败: ${r}`,isLoading:!1})}},nextStep:()=>{const{currentCourse:n,currentStepIndex:r,currentStepCompleted:i,courseProgress:l,courseStartTime:a}=t();if(n&&i&&n&&r<n.steps.length-1){const o=r+1,s=n.id,u={...l,[s]:{...l[s],currentStep:o}};e({currentStepIndex:o,currentStepCompleted:!1,courseProgress:u});const g=a?Math.floor((Date.now()-a)/1e3):0,d=Array.from(t().completedSteps);_n.saveProgress(n.id,r,d,g)}},prevStep:()=>{const{currentStepIndex:n}=t();n>0&&e({currentStepIndex:n-1})},completeStep:n=>{const{completedSteps:r}=t(),i=new Set(r);i.add(n),e({completedSteps:i})},markStepCompleted:()=>{const{currentCourse:n,currentStepIndex:r,completedSteps:i,courseProgress:l,courseStartTime:a}=t();if(!n)return;const o=new Set(i);o.add(r);const s=n.id,u={...l,[s]:{completedSteps:Array.from(o),currentStep:r}},g=a?Math.floor((Date.now()-a)/1e3):0;e({currentStepCompleted:!0,completedSteps:o,courseProgress:u}),_n.saveProgress(n.id,r,Array.from(o),g)},recordTypingKeystroke:n=>{const{typingStats:r,typingStartTime:i}=t(),l=Date.now(),a=r.totalKeystrokes+1,o=n?r.correctKeystrokes+1:r.correctKeystrokes,s=n?r.errors:r.errors+1,u=i||l,g=(l-u)/6e4,d=g>0?Math.round(o/5/g):0,h=a>0?Math.round(o/a*100):100;e({typingStats:{...r,totalKeystrokes:a,correctKeystrokes:o,errors:s,wpm:d,accuracy:h},typingStartTime:u})},resetTypingStats:()=>e({typingStats:{wpm:0,accuracy:100,errors:0,totalKeystrokes:0,correctKeystrokes:0},typingStartTime:Date.now()}),resetProgress:()=>{e({currentStepIndex:0,currentStepCompleted:!1,completedSteps:new Set})},getCurrentStep:()=>{const{currentCourse:n,currentStepIndex:r}=t();return n&&n.steps[r]?n.steps[r]:null},getCourseProgress:n=>{const{courseProgress:r}=t();return r[n]||null}})),fd={fundamentals:"编程基础",frontend:"前端开发",backend:"后端开发",algorithms:"数据结构与算法",database:"数据库",devtools:"开发工具"},Rs=["fundamentals","frontend","backend","algorithms","database","devtools"],zs=[{value:"all",label:"全部语言"},{value:"java",label:"Java"},{value:"python",label:"Python"},{value:"javascript",label:"JavaScript"},{value:"cpp",label:"C++"}];function Pg({className:e=""}){const{selectedCategory:t,selectedLanguage:n,setCategory:r,setLanguage:i,courses:l}=Ai(),a={all:l.length};for(const s of Rs)a[s]=l.filter(u=>u.category===s).length;const o={all:l.length};for(const s of zs)s.value!=="all"&&(o[s.value]=l.filter(u=>u.language===s.value).length);return m.jsxs("div",{className:`space-y-3 ${e}`,children:[m.jsxs("div",{className:"flex flex-wrap gap-2",children:[m.jsxs("button",{onClick:()=>r("all"),className:`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${t==="all"?"bg-primary-500 text-white":"bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"}`,children:["全部",a.all>0&&m.jsxs("span",{className:"ml-1.5 text-xs opacity-70",children:["(",a.all,")"]})]}),Rs.map(s=>a[s]>0?m.jsxs("button",{onClick:()=>r(s),className:`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${t===s?"bg-primary-500 text-white":"bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"}`,children:[fd[s],m.jsxs("span",{className:"ml-1.5 text-xs opacity-70",children:["(",a[s],")"]})]},s):null)]}),m.jsx("div",{className:"flex flex-wrap gap-2",children:zs.map(s=>o[s.value]>0?m.jsxs("button",{onClick:()=>i(s.value),className:`px-2.5 py-1 rounded text-xs font-medium transition-colors border ${n===s.value?"border-primary-500/50 bg-primary-500/10 text-primary-400":"border-gray-700/50 bg-gray-800/30 text-gray-500 hover:border-gray-600/50 hover:text-gray-400"}`,children:[s.label,m.jsxs("span",{className:"ml-1 opacity-60",children:["(",o[s.value],")"]})]},s.value):null)})]})}function Lg({course:e}){const n=Ai(u=>u.getCourseProgress)(e.id),r=(n==null?void 0:n.completedSteps.length)||0,i=(n==null?void 0:n.currentStep)||0,l=e.stepsCount>0?Math.round(r/e.stepsCount*100):0,a=r>0||i>0,o={beginner:"text-success-400 bg-success-500/10",intermediate:"text-yellow-400 bg-yellow-500/10",advanced:"text-error-400 bg-error-500/10"},s={beginner:"入门",intermediate:"进阶",advanced:"高级"};return m.jsxs(Ye,{to:`/learn/${e.id}`,className:"block p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-primary-500/50 transition-all hover:shadow-lg hover:shadow-primary-500/5",children:[m.jsxs("div",{className:"flex items-start justify-between mb-3",children:[m.jsx("div",{className:"flex-1 min-w-0",children:m.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[m.jsx("span",{className:"px-2 py-0.5 rounded text-xs font-medium bg-gray-700/50 text-gray-400",children:fd[e.category]}),m.jsx("h3",{className:"text-lg font-semibold text-gray-100 truncate",children:e.title})]})}),m.jsx("span",{className:`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${o[e.difficulty]}`,children:s[e.difficulty]})]}),m.jsx("p",{className:"text-sm text-gray-400 mb-4",children:e.description}),a&&m.jsxs("div",{className:"mb-4",children:[m.jsxs("div",{className:"flex items-center justify-between text-xs text-gray-400 mb-1",children:[m.jsx("span",{children:"学习进度"}),m.jsxs("span",{children:[r,"/",e.stepsCount," 步"]})]}),m.jsx("div",{className:"h-1.5 bg-gray-700/50 rounded-full overflow-hidden",children:m.jsx("div",{className:"h-full bg-primary-500 rounded-full transition-all duration-300",style:{width:`${l}%`}})})]}),m.jsxs("div",{className:"flex items-center gap-4 text-xs text-gray-500",children:[m.jsx("span",{children:e.language.toUpperCase()}),m.jsxs("span",{children:[e.stepsCount," 步"]}),m.jsxs("span",{children:["~",e.estimatedMinutes," 分钟"]})]}),m.jsxs("div",{className:"flex flex-wrap gap-1.5 mt-3",children:[e.concepts.slice(0,4).map(u=>m.jsx("span",{className:"px-2 py-0.5 text-xs rounded bg-gray-700/50 text-gray-400",children:u},u)),e.concepts.length>4&&m.jsxs("span",{className:"px-2 py-0.5 text-xs rounded bg-gray-700/30 text-gray-500",children:["+",e.concepts.length-4]})]})]})}function Tg(){const{filteredCourses:e,courses:t,loadCourses:n,selectedCategory:r,selectedLanguage:i}=Ai();k.useEffect(()=>{n()},[n]);const l=e.length>0||r==="all"&&i==="all"?e:t;return m.jsx("div",{className:"h-full overflow-auto px-8 py-8 animate-fade-in",children:m.jsxs("div",{className:"max-w-4xl mx-auto",children:[m.jsx("h1",{className:"text-3xl font-bold mb-2",children:"选择课程"}),m.jsx("p",{className:"text-gray-400 mb-6",children:"选择一门课程开始你的编程之旅"}),m.jsx(Pg,{className:"mb-8"}),e.length===0&&r!=="all"?m.jsxs("div",{className:"text-center py-16",children:[m.jsx("div",{className:"text-4xl mb-4 opacity-30",children:"📭"}),m.jsx("p",{className:"text-gray-400",children:"该分类下暂无课程，敬请期待更多内容"})]}):m.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:l.map(a=>m.jsx(Lg,{course:a},a.id))})]})})}function Og({step:e}){return m.jsxs("div",{className:"w-80 flex-shrink-0 flex flex-col p-6 border-r border-gray-700/50 overflow-auto bg-gray-800/20",children:[m.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[m.jsx("span",{className:"px-2 py-0.5 text-xs rounded bg-primary-500/20 text-primary-300",children:e.concept}),m.jsx("span",{className:"px-2 py-0.5 text-xs rounded bg-gray-700/50 text-gray-400",children:e.type==="coding"?"coding":"typing"})]}),m.jsx("h2",{className:"text-lg font-semibold text-gray-100 mb-4",children:e.title}),m.jsx("div",{className:"text-sm text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap",children:e.instruction}),e.hint&&m.jsxs("div",{className:"p-4 rounded-lg bg-primary-500/5 border border-primary-500/20",children:[m.jsx("p",{className:"text-xs text-primary-300 font-medium mb-1",children:"提示"}),m.jsx("p",{className:"text-sm text-gray-300 font-mono",children:e.hint})]}),e.encouragement&&m.jsx("p",{className:"mt-auto pt-6 text-sm text-gray-500 italic",children:e.encouragement})]})}function Rg({total:e,current:t}){return m.jsxs("div",{className:"flex items-center gap-1.5",children:[Array.from({length:e},(n,r)=>m.jsx("div",{className:`w-2 h-2 rounded-full transition-colors ${r<t?"bg-primary-400":r===t?"bg-primary-500 ring-2 ring-primary-500/30":"bg-gray-600"}`},r)),m.jsxs("span",{className:"ml-2 text-xs text-gray-500",children:[t+1,"/",e]})]})}function zg(){const[e,t]=k.useState({wpm:0,accuracy:100,errors:0,totalKeystrokes:0,correctKeystrokes:0}),n=k.useRef(null),r=k.useRef(0),i=k.useRef(0),l=k.useRef(0),a=k.useCallback(s=>{n.current||(n.current=Date.now()),r.current+=1,s?i.current+=1:l.current+=1;const u=(Date.now()-n.current)/6e4,g=u>0?Math.round(i.current/5/u):0,d=r.current>0?Math.round(i.current/r.current*100):100;t({wpm:g,accuracy:d,errors:l.current,totalKeystrokes:r.current,correctKeystrokes:i.current})},[]),o=k.useCallback(()=>{n.current=null,r.current=0,i.current=0,l.current=0,t({wpm:0,accuracy:100,errors:0,totalKeystrokes:0,correctKeystrokes:0})},[]);return{...e,recordKeystroke:a,reset:o}}function Ag({stats:e}){const{wpm:t,accuracy:n,errors:r,totalKeystrokes:i}=e;return m.jsxs("div",{className:"flex items-center gap-6 px-6 py-3 bg-gray-800/30 border-b border-gray-700/50",children:[m.jsxs("div",{className:"text-center",children:[m.jsx("div",{className:"text-xl font-bold text-primary-300",children:t}),m.jsx("div",{className:"text-xs text-gray-500",children:"WPM"})]}),m.jsxs("div",{className:"text-center",children:[m.jsxs("div",{className:`text-xl font-bold ${n<100?"text-warning-400":"text-success-400"}`,children:[n,"%"]}),m.jsx("div",{className:"text-xs text-gray-500",children:"准确率"})]}),m.jsxs("div",{className:"text-center",children:[m.jsx("div",{className:"text-xl font-bold text-error-400",children:r}),m.jsx("div",{className:"text-xs text-gray-500",children:"错误"})]}),m.jsxs("div",{className:"text-center text-xs text-gray-500",children:[i," 键"]})]})}let pl=null;function bg(){return pl||(pl=new AudioContext),pl}function ml(e){try{const t=bg(),n=t.createOscillator(),r=t.createGain();n.connect(r),r.connect(t.destination),n.type=e?"sine":"square",n.frequency.value=e?880:220,r.gain.setValueAtTime(.15,t.currentTime),r.gain.exponentialRampToValueAtTime(.001,t.currentTime+.08),n.start(t.currentTime),n.stop(t.currentTime+.08)}catch{}}function Dg({step:e,onComplete:t,onKeystroke:n,onReset:r}){const[i,l]=k.useState(""),[a,o]=k.useState(0),s=k.useRef(null),{wpm:u,accuracy:g,errors:d,totalKeystrokes:h,correctKeystrokes:y,recordKeystroke:S,reset:x}=zg();k.useEffect(()=>{var c;l(""),o(0),x(),r==null||r(),(c=s.current)==null||c.focus()},[e,r,x]);const j=k.useCallback(c=>{const f=(e==null?void 0:e.targetCode)||"";if(!f)return m.jsx("span",{className:"text-gray-500",children:"暂无内容"});if((c.key==="Backspace"||c.key==="Tab"||c.key==="Enter")&&c.preventDefault(),c.key==="CapsLock"||c.key==="Shift"||c.key==="Control"||c.key==="Alt"||c.key==="Meta"||c.key==="Escape")return;if(c.key==="Backspace"){a>0&&(l(E=>E.slice(0,-1)),o(E=>E-1));return}if(c.key==="Tab"){const E="    ";a+E.length<=f.length&&f.slice(a,a+E.length)===E&&(ml(!0),n(!0),l(A=>A+E),o(A=>A+E.length));return}if(c.key==="Enter"){const E=`
`;a<f.length&&f[a]===`
`&&(ml(!0),n(!0),l(A=>A+E),o(A=>A+1));return}if(c.ctrlKey||c.metaKey||c.altKey||c.key==="CapsLock"||c.key==="Shift"||c.key==="Control"||c.key==="Alt"||c.key==="Meta"||c.key.length!==1||/[^\x00-\x7F]/.test(c.key)||a>=f.length)return;const v=f[a],C=c.key,M=C===v;ml(M),S(M),n(M),l(E=>E+C),o(E=>E+1)},[a,e.targetCode,n]);k.useEffect(()=>{const c=s.current;if(c)return c.addEventListener("keydown",j),()=>c.removeEventListener("keydown",j)},[j]),k.useEffect(()=>{i===e.targetCode&&a===e.targetCode.length&&a>0&&t()},[i,a,e.targetCode,t]);const p=()=>{const c=[],f=(e==null?void 0:e.targetCode)||"";if(!f)return m.jsx("span",{className:"text-gray-500",children:"暂无内容"});for(let v=0;v<f.length;v++){const C=f[v],M=v<i.length,E=v===a,P=M&&i[v]===C,A=M&&i[v]!==C;let T="text-gray-500";P?T="text-success-400":A?T="text-error-400 bg-error-500/20":E&&(T="text-gray-200 bg-primary-500/30");let re=C;C===`
`?re=`↵
`:C===" "?re="·":C==="	"&&(re="→"),c.push(m.jsx("span",{className:`${T} relative ${E?'after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-primary-400 after:animate-pulse':""}`,children:re},v))}return c};return m.jsxs("div",{className:"flex-1 flex flex-col overflow-hidden",children:[m.jsxs("div",{ref:s,tabIndex:0,className:"flex-1 overflow-auto p-6 bg-gray-900/30 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-text",onClick:()=>{var c;return(c=s.current)==null?void 0:c.focus()},children:[m.jsxs("div",{className:"text-xs text-gray-500 mb-4 flex items-center gap-2",children:[m.jsx("span",{className:"w-2 h-2 rounded-full bg-primary-500 animate-pulse"}),"点击此处开始打字练习"]}),m.jsx("pre",{className:"font-mono text-lg leading-relaxed whitespace-pre-wrap",children:p()})]}),m.jsx(Ag,{stats:{wpm:u,accuracy:g,errors:d,totalKeystrokes:h,correctKeystrokes:y}}),m.jsxs("div",{className:"px-6 py-2 bg-gray-800/50 border-t border-gray-700/50",children:[m.jsxs("div",{className:"flex items-center gap-4 text-xs text-gray-400",children:[m.jsxs("span",{children:["进度: ",a," / ",e.targetCode.length]}),m.jsxs("span",{children:[Math.round(a/e.targetCode.length*100),"%"]})]}),m.jsx("div",{className:"mt-2 h-1 bg-gray-700 rounded-full overflow-hidden",children:m.jsx("div",{className:"h-full bg-primary-500 transition-all duration-300",style:{width:`${a/e.targetCode.length*100}%`}})})]})]})}function Ig(e,t=!0){const n=k.useCallback(r=>{if(!t)return;const i=r.target;if(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.contentEditable==="true"||i.closest(".cm-editor"))return;const l=r.key.toLowerCase(),a=e[l];a&&(r.preventDefault(),a())},[e,t]);k.useEffect(()=>(window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)),[n])}function Fg(){const{courseId:e}=wm(),t=nd(),{currentCourse:n,currentStepIndex:r,currentStepCompleted:i,startCourse:l,nextStep:a,prevStep:o,markStepCompleted:s,recordTypingKeystroke:u,resetTypingStats:g}=Ai();k.useEffect(()=>{e&&l(e)},[e,l]);const d=n==null?void 0:n.steps[r],h=n&&r===n.steps.length-1,y=k.useMemo(()=>{if(!d)return null;if(d.type==="typing")return d;const x=d;return{...x,type:"typing",targetCode:x.starter||x.answer||""}},[d]),S=()=>{i||s(),h?t(`/complete/${e}`):a()};return Ig({arrowup:o,pagedown:i?a:void 0,arrowdown:i?S:void 0,pageup:o,j:i?S:void 0,k:o,escape:()=>t("/courses")},!!n),!n||!d?m.jsxs("div",{className:"flex flex-col items-center justify-center h-full text-center px-8",children:[m.jsx("div",{className:"w-16 h-16 mb-4 rounded-full bg-gray-700/50 flex items-center justify-center",children:m.jsx("svg",{className:"w-8 h-8 text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:m.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"})})}),m.jsx("h3",{className:"text-lg font-semibold text-gray-200 mb-2",children:"加载课程中..."}),m.jsxs("p",{className:"text-sm text-gray-400",children:["课程 ID: ",e||"未知"]}),m.jsx("button",{onClick:()=>window.location.reload(),className:"mt-4 px-4 py-2 text-sm text-primary-400 hover:text-primary-300 hover:bg-gray-700/50 rounded-lg transition-colors",children:"重新加载"})]}):m.jsxs("div",{className:"flex flex-col h-full animate-fade-in",children:[m.jsxs("div",{className:"flex items-center justify-between px-6 py-3 bg-gray-800/30 border-b border-gray-700/50",children:[m.jsx("button",{onClick:()=>t("/courses"),className:"text-sm text-gray-400 hover:text-gray-200 transition-colors",children:"← 退出"}),m.jsx("div",{className:"flex items-center gap-3",children:m.jsx("span",{className:"text-sm font-medium text-gray-300",children:n.title})}),m.jsx(Rg,{total:n.steps.length,current:r})]}),m.jsxs("div",{className:"flex-1 flex overflow-hidden",children:[m.jsx(Og,{step:d}),m.jsx("div",{className:"flex-1 flex flex-col",children:y&&m.jsx(Dg,{step:y,onComplete:s,onKeystroke:u,onReset:g})})]}),m.jsxs("div",{className:"flex items-center justify-between px-6 py-3 bg-gray-800/30 border-t border-gray-700/50",children:[m.jsx("button",{onClick:o,disabled:r===0,className:"px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",children:"↑ 上一步"}),m.jsxs("span",{className:"text-xs text-gray-500",children:[r+1," / ",n.steps.length]}),m.jsx("button",{onClick:S,disabled:!i,className:"px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",children:"下一步 ↓"})]})]})}function Ug(){return m.jsx("div",{className:"flex flex-col items-center justify-center h-full px-8 animate-fade-in",children:m.jsxs("div",{className:"max-w-md text-center space-y-6",children:[m.jsx("div",{className:"text-6xl",children:"🎉"}),m.jsx("h1",{className:"text-3xl font-bold text-primary-300",children:"课程完成！"}),m.jsx("p",{className:"text-gray-400",children:"恭喜你完成了这门课程的所有步骤！继续加油，坚持练习。"}),m.jsxs("div",{className:"flex items-center justify-center gap-4 pt-4",children:[m.jsx(Ye,{to:"/courses",className:"px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors",children:"继续学习"}),m.jsx(Ye,{to:"/",className:"px-6 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg font-medium transition-colors",children:"返回首页"})]})]})})}function $g({percent:e}){const t=e>=100,n=e>0;return m.jsxs("div",{className:"w-full",children:[m.jsxs("div",{className:"flex justify-between text-xs text-gray-400 mb-1",children:[m.jsx("span",{children:"进度"}),m.jsxs("span",{className:t?"text-success-400":"",children:[Math.round(e),"%"]})]}),m.jsx("div",{className:"h-2 bg-gray-700 rounded-full overflow-hidden",children:m.jsx("div",{className:`h-full rounded-full transition-all duration-500 ${t?"bg-success-500":n?"bg-primary-500":"bg-gray-600"}`,style:{width:`${Math.min(e,100)}%`}})})]})}function Hg({progress:e}){const t=e.progressPercent>=100,n=i=>{if(!i)return"从未开始";const l=new Date(i),o=new Date().getTime()-l.getTime(),s=Math.floor(o/(1e3*60*60*24));return s===0?"今天":s===1?"昨天":s<7?`${s} 天前`:s<30?`${Math.floor(s/7)} 周前`:l.toLocaleDateString("zh-CN",{month:"short",day:"numeric"})},r={java:"text-orange-400 bg-orange-500/10",python:"text-blue-400 bg-blue-500/10",javascript:"text-yellow-400 bg-yellow-500/10",cpp:"text-cyan-400 bg-cyan-500/10"};return m.jsxs(Ye,{to:`/learn/${e.courseId}`,className:`block p-5 rounded-xl border transition-all hover:shadow-lg ${t?"bg-success-500/5 border-success-500/20 hover:border-success-500/40":"bg-gray-800/50 border-gray-700/50 hover:border-primary-500/40"}`,children:[m.jsxs("div",{className:"flex items-start justify-between mb-3",children:[m.jsxs("div",{className:"flex-1 min-w-0",children:[m.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[m.jsx("span",{className:`px-2 py-0.5 rounded text-xs font-medium ${r[e.language]||"text-gray-400 bg-gray-700/50"}`,children:e.language.toUpperCase()}),t&&m.jsx("span",{className:"px-2 py-0.5 rounded text-xs font-medium bg-success-500/20 text-success-400",children:"已完成"})]}),m.jsx("h3",{className:"text-base font-semibold text-gray-100 truncate",children:e.courseTitle})]}),m.jsx("span",{className:"text-2xl",children:t?"✅":e.progressPercent>0?"📖":"🔒"})]}),m.jsx($g,{percent:e.progressPercent}),m.jsxs("div",{className:"flex items-center justify-between mt-3 text-xs text-gray-500",children:[m.jsxs("span",{children:[e.completedSteps," / ",e.totalSteps," 步"]}),e.timeSpentMinutes>0&&m.jsxs("span",{children:["已学习 ",e.timeSpentMinutes," 分钟"]}),m.jsx("span",{children:n(e.lastStudiedAt)})]})]})}function Bg(){return m.jsxs("div",{className:"flex flex-col items-center justify-center py-16 text-center",children:[m.jsx("div",{className:"text-6xl mb-4",children:"📚"}),m.jsx("h3",{className:"text-xl font-semibold text-gray-200 mb-2",children:"还没有学习记录"}),m.jsx("p",{className:"text-gray-400 mb-6",children:"开始你的第一门课程，开启编程之旅"}),m.jsx(Ye,{to:"/courses",className:"px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors",children:"浏览课程"})]})}function Vg(){var a;const[e,t]=k.useState(null),[n,r]=k.useState(!0);k.useEffect(()=>{i()},[]);const i=async()=>{try{r(!0);const o=await qe("get_user_learning_summary");t(o)}catch(o){console.error("Failed to load learning summary:",o)}finally{r(!1)}};if(n)return m.jsx("div",{className:"flex items-center justify-center h-full",children:m.jsxs("div",{className:"flex flex-col items-center gap-4",children:[m.jsx("div",{className:"w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"}),m.jsx("span",{className:"text-gray-400",children:"加载中..."})]})});const l=(a=e==null?void 0:e.courseProgress)!=null?a:[];return m.jsx("div",{className:"h-full overflow-y-auto px-6 py-8",children:m.jsxs("div",{className:"max-w-3xl mx-auto",children:[m.jsxs("div",{className:"mb-8",children:[m.jsx("h1",{className:"text-2xl font-bold text-gray-100 mb-2",children:"学习中心"}),m.jsx("p",{className:"text-gray-400",children:"追踪你的学习进度，继续未完成的课程"})]}),l.length===0?m.jsx(Bg,{}):m.jsx("div",{className:"space-y-4",children:l.map(o=>m.jsx(Hg,{progress:o},o.courseId))})]})})}function Wg(){return m.jsx(Vm,{children:m.jsx(Ym,{children:m.jsxs(Dm,{children:[m.jsx(Nt,{path:"/",element:m.jsx(Xm,{})}),m.jsx(Nt,{path:"/about",element:m.jsx(Zm,{})}),m.jsx(Nt,{path:"/courses",element:m.jsx(Tg,{})}),m.jsx(Nt,{path:"/learn/:courseId",element:m.jsx(Fg,{})}),m.jsx(Nt,{path:"/complete/:courseId",element:m.jsx(Ug,{})}),m.jsx(Nt,{path:"/user-center",element:m.jsx(Vg,{})})]})})})}gl.createRoot(document.getElementById("root")).render(m.jsx(Wg,{}));
