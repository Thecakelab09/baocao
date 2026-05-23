<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Cake Lab — Dashboard Tháng 5/2026</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">
<style>
:root{
  --cream:#FDF8F2;--warm:#FFFCF8;--caramel:#C8813A;--caramel-l:#F5E6D3;--caramel-m:#E8C49A;
  --brown:#5C3D1E;--brown-l:#8B6340;--rose:#D4756B;--rose-l:#F5E4E2;
  --sage:#7A9E7E;--sage-l:#E4EFE5;--blue:#5B8DB8;--blue-l:#E6F2F8;
  --amber:#E8A020;--amber-l:#FEF3E2;
  --txt:#2C1810;--txt2:#7A6055;--txt3:#B09A90;--border:#EDD9C8;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--txt);min-height:100vh}

/* TOPBAR */
.topbar{background:var(--brown);height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 1.75rem;position:sticky;top:0;z-index:100}
.logo{display:flex;align-items:center;gap:10px;color:#fff}
.logo-icon{width:30px;height:30px;background:var(--caramel);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}
.logo-name{font-family:'Playfair Display',serif;font-size:17px}
.topbar-mid{display:flex;gap:2px}
.tbn{padding:5px 13px;border-radius:6px;font-size:13px;color:rgba(255,255,255,.65);cursor:pointer;border:none;background:transparent;font-family:'DM Sans',sans-serif;transition:all .15s}
.tbn:hover,.tbn.active{background:var(--caramel);color:#fff}
.topbar-r{font-size:12px;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:8px}
.chip{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:4px 11px}

/* LAYOUT */
.wrap{display:grid;grid-template-columns:200px 1fr;min-height:calc(100vh - 54px)}
.sidebar{background:var(--warm);border-right:1px solid var(--border);padding:1.25rem .875rem}
.sb-lbl{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--txt3);padding:0 6px;margin:1rem 0 5px}
.sb-item{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:8px;font-size:13px;color:var(--txt2);cursor:pointer;border:none;background:transparent;width:100%;text-align:left;font-family:'DM Sans',sans-serif;transition:all .12s;margin-bottom:1px}
.sb-item:hover{background:var(--caramel-l);color:var(--brown)}
.sb-item.active{background:var(--caramel-l);color:var(--caramel);font-weight:500}
.sb-badge{margin-left:auto;background:var(--caramel);color:#fff;font-size:10px;padding:1px 6px;border-radius:10px}

/* MAIN */
.main{padding:1.5rem 1.75rem;overflow-y:auto}
.ph{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:1.25rem}
.pt{font-family:'Playfair Display',serif;font-size:22px;font-weight:600}
.ps{font-size:12.5px;color:var(--txt3);margin-top:2px}
.btn{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border-radius:7px;font-size:12.5px;cursor:pointer;border:1px solid var(--border);background:var(--warm);color:var(--txt2);font-family:'DM Sans',sans-serif;transition:all .12s}
.btn:hover{background:var(--caramel-l);color:var(--brown)}
.btn-p{background:var(--brown);color:#fff;border-color:var(--brown)}
.btn-p:hover{background:var(--caramel);border-color:var(--caramel)}

/* SECTION HEADER */
.sec-hdr{font-size:11.5px;font-weight:500;text-transform:uppercase;letter-spacing:.8px;color:var(--txt3);margin:1.5rem 0 .75rem;display:flex;align-items:center;gap:8px}
.sec-hdr::after{content:'';flex:1;height:1px;background:var(--border)}

/* KPI */
.kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:1rem}
.kpi{background:var(--warm);border:1px solid var(--border);border-radius:11px;padding:14px 16px;position:relative;transition:transform .15s}
.kpi:hover{transform:translateY(-2px)}
.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:11px 11px 0 0}
.kpi.c-caramel::before{background:var(--caramel)}
.kpi.c-blue::before{background:var(--blue)}
.kpi.c-sage::before{background:var(--sage)}
.kpi.c-rose::before{background:var(--rose)}
.kpi.c-amber::before{background:var(--amber)}
.kpi-ico{font-size:18px;margin-bottom:8px}
.kpi-lbl{font-size:11px;color:var(--txt3);margin-bottom:3px}
.kpi-v{font-size:20px;font-weight:500;color:var(--txt);line-height:1.1}
.kpi-sub{font-size:11px;margin-top:4px}
.up{color:var(--sage)} .dn{color:var(--rose)} .neu{color:var(--txt3)}

/* PROGRESS BAR */
.prog-wrap{height:6px;background:var(--caramel-l);border-radius:3px;overflow:hidden;margin-top:6px}
.prog-fill{height:100%;border-radius:3px;transition:width .5s ease}
.prog-fill.good{background:var(--sage)}
.prog-fill.warn{background:var(--amber)}
.prog-fill.bad{background:var(--rose)}
.prog-fill.great{background:var(--caramel)}

/* GRID */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
.g3{display:grid;grid-template-columns:2fr 1fr;gap:10px;margin-bottom:10px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:10px}

/* CARD */
.card{background:var(--warm);border:1px solid var(--border);border-radius:11px;padding:16px 18px}
.ch{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.ct{font-size:13px;font-weight:500;color:var(--txt)}
.ca{font-size:11.5px;color:var(--caramel);cursor:pointer;border:none;background:none;font-family:'DM Sans',sans-serif}

/* STORE CARDS */
.store-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:10px}
.store-card{background:var(--warm);border:1px solid var(--border);border-radius:11px;padding:14px 16px}
.store-name{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.5px;color:var(--txt3);margin-bottom:10px;display:flex;align-items:center;gap:6px}
.store-dot{width:7px;height:7px;border-radius:50%}
.store-val{font-size:19px;font-weight:500;color:var(--txt);margin-bottom:2px}
.store-target{font-size:11px;color:var(--txt3)}
.store-pct{font-size:12px;font-weight:500;margin-top:6px}

/* TABLE */
.tbl{width:100%;border-collapse:collapse;font-size:12.5px}
.tbl th{font-size:10.5px;text-transform:uppercase;letter-spacing:.5px;color:var(--txt3);padding:0 8px 8px;text-align:left;border-bottom:1px solid var(--border);font-weight:500}
.tbl td{padding:8px;color:var(--txt2);border-bottom:1px solid var(--caramel-l);vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:#FDFAF5}
.tbl .bold{font-weight:500;color:var(--txt)}
.tbl .money{font-weight:500;color:var(--brown)}

/* BADGE */
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500}
.b-green{background:var(--sage-l);color:#3D7040}
.b-amber{background:var(--amber-l);color:#A06010}
.b-red{background:var(--rose-l);color:#8B4040}
.b-blue{background:var(--blue-l);color:#3A6080}

/* DIAGNOSIS */
.diag-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:10px}
.diag{border-radius:11px;padding:14px 16px;border:1px solid transparent}
.diag.demand{background:#FFF0F0;border-color:#F5C0C0}
.diag.supply{background:#FFFBEA;border-color:#F0D880}
.diag.conv{background:#FFF5EC;border-color:#F5D0A0}
.diag.exec{background:#EEF4FF;border-color:#B8CFF0}
.diag-icon{font-size:20px;margin-bottom:6px}
.diag-title{font-size:12px;font-weight:500;color:var(--txt);margin-bottom:4px}
.diag-status{font-size:11px;margin-bottom:8px}
.diag-detail{font-size:11px;color:var(--txt2);line-height:1.6}

/* SPARKLINE */
.spark{display:flex;align-items:flex-end;gap:3px;height:44px;margin-top:8px}
.sp-b{flex:1;border-radius:2px 2px 0 0;background:var(--caramel-m)}
.sp-b.hi{background:var(--caramel)}
.sp-lbl{display:flex;justify-content:space-between;font-size:9px;color:var(--txt3);margin-top:3px}

/* CHANNEL ROW */
.ch-row{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--caramel-l)}
.ch-row:last-child{border-bottom:none}
.ch-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.ch-nm{flex:1;font-size:12.5px;color:var(--txt2)}
.ch-bar{width:70px;height:5px;background:var(--caramel-l);border-radius:3px;overflow:hidden}
.ch-bf{height:100%;border-radius:3px}
.ch-pct{font-size:12px;font-weight:500;color:var(--txt);width:32px;text-align:right}

/* MARKETING */
.mkt-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--caramel-l)}
.mkt-row:last-child{border-bottom:none}
.mkt-label{font-size:12.5px;color:var(--txt2)}
.mkt-nums{display:flex;align-items:center;gap:10px;font-size:12.5px}
.mkt-real{font-weight:500;color:var(--txt)}
.mkt-target{color:var(--txt3)}

/* FOOTER */
footer{text-align:center;padding:1.25rem;font-size:11.5px;color:var(--txt3);border-top:1px solid var(--border);margin-top:.5rem}

@media(max-width:1100px){.kpi-grid{grid-template-columns:repeat(3,1fr)}.store-grid,.g4,.diag-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:860px){.wrap{grid-template-columns:1fr}.sidebar{display:none}.g2,.g3{grid-template-columns:1fr}.kpi-grid{grid-template-columns:repeat(2,1fr)}.main{padding:1rem}}
</style>
</head>
<body>

<!-- TOPBAR -->
<div class="topbar">
  <div class="logo"><div class="logo-icon">🎂</div><span class="logo-name">The Cake Lab</span></div>
  <nav class="topbar-mid">
    <button class="tbn active">Tổng quan</button>
    <button class="tbn">Cửa hàng</button>
    <button class="tbn">Online</button>
    <button class="tbn">Marketing</button>
    <button class="tbn">Khách hàng</button>
  </nav>
  <div class="topbar-r">
    <div class="chip">📅 Tháng 5 · 2026</div>
    <div class="chip">📊 Cập nhật 23/05</div>
  </div>
</div>

<div class="wrap">
<!-- SIDEBAR -->
<aside class="sidebar">
  <div class="sb-lbl">Báo cáo</div>
  <button class="sb-item active">📊 Tổng quan tháng</button>
  <button class="sb-item">📈 Theo tuần</button>
  <button class="sb-item">📅 Theo ngày</button>
  <div class="sb-lbl">Cửa hàng</div>
  <button class="sb-item">🏪 Tuệ Tĩnh</button>
  <button class="sb-item">🏪 Timescity</button>
  <button class="sb-item">🏪 Phan Bội Châu</button>
  <button class="sb-item">🏪 Trung Hòa</button>
  <button class="sb-item">🌐 Online</button>
  <div class="sb-lbl">Chức năng</div>
  <button class="sb-item">📣 Marketing</button>
  <button class="sb-item">👥 Khách hàng</button>
  <button class="sb-item">🔍 Chẩn đoán<span class="sb-badge">4</span></button>
</aside>

<!-- MAIN -->
<main class="main">
  <div class="ph">
    <div>
      <div class="pt">Dashboard tháng 5 / 2026</div>
      <div class="ps">Dữ liệu cập nhật đến ngày 23/05 · 4 cửa hàng offline + 1 kênh online</div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn">⬇️ Xuất báo cáo</button>
      <button class="btn btn-p">🔄 Cập nhật</button>
    </div>
  </div>

  <!-- ===== KPI TỔNG ===== -->
  <div class="sec-hdr">Chỉ số tổng hợp tháng 5</div>
  <div class="kpi-grid">
    <div class="kpi c-caramel">
      <div class="kpi-ico">💰</div>
      <div class="kpi-lbl">Tổng doanh thu</div>
      <div class="kpi-v">990,2 tr</div>
      <div class="kpi-sub neu">Mục tiêu: ~1,6 tỷ</div>
      <div class="prog-wrap"><div class="prog-fill warn" style="width:62%"></div></div>
      <div class="kpi-sub neu" style="margin-top:3px">62% hoàn thành</div>
    </div>
    <div class="kpi c-blue">
      <div class="kpi-ico">🛍️</div>
      <div class="kpi-lbl">Tổng đơn hàng</div>
      <div class="kpi-v">2.737 đơn</div>
      <div class="kpi-sub up">Online 807 · Offline 1.930</div>
      <div class="prog-wrap"><div class="prog-fill warn" style="width:65%"></div></div>
      <div class="kpi-sub neu" style="margin-top:3px">~65% mục tiêu</div>
    </div>
    <div class="kpi c-amber">
      <div class="kpi-ico">🎂</div>
      <div class="kpi-lbl">Bánh sinh nhật (BSN)</div>
      <div class="kpi-v">485 cái</div>
      <div class="kpi-sub neu">Online 407 · Offline 78</div>
      <div class="prog-wrap"><div class="prog-fill warn" style="width:63%"></div></div>
      <div class="kpi-sub neu" style="margin-top:3px">63% mục tiêu</div>
    </div>
    <div class="kpi c-rose">
      <div class="kpi-ico">📣</div>
      <div class="kpi-lbl">Lead về từ Ads</div>
      <div class="kpi-v">94 lead</div>
      <div class="kpi-sub dn">Mục tiêu: 140 · 67%</div>
      <div class="prog-wrap"><div class="prog-fill bad" style="width:67%"></div></div>
      <div class="kpi-sub dn" style="margin-top:3px">⚠️ Dưới mục tiêu</div>
    </div>
    <div class="kpi c-sage">
      <div class="kpi-ico">💵</div>
      <div class="kpi-lbl">GTTB đơn — Online</div>
      <div class="kpi-v">446.519đ</div>
      <div class="kpi-sub up">Mục tiêu: 438.101đ · 102% ✅</div>
      <div class="prog-wrap"><div class="prog-fill good" style="width:100%"></div></div>
      <div class="kpi-sub up" style="margin-top:3px">Vượt chỉ tiêu</div>
    </div>
  </div>

  <!-- ===== TUẦN NÀY ===== -->
  <div class="sec-hdr">Kết quả tuần này (18–24/5)</div>
  <div class="g4" style="margin-bottom:10px">
    <div class="card" style="border-top:3px solid #E08040">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--txt3);margin-bottom:8px">🏪 Tuệ Tĩnh</div>
      <div style="font-size:18px;font-weight:500;margin-bottom:2px">66,4 tr</div>
      <div style="font-size:11px;color:var(--txt3)">Mục tiêu: 70,1 tr</div>
      <div class="prog-wrap" style="margin-top:6px"><div class="prog-fill warn" style="width:95%"></div></div>
      <div style="font-size:11.5px;margin-top:5px" class="up">95% · 264 đơn</div>
    </div>
    <div class="card" style="border-top:3px solid #5B8DB8">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--txt3);margin-bottom:8px">🏪 Timescity</div>
      <div style="font-size:18px;font-weight:500;margin-bottom:2px">58,4 tr</div>
      <div style="font-size:11px;color:var(--txt3)">Mục tiêu: 73,6 tr</div>
      <div class="prog-wrap" style="margin-top:6px"><div class="prog-fill bad" style="width:79%"></div></div>
      <div style="font-size:11.5px;margin-top:5px" class="dn">79% · 301 đơn ⚠️</div>
    </div>
    <div class="card" style="border-top:3px solid #7A9E7E">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--txt3);margin-bottom:8px">🏪 Phan Bội Châu</div>
      <div style="font-size:18px;font-weight:500;margin-bottom:2px">5,3 tr</div>
      <div style="font-size:11px;color:var(--txt3)">Mục tiêu: 5,3 tr</div>
      <div class="prog-wrap" style="margin-top:6px"><div class="prog-fill good" style="width:100%"></div></div>
      <div style="font-size:11.5px;margin-top:5px" class="up">100% · 27 đơn ✅</div>
    </div>
    <div class="card" style="border-top:3px solid #D4A060">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--txt3);margin-bottom:8px">🏪 Trung Hòa</div>
      <div style="font-size:18px;font-weight:500;margin-bottom:2px">9,4 tr</div>
      <div style="font-size:11px;color:var(--txt3)">Mục tiêu: 9,8 tr</div>
      <div class="prog-wrap" style="margin-top:6px"><div class="prog-fill warn" style="width:96%"></div></div>
      <div style="font-size:11.5px;margin-top:5px" class="up">96% · 48 đơn</div>
    </div>
  </div>

  <!-- ===== ONLINE + MARKETING ===== -->
  <div class="g2">
    <!-- Online -->
    <div class="card">
      <div class="ch">
        <div class="ct">🌐 Online — tuần 18–24/5</div>
        <span class="badge b-amber">47% mục tiêu</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
        <div style="background:var(--cream);border-radius:8px;padding:10px 12px;text-align:center">
          <div style="font-size:10px;color:var(--txt3);margin-bottom:4px">Doanh thu</div>
          <div style="font-size:17px;font-weight:500;color:var(--caramel)">71,8 tr</div>
        </div>
        <div style="background:var(--cream);border-radius:8px;padding:10px 12px;text-align:center">
          <div style="font-size:10px;color:var(--txt3);margin-bottom:4px">Số đơn</div>
          <div style="font-size:17px;font-weight:500">154</div>
        </div>
        <div style="background:var(--cream);border-radius:8px;padding:10px 12px;text-align:center">
          <div style="font-size:10px;color:var(--txt3);margin-bottom:4px">GTTB đơn</div>
          <div style="font-size:17px;font-weight:500;color:var(--sage)">466k</div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--txt3);margin-bottom:6px">Doanh thu ngày 22/5</div>
      <div style="background:var(--caramel-l);border-radius:8px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:10.5px;color:var(--txt3)">Thực tế</div>
          <div style="font-size:18px;font-weight:500;color:var(--caramel)">15,3 tr</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10.5px;color:var(--txt3)">Mục tiêu</div>
          <div style="font-size:16px;color:var(--txt2)">22,0 tr</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10.5px;color:var(--txt3)">% HT</div>
          <div class="badge b-amber">69%</div>
        </div>
      </div>
      <div style="margin-top:10px">
        <div style="font-size:11px;color:var(--txt3);margin-bottom:5px">Phân bổ online theo cửa hàng</div>
        <div class="ch-row"><div class="ch-dot" style="background:var(--caramel)"></div><div class="ch-nm">Online Tuệ Tĩnh</div><div class="ch-bar"><div class="ch-bf" style="width:49%;background:var(--caramel)"></div></div><div class="ch-pct">49%</div></div>
        <div class="ch-row"><div class="ch-dot" style="background:var(--blue)"></div><div class="ch-nm">Online Timescity</div><div class="ch-bar"><div class="ch-bf" style="width:34%;background:var(--blue)"></div></div><div class="ch-pct">34%</div></div>
        <div class="ch-row"><div class="ch-dot" style="background:var(--sage)"></div><div class="ch-nm">Online khác</div><div class="ch-bar"><div class="ch-bf" style="width:17%;background:var(--sage)"></div></div><div class="ch-pct">17%</div></div>
      </div>
    </div>

    <!-- Marketing -->
    <div class="card">
      <div class="ch">
        <div class="ct">📣 Marketing — ngày 22/5</div>
      </div>
      <div class="mkt-row">
        <div class="mkt-label">Lead từ Ads</div>
        <div class="mkt-nums">
          <span class="mkt-real">94</span>
          <span class="mkt-target">/ 140 mục tiêu</span>
          <span class="badge b-amber">67%</span>
        </div>
      </div>
      <div class="mkt-row">
        <div class="mkt-label">Lead tự nhiên</div>
        <div class="mkt-nums">
          <span class="mkt-real">35</span>
          <span class="mkt-target">/ 62 mục tiêu</span>
          <span class="badge b-red">56%</span>
        </div>
      </div>
      <div class="mkt-row">
        <div class="mkt-label">Khách offline Tuệ Tĩnh</div>
        <div class="mkt-nums">
          <span class="mkt-real">40</span>
          <span class="mkt-target">/ 37 mục tiêu</span>
          <span class="badge b-green">108% ✅</span>
        </div>
      </div>
      <div class="mkt-row">
        <div class="mkt-label">Khách offline Timescity</div>
        <div class="mkt-nums">
          <span class="mkt-real">33</span>
          <span class="mkt-target">/ 50 mục tiêu</span>
          <span class="badge b-red">66%</span>
        </div>
      </div>
      <div class="mkt-row">
        <div class="mkt-label">Khách offline PBC</div>
        <div class="mkt-nums">
          <span class="mkt-real">12</span>
          <span class="mkt-target">/ 27 mục tiêu</span>
          <span class="badge b-red">44%</span>
        </div>
      </div>
      <div class="mkt-row">
        <div class="mkt-label">Khách offline Trung Hòa</div>
        <div class="mkt-nums">
          <span class="mkt-real">57</span>
          <span class="mkt-target">/ 45 mục tiêu</span>
          <span class="badge b-green">127% ✅</span>
        </div>
      </div>
      <div style="margin-top:12px;background:var(--rose-l);border-radius:8px;padding:9px 12px;font-size:12px;color:#8B4040">
        ⚠️ Lead online đang thấp hơn mục tiêu — cần review ads targeting & nội dung
      </div>
    </div>
  </div>

  <!-- ===== CHẨN ĐOÁN VẤN ĐỀ ===== -->
  <div class="sec-hdr">Công cụ chẩn đoán vấn đề nhanh</div>
  <div class="diag-grid">
    <div class="diag demand">
      <div class="diag-icon">🔴</div>
      <div class="diag-title">DEMAND — Lượng khách</div>
      <div class="diag-status"><span class="badge b-red">Cần chú ý</span></div>
      <div class="diag-detail">Lead/ngày: <strong>94</strong> vs target 140 (67%)<br>Timescity khách: 33/50 (66%)<br>PBC khách: 12/27 (44%)<br><br>→ Tăng budget ads; review nội dung targeting</div>
    </div>
    <div class="diag supply">
      <div class="diag-icon">🟡</div>
      <div class="diag-title">SUPPLY — Nguồn hàng</div>
      <div class="diag-status"><span class="badge b-green">Ổn định</span></div>
      <div class="diag-detail">Hàng đủ phục vụ<br>Tuệ Tĩnh: đủ hàng<br>Timescity: đủ hàng<br><br>→ Không có vấn đề cần xử lý</div>
    </div>
    <div class="diag conv">
      <div class="diag-icon">🟠</div>
      <div class="diag-title">CONVERSION — Chốt đơn</div>
      <div class="diag-status"><span class="badge b-green">Tốt</span></div>
      <div class="diag-detail">GTTB đơn online: <strong>446k</strong><br>Vượt mục tiêu 102% ✅<br>GTTB đơn Tuệ Tĩnh tốt<br><br>→ Team tư vấn đang làm tốt</div>
    </div>
    <div class="diag exec">
      <div class="diag-icon">🔵</div>
      <div class="diag-title">EXECUTION — Vận hành</div>
      <div class="diag-status"><span class="badge b-amber">Theo dõi</span></div>
      <div class="diag-detail">Timescity DT: 79% mục tiêu<br>Online tổng: 47% mục tiêu<br>Tuần 23/5 T7 chưa có data<br><br>→ Kiểm tra quy trình vận hành online</div>
    </div>
  </div>

  <!-- ===== BẢNG CHI TIẾT THEO NGÀY ===== -->
  <div class="sec-hdr">Chi tiết doanh thu — Tuệ Tĩnh (các ngày gần nhất)</div>
  <div class="card" style="margin-bottom:10px">
    <div class="ch">
      <div class="ct">🏪 Tuệ Tĩnh — Doanh thu theo ngày (tr.đ)</div>
      <button class="ca">Xem tất cả →</button>
    </div>
    <div style="overflow-x:auto">
      <table class="tbl">
        <thead><tr><th>Ngày</th><th>Thứ</th><th>Doanh thu TT</th><th>Chỉ tiêu</th><th>% HT</th><th>Số đơn TT</th><th>Đánh giá</th></tr></thead>
        <tbody>
          <tr><td class="bold">18/5</td><td>T2</td><td class="money">10.207.000đ</td><td>10.244.000đ</td><td><span class="badge b-green">100%</span></td><td>~33</td><td class="up">✅ Đạt</td></tr>
          <tr><td class="bold">19/5</td><td>T3</td><td class="money">13.932.500đ</td><td>10.448.000đ</td><td><span class="badge b-green">133%</span></td><td>~45</td><td class="up">🚀 Vượt</td></tr>
          <tr><td class="bold">20/5</td><td>T4</td><td class="money">9.560.100đ</td><td>11.060.000đ</td><td><span class="badge b-amber">86%</span></td><td>~31</td><td class="neu">⚠️ Gần đạt</td></tr>
          <tr><td class="bold">21/5</td><td>T5</td><td class="money">6.130.400đ</td><td>9.052.000đ</td><td><span class="badge b-red">68%</span></td><td>~20</td><td class="dn">❌ Thấp</td></tr>
          <tr><td class="bold">22/5</td><td>T6</td><td class="money">11.305.200đ</td><td>9.256.000đ</td><td><span class="badge b-green">122%</span></td><td>~37</td><td class="up">🚀 Vượt</td></tr>
          <tr style="background:#FDFAF6"><td class="bold">23/5</td><td>T7</td><td class="money">12.281.000đ</td><td>10.040.000đ</td><td><span class="badge b-green">122%</span></td><td>~40</td><td class="up">🚀 Vượt</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ===== SO SÁNH 4 CỬA HÀNG THÁNG ===== -->
  <div class="sec-hdr">So sánh cửa hàng — tháng 5 / 2026</div>
  <div class="card" style="margin-bottom:10px">
    <div class="ch"><div class="ct">📊 Doanh thu offline — Thực tế vs Chỉ tiêu (tháng)</div></div>
    <div style="overflow-x:auto">
      <table class="tbl">
        <thead><tr><th>Cửa hàng</th><th>Doanh thu TT</th><th>Chỉ tiêu</th><th>% HT</th><th>Số đơn</th><th>GTTB đơn</th><th>Trạng thái</th></tr></thead>
        <tbody>
          <tr>
            <td class="bold">🏪 Tuệ Tĩnh</td>
            <td class="money">217,2 tr</td><td>310 tr</td>
            <td><span class="badge b-amber">70%</span></td>
            <td>855 đơn</td><td>~254k</td>
            <td class="neu">📈 Đang cải thiện</td>
          </tr>
          <tr>
            <td class="bold">🏪 Timescity</td>
            <td class="money">216,6 tr</td><td>322 tr</td>
            <td><span class="badge b-red">67%</span></td>
            <td>1.075 đơn</td><td>~201k</td>
            <td class="dn">⚠️ Cần theo dõi</td>
          </tr>
          <tr>
            <td class="bold">🏪 Phan Bội Châu</td>
            <td class="money">~26,4 tr</td><td>~26,5 tr</td>
            <td><span class="badge b-green">100%</span></td>
            <td>135 đơn</td><td>196k</td>
            <td class="up">✅ Đạt mục tiêu</td>
          </tr>
          <tr>
            <td class="bold">🏪 Trung Hòa</td>
            <td class="money">~47 tr</td><td>~49 tr</td>
            <td><span class="badge b-amber">96%</span></td>
            <td>240 đơn</td><td>197k</td>
            <td class="up">👍 Gần đạt</td>
          </tr>
          <tr style="background:var(--caramel-l)">
            <td class="bold">🌐 Online tổng</td>
            <td class="money">360,3 tr</td><td>683 tr</td>
            <td><span class="badge b-red">53%</span></td>
            <td>807 đơn</td><td>447k</td>
            <td class="dn">⚠️ Cần đẩy mạnh</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <footer>© 2026 The Cake Lab · Dashboard nội bộ · Dữ liệu từ Google Sheets · Tháng 5/2026</footer>
</main>
</div>

</body>
</html>
