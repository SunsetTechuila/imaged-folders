var imagedDfolders=(()=>{var e="sp://core-playlist/v1/rootlist",s="folder-image",r=".main-yourLibraryX-libraryRootlist > div",t="aria-labelledby",i=`div[${t} *= "folder:"]`,n=`li.main-useDropTarget-folder:has(${i})`,a="main-image-image",o="main-cardImage-image",l="x-entityImage-image",c="#spicetify-playlist-list > div > div:nth-child(2)",d="#spicetify-playlist-list .main-gridContainer-gridContainer",m="playlist.edit-details.remove-photo",g="playlist.edit-details.error.file-upload-failed",u="choose_photo";function f(){return Boolean(document.querySelector(d))}function p(e){e.getElementsByClassName(a)[0]?.remove(),e.querySelector('div[class *= "imagePlaceholder"]')?.remove()}function v(){return document.querySelector(f()?d:c)}function y(e){return document.querySelector(n.replace('folder:"',`folder:${e}"`))}function h(e){return e.querySelector(f()?".main-cardImage-imageWrapper > div":".x-entityImage-imageContainer")}function w(e){if(!(e instanceof Element))return Spicetify.URI.from(e)?.id;e=e.querySelector(i);if(e){e=e.getAttribute(t)?.match(/folder:(\w+)$/);if(e)return e[1]}}function S(){var i=[],a=document.querySelectorAll(n);for(let e=0,t=a.length;e<t;e+=1){var r=function(e){var t=w(e);if(t){t=localStorage.getItem(s+":"+t);if(t){e=h(e);if(e)return{imageContainer:e,imageBase64:t}}}return null}(a[e]);r&&i.push(r)}return i}function b(e,t){var i=document.createElement("img");i.classList.add(a,"main-image-loaded",f()?o:l),i.src=t,p(e),e.prepend(i)}function C(e){t=document.createElement("div"),i=document.createElementNS("http://www.w3.org/2000/svg","svg"),a=document.createElementNS("http://www.w3.org/2000/svg","path"),n=f(),r=n?"64":"24",t.classList.add(n?"main-card-imagePlaceholder":"x-entityImage-imagePlaceholder"),i.classList.add("Svg-sc-ytk21e-0",n?"Svg-img-textSubdued-64-icon":"Svg-img-24-icon"),i.setAttribute("height",r+"px"),i.setAttribute("width",r+"px"),i.setAttribute("viewBox","0 0 24 24"),i.setAttribute("aria-hidden","true"),i.setAttribute("role","img"),a.setAttribute("d","M1 4a2 2 0 0 1 2-2h5.155a3 3 0 0 1 2.598 1.5l.866 1.5H21a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm7.155 0H3v16h18V7H10.464L9.021 4.5a1 1 0 0 0-.866-.5z"),i.appendChild(a),t.appendChild(i);var t,i,a,r,n=t;p(e),e.prepend(n)}async function I(){const i=[];return(await Spicetify.CosmosAsync.get(e)).rows?.forEach(e=>function t(e){"folder"===e.type&&(i.push(e.id),e.rows?.forEach(e=>t(e)))}(e)),i}function x(){var i,a=S();for(let e=0,t=a.length;e<t;e+=1)i=a[e].imageContainer,Boolean(i.getElementsByClassName(f()?o:l)[0])||b(a[e].imageContainer,a[e].imageBase64)}function A(){var{ContextMenu:e,Locale:t}=Spicetify;const i=Spicetify.URI["isFolder"];var a=t.get(m);const r=t.get(g);var n,o,t=t.get(u);(n=document.createElement("form")).setAttribute("aria-hidden","true"),(o=document.createElement("input")).classList.add("hidden-visually"),o.setAttribute("type","file"),o.accept=["image/jpeg","image/apng","image/avif","image/gif","image/png","image/webp"].join(","),n.appendChild(o);const[l,c]=[n,o];document.body.appendChild(l),c.onchange=()=>{var e;c.files?.length&&((e=new FileReader).onload=async e=>{try{o=e.target?.result;var t=await new Promise(r=>{const n=new Image;n.onload=()=>{var e,t=354;let{width:i,height:a}=n;i>t||a>t?(i>a?(i=t,a*=t/i):a>i?(a=t,i*=t/a):(i=t,a=t),(t=document.createElement("canvas")).width=i,t.height=a,t.getContext("2d").drawImage(n,0,0,i,a),e=t.toDataURL("image/png"),t.remove(),r(e)):r(o)},n.src=o});i=c.id,a=t,localStorage.setItem(s+":"+i,a),(i=y(i))&&(i=h(i))&&b(i,a)}catch(e){Spicetify.showNotification(r+`
`+String(e),!0)}var i,a,o},e.readAsDataURL(c.files[0]))},new e.Item(a,([e])=>{var e=w(e);e&&(e=e,localStorage.removeItem(s+":"+e),e=y(e))&&(e=h(e))&&C(e)},([e])=>{return i(e)&&(e=w(e),Boolean(localStorage.getItem(s+":"+e)))},"x").register(),new e.Item(t,([e])=>{e=w(e);e&&(c.id=e,l.reset(),c.click())},([e])=>i(e),"edit").register()}function E(){if(Spicetify?.Locale&&Spicetify?.URI&&Spicetify?.ContextMenu&&Spicetify?.CosmosAsync&&v()){x();{let t=v();const i={childList:!0},a=new MutationObserver(x);var e=document.querySelector(r);new MutationObserver(function e(){t?.isConnected||((t=v())?(x(),a.observe(t,i)):setTimeout(e,300))}).observe(e,{childList:!0}),a.observe(t,i)}A(),!async function(){var i=await I();for(let e=0,t=localStorage.length;e<t;e+=1){var a=localStorage.key(e),r=new RegExp(s+":(\\w+)$"),r=a.match(r);r&&(r=r[1],-1===i.indexOf(r))&&localStorage.removeItem(a)}}()}else setTimeout(E,300)}(async()=>{await E()})()})();