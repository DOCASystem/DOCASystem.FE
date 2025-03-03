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

// Product validation
export const productSchema = yup.object().shape({
  name: yup.string().required("Tên sản phẩm không được để trống"),
  price: yup
    .number()
    .positive("Giá phải là số dương")
    .required("Giá không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
  categoryIds: yup.array().min(1, "Phải chọn ít nhất 1 danh mục"),
  mainImage: yup
    .mixed<File>()
    .test(
      "fileSize",
      "File quá lớn",
      (value) => !value || value.size <= 5000000
    ),
});

// Blog validation
export const blogSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề không được để trống"),
  content: yup.string().required("Nội dung không được để trống"),
  status: yup.string().oneOf(["DRAFT", "PUBLISHED"]),
  categoryIds: yup.array().min(1, "Phải chọn ít nhất 1 danh mục"),
});

// Cart validation
export const cartItemSchema = yup.object().shape({
  productId: yup.string().required(),
  quantity: yup
    .number()
    .min(1, "Số lượng tối thiểu là 1")
    .required("Số lượng không được để trống"),
});
