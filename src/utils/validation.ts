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
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Mật khẩu cần có ít nhất 1 ký tự đặc biệt"
    )
    .required("Mật khẩu không được để trống"),
  message: yup.string().optional(),
});

export const loginSchema = formSchema.pick(["email", "password"]);
export const contactSchema = formSchema.pick(["firstName", "lastName"]);
