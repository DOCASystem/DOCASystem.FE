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

// Schema riêng cho đăng nhập
export const loginSchema = yup.object().shape({
  email: yup.string().required("Email hoặc số điện thoại không được để trống"),
  password: yup.string().required("Mật khẩu không được để trống"),
});

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

// Schema cho form quên mật khẩu
export const forgotPasswordEmailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
});

export const forgotPasswordOtpSchema = yup.object().shape({
  otp: yup.string().required("OTP không được để trống"),
});

export const forgotPasswordResetSchema = yup.object().shape({
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
});

// Product validation
export const productSchema = yup.object().shape({
  name: yup.string().required("Tên sản phẩm không được để trống"),
  price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .positive("Giá phải là số dương")
    .required("Giá không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
  categoryIds: yup
    .mixed()
    .test("is-valid-category", "Phải chọn một danh mục", (value) => {
      if (typeof value === "string") return value !== "";
      if (Array.isArray(value)) return value.length > 0;
      return false;
    })
    .required("Danh mục không được để trống"),
  quantity: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, "Số lượng không được âm")
    .required("Số lượng không được để trống"),
  volume: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .positive("Khối lượng phải là số dương")
    .required("Khối lượng không được để trống"),
  isHidden: yup.boolean().default(false),
  productImages: yup
    .array()
    .of(
      yup.object().shape({
        imageUrl: yup.string().required("URL hình ảnh không được để trống"),
        isMain: yup.boolean(),
      })
    )
    .min(1, "Bắt buộc phải có ít nhất một hình ảnh cho sản phẩm")
    .required("Hình ảnh sản phẩm là bắt buộc"),
});

// Blog validation
export const blogSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề không được để trống"),
  content: yup.string().required("Nội dung không được để trống"),
  status: yup
    .string()
    .oneOf(
      ["DRAFT", "PUBLISHED", "URGENT", "NEED_PRODUCT", "NEED_DONATION"],
      "Trạng thái không hợp lệ"
    ),
  categoryIds: yup.array().min(1, "Phải chọn ít nhất 1 danh mục"),
  description: yup.string().required("Mô tả không được để trống"),
});

// Cart validation
export const cartItemSchema = yup.object().shape({
  productId: yup.string().required(),
  quantity: yup
    .number()
    .min(1, "Số lượng tối thiểu là 1")
    .required("Số lượng không được để trống"),
});
