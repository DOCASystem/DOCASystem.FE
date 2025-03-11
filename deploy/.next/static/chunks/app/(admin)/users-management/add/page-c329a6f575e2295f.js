(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[951],{4490:function(e,r,s){Promise.resolve().then(s.bind(s,2870))},9376:function(e,r,s){"use strict";var n=s(5475);s.o(n,"useParams")&&s.d(r,{useParams:function(){return n.useParams}}),s.o(n,"usePathname")&&s.d(r,{usePathname:function(){return n.usePathname}}),s.o(n,"useRouter")&&s.d(r,{useRouter:function(){return n.useRouter}}),s.o(n,"useSearchParams")&&s.d(r,{useSearchParams:function(){return n.useSearchParams}})},2870:function(e,r,s){"use strict";s.r(r),s.d(r,{default:function(){return o}});var n=s(7437),a=s(2265),t=s(9376),l=s(9555),d=s(9680);function o(){let e=(0,t.useRouter)(),[r,s]=(0,a.useState)({username:"",fullName:"",phoneNumber:"",password:"",confirmPassword:"",role:"USER"}),[o,m]=(0,a.useState)({}),[i,c]=(0,a.useState)(!1),u=()=>{let e={};return r.username.trim()||(e.username="T\xean đăng nhập kh\xf4ng được để trống"),r.fullName.trim()||(e.fullName="Họ t\xean kh\xf4ng được để trống"),r.phoneNumber.trim()?/^[0-9]{10}$/.test(r.phoneNumber)||(e.phoneNumber="Số điện thoại kh\xf4ng hợp lệ"):e.phoneNumber="Số điện thoại kh\xf4ng được để trống",r.password?r.password.length<6&&(e.password="Mật khẩu phải c\xf3 \xedt nhất 6 k\xfd tự"):e.password="Mật khẩu kh\xf4ng được để trống",r.password!==r.confirmPassword&&(e.confirmPassword="X\xe1c nhận mật khẩu kh\xf4ng khớp"),m(e),0===Object.keys(e).length},h=e=>{let{name:r,value:n}=e.target;s(e=>({...e,[r]:n})),o[r]&&m(e=>{let s={...e};return delete s[r],s})},x=async s=>{if(s.preventDefault(),u()){c(!0);try{console.log("Tạo người d\xf9ng mới với dữ liệu:",{username:r.username,fullName:r.fullName,phoneNumber:r.phoneNumber,password:r.password,role:r.role}),await new Promise(e=>setTimeout(e,1e3)),e.push("/users-management")}catch(e){console.error("Lỗi khi tạo người d\xf9ng:",e),alert("C\xf3 lỗi xảy ra khi tạo người d\xf9ng mới")}finally{c(!1)}}};return(0,n.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,n.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,n.jsx)("h1",{className:"text-2xl font-bold text-gray-800",children:"Th\xeam người d\xf9ng mới"}),(0,n.jsx)(d.Z,{href:"/users-management",children:(0,n.jsx)(l.Z,{className:"border-pink-doca hover:bg-pink-doca w-32 h-11 text-lg",children:"Quay lại"})})]}),(0,n.jsx)("div",{className:"bg-white rounded-lg shadow-md p-6",children:(0,n.jsxs)("form",{onSubmit:x,children:[(0,n.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,n.jsxs)("div",{className:"mb-4",children:[(0,n.jsxs)("label",{htmlFor:"username",className:"block text-sm font-medium text-gray-700 mb-1",children:["T\xean đăng nhập ",(0,n.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,n.jsx)("input",{type:"text",id:"username",name:"username",value:r.username,onChange:h,className:"w-full p-2 border rounded-md ".concat(o.username?"border-red-500":"border-gray-300"),disabled:i}),o.username&&(0,n.jsx)("p",{className:"mt-1 text-sm text-red-500",children:o.username})]}),(0,n.jsxs)("div",{className:"mb-4",children:[(0,n.jsxs)("label",{htmlFor:"fullName",className:"block text-sm font-medium text-gray-700 mb-1",children:["Họ t\xean ",(0,n.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,n.jsx)("input",{type:"text",id:"fullName",name:"fullName",value:r.fullName,onChange:h,className:"w-full p-2 border rounded-md ".concat(o.fullName?"border-red-500":"border-gray-300"),disabled:i}),o.fullName&&(0,n.jsx)("p",{className:"mt-1 text-sm text-red-500",children:o.fullName})]}),(0,n.jsxs)("div",{className:"mb-4",children:[(0,n.jsxs)("label",{htmlFor:"phoneNumber",className:"block text-sm font-medium text-gray-700 mb-1",children:["Số điện thoại ",(0,n.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,n.jsx)("input",{type:"text",id:"phoneNumber",name:"phoneNumber",value:r.phoneNumber,onChange:h,className:"w-full p-2 border rounded-md ".concat(o.phoneNumber?"border-red-500":"border-gray-300"),disabled:i}),o.phoneNumber&&(0,n.jsx)("p",{className:"mt-1 text-sm text-red-500",children:o.phoneNumber})]}),(0,n.jsxs)("div",{className:"mb-4",children:[(0,n.jsxs)("label",{htmlFor:"role",className:"block text-sm font-medium text-gray-700 mb-1",children:["Vai tr\xf2 ",(0,n.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,n.jsxs)("select",{id:"role",name:"role",value:r.role,onChange:h,className:"w-full p-2 border border-gray-300 rounded-md",disabled:i,children:[(0,n.jsx)("option",{value:"USER",children:"Kh\xe1ch h\xe0ng"}),(0,n.jsx)("option",{value:"STAFF",children:"Nh\xe2n vi\xean"}),(0,n.jsx)("option",{value:"ADMIN",children:"Admin"})]})]}),(0,n.jsxs)("div",{className:"mb-4",children:[(0,n.jsxs)("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700 mb-1",children:["Mật khẩu ",(0,n.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,n.jsx)("input",{type:"password",id:"password",name:"password",value:r.password,onChange:h,className:"w-full p-2 border rounded-md ".concat(o.password?"border-red-500":"border-gray-300"),disabled:i}),o.password&&(0,n.jsx)("p",{className:"mt-1 text-sm text-red-500",children:o.password})]}),(0,n.jsxs)("div",{className:"mb-4",children:[(0,n.jsxs)("label",{htmlFor:"confirmPassword",className:"block text-sm font-medium text-gray-700 mb-1",children:["X\xe1c nhận mật khẩu ",(0,n.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,n.jsx)("input",{type:"password",id:"confirmPassword",name:"confirmPassword",value:r.confirmPassword,onChange:h,className:"w-full p-2 border rounded-md ".concat(o.confirmPassword?"border-red-500":"border-gray-300"),disabled:i}),o.confirmPassword&&(0,n.jsx)("p",{className:"mt-1 text-sm text-red-500",children:o.confirmPassword})]})]}),(0,n.jsx)("div",{className:"mt-6 flex justify-end space-x-3",children:(0,n.jsxs)(d.Z,{href:"/users-management",children:[(0,n.jsx)(l.Z,{type:"submit",variant:"primary",className:"bg-pink-doca hover:bg-pink-doca w-56 h-11 text-lg",disabled:i,children:i?"Đang xử l\xfd...":"Th\xeam người d\xf9ng"})," "]})})]})})]})}},9555:function(e,r,s){"use strict";s.d(r,{Z:function(){return t}});var n=s(7437),a=s(1201);function t(e){let{className:r,children:s,onClick:t,disabled:l=!1,loading:d=!1,variant:o="primary",type:m="button"}=e;return(0,n.jsx)("button",{onClick:t,disabled:l||d,type:m,className:(0,a.cn)("w-[172px] h-[60px] text-[20px] text-center font-medium rounded-xl transition-all duration-200",{primary:"bg-pink-doca text-white hover:bg-pink-600",secondary:"bg-gray-500 text-white hover:bg-gray-600",outline:"border border-pink-doca text-pink-doca hover:bg-pink-doca hover:text-white"}[o],l&&"opacity-50 cursor-not-allowed",r),children:d?(0,n.jsx)("span",{className:"animate-spin",children:"⏳"}):s})}s(2265)},9680:function(e,r,s){"use strict";s.d(r,{Z:function(){return l}});var n=s(7437),a=s(1201),t=s(7648);function l(e){let{href:r,className:s,children:l}=e;return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(t.default,{href:r,className:(0,a.cn)("",s),children:l})})}},1201:function(e,r,s){"use strict";s.d(r,{cn:function(){return t}});var n=s(1994),a=s(3335);function t(){for(var e=arguments.length,r=Array(e),s=0;s<e;s++)r[s]=arguments[s];return(0,a.m6)((0,n.Z)(r))}}},function(e){e.O(0,[648,137,971,117,744],function(){return e(e.s=4490)}),_N_E=e.O()}]);