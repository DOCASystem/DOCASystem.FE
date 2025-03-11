(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[665],{2962:function(e,t,n){Promise.resolve().then(n.bind(n,6855))},9376:function(e,t,n){"use strict";var r=n(5475);n.o(r,"useParams")&&n.d(t,{useParams:function(){return r.useParams}}),n.o(r,"usePathname")&&n.d(t,{usePathname:function(){return r.usePathname}}),n.o(r,"useRouter")&&n.d(t,{useRouter:function(){return r.useRouter}}),n.o(r,"useSearchParams")&&n.d(t,{useSearchParams:function(){return r.useSearchParams}})},1364:function(e,t,n){"use strict";var r=n(8619),s=n(7693);let a=new r.VK({basePath:s.q7,baseOptions:{headers:{Authorization:"Bearer ".concat(localStorage.getItem("token")||"")}}});t.Z=a},8078:function(e,t,n){"use strict";n.d(t,{D:function(){return i}});var r=n(3464),s=n(7693);class a{async signup(e){try{return(await r.Z.post("".concat(this.baseUrl,"/api/v1/signup"),e,{headers:{"Content-Type":"application/json"}})).data}catch(e){throw console.error("Lỗi khi đăng k\xfd:",e),e}}async requestOtp(e){try{return(await r.Z.post("".concat(this.baseUrl,"/api/v1/otp"),e,{headers:{"Content-Type":"application/json"}})).data}catch(e){throw console.error("Lỗi khi gửi OTP:",e),e}}async forgotPassword(e){try{return(await r.Z.post("".concat(this.baseUrl,"/api/v1/forget-password"),e,{headers:{"Content-Type":"application/json"}})).data}catch(e){throw console.error("Lỗi khi đặt lại mật khẩu:",e),e}}constructor(){this.baseUrl=s.q7}}let i=new a},2144:function(e,t,n){"use strict";n.d(t,{iJ:function(){return a}});var r=n(8619),s=n(1364);n(8078),new r.nH(s.Z),new r.E6(s.Z),console.log("Creating AuthApi with config:",s.Z);let a=new r.z9(s.Z)},6855:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return y}});var r=n(7437),s=n(2265),a=n(9501),i=n(3842),o=n(5665),c=n(9701),u=n(9555),l=n(3145),h=n(9680),d=n(9376),p=n(2144),m=n(9064),g=n(3464),f=n(7693);let k=()=>!0,x=(e,t,n)=>{if(k()){let r=new Date(Date.now()+864e5*n).toUTCString();document.cookie="".concat(e,"=").concat(encodeURIComponent(t),"; expires=").concat(r,"; path=/")}},v=()=>{if(window.crypto){let e=new Uint8Array(16);return window.crypto.getRandomValues(e),Array.from(e,e=>("0"+(255&e).toString(16)).slice(-2)).join("")}return Math.random().toString(36).substring(2)};function w(){let[e,t]=(0,s.useState)(!1),[n,w]=(0,s.useState)(""),y=(0,d.useRouter)(),b=(0,a.cI)({resolver:(0,i.X)(o.dm),defaultValues:{email:"",password:""}});(0,s.useEffect)(()=>{w(v())},[]);let N=b.handleSubmit(async e=>{console.log("Form submitted with data:",e);try{let n;t(!0);let r=(0,f.kG)(f.Pn.AUTH.LOGIN);console.log("Đang gọi API login tại: ".concat(r));try{n=await p.iJ.apiV1LoginPost({usernameOrPhoneNumber:e.email,password:e.password}),console.log("API response:",n)}catch(s){console.error("Error from Swagger client:",s),console.log("Trying direct API call with axios...");let t=await g.Z.post(r,{usernameOrPhoneNumber:e.email,password:e.password},{headers:{"Content-Type":"application/json"}});console.log("Direct API response:",t),n={data:t.data}}if(n.data.token&&k())localStorage.setItem("token",n.data.token),x("token",n.data.token,7);else if(!n.data.token)throw Error("Token kh\xf4ng được trả về từ server");let s={id:n.data.id,username:n.data.username,phoneNumber:n.data.phoneNumber,fullName:n.data.fullName};k()&&(localStorage.setItem("userData",JSON.stringify(s)),x("userData",JSON.stringify(s),7)),m.Am.success("Đăng nhập th\xe0nh c\xf4ng!"),"admin"===e.email||"admin"===s.username?(console.log("Đăng nhập với t\xe0i khoản admin, chuyển hướng đến trang admin"),y.push("/admin")):y.push("/")}catch(t){console.error("Lỗi đăng nhập:",t);let e="Đăng nhập thất bại. Vui l\xf2ng kiểm tra lại th\xf4ng tin.";if(g.Z.isAxiosError(t)){var n,r,s,a,i,o,c;console.error("Chi tiết lỗi Axios:",{status:null===(n=t.response)||void 0===n?void 0:n.status,statusText:null===(r=t.response)||void 0===r?void 0:r.statusText,data:null===(s=t.response)||void 0===s?void 0:s.data,config:{url:null===(a=t.config)||void 0===a?void 0:a.url,method:null===(i=t.config)||void 0===i?void 0:i.method,baseURL:null===(o=t.config)||void 0===o?void 0:o.baseURL}}),t.response?e=401===t.response.status?"T\xean đăng nhập hoặc mật khẩu kh\xf4ng đ\xfang":403===t.response.status?"T\xe0i khoản của bạn đ\xe3 bị kh\xf3a":404===t.response.status?"Kh\xf4ng t\xecm thấy t\xe0i khoản":(null===(c=t.response.data)||void 0===c?void 0:c.message)?t.response.data.message:"Lỗi server: ".concat(t.response.status," ").concat(t.response.statusText):t.request&&(e="Kh\xf4ng thể kết nối đến m\xe1y chủ. Vui l\xf2ng kiểm tra kết nối v\xe0 thử lại sau.")}else t instanceof Error&&(e=t.message);console.error("Error message:",e),m.Am.error(e)}finally{t(!1)}});return(0,r.jsxs)("div",{className:"flex flex-row",children:[(0,r.jsx)(a.RV,{...b,children:(0,r.jsxs)("form",{method:"POST",onSubmit:e=>{e.preventDefault(),console.log("Form submitted via native submit"),N(e)},className:"bg-gray-100 flex flex-col justify-center items-center max-w-[1536px] p-6 rounded-xl shadow-md min-w-[700px]",children:[(0,r.jsx)("input",{type:"hidden",name:"csrf_token",value:n}),(0,r.jsx)("h1",{className:"text-2xl font-semibold",children:"Đăng nhập"}),(0,r.jsxs)("div",{className:"flex flex-col gap-4 mt-6",children:[(0,r.jsx)(c.Z,{name:"email",label:"Email hoặc số điện thoại",placeholder:"Nhập email hoặc số điện thoại",className:"w-[404px]",autoComplete:"username"}),(0,r.jsx)(c.Z,{name:"password",label:"Mật khẩu",placeholder:"Nhập mật khẩu",type:"password",className:"w-[404px]",autoComplete:"current-password"}),(0,r.jsx)(h.Z,{href:"/forgot-password",className:"text-pink-doca hover:underline left-0 ",children:"Qu\xean mật khẩu?"}),(0,r.jsxs)("div",{className:"mt-6 flex flex-col gap-4",children:[(0,r.jsx)(u.Z,{className:"h-12 w-[404px] bg-pink-doca text-white rounded-3xl text-[16px]",disabled:e,type:"submit",children:e?"Đang xử l\xfd...":"Đăng Nhập"}),(0,r.jsxs)("div",{className:"flex gap-2 items-center justify-center",children:[(0,r.jsx)("p",{children:"Bạn chưa c\xf3 t\xe0i khoản? "}),(0,r.jsx)(h.Z,{href:"/signup",className:"text-pink-doca left-0 text-right hover:underline",children:"Tạo t\xe0i khoản"})]})]})]})]})}),(0,r.jsx)(h.Z,{href:"/",children:(0,r.jsx)(l.default,{src:"/images/bg-login.png",alt:"bg-login",width:600,height:900,className:"w-[700px] h-[700px] rounded-l-2xl"})})]})}function y(){return(0,r.jsxs)("div",{className:"min-h-screen flex flex-col justify-center items-center",children:[(0,r.jsx)(m.x7,{position:"top-right"}),(0,r.jsx)(w,{})]})}},9555:function(e,t,n){"use strict";n.d(t,{Z:function(){return a}});var r=n(7437),s=n(1201);function a(e){let{className:t,children:n,onClick:a,disabled:i=!1,loading:o=!1,variant:c="primary",type:u="button"}=e;return(0,r.jsx)("button",{onClick:a,disabled:i||o,type:u,className:(0,s.cn)("w-[172px] h-[60px] text-[20px] text-center font-medium rounded-xl transition-all duration-200",{primary:"bg-pink-doca text-white hover:bg-pink-600",secondary:"bg-gray-500 text-white hover:bg-gray-600",outline:"border border-pink-doca text-pink-doca hover:bg-pink-doca hover:text-white"}[c],i&&"opacity-50 cursor-not-allowed",t),children:o?(0,r.jsx)("span",{className:"animate-spin",children:"⏳"}):n})}n(2265)},9701:function(e,t,n){"use strict";n.d(t,{Z:function(){return i}});var r=n(7437),s=n(9501),a=n(1201);function i(e){var t,n;let{name:i,label:o,type:c="text",placeholder:u,className:l,isTextArea:h=!1,autoComplete:d}=e,{register:p,formState:{errors:m}}=(0,s.Gc)();return(0,r.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,r.jsx)("label",{htmlFor:i,className:"text-base font-semibold",children:o}),h?(0,r.jsx)("textarea",{...p(i),id:i,placeholder:u,className:(0,a.cn)("px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500",l)}):(0,r.jsx)("input",{...p(i),id:i,type:c,placeholder:u,autoComplete:d,className:(0,a.cn)("px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500",l)}),m[i]&&(0,r.jsx)("p",{className:"text-red-500 text-sm",children:null===(n=m[i])||void 0===n?void 0:null===(t=n.message)||void 0===t?void 0:t.toString()})]})}},9680:function(e,t,n){"use strict";n.d(t,{Z:function(){return i}});var r=n(7437),s=n(1201),a=n(7648);function i(e){let{href:t,className:n,children:i}=e;return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(a.default,{href:t,className:(0,s.cn)("",n),children:i})})}},7693:function(e,t,n){"use strict";n.d(t,{Pn:function(){return s},kG:function(){return a},q7:function(){return r}});let r="https://production.doca.love",s={AUTH:{LOGIN:"/api/v1/login",SIGNUP:"/api/v1/signup",FORGET_PASSWORD:"/api/v1/forget-password",OTP:"/api/v1/otp"}},a=e=>(s.AUTH.LOGIN,"".concat(r).concat(e))},1201:function(e,t,n){"use strict";n.d(t,{cn:function(){return a}});var r=n(1994),s=n(3335);function a(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,s.m6)((0,r.Z)(t))}},5665:function(e,t,n){"use strict";n.d(t,{Iy:function(){return l},Qx:function(){return c},dm:function(){return a},gM:function(){return o},gT:function(){return h},if:function(){return i},kn:function(){return s},ot:function(){return u}});var r=n(4422);let s=r.Ry().shape({firstName:r.Z_().matches(/^[A-Za-zÀ-ỹ\s]+$/,"Họ chỉ được chứa chữ v\xe0 dấu").required("Họ kh\xf4ng được để trống"),lastName:r.Z_().matches(/^[A-Za-zÀ-ỹ\s]+$/,"T\xean chỉ được chứa chữ v\xe0 dấu").required("T\xean kh\xf4ng được để trống"),email:r.Z_().email("Invalid email").required("Email kh\xf4ng được để trống"),password:r.Z_().min(6,"Mật khẩu \xedt nhất 6 k\xfd tự").matches(/[!@#$%^&*(),.?":{}|<>]/,"Mật khẩu cần c\xf3 \xedt nhất 1 k\xfd tự đặc biệt").required("Mật khẩu kh\xf4ng được để trống"),confirmPassword:r.Z_().oneOf([r.iH("password")],"Mật khẩu x\xe1c nhận kh\xf4ng khớp").required("X\xe1c nhận mật khẩu kh\xf4ng được để trống"),phone:r.Z_().matches(/^[0-9]{10}$/,"Số điện thoại phải c\xf3 10 chữ số").required("Số điện thoại kh\xf4ng được để trống"),otp:r.Z_().required("OTP kh\xf4ng được để trống"),message:r.Z_().optional()}),a=r.Ry().shape({email:r.Z_().required("Email hoặc số điện thoại kh\xf4ng được để trống"),password:r.Z_().required("Mật khẩu kh\xf4ng được để trống")});s.pick(["firstName","lastName"]);let i=s.pick(["firstName","lastName","email","password","confirmPassword","phone","otp"]),o=r.Ry().shape({email:r.Z_().email("Email kh\xf4ng hợp lệ").required("Email kh\xf4ng được để trống")}),c=r.Ry().shape({otp:r.Z_().required("OTP kh\xf4ng được để trống")}),u=r.Ry().shape({password:r.Z_().min(6,"Mật khẩu \xedt nhất 6 k\xfd tự").matches(/[!@#$%^&*(),.?":{}|<>]/,"Mật khẩu cần c\xf3 \xedt nhất 1 k\xfd tự đặc biệt").required("Mật khẩu kh\xf4ng được để trống"),confirmPassword:r.Z_().oneOf([r.iH("password")],"Mật khẩu x\xe1c nhận kh\xf4ng khớp").required("X\xe1c nhận mật khẩu kh\xf4ng được để trống")}),l=r.Ry().shape({name:r.Z_().required("T\xean sản phẩm kh\xf4ng được để trống"),price:r.Rx().positive("Gi\xe1 phải l\xe0 số dương").required("Gi\xe1 kh\xf4ng được để trống"),description:r.Z_().required("M\xf4 tả kh\xf4ng được để trống"),categoryIds:r.IX().min(1,"Phải chọn \xedt nhất 1 danh mục"),mainImage:r.nK().test("fileSize","File qu\xe1 lớn",e=>!e||e.size<=5e6),quantity:r.Rx().required("Số lượng kh\xf4ng được để trống"),size:r.Z_().required("K\xedch thước kh\xf4ng được để trống")}),h=r.Ry().shape({title:r.Z_().required("Ti\xeau đề kh\xf4ng được để trống"),content:r.Z_().required("Nội dung kh\xf4ng được để trống"),status:r.Z_().oneOf(["DRAFT","PUBLISHED","URGENT","NEED_PRODUCT","NEED_DONATION"],"Trạng th\xe1i kh\xf4ng hợp lệ"),categoryIds:r.IX().min(1,"Phải chọn \xedt nhất 1 danh mục"),description:r.Z_().required("M\xf4 tả kh\xf4ng được để trống")});r.Ry().shape({productId:r.Z_().required(),quantity:r.Rx().min(1,"Số lượng tối thiểu l\xe0 1").required("Số lượng kh\xf4ng được để trống")})}},function(e){e.O(0,[648,878,137,915,464,99,619,971,117,744],function(){return e(e.s=2962)}),_N_E=e.O()}]);