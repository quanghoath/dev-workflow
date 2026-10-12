# 02 · Quy trình P0–P6

Mỗi bước gồm: **mục tiêu**, **skill**, **đầu ra**, **điều kiện qua bước**, **cập nhật dashboard**. Không qua bước khi điều kiện chưa đạt. ◆ = phải có người duyệt.

---

## P0 · Khởi tạo dự án (1 lần)

- **Mục tiêu:** dự án có hồ sơ và lệnh chạy rõ ràng để agent không phải đoán.
- **Làm:**
  1. Nhận diện hồ sơ theo [01-ho-so-du-an.md](01-ho-so-du-an.md).
  2. Tạo `docs/workflow-config.md` từ mẫu; chạy thử từng lệnh (build, unit test, dev server) và ghi lại lệnh chạy được.
  3. Dán `CLAUDE.snippet.md` vào `CLAUDE.md`.
  4. Kiểm tra `chrome-devtools` MCP có sẵn (nếu hồ sơ có FE); kiểm tra `k6 version` (nếu có rủi ro tải).
- **Qua bước khi:** mọi lệnh trong config đã chạy thử thành công, hoặc được ghi rõ là chưa có.
- **Dashboard:** chọn dashboard có sẵn, tạo mới, hoặc `none`, rồi tạo document `projects/<project>` (xem [03-dashboard.md](03-dashboard.md)).

## P1 · Spec ◆

- **Skill:** `superpowers:brainstorming`.
- **Đầu ra:** `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md`, cuối file có 2 mục bắt buộc từ `${CLAUDE_PLUGIN_ROOT}/templates/spec-addendum.md`:
  - **Tiêu chí nghiệm thu:** mỗi tiêu chí có mã `AC-n`, kiểm tra được (có đầu vào và kết quả mong đợi).
  - **Rủi ro & hardening:** đánh dấu có hoặc không cho từng loại: race condition, tải cao, hiệu năng FE, bảo mật/phân quyền, dữ liệu lớn. Mỗi rủi ro được đánh "có" phải có kịch bản `R-n` và ngưỡng.
  - FULLSTACK thêm mục **Hợp đồng API**.
- **Qua bước khi:** người duyệt đồng ý spec.
- **Dashboard:** `phase=P1`, `status=waiting_review` khi chờ duyệt; ghi `gates.spec` khi được duyệt.

## P2 · Plan + Test plan ◆

- **Skill:** `superpowers:writing-plans`.
- **Đầu ra:**
  - `docs/superpowers/plans/YYYY-MM-DD-<slug>.md`. Mỗi task có nhãn `[BE]`, `[FE]` hoặc `[CONTRACT]`, ghi rõ AC nào nó đáp ứng và unit test nào chứng minh.
  - `docs/superpowers/runs/<slug>/TEST-PLAN.md` từ mẫu: kịch bản P4 cho mỗi `AC-n`, kịch bản P5 cho mỗi `R-n`. Viết **trước** khi code.
- **Qua bước khi:** mỗi `AC-n` có ít nhất 1 kịch bản test và mỗi `R-n` có 1 kịch bản P5; người duyệt đồng ý và chọn cách chạy (subagent hay inline).
- **Dashboard:** ghi danh sách `tasks` (id, tên, nhãn, `todo`); `gates.plan` khi được duyệt.

## P3 · Build

- **Skill:** `superpowers:subagent-driven-development` (hoặc `executing-plans`), bên trong mỗi task dùng `superpowers:test-driven-development`.
- **Mỗi task:**
  1. Viết unit test đỏ → code cho xanh → refactor.
  2. Chạy lệnh `build` + `unit_test` trong config, phải xanh.
  3. Review hai lớp (đúng spec, chất lượng code) theo SDD; nếu có góp ý thì sửa ngay trong task.
  4. Commit; cập nhật dashboard task → `done`.
- **Thứ tự FULLSTACK:** `[CONTRACT]` → tất cả `[BE]` → chạy API e2e của TEST-PLAN → `[FE]`.
- **Qua bước khi:** mọi task `done`, build và unit test xanh trên toàn bộ repo.

## P4 · Kiểm tra tích hợp

- **Làm:** chạy các kịch bản P4 trong TEST-PLAN theo [04-quy-trinh-test.md](04-quy-trinh-test.md) (FE: Chrome DevTools MCP; BE: API e2e).
- **Kết quả mỗi kịch bản:** `pass` / `fail` / `warn` (đạt chức năng nhưng chưa tối ưu: chậm, lỗi console, layout vỡ ở mobile…). Lưu bằng chứng vào `evidence/`.
- **`fail` hoặc `warn`** → vào vòng phản hồi (bên dưới).
- **Qua bước khi:** mọi kịch bản P4 `pass`; `warn` chỉ được giữ lại nếu người duyệt chấp nhận và ghi vào REPORT.

## P5 · Hardening

- **Chỉ chạy** các rủi ro được đánh "có" ở spec. Nếu không có rủi ro nào, ghi "P5: không áp dụng — lý do" rồi sang P6.
- **Làm:** kịch bản `R-n` theo [04-quy-trinh-test.md](04-quy-trinh-test.md) (race, tải, hiệu năng FE).
- **Không đạt ngưỡng** → vòng phản hồi. Sửa xong thì chạy lại **toàn bộ** P4 (hồi quy) rồi mới chạy lại P5.
- **Qua bước khi:** mọi `R-n` đạt ngưỡng, có số liệu lưu trong `evidence/`.

## P6 · Tổng kết ◆

- **Skill:** `superpowers:verification-before-completion` → `superpowers:requesting-code-review` → `superpowers:finishing-a-development-branch`.
- **Làm:** chạy lại build + unit test + kịch bản P4 quan trọng nhất (smoke). Điền `REPORT.md` từ mẫu.
- **Qua bước khi:** người duyệt đọc REPORT và chọn cách merge/PR.
- **Dashboard:** `status=done`, đính kèm tóm tắt REPORT (số AC đạt, số bug, số vòng, chỉ số P5).

---

## Vòng phản hồi (P4/P5 → P3)

```
kịch bản fail/warn
   → tạo BUG-NNN.md (mẫu ${CLAUDE_PLUGIN_ROOT}/templates/BUG.md): bước tái hiện, mong đợi, thực tế, bằng chứng
   → superpowers:systematic-debugging: tìm nguyên nhân gốc TRƯỚC khi sửa
   → viết unit test tái hiện lỗi (đỏ) → sửa (xanh)
   → chạy lại kịch bản gây lỗi + các kịch bản liên quan
   → BUG đóng (fixed) hoặc tăng loop
```

- **Giới hạn 3 vòng cho mỗi BUG.** Hết vòng 3 mà chưa đạt thì `status=blocked`, dừng lại và báo người duyệt kèm giả thuyết hiện tại. Không thử vòng 4.
- Một lỗi cần **đổi thiết kế** (sai spec, thiếu khóa, sai mô hình dữ liệu) thì không sửa vá. Đánh dấu `needs_redesign`, dừng lại, quay về P1/P2 với người duyệt.
- Dashboard: thêm bug vào `bugs[]` và tăng `loops` mỗi lần quay về P3.

## Trạng thái dừng hợp lệ

Agent **phải dừng và chờ người** khi gặp một trong các trường hợp sau:

- đang ở cổng ◆ (P1, P2, P6);
- BUG hết 3 vòng (`blocked`);
- `needs_redesign`;
- thiếu quyền, thiếu môi trường hoặc thiếu dữ liệu test (ví dụ không có DB dev, không có token);
- lệnh test cần chạy trên **production** — không bao giờ chạy P5 trên production nếu không có lệnh rõ ràng.
