<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Cake Lab — Quản Lý Sản Phẩm</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --cream: #fdf6ee;
    --warm-white: #fffbf6;
    --caramel: #c8874a;
    --caramel-dark: #a0622e;
    --caramel-light: #f0d4b0;
    --chocolate: #3d1f0a;
    --chocolate-mid: #6b3a1f;
    --blush: #f5ddd4;
    --sage: #8fa88a;
    --text-dark: #2a1a0e;
    --text-mid: #5a3e2b;
    --text-light: #9a7a62;
    --border: #e8d4c0;
    --shadow: rgba(61,31,10,0.08);
    --tab-h: 56px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--text-dark);
    min-height: 100vh;
  }

  /* ─── HEADER ─── */
  .site-header {
    background: var(--chocolate);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 20px rgba(0,0,0,0.25);
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .logo-icon {
    width: 40px; height: 40px;
    background: var(--caramel);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #fff;
    letter-spacing: 0.02em;
  }
  .logo-sub {
    font-size: 10px;
    color: var(--caramel-light);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 500;
  }
  .header-stats {
    display: flex;
    gap: 24px;
  }
  .stat-pill {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    padding: 6px 16px;
    font-size: 12px;
    color: var(--caramel-light);
    font-weight: 500;
  }
  .stat-pill strong { color: #fff; font-size: 14px; margin-right: 4px; }

  /* ─── TABS ─── */
  .tab-bar {
    background: var(--warm-white);
    border-bottom: 1px solid var(--border);
    display: flex;
    overflow-x: auto;
    padding: 0 24px;
    position: sticky;
    top: 72px;
    z-index: 99;
    scrollbar-width: none;
  }
  .tab-bar::-webkit-scrollbar { display: none; }
  .tab-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
    height: var(--tab-h);
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-light);
    cursor: pointer;
    border: none;
    background: none;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .tab-btn:hover { color: var(--caramel-dark); }
  .tab-btn.active {
    color: var(--caramel-dark);
    border-bottom-color: var(--caramel);
    font-weight: 600;
  }
  .tab-badge {
    background: var(--caramel-light);
    color: var(--caramel-dark);
    border-radius: 10px;
    padding: 2px 7px;
    font-size: 11px;
    font-weight: 600;
  }
  .tab-btn.active .tab-badge {
    background: var(--caramel);
    color: #fff;
  }

  /* ─── MAIN ─── */
  .main-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px 24px;
  }

  /* ─── PANEL ─── */
  .panel { display: none; }
  .panel.active { display: block; }

  /* ─── TOOLBAR ─── */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .search-wrap {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 360px;
  }
  .search-wrap input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-size: 13.5px;
    background: #fff;
    color: var(--text-dark);
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s;
    outline: none;
  }
  .search-wrap input:focus { border-color: var(--caramel); }
  .search-icon {
    position: absolute;
    left: 12px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-light);
    font-size: 16px;
  }
  .filter-select {
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-size: 13px;
    background: #fff;
    color: var(--text-dark);
    font-family: 'DM Sans', sans-serif;
    outline: none;
    cursor: pointer;
  }
  .count-label {
    margin-left: auto;
    font-size: 13px;
    color: var(--text-light);
    font-weight: 500;
  }

  /* ─── TABLE ─── */
  .table-wrap {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 3px var(--shadow), 0 4px 16px var(--shadow);
    overflow: hidden;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead { background: var(--chocolate); }
  thead th {
    padding: 14px 16px;
    text-align: left;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--caramel-light);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  thead th:first-child { padding-left: 24px; border-radius: 0; }
  tbody tr {
    border-bottom: 1px solid #faf0e6;
    transition: background 0.15s;
  }
  tbody tr:hover { background: var(--cream); }
  tbody tr:last-child { border-bottom: none; }
  tbody td {
    padding: 14px 16px;
    font-size: 13.5px;
    color: var(--text-dark);
    vertical-align: top;
  }
  tbody td:first-child { padding-left: 24px; }

  .ma-sp {
    font-family: 'DM Sans', monospace;
    font-size: 12px;
    color: var(--caramel-dark);
    font-weight: 600;
    background: var(--blush);
    padding: 3px 8px;
    border-radius: 6px;
    white-space: nowrap;
  }
  .ten-banh { font-weight: 600; color: var(--chocolate-mid); }
  .gia {
    font-weight: 700;
    color: var(--caramel-dark);
    font-size: 14px;
    white-space: nowrap;
  }
  .dvt {
    display: inline-block;
    background: #f0f7f0;
    color: var(--sage);
    font-size: 11.5px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
    border: 1px solid #c8dfc4;
  }
  .hsd { font-size: 12.5px; color: var(--text-mid); }
  .note {
    font-size: 11.5px;
    color: var(--text-light);
    font-style: italic;
  }
  .mo-ta {
    font-size: 12.5px;
    color: var(--text-mid);
    max-width: 300px;
  }
  .thanh-phan {
    font-size: 12px;
    color: var(--text-light);
    max-width: 280px;
    line-height: 1.5;
  }
  .stt-num {
    width: 32px;
    height: 32px;
    background: var(--caramel-light);
    color: var(--caramel-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
  }

  /* Expand row */
  .expand-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--caramel);
    font-size: 18px;
    padding: 0 4px;
    display: flex;
    align-items: center;
  }
  .detail-row { display: none; }
  .detail-row.open { display: table-row; }
  .detail-cell {
    background: var(--cream);
    padding: 16px 24px 20px;
    border-bottom: 1px solid var(--border);
  }
  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  .detail-item label {
    font-size: 10.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-light);
    display: block;
    margin-bottom: 4px;
  }
  .detail-item p {
    font-size: 13px;
    color: var(--text-dark);
    line-height: 1.5;
  }

  /* ─── EMPTY ─── */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-light);
  }
  .empty-state .icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state h3 { font-size: 18px; color: var(--text-mid); margin-bottom: 6px; }

  /* ─── SUMMARY CARDS ─── */
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  .summary-card {
    background: #fff;
    border-radius: 14px;
    padding: 20px 22px;
    box-shadow: 0 1px 3px var(--shadow);
    border-left: 4px solid var(--caramel);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .summary-card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px var(--shadow); }
  .summary-card .s-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-light);
    margin-bottom: 6px;
  }
  .summary-card .s-val {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--chocolate-mid);
  }
  .summary-card .s-sub {
    font-size: 12px;
    color: var(--text-light);
    margin-top: 4px;
  }

  /* ─── SECTION TITLE ─── */
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: var(--chocolate);
    margin-bottom: 8px;
  }
  .section-sub {
    font-size: 13px;
    color: var(--text-light);
    margin-bottom: 24px;
  }

  /* Tag for ghi_chu */
  .tag-keto {
    background: #e8f5e9; color: #388e3c;
    font-size: 11px; font-weight: 600;
    padding: 2px 8px; border-radius: 10px;
    border: 1px solid #a5d6a7;
  }
  .tag-less {
    background: #fff3e0; color: #e65100;
    font-size: 11px; font-weight: 600;
    padding: 2px 8px; border-radius: 10px;
    border: 1px solid #ffcc80;
  }

  /* Price range badge */
  .price-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .gia-vnd::after { content: ' đ'; font-size: 11px; font-weight: 400; color: var(--text-light); }

  @media (max-width: 768px) {
    .site-header { padding: 0 16px; }
    .header-stats { display: none; }
    .main-content { padding: 20px 12px; }
    .tab-btn { padding: 0 14px; font-size: 13px; }
    thead th { font-size: 10.5px; padding: 12px 10px; }
    tbody td { padding: 12px 10px; font-size: 12.5px; }
    .summary-grid { grid-template-columns: 1fr 1fr; }
  }
</style>
</head>
<body>

<header class="site-header">
  <div class="logo">
    <div class="logo-icon">🎂</div>
    <div>
      <div class="logo-text">The Cake Lab</div>
      <div class="logo-sub">Hệ thống quản lý sản phẩm</div>
    </div>
  </div>
  <div class="header-stats">
    <div class="stat-pill"><strong id="total-count">94</strong> sản phẩm</div>
    <div class="stat-pill"><strong>5</strong> danh mục</div>
    <div class="stat-pill"><strong>4</strong> cửa hàng</div>
  </div>
</header>

<nav class="tab-bar">
  <button class="tab-btn active" onclick="showTab('daily', this)">
    ☀️ Bánh Daily <span class="tab-badge">21</span>
  </button>
  <button class="tab-btn" onclick="showTab('sinhnhat', this)">
    🎂 Bánh Sinh Nhật <span class="tab-badge">27</span>
  </button>
  <button class="tab-btn" onclick="showTab('mi', this)">
    🥐 Bánh Mì <span class="tab-badge">28</span>
  </button>
  <button class="tab-btn" onclick="showTab('keto', this)">
    🌿 Bánh Keto <span class="tab-badge">4</span>
  </button>
  <button class="tab-btn" onclick="showTab('cookie', this)">
    🍪 Bánh Cookie <span class="tab-badge">14</span>
  </button>
  <button class="tab-btn" onclick="showTab('summary', this)">
    📊 Tổng Quan
  </button>
</nav>

<main class="main-content">

  <!-- DAILY -->
  <div class="panel active" id="panel-daily">
    <h2 class="section-title">Bánh Daily</h2>
    <p class="section-sub">Các loại bánh kem, bánh cuộn bán hàng ngày tại cửa hàng</p>
    <div class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Tìm tên bánh, mã SP..." oninput="filterTable('daily', this.value)">
      </div>
      <select class="filter-select" onchange="filterByDvt('daily', this.value)">
        <option value="">Tất cả loại</option>
        <option value="Miếng">Miếng</option>
        <option value="Hộp">Hộp</option>
      </select>
      <span class="count-label" id="count-daily">21 sản phẩm</span>
    </div>
    <div class="table-wrap">
      <table id="tbl-daily">
        <thead><tr>
          <th>STT</th><th>Mã SP</th><th>Tên Bánh</th><th>Đvt</th><th>Giá Bán</th><th>HSD</th><th>Ghi Chú</th><th></th>
        </tr></thead>
        <tbody id="tbody-daily"></tbody>
      </table>
    </div>
  </div>

  <!-- SINH NHẬT -->
  <div class="panel" id="panel-sinhnhat">
    <h2 class="section-title">Bánh Sinh Nhật</h2>
    <p class="section-sub">Bánh nguyên chiếc đặt theo yêu cầu, kích thước 10–16 cm</p>
    <div class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Tìm tên bánh, mã SP..." oninput="filterTable('sinhnhat', this.value)">
      </div>
      <select class="filter-select" onchange="filterBySize('sinhnhat', this.value)">
        <option value="">Tất cả kích thước</option>
        <option value="10">Size 10</option>
        <option value="12">Size 12</option>
        <option value="14">Size 14</option>
        <option value="16">Size 16</option>
      </select>
      <span class="count-label" id="count-sinhnhat">27 sản phẩm</span>
    </div>
    <div class="table-wrap">
      <table id="tbl-sinhnhat">
        <thead><tr>
          <th>STT</th><th>Mã SP</th><th>Tên Bánh</th><th>Đvt</th><th>Giá Bán</th><th>Kích Thước</th><th>Bao Bì</th><th>HSD</th><th></th>
        </tr></thead>
        <tbody id="tbody-sinhnhat"></tbody>
      </table>
    </div>
  </div>

  <!-- BÁNH MÌ -->
  <div class="panel" id="panel-mi">
    <h2 class="section-title">Bánh Mì & Donut</h2>
    <p class="section-sub">Các loại bánh mì, donut, mochi và sản phẩm nướng đặc trưng</p>
    <div class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Tìm tên bánh, mã SP..." oninput="filterTable('mi', this.value)">
      </div>
      <span class="count-label" id="count-mi">28 sản phẩm</span>
    </div>
    <div class="table-wrap">
      <table id="tbl-mi">
        <thead><tr>
          <th>STT</th><th>Mã SP</th><th>Tên Bánh</th><th>Mô Tả</th><th>Đvt</th><th>Giá Bán</th><th>HSD</th><th></th>
        </tr></thead>
        <tbody id="tbody-mi"></tbody>
      </table>
    </div>
  </div>

  <!-- KETO -->
  <div class="panel" id="panel-keto">
    <h2 class="section-title">Bánh Keto</h2>
    <p class="section-sub">100% bột hạnh nhân và đường isomalt — dành cho người ăn kiêng</p>
    <div class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Tìm tên bánh..." oninput="filterTable('keto', this.value)">
      </div>
      <span class="count-label" id="count-keto">4 sản phẩm</span>
    </div>
    <div class="table-wrap">
      <table id="tbl-keto">
        <thead><tr>
          <th>STT</th><th>Mã SP</th><th>Tên Bánh</th><th>Thành Phần</th><th>Mô Tả</th><th>Đvt</th><th>Giá Bán</th><th>HSD</th><th></th>
        </tr></thead>
        <tbody id="tbody-keto"></tbody>
      </table>
    </div>
  </div>

  <!-- COOKIE -->
  <div class="panel" id="panel-cookie">
    <h2 class="section-title">Bánh Cookie</h2>
    <p class="section-sub">Cookie cao cấp, HSD 45 ngày — lý tưởng làm quà tặng</p>
    <div class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Tìm tên bánh, mã SP..." oninput="filterTable('cookie', this.value)">
      </div>
      <select class="filter-select" onchange="filterByDvt('cookie', this.value)">
        <option value="">Tất cả loại</option>
        <option value="Hộp">Hộp</option>
        <option value="Túi">Túi</option>
        <option value="Chiếc">Chiếc</option>
      </select>
      <span class="count-label" id="count-cookie">14 sản phẩm</span>
    </div>
    <div class="table-wrap">
      <table id="tbl-cookie">
        <thead><tr>
          <th>STT</th><th>Mã SP</th><th>Tên Bánh</th><th>Thành Phần</th><th>Đvt</th><th>Giá Bán</th><th>Trọng Lượng</th><th>Bảo Quản</th><th></th>
        </tr></thead>
        <tbody id="tbody-cookie"></tbody>
      </table>
    </div>
  </div>

  <!-- SUMMARY -->
  <div class="panel" id="panel-summary">
    <h2 class="section-title">Tổng Quan The Cake Lab</h2>
    <p class="section-sub">Thống kê nhanh toàn bộ danh mục sản phẩm</p>

    <div class="summary-grid">
      <div class="summary-card">
        <div class="s-label">Tổng Sản Phẩm</div>
        <div class="s-val">94</div>
        <div class="s-sub">trên 5 danh mục</div>
      </div>
      <div class="summary-card" style="border-left-color:#c88;">
        <div class="s-label">Bánh Daily</div>
        <div class="s-val">21</div>
        <div class="s-sub">60,000–115,000 đ</div>
      </div>
      <div class="summary-card" style="border-left-color:#8ab;">
        <div class="s-label">Bánh Sinh Nhật</div>
        <div class="s-val">27</div>
        <div class="s-sub">150,000–650,000 đ</div>
      </div>
      <div class="summary-card" style="border-left-color:#cab;">
        <div class="s-label">Bánh Mì & Donut</div>
        <div class="s-val">28</div>
        <div class="s-sub">20,000–135,000 đ</div>
      </div>
      <div class="summary-card" style="border-left-color:#8a8;">
        <div class="s-label">Bánh Keto</div>
        <div class="s-val">4</div>
        <div class="s-sub">100% bột hạnh nhân</div>
      </div>
      <div class="summary-card" style="border-left-color:#d9a;">
        <div class="s-label">Bánh Cookie</div>
        <div class="s-val">14</div>
        <div class="s-sub">HSD 45 ngày</div>
      </div>
    </div>

    <h3 style="font-family:'Playfair Display',serif;font-size:18px;color:var(--chocolate);margin-bottom:16px;">Hệ Thống Cửa Hàng</h3>
    <div class="summary-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px,1fr))">
      <div class="summary-card" style="border-left-color:#888;">
        <div class="s-label">📍 Tuệ Tĩnh</div>
        <div class="s-val" style="font-size:20px">Cửa hàng</div>
        <div class="s-sub">Menu đầy đủ</div>
      </div>
      <div class="summary-card" style="border-left-color:#888;">
        <div class="s-label">📍 Timescity</div>
        <div class="s-val" style="font-size:20px">Cửa hàng</div>
        <div class="s-sub">Khu vực trung tâm</div>
      </div>
      <div class="summary-card" style="border-left-color:#888;">
        <div class="s-label">📍 Phan Bội Châu</div>
        <div class="s-val" style="font-size:20px">Cửa hàng</div>
        <div class="s-sub">Menu đầy đủ</div>
      </div>
      <div class="summary-card" style="border-left-color:#888;">
        <div class="s-label">📍 Trung Hòa</div>
        <div class="s-val" style="font-size:20px">Cửa hàng</div>
        <div class="s-sub">Menu đầy đủ</div>
      </div>
      <div class="summary-card" style="border-left-color:#aaa;">
        <div class="s-label">🛒 Online</div>
        <div class="s-val" style="font-size:20px">Kênh</div>
        <div class="s-sub">Đặt hàng trực tuyến</div>
      </div>
    </div>

    <h3 style="font-family:'Playfair Display',serif;font-size:18px;color:var(--chocolate);margin:24px 0 16px;">Thông Tin Bảo Quản</h3>
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Danh Mục</th><th>Nhiệt Độ</th><th>HSD Tiêu Biểu</th><th>Lưu Ý</th>
        </tr></thead>
        <tbody>
          <tr>
            <td><strong>Bánh Daily & Sinh Nhật</strong></td>
            <td>Tủ mát 2–8°C</td>
            <td>3–6 ngày (hủy trước 1 ngày)</td>
            <td class="note">Less sugar –50%</td>
          </tr>
          <tr>
            <td><strong>Bánh Mì / Donut</strong></td>
            <td>Nhiệt độ phòng lạnh</td>
            <td>1–5 ngày</td>
            <td class="note">Tránh ánh sáng trực tiếp</td>
          </tr>
          <tr>
            <td><strong>Bánh Keto</strong></td>
            <td>Tủ mát 2–8°C</td>
            <td>6–8 ngày</td>
            <td><span class="tag-keto">100% Almond Powder</span></td>
          </tr>
          <tr>
            <td><strong>Cookie (hộp/túi)</strong></td>
            <td>Nhiệt độ phòng</td>
            <td>45 ngày</td>
            <td class="note">Tránh ánh sáng, ẩm ướt</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</main>

<script>
const DATA = {
  daily: [{"stt":"1","ma_sp":"TCL/TP0001","ten_banh":"Cuộn xoài","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, mascapone, creamcheese, xoài tươi.","mo_ta":"Bạt bông lan mềm ẩm ăn cùng xoài tươi và kem cheese béo ngậy.","dvt":"Miếng","gia":"60,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"2","ma_sp":"TCL/TP0002","ten_banh":"Cuộn chocolate","thanh_phan":"Bột mì, bột cacao, trứng, sữa tươi, dầu hướng dương, đường, whipping, chocolate 65%.","mo_ta":"Bạt bánh cùng kem tươi đẫm vị chocolate, không thể bỏ lỡ.","dvt":"Miếng","gia":"60,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"3","ma_sp":"TCL/TP0003","ten_banh":"Cuộn caramel muối","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, cà phê, whipping, mascapone, lotus cookie.","mo_ta":"Bánh cuộn thơm hương cà phê, ăn kèm sốt caramel.","dvt":"Miếng","gia":"65,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"4","ma_sp":"TCL/TP0004","ten_banh":"Cuộn hồng trà cam","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, hồng trà, whipping, mascapone, custard cam, cam tươi.","mo_ta":"Bạt bánh hương vị hồng trà, ăn kèm những tép cam tươi và kem mát lạnh.","dvt":"Miếng","gia":"80,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"5","ma_sp":"TCL/TP0005","ten_banh":"Tiramisu","thanh_phan":"Bột mì, trứng, đường, whipping, mascapone, rượu rum, cà phê espresso, cacao","mo_ta":"Hương vị xen lẫn giữa kem mascarpone cùng rượu Rum, bột cacao và cafe dịu nhẹ.","dvt":"Miếng","gia":"75,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"6","ma_sp":"TCL/TP0006","ten_banh":"Red velvet","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, men gạo đỏ, whipping, creamcheese.","mo_ta":"Red velvet với hương vị cacao thơm nồng kết hợp hài hoà với phần cream cheese béo ngậy, mềm ẩm.","dvt":"Miếng","gia":"60,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"7","ma_sp":"TCL/TP0007","ten_banh":"Mini fruit","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, hoa quả tươi.","mo_ta":"Bánh kem tươi ăn cùng các loại hoa quả nhiệt đới, kích thích vị giác.","dvt":"Miếng","gia":"75,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"8","ma_sp":"TCL/TP0008","ten_banh":"Matcha dừa","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, Whipping, thạch dừa, cốt dừa, matcha.","mo_ta":"Bạt bánh trà xanh, ăn cùng kem và thạch dừa handmade.","dvt":"Miếng","gia":"60,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"9","ma_sp":"TCL/TP0009","ten_banh":"Sữa chua nho mini","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, sourcream, nho","mo_ta":"Bánh kem vị sữa chua ăn cùng nho tươi mát.","dvt":"Miếng","gia":"70,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"10","ma_sp":"TCL/TP0010","ten_banh":"Cheese chanh vàng","thanh_phan":"Bột mì, trứng, đường, whipping, creamcheese, mascapone, chanh vàng.","mo_ta":"Bánh kem phomai tươi ăn cùng sốt chanh vàng chua nhẹ.","dvt":"Miếng","gia":"80,000","hsd":"6 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"11","ma_sp":"TCL/TP0014","ten_banh":"Su kem trứng","thanh_phan":"Bột mì, trứng, đường, bơ, sữa tươi, whipping.","mo_ta":"Vỏ bánh mềm ẩm, kem trứng béo ngậy. 1 hộp 10 chiếc.","dvt":"Hộp","gia":"90,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"12","ma_sp":"TCL/TP0011","ten_banh":"Kem tươi sầu riêng","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, sầu riêng tươi, whipping, mascapone.","mo_ta":"Cốt bánh bông lan ăn kèm kem whipping béo ngậy, kết hợp với sầu tươi ngọt thơm.","dvt":"Hộp","gia":"95,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"13","ma_sp":"TCL/TP0015","ten_banh":"Su dẻo sầu","thanh_phan":"Bột mì, bột nếp, trứng, đường, bơ, sữa tươi, sầu riêng.","mo_ta":"Vỏ su dẻo kết hợp với kem sầu riêng, tín đồ sầu riêng không thể bỏ qua.","dvt":"Hộp","gia":"115,000","hsd":"3 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"14","ma_sp":"TCL/TP0013","ten_banh":"Tripple Chocolate","thanh_phan":"Bột mì, bột cacao, trứng, sữa tươi, dầu hướng dương, đường, whipping, chocolate 65%, rượu Rum","mo_ta":"Cốt bánh đặc, ẩm, mềm, ăn cùng kem ganache chocolate đậm vị, mướt mịn cùng chút rượu Rum thơm nồng","dvt":"Miếng","gia":"60,000","hsd":"6 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"17","ma_sp":"TCL/TP0016","ten_banh":"Whipping caramel","thanh_phan":"Trứng, đường, whipping cream, sữa","mo_ta":"Kem caramel mềm mịn, thơm ngậy được làm từ whipping cream","dvt":"Miếng","gia":"20,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"18","ma_sp":"TCL/TP0105","ten_banh":"Bánh kem sữa đào","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, mứt đào miếng, gelatine.","mo_ta":"Bánh kem sữa ăn cùng thạch đào và đào miếng cắt nhỏ","dvt":"Miếng","gia":"70,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"20","ma_sp":"TCL/TP0110","ten_banh":"Sữa chua dâu","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, sour cream, dâu tươi","mo_ta":"Bông lan ăn cùng kem sữa chua thơm ngậy, chua dịu với dâu tươi theo mùa","dvt":"Miếng","gia":"75,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"21","ma_sp":"TCL/TP0089","ten_banh":"Xoài Dừa","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, xoài tươi, bột cốt dừa, sữa đặc, xoài cô đặc, chanh cô đặc, gelatine.","mo_ta":"Bạt bông lan mềm ẩm ăn cùng xoài tươi, sốt chanh xoài và kem custard dừa thơm ngậy.","dvt":"Miếng","gia":"75,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"22","ma_sp":"TCL/TP0116","ten_banh":"Custard Dâu","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, kem trứng custard, dâu tươi, puree dâu, puree phúc bồn tử, gelatine.","mo_ta":"Bạt bông lan mềm ẩm ăn cùng kem custard thơm ngậy, thạch dâu tây chua dịu và dâu tươi.","dvt":"Miếng","gia":"85,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"23","ma_sp":"TCL/TP0117","ten_banh":"Chanh vàng bạc hà","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, tinh chất bạc hà, đường, whipping, creamcheese, custard chanh vàng, thạch chanh vàng, nước chanh cô đặc, gelatine.","mo_ta":"Bạt bông lan mềm ẩm, the mát hương bạc hà, ăn cùng kem custard chanh phô mai thơm ngậy, thạch chanh vàng chua dịu.","dvt":"Miếng","gia":"72,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"Less sugar -50%"},{"stt":"24","ma_sp":"TCL/TP0115","ten_banh":"Bơ Caramel","thanh_phan":"Bơ, sữa, whipping, đường, nước","mo_ta":"Một chút vị mặn nơi đầu lưỡi, hòa quyện cùng vị ngọt thanh béo ngậy, hấp dẫn ở hậu vị","dvt":"Hộp","gia":"20,000","hsd":"15 ngày (hủy đúng ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":""}],
  sinhnhat: [{"stt":"1","ma_sp":"TCL/TP0049","ten_banh":"Xoài cheese 14","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, mascapone, creamcheese, xoài tươi.","dvt":"Cái","gia":"550,000","kich_thuoc":"Đường kính 14 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"2","ma_sp":"TCL/TP0050","ten_banh":"Xoài cheese 16","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, mascapone, creamcheese, xoài tươi.","dvt":"Cái","gia":"650,000","kich_thuoc":"Đường kính 16 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"3","ma_sp":"TCL/TP0051","ten_banh":"Tiramisu 14","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, mascapone, cà phê espresso, rượu rum, bột cacao","dvt":"Cái","gia":"550,000","kich_thuoc":"Đường kính 14 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"4","ma_sp":"TCL/TP0052","ten_banh":"Tiramisu 16","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, mascapone, cà phê espresso, rượu rum, bột cacao","dvt":"Cái","gia":"650,000","kich_thuoc":"Đường kính 16 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"5","ma_sp":"TCL/TP0053","ten_banh":"Chuối caramel 14","thanh_phan":"Bột mì, bột cacao, trứng, sữa tươi, dầu hướng dương, đường, whipping, sốt caramel, chuối tươi","dvt":"Cái","gia":"500,000","kich_thuoc":"Đường kính 14 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"6","ma_sp":"TCL/TP0054","ten_banh":"Chuối caramel 16","thanh_phan":"Bột mì, bột cacao, trứng, sữa tươi, dầu hướng dương, đường, whipping, sốt caramel, chuối tươi","dvt":"Cái","gia":"600,000","kich_thuoc":"Đường kính 16 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"7","ma_sp":"TCL/TP0055","ten_banh":"Earlgrey 14","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, bánh quy vị trà Bá Tước.","dvt":"Cái","gia":"500,000","kich_thuoc":"Đường kính 14 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"8","ma_sp":"TCL/TP0056","ten_banh":"Earlgrey 16","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, bánh quy vị trà Bá Tước.","dvt":"Cái","gia":"600,000","kich_thuoc":"Đường kính 16 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"9","ma_sp":"TCL/TP0057","ten_banh":"Dâu sữa chua 14","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, sourcream, dâu tây.","dvt":"Cái","gia":"550,000","kich_thuoc":"Đường kính 14 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"10","ma_sp":"TCL/TP0058","ten_banh":"Dâu sữa chua 16","thanh_phan":"Bột mì, trứng, sữa tươi, dầu hướng dương, đường, whipping, sourcream, dâu tây.","dvt":"Cái","gia":"650,000","kich_thuoc":"Đường kính 16 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"11","ma_sp":"TCL/TP0059","ten_banh":"Việt quất 14","thanh_phan":"Bột mì, trứng, sữa, whipping, mứt việt quất, Việt quất tươi, sốt socola","dvt":"Cái","gia":"500,000","kich_thuoc":"Đường kính 14 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"12","ma_sp":"TCL/TP0060","ten_banh":"Việt quất 16","thanh_phan":"Bột mì, trứng, sữa, whipping, mứt việt quất, Việt quất tươi, sốt socola","dvt":"Cái","gia":"600,000","kich_thuoc":"Đường kính 16 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"13","ma_sp":"TCL/TP0061","ten_banh":"Hoa quả 14","thanh_phan":"Bột mì, trứng, sữa, whipping, hoa quả nhiệt đới","dvt":"Cái","gia":"550,000","kich_thuoc":"Đường kính 14 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"14","ma_sp":"TCL/TP0062","ten_banh":"Hoa quả 16","thanh_phan":"Bột mì, trứng, sữa, whipping, hoa quả nhiệt đới","dvt":"Cái","gia":"650,000","kich_thuoc":"Đường kính 16 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"15","ma_sp":"TCL/TP0063","ten_banh":"Yellow lemon 14","thanh_phan":"Bột mì, trứng, sữa, whipping, Mơ sấy dẻo, custard chanh vàng, mứt mật ong chanh vàng","dvt":"Cái","gia":"500,000","kich_thuoc":"Đường kính 14 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"16","ma_sp":"TCL/TP0064","ten_banh":"Yellow lemon 16","thanh_phan":"Bột mì, trứng, sữa, whipping, Mơ sấy dẻo, custard chanh vàng, mứt mật ong chanh vàng","dvt":"Cái","gia":"600,000","kich_thuoc":"Đường kính 16 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"17","ma_sp":"TCL/TP0065","ten_banh":"Hồng trà cam 14","thanh_phan":"Bột mì, trứng, sữa, whipping, custard cam, cam tươi, hồng trà","dvt":"Cái","gia":"550,000","kich_thuoc":"Đường kính 14 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"18","ma_sp":"TCL/TP0066","ten_banh":"Hồng trà cam 16","thanh_phan":"Bột mì, trứng, sữa, whipping, custard cam, cam tươi, hồng trà","dvt":"Cái","gia":"650,000","kich_thuoc":"Đường kính 16 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"19","ma_sp":"TCL/TP0067","ten_banh":"Chocolate 14","thanh_phan":"Bột mì, trứng, sữa, whipping, socola.","dvt":"Cái","gia":"500,000","kich_thuoc":"Đường kính 14 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"20","ma_sp":"TCL/TP0068","ten_banh":"Chocolate 16","thanh_phan":"Bột mì, trứng, sữa, whipping, socola.","dvt":"Cái","gia":"600,000","kich_thuoc":"Đường kính 16 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"21","ma_sp":"TCL/TP0069","ten_banh":"Bánh sinh nhật size 12","thanh_phan":"","dvt":"Cái","gia":"450,000","kich_thuoc":"Đường kính 12 cm","bao_bi":"Hộp mica","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C"},{"stt":"22","ma_sp":"","ten_banh":"Bánh Bento Sữa chua Dâu","thanh_phan":"Cốt vani, kem sữa chua dâu, kem láng oreo, kem chảy màu hồng nhạt","dvt":"Cái","gia":"150,000","kich_thuoc":"Đường kính 10 cm","bao_bi":"","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":""},{"stt":"23","ma_sp":"","ten_banh":"Bánh Bento Matcha Dâu","thanh_phan":"Cốt vani, kem matcha mứt dâu, kem láng matcha","dvt":"Cái","gia":"150,000","kich_thuoc":"Đường kính 10 cm","bao_bi":"","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":""},{"stt":"24","ma_sp":"","ten_banh":"Bánh Bento Chocolate","thanh_phan":"Cốt choco, kem choco","dvt":"Cái","gia":"150,000","kich_thuoc":"Đường kính 10 cm","bao_bi":"","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":""},{"stt":"25","ma_sp":"","ten_banh":"Bánh Bento Cheese Việt quất","thanh_phan":"Cốt vani, kem cheese, mứt việt quất, láng trắng, loang hồng nhạt, hoa hồng sấy khô","dvt":"Cái","gia":"150,000","kich_thuoc":"Đường kính 10 cm","bao_bi":"","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":""},{"stt":"26","ma_sp":"","ten_banh":"Bánh Bento Earlgrey Cookies","thanh_phan":"Cốt vani, kem earlgrey cookie","dvt":"Cái","gia":"150,000","kich_thuoc":"Đường kính 10 cm","bao_bi":"","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":""},{"stt":"27","ma_sp":"","ten_banh":"Bánh Bento Xoài dừa","thanh_phan":"Cốt vani, kem dừa + xoài","dvt":"Cái","gia":"150,000","kich_thuoc":"Đường kính 10 cm","bao_bi":"","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":""}],
  mi: [{"stt":"1","ma_sp":"TCL/TP0017","ten_banh":"Sừng bò trứng muối mini","thanh_phan":"Bột mì, trứng, đường, muối, bơ, men, sữa tươi, sữa bột, bột custard, trứng muối.","mo_ta":"Vỏ bánh ngàn lớp ăn kèm sốt trứng muối bên trong. 1 túi 3 bánh.","dvt":"Túi","gia":"80,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"2","ma_sp":"TCL/TP0018","ten_banh":"Sừng bò hạnh nhân mini","thanh_phan":"Bột mì, trứng, đường, muối, bơ, men, bột hạnh nhân, hạnh nhân lát, rượu rum.","mo_ta":"Vỏ ngàn lớp cùng sốt và hạnh nhân giòn phủ trên mặt bánh. 1 túi 3 cái.","dvt":"Túi","gia":"80,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"3","ma_sp":"TCL/TP0019","ten_banh":"Sừng bò socola mini","thanh_phan":"Bột mì, trứng, đường, muối, bơ, men, sữa tươi, sữa bột, socola.","mo_ta":"Vỏ ngàn lớp cùng với socola, phủ bên trên là lớp socola cùng hạt điều","dvt":"Cái","gia":"35,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"4","ma_sp":"TCL/TP0020","ten_banh":"Bánh mì Nam Việt Quất","thanh_phan":"Bột mì, muối, men, đường, sữa tươi, bơ, nam việt quất","mo_ta":"Bánh mì mềm thơm được làm từ kem sữa tươi, kết hợp với quả nam việt quất.","dvt":"Túi","gia":"55,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"5","ma_sp":"TCL/TP0021","ten_banh":"Bánh mì gối trắng","thanh_phan":"Bột mì, muối, men, đường, sữa tươi, whipping, bơ.","mo_ta":"Bánh mì mềm thơm được làm từ kem sữa whipping.","dvt":"Túi","gia":"45,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"6","ma_sp":"TCL/TP0022","ten_banh":"Bánh mì nguyên cám","thanh_phan":"Bột mì, bột nguyên cám","mo_ta":"Bánh mì hạt nguyên cám, mềm thơm tốt cho sức khoẻ.","dvt":"Túi","gia":"65,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"7","ma_sp":"TCL/TP0023","ten_banh":"Bánh mì hạt nảy mầm","thanh_phan":"Bột mì, hạt nảy mầm, bơ","mo_ta":"Bạt bánh nướng cùng hạt nguyên cám nẩy mầm, thơm đậm mùi lúa mạch, tốt cho sức khoẻ.","dvt":"Túi","gia":"65,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"8","ma_sp":"TCL/TP0029","ten_banh":"Bánh mì ruốc lợn","thanh_phan":"Bột mì, muối, men, đường, sữa tươi, bơ, dầu hướng dương, ruốc thịt lợn, xúc xích, hành, cà rốt.","mo_ta":"Bạt bánh mì ăn kèm sốt dầu trứng cùng ruốc lợn.","dvt":"Hộp","gia":"38,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"9","ma_sp":"TCL/TP0030","ten_banh":"Bánh mì ruốc gà","thanh_phan":"Bột mì, muối, men, đường, sữa tươi, bơ, dầu hướng dương, ruốc gà cay, xúc xích, hành, cà rốt.","mo_ta":"Bạt bánh mì ăn kèm sốt dầu trứng cùng ruốc gà cay.","dvt":"Hộp","gia":"40,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"10","ma_sp":"TCL/TP0031","ten_banh":"Bánh xúc xích cheese","thanh_phan":"Bột mì, đường, trứng, sữa, men, whipping, xúc xích, ngô, phomai, sốt mayonnaise, tương cà.","mo_ta":"Bánh mì ăn kèm xúc xích và phomai cùng với sốt béo ngậy.","dvt":"Cái","gia":"45,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"11","ma_sp":"TCL/TP0032","ten_banh":"Bánh cheese việt quất","thanh_phan":"Bột mì, trứng, sữa, nam việt quất, đường, cheese, kem whipping","mo_ta":"Vỏ mềm, nhân bánh là cheese và quả nam việt quất sấy.","dvt":"Túi","gia":"40,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"12","ma_sp":"TCL/TP0036","ten_banh":"Mochi khoai lang","thanh_phan":"Bột mochi, khoai mật, mật ong, bơ TH","mo_ta":"Vỏ bánh mochi dẻo dai cùng nhân khoai lang mật ngọt bùi, thơm ngậy. Must try.","dvt":"Hộp (3 chiếc)","gia":"115,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"13","ma_sp":"TCL/TP0037","ten_banh":"Ham & Cheese","thanh_phan":"Bột mì, trứng, sữa, phomai, whipping, giăm bông","mo_ta":"Bánh mì ăn kèm thịt nguội và đẫm sốt bên trong, phô mai phủ bề mặt.","dvt":"Hộp","gia":"48,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"14","ma_sp":"TCL/TP0024","ten_banh":"Bánh mì khoai môn","thanh_phan":"Bột mì, đường, trứng, sữa, nhân khoai môn, bơ","mo_ta":"Bánh mì mềm, ẩm được kết hợp cùng nhân khoai môn","dvt":"Hộp","gia":"65,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"15","ma_sp":"TCL/TP0025","ten_banh":"Bánh mì hoa cúc","thanh_phan":"Bột mì, đường, trứng, hạnh nhân, whipping, tinh dầu cam","mo_ta":"Bánh mì mềm, ẩm, dai, phủ 1 lớp đường ngọc trai và hạnh nhân lát, thơm vị cam","dvt":"Hộp","gia":"75,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"16","ma_sp":"TCL/TP0026","ten_banh":"Bánh mì bơ hạnh nhân","thanh_phan":"Bột mì, đường, trứng, sữa, hạnh nhân, bơ nhạt","mo_ta":"Bánh mì mềm, ẩm được kết hợp 1 lớp kem hạnh nhân","dvt":"Hộp","gia":"75,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"17","ma_sp":"TCL/TP0027","ten_banh":"Bánh mì sữa chua","thanh_phan":"Bột mì, đường, trứng, sữa, nhân sữa chua","mo_ta":"Bánh mì mềm, ẩm được kết hợp cùng nhân sữa chua","dvt":"Hộp","gia":"65,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"18","ma_sp":"TCL/TP0028","ten_banh":"Bánh mì nguyên cám mix hạt","thanh_phan":"Bột mì, bột nguyên cám, hạt óc chó, hạt điều, hạt bí, các loại hạt ngũ cốc","mo_ta":"Bánh mì mềm kết hợp các loại hạt ngũ cốc tốt cho sức khỏe","dvt":"Hộp","gia":"55,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"19","ma_sp":"TCL/TP0038","ten_banh":"Bánh ham ngô cheese","thanh_phan":"Bột mì, trứng, đường, sữa, giăm bông, ngô, phomai","mo_ta":"Bánh mềm, ẩm, đẫm sốt và nhân, thích hợp cho 1 bữa ăn sáng đầy năng lượng","dvt":"Hộp","gia":"55,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"20","ma_sp":"TCL/TP0039","ten_banh":"Cheese yogurt","thanh_phan":"Trứng, bột mì, whipping, sữa chua, đường, phomai","mo_ta":"Bạt bánh mềm, kết hợp kem whipping và sữa chua, cream cheese được nướng cháy bề mặt","dvt":"Hộp","gia":"45,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"21","ma_sp":"TCL/TP0102","ten_banh":"Bánh cheese chà bông","thanh_phan":"Bột mì, trứng, đường sữa, cream cheese, phomai lát, chà bông","mo_ta":"Lớp bánh mì mềm, xốp, kết hợp kem cheese béo ngậy, phủ một lớp phomai và chà bông mặn","dvt":"Hộp","gia":"45,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"22","ma_sp":"TCL/TP0033","ten_banh":"Donut vị bơ sữa","thanh_phan":"Bột mì, trứng, đường, sữa.","mo_ta":"Lớp bánh mềm, xốp kết hợp cùng bơ, sữa tươi béo ngậy","dvt":"Chiếc","gia":"30,000","hsd":"1 ngày","bao_quan":"Phòng lạnh"},{"stt":"23","ma_sp":"TCL/TP0034","ten_banh":"Donut vị chocolate","thanh_phan":"Bột mì, trứng, đường, sữa, socola","mo_ta":"Lớp bánh mềm, xốp kết hợp cùng socola","dvt":"Chiếc","gia":"35,000","hsd":"1 ngày","bao_quan":"Phòng lạnh"},{"stt":"24","ma_sp":"TCL/TP0035","ten_banh":"Donut vị quế đường","thanh_phan":"Bột mì, trứng, đường, sữa, quế","mo_ta":"Lớp bánh mềm, xốp vị quế đường","dvt":"Chiếc","gia":"30,000","hsd":"1 ngày","bao_quan":"Phòng lạnh"},{"stt":"25","ma_sp":"TCL/TP0111","ten_banh":"Donut vị kem cháy","thanh_phan":"Bột mì, trứng, đường, sữa, kem","mo_ta":"Lớp bánh mềm, xốp kết hợp cùng lớp kem được nướng cháy","dvt":"Chiếc","gia":"35,000","hsd":"1 ngày","bao_quan":"Phòng lạnh"},{"stt":"26","ma_sp":"TCL/TP0012","ten_banh":"Chuối choco","thanh_phan":"Chuối, socola chip, bột mì, đường, các loại hạt bí, nam việt quất.","mo_ta":"Bạt chuối nướng socola cùng các loại hạt.","dvt":"Miếng","gia":"55,000","hsd":"4 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"27","ma_sp":"TCL/TP0114","ten_banh":"Bánh mì cuộn xúc xích","thanh_phan":"Bột mì, đường, trứng, sữa, men, whipping, xúc xích, phomai, sốt mayonnaise","mo_ta":"Bánh mì mềm ăn cùng xúc xích và phô mai","dvt":"Chiếc","gia":"40,000","hsd":"5 ngày (Hủy trước 1 ngày)","bao_quan":"Phòng lạnh"},{"stt":"28","ma_sp":"","ten_banh":"Hoa cúc ngàn lớp","thanh_phan":"","mo_ta":"Vỏ bánh ngàn lớp - Ngoài giòn, trong mềm ẩm - Có thể tách lớp từng thớ - Thơm đẫm mùi bơ","dvt":"Cái","gia":"135,000","hsd":"","bao_quan":"Phòng lạnh"}],
  keto: [{"stt":"1","ma_sp":"TCL/TP0044","ten_banh":"Tira keto","thanh_phan":"Bột hạnh nhân, đường ăn kiêng, kem whipping avon, cafe, trứng","mo_ta":"Bạt bánh làm từ bột hạnh nhân, không sử dụng chất tạo ngọt.","dvt":"Hộp","gia":"135,000","hsd":"6 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"100% ALMOND POWDER & ISOMALT SUGAR"},{"stt":"2","ma_sp":"TCL/TP0045","ten_banh":"Brownie keto","thanh_phan":"Bột hạnh nhân, đường ăn kiêng, bột cacao, hạt óc chó, mơ sấy dẻo, nam việt quất","mo_ta":"Bạt bánh làm từ bột hạnh nhân, chocolate và đường ăn kiêng isomalt.","dvt":"Hộp","gia":"165,000","hsd":"8 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"100% ALMOND POWDER & ISOMALT SUGAR"},{"stt":"3","ma_sp":"TCL/TP0046","ten_banh":"Cheesecake keto","thanh_phan":"Bột hạnh nhân, đường ăn kiêng, cream cheese","mo_ta":"Bạt bánh bột hạnh nhân với kem cheese nướng, đường isomalt. Hộp 4 bánh.","dvt":"Hộp","gia":"160,000","hsd":"8 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"100% ALMOND POWDER & ISOMALT SUGAR"},{"stt":"4","ma_sp":"TCL/TP0047","ten_banh":"Bánh mì hạnh nhân keto","thanh_phan":"Bột hạnh nhân, đường ăn kiêng, lòng trắng trứng, hạt chia","mo_ta":"Bánh mì hạnh nhân, mềm ẩm, không sử dụng chất làm ngọt.","dvt":"Túi","gia":"105,000","hsd":"8 ngày (Hủy trước 1 ngày)","bao_quan":"Tủ mát 2-8°C","ghi_chu":"100% ALMOND POWDER & ISOMALT SUGAR"}],
  cookie: [{"stt":"1","ma_sp":"TCL/TP0077","ten_banh":"COCONUT ALMOND COOKIE 150G","thanh_phan":"Bơ, đường, trứng, muối, bột mì, bột cơm dừa, vụn dừa khô, hạnh nhân lát, vanilla.","dvt":"Hộp","gia":"110,000","trong_luong":"150g","bao_quan":"45 ngày"},{"stt":"2","ma_sp":"TCL/TP0080","ten_banh":"STRAWBERRY COOKIE 200G","thanh_phan":"Bơ, đường, trứng, muối, bột mì, dâu tây sấy khô, mứt dâu tây","dvt":"Hộp","gia":"145,000","trong_luong":"200g","bao_quan":"45 ngày"},{"stt":"3","ma_sp":"TCL/TP0074","ten_banh":"ROMIA COOKIE 150G","thanh_phan":"Bơ, đường, trứng, muối, bột mì, các loại hạt dinh dưỡng","dvt":"Hộp","gia":"110,000","trong_luong":"150g","bao_quan":"45 ngày"},{"stt":"4","ma_sp":"TCL/TP0075","ten_banh":"ESPRESSO ROMIA COOKIE 150G","thanh_phan":"Bơ, đường, trứng, muối, bột mì, cà phê espresso, các loại hạt dinh dưỡng","dvt":"Hộp","gia":"110,000","trong_luong":"150g","bao_quan":"45 ngày"},{"stt":"5","ma_sp":"TCL/TP0076","ten_banh":"EARLGREY COOKIE 150G","thanh_phan":"Bơ, đường, trứng, muối, bột mì, trà earlgrey, sữa tươi.","dvt":"Hộp","gia":"110,000","trong_luong":"150g","bao_quan":"45 ngày"},{"stt":"6","ma_sp":"TCL/TP0079","ten_banh":"CHOCOCHIP COOKIES 200G","thanh_phan":"Bơ, đường, trứng, muối, chocochip","dvt":"Hộp","gia":"145,000","trong_luong":"200g","bao_quan":"45 ngày"},{"stt":"7","ma_sp":"TCL/TP0106","ten_banh":"Cookie chocochip ẩm","thanh_phan":"Bơ, đường, trứng, muối, bột mì, bột cacao, chocolate.","dvt":"Chiếc","gia":"25,000","trong_luong":"","bao_quan":"45 ngày"},{"stt":"8","ma_sp":"TCL/TP0107","ten_banh":"Cookie chocochip giòn","thanh_phan":"Bơ, đường, trứng, muối, bột mì, bột quế, chocolate.","dvt":"Chiếc","gia":"30,000","trong_luong":"","bao_quan":"45 ngày"},{"stt":"9","ma_sp":"TCL/TP0104","ten_banh":"Cookie quả vả kem phomai","thanh_phan":"Quả vả sấy, kem phomai","dvt":"Chiếc","gia":"105,000","trong_luong":"","bao_quan":"45 ngày"},{"stt":"10","ma_sp":"TCL/TP0070","ten_banh":"Bánh hạnh nhân ngói","thanh_phan":"Đường, trứng, bột mì","dvt":"Hộp","gia":"85,000","trong_luong":"100g","bao_quan":"45 ngày"},{"stt":"11","ma_sp":"TCL/TP0071","ten_banh":"Cookie lưỡi mèo","thanh_phan":"Đường, lòng trắng trứng, bột mì, bơ, vani","dvt":"Túi","gia":"50,000","trong_luong":"100g","bao_quan":"45 ngày"},{"stt":"12","ma_sp":"TCL/TP0073","ten_banh":"Cookie cheese","thanh_phan":"Đường, trứng, bột mì, bơ, cheese, bột phomai, vừng đen","dvt":"Túi","gia":"80,000","trong_luong":"100g","bao_quan":"45 ngày"},{"stt":"13","ma_sp":"TCL/TP0112","ten_banh":"Cookie Caramel Almond Macca","thanh_phan":"Đường, bơ, bột mì, hạt macca, socola, mật ong","dvt":"Hộp","gia":"165,000","trong_luong":"150g","bao_quan":"45 ngày"},{"stt":"14","ma_sp":"TCL/TP0113","ten_banh":"Cookie Cheese Cashew","thanh_phan":"Đường, bơ, lòng trắng trứng, whipping, bột phomai, hạt điều","dvt":"Hộp","gia":"165,000","trong_luong":"150g","bao_quan":"45 ngày"}]
};

// Track filtered data
let filteredData = {};
for (let k in DATA) filteredData[k] = [...DATA[k]];

function showTab(name, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  btn.classList.add('active');
}

function formatGia(g) {
  if (!g || g === '') return '—';
  return g.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
}

// Render tables
function renderDaily() {
  const tbody = document.getElementById('tbody-daily');
  tbody.innerHTML = '';
  filteredData.daily.forEach((p, i) => {
    const rid = 'dr-' + i;
    const row = `<tr>
      <td><div class="stt-num">${p.stt}</div></td>
      <td><span class="ma-sp">${p.ma_sp || '—'}</span></td>
      <td><div class="ten-banh">${p.ten_banh}</div><div class="mo-ta" style="margin-top:3px">${p.mo_ta||''}</div></td>
      <td><span class="dvt">${p.dvt}</span></td>
      <td><span class="gia">${p.gia} đ</span></td>
      <td><div class="hsd">${p.hsd}</div></td>
      <td>${p.ghi_chu ? '<span class="tag-less">' + p.ghi_chu + '</span>' : ''}</td>
      <td><button class="expand-btn" onclick="toggleDetail('${rid}')" title="Xem thêm">▾</button></td>
    </tr>
    <tr class="detail-row" id="${rid}">
      <td colspan="8" class="detail-cell">
        <div class="detail-grid">
          <div class="detail-item"><label>Thành Phần</label><p>${p.thanh_phan||'—'}</p></div>
          <div class="detail-item"><label>Bảo Quản</label><p>${p.bao_quan||'—'}</p></div>
          <div class="detail-item"><label>Mã SP</label><p>${p.ma_sp||'—'}</p></div>
        </div>
      </td>
    </tr>`;
    tbody.innerHTML += row;
  });
  document.getElementById('count-daily').textContent = filteredData.daily.length + ' sản phẩm';
}

function renderSinhNhat() {
  const tbody = document.getElementById('tbody-sinhnhat');
  tbody.innerHTML = '';
  filteredData.sinhnhat.forEach((p, i) => {
    const rid = 'snr-' + i;
    const row = `<tr>
      <td><div class="stt-num">${p.stt}</div></td>
      <td><span class="ma-sp">${p.ma_sp || '—'}</span></td>
      <td><div class="ten-banh">${p.ten_banh}</div></td>
      <td><span class="dvt">${p.dvt}</span></td>
      <td><span class="gia">${p.gia} đ</span></td>
      <td style="font-size:12.5px">${p.kich_thuoc||'—'}</td>
      <td style="font-size:12.5px">${p.bao_bi||'—'}</td>
      <td><div class="hsd">${p.hsd}</div></td>
      <td><button class="expand-btn" onclick="toggleDetail('${rid}')" title="Xem thêm">▾</button></td>
    </tr>
    <tr class="detail-row" id="${rid}">
      <td colspan="9" class="detail-cell">
        <div class="detail-grid">
          <div class="detail-item"><label>Thành Phần</label><p>${p.thanh_phan||'—'}</p></div>
          <div class="detail-item"><label>Bảo Quản</label><p>${p.bao_quan||'—'}</p></div>
          <div class="detail-item"><label>Mã SP</label><p>${p.ma_sp||'—'}</p></div>
        </div>
      </td>
    </tr>`;
    tbody.innerHTML += row;
  });
  document.getElementById('count-sinhnhat').textContent = filteredData.sinhnhat.length + ' sản phẩm';
}

function renderMi() {
  const tbody = document.getElementById('tbody-mi');
  tbody.innerHTML = '';
  filteredData.mi.forEach((p, i) => {
    const rid = 'mir-' + i;
    const row = `<tr>
      <td><div class="stt-num">${p.stt}</div></td>
      <td><span class="ma-sp">${p.ma_sp || '—'}</span></td>
      <td><div class="ten-banh">${p.ten_banh}</div></td>
      <td><div class="mo-ta">${p.mo_ta||''}</div></td>
      <td><span class="dvt">${p.dvt}</span></td>
      <td><span class="gia">${p.gia} đ</span></td>
      <td><div class="hsd">${p.hsd}</div></td>
      <td><button class="expand-btn" onclick="toggleDetail('${rid}')" title="Xem thêm">▾</button></td>
    </tr>
    <tr class="detail-row" id="${rid}">
      <td colspan="8" class="detail-cell">
        <div class="detail-grid">
          <div class="detail-item"><label>Thành Phần</label><p>${p.thanh_phan||'—'}</p></div>
          <div class="detail-item"><label>Bảo Quản</label><p>${p.bao_quan||'—'}</p></div>
          <div class="detail-item"><label>Mã SP</label><p>${p.ma_sp||'—'}</p></div>
        </div>
      </td>
    </tr>`;
    tbody.innerHTML += row;
  });
  document.getElementById('count-mi').textContent = filteredData.mi.length + ' sản phẩm';
}

function renderKeto() {
  const tbody = document.getElementById('tbody-keto');
  tbody.innerHTML = '';
  filteredData.keto.forEach((p, i) => {
    const rid = 'ketor-' + i;
    const row = `<tr>
      <td><div class="stt-num">${p.stt}</div></td>
      <td><span class="ma-sp">${p.ma_sp || '—'}</span></td>
      <td><div class="ten-banh">${p.ten_banh}</div></td>
      <td><div class="thanh-phan">${p.thanh_phan||''}</div></td>
      <td><div class="mo-ta">${p.mo_ta||''}</div></td>
      <td><span class="dvt">${p.dvt}</span></td>
      <td><span class="gia">${p.gia} đ</span></td>
      <td><div class="hsd">${p.hsd}</div></td>
      <td><span class="tag-keto">Keto</span></td>
    </tr>`;
    tbody.innerHTML += row;
  });
  document.getElementById('count-keto').textContent = filteredData.keto.length + ' sản phẩm';
}

function renderCookie() {
  const tbody = document.getElementById('tbody-cookie');
  tbody.innerHTML = '';
  filteredData.cookie.forEach((p, i) => {
    const rid = 'ckr-' + i;
    const row = `<tr>
      <td><div class="stt-num">${p.stt}</div></td>
      <td><span class="ma-sp">${p.ma_sp || '—'}</span></td>
      <td><div class="ten-banh">${p.ten_banh}</div></td>
      <td><div class="thanh-phan">${p.thanh_phan||''}</div></td>
      <td><span class="dvt">${p.dvt}</span></td>
      <td><span class="gia">${p.gia} đ</span></td>
      <td style="font-size:12.5px;color:var(--text-mid)">${p.trong_luong||'—'}</td>
      <td><div class="hsd">${p.bao_quan}</div></td>
      <td><button class="expand-btn" onclick="toggleDetail('${rid}')" title="Xem thêm">▾</button></td>
    </tr>
    <tr class="detail-row" id="${rid}">
      <td colspan="9" class="detail-cell">
        <div class="detail-grid">
          <div class="detail-item"><label>Thành Phần Đầy Đủ</label><p>${p.thanh_phan||'—'}</p></div>
          <div class="detail-item"><label>Trọng Lượng</label><p>${p.trong_luong||'—'}</p></div>
          <div class="detail-item"><label>Đơn Vị Tính</label><p>${p.dvt}</p></div>
        </div>
      </td>
    </tr>`;
    tbody.innerHTML += row;
  });
  document.getElementById('count-cookie').textContent = filteredData.cookie.length + ' sản phẩm';
}

function toggleDetail(id) {
  const row = document.getElementById(id);
  row.classList.toggle('open');
  const btn = row.previousElementSibling.querySelector('.expand-btn');
  btn.textContent = row.classList.contains('open') ? '▴' : '▾';
}

function filterTable(cat, query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    filteredData[cat] = [...DATA[cat]];
  } else {
    filteredData[cat] = DATA[cat].filter(p =>
      (p.ten_banh||'').toLowerCase().includes(q) ||
      (p.ma_sp||'').toLowerCase().includes(q) ||
      (p.thanh_phan||'').toLowerCase().includes(q) ||
      (p.mo_ta||'').toLowerCase().includes(q)
    );
  }
  renderAll();
}

function filterByDvt(cat, dvt) {
  if (!dvt) { filteredData[cat] = [...DATA[cat]]; }
  else { filteredData[cat] = DATA[cat].filter(p => (p.dvt||'').includes(dvt)); }
  renderAll();
}

function filterBySize(cat, size) {
  if (!size) { filteredData[cat] = [...DATA[cat]]; }
  else { filteredData[cat] = DATA[cat].filter(p => (p.kich_thuoc||'').includes(size) || (p.ten_banh||'').includes(size)); }
  renderAll();
}

function renderAll() {
  renderDaily();
  renderSinhNhat();
  renderMi();
  renderKeto();
  renderCookie();
}

// Init
renderAll();
</script>
</body>
</html>
