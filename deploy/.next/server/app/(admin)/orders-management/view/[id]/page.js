(()=>{var e={};e.id=775,e.ids=[775],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},7790:e=>{"use strict";e.exports=require("assert")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2048:e=>{"use strict";e.exports=require("fs")},2615:e=>{"use strict";e.exports=require("http")},8791:e=>{"use strict";e.exports=require("https")},9801:e=>{"use strict";e.exports=require("os")},5315:e=>{"use strict";e.exports=require("path")},6162:e=>{"use strict";e.exports=require("stream")},4175:e=>{"use strict";e.exports=require("tty")},7360:e=>{"use strict";e.exports=require("url")},1764:e=>{"use strict";e.exports=require("util")},1568:e=>{"use strict";e.exports=require("zlib")},9505:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>n.a,__next_app__:()=>m,originalPathname:()=>x,pages:()=>o,routeModule:()=>h,tree:()=>c}),t(8898),t(9080),t(3817),t(2523);var r=t(3191),a=t(8716),i=t(7922),n=t.n(i),d=t(5231),l={};for(let e in d)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>d[e]);t.d(s,l);let c=["",{children:["(admin)",{children:["orders-management",{children:["view",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,8898)),"D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(admin)\\orders-management\\view\\[id]\\page.tsx"]}]},{}]},{}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,9080)),"D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(admin)\\layout.tsx"]}]},{layout:[()=>Promise.resolve().then(t.bind(t,3817)),"D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(t.bind(t,2523)),"D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\not-found.tsx"]}],o=["D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(admin)\\orders-management\\view\\[id]\\page.tsx"],x="/(admin)/orders-management/view/[id]/page",m={require:t,loadChunk:()=>Promise.resolve()},h=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/(admin)/orders-management/view/[id]/page",pathname:"/orders-management/view/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},6132:(e,s,t)=>{Promise.resolve().then(t.bind(t,7747))},7747:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>l});var r=t(326),a=t(7577),i=t(5047),n=t(434),d=t(6226);function l(){let e=(0,i.useRouter)(),{id:s}=(0,i.useParams)(),[t,l]=(0,a.useState)(null),[c,o]=(0,a.useState)(!0),[x,m]=(0,a.useState)(null);return c?r.jsx("div",{className:"flex justify-center items-center min-h-[60vh]",children:r.jsx("div",{className:"text-lg font-medium text-pink-doca",children:"Đang tải th\xf4ng tin đơn h\xe0ng..."})}):x||!t?(0,r.jsxs)("div",{className:"text-center py-10 text-red-500",children:[x||"Kh\xf4ng t\xecm thấy th\xf4ng tin đơn h\xe0ng",r.jsx("div",{className:"mt-4",children:r.jsx("button",{onClick:()=>e.push("/orders-management"),className:"px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-500",children:"Quay lại danh s\xe1ch"})})]}):(0,r.jsxs)("div",{className:"mx-auto max-w-5xl",children:[(0,r.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,r.jsxs)("div",{className:"flex items-center space-x-4",children:[r.jsx(n.default,{href:"/orders-management",className:"text-pink-doca hover:text-pink-700",children:r.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 19l-7-7m0 0l7-7m-7 7h18"})})}),(0,r.jsxs)("h1",{className:"text-2xl font-bold text-gray-800",children:["Chi tiết đơn h\xe0ng ",t.id]})]}),r.jsx("div",{className:"flex space-x-2",children:r.jsx(n.default,{href:`/orders-management/edit/${t.id}`,className:"px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all",children:"Chỉnh sửa"})})]}),r.jsx("div",{className:"bg-white rounded-lg shadow-md overflow-hidden mb-6",children:(0,r.jsxs)("div",{className:"p-6 border-b border-gray-200",children:[(0,r.jsxs)("div",{className:"flex justify-between",children:[r.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Th\xf4ng tin đơn h\xe0ng"}),r.jsx("span",{className:`px-3 py-1 rounded-full text-sm font-medium ${(e=>{switch(e){case"Chờ x\xe1c nhận":return"bg-yellow-100 text-yellow-600";case"Đ\xe3 x\xe1c nhận":return"bg-blue-100 text-blue-600";case"Đang vận chuyển":return"bg-purple-100 text-purple-600";case"Đ\xe3 giao h\xe0ng":return"bg-green-100 text-green-600";case"Đ\xe3 hủy":return"bg-red-100 text-red-600";default:return"bg-gray-100 text-gray-600"}})(t.status)}`,children:t.status})]}),(0,r.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,r.jsxs)("div",{children:[(0,r.jsxs)("p",{className:"text-gray-600 mb-2",children:[r.jsx("span",{className:"font-medium",children:"M\xe3 đơn h\xe0ng:"})," ",t.id]}),(0,r.jsxs)("p",{className:"text-gray-600 mb-2",children:[r.jsx("span",{className:"font-medium",children:"Ng\xe0y đặt:"})," ",t.orderDate]}),(0,r.jsxs)("p",{className:"text-gray-600 mb-2",children:[r.jsx("span",{className:"font-medium",children:"Tổng tiền:"})," ",t.total.toLocaleString(),"đ"]})]}),r.jsx("div",{children:t.blog&&(0,r.jsxs)("p",{className:"text-gray-600 mb-2",children:[r.jsx("span",{className:"font-medium",children:"Blog li\xean quan:"})," ",r.jsx(n.default,{href:`/blog-management/view?id=${t.blog.id}`,className:"text-blue-600 hover:underline",children:t.blog.title})]})})]})]})}),r.jsx("div",{className:"bg-white rounded-lg shadow-md overflow-hidden mb-6",children:(0,r.jsxs)("div",{className:"p-6 border-b border-gray-200",children:[r.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Th\xf4ng tin kh\xe1ch h\xe0ng"}),(0,r.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,r.jsxs)("div",{children:[(0,r.jsxs)("p",{className:"text-gray-600 mb-2",children:[r.jsx("span",{className:"font-medium",children:"T\xean:"})," ",t.customerName]}),(0,r.jsxs)("p",{className:"text-gray-600 mb-2",children:[r.jsx("span",{className:"font-medium",children:"SĐT:"})," ",t.customerPhone]}),(0,r.jsxs)("p",{className:"text-gray-600 mb-2",children:[r.jsx("span",{className:"font-medium",children:"Email:"})," ",t.customerEmail]})]}),r.jsx("div",{children:(0,r.jsxs)("p",{className:"text-gray-600 mb-2",children:[r.jsx("span",{className:"font-medium",children:"Địa chỉ:"})," ",t.customerAddress]})})]})]})}),r.jsx("div",{className:"bg-white rounded-lg shadow-md overflow-hidden",children:(0,r.jsxs)("div",{className:"p-6",children:[r.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Danh s\xe1ch sản phẩm"}),r.jsx("div",{className:"overflow-x-auto",children:(0,r.jsxs)("table",{className:"min-w-full divide-y divide-gray-200",children:[r.jsx("thead",{className:"bg-gray-50",children:(0,r.jsxs)("tr",{children:[r.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Sản phẩm"}),r.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Ph\xe2n loại"}),r.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Đơn gi\xe1"}),r.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Số lượng"}),r.jsx("th",{scope:"col",className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Th\xe0nh tiền"})]})}),(0,r.jsxs)("tbody",{className:"bg-white divide-y divide-gray-200",children:[t.products.map(e=>(0,r.jsxs)("tr",{className:"hover:bg-gray-50",children:[r.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:(0,r.jsxs)("div",{className:"flex items-center space-x-3",children:[r.jsx("div",{className:"h-10 w-10 flex-shrink-0 overflow-hidden rounded-md",children:e.image?r.jsx(d.default,{src:e.image,alt:e.name,width:40,height:40,className:"h-full w-full object-cover"}):r.jsx("div",{className:"h-10 w-10 bg-gray-200 flex items-center justify-center text-gray-500 text-xs",children:"No image"})}),r.jsx("div",{className:"text-sm font-medium text-gray-900",children:r.jsx(n.default,{href:`/products-management/view-product?id=${e.id}`,className:"hover:text-pink-doca",children:e.name})})]})}),r.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:e.category}),(0,r.jsxs)("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:[e.price.toLocaleString(),"đ"]}),r.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:e.quantity}),(0,r.jsxs)("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-gray-500",children:[(e.price*e.quantity).toLocaleString(),"đ"]})]},e.id)),(0,r.jsxs)("tr",{className:"bg-gray-50",children:[r.jsx("td",{colSpan:4,className:"px-6 py-4 text-right font-semibold",children:"Tổng cộng:"}),(0,r.jsxs)("td",{className:"px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900",children:[t.total.toLocaleString(),"đ"]})]})]})]})})]})})]})}},8898:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>r});let r=(0,t(8570).createProxy)(String.raw`D:\CN8-FPT\EXE\FE\doca-system-fe\src\app\(admin)\orders-management\view\[id]\page.tsx#default`)}};var s=require("../../../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),r=s.X(0,[95,772,821,917],()=>t(9505));module.exports=r})();