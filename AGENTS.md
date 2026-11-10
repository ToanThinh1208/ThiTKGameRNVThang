# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make (**Rắn & Thang – Hành trình Đổi mới Việt Nam**).

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure & Architecture Rules

This project strictly follows a **Feature-based Architecture** inside `src/`. Whenever adding or modifying code, **always adhere to the directory responsibilities below** — never dump feature logic, components, or constants directly into the root of `src/`.

```text
src/
├── app/                                 # Cấu hình trung tâm của toàn ứng dụng
│   └── App.tsx                          # Component gốc, khởi tạo các Provider/Router/Page chính
│
├── features/                            # CÁC MODULE CHỨC NĂNG CHÍNH (Feature Modules)
│   └── game/                            # Module trò chơi Rắn & Thang - Hành trình Đổi mới
│       ├── components/                  # Các component con thuộc phạm vi feature (Board, SetupPanel, TurnPanel, ActivityPanel, Ranking, Rules, QuestionModal, ResetModal, EndScreen...)
│       ├── hooks/                       # Custom hooks điều khiển state & luồng chơi (useGame.ts)
│       ├── pages/                       # Trang hiển thị cấp cao của feature (GamePage.tsx)
│       ├── utils/                       # Các hàm xử lý logic nghiệp vụ & tính toán hình học (game-logic.ts, board-geometry.ts, board-layout.ts)
│       ├── types.ts                     # Kiểu dữ liệu TypeScript riêng của feature
│       └── index.ts                     # Barrel file export public API của feature
│
├── shared/                              # TÀI NGUYÊN DÙNG CHUNG (Dùng xuyên suốt các features)
│   ├── components/                      # UI primitives dùng chung (Dice, EffectToast, Icon, Pawn...)
│   │   └── index.ts
│   ├── constants/                       # Hằng số, dữ liệu cấu hình bàn cờ & bộ câu hỏi (board-art.ts, game-data.ts)
│   │   └── index.ts
│   ├── layouts/                         # Khung bố cục trang chung (MainLayout.tsx)
│   │   └── index.ts
│   └── utils/                           # Hàm tiện ích dùng chung toàn cục (async.ts)
│
├── styles/                              # CSS toàn cục và biến hệ thống
│   └── index.css                        # Global CSS entrypoint và Tailwind CSS v4 import
│
├── main.tsx                             # React entrypoint; imports `src/styles/index.css` và mounts `src/app/App.tsx`
└── vite-env.d.ts                        # Khai báo kiểu môi trường Vite
```

### Coding & Placement Guidelines for Agents

1. **`src/app/`**: Chỉ chứa cấu hình cấp ứng dụng (`App.tsx`, router, global store, providers). Không viết logic nghiệp vụ chi tiết tại đây.
2. **`src/features/<feature-name>/`**:
   - Mỗi tính năng lớn đặt trong một thư mục riêng dưới `src/features/`.
   - Tách biệt rõ ràng:
     - `pages/`: Component cấp trang kết nối hook và các khối giao diện.
     - `components/`: Các UI component đặc thù của feature đó.
     - `hooks/`: Custom hooks quản lý state và side-effects của feature.
     - `utils/`: Các hàm thuần túy (pure functions) tính toán logic, tọa độ, bố cục để dễ dàng kiểm thử độc lập.
     - `types.ts`: Các interface/type của feature.
     - `index.ts`: Export những thành phần cần thiết cho bên ngoài sử dụng.
3. **`src/shared/`**:
   - Chỉ đặt các tài nguyên dùng chung cho nhiều nơi (`components/`, `constants/`, `layouts/`, `hooks/`, `utils/`, `types/`).
   - Các module trong `src/shared/` không được phụ thuộc ngược vào UI/state của một feature cụ thể.
4. **`src/styles/`**:
   - Mọi CSS toàn cục và cấu hình theme Tailwind CSS v4 đặt tại `src/styles/index.css`.
5. **Imports & Path Alias**:
   - Ưu tiên sử dụng alias `@/` (trỏ tới `src/`, ví dụ `@/shared/components`, `@/features/game`) khi import giữa các phân vùng khác nhau (`app`, `features`, `shared`).
   - Đối với các file logic/utils/constants thuần TypeScript được chạy trực tiếp bởi bộ unit test Node (`tests/*.test.mjs` với `--experimental-strip-types`), sử dụng đường dẫn tương đối kèm đuôi `.ts` để tương thích trực tiếp với Node ESM resolver.
6. **Testing**:
   - Các bài kiểm thử đơn vị nằm trong `tests/` (`tests/game.test.mjs`, `tests/board-art.test.mjs`, `tests/board-layout.test.mjs`) và chạy bằng lệnh `node --experimental-strip-types --test tests/*.test.mjs`.

## Root Files

- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/styles/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/styles/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/styles/index.css`, so global font wiring belongs in `src/styles/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

Tailwind emits utility classes in `@layer utilities`, and CSS outside any cascade layer overrides every layer regardless of specificity. Put global element styles, such as resets and defaults for `body`, headings, `button`, or `input`, inside `@layer base { ... }` so utility classes on those elements still apply. Tailwind's Preflight already applies `box-sizing: border-box`, removes default margins, and sets `font: inherit` on form controls, so do not repeat those rules.
