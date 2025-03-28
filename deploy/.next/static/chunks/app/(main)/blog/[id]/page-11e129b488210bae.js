(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [132],
  {
    3949: function (e, t, l) {
      Promise.resolve().then(l.bind(l, 3294));
    },
    3294: function (e, t, l) {
      "use strict";
      l.r(t),
        l.d(t, {
          default: function () {
            return c;
          },
        });
      var s = l(7437),
        a = l(2265),
        n = l(7648),
        i = l(3145),
        r = l(1642);
      function c(e) {
        var t, l;
        let { params: c } = e,
          [o, d] = (0, a.useState)(null),
          [h, m] = (0, a.useState)(!0),
          [x, u] = (0, a.useState)(null);
        if (
          ((0, a.useEffect)(() => {
            (async () => {
              m(!0);
              try {
                let e = (0, r.zv)(c.id);
                d(e.data);
              } catch (e) {
                console.error("Error fetching blog details:", e),
                  u("Kh\xf4ng thể tải th\xf4ng tin b\xe0i viết");
              } finally {
                m(!1);
              }
            })();
          }, [c.id]),
          h)
        )
          return (0, s.jsx)("div", {
            className: "container mx-auto py-20 text-center",
            children: (0, s.jsx)("div", {
              className: "animate-pulse",
              children: "Đang tải th\xf4ng tin b\xe0i viết...",
            }),
          });
        if (x || !o)
          return (0, s.jsxs)("div", {
            className: "container mx-auto py-20 text-center",
            children: [
              (0, s.jsx)("div", {
                className: "text-red-500",
                children: x || "Kh\xf4ng t\xecm thấy b\xe0i viết",
              }),
              (0, s.jsx)(n.default, {
                href: "/blog",
                className:
                  "mt-4 inline-block bg-pink-doca text-white px-4 py-2 rounded",
                children: "Quay lại trang blog",
              }),
            ],
          });
        let v =
          (null === (t = o.blogCategories) || void 0 === t
            ? void 0
            : t
                .map((e) => e.name)
                .filter(Boolean)
                .join(", ")) || "";
        return (0, s.jsxs)("div", {
          className: "container mx-auto py-10 px-4",
          children: [
            (0, s.jsx)("div", {
              className: "mb-6",
              children: (0, s.jsxs)(n.default, {
                href: "/blog",
                className:
                  "text-gray-600 hover:text-pink-doca flex items-center gap-2",
                children: [
                  (0, s.jsx)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5",
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    children: (0, s.jsx)("path", {
                      fillRule: "evenodd",
                      d: "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z",
                      clipRule: "evenodd",
                    }),
                  }),
                  "Quay lại trang blog",
                ],
              }),
            }),
            (0, s.jsxs)("article", {
              className: "max-w-4xl mx-auto",
              children: [
                (0, s.jsxs)("header", {
                  className: "mb-10",
                  children: [
                    (0, s.jsx)("h1", {
                      className: "text-3xl md:text-4xl font-bold mb-4",
                      children: o.name,
                    }),
                    (0, s.jsxs)("div", {
                      className:
                        "flex flex-wrap items-center text-gray-600 mb-6 gap-4",
                      children: [
                        (0, s.jsxs)("div", {
                          className: "flex items-center",
                          children: [
                            (0, s.jsx)("svg", {
                              xmlns: "http://www.w3.org/2000/svg",
                              className: "h-5 w-5 mr-1",
                              fill: "none",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor",
                              children: (0, s.jsx)("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                              }),
                            }),
                            (0, s.jsx)("span", {
                              children: (l = o.createdAt)
                                ? new Date(l).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "",
                            }),
                          ],
                        }),
                        v &&
                          (0, s.jsxs)("div", {
                            className: "flex items-center",
                            children: [
                              (0, s.jsx)("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                className: "h-5 w-5 mr-1",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                children: (0, s.jsx)("path", {
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: 2,
                                  d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
                                }),
                              }),
                              (0, s.jsx)("span", { children: v }),
                            ],
                          }),
                      ],
                    }),
                  ],
                }),
                (0, s.jsx)("div", {
                  className:
                    "relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden",
                  children: (0, s.jsx)(i.default, {
                    src: "/images/blog-placeholder.png",
                    alt: o.name || "B\xe0i viết",
                    fill: !0,
                    sizes: "100%",
                    className: "object-cover",
                    priority: !0,
                  }),
                }),
                (0, s.jsx)("div", {
                  className: "prose prose-lg max-w-none",
                  children: (0, s.jsx)("div", {
                    className: "whitespace-pre-line",
                    children: o.description,
                  }),
                }),
              ],
            }),
          ],
        });
      }
    },
  },
  function (e) {
    e.O(0, [648, 878, 464, 619, 356, 971, 117, 744], function () {
      return e((e.s = 3949));
    }),
      (_N_E = e.O());
  },
]);
