(()=>{var e={};e.id=839,e.ids=[839],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},7790:e=>{"use strict";e.exports=require("assert")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2048:e=>{"use strict";e.exports=require("fs")},2615:e=>{"use strict";e.exports=require("http")},8791:e=>{"use strict";e.exports=require("https")},9801:e=>{"use strict";e.exports=require("os")},5315:e=>{"use strict";e.exports=require("path")},6162:e=>{"use strict";e.exports=require("stream")},4175:e=>{"use strict";e.exports=require("tty")},7360:e=>{"use strict";e.exports=require("url")},1764:e=>{"use strict";e.exports=require("util")},1568:e=>{"use strict";e.exports=require("zlib")},6682:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>n.a,__next_app__:()=>x,originalPathname:()=>m,pages:()=>o,routeModule:()=>u,tree:()=>c}),s(5),s(9080),s(3817),s(2523);var r=s(3191),a=s(8716),i=s(7922),n=s.n(i),d=s(5231),l={};for(let e in d)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>d[e]);s.d(t,l);let c=["",{children:["(admin)",{children:["products-management",{children:["view-product",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,5)),"D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(admin)\\products-management\\view-product\\page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,9080)),"D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(admin)\\layout.tsx"]}]},{layout:[()=>Promise.resolve().then(s.bind(s,3817)),"D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.bind(s,2523)),"D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\not-found.tsx"]}],o=["D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(admin)\\products-management\\view-product\\page.tsx"],m="/(admin)/products-management/view-product/page",x={require:s,loadChunk:()=>Promise.resolve()},u=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/(admin)/products-management/view-product/page",pathname:"/products-management/view-product",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},2359:(e,t,s)=>{Promise.resolve().then(s.bind(s,4797))},4797:(e,t,s)=>{"use strict";s.d(t,{default:()=>o});var r=s(326),a=s(7577),i=s(5047),n=s(434),d=s(6226);let l={dog:"Ch\xf3",cat:"M\xe8o"};function c(){let e=(0,i.useRouter)();(0,i.useSearchParams)().get("id");let[t,s]=(0,a.useState)(null),[c,o]=(0,a.useState)(!0),[m,x]=(0,a.useState)(null);if(c)return r.jsx("div",{className:"flex justify-center items-center h-screen bg-white/80",children:r.jsx("div",{className:"text-lg font-medium text-pink-doca",children:"Đang tải dữ liệu sản phẩm..."})});if(m||!t)return r.jsx("div",{className:"flex justify-center items-center h-screen",children:(0,r.jsxs)("div",{className:"text-center py-10 text-red-500",children:[m||"Kh\xf4ng t\xecm thấy sản phẩm",r.jsx("div",{className:"mt-4",children:r.jsx("button",{onClick:()=>e.push("/products-management"),className:"px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-500",children:"Quay lại danh s\xe1ch"})})]})});let u=t.categoryIds.map(e=>l[e]||e).join(", ");return(0,r.jsxs)("div",{className:"p-6 mx-auto",children:[(0,r.jsxs)("div",{className:"mb-6 flex items-center",children:[r.jsx(n.default,{href:"/products-management",className:"mr-4 text-pink-doca hover:text-pink-doca",children:r.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 19l-7-7m0 0l7-7m-7 7h18"})})}),r.jsx("h1",{className:"text-2xl font-bold text-gray-800",children:"Chi tiết sản phẩm"})]}),r.jsx("div",{className:"bg-white rounded-lg shadow-md p-6",children:(0,r.jsxs)("div",{className:"flex flex-col md:flex-row gap-8",children:[r.jsx("div",{className:"w-full md:w-1/3",children:r.jsx("div",{className:"aspect-square overflow-hidden rounded-lg shadow-md bg-gray-100 flex items-center justify-center",children:t.imageUrl?r.jsx(d.default,{src:t.imageUrl,alt:t.name,width:128,height:128,className:"object-cover w-full h-full"}):r.jsx("div",{className:"text-gray-400 text-center p-4",children:"Kh\xf4ng c\xf3 h\xecnh ảnh"})})}),(0,r.jsxs)("div",{className:"w-full md:w-2/3",children:[(0,r.jsxs)("div",{className:"flex justify-between",children:[r.jsx("h2",{className:"text-2xl font-bold text-gray-800",children:t.name}),r.jsx("div",{className:"flex space-x-2",children:r.jsx(n.default,{href:`/products-management/edit/?id=${t.id}`,className:"px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all",children:"Chỉnh sửa"})})]}),(0,r.jsxs)("div",{className:"mt-6 grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,r.jsxs)("div",{children:[r.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Ph\xe2n loại"}),r.jsx("p",{className:"mt-1 text-lg font-medium text-gray-900",children:u})]}),(0,r.jsxs)("div",{children:[r.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"K\xedch thước"}),r.jsx("p",{className:"mt-1 text-lg font-medium text-gray-900",children:t.size})]}),(0,r.jsxs)("div",{children:[r.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Gi\xe1"}),(0,r.jsxs)("p",{className:"mt-1 text-lg font-bold text-pink-600",children:[t.price.toLocaleString(),"đ"]})]}),(0,r.jsxs)("div",{children:[r.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Số lượng c\xf2n lại"}),(0,r.jsxs)("p",{className:"mt-1 text-lg font-medium text-gray-900",children:[t.quantity," SP"]})]}),t.createdAt&&(0,r.jsxs)("div",{children:[r.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Ng\xe0y tạo"}),r.jsx("p",{className:"mt-1 text-lg font-medium text-gray-900",children:t.createdAt})]}),t.updatedAt&&(0,r.jsxs)("div",{children:[r.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Cập nhật lần cuối"}),r.jsx("p",{className:"mt-1 text-lg font-medium text-gray-900",children:t.updatedAt})]})]}),(0,r.jsxs)("div",{className:"mt-6",children:[r.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"M\xf4 tả sản phẩm"}),r.jsx("p",{className:"mt-2 text-base text-gray-700 whitespace-pre-line",children:t.description})]})]})]})})]})}function o(){return r.jsx(a.Suspense,{fallback:r.jsx("div",{className:"p-4",children:"Đang tải..."}),children:r.jsx(c,{})})}},5:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>i});var r=s(9510);let a=(0,s(8570).createProxy)(String.raw`D:\CN8-FPT\EXE\FE\doca-system-fe\src\app\(admin)\products-management\view-product\view-detail-product\view-product.tsx#default`);function i(){return r.jsx(a,{})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[95,772,821,917],()=>s(6682));module.exports=r})();