# Ứng dụng Quản lý Bình Nước Suối

Ứng dụng React Native kết hợp với Supabase để quản lý khách hàng và theo dõi số lượng bình nước suối.

## Tính năng

- Quản lý danh sách khách hàng
- Theo dõi số lượng bình nước đã giao
- Theo dõi số vỏ đã được hoàn trả
- Tính toán tổng tiền giao bình nước

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` với nội dung:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Tạo bảng `customers` trong Supabase với cấu trúc sau:
```sql
create table customers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  address text not null,
  total_bottles_delivered integer default 0,
  total_bottles_returned integer default 0,
  total_amount integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

5. Chạy ứng dụng:
```bash
npm start
```

## Sử dụng

- Màn hình chính hiển thị danh sách khách hàng
- Nhấn nút + để thêm khách hàng mới
- Nhấn vào khách hàng để xem chi tiết và chỉnh sửa thông tin
- Có thể xóa khách hàng từ màn hình danh sách

## Công nghệ sử dụng

- React Native
- Expo
- Supabase
- React Native Paper

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
