// ============================================================
// THE CAKE LAB - Fabi Import Script v3 (FIXED)
// Upload 1 file "Tất cả cửa hàng" → tự động tách và ghi vào:
//   - 4 sheet báo cáo CH (Offline): Tuệ Tĩnh T9, Timescity T9, PBC T9, Trung Hòa T9
//   - sheet Online T9 (Online, có breakdown theo từng CH)
//
// FIX so với bản gốc:
//   1. Trừ phí vận chuyển (mã hàng 20102003) khỏi MỌI doanh thu/số đơn,
//      khớp đúng với readFabiKPI() bên Mã.gs (dashboard live).
//   2. Sửa lỗi so khớp nhóm "Đồ ăn đồ uống TM" — dữ liệu Fabi thực tế
//      ghi CÓ dấu phẩy ("ĐỒ ĂN, ĐỒ UỐNG TM"), bản cũ so khớp KHÔNG dấu
//      phẩy nên không bao giờ match → Trung Thu luôn ra 0.
// ============================================================

// Sheet chứa raw data từ Fabi (1 file duy nhất)
var FABI_SHEET = 'Fabi_TatCaCuaHang';
var ONLINE_REPORT_SHEET = 'Online T9';

// Mã hàng của dòng phí vận chuyển — loại khỏi mọi doanh thu/số đơn
var MA_PHI_SHIP = '20102003';

// Tên nhóm mặt hàng Trung Thu — PHẢI khớp đúng ký tự với cột "Nhóm món"
// trong Fabi_TatCaCuaHang (có dấu phẩy: "ĐỒ ĂN, ĐỒ UỐNG TM")
var NHOM_TRUNG_THU = 'ĐỒ ĂN, ĐỒ UỐNG TM';

// Parse tiền từ string (có thể có dấu chấm/phẩy ngàn)
function parseMoney(val) {
  if (!val && val !== 0) return 0;
  // Fabi export dùng US format: "259,817,400.00" → chỉ bỏ dấu , (phân nghìn)
  var s = String(val).trim().replace(/,/g, '');
  return parseFloat(s) || 0;
}

function applyChietKhau_(thanhTien, ckRaw) {
  if (!ckRaw || ckRaw <= 0) return thanhTien;
  var ck = ckRaw <= 100 ? Math.round(thanhTien * ckRaw / 100) : ckRaw;
  return thanhTien - ck;
}

var CH_CONFIG = [
  { chName: 'CS1 45 Tuệ Tĩnh',        reportSheet: 'Tuệ Tĩnh T9'  },
  { chName: 'CS2 Park 7 TimesCity',    reportSheet: 'Timescity T9' },
  { chName: 'CS3 3a Phan Bội Châu',    reportSheet: 'PBC T9'       },
  { chName: 'CS4 26 Trung Hòa',        reportSheet: 'Trung Hòa T9' },
];

// Map tên CH (đúng giá trị trong cột "Cửa hàng" của Fabi) → key dùng chung
var CH_NAME_KEY = {
  'CS1 45 Tuệ Tĩnh':       'tueTinh',
  'CS2 Park 7 TimesCity':  'timesCity',
  'CS3 3a Phan Bội Châu':  'pbc',
  'CS4 26 Trung Hòa':      'trungHoa',
};

// Row index trong sheet báo cáo CH (1-based)
// T9: thêm 4 dòng Seasonal (17-20) → tất cả dòng từ 17 trở xuống dịch +4
var ROWS = {
  dtOffline:     6,
  soDon:         7,
  gttbDon:       8,
  dtBSN:         10,
  soBSN:         11,
  gttbBSN:       12,
  dtDaily:       14,
  soDonDaily:    15,
  gttbDaily:     16,
  // Seasonal / Trung Thu (dòng 17 = header, 18-20 = data)
  dtTrungThu:    18,
  soDonTrungThu: 19,
  gttbTrungThu:  20,
  // Top bán chạy — dịch +4 so với T8 (19→23, 23→27, 27→31)
  bsnItem1:      23,
  bsnItem2:      24,
  bsnItem3:      25,
  kemNhoItem1:   27,
  kemNhoItem2:   28,
  kemNhoItem3:   29,
  banhMiItem1:   31,
  banhMiItem2:   32,
  banhMiItem3:   33,
  // Top hủy — dịch +4 (36→40)
  huyItem1:      40,
  huyItem2:      41,
  huyItem3:      42,
  huyItem4:      43,
  huyItem5:      44,
};

// Row index trong sheet Online T9 (1-based) — cùng template với sheet CH,
// có thêm breakdown DT/Đơn theo từng cửa hàng (đúng layout readOnline() đọc)
var ROWS_ONLINE = {
  dtOnline:     6,
  soDon:        7,
  gttbDon:      8,
  dtBSN:        10,
  soBSN:        11,
  gttbBSN:      12,
  dtDaily:      14,
  soDonDaily:   15,
  gttbDaily:    16,
  dtTueTinh:    18,
  donTueTinh:   19,
  dtTimesCity:  23,
  donTimesCity: 24,
  dtPBC:        28,
  donPBC:       29,
  dtTrungHoa:   33,
  donTrungHoa:  34,
  // Seasonal / Trung Thu — 3 dòng user vừa thêm sau khối "Online Trung Hòa"
  dtTrungThu:    38,
  soDonTrungThu: 39,
  gttbTrungThu:  40,
};

// Cột ngày: 1/9 = cột H(8), mỗi ngày 3 cột — dùng chung cho sheet CH và Online
function getColForDay(day) {
  return 8 + (day - 1) * 3;
}

// ============================================================
// HELPER: đọc + validate sheet Fabi, trả về {data, headerRowIdx, colMap}
// ============================================================
function loadFabiData_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var fabiSh = ss.getSheetByName(FABI_SHEET);
  if (!fabiSh) {
    throw new Error('Không tìm thấy sheet "' + FABI_SHEET + '"!\nVui lòng tạo sheet này và paste data Fabi vào.');
  }

  // Đọc display values để tránh lỗi parse ngày
  var data = fabiSh.getDataRange().getDisplayValues();
  if (data.length < 3) {
    throw new Error('Sheet ' + FABI_SHEET + ' chưa có data!');
  }

  // Tự động tìm header row (dòng có cột "Cửa hàng")
  var headerRowIdx = -1;
  for (var i = 0; i < Math.min(5, data.length); i++) {
    if (String(data[i][0]).trim() === 'Cửa hàng') {
      headerRowIdx = i;
      break;
    }
  }
  if (headerRowIdx === -1) {
    throw new Error('Không tìm thấy dòng header (dòng có "Cửa hàng") trong sheet ' + FABI_SHEET);
  }

  var headers = data[headerRowIdx];
  var colMap = {};
  headers.forEach(function(h, i) { colMap[String(h).trim()] = i; });

  var required = ['Nguồn','Thời gian','Nhóm món','Tên hàng','Số lượng','Tổng tiền','Mã hoá đơn','Cửa hàng','Thành tiền','Chiết khấu','Mã hàng'];
  var missing = required.filter(function(c){ return colMap[c] === undefined; });
  if (missing.length > 0) {
    throw new Error('Thiếu cột: ' + missing.join(', '));
  }

  // Lấy cột "Tổng tiền" cuối cùng (tránh nhầm với "Tổng tiền (không bao gồm VAT)")
  var ttCols = [];
  headers.forEach(function(h,i){ if (String(h).trim()==='Tổng tiền') ttCols.push(i); });
  if (ttCols.length > 0) colMap['Tổng tiền'] = ttCols[ttCols.length-1];

  return { data: data, headerRowIdx: headerRowIdx, colMap: colMap };
}

// ============================================================
// HÀM CHÍNH 1: IMPORT OFFLINE → 4 sheet CH
// ============================================================
function importAllCH() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var loaded;
  try {
    loaded = loadFabiData_();
  } catch (e) {
    SpreadsheetApp.getUi().alert(e.message);
    return;
  }

  var data = loaded.data;
  var headerRowIdx = loaded.headerRowIdx;
  var colMap = loaded.colMap;

  var cols = {
    iNguon:     colMap['Nguồn'],
    iThoiGian:  colMap['Thời gian'],
    iNhomMon:   colMap['Nhóm món'],
    iTenHang:   colMap['Tên hàng'],
    iSoLuong:   colMap['Số lượng'],
    iTongTien:  colMap['Tổng tiền'],
    iThanhTien: colMap['Thành tiền'],
    iGiamGia:   colMap['Giảm giá'],
    iChietKhau: colMap['Chiết khấu'],
    iMaHD:      colMap['Mã hoá đơn'],
    iCuaHang:   colMap['Cửa hàng'],
    iMaHang:    colMap['Mã hàng'], // FIX: cần để loại trừ phí ship
  };

  Logger.log('iTongTien='+cols.iTongTien+' iThanhTien='+cols.iThanhTien+' iChietKhau='+cols.iChietKhau+' iMaHang='+cols.iMaHang);

  // Lọc chỉ lấy Offline, bỏ dòng "Tổng", bỏ dòng phí vận chuyển
  var allRows = data.slice(headerRowIdx + 1).filter(function(r) {
    var nguon = String(r[cols.iNguon] || '').trim();
    var ch = String(r[cols.iCuaHang] || '').trim();
    var maHang = String(r[cols.iMaHang] || '').trim();
    return nguon === 'OffLine' && ch !== 'Tổng' && ch !== '' && maHang !== MA_PHI_SHIP;
  });

  Logger.log('Tổng dòng Offline (đã loại phí ship): ' + allRows.length);

  var results = [];
  CH_CONFIG.forEach(function(ch) {
    try {
      var chRows = allRows.filter(function(r) {
        return String(r[cols.iCuaHang]).trim() === ch.chName;
      });
      if (chRows.length === 0) {
        results.push(ch.reportSheet + ': Không có data Offline');
        return;
      }

      var reportSh = ss.getSheetByName(ch.reportSheet);
      if (!reportSh) {
        results.push(ch.reportSheet + ': Không tìm thấy sheet báo cáo');
        return;
      }

      var daysUpdated = processChData(chRows, reportSh, ch, cols);
      results.push(ch.reportSheet + ': OK · ' + daysUpdated + ' ngày');
    } catch(e) {
      results.push(ch.reportSheet + ': LỖI - ' + e.message);
    }
  });

  SpreadsheetApp.getUi().alert('Kết quả import Offline:\n' + results.join('\n'));
}

// Xử lý data Offline cho 1 CH
function processChData(rows, reportSh, ch, cols) {
  // Nhóm theo ngày
  var byDay = {};
  rows.forEach(function(r) {
    var tg = String(r[cols.iThoiGian]).trim();
    var day = 0;
    var parts = tg.split('/'); // "11/09/2026" hoặc "11/09/2026 07:20"
    if (parts.length >= 1) day = parseInt(parts[0]);
    if (!day) return;
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(r);
  });

  var daysUpdated = 0;
  var targetDay = parseInt(PropertiesService.getScriptProperties().getProperty('TARGET_DAY') || '0') || 0;

  Object.keys(byDay).forEach(function(dayKey) {
    var day = parseInt(dayKey);
    if (targetDay && day !== targetDay) return;
    var dayRows = byDay[dayKey];
    var col = getColForDay(day);

    // Nhóm theo Mã hoá đơn → mỗi key = 1 đơn hàng
    var bills = {};
    dayRows.forEach(function(r) {
      var maHD = String(r[cols.iMaHD]).trim();
      if (!bills[maHD]) bills[maHD] = [];
      bills[maHD].push(r);
    });

    var totalDon = 0, dtTong = 0;
    var soBSN = 0, dtBSN = 0;
    var dtDaily = 0, dtTrungThu = 0;
    var donTrungThuHasTM = {}, donTrungThuHasNonTM = {};

    Object.keys(bills).forEach(function(maHD) {
      var billRows = bills[maHD];

      var hasBSN = billRows.some(function(r) {
        return String(r[cols.iNhomMon]).trim() === 'BÁNH KEM SINH NHẬT';
      });

      // DT = tổng Tổng tiền (cột cuối Fabi, đã bao gồm mọi giảm giá/chiết khấu,
      // KHÔNG bao gồm phí ship — đã lọc bỏ ở allRows)
      var tongThanhTien = 0;
      var thanhTienBSN  = 0;
      var thanhTienTM   = 0;
      billRows.forEach(function(r) {
        var tt    = parseMoney(r[cols.iTongTien]);
        var nhom  = String(r[cols.iNhomMon]).trim();
        // FIX: nhóm Trung Thu ghi CÓ dấu phẩy trong data thật ("ĐỒ ĂN, ĐỒ UỐNG TM")
        var isTM  = nhom === NHOM_TRUNG_THU;
        tongThanhTien += tt;
        if (nhom === 'BÁNH KEM SINH NHẬT') {
          thanhTienBSN += tt;
        }
        if (isTM) {
          thanhTienTM += tt;
          donTrungThuHasTM[maHD] = true;
        } else {
          donTrungThuHasNonTM[maHD] = true;
        }
      });
      var tongTienDon = tongThanhTien;
      var dtBSNDon    = thanhTienBSN;
      var dtDailyDon  = tongTienDon - dtBSNDon - thanhTienTM;
      dtTrungThu += thanhTienTM;

      totalDon++;
      dtTong += tongTienDon;

      if (hasBSN) {
        soBSN++;
        dtBSN += dtBSNDon;
      }

      dtDaily += dtDailyDon;
    });

    // Số đơn Trung Thu = đơn có ít nhất 1 mặt hàng TM VÀ KHÔNG có mặt hàng nào khác (BSN/Daily)
    var soDonTrungThu = 0;
    for (var hd in donTrungThuHasTM) {
      if (!donTrungThuHasNonTM[hd]) soDonTrungThu++;
    }
    var donDaily = totalDon - soBSN - soDonTrungThu;

    var gttbDon      = totalDon     > 0 ? Math.round(dtTong    / totalDon)     : 0;
    var gttbBSN      = soBSN        > 0 ? Math.round(dtBSN     / soBSN)        : 0;
    var gttbDaily    = donDaily     > 0 ? Math.round(dtDaily   / donDaily)     : 0;
    var gttbTrungThu = soDonTrungThu > 0 ? Math.round(dtTrungThu / soDonTrungThu) : 0;

    function setVal(rowNum, val) {
      reportSh.getRange(rowNum, col).setValue(val);
    }
    setVal(ROWS.dtOffline,     dtTong);
    setVal(ROWS.soDon,         totalDon);
    setVal(ROWS.gttbDon,       gttbDon);
    setVal(ROWS.dtBSN,         dtBSN);
    setVal(ROWS.soBSN,         soBSN);
    setVal(ROWS.gttbBSN,       gttbBSN);
    setVal(ROWS.dtDaily,       dtDaily);
    setVal(ROWS.soDonDaily,    donDaily);
    setVal(ROWS.gttbDaily,     gttbDaily);
    setVal(ROWS.dtTrungThu,    dtTrungThu);
    setVal(ROWS.soDonTrungThu, soDonTrungThu);
    setVal(ROWS.gttbTrungThu,  gttbTrungThu);

    // Top 3 bán chạy theo nhóm
    function getTop3(nhom) {
      var map = {};
      dayRows.forEach(function(r) {
        if (String(r[cols.iNhomMon]).trim() === nhom) {
          var ten = String(r[cols.iTenHang]).trim();
          var sl  = Number(r[cols.iSoLuong]) || 0;
          map[ten] = (map[ten] || 0) + sl;
        }
      });
      return Object.keys(map)
        .map(function(t){ return {ten:t, sl:map[t]}; })
        .sort(function(a,b){ return b.sl - a.sl; })
        .slice(0, 3);
    }

    var topBSN    = getTop3('BÁNH KEM SINH NHẬT');
    var topKemNho = getTop3('BÁNH KEM NHỎ');
    var topBanhMi = getTop3('BÁNH MÌ');

    function writeTop(startRow, items) {
      for (var i = 0; i < 3; i++) {
        var r = startRow + i;
        reportSh.getRange(r, col).setValue(items[i] ? items[i].ten : '');
        reportSh.getRange(r, col + 2).setValue(items[i] ? items[i].sl : '');
      }
    }
    writeTop(ROWS.bsnItem1,    topBSN);
    writeTop(ROWS.kemNhoItem1, topKemNho);
    writeTop(ROWS.banhMiItem1, topBanhMi);

    daysUpdated++;
  });

  updateMonthlyTotal(reportSh);

  return daysUpdated;
}

// Tính lại tổng tháng (cột B) cho sheet CH
function updateMonthlyTotal(reportSh) {
  var sumRows = [
    ROWS.dtOffline, ROWS.soDon, ROWS.dtBSN, ROWS.soBSN,
    ROWS.dtDaily, ROWS.soDonDaily,
    ROWS.dtTrungThu, ROWS.soDonTrungThu,
  ];
  sumRows.forEach(function(rowNum) {
    var total = 0;
    for (var d = 1; d <= 30; d++) {
      var val = Number(reportSh.getRange(rowNum, getColForDay(d)).getValue()) || 0;
      total += val;
    }
    reportSh.getRange(rowNum, 2).setValue(total);
  });

  var dtT    = Number(reportSh.getRange(ROWS.dtOffline, 2).getValue()) || 0;
  var donT   = Number(reportSh.getRange(ROWS.soDon, 2).getValue()) || 0;
  var dtBSNT = Number(reportSh.getRange(ROWS.dtBSN, 2).getValue()) || 0;
  var bsnT   = Number(reportSh.getRange(ROWS.soBSN, 2).getValue()) || 0;
  var dtDT   = Number(reportSh.getRange(ROWS.dtDaily, 2).getValue()) || 0;
  var donDT  = Number(reportSh.getRange(ROWS.soDonDaily, 2).getValue()) || 0;
  var dtTT   = Number(reportSh.getRange(ROWS.dtTrungThu, 2).getValue()) || 0;
  var donTT  = Number(reportSh.getRange(ROWS.soDonTrungThu, 2).getValue()) || 0;

  reportSh.getRange(ROWS.gttbDon,      2).setValue(donT  > 0 ? Math.round(dtT    / donT)  : 0);
  reportSh.getRange(ROWS.gttbBSN,      2).setValue(bsnT  > 0 ? Math.round(dtBSNT / bsnT)  : 0);
  reportSh.getRange(ROWS.gttbDaily,    2).setValue(donDT > 0 ? Math.round(dtDT   / donDT) : 0);
  reportSh.getRange(ROWS.gttbTrungThu, 2).setValue(donTT > 0 ? Math.round(dtTT   / donTT) : 0);
}

// ============================================================
// HÀM CHÍNH 2: IMPORT ONLINE → sheet Online T9
// ============================================================
function importOnlineFromFabi() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var loaded;
  try {
    loaded = loadFabiData_();
  } catch (e) {
    SpreadsheetApp.getUi().alert(e.message);
    return;
  }

  var data = loaded.data;
  var headerRowIdx = loaded.headerRowIdx;
  var colMap = loaded.colMap;

  var iNguon     = colMap['Nguồn'];
  var iThoiGian  = colMap['Thời gian'];
  var iNhomMon   = colMap['Nhóm món'];
  var iThanhTien = colMap['Thành tiền'];
  var iTongTien  = colMap['Tổng tiền'];
  var iGiamGia   = colMap['Giảm giá'];
  var iChietKhau = colMap['Chiết khấu'];
  var iMaHD      = colMap['Mã hoá đơn'];
  var iCuaHang   = colMap['Cửa hàng'];
  var iMaHang    = colMap['Mã hàng']; // FIX: cần để loại trừ phí ship

  var reportSh = ss.getSheetByName(ONLINE_REPORT_SHEET);
  if (!reportSh) {
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet "' + ONLINE_REPORT_SHEET + '"!');
    return;
  }

  // Lọc các dòng Online (Nguồn khác "OffLine"), bỏ dòng "Tổng"/trống, bỏ phí ship
  var onlineRows = data.slice(headerRowIdx + 1).filter(function(r) {
    var nguon = String(r[iNguon] || '').trim();
    var ch    = String(r[iCuaHang] || '').trim();
    var maHang = String(r[iMaHang] || '').trim();
    return nguon !== '' && nguon !== 'OffLine' && ch !== 'Tổng' && ch !== '' && maHang !== MA_PHI_SHIP;
  });

  Logger.log('Tổng dòng Online (đã loại phí ship): ' + onlineRows.length);

  // Nhóm theo ngày
  var byDay = {};
  onlineRows.forEach(function(r) {
    var tg = String(r[iThoiGian]).trim();
    var day = parseInt(tg.split('/')[0]);
    if (!day) return;
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(r);
  });

  var daysUpdated = 0;
  var targetDay2 = parseInt(PropertiesService.getScriptProperties().getProperty('TARGET_DAY') || '0') || 0;

  Object.keys(byDay).forEach(function(dayKey) {
    var day = parseInt(dayKey);
    if (targetDay2 && day !== targetDay2) return;
    var dayRows = byDay[dayKey];
    var col = getColForDay(day);

    // Nhóm theo Mã hoá đơn → mỗi key = 1 đơn hàng
    var bills = {};
    dayRows.forEach(function(r) {
      var maHD = String(r[iMaHD]).trim();
      if (!maHD) return;
      if (!bills[maHD]) bills[maHD] = [];
      bills[maHD].push(r);
    });

    var totalDon = 0, dtTong = 0, soBSN = 0, dtBSN = 0, dtDaily = 0, dtTrungThu = 0;
    var donTrungThuHasTM = {}, donTrungThuHasNonTM = {};
    var perCH = {
      tueTinh:   { dt: 0, don: 0 },
      timesCity: { dt: 0, don: 0 },
      pbc:       { dt: 0, don: 0 },
      trungHoa:  { dt: 0, don: 0 },
    };

    Object.keys(bills).forEach(function(maHD) {
      var billRows = bills[maHD];
      var hasBSN = billRows.some(function(r) {
        return String(r[iNhomMon]).trim() === 'BÁNH KEM SINH NHẬT';
      });

      // FIX: trừ cả BSN lẫn Trung Thu (TM) khỏi Daily — trước đây chỉ trừ
      // BSN nên doanh thu bánh Trung Thu bị tính lẫn vào Daily.
      var tongTT = 0, bsnTT = 0, tmTT = 0;
      billRows.forEach(function(r) {
        var tt = parseMoney(r[iTongTien]);
        var nhom = String(r[iNhomMon]).trim();
        tongTT += tt;
        if (nhom === 'BÁNH KEM SINH NHẬT') bsnTT += tt;
        var isTM = nhom === NHOM_TRUNG_THU;
        if (isTM) {
          tmTT += tt;
          donTrungThuHasTM[maHD] = true;
        } else {
          donTrungThuHasNonTM[maHD] = true;
        }
      });

      totalDon++;
      dtTong += tongTT;
      if (hasBSN) { soBSN++; dtBSN += bsnTT; }
      dtTrungThu += tmTT;
      dtDaily += (tongTT - bsnTT - tmTT);

      // Breakdown theo CH (lấy CH từ dòng đầu của đơn)
      var chName = String(billRows[0][iCuaHang]).trim();
      var chKey = CH_NAME_KEY[chName];
      if (chKey) {
        perCH[chKey].dt  += tongTT;
        perCH[chKey].don += 1;
      }
    });

    // Số đơn Trung Thu = đơn có ít nhất 1 mặt hàng TM VÀ KHÔNG có mặt hàng nào khác (BSN/Daily)
    var soDonTrungThu = 0;
    for (var hd in donTrungThuHasTM) {
      if (!donTrungThuHasNonTM[hd]) soDonTrungThu++;
    }
    var donDaily     = totalDon - soBSN - soDonTrungThu;
    var gttbDon      = totalDon      > 0 ? Math.round(dtTong    / totalDon)      : 0;
    var gttbBSN      = soBSN         > 0 ? Math.round(dtBSN     / soBSN)         : 0;
    var gttbDaily    = donDaily      > 0 ? Math.round(dtDaily   / donDaily)      : 0;
    var gttbTrungThu = soDonTrungThu > 0 ? Math.round(dtTrungThu / soDonTrungThu) : 0;

    function setVal(rowNum, val) { reportSh.getRange(rowNum, col).setValue(val); }

    setVal(ROWS_ONLINE.dtOnline,  dtTong);
    setVal(ROWS_ONLINE.soDon,     totalDon);
    setVal(ROWS_ONLINE.gttbDon,   gttbDon);
    setVal(ROWS_ONLINE.dtBSN,     dtBSN);
    setVal(ROWS_ONLINE.soBSN,     soBSN);
    setVal(ROWS_ONLINE.gttbBSN,   gttbBSN);
    setVal(ROWS_ONLINE.dtDaily,   dtDaily);
    setVal(ROWS_ONLINE.soDonDaily,donDaily);
    setVal(ROWS_ONLINE.gttbDaily, gttbDaily);
    setVal(ROWS_ONLINE.dtTrungThu,    dtTrungThu);
    setVal(ROWS_ONLINE.soDonTrungThu, soDonTrungThu);
    setVal(ROWS_ONLINE.gttbTrungThu,  gttbTrungThu);

    setVal(ROWS_ONLINE.dtTueTinh,    perCH.tueTinh.dt);
    setVal(ROWS_ONLINE.donTueTinh,   perCH.tueTinh.don);
    setVal(ROWS_ONLINE.dtTimesCity,  perCH.timesCity.dt);
    setVal(ROWS_ONLINE.donTimesCity, perCH.timesCity.don);
    setVal(ROWS_ONLINE.dtPBC,        perCH.pbc.dt);
    setVal(ROWS_ONLINE.donPBC,       perCH.pbc.don);
    setVal(ROWS_ONLINE.dtTrungHoa,   perCH.trungHoa.dt);
    setVal(ROWS_ONLINE.donTrungHoa,  perCH.trungHoa.don);

    daysUpdated++;
  });

  updateOnlineMonthlyTotal(reportSh);

  SpreadsheetApp.getUi().alert('Kết quả import Online:\nOnline T9: OK · ' + daysUpdated + ' ngày');
}

// Tính lại tổng tháng (cột B) cho sheet Online T9
function updateOnlineMonthlyTotal(reportSh) {
  var sumRows = [
    ROWS_ONLINE.dtOnline, ROWS_ONLINE.soDon, ROWS_ONLINE.dtBSN, ROWS_ONLINE.soBSN,
    ROWS_ONLINE.dtDaily, ROWS_ONLINE.soDonDaily,
    ROWS_ONLINE.dtTueTinh, ROWS_ONLINE.donTueTinh,
    ROWS_ONLINE.dtTimesCity, ROWS_ONLINE.donTimesCity,
    ROWS_ONLINE.dtPBC, ROWS_ONLINE.donPBC,
    ROWS_ONLINE.dtTrungHoa, ROWS_ONLINE.donTrungHoa,
    ROWS_ONLINE.dtTrungThu, ROWS_ONLINE.soDonTrungThu,
  ];
  sumRows.forEach(function(rowNum) {
    var total = 0;
    for (var d = 1; d <= 30; d++) {
      var val = Number(reportSh.getRange(rowNum, getColForDay(d)).getValue()) || 0;
      total += val;
    }
    reportSh.getRange(rowNum, 2).setValue(total);
  });

  var dtT    = Number(reportSh.getRange(ROWS_ONLINE.dtOnline, 2).getValue()) || 0;
  var donT   = Number(reportSh.getRange(ROWS_ONLINE.soDon, 2).getValue()) || 0;
  var dtBSNT = Number(reportSh.getRange(ROWS_ONLINE.dtBSN, 2).getValue()) || 0;
  var bsnT   = Number(reportSh.getRange(ROWS_ONLINE.soBSN, 2).getValue()) || 0;
  var dtDT   = Number(reportSh.getRange(ROWS_ONLINE.dtDaily, 2).getValue()) || 0;
  var donDT  = Number(reportSh.getRange(ROWS_ONLINE.soDonDaily, 2).getValue()) || 0;
  var dtTT   = Number(reportSh.getRange(ROWS_ONLINE.dtTrungThu, 2).getValue()) || 0;
  var donTT  = Number(reportSh.getRange(ROWS_ONLINE.soDonTrungThu, 2).getValue()) || 0;

  reportSh.getRange(ROWS_ONLINE.gttbDon,      2).setValue(donT  > 0 ? Math.round(dtT    / donT)  : 0);
  reportSh.getRange(ROWS_ONLINE.gttbBSN,      2).setValue(bsnT  > 0 ? Math.round(dtBSNT / bsnT)  : 0);
  reportSh.getRange(ROWS_ONLINE.gttbDaily,    2).setValue(donDT > 0 ? Math.round(dtDT   / donDT) : 0);
  reportSh.getRange(ROWS_ONLINE.gttbTrungThu, 2).setValue(donTT > 0 ? Math.round(dtTT   / donTT) : 0);
}

// ============================================================
// IMPORT TẤT CẢ (Offline + Online) — 1 lần bấm
// ============================================================
function importAll() {
  importAllCH();
  importOnlineFromFabi();
  importFoodAppFromFabi();
}

// Hiện hộp thoại chọn ngày → chỉ import ngày đó
function importNgayChon() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.prompt(
    '📅 Chọn ngày import',
    'Nhập ngày cần điền báo cáo (1–31):',
    ui.ButtonSet.OK_CANCEL
  );
  if (resp.getSelectedButton() !== ui.Button.OK) return;

  var day = parseInt(resp.getResponseText().trim());
  if (!day || day < 1 || day > 31) {
    ui.alert('Ngày không hợp lệ. Vui lòng nhập số từ 1 đến 31.');
    return;
  }

  // Lưu ngày chọn để các hàm import đọc
  PropertiesService.getScriptProperties().setProperty('TARGET_DAY', String(day));

  try {
    importAllCH();
    importOnlineFromFabi();
    importFoodAppFromFabi();
    ui.alert('✅ Đã import xong ngày ' + day + '/9!');
  } finally {
    PropertiesService.getScriptProperties().deleteProperty('TARGET_DAY');
  }
}

// ============================================================
// MENU
// ============================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎂 TCL Import T9')
    .addItem('📥 Import tất cả T9 (Offline + Online)', 'importAll')
    .addItem('📅 Import 1 ngày cụ thể…', 'importNgayChon')
    .addSeparator()
    .addItem('Import Offline → 4 sheet CH T9', 'importAllCH')
    .addItem('Import Online → Online T9', 'importOnlineFromFabi')
    .addItem('Import Food App → Online T9 dòng 67', 'importFoodAppFromFabi')
    .addSeparator()
    .addItem('Đồng bộ Ads → Ads T9', 'syncAdsFromBaoCaoMenu_')
    .addSeparator()
    .addItem('Đặt trigger tự động (8h sáng)', 'setDailyTrigger')
    .addSeparator()
    .addItem('📅 Điền ngày T9 vào sheet hiện tại', 'fillNgayT9')
    .addSeparator()
    .addItem('📊 Tính TỔNG TUẦN Marketing T9', 'fillTongTuanT9')
    .addSeparator()
    .addItem('🔍 Debug: Log header Fabi (kiểm tra cột Loại món)', 'debugFabiHeader')
    .addToUi();
}

function fillNgayT9() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var v = sheet.getDataRange().getValues();
  // Tìm cột đầu tiên của ngày 1/9 (ô có text chứa "1/9" hoặc "1/" trong row 2)
  var headerRow = 1; // index 1 = row 2
  var startCol = -1;
  for (var c = 0; c < v[headerRow].length; c++) {
    var val = String(v[headerRow][c] || '').trim();
    if (val.indexOf('1/9') !== -1 || val.indexOf('1/8') !== -1 || val === '1') {
      startCol = c; break;
    }
  }
  if (startCol === -1) {
    SpreadsheetApp.getUi().alert('Không tìm thấy ô ngày đầu tiên. Hãy click vào ô ngày 1/9 rồi chạy lại.');
    return;
  }
  var days = ['CN','T2','T3','T4','T5','T6','T7'];
  var step = 3;
  for (var d = 1; d <= 30; d++) {
    var dt = new Date(2026, 8, d);
    var wd = days[dt.getDay()];
    sheet.getRange(headerRow + 1, startCol + 1 + (d - 1) * step).setValue(d + '/9  ' + wd);
  }
  SpreadsheetApp.getUi().alert('Đã điền xong 30 ngày T9!');
}

function setDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'importAll' || t.getHandlerFunction() === 'importAllCH') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('importAll').timeBased().everyDays(1).atHour(8).create();
  SpreadsheetApp.getUi().alert('✅ Đã đặt trigger tự động 8h sáng mỗi ngày (Offline + Online)!');
}

// ============================================================
// DEBUG
// ============================================================
function debugFabiSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var fabiSh = ss.getSheetByName(FABI_SHEET);
  if (!fabiSh) { Logger.log('Không tìm thấy sheet: ' + FABI_SHEET); return; }

  var data = fabiSh.getDataRange().getDisplayValues();
  Logger.log('Tổng dòng: ' + data.length);
  Logger.log('Row 1 (title): ' + data[0].slice(0,5));
  Logger.log('Row 2 (header): ' + data[1].slice(0,10));
  Logger.log('Row 3 (data mẫu): ' + data[2].slice(0,10));

  var hIdx = -1;
  for (var i = 0; i < 5; i++) {
    if (String(data[i][0]).trim() === 'Cửa hàng') { hIdx = i; break; }
  }
  Logger.log('Header row index: ' + hIdx);
  var headers = hIdx >= 0 ? data[hIdx] : data[1];
  var iNguon = -1, iCuaHang = -1, iMaHD = -1, iThoiGian = -1;
  headers.forEach(function(h,i) {
    var hh = String(h).trim();
    if (hh === 'Nguồn')       iNguon = i;
    if (hh === 'Cửa hàng')    iCuaHang = i;
    if (hh === 'Mã hoá đơn')  iMaHD = i;
    if (hh === 'Thời gian')   iThoiGian = i;
  });
  Logger.log('Col Nguồn='+iNguon+' Col CuaHang='+iCuaHang+' Col MaHD='+iMaHD+' Col ThoiGian='+iThoiGian);

  var nguonCount = {};
  data.slice(2).forEach(function(r) {
    var n = String(r[iNguon]).trim();
    nguonCount[n] = (nguonCount[n]||0) + 1;
  });
  Logger.log('Phân bố Nguồn: ' + JSON.stringify(nguonCount));

  var chCount = {};
  data.slice(2).forEach(function(r) {
    var c = String(r[iCuaHang]).trim();
    chCount[c] = (chCount[c]||0) + 1;
  });
  Logger.log('Phân bố CH: ' + JSON.stringify(chCount));

  Logger.log('Mẫu Thời gian: ' + data[2][iThoiGian] + ' (type: ' + typeof data[2][iThoiGian] + ')');

  var msg = 'Tổng dòng: ' + data.length + '\n';
  msg += 'Nguồn: ' + JSON.stringify(nguonCount) + '\n';
  msg += 'CH: ' + JSON.stringify(chCount) + '\n';
  msg += 'Mẫu ngày: ' + data[2][iThoiGian];
  SpreadsheetApp.getUi().alert(msg);
}

// DEBUG MỚI: kiểm tra nhanh các giá trị "Nhóm món" thực tế trong Fabi,
// để phát hiện lỗi so khớp chuỗi (dấu phẩy, khoảng trắng...) trước khi import
function debugNhomMon() {
  var loaded = loadFabiData_();
  var data = loaded.data;
  var headerRowIdx = loaded.headerRowIdx;
  var colMap = loaded.colMap;
  var iNhomMon = colMap['Nhóm món'];

  var counts = {};
  data.slice(headerRowIdx + 1).forEach(function(r) {
    var nhom = String(r[iNhomMon] || '').trim();
    if (!nhom) return;
    counts[nhom] = (counts[nhom] || 0) + 1;
  });

  var msg = 'Các giá trị "Nhóm món" tìm thấy:\n\n';
  Object.keys(counts).sort().forEach(function(k) {
    var flag = (k === NHOM_TRUNG_THU) ? '  ✅ KHỚP NHOM_TRUNG_THU' : '';
    msg += '"' + k + '" → ' + counts[k] + ' dòng' + flag + '\n';
  });
  msg += '\nNHOM_TRUNG_THU đang dùng để so khớp: "' + NHOM_TRUNG_THU + '"';
  Logger.log(msg);
  SpreadsheetApp.getUi().alert(msg);
}

function debugTueTinh11() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var fabiSh = ss.getSheetByName(FABI_SHEET);
  var data = fabiSh.getDataRange().getDisplayValues();

  var hIdx = -1;
  for (var i = 0; i < 5; i++) {
    if (String(data[i][0]).trim() === 'Cửa hàng') { hIdx = i; break; }
  }
  var headers = data[hIdx];
  var colMap = {};
  headers.forEach(function(h,i){ colMap[String(h).trim()] = i; });

  var iNguon    = colMap['Nguồn'];
  var iThoiGian = colMap['Thời gian'];
  var iNhomMon  = colMap['Nhóm món'];
  var iMaHD     = colMap['Mã hoá đơn'];
  var iCuaHang  = colMap['Cửa hàng'];
  var iThanhTien = colMap['Thành tiền'];
  var iChietKhau = colMap['Chiết khấu'];
  var iGiamGia   = colMap['Giảm giá'];
  var iTongTien  = colMap['Tổng tiền'];
  var ttCols = [];
  headers.forEach(function(h,i){ if (String(h).trim()==='Tổng tiền') ttCols.push(i); });
  if (ttCols.length > 0) iTongTien = ttCols[ttCols.length-1];
  Logger.log('Debug: iTongTien='+iTongTien+' header='+headers[iTongTien]+' iThanhTien='+iThanhTien);

  var rows = data.slice(hIdx+1).filter(function(r) {
    var nguon = String(r[iNguon]).trim();
    var ch    = String(r[iCuaHang]).trim();
    var ngay  = String(r[iThoiGian]).split('/')[0];
    return nguon === 'OffLine' && ch === 'CS1 45 Tuệ Tĩnh' && ngay === '11';
  });

  Logger.log('Dòng Offline TT ngày 11: ' + rows.length);

  var bills = {};
  rows.forEach(function(r) {
    var maHD = r[iMaHD];
    if (!bills[maHD]) bills[maHD] = [];
    bills[maHD].push(r);
  });

  var dtTong = 0, dtBSN = 0, dtDaily = 0;
  var donTong = 0, soBSN = 0, donDaily = 0;

  Object.keys(bills).forEach(function(maHD) {
    var billRows = bills[maHD];
    var hasBSN = billRows.some(function(r){ return String(r[iNhomMon]).trim() === 'BÁNH KEM SINH NHẬT'; });
    var tongTT = 0, bsnTT = 0;
    billRows.forEach(function(r){
      var tt = parseMoney(r[iTongTien]);
      tongTT += tt;
      if (String(r[iNhomMon]).trim() === 'BÁNH KEM SINH NHẬT') bsnTT += tt;
    });
    var dtDailyDon = tongTT - bsnTT;
    donTong++; dtTong += tongTT;
    if (hasBSN) { soBSN++; dtBSN += bsnTT; }
    dtDaily += dtDailyDon;
    if (dtDailyDon > 0) donDaily++;
  });

  var msg = 'Tuệ Tĩnh ngày 11 (Offline):\n';
  msg += 'Tổng đơn: ' + donTong + '\n';
  msg += 'DT Tổng: ' + dtTong.toLocaleString() + '\n';
  msg += 'Số BSN: ' + soBSN + '\n';
  msg += 'DT BSN: ' + dtBSN.toLocaleString() + '\n';
  msg += 'DT Daily: ' + dtDaily.toLocaleString() + '\n';
  msg += 'Kiểm tra: DT Tổng - DT BSN = ' + (dtTong - dtBSN).toLocaleString() + '\n';
  msg += 'Col iThanhTien=' + iThanhTien + ' iChietKhau=' + iChietKhau + '\n';
  msg += 'Mẫu dòng 1: TT=' + rows[0][iThanhTien] + ' CK=' + rows[0][iChietKhau];
  SpreadsheetApp.getUi().alert(msg);
}

function debugOnlineDay(day) {
  day = day || 17;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var reportSh = ss.getSheetByName(ONLINE_REPORT_SHEET);
  var col = getColForDay(day);
  Logger.log('Ngày ' + day + ' (cột ' + col + '):');
  Logger.log('DT Online: '   + reportSh.getRange(ROWS_ONLINE.dtOnline, col).getValue());
  Logger.log('Số đơn: '      + reportSh.getRange(ROWS_ONLINE.soDon, col).getValue());
  Logger.log('DT BSN: '      + reportSh.getRange(ROWS_ONLINE.dtBSN, col).getValue());
  Logger.log('DT Tuệ Tĩnh: ' + reportSh.getRange(ROWS_ONLINE.dtTueTinh, col).getValue());
}
// ============================================================
// THE CAKE LAB - Import "Số đơn Food App" từ Fabi vào Online T9, dòng 67
// Food App = Nguồn thuộc nhóm: GrabFood, ShopeeFood, BeFood, XANHSM
// Đếm theo SỐ ĐƠN (Mã hoá đơn duy nhất), không tính trùng dòng sản phẩm
// ============================================================

var ROW_FOODAPP = 67; // dòng ghi "Số đơn Food App" trong sheet Online T9

var FOODAPP_SOURCES = ['GRABFOOD', 'SHOPEEFOOD', 'BEFOOD', 'XANHSM'];

function isFoodAppSource(raw) {
  var n = String(raw || '').trim().toUpperCase().replace(/\s+/g, '');
  for (var i = 0; i < FOODAPP_SOURCES.length; i++) {
    if (n.indexOf(FOODAPP_SOURCES[i]) !== -1) return true;
  }
  return false;
}

function importFoodAppFromFabi() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var loaded;
  try {
    loaded = loadFabiData_(); // dùng lại helper đã có trong Fabi_import.gs
  } catch (e) {
    SpreadsheetApp.getUi().alert(e.message);
    return;
  }

  var data = loaded.data;
  var headerRowIdx = loaded.headerRowIdx;
  var colMap = loaded.colMap;

  var iNguon    = colMap['Nguồn'];
  var iThoiGian = colMap['Thời gian'];
  var iMaHD     = colMap['Mã hoá đơn'];
  var iCuaHang  = colMap['Cửa hàng'];

  var reportSh = ss.getSheetByName(ONLINE_REPORT_SHEET);
  if (!reportSh) {
    SpreadsheetApp.getUi().alert('Không tìm thấy sheet "' + ONLINE_REPORT_SHEET + '"!');
    return;
  }

  // Lọc các dòng thuộc nhóm Food App, bỏ dòng "Tổng"/trống
  var foodAppRows = data.slice(headerRowIdx + 1).filter(function(r) {
    var ch = String(r[iCuaHang] || '').trim();
    if (ch === 'Tổng' || ch === '') return false;
    return isFoodAppSource(r[iNguon]);
  });

  Logger.log('Tổng dòng Food App: ' + foodAppRows.length);

  // Nhóm theo ngày → đếm số Mã hoá đơn DUY NHẤT mỗi ngày
  var byDay = {}; // day -> Set(maHD)
  foodAppRows.forEach(function(r) {
    var tg = String(r[iThoiGian]).trim();
    var day = parseInt(tg.split('/')[0]);
    if (!day) return;

    var maHD = String(r[iMaHD] || '').trim();
    if (!maHD) return;

    if (!byDay[day]) byDay[day] = {};
    byDay[day][maHD] = true;
  });

  var daysUpdated = 0;
  Object.keys(byDay).forEach(function(dayKey) {
    var day = parseInt(dayKey);
    var col = getColForDay(day);
    var soDon = Object.keys(byDay[day]).length;
    reportSh.getRange(ROW_FOODAPP, col).setValue(soDon);
    daysUpdated++;
  });

  // Tính lại tổng tháng (cột B)
  var total = 0;
  for (var d = 1; d <= 30; d++) {
    var val = Number(reportSh.getRange(ROW_FOODAPP, getColForDay(d)).getValue()) || 0;
    total += val;
  }
  reportSh.getRange(ROW_FOODAPP, 2).setValue(total);

  SpreadsheetApp.getUi().alert('Số đơn Food App: OK · ' + daysUpdated + ' ngày đã cập nhật · Tổng tháng: ' + total);
}

// DEBUG: kiểm tra số đơn Food App ngày X + phân bố theo từng Nguồn
function debugFoodAppDay(day) {
  day = day || 17;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var loaded = loadFabiData_();
  var data = loaded.data;
  var headerRowIdx = loaded.headerRowIdx;
  var colMap = loaded.colMap;

  var iNguon    = colMap['Nguồn'];
  var iThoiGian = colMap['Thời gian'];
  var iMaHD     = colMap['Mã hoá đơn'];
  var iCuaHang  = colMap['Cửa hàng'];

  var nguonCount = {};
  var maHDSet = {};

  data.slice(headerRowIdx + 1).forEach(function(r) {
    var ch = String(r[iCuaHang] || '').trim();
    if (ch === 'Tổng' || ch === '') return;
    if (!isFoodAppSource(r[iNguon])) return;

    var tg = String(r[iThoiGian]).trim();
    var d = parseInt(tg.split('/')[0]);
    if (d !== day) return;

    var nguonRaw = String(r[iNguon] || '').trim();
    nguonCount[nguonRaw] = (nguonCount[nguonRaw] || 0) + 1;

    var maHD = String(r[iMaHD] || '').trim();
    if (maHD) maHDSet[maHD] = true;
  });

  Logger.log('=== Food App ngày ' + day + ' ===');
  Logger.log('Phân bố theo Nguồn (số dòng sản phẩm): ' + JSON.stringify(nguonCount));
  Logger.log('Số đơn duy nhất (Mã hoá đơn): ' + Object.keys(maHDSet).length);

  var reportSh = ss.getSheetByName(ONLINE_REPORT_SHEET);
  var col = getColForDay(day);
  Logger.log('Giá trị đã ghi vào Online T9 dòng ' + ROW_FOODAPP + ': ' + reportSh.getRange(ROW_FOODAPP, col).getValue());
}

// ============================================================
// THE CAKE LAB - Đồng bộ dòng "Tổng (Online - ADS Mess)" từ
// sheet "Báo cáo ADS the cakelab" → tab "Ads" trong Dashboard
//
// Script này chạy trong Apps Script project của file DASHBOARD
// (cùng project với Fabi_import.gs / Mã.gs) vì tab "Ads" đích
// nằm trong file Dashboard.
//
// Tự nhận diện cột theo NGÀY THỰC TẾ ghi trong tiêu đề (không dùng
// công thức cột cố định) — nếu chưa có cột cho ngày đó ở sheet Ads,
// script TỰ TẠO cột mới ở cuối, tránh ghi lệch ngày.
// ============================================================

var BAOCAO_ADS_SS_ID = '12iXIAtEFdcrECLvZlZcRbxxjrR1QKg7J6eXhMAe9NCo'; // ID sheet "Báo cáo ADS the cakelab"
var ADS_DEST_SHEET = 'Ads T9'; // tên tab đích trong Dashboard

// Dòng trong block "Tổng (Online - ADS Mess)" của sheet Báo cáo ADS
// (cũng là số dòng tương ứng cần ghi vào tab Ads — 2 sheet cùng layout)
var ADS_ROW_MAP = {
  doanhThu: 2,
  chiPhi:   3,
  mess:     4,
  comment:  5,
  cpMess:   6,
  soDon:    7,
  cr:       8,
  roas:     9,
};

function parseDateHeader_ads(s) {
  s = String(s || '').trim();
  var m = s.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (m) return { day: parseInt(m[1], 10), month: parseInt(m[2], 10) };
  return null;
}

function syncAdsFromBaoCao(month) {
  month = month || (new Date().getMonth() + 1); // mặc định tháng hiện tại
  var ui = SpreadsheetApp.getUi();

  var srcSS = SpreadsheetApp.openById(BAOCAO_ADS_SS_ID);
  var srcSheet = srcSS.getSheetByName('Tháng ' + month);
  if (!srcSheet) {
    ui.alert('Không tìm thấy tab "Tháng ' + month + '" trong sheet Báo cáo ADS the cakelab.');
    return;
  }

  var destSS = SpreadsheetApp.getActiveSpreadsheet();
  var destSheet = destSS.getSheetByName(ADS_DEST_SHEET);
  if (!destSheet) {
    ui.alert('Không tìm thấy tab "' + ADS_DEST_SHEET + '" trong file Dashboard.');
    return;
  }

  // Đọc toàn bộ tiêu đề ngày + dữ liệu hàng "Tổng" từ sheet nguồn
  var srcLastCol = srcSheet.getLastColumn();
  var srcHeader = srcSheet.getRange(1, 1, 1, srcLastCol).getDisplayValues()[0];

  var rowsToRead = Object.keys(ADS_ROW_MAP).map(function(k){ return ADS_ROW_MAP[k]; });
  var minRow = Math.min.apply(null, rowsToRead), maxRow = Math.max.apply(null, rowsToRead);
  var srcBlock = srcSheet.getRange(minRow, 1, maxRow - minRow + 1, srcLastCol).getValues();
  function srcVal(rowKey, col) {
    var r = ADS_ROW_MAP[rowKey] - minRow; // 0-based offset trong srcBlock
    return srcBlock[r][col - 1];
  }

  var daysUpdated = 0;
  var daysCreated = 0;

  for (var c = 1; c <= srcLastCol; c++) {
    var dateInfo = parseDateHeader_ads(srcHeader[c - 1]);
    if (!dateInfo || dateInfo.month !== month) continue;

    // Tìm cột tương ứng trong sheet đích (đọc lại header mỗi lần vì có thể vừa thêm cột)
    var destLastCol = destSheet.getLastColumn();
    var destHeader = destLastCol > 0 ? destSheet.getRange(1, 1, 1, destLastCol).getDisplayValues()[0] : [];
    var destCol = -1;
    for (var dc = 0; dc < destHeader.length; dc++) {
      var dInfo = parseDateHeader_ads(destHeader[dc]);
      if (dInfo && dInfo.day === dateInfo.day && dInfo.month === dateInfo.month) {
        destCol = dc + 1;
        break;
      }
    }

    if (destCol === -1) {
      // Chưa có cột cho ngày này → tạo cột mới ở cuối
      destCol = destLastCol + 1;
      destSheet.getRange(1, destCol).setValue(srcHeader[c - 1]); // giữ nguyên format chữ ngày như sheet nguồn
      daysCreated++;
    }

    // Ghi dữ liệu (giữ nguyên thứ tự dòng giống sheet nguồn)
    destSheet.getRange(ADS_ROW_MAP.chiPhi,  destCol).setValue(srcVal('chiPhi',  c));
    destSheet.getRange(ADS_ROW_MAP.mess,    destCol).setValue(srcVal('mess',    c));
    destSheet.getRange(ADS_ROW_MAP.comment, destCol).setValue(srcVal('comment',c));
    destSheet.getRange(ADS_ROW_MAP.soDon,   destCol).setValue(srcVal('soDon',  c));
    destSheet.getRange(ADS_ROW_MAP.roas,    destCol).setValue(srcVal('roas',   c));

    daysUpdated++;
  }

  ui.alert('Đồng bộ Ads xong: ' + daysUpdated + ' ngày đã cập nhật, trong đó ' + daysCreated + ' cột ngày mới được tự tạo.');
}

// DEBUG: kiểm tra 1 ngày cụ thể đã đồng bộ đúng chưa
function debugAdsSync(day, month) {
  day = day || 22;
  month = month || 9;
  var destSS = SpreadsheetApp.getActiveSpreadsheet();
  var destSheet = destSS.getSheetByName(ADS_DEST_SHEET);
  var destLastCol = destSheet.getLastColumn();
  var destHeader = destSheet.getRange(1, 1, 1, destLastCol).getDisplayValues()[0];

  var destCol = -1;
  for (var dc = 0; dc < destHeader.length; dc++) {
    var dInfo = parseDateHeader_ads(destHeader[dc]);
    if (dInfo && dInfo.day === day && dInfo.month === month) { destCol = dc + 1; break; }
  }

  if (destCol === -1) {
    Logger.log('Chưa có cột cho ngày ' + day + '/' + month + ' trong tab Ads.');
    return;
  }

  Logger.log('Cột tìm thấy: ' + destCol + ' (header="' + destHeader[destCol-1] + '")');
  Logger.log('Chi phí: ' + destSheet.getRange(ADS_ROW_MAP.chiPhi, destCol).getValue());
  Logger.log('Mess: '    + destSheet.getRange(ADS_ROW_MAP.mess, destCol).getValue());
  Logger.log('Comment: ' + destSheet.getRange(ADS_ROW_MAP.comment, destCol).getValue());
  Logger.log('Số đơn: '  + destSheet.getRange(ADS_ROW_MAP.soDon, destCol).getValue());
  Logger.log('ROAS: '    + destSheet.getRange(ADS_ROW_MAP.roas, destCol).getValue());
}

function syncAdsFromBaoCaoMenu_() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.prompt('Đồng bộ Ads', 'Nhập tháng cần đồng bộ (ví dụ: 9 cho Tháng 9):', ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;
  var month = parseInt(resp.getResponseText().trim());
  if (!month || month < 1 || month > 12) {
    ui.alert('Tháng không hợp lệ. Vui lòng nhập số từ 1 đến 12.');
    return;
  }
  syncAdsFromBaoCao(month);
}

// ============================================================
// TỔNG TUẦN MARKETING T9
// T9/2026: ngày 1 = Thứ Ba → 5 tuần lịch (T2→CN):
//   Tuần 1: 1/9–6/9  | Tuần 2: 7/9–13/9 | Tuần 3: 14/9–20/9
//   Tuần 4: 21/9–27/9 | Tuần 5: 28/9–30/9
// Tự động tìm cột ngày 1 từ row 2 (label '1/9')
// KHÔNG clearContent — không đụng daily data
// ============================================================
function fillTongTuanT9() {
  var ss  = SpreadsheetApp.getActiveSpreadsheet();
  var sh  = ss.getSheetByName('Marketing T9');
  if (!sh) { SpreadsheetApp.getUi().alert('Không tìm thấy sheet "Marketing T9"'); return; }

  var lastRow = sh.getLastRow();
  var lastCol = sh.getLastColumn();

  // --- Tìm cột ngày 1/9 trong row 2 ---
  var row2 = sh.getRange(2, 1, 1, lastCol).getDisplayValues()[0];
  var day1Col = -1;
  for (var c = 0; c < row2.length; c++) {
    if (String(row2[c] || '').indexOf('1/9') !== -1) { day1Col = c + 1; break; }
  }
  if (day1Col === -1) {
    SpreadsheetApp.getUi().alert('⚠️ Không tìm thấy "1/9" trong row 2.\nHãy chạy "Điền ngày T9" trước.');
    return;
  }

  var COLS_PER_DAY = 3; // mỗi ngày: Thực tế | Chỉ tiêu | % HT

  function colLetter(n) {
    var s = '';
    while (n > 0) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); }
    return s;
  }

  // Layout TỔNG TUẦN: bắt đầu D=4, mỗi nhóm 3 cột (% HT | Thực tế | Chỉ tiêu)
  //   Tuần 1 → D(4),E(5),F(6)  — thucTeCol=5
  //   Tuần 2 → G(7),H(8),I(9)  — thucTeCol=8
  //   Tuần 3 → J(10),K(11),L(12) — thucTeCol=11
  //   Tuần 4 → M(13),N(14),O(15) — thucTeCol=14
  //   Tuần 5 → P(16),Q(17),R(18) — thucTeCol=17
  var weekGroups = [
    { label: '1/9-6/9',   days: [1,2,3,4,5,6],         thucTeCol: 5  },
    { label: '7/9-13/9',  days: [7,8,9,10,11,12,13],    thucTeCol: 8  },
    { label: '14/9-20/9', days: [14,15,16,17,18,19,20], thucTeCol: 11 },
    { label: '21/9-27/9', days: [21,22,23,24,25,26,27], thucTeCol: 14 },
    { label: '28/9-30/9', days: [28,29,30],              thucTeCol: 17 },
  ];

  // --- Cập nhật nhãn TỔNG TUẦN trong row 2 ---
  for (var w = 0; w < weekGroups.length; w++) {
    sh.getRange(2, weekGroups[w].thucTeCol - 1)
      .setValue('TỔNG TUẦN (' + weekGroups[w].label + ')');
  }

  // --- Điền công thức từ row 5 trở đi ---
  var FIRST_DATA_ROW = 5;
  for (var row = FIRST_DATA_ROW; row <= lastRow; row++) {
    var ttParts = [], ctParts = [];

    for (var w = 0; w < weekGroups.length; w++) {
      var wg = weekGroups[w];
      var ttDay = [], ctDay = [];
      for (var di = 0; di < wg.days.length; di++) {
        var base = day1Col + (wg.days[di] - 1) * COLS_PER_DAY;
        ttDay.push(colLetter(base)     + row); // Thực tế ngày
        ctDay.push(colLetter(base + 1) + row); // Chỉ tiêu ngày
      }
      var ttCell = colLetter(wg.thucTeCol) + row;
      var ctCell = colLetter(wg.thucTeCol + 1) + row;

      sh.getRange(row, wg.thucTeCol)    .setFormula('=SUM(' + ttDay.join(',') + ')');
      sh.getRange(row, wg.thucTeCol + 1).setFormula('=SUM(' + ctDay.join(',') + ')');
      sh.getRange(row, wg.thucTeCol - 1).setFormula(
        '=IF(' + ctCell + '>0,' + ttCell + '/' + ctCell + ',"")'
      );
      ttParts.push(ttCell);
      ctParts.push(ctCell);
    }

    // TỔNG THÁNG: B=Thực tế, C=Chỉ tiêu, D=% HT
    var bCell = 'B' + row, cCell = 'C' + row;
    sh.getRange(row, 2).setFormula('=SUM(' + ttParts.join(',') + ')');
    sh.getRange(row, 3).setFormula('=SUM(' + ctParts.join(',') + ')');
    sh.getRange(row, 4).setFormula('=IF(' + cCell + '>0,' + bCell + '/' + cCell + ',\"\")');
  }

  SpreadsheetApp.getUi().alert(
    '✅ Đã tính xong! Ngày 1/9 tại cột ' + colLetter(day1Col) + '.\n' +
    '• Tuần 1: 1/9–6/9 → SUM(' + colLetter(day1Col) + ',' +
      colLetter(day1Col+3) + ',' + colLetter(day1Col+6) + ',...)\n' +
    '• Tuần 2: 7/9–13/9\n• Tuần 3–5: tương tự'
  );
}
