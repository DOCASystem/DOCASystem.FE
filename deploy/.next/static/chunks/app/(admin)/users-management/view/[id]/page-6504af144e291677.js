(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[93],{4001:function(e,n,s){Promise.resolve().then(s.bind(s,8142))},9376:function(e,n,s){"use strict";var a=s(5475);s.o(a,"useParams")&&s.d(n,{useParams:function(){return a.useParams}}),s.o(a,"usePathname")&&s.d(n,{usePathname:function(){return a.usePathname}}),s.o(a,"useRouter")&&s.d(n,{useRouter:function(){return a.useRouter}}),s.o(a,"useSearchParams")&&s.d(n,{useSearchParams:function(){return a.useSearchParams}})},8142:function(e,n,s){"use strict";s.r(n),s.d(n,{default:function(){return c}});var a=s(7437),t=s(2265),i=s(9376),l=s(7648),r=s(9555);function c(){let e=(0,i.useParams)().id,[n,s]=(0,t.useState)(!0),[c,d]=(0,t.useState)(null),[o,h]=(0,t.useState)(null);return((0,t.useEffect)(()=>{(async()=>{s(!0),h(null);try{await new Promise(e=>setTimeout(e,800)),"1"===e?d({id:"1",username:"johndoe",fullName:"John Doe",phoneNumber:"0901234567",role:"USER",status:"Hoạt động",createdAt:"2024-03-01",lastLogin:"2024-03-10 15:30:22",address:"123 Nguyễn Văn Linh, Quận 7, TP. Hồ Ch\xed Minh",email:"johndoe@example.com"}):"2"===e?d({id:"2",username:"adminuser",fullName:"Admin User",phoneNumber:"0912345678",role:"ADMIN",status:"Hoạt động",createdAt:"2024-03-02",lastLogin:"2024-03-11 08:15:40",email:"admin@example.com"}):h("Kh\xf4ng t\xecm thấy th\xf4ng tin người d\xf9ng")}catch(e){console.error("Lỗi khi lấy th\xf4ng tin người d\xf9ng:",e),h("C\xf3 lỗi xảy ra khi tải th\xf4ng tin người d\xf9ng")}finally{s(!1)}})()},[e]),n)?(0,a.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,a.jsx)("h1",{className:"text-2xl font-bold text-gray-800",children:"Chi tiết người d\xf9ng"}),(0,a.jsx)(l.default,{href:"/users-management",children:(0,a.jsx)(r.Z,{className:"bg-pink-doca hover:bg-pink-doca w-52 h-11 text-lg",children:"Quay lại"})})]}),(0,a.jsx)("div",{className:"bg-white rounded-lg shadow-md p-6 flex justify-center items-center min-h-[400px]",children:(0,a.jsx)("div",{className:"text-gray-500",children:"Đang tải th\xf4ng tin người d\xf9ng..."})})]}):o||!c?(0,a.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,a.jsx)("h1",{className:"text-2xl font-bold text-gray-800",children:"Chi tiết người d\xf9ng"}),(0,a.jsx)(l.default,{href:"/users-management",children:(0,a.jsx)(r.Z,{className:"border-pink-doca hover:bg-pink-doca w-52 h-11 text-lg",children:"Quay lại"})})]}),(0,a.jsx)("div",{className:"bg-white rounded-lg shadow-md p-6 flex justify-center items-center min-h-[400px]",children:(0,a.jsx)("div",{className:"text-red-500",children:o||"Kh\xf4ng t\xecm thấy th\xf4ng tin người d\xf9ng"})})]}):(0,a.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,a.jsx)("h1",{className:"text-2xl font-bold text-gray-800",children:"Chi tiết người d\xf9ng"}),(0,a.jsxs)("div",{className:"flex space-x-3",children:[(0,a.jsx)(l.default,{href:"/users-management/edit/".concat(c.id),children:(0,a.jsx)(r.Z,{className:"bg-pink-doca hover:bg-pink-doca w-52 h-11 text-lg",children:"Chỉnh sửa"})}),(0,a.jsx)(l.default,{href:"/users-management",children:(0,a.jsx)(r.Z,{className:"border-pink-doca hover:bg-pink-doca w-52 h-11 text-lg",children:"Quay lại"})})]})]}),(0,a.jsxs)("div",{className:"bg-white rounded-lg shadow-md p-6",children:[(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,a.jsx)("div",{className:"space-y-4",children:(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{className:"text-lg font-semibold text-gray-800 mb-2",children:"Th\xf4ng tin cơ bản"}),(0,a.jsx)("div",{className:"bg-gray-50 p-4 rounded-md",children:(0,a.jsxs)("div",{className:"grid grid-cols-3 gap-4",children:[(0,a.jsx)("div",{className:"col-span-1 text-gray-600",children:"ID:"}),(0,a.jsx)("div",{className:"col-span-2 font-medium",children:c.id}),(0,a.jsx)("div",{className:"col-span-1 text-gray-600",children:"T\xean đăng nhập:"}),(0,a.jsx)("div",{className:"col-span-2 font-medium",children:c.username}),(0,a.jsx)("div",{className:"col-span-1 text-gray-600",children:"Họ t\xean:"}),(0,a.jsx)("div",{className:"col-span-2 font-medium",children:c.fullName}),(0,a.jsx)("div",{className:"col-span-1 text-gray-600",children:"Email:"}),(0,a.jsx)("div",{className:"col-span-2 font-medium",children:c.email||"Chưa cung cấp"}),(0,a.jsx)("div",{className:"col-span-1 text-gray-600",children:"Số điện thoại:"}),(0,a.jsx)("div",{className:"col-span-2 font-medium",children:c.phoneNumber}),(0,a.jsx)("div",{className:"col-span-1 text-gray-600",children:"Địa chỉ:"}),(0,a.jsx)("div",{className:"col-span-2 font-medium",children:c.address||"Chưa cung cấp"})]})})]})}),(0,a.jsx)("div",{className:"space-y-4",children:(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{className:"text-lg font-semibold text-gray-800 mb-2",children:"Th\xf4ng tin t\xe0i khoản"}),(0,a.jsx)("div",{className:"bg-gray-50 p-4 rounded-md",children:(0,a.jsxs)("div",{className:"grid grid-cols-3 gap-4",children:[(0,a.jsx)("div",{className:"col-span-1 text-gray-600",children:"Vai tr\xf2:"}),(0,a.jsx)("div",{className:"col-span-2",children:(0,a.jsx)("span",{className:"px-2 inline-flex text-xs leading-5 font-semibold rounded-full ".concat("ADMIN"===c.role?"bg-purple-100 text-purple-800":"STAFF"===c.role?"bg-blue-100 text-blue-800":"bg-green-100 text-green-800"),children:"ADMIN"===c.role?"Admin":"STAFF"===c.role?"Nh\xe2n vi\xean":"Kh\xe1ch h\xe0ng"})}),(0,a.jsx)("div",{className:"col-span-1 text-gray-600",children:"Trạng th\xe1i:"}),(0,a.jsx)("div",{className:"col-span-2",children:(0,a.jsx)("span",{className:"px-2 inline-flex text-xs leading-5 font-semibold rounded-full ".concat("Hoạt động"===c.status?"bg-green-100 text-green-800":"bg-red-100 text-red-800"),children:c.status})}),(0,a.jsx)("div",{className:"col-span-1 text-gray-600",children:"Ng\xe0y tạo:"}),(0,a.jsx)("div",{className:"col-span-2 font-medium",children:c.createdAt}),(0,a.jsx)("div",{className:"col-span-1 text-gray-600",children:"Đăng nhập gần nhất:"}),(0,a.jsx)("div",{className:"col-span-2 font-medium",children:c.lastLogin||"Chưa c\xf3 th\xf4ng tin"})]})})]})})]}),(0,a.jsxs)("div",{className:"mt-8",children:[(0,a.jsx)("h2",{className:"text-lg font-semibold text-gray-800 mb-2",children:"Lịch sử hoạt động"}),(0,a.jsx)("div",{className:"bg-gray-50 p-4 rounded-md",children:(0,a.jsx)("p",{className:"text-gray-500 italic",children:"Chức năng đang được ph\xe1t triển..."})})]})]})]})}},9555:function(e,n,s){"use strict";s.d(n,{Z:function(){return i}});var a=s(7437),t=s(1201);function i(e){let{className:n,children:s,onClick:i,disabled:l=!1,loading:r=!1,variant:c="primary",type:d="button"}=e;return(0,a.jsx)("button",{onClick:i,disabled:l||r,type:d,className:(0,t.cn)("w-[172px] h-[60px] text-[20px] text-center font-medium rounded-xl transition-all duration-200",{primary:"bg-pink-doca text-white hover:bg-pink-600",secondary:"bg-gray-500 text-white hover:bg-gray-600",outline:"border border-pink-doca text-pink-doca hover:bg-pink-doca hover:text-white"}[c],l&&"opacity-50 cursor-not-allowed",n),children:r?(0,a.jsx)("span",{className:"animate-spin",children:"⏳"}):s})}s(2265)},1201:function(e,n,s){"use strict";s.d(n,{cn:function(){return i}});var a=s(1994),t=s(3335);function i(){for(var e=arguments.length,n=Array(e),s=0;s<e;s++)n[s]=arguments[s];return(0,t.m6)((0,a.Z)(n))}}},function(e){e.O(0,[648,137,971,117,744],function(){return e(e.s=4001)}),_N_E=e.O()}]);