import * as yup from "yup";

export const formSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[A-Za-zÀ-ỹ\s]+$/, "Họ chỉ được chứa chữ và dấu")
    .required("Họ không được để trống"),
  lastName: yup
    .string()
    .matches(/^[A-Za-zÀ-ỹ\s]+$/, "Tên chỉ được chứa chữ và dấu")
    .required("Tên không được để trống"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email không được để trống"),
  password: yup
    .string()
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Mật khẩu cần có ít nhất 1 ký tự đặc biệt"
    )
    .required("Mật khẩu không được để trống"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu không được để trống"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
    .required("Số điện thoại không được để trống"),
  otp: yup.string().required("OTP không được để trống"),
  message: yup.string().optional(),
});

export const loginSchema = formSchema.pick(["email", "password"]);
export const contactSchema = formSchema.pick(["firstName", "lastName"]);
export const signupSchema = formSchema.pick([
  "firstName",
  "lastName",
  "email",
  "password",
  "confirmPassword",
  "phone",
  "otp",
]);
