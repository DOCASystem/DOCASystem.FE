(() => {
  var e = {};
  (e.id = 517),
    (e.ids = [517]),
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
      275: (e, t, s) => {
        "use strict";
        s.r(t),
          s.d(t, {
            GlobalError: () => n.a,
            __next_app__: () => p,
            originalPathname: () => x,
            pages: () => d,
            routeModule: () => u,
            tree: () => c,
          }),
          s(3413),
          s(2980),
          s(3817),
          s(2523);
        var r = s(3191),
          a = s(8716),
          i = s(7922),
          n = s.n(i),
          l = s(5231),
          o = {};
        for (let e in l)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "originalPathname",
              "__next_app__",
              "routeModule",
            ].indexOf(e) && (o[e] = () => l[e]);
        s.d(t, o);
        let c = [
            "",
            {
              children: [
                "(main)",
                {
                  children: [
                    "blog",
                    {
                      children: [
                        "__PAGE__",
                        {},
                        {
                          page: [
                            () => Promise.resolve().then(s.bind(s, 3413)),
                            "D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(main)\\blog\\page.tsx",
                          ],
                        },
                      ],
                    },
                    {},
                  ],
                },
                {
                  layout: [
                    () => Promise.resolve().then(s.bind(s, 2980)),
                    "D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(main)\\layout.tsx",
                  ],
                },
              ],
            },
            {
              layout: [
                () => Promise.resolve().then(s.bind(s, 3817)),
                "D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\layout.tsx",
              ],
              "not-found": [
                () => Promise.resolve().then(s.bind(s, 2523)),
                "D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\not-found.tsx",
              ],
            },
          ],
          d = [
            "D:\\CN8-FPT\\EXE\\FE\\doca-system-fe\\src\\app\\(main)\\blog\\page.tsx",
          ],
          x = "/(main)/blog/page",
          p = { require: s, loadChunk: () => Promise.resolve() },
          u = new r.AppPageRouteModule({
            definition: {
              kind: a.x.APP_PAGE,
              page: "/(main)/blog/page",
              pathname: "/blog",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: c },
          });
      },
      8274: (e, t, s) => {
        Promise.resolve().then(s.t.bind(s, 2481, 23)),
          Promise.resolve().then(s.bind(s, 3254));
      },
      1223: (e, t, s) => {
        "use strict";
        s.d(t, { Z: () => a });
        var r = s(326);
        s(7577);
        let a = ({
          currentPage: e,
          totalPages: t,
          onPageChange: s,
          className: a = "",
        }) => {
          let i = () => {
            let s = [],
              r = Math.max(1, e - 1),
              a = Math.min(t, e + 1);
            for (let e = r; e <= a; e++) s.push(e);
            return s;
          };
          return t <= 1
            ? null
            : r.jsx("div", {
                className: `flex justify-center items-center mt-6 ${a}`,
                children: (0, r.jsxs)("nav", {
                  className: "flex items-center space-x-1",
                  children: [
                    r.jsx("button", {
                      onClick: () => e > 1 && s(e - 1),
                      disabled: 1 === e,
                      className: `px-3 py-1 rounded-md ${
                        1 === e
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-pink-100"
                      }`,
                      children: "\xab",
                    }),
                    !i().includes(1) &&
                      (0, r.jsxs)(r.Fragment, {
                        children: [
                          r.jsx("button", {
                            onClick: () => s(1),
                            className: "px-3 py-1 rounded-md hover:bg-pink-100",
                            children: "1",
                          }),
                          i()[0] > 2 &&
                            r.jsx("span", {
                              className: "px-2 py-1",
                              children: "...",
                            }),
                        ],
                      }),
                    i().map((t) =>
                      r.jsx(
                        "button",
                        {
                          onClick: () => s(t),
                          className: `px-3 py-1 rounded-md ${
                            e === t
                              ? "bg-pink-doca text-white"
                              : "hover:bg-pink-100"
                          }`,
                          children: t,
                        },
                        t
                      )
                    ),
                    !i().includes(t) &&
                      t > 1 &&
                      (0, r.jsxs)(r.Fragment, {
                        children: [
                          i()[i().length - 1] < t - 1 &&
                            r.jsx("span", {
                              className: "px-2 py-1",
                              children: "...",
                            }),
                          r.jsx("button", {
                            onClick: () => s(t),
                            className: "px-3 py-1 rounded-md hover:bg-pink-100",
                            children: t,
                          }),
                        ],
                      }),
                    r.jsx("button", {
                      onClick: () => e < t && s(e + 1),
                      disabled: e === t,
                      className: `px-3 py-1 rounded-md ${
                        e === t
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-pink-100"
                      }`,
                      children: "\xbb",
                    }),
                  ],
                }),
              });
        };
      },
      3254: (e, t, s) => {
        "use strict";
        s.d(t, { default: () => o });
        var r = s(326),
          a = s(7577),
          i = s(434),
          n = s(6226),
          l = s(1223);
        function o() {
          let [e, t] = (0, a.useState)([]),
            [s, o] = (0, a.useState)(!0),
            [c, d] = (0, a.useState)(1),
            [x, p] = (0, a.useState)(1),
            u = (e) =>
              e
                ? new Date(e).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "";
          return s
            ? r.jsx("div", {
                className: "container mx-auto text-center py-10",
                children: "Đang tải b\xe0i viết...",
              })
            : r.jsx("div", {
                className: "container mx-auto px-4",
                children:
                  0 === e.length
                    ? r.jsx("div", {
                        className: "text-center py-10",
                        children: "Kh\xf4ng c\xf3 b\xe0i viết n\xe0o",
                      })
                    : (0, r.jsxs)(r.Fragment, {
                        children: [
                          r.jsx("div", {
                            className:
                              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                            children: e.map((e) =>
                              r.jsx(
                                "div",
                                {
                                  className:
                                    "border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                                  children: (0, r.jsxs)(i.default, {
                                    href: `/blog/${e.id}`,
                                    children: [
                                      r.jsx("div", {
                                        className: "relative h-48",
                                        children: r.jsx(n.default, {
                                          src: "/images/blog-placeholder.png",
                                          alt: e.name || "B\xe0i viết",
                                          fill: !0,
                                          sizes: "100%",
                                          className: "object-cover",
                                        }),
                                      }),
                                      (0, r.jsxs)("div", {
                                        className: "p-4",
                                        children: [
                                          r.jsx("div", {
                                            className:
                                              "text-gray-500 text-sm mb-2",
                                            children: u(e.createdAt),
                                          }),
                                          r.jsx("h3", {
                                            className:
                                              "text-xl font-bold mb-2 line-clamp-2",
                                            children: e.name,
                                          }),
                                          r.jsx("p", {
                                            className:
                                              "text-gray-600 line-clamp-3",
                                            children: e.description,
                                          }),
                                          r.jsx("div", {
                                            className:
                                              "mt-4 text-pink-doca font-semibold",
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
                          r.jsx("div", {
                            className: "mt-10 flex justify-center",
                            children: r.jsx(l.Z, {
                              currentPage: c,
                              totalPages: x,
                              onPageChange: (e) => {
                                d(e);
                              },
                            }),
                          }),
                        ],
                      }),
              });
        }
        s(1173);
      },
      3413: (e, t, s) => {
        "use strict";
        s.r(t), s.d(t, { default: () => l });
        var r = s(9510);
        let a = (0, s(8570).createProxy)(
          String.raw`D:\CN8-FPT\EXE\FE\doca-system-fe\src\components\sections\blog\blog-list\blog-list.tsx#default`
        );
        var i = s(7710);
        function n() {
          return (0, r.jsxs)("div", {
            className: "flex flex-row justify-between items-center gap-1 px-10",
            children: [
              (0, r.jsxs)("div", {
                className: "w-[456px] flex flex-col gap-7 pt-2",
                children: [
                  r.jsx("p", {
                    className: "text-[32px] font-semibold",
                    children:
                      "T\xecnh y\xeau kh\xf4ng mua được, nhưng c\xf3 thể nhận từ th\xfa cưng.",
                  }),
                  r.jsx("p", {
                    className: "text-[16px]/[160%]",
                    children:
                      "Sự gắn b\xf3 với ch\xf3 m\xe8o kh\xf4ng phải bằng tiền bạc, m\xe0 bằng t\xecnh cảm ch\xe2n thật m\xe0 ch\xfang mang lại.",
                  }),
                ],
              }),
              (0, r.jsxs)("div", {
                className: "relative w-[800px] h-[500px]",
                children: [
                  r.jsx(i.default, {
                    src: "/images/bg-header.png",
                    alt: "Header Home",
                    width: 700,
                    height: 600,
                    className: "absolute top-0 left-0 w-full h-full",
                  }),
                  r.jsx(i.default, {
                    src: "/images/pet-foot.png",
                    alt: "Pet love",
                    width: 400,
                    height: 600,
                    className:
                      "absolute top-[60%] left-1/2 transform -translate-x-[45%] -translate-y-1/2 z-10",
                  }),
                ],
              }),
            ],
          });
        }
        function l() {
          return (0, r.jsxs)("div", {
            children: [
              r.jsx(n, {}),
              r.jsx("div", { className: "my-10", children: r.jsx(a, {}) }),
            ],
          });
        }
      },
    });
  var t = require("../../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    r = t.X(0, [95, 772, 27, 821, 455], () => s(275));
  module.exports = r;
})();
