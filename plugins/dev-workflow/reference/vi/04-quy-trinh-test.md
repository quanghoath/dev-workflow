# 04 · Quy trình test từng bước

Áp dụng cho P3 (unit), P4 (tích hợp), P5 (race, tải, hiệu năng). Lệnh cụ thể lấy từ `docs/workflow-config.md`. Kịch bản lấy từ `runs/<slug>/TEST-PLAN.md`. Bằng chứng lưu vào `runs/<slug>/evidence/`.

**Quy tắc chung**

- Chỉ chạy trên môi trường **local/dev/staging** ghi trong config. Không bao giờ chạy trên production nếu không có lệnh rõ ràng.
- Mỗi kịch bản ghi kết quả `pass` / `fail` / `warn` vào cột "Kết quả" của TEST-PLAN, kèm đường dẫn bằng chứng.
- Không được kết luận `pass` khi chưa nhìn thấy output thật (`verification-before-completion`).

---

## Bước 1 · Unit test (P3, mọi hồ sơ)

1. Viết test cho hành vi trước, chạy để thấy **đỏ** đúng lý do.
2. Code tối thiểu cho **xanh**. Refactor, giữ xanh.
3. Chạy toàn bộ: lệnh `unit_test` trong config, rồi lệnh `build` (và `lint` nếu có).
4. Ghi số pass/fail vào dashboard `tests.unit`.

Cần có test cho: logic nghiệp vụ, nhánh lỗi (`4xx` hoặc mã lỗi nghiệp vụ của dự án), giá trị biên, và mọi bug từ vòng phản hồi (test tái hiện).

## Bước 2 · API e2e (P4, hồ sơ BE / FULLSTACK)

1. Khởi động API theo `be_run` trong config; chờ `be_health` trả về OK.
2. Lấy token test theo hướng dẫn trong config (không commit token).
3. Với mỗi kịch bản API trong TEST-PLAN: gửi request (`.http`, `curl`, script), kiểm tra:
   - mã HTTP và envelope (nếu dự án bọc response, ví dụ `{ status, message, data }`);
   - dữ liệu trả về đúng hợp đồng trong spec;
   - **trạng thái DB sau khi gọi** (truy vấn kiểm tra ghi trong TEST-PLAN) — đây là phần hay bị bỏ qua nhất;
   - các nhánh lỗi: thiếu trường, sai quyền, token hết hạn, id không tồn tại.
4. Lưu request/response tiêu biểu vào `evidence/api-<id>.md`.

## Bước 3 · Giao diện bằng Chrome DevTools MCP (P4, hồ sơ FE / FULLSTACK)

Chuẩn bị: chạy `fe_run`, xác nhận `fe_url` mở được. FULLSTACK thì BE thật phải đang chạy (Bước 2 đã pass).

Với **mỗi kịch bản UI** trong TEST-PLAN:

| # | Việc | Tool MCP |
|---|---|---|
| 1 | Mở trang | `new_page` / `navigate_page` |
| 2 | Đăng nhập test nếu cần | `fill_form`, `click` |
| 3 | Đọc cấu trúc trang để lấy `uid` phần tử (ưu tiên hơn ảnh chụp) | `take_snapshot` |
| 4 | Thực hiện các bước của kịch bản | `click`, `fill`, `type_text`, `press_key`, `hover`, `drag`, `upload_file`, `handle_dialog` |
| 5 | Chờ kết quả hiện ra | `wait_for` (text mong đợi) |
| 6 | Kiểm tra kết quả hiển thị | `take_snapshot` (so text/trạng thái), `evaluate_script` nếu cần đọc state |
| 7 | Kiểm tra console: **0 error** | `list_console_messages`, `get_console_message` |
| 8 | Kiểm tra network: không có 4xx/5xx ngoài dự kiến, payload đúng hợp đồng | `list_network_requests`, `get_network_request` |
| 9 | Chụp bằng chứng | `take_screenshot` → `evidence/ui-<id>.png` |

Sau khi các kịch bản chính pass, kiểm tra thêm (`warn` nếu không đạt):

- **Responsive:** `resize_page` 375×812 (mobile) và 1366×768. Không tràn ngang, nút bấm được. Chụp ảnh.
- **Mạng chậm:** `emulate` (network Slow 3G, CPU 4×). Có trạng thái loading, không double-render, không treo.
- **Trạng thái rỗng / lỗi:** dữ liệu rỗng, API lỗi → có thông báo, không màn trắng.

**Phân loại kết quả**

- `fail`: sai chức năng, lỗi console, request lỗi ngoài dự kiến, kịch bản không hoàn thành.
- `warn`: đúng chức năng nhưng chậm, layout lỗi ở mobile, cảnh báo console, request thừa hoặc trùng.

Mỗi `fail`/`warn` → tạo `BUG-NNN.md` → vòng phản hồi ([02-quy-trinh.md](02-quy-trinh.md#vòng-phản-hồi-p4p5--p3)).

## Bước 3b · Ghi lại thành test e2e (P4, khi `e2e_framework: playwright`)

Chrome DevTools MCP dùng để **khám phá và kiểm tra lần đầu**. Kịch bản đã `pass` thì được **ghi lại thành test Playwright** trong repo, để CI chạy lại mãi và lỗi cũ không quay lại.

1. Với mỗi kịch bản UI có đánh dấu `smoke` hoặc gắn với một BUG, tạo hoặc cập nhật `e2e/<slug>.spec.ts` (đường dẫn theo `e2e_dir` trong config).
2. Một kịch bản là một `test(...)`, tên test chứa ID kịch bản (ví dụ `test('UI-2 không tạo 2 đơn khi double-click', …)`).
3. Selector ưu tiên `getByRole` / `getByLabel` / `getByText`, đúng như những gì `take_snapshot` thấy. Không dùng selector CSS dễ vỡ.
4. Kiểm tra như MCP đã kiểm: kết quả hiển thị, số request ghi (`page.waitForResponse` / đếm `page.on('request')`), và không có `console.error` (gắn `page.on('console')`).
5. Chạy `e2e_test` trong config. Test phải **xanh** trước khi kịch bản được ghi `pass` trong TEST-PLAN; cột Bằng chứng ghi thêm tên file test.
6. Dữ liệu test: dùng seed hoặc API tạo dữ liệu trong `beforeEach`, không phụ thuộc thứ tự chạy.

Repo chưa có Playwright: ở `dev-workflow:init`, hỏi người dùng có muốn thêm không (`npm init playwright@latest`). Nếu không, ghi `e2e_framework: none` và bỏ qua bước này.

## Bước 4 · Race condition (P5, nếu spec đánh dấu)

Mỗi kịch bản `R-n` phải nêu rõ **bất biến**, tức điều luôn phải đúng (ví dụ "một sản phẩm không bán quá tồn kho", "số dư không âm", "mỗi đơn chỉ thanh toán 1 lần").

**BE: request song song**

1. Chuẩn bị dữ liệu sạch (script seed trong TEST-PLAN).
2. Bắn N request **đồng thời** (N ≥ 20) vào cùng tài nguyên: script song song có sẵn của dự án, hoặc k6 (`k6 run --vus 20 --iterations 20 race.js`).
3. Đếm kết quả theo envelope: số thành công phải đúng kỳ vọng (thường là 1).
4. **Truy vấn DB kiểm tra bất biến**, không chỉ tin response.
5. Lặp lại 3 lần (race không xuất hiện mỗi lần). Ghi kết quả từng lần vào `evidence/race-<id>.md`.

**FE: thao tác chồng nhau** (Chrome DevTools MCP)

- Double-submit: `evaluate_script` click nút submit 2 lần liên tiếp → network chỉ có 1 request ghi, hoặc server từ chối request thứ hai.
- Response về sai thứ tự: đổi filter/tìm kiếm nhanh nhiều lần với `emulate` mạng chậm → UI hiển thị kết quả của lần cuối, không phải lần về sau cùng.
- Nhiều tab / realtime (SignalR, websocket): mở 2 `new_page`, thao tác ở tab A → tab B cập nhật đúng, không nhân đôi bản ghi.

## Bước 5 · Tải (P5, nếu spec đánh dấu)

1. Viết `runs/<slug>/load/<id>.js` (k6) theo mẫu dưới, endpoint và payload lấy từ TEST-PLAN.
2. Chạy với hồ sơ tải ghi trong `R-n` (mặc định: tăng dần đến 50 VU trong 1 phút, giữ 2 phút, giảm 30 giây).
3. Ngưỡng mặc định ([01-ho-so-du-an.md](01-ho-so-du-an.md#ngưỡng-mặc-định)): p95 < 500 ms, lỗi < 1 %.
4. Trong khi chạy, ghi lại CPU/RAM của server và DB nếu có thể truy cập.
5. Lưu `k6 ... --summary-export evidence/load-<id>.json` và ghi tóm tắt vào TEST-PLAN.

```js
// mẫu k6 tối thiểu
import http from 'k6/http';
import { check } from 'k6';
export const options = {
  stages: [{ duration: '1m', target: 50 }, { duration: '2m', target: 50 }, { duration: '30s', target: 0 }],
  thresholds: { http_req_duration: ['p(95)<500'], http_req_failed: ['rate<0.01'] },
};
export default function () {
  const res = http.post(`${__ENV.BASE_URL}/api/x`, JSON.stringify({ /* payload */ }), {
    headers: { 'Content-Type': 'application/json', Authorization: __ENV.TOKEN },
  });
  check(res, { 'thành công': (r) => r.status >= 200 && r.status < 300 }); // dự án dùng envelope thì kiểm r.json('status')
}
```

Nếu không đạt ngưỡng: tìm nút thắt trước (query chậm, thiếu index, N+1, khóa quá rộng), ghi vào BUG, rồi mới sửa.

## Bước 6 · Hiệu năng FE (P5, nếu spec đánh dấu)

1. `lighthouse_audit` trên các trang chính (desktop, và mobile nếu dự án có mobile). So với ngưỡng.
2. `performance_start_trace` → thực hiện thao tác nặng nhất → `performance_stop_trace` → `performance_analyze_insight` để tìm nguyên nhân (LCP, long task, layout shift, render-blocking).
3. Nghi rò bộ nhớ (trang mở lâu, realtime): `take_heapsnapshot` trước và sau 10 lần thao tác lặp; heap không được tăng mãi.
4. Lưu báo cáo vào `evidence/perf-<trang>.md`.

## Bước 7 · Hồi quy trước tổng kết (P6)

1. `build` + `unit_test` toàn repo.
2. Chạy `e2e_test` (nếu có) và các kịch bản P4 có đánh dấu `smoke` chưa được ghi thành test e2e.
3. Nếu P5 có sửa code sau lần đo cuối: chạy lại `R-n` liên quan.
4. Mọi kết quả đưa vào REPORT.md.
