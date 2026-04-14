🛠 Công nghệ sử dụng
Framework: NestJS (Node.js)

Database: MongoDB (Mongoose)

Authentication: Passport.js (JWT Strategy & Local Strategy)

Security: Bcrypt (Hash mật khẩu), Soft Delete (Mongoose plugin)

Architecture: Module-based, Repository Pattern, SOLID Principles.

🌟 Tính năng nổi bật
RBAC System: Phân quyền người dùng dựa trên Roles và Permissions linh hoạt.

Database Seeding: Tự động khởi tạo dữ liệu mẫu (Permissions, Roles, Admin User) khi triển khai lần đầu.

File Upload: Xử lý upload tài liệu (CV/Resume) chuẩn RESTful.

Authentication: Hệ thống Login, Refresh Token và bảo mật API với JWT.

Filtering & Pagination: Hỗ trợ tìm kiếm, lọc và phân trang dữ liệu nâng cao (như module Companies, Jobs).

🏗 Hướng dẫn cài đặt và khởi chạy

1. Yêu cầu hệ thống
   Node.js (phiên bản 18.x hoặc mới hơn)

MongoDB (Atlas hoặc cài đặt cục bộ)

2. Cài đặt thư viện
   npm install

3. Cấu hình biến môi trường
   PORT=8080
   MONGODB_URI=your_mongodb_connection_string
   JWT_ACCESS_TOKEN_SECRET=your_secret_key
   JWT_ACCESS_EXPIRE=1d
   INIT_PASSWORD=your_admin_password
   SHOULD_INIT=true

4. Chạy dự án
   npm run dev

📁 Cấu trúc thư mục chính
src/
├── auth/ # Xử lý xác thực (Passport, JWT, Local)
├── companies/ # Quản lý thông tin công ty
├── users/ # Quản lý người dùng và Profile
├── roles/ # Quản lý vai trò (Admin, User...)
├── permissions/ # Quản lý quyền truy cập API
├── databases/ # Chứa logic Seeding dữ liệu (sample.ts)
└── decorator/ # Các custom decorators (@Public, @User...)

📝 Lưu ý khi Seeding dữ liệu
Khi bạn lần đầu khởi động dự án với SHOULD_INIT=true, hệ thống sẽ tự động tạo:

32 Permissions mặc định cho toàn bộ hệ thống.

Roles: SUPER ADMIN và NORMAL USER.

Tài khoản Admin: admin@gmail.com (Mật khẩu lấy từ INIT_PASSWORD).

Project: NestJS Basic to Advanced (Job Recruitment Platform)
