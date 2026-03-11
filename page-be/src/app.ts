import Elysia from "elysia";
// import { swagger } from '@elysiajs/swagger';
import { cors } from "@elysiajs/cors";
import { pageLayoutRouter } from "@/routes/layoutRouter";
import { staticPlugin } from "@elysiajs/static";

// Khởi tạo instance của Elysia
const app = new Elysia();

// Cấu hình môi trường
if (process.env.NODE_ENV !== "production") {
  // Thêm Swagger
  // app.use(swagger());

  // Xử lý lỗi
  app.onError(({ error, code, set }) => {
    if (code === "NOT_FOUND") {
      set.status = 404;
      return "Not Found";
    }
    set.status = 500;
    return error;
  });
} else {
  // Xử lý lỗi
  app.onError(({ code, set }) => {
    if (code === "NOT_FOUND") {
      set.status = 404;
      return "Not Found";
    }
    set.status = 500;
    return "Internal Server Error";
  });
}

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(pageLayoutRouter);

export default app;
