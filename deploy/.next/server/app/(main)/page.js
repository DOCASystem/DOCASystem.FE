(() => {
  var e = {};
  (e.id = 974),
    (e.ids = [974]),
    (e.modules = {
      2934: (e) => {
        "use strict";
        e.exports = require("next/dist/client/components/action-async-storage.external.js");
      },
      4580: (e) => {
        "use strict";
        e.exports = require("next/dist/client/components/request-async-storage.external.js");
      },
      5869: (e) => {
        "use strict";
        e.exports = require("next/dist/client/components/static-generation-async-storage.external.js");
      },
      399: (e) => {
        "use strict";
        e.exports = require("next/dist/compiled/next-server/app-page.runtime.prod.js");
      },
      7790: (e) => {
        "use strict";
        e.exports = require("assert");
      },
      4770: (e) => {
        "use strict";
        e.exports = require("crypto");
      },
      7702: (e) => {
        "use strict";
        e.exports = require("events");
      },
      2048: (e) => {
        "use strict";
        e.exports = require("fs");
      },
      2615: (e) => {
        "use strict";
        e.exports = require("http");
      },
      8791: (e) => {
        "use strict";
        e.exports = require("https");
      },
      9801: (e) => {
        "use strict";
        e.exports = require("os");
      },
      5315: (e) => {
        "use strict";
        e.exports = require("path");
      },
      6162: (e) => {
        "use strict";
        e.exports = require("stream");
      },
      4175: (e) => {
        "use strict";
        e.exports = require("tty");
      },
      7360: (e) => {
        "use strict";
        e.exports = require("url");
      },
      1764: (e) => {
        "use strict";
        e.exports = require("util");
      },
      1568: (e) => {
        "use strict";
        e.exports = require("zlib");
      },
      3886: (e, t, i) => {
        "use strict";
        i.r(t),
          i.d(t, {
            GlobalError: () => r.a,
            __next_app__: () => m,
            originalPathname: () => l,
            pages: () => h,
            routeModule: () => g,
            tree: () => d,
          }),
          i(4332),
          i(2980),
          i(3817),
          i(2523);
        var n = i(3191),
          s = i(8716),
          a = i(7922),
          r = i.n(a),
          c = i(5231),
          o = {};
        for (let e in c)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "originalPathname",
              "__next_app__",
              "routeModule",
            ].indexOf(e) && (o[e] = () => c[e]);
        i.d(t, o);
        let d = [
            "",
            {
              children: [
                "(main)",
                {
                  children: [
                    "__PAGE__",
                    {},
                    {
                      page: [
                        () => Promise.resolve().then(i.bind(i, 4332)),
                        "D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(main)\\page.tsx",
                      ],
                    },
                  ],
                },
                {
                  layout: [
                    () => Promise.resolve().then(i.bind(i, 2980)),
                    "D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(main)\\layout.tsx",
                  ],
                },
              ],
            },
            {
              layout: [
                () => Promise.resolve().then(i.bind(i, 3817)),
                "D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\layout.tsx",
              ],
              "not-found": [
                () => Promise.resolve().then(i.bind(i, 2523)),
                "D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\not-found.tsx",
              ],
            },
          ],
          h = [
            "D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(main)\\page.tsx",
          ],
          l = "/(main)/page",
          m = { require: i, loadChunk: () => Promise.resolve() },
          g = new n.AppPageRouteModule({
            definition: {
              kind: s.x.APP_PAGE,
              page: "/(main)/page",
              pathname: "/",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: d },
          });
      },
      2518: (e, t, i) => {
        Promise.resolve().then(i.bind(i, 9753));
      },
      5047: (e, t, i) => {
        "use strict";
        var n = i(7389);
        i.o(n, "useParams") &&
          i.d(t, {
            useParams: function () {
              return n.useParams;
            },
          }),
          i.o(n, "usePathname") &&
            i.d(t, {
              usePathname: function () {
                return n.usePathname;
              },
            }),
          i.o(n, "useRouter") &&
            i.d(t, {
              useRouter: function () {
                return n.useRouter;
              },
            }),
          i.o(n, "useSearchParams") &&
            i.d(t, {
              useSearchParams: function () {
                return n.useSearchParams;
              },
            });
      },
      9753: (e, t, i) => {
        "use strict";
        i.r(t), i.d(t, { default: () => h });
        var n = i(326),
          s = i(6226),
          a = i(434),
          r = i(3529),
          c = i(4529),
          o = i(5727),
          d = i(1173);
        function h() {
          let e = o.ku.slice(0, 3),
            t = d.vF.slice(0, 3);
          return (0, n.jsxs)(n.Fragment, {
            children: [
              n.jsx("section", {
                className:
                  "relative bg-gradient-to-r from-pink-50 to-purple-50 overflow-hidden",
                children: (0, n.jsxs)("div", {
                  className:
                    "container mx-auto py-20 px-4 flex flex-col lg:flex-row items-center gap-12",
                  children: [
                    (0, n.jsxs)("div", {
                      className: "flex-1 space-y-6 pl-10",
                      children: [
                        n.jsx("h1", {
                          className: "text-[45px] font-semibold text-pink-doca",
                          children:
                            "Ch\xfang em cần y\xeau thương, một ch\xfat tấm l\xf2ng nhỏ.",
                        }),
                        n.jsx("p", {
                          className: "text-lg text-gray-600",
                          children:
                            "Để một con vật cảm thấy an to\xe0n v\xe0 hạnh ph\xfac, t\xecnh y\xeau thương v\xe0 sẻ chia l\xe0 điều v\xf4 c\xf9ng quan trọng.",
                        }),
                        (0, n.jsxs)("div", {
                          className: "pt-6 flex flex-wrap gap-4",
                          children: [
                            n.jsx(a.default, {
                              href: "/shop",
                              children: n.jsx(r.Z, {
                                className:
                                  "bg-pink-doca text-white hover:bg-pink-600 transition-colors",
                                children: "Mua sắm ngay",
                              }),
                            }),
                            n.jsx(a.default, {
                              href: "/service-doca",
                              children: n.jsx(r.Z, {
                                className:
                                  "bg-white text-pink-doca border border-pink-doca rounded-lg hover:bg-pink-50 transition-colors",
                                children: "Dịch vụ",
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    n.jsx("div", {
                      className: "flex-1 relative h-[400px] md:h-[500px]",
                      children: n.jsx(s.default, {
                        src: "/images/pet-love.png",
                        alt: "Pet love",
                        fill: !0,
                        className: "object-contain",
                        priority: !0,
                      }),
                    }),
                  ],
                }),
              }),
              n.jsx("section", {
                className: "py-16 bg-white",
                children: (0, n.jsxs)("div", {
                  className: "container mx-auto px-4",
                  children: [
                    (0, n.jsxs)("div", {
                      className:
                        "grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16",
                      children: [
                        (0, n.jsxs)("div", {
                          className:
                            "p-6 rounded-lg shadow-md bg-pink-50 hover:scale-105 transition-transform",
                          children: [
                            n.jsx("h3", {
                              className:
                                "text-4xl font-bold text-pink-doca mb-2",
                              children: "5000+",
                            }),
                            n.jsx("p", {
                              className: "text-gray-600",
                              children: "Kh\xe1ch h\xe0ng h\xe0i l\xf2ng",
                            }),
                          ],
                        }),
                        (0, n.jsxs)("div", {
                          className:
                            "p-6 rounded-lg shadow-md bg-purple-50 hover:scale-105 transition-transform",
                          children: [
                            n.jsx("h3", {
                              className:
                                "text-4xl font-bold text-pink-doca mb-2",
                              children: "200+",
                            }),
                            n.jsx("p", {
                              className: "text-gray-600",
                              children: "Sản phẩm chất lượng",
                            }),
                          ],
                        }),
                        (0, n.jsxs)("div", {
                          className:
                            "p-6 rounded-lg shadow-md bg-blue-50 hover:scale-105 transition-transform",
                          children: [
                            n.jsx("h3", {
                              className:
                                "text-4xl font-bold text-pink-doca mb-2",
                              children: "24/7",
                            }),
                            n.jsx("p", {
                              className: "text-gray-600",
                              children: "Hỗ trợ kh\xe1ch h\xe0ng",
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, n.jsxs)("div", {
                      className: "text-center mb-16",
                      children: [
                        n.jsx("h2", {
                          className: "text-3xl font-bold mb-6",
                          children: "Về Doca Pet Shop",
                        }),
                        n.jsx("p", {
                          className: "text-lg text-gray-600 max-w-3xl mx-auto",
                          children:
                            "Ch\xfang t\xf4i cung cấp đa dạng c\xe1c sản phẩm thức ăn th\xfa cưng với chất lượng cao. Qua đ\xf3 gi\xfap đỡ c\xe1c b\xe9 c\xf3 ho\xe0n cảnh kh\xf3 khăn c\xf3 thể được chăm s\xf3c tốt hơn.",
                        }),
                        n.jsx("div", {
                          className: "mt-8",
                          children: n.jsx(a.default, {
                            href: "/about-us",
                            children: n.jsx(r.Z, {
                              className:
                                "bg-pink-doca text-white rounded-lg hover:bg-pink-600 transition-colors",
                              children: "T\xecm hiểu th\xeam",
                            }),
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              n.jsx("section", {
                className: "py-16 bg-gray-50",
                children: (0, n.jsxs)("div", {
                  className: "container mx-auto px-4",
                  children: [
                    (0, n.jsxs)("div", {
                      className: "text-center mb-12",
                      children: [
                        n.jsx("h2", {
                          className: "text-3xl font-bold mb-4",
                          children: "Sản phẩm nổi bật",
                        }),
                        n.jsx("p", {
                          className: "text-lg text-gray-600 max-w-2xl mx-auto",
                          children:
                            "Kh\xe1m ph\xe1 những sản phẩm chăm s\xf3c th\xfa cưng tốt nhất của ch\xfang t\xf4i",
                        }),
                      ],
                    }),
                    n.jsx("div", {
                      className:
                        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10",
                      children: e.map((e) =>
                        n.jsx(
                          "div",
                          {
                            className:
                              "hover:-translate-y-2 transition-transform duration-300",
                            children: n.jsx(c.Z, { product: e }),
                          },
                          e.id
                        )
                      ),
                    }),
                    n.jsx("div", {
                      className: "text-center",
                      children: n.jsx(a.default, {
                        href: "/shop",
                        children: n.jsx(r.Z, {
                          className:
                            "bg-pink-doca text-white rounded-lg hover:bg-pink-600 transition-colors",
                          children: "Xem Th\xeam",
                        }),
                      }),
                    }),
                  ],
                }),
              }),
              n.jsx("section", {
                className: "py-16 bg-gray-50",
                children: (0, n.jsxs)("div", {
                  className: "container mx-auto px-4",
                  children: [
                    (0, n.jsxs)("div", {
                      className: "text-center mb-12",
                      children: [
                        n.jsx("h2", {
                          className: "text-3xl font-bold mb-4",
                          children: "B\xe0i viết mới nhất",
                        }),
                        n.jsx("p", {
                          className: "text-lg text-gray-600 max-w-2xl mx-auto",
                          children:
                            "Cập nhật những th\xf4ng tin về những b\xe9 th\xfa cưng mới nhất",
                        }),
                      ],
                    }),
                    n.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-8",
                      children: t.map((e) =>
                        n.jsx(
                          "div",
                          {
                            className:
                              "rounded-lg overflow-hidden shadow-md bg-white hover:-translate-y-2 transition-transform duration-300",
                            children: (0, n.jsxs)(a.default, {
                              href: `/blog/${e.id}`,
                              children: [
                                n.jsx("div", {
                                  className: "relative h-48",
                                  children: n.jsx(s.default, {
                                    src: "/images/blog-placeholder.png",
                                    alt: e.name || "B\xe0i viết",
                                    fill: !0,
                                    className: "object-cover",
                                  }),
                                }),
                                (0, n.jsxs)("div", {
                                  className: "p-6",
                                  children: [
                                    n.jsx("h3", {
                                      className:
                                        "text-xl font-bold mb-2 line-clamp-2",
                                      children: e.name,
                                    }),
                                    n.jsx("p", {
                                      className:
                                        "text-gray-600 mb-4 line-clamp-3",
                                      children: e.description,
                                    }),
                                    n.jsx("span", {
                                      className: "text-pink-doca font-medium",
                                      children: "Đọc th\xeam →",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          },
                          e.id
                        )
                      ),
                    }),
                    n.jsx("div", {
                      className: "text-center mt-10",
                      children: n.jsx(a.default, {
                        href: "/blog",
                        children: n.jsx(r.Z, {
                          className:
                            "bg-pink-doca text-white rounded-lg hover:bg-pink-600 transition-colors",
                          children: "Xem th\xeam",
                        }),
                      }),
                    }),
                  ],
                }),
              }),
              n.jsx("section", {
                className: "py-10 bg-pink-doca text-white",
                children: (0, n.jsxs)("div", {
                  className: "container mx-auto px-4 text-center",
                  children: [
                    n.jsx("h2", {
                      className: "text-3xl font-bold mb-6",
                      children: "Bạn cần hỗ trợ?",
                    }),
                    (0, n.jsxs)("div", {
                      className: "flex flex-wrap justify-center gap-4",
                      children: [
                        n.jsx(a.default, {
                          href: "/contact",
                          children: n.jsx(r.Z, {
                            className:
                              "bg-white text-pink-doca rounded-lg hover:bg-gray-100 transition-colors",
                            children: "Li\xean hệ ngay",
                          }),
                        }),
                        n.jsx(a.default, {
                          href: "/about-us",
                          children: n.jsx(r.Z, {
                            className:
                              "bg-transparent border border-white text-white  rounded-lg hover:bg-white hover:text-pink-doca transition-colors",
                            children: "T\xecm hiểu th\xeam",
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          });
        }
      },
      3529: (e, t, i) => {
        "use strict";
        i.d(t, { Z: () => a });
        var n = i(326),
          s = i(7524);
        function a({
          className: e,
          children: t,
          onClick: i,
          disabled: a = !1,
          loading: r = !1,
          variant: c = "primary",
          type: o = "button",
        }) {
          return n.jsx("button", {
            onClick: i,
            disabled: a || r,
            type: o,
            className: (0, s.cn)(
              "w-[172px] h-[60px] text-[20px] text-center font-medium rounded-xl transition-all duration-200",
              {
                primary: "bg-pink-doca text-white hover:bg-pink-600",
                secondary: "bg-gray-500 text-white hover:bg-gray-600",
                outline:
                  "border border-pink-doca text-pink-doca hover:bg-pink-doca hover:text-white",
              }[c],
              a && "opacity-50 cursor-not-allowed",
              e
            ),
            children: r
              ? n.jsx("span", { className: "animate-spin", children: "⏳" })
              : t,
          });
        }
        i(7577);
      },
      4529: (e, t, i) => {
        "use strict";
        i.d(t, { Z: () => r });
        var n = i(326),
          s = i(6226),
          a = i(434);
        function r({ product: e }) {
          var t;
          let i = {
              id: "1",
              name: "Thức ăn cho m\xe8o - Whiskas 1.2kg",
              prices: 12e4,
            },
            r =
              (e?.productImages &&
                e.productImages.length > 0 &&
                e.productImages[0].imageUrl) ||
              "/images/food-test.png";
          return n.jsx("div", {
            className: "w-full border-2 border-slate-100 rounded-[20px]",
            children: (0, n.jsxs)(a.default, {
              href: `/shop/${e?.id || i.id}`,
              children: [
                n.jsx("div", {
                  className: "relative aspect-square",
                  children: n.jsx(s.default, {
                    src: r,
                    alt: e?.name || i.name,
                    fill: !0,
                    sizes: "100%",
                    className: "object-cover rounded-t-[20px]",
                  }),
                }),
                (0, n.jsxs)("div", {
                  className: "p-5 bg-slate-100 rounded-b-[20px]",
                  children: [
                    n.jsx("p", {
                      className: "mb-3 font-semibold line-clamp-2 h-12",
                      children: e?.name || i.name,
                    }),
                    (0, n.jsxs)("div", {
                      className: "flex flex-row justify-between items-center",
                      children: [
                        n.jsx("p", {
                          className: "text-pink-doca font-bold",
                          children: (t = e?.price || i.prices)
                            ? new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(t)
                            : "0 VND",
                        }),
                        n.jsx("button", {
                          className:
                            "bg-pink-doca text-white p-2 rounded-full hover:bg-pink-600 transition-colors",
                          children: (0, n.jsxs)("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "20",
                            height: "20",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: [
                              n.jsx("path", { d: "M9 20h6" }),
                              n.jsx("path", { d: "M12 16v4" }),
                              n.jsx("path", { d: "M6.33 12h11.34" }),
                              n.jsx("path", { d: "M5 10 2 7l3-3" }),
                              n.jsx("path", { d: "m19 10 3-3-3-3" }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          });
        }
      },
      5727: (e, t, i) => {
        "use strict";
        i.d(t, { VB: () => a, ku: () => n, lz: () => s });
        let n = [
            {
              id: "1",
              name: "Thức ăn cho m\xe8o - Whiskas 1.2kg",
              description:
                "Thức ăn hạt cho m\xe8o Whiskas gi\xfap m\xe8o cưng của bạn ph\xe1t triển khỏe mạnh. Sản phẩm gi\xe0u dinh dưỡng, protein chất lượng cao v\xe0 c\xe1c vitamin thiết yếu.",
              quantity: 50,
              price: 12e4,
              createdAt: "2023-10-15T08:00:00Z",
              modifiedAt: "2023-10-15T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img1", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat1", name: "Đồ ăn cho m\xe8o" }],
            },
            {
              id: "2",
              name: "Thức ăn cho ch\xf3 - Pedigree 1.5kg",
              description:
                "Thức ăn hạt d\xe0nh cho ch\xf3 Pedigree gi\xfap c\xfan cưng của bạn khỏe mạnh v\xe0 năng động. Th\xe0nh phần gi\xe0u dinh dưỡng, dễ ti\xeau h\xf3a.",
              quantity: 45,
              price: 15e4,
              createdAt: "2023-10-20T08:00:00Z",
              modifiedAt: "2023-10-20T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img2", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat2", name: "Đồ ăn cho ch\xf3" }],
            },
            {
              id: "3",
              name: "Đồ chơi cho m\xe8o - Cần c\xe2u chuột",
              description:
                "Đồ chơi cần c\xe2u chuột cho m\xe8o gi\xfap th\xfa cưng vận động v\xe0 giải tr\xed. Chất liệu an to\xe0n, bền bỉ.",
              quantity: 30,
              price: 75e3,
              createdAt: "2023-11-05T08:00:00Z",
              modifiedAt: "2023-11-05T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img3", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat3", name: "Đồ chơi cho m\xe8o" }],
            },
            {
              id: "4",
              name: "V\xf2ng cổ cho ch\xf3 - Size M",
              description:
                "V\xf2ng cổ chất lượng cao d\xe0nh cho ch\xf3 vừa v\xe0 nhỏ. Chất liệu tho\xe1ng kh\xed, kh\xf4ng g\xe2y k\xedch ứng da.",
              quantity: 25,
              price: 9e4,
              createdAt: "2023-11-10T08:00:00Z",
              modifiedAt: "2023-11-10T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img4", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat4", name: "Phụ kiện cho ch\xf3" }],
            },
            {
              id: "5",
              name: "Khay vệ sinh cho m\xe8o",
              description:
                "Khay vệ sinh cho m\xe8o với thiết kế hiện đại, dễ d\xe0ng vệ sinh v\xe0 khử m\xf9i hiệu quả.",
              quantity: 15,
              price: 18e4,
              createdAt: "2023-11-15T08:00:00Z",
              modifiedAt: "2023-11-15T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img5", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat5", name: "Phụ kiện cho m\xe8o" }],
            },
            {
              id: "6",
              name: "C\xe1t vệ sinh cho m\xe8o - 5kg",
              description:
                "C\xe1t vệ sinh chất lượng cao, khả năng h\xfat ẩm mạnh v\xe0 khử m\xf9i hiệu quả, an to\xe0n cho m\xe8o cưng.",
              quantity: 40,
              price: 11e4,
              createdAt: "2023-11-20T08:00:00Z",
              modifiedAt: "2023-11-20T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img6", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat5", name: "Phụ kiện cho m\xe8o" }],
            },
            {
              id: "7",
              name: "B\xe1t ăn cho ch\xf3 - Inox",
              description:
                "B\xe1t ăn cho ch\xf3 l\xe0m từ Inox cao cấp, kh\xf4ng gỉ, dễ d\xe0ng vệ sinh, đảm bảo an to\xe0n vệ sinh thực phẩm.",
              quantity: 35,
              price: 85e3,
              createdAt: "2023-11-25T08:00:00Z",
              modifiedAt: "2023-11-25T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img7", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat4", name: "Phụ kiện cho ch\xf3" }],
            },
            {
              id: "8",
              name: "Sữa tắm cho ch\xf3 m\xe8o - 500ml",
              description:
                "Sữa tắm cho ch\xf3 m\xe8o gi\xfap l\xe0m sạch, khử m\xf9i v\xe0 bảo vệ da, l\xf4ng của th\xfa cưng. Hương thơm dễ chịu, dưỡng ẩm tốt.",
              quantity: 20,
              price: 135e3,
              createdAt: "2023-12-01T08:00:00Z",
              modifiedAt: "2023-12-01T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img8", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat6", name: "Chăm s\xf3c th\xfa cưng" }],
            },
            {
              id: "9",
              name: "Lược chải l\xf4ng cho ch\xf3 m\xe8o",
              description:
                "Lược chải l\xf4ng chất lượng cao, gi\xfap loại bỏ l\xf4ng rụng, bụi bẩn v\xe0 ngăn ngừa rối l\xf4ng cho th\xfa cưng.",
              quantity: 25,
              price: 65e3,
              createdAt: "2023-12-05T08:00:00Z",
              modifiedAt: "2023-12-05T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img9", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat6", name: "Chăm s\xf3c th\xfa cưng" }],
            },
            {
              id: "10",
              name: "Thức ăn hạt cho ch\xf3 con - Royal Canin 1kg",
              description:
                "Thức ăn hạt chuy\xean biệt cho ch\xf3 con, gi\xfap ph\xe1t triển xương v\xe0 cơ bắp khỏe mạnh. Cung cấp đầy đủ dưỡng chất cho giai đoạn ph\xe1t triển.",
              quantity: 30,
              price: 25e4,
              createdAt: "2023-12-10T08:00:00Z",
              modifiedAt: "2023-12-10T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img10", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat2", name: "Đồ ăn cho ch\xf3" }],
            },
            {
              id: "11",
              name: "Pate cho m\xe8o - Whiskas 85g",
              description:
                "Pate Whiskas cho m\xe8o với th\xe0nh phần dinh dưỡng cao, đảm bảo bữa ăn ngon miệng v\xe0 đầy đủ dưỡng chất cho m\xe8o cưng.",
              quantity: 100,
              price: 2e4,
              createdAt: "2023-12-15T08:00:00Z",
              modifiedAt: "2023-12-15T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img11", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat1", name: "Đồ ăn cho m\xe8o" }],
            },
            {
              id: "12",
              name: "Nh\xe0 c\xe2y cho m\xe8o - Size M",
              description:
                "Nh\xe0 c\xe2y cho m\xe8o với nhiều tầng, g\xf3c nghỉ v\xe0 khu vực leo tr\xe8o, gi\xfap m\xe8o vận động v\xe0 thỏa m\xe3n bản năng tự nhi\xean.",
              quantity: 10,
              price: 85e4,
              createdAt: "2023-12-20T08:00:00Z",
              modifiedAt: "2023-12-20T08:00:00Z",
              isHidden: !1,
              productImages: [
                { id: "img12", imageUrl: "/images/food-test.png" },
              ],
              categories: [{ id: "cat5", name: "Phụ kiện cho m\xe8o" }],
            },
          ],
          s = (e = 1, t = 9, i) => {
            let s = [...n];
            i &&
              (i.categoryIds &&
                i.categoryIds.length > 0 &&
                (s = s.filter((e) =>
                  e.categories?.some((e) =>
                    i.categoryIds?.includes(e.name || "")
                  )
                )),
              void 0 !== i.minPrice &&
                (s = s.filter((e) => (e.price || 0) >= (i.minPrice || 0))),
              void 0 !== i.maxPrice &&
                (s = s.filter((e) => (e.price || 0) <= (i.maxPrice || 1 / 0))));
            let a = s.length,
              r = Math.ceil(a / t),
              c = e > r ? r : e,
              o = (c - 1) * t,
              d = s.slice(o, Math.min(o + t, a));
            return {
              data: { size: t, page: c, total: a, totalPages: r, items: d },
            };
          },
          a = (e, t = 4) => {
            let i = [...n.filter((t) => t.id !== e)]
              .sort(() => 0.5 - Math.random())
              .slice(0, t);
            return { data: { items: i, total: i.length } };
          };
      },
      4332: (e, t, i) => {
        "use strict";
        i.r(t), i.d(t, { default: () => n });
        let n = (0, i(8570).createProxy)(
          String.raw`D:\CN8-FPT\EXE\FE\doca-system-fe\src\app\(main)\page.tsx#default`
        );
      },
    });
  var t = require("../../webpack-runtime.js");
  t.C(e);
  var i = (e) => t((t.s = e)),
    n = t.X(0, [95, 772, 821, 455], () => i(3886));
  module.exports = n;
})();
