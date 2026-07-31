// THE CAKE LAB - Apps Script Dashboard T8/2026
// File đầy đủ: doGet + tất cả các hàm đọc dữ liệu (CH, Online, Ads, Marketing, Fabi)

// Chạy mỗi 4 phút qua trigger để giữ cache luôn nóng
function warmCache() {
  doGet({ parameter: {} });
}

// Chạy 1 lần để cấp quyền truy cập "Báo cáo ADS" sheet
function authorizeAdsSheet() {
  var ss = SpreadsheetApp.openById(BAO_CAO_ADS_ID);
  var sh = ss ? ss.getSheetByName(BAO_CAO_ADS_TAB) : null;
  Logger.log(sh ? 'OK: ' + sh.getLastRow() + ' rows' : 'Sheet not found');
}

function doGet(e) {
  try {
    var bust = e && e.parameter && e.parameter.bust;

    var cache = CacheService.getScriptCache();
    var cacheKey = 'dashboard_t8';
    if (!bust) {
      var cached = cache.get(cacheKey);
      if (cached) {
        return ContentService.createTextOutput(cached)
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Đọc Fabi_TatCaCuaHang 1 lần duy nhất, chia sẻ cho 4 hàm Fabi để tránh đọc 4 lần
    var fabiSh = ss.getSheetByName('Fabi_TatCaCuaHang');
    var fabiRows = fabiSh ? fabiSh.getDataRange().getDisplayValues() : null;
    var result = {
      tueTinh:   readCH(ss, 'Tuệ Tĩnh T8'),
      timesCity: readCH(ss, 'Timescity T8'),
      pbc:       readCH(ss, 'PBC T8'),
      trungHoa:  readCH(ss, 'Trung Hòa T8'),
      online:    readOnline(ss, 'Online T8'),
      marketing: readMarketing(ss, 'Marketing T8'),
      ads:       readAds(ss, 'Ads T8'),
      fabiTop:   readFabiTopProducts(ss, fabiRows),
      fabiKPI:   readFabiKPI(ss, fabiRows),
      fabiKH:    readFabiKHClassification(ss, fabiRows),
      fabiItems: readFabiItemsDistribution(ss, fabiRows),
    };
    var json = JSON.stringify(result);

    try { cache.put(cacheKey, json, 600); } catch(e) {}

    var cb = e && e.parameter && e.parameter.callback;
    if (cb) {
      return ContentService.createTextOutput(cb + '(' + json + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// =============================================================
// SHEET ONLINE
// =============================================================
function onlineCol(day) { return 7 + (day - 1) * 3; }

function readOnline(ss, tab) {
  var sh = ss.getSheetByName(tab);
  if (!sh) return { error: 'Tab not found: ' + tab };
  var v = sh.getDataRange().getValues();
  var n = function(r, c) { return Number(v[r] && v[r][c]) || 0; };

  var ngayData = [];
  for (var d = 1; d <= 31; d++) {
    var c = onlineCol(d);
    ngayData.push({
      ngay:              d,
      doanhThu:          n(5,  c),
      soDon:             n(6,  c),
      gttbDon:           n(7,  c),
      soBSN:             n(10, c),
      dtBSN:             n(9,  c),
      dtDaily:           n(13, c),
      soDonDaily:        n(14, c),
      gttbDailyChiTieu:  n(15, c+1),
      dtTueTinh:         n(17, c),
      donTueTinh:        n(18, c),
      dtTimesCity:       n(22, c),
      donTimesCity:      n(23, c),
      dtPBC:             n(27, c),
      donPBC:            n(28, c),
      dtTrungHoa:        n(32, c),
      donTrungHoa:       n(33, c),
      leadAds:           n(38, c),
      donAds:            n(39, c),
      leadTN:            n(42, c),
      donTN:             n(43, c),
      leadTong:          n(46, c),
      donTong:           n(47, c),
      tgPH:              n(65, c),
      donPancake:        n(66, c),
    });
  }

  return {
    doanhThu:    { thucTe: n(5,  1), chiTieu: n(5,  2) },
    soDon:       { thucTe: n(6,  1), chiTieu: n(6,  2) },
    gttbDon:     n(7, 1),
    soBSN:       { thucTe: n(10, 1), chiTieu: n(10, 2) },
    dtBSN:       { thucTe: n(9,  1), chiTieu: n(9,  2) },
    dtDaily:     { thucTe: n(13, 1), chiTieu: n(13, 2) },
    gttbDonDaily: { thucTe: n(15, 1), chiTieu: n(15, 2) },
    leadAds:     { thucTe: n(38, 1), chiTieu: n(38, 2) },
    donAds:      { thucTe: n(39, 1) },
    leadTN:      { thucTe: n(42, 1), chiTieu: n(42, 2) },
    donTN:       { thucTe: n(43, 1) },
    leadTong:    { thucTe: n(46, 1), chiTieu: n(46, 2) },
    donTong:     { thucTe: n(47, 1) },
    tgPH:        n(65, 1),
    donPancake:  n(66, 1),
    ngayData:    ngayData,
  };
}

// =============================================================
// SHEET ADS
// Đọc từ "Báo cáo ADS the cakelab" sheet riêng, fallback về tab "Ads T8"
// =============================================================
var BAO_CAO_ADS_ID  = '12iXIAtEFdcrECLvZlZcRbxxjrR1QKg7J6eXhMAe9NCo';
var BAO_CAO_ADS_TAB = 'Tháng 8';

function adsCol(day) { return 2 + day; }

function readAds(ss, tab) {
  var sh;
  try {
    var adsSS = SpreadsheetApp.openById(BAO_CAO_ADS_ID);
    if (adsSS) sh = adsSS.getSheetByName(BAO_CAO_ADS_TAB);
  } catch(e) { sh = null; }

  // Fallback: tab "Ads T8" trong Dashboard T8
  if (!sh) {
    var fallbackSS = ss || SpreadsheetApp.getActiveSpreadsheet();
    sh = fallbackSS.getSheetByName(tab);
  }
  if (!sh) return { error: 'Ads sheet not found' };

  var v = sh.getDataRange().getValues();
  var n = function(r, c) { return Number(v[r] && v[r][c]) || 0; };
  var maxCol = v[0] ? v[0].length : 0;

  var ngayData = [];
  for (var d = 1; d <= 31; d++) {
    var c = adsCol(d);
    if (c >= maxCol) break;
    ngayData.push({
      ngay:    d,
      chiPhi:  n(2, c),
      mess:    n(3, c),
      comment: n(4, c),
      soDon:   n(6, c),
      roas:    n(8, c),
    });
  }

  return {
    chiPhi:   n(2, 2),
    mess:     n(3, 2),
    comment:  n(4, 2),
    soDon:    n(6, 2),
    roas:     n(8, 2),
    ngayData: ngayData,
  };
}

// =============================================================
// SHEET CUA HANG (Tue Tinh, Timescity, PBC, Trung Hoa)
// =============================================================
function chCol(day) { return 7 + (day - 1) * 3; }

function readCH(ss, tab) {
  var sh = ss.getSheetByName(tab);
  if (!sh) return { error: 'Tab not found: ' + tab };
  var v = sh.getDataRange().getValues();
  var n = function(r, c) { return Number(v[r] && v[r][c]) || 0; };

  var ngayData = [];
  for (var d = 1; d <= 31; d++) {
    var c = chCol(d);
    ngayData.push({
      ngay:       d,
      doanhThu:   n(5,  c),
      chiTieu:    n(5,  c+1),
      soDon:      n(6,  c),
      gttbDon:    n(7,  c),
      dtBSN:      n(9,  c),
      soBSN:      n(10, c),
      gttbBSN:    n(11, c),
      dtDaily:    n(13, c),
      soDonDaily: n(14, c),
      gttbDaily:  n(15, c),
      luotKhachVao: n(33, c), // dòng 34 (1-based) - nhân viên điền tay mỗi ngày
      topBanChay: readTopNhomByDay(v, 17, d),
      topHuy:     readTopHuyByDay(v, 35, d),
    });
  }

  return {
    doanhThu: { thucTe: n(5,  1), chiTieu: n(5,  2) },
    soDon:    { thucTe: n(6,  1), chiTieu: n(6,  2) },
    gttbDon:  n(7, 1),
    dtBSN:    { thucTe: n(9,  1), chiTieu: n(9,  2) },
    soBSN:    { thucTe: n(10, 1), chiTieu: n(10, 2) },
    gttbBSN:  n(11, 1),
    daily: {
      doanhThu: { thucTe: n(13, 1), chiTieu: n(13, 2) },
      soDon:    { thucTe: n(14, 1), chiTieu: n(14, 2) },
      gttbDon:  n(15, 1),
    },
    tuan: {
      doanhThu: { thucTe: n(5,  4), chiTieu: n(5,  5) },
      soDon:    { thucTe: n(6,  4), chiTieu: n(6,  5) },
      soBSN:    { thucTe: n(10, 4), chiTieu: n(10, 5) },
    },
    topBanChay: readTopNhom(v, 17),
    topHuy:     readTopHuy(v, 35),
    luotKhachVao: { thucTe: n(33, 1), chiTieu: n(33, 2) },
    ngayData:   ngayData,
  };
}

function normalizeStr(s) {
  return String(s||'').trim().toUpperCase()
    .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/gi,'A')
    .replace(/[èéẻẽẹêếềểễệ]/gi,'E')
    .replace(/[ìíỉĩị]/gi,'I')
    .replace(/[òóỏõọôốồổỗộơớờởỡợ]/gi,'O')
    .replace(/[ùúủũụưứừửữự]/gi,'U')
    .replace(/[đ]/gi,'D')
    .replace(/[ýỳỷỹỵ]/gi,'Y');
}

function readTopNhomByDay(v, startRow, day) {
  var KEY_MAP = {
    'BSN': 'bsn', 'BANH KEM NHO': 'banhKemNho',
    'BANH MI': 'banhMi', 'BANH KHAC': 'banhKhac'
  };
  var result = { bsn: [], banhKemNho: [], banhMi: [], banhKhac: [] };
  var currentKey = null;
  var maxRow = Math.min(startRow + 16, v.length);
  var tenCol = 7 + (day-1)*3;
  var slCol  = 9 + (day-1)*3;
  for (var r = startRow; r < maxRow; r++) {
    var cellA = normalizeStr(v[r] && v[r][0]);
    var matched = null;
    for (var lbl in KEY_MAP) {
      if (cellA.indexOf(lbl) !== -1) { matched = lbl; break; }
    }
    if (matched) { currentKey = KEY_MAP[matched]; continue; }
    if (cellA.indexOf('TOP') !== -1 || cellA.indexOf('HUY') !== -1 || cellA === 'TEN SAN PHAM') continue;
    if (currentKey && result[currentKey] !== undefined) {
      var ten = String(v[r][tenCol] || '').trim();
      var sl  = Number(v[r][slCol]) || 0;
      if (ten && ten !== 'Ten san pham' && ten !== 'Tên sản phẩm') {
        result[currentKey].push({ ten: ten, soLuong: sl });
      }
    }
  }
  return result;
}

function readTopNhom(v, startRow) {
  var KEY_MAP = {
    'BSN': 'bsn', 'BANH KEM NHO': 'banhKemNho',
    'BANH MI': 'banhMi', 'BANH KHAC': 'banhKhac'
  };
  var result = { bsn: [], banhKemNho: [], banhMi: [], banhKhac: [] };
  var currentKey = null;
  var maxRow = Math.min(startRow + 16, v.length);
  for (var r = startRow; r < maxRow; r++) {
    var cellA = normalizeStr(v[r] && v[r][0]);
    var matched = null;
    for (var lbl in KEY_MAP) {
      if (cellA.indexOf(lbl) !== -1) { matched = lbl; break; }
    }
    if (matched) { currentKey = KEY_MAP[matched]; continue; }
    if (cellA.indexOf('TOP') !== -1 || cellA.indexOf('HUY') !== -1 || cellA === 'TEN SAN PHAM') continue;
    if (currentKey && result[currentKey] !== undefined) {
      var map = {};
      for (var col = 7; col < Math.min(v[r].length, 100); col += 3) {
        var t = String(v[r][col] || '').trim();
        var sl = Number(v[r][col+2]) || 0;
        if (t && t !== 'Ten san pham' && t !== 'Tên sản phẩm' && t !== '') {
          map[t] = (map[t] || 0) + sl;
        }
      }
      for (var name in map) {
        var found = false;
        for (var k = 0; k < result[currentKey].length; k++) {
          if (result[currentKey][k].ten === name) {
            result[currentKey][k].soLuong += map[name];
            found = true; break;
          }
        }
        if (!found) result[currentKey].push({ ten: name, soLuong: map[name] });
      }
    }
  }
  for (var key in result) {
    result[key].sort(function(a,b){ return b.soLuong - a.soLuong; });
  }
  return result;
}

function readTopHuyByDay(v, startRow, day) {
  var result = [];
  var maxRow = Math.min(startRow + 10, v.length);
  var tenCol = 7 + (day-1)*3;
  var slCol  = 9 + (day-1)*3;
  for (var r = startRow; r < maxRow; r++) {
    var ten = String(v[r][tenCol] || '').trim();
    var sl  = Number(v[r][slCol]) || 0;
    if (ten && ten !== 'Ten san pham' && ten !== 'Tên sản phẩm') {
      result.push({ ten: ten, soLuong: sl });
    }
  }
  return result;
}

function readTopHuy(v, startRow) {
  var map = {};
  var maxRow = Math.min(startRow + 10, v.length);
  for (var r = startRow; r < maxRow; r++) {
    for (var col = 7; col < Math.min(v[r].length, 100); col += 3) {
      var t  = String(v[r][col] || '').trim();
      var sl = Number(v[r][col+2]) || 0;
      if (t && t !== 'Ten san pham' && t !== 'Tên sản phẩm') {
        map[t] = (map[t] || 0) + sl;
      }
    }
  }
  return Object.keys(map).map(function(t){ return {ten:t, soLuong:map[t]}; })
    .sort(function(a,b){ return b.soLuong - a.soLuong; })
    .slice(0, 5);
}

function readMarketing(ss, tab) {
  var sh = ss.getSheetByName(tab);
  if (!sh) return { error: 'Tab not found: ' + tab };
  var v = sh.getDataRange().getValues();
  var n = function(r, c) { return Number(v[r] && v[r][c]) || 0; };
  return {
    leadAds:     { thucTe: n(4, 1), chiTieu: n(4, 2) },
    leadTuNhien: { thucTe: n(5, 1), chiTieu: n(5, 2) },
    tiLeChot:    { thucTe: n(6, 1), chiTieu: n(6, 2) },
    khOffline:   { thucTe: n(7, 1), chiTieu: n(7, 2) },
  };
}

// =============================================================
// FABI_TATCACUAHANG — Top sản phẩm bán chạy real-time
// Cột: A=Cửa hàng, D=Tên hàng, E=Nhóm món, I=Nguồn, N=Thời gian, P=Số lượng
// =============================================================
function readFabiTopProducts(ss, fabiRows) {
  var v = fabiRows;
  if (!v) {
    var sh = ss.getSheetByName('Fabi_TatCaCuaHang');
    if (!sh) return { error: 'Sheet Fabi_TatCaCuaHang not found' };
    v = sh.getDataRange().getDisplayValues();
  }
  if (v.length < 2) return {};

  var COL_CH    = 0;
  var COL_TEN   = 3;
  var COL_NHOM  = 4;
  var COL_NGUON = 8;
  var COL_NGAY  = 13;
  var COL_SL    = 15;

  var CH_MAP = {
    'CS1': 'tueTinh', 'TUE TINH': 'tueTinh',
    'CS2': 'timesCity', 'TIMESCITY': 'timesCity', 'TIMES CITY': 'timesCity',
    'CS3': 'pbc', 'PHAN BOI CHAU': 'pbc',
    'CS4': 'trungHoa', 'TRUNG HOA': 'trungHoa',
  };

  function normStr(s) {
    return String(s||'').trim().toUpperCase()
      .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/gi,'A')
      .replace(/[èéẻẽẹêếềểễệ]/gi,'E')
      .replace(/[ìíỉĩị]/gi,'I')
      .replace(/[òóỏõọôốồổỗộơớờởỡợ]/gi,'O')
      .replace(/[ùúủũụưứừửữự]/gi,'U')
      .replace(/[đ]/gi,'D')
      .replace(/[ýỳỷỹỵ]/gi,'Y');
  }

  function mapCH(raw) {
    var n = normStr(raw);
    if (n.indexOf('CS1') !== -1) return 'tueTinh';
    if (n.indexOf('CS2') !== -1) return 'timesCity';
    if (n.indexOf('CS3') !== -1) return 'pbc';
    if (n.indexOf('CS4') !== -1) return 'trungHoa';
    for (var k in CH_MAP) {
      if (n.indexOf(k) !== -1) return CH_MAP[k];
    }
    return null;
  }

  function mapNhom(raw) {
    var n = normStr(raw);
    if (n.indexOf('SINH NHAT') !== -1) return 'bsn';
    if (n.indexOf('KEM NHO') !== -1)   return 'banhKemNho';
    if (n.indexOf('BANH MI') !== -1)   return 'banhMi';
    return 'banhKhac';
  }

  function parseDate(val) {
    if (val instanceof Date) {
      return { day: val.getDate(), month: val.getMonth()+1, year: val.getFullYear() };
    }
    var s = String(val || '').trim();
    var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return { year: parseInt(m[1]), month: parseInt(m[2]), day: parseInt(m[3]) };
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return { day: parseInt(m[1]), month: parseInt(m[2]), year: parseInt(m[3]) };
    return null;
  }

  var TARGET_MONTH = 7;
  var TARGET_YEAR  = 2026;
  var startRow = 2;

  var acc = { tueTinh:{}, timesCity:{}, pbc:{}, trungHoa:{} };

  for (var r = startRow; r < v.length; r++) {
    var row = v[r];

    var tenRaw = String(row[COL_TEN] || '').trim();
    if (!tenRaw) continue;

    var nguon = String(row[COL_NGUON] || '').trim().toLowerCase();
    if (nguon && nguon !== 'offline') continue;

    var chKey = mapCH(row[COL_CH]);
    if (!chKey) continue;

    var nhomKey = mapNhom(row[COL_NHOM]);
    var dateObj = parseDate(row[COL_NGAY]);
    if (!dateObj) continue;

    if (dateObj.month !== TARGET_MONTH || dateObj.year !== TARGET_YEAR) continue;

    var day = dateObj.day;

    var sl = parseFloat(String(row[COL_SL] || '0').replace(/[^\d.,]/g,'').replace(',','.')) || 0;
    if (sl <= 0) continue;

    if (!acc[chKey][day]) {
      acc[chKey][day] = { bsn:{}, banhKemNho:{}, banhMi:{}, banhKhac:{} };
    }
    var nhomAcc = acc[chKey][day][nhomKey];
    nhomAcc[tenRaw] = (nhomAcc[tenRaw] || 0) + sl;
  }

  var result = {};
  ['tueTinh','timesCity','pbc','trungHoa'].forEach(function(ch) {
    result[ch] = {};
    for (var day in acc[ch]) {
      result[ch][day] = {};
      ['bsn','banhKemNho','banhMi','banhKhac'].forEach(function(nhom) {
        var obj = acc[ch][day][nhom] || {};
        result[ch][day][nhom] = Object.keys(obj)
          .map(function(t) { return { ten: t, soLuong: obj[t] }; })
          .sort(function(a,b) { return b.soLuong - a.soLuong; })
          .slice(0, 10);
      });
    }
  });

  return result;
}

// =============================================================
// FABI_TATCACUAHANG — Tinh toan KPI Thuc te (Doanh thu, So don, GTTB, BSN, Daily)
// theo tung ngay, tung cua hang, ca Online va Offline
// Cot: A=Cua hang(0), E=Nhom mon(4), I=Nguon(8), L=Ma hoa don(11),
//      N=Thoi gian(13), P=So luong(15), AN=Doanh thu da tru giam gia/chiet khau(39)
// =============================================================
function readFabiKPI(ss, fabiRows) {
  var v = fabiRows;
  if (!v) {
    var sh = ss.getSheetByName('Fabi_TatCaCuaHang');
    if (!sh) return { error: 'Sheet Fabi_TatCaCuaHang not found' };
    v = sh.getDataRange().getDisplayValues();
  }
  if (v.length < 3) return {};

  var COL_CH    = 0;
  var COL_NHOM  = 4;
  var COL_NGUON = 8;
  var COL_MAHD  = 11;
  var COL_NGAY  = 13;
  var COL_SL    = 15;
  var COL_TT    = 39; // AN: Doanh thu đã net

  var TARGET_MONTH = 7;
  var TARGET_YEAR  = 2026;
  var startRow = 2;

  function normStr(s) {
    return String(s||'').trim().toUpperCase()
      .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/gi,'A')
      .replace(/[èéẻẽẹêếềểễệ]/gi,'E')
      .replace(/[ìíỉĩị]/gi,'I')
      .replace(/[òóỏõọôốồổỗộơớờởỡợ]/gi,'O')
      .replace(/[ùúủũụưứừửữự]/gi,'U')
      .replace(/[đ]/gi,'D')
      .replace(/[ýỳỷỹỵ]/gi,'Y');
  }

  function mapCH(raw) {
    var n = normStr(raw);
    if (n.indexOf('CS1') !== -1) return 'tueTinh';
    if (n.indexOf('CS2') !== -1) return 'timesCity';
    if (n.indexOf('CS3') !== -1) return 'pbc';
    if (n.indexOf('CS4') !== -1) return 'trungHoa';
    return null;
  }

  function isBSN(raw) {
    return normStr(raw).indexOf('SINH NHAT') !== -1;
  }

  function parseDate(val) {
    var s = String(val || '').trim();
    var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return { year: parseInt(m[1]), month: parseInt(m[2]), day: parseInt(m[3]) };
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return { day: parseInt(m[1]), month: parseInt(m[2]), year: parseInt(m[3]) };
    return null;
  }

  function parseMoney(val) {
    var s = String(val || '0').trim();
    s = s.replace(/[^\d.,-]/g, ''); // bỏ ký tự "đ"/"₫", khoảng trắng...
    if (!s) return 0;

    // Tự nhận diện dấu thập phân: dấu phân cách CUỐI CÙNG (chấm hoặc phẩy)
    // mà có đúng 2 chữ số đứng sau nó chính là dấu thập phân.
    // Xử lý được cả 2 format: "70.000,00" (VN) và "60,000.00" (quốc tế).
    var lastDot = s.lastIndexOf('.');
    var lastComma = s.lastIndexOf(',');
    var decimalSep = Math.max(lastDot, lastComma);

    if (decimalSep !== -1 && (s.length - decimalSep - 1) === 2) {
      var intPart = s.slice(0, decimalSep).replace(/[.,]/g, '');
      var decPart = s.slice(decimalSep + 1);
      s = intPart + '.' + decPart;
    } else {
      // Không có phần thập phân rõ ràng → bỏ hết dấu phân cách (đều là phân nghìn)
      s = s.replace(/[.,]/g, '');
    }

    var num = parseFloat(s) || 0;
    return Math.round(num); // VND không có phần lẻ, round cho chắc
  }

  var acc = {};
  ['tueTinh','timesCity','pbc','trungHoa'].forEach(function(ch) {
    acc[ch] = {};
  });

  for (var r = startRow; r < v.length; r++) {
    var row = v[r];

    var chKey = mapCH(row[COL_CH]);
    if (!chKey) continue;

    var dateObj = parseDate(row[COL_NGAY]);
    if (!dateObj) continue;
    if (dateObj.month !== TARGET_MONTH || dateObj.year !== TARGET_YEAR) continue;
    var day = dateObj.day;

    var nguonRaw = String(row[COL_NGUON] || '').trim().toLowerCase();
    var isOffline = (nguonRaw === 'offline');
    var nguonKey = isOffline ? 'offline' : 'online';

    var maHD = String(row[COL_MAHD] || '').trim();
    if (!maHD) continue;

    var thanhTien = parseMoney(row[COL_TT]);
    var soLuong = parseMoney(row[COL_SL]);
    var bsn = isBSN(row[COL_NHOM]);

    if (!acc[chKey][day]) acc[chKey][day] = {};
    if (!acc[chKey][day][nguonKey]) {
      acc[chKey][day][nguonKey] = {
        dtTong: 0, donSet: {},
        dtBSN: 0, slBSN: 0, donBSNSet: {},
        dtDaily: 0, donDailySet: {},
      };
    }
    var d = acc[chKey][day][nguonKey];

    d.dtTong += thanhTien;
    d.donSet[maHD] = true;

    if (bsn) {
      d.dtBSN += thanhTien;
      d.slBSN += soLuong;
      d.donBSNSet[maHD] = true;
    } else {
      d.dtDaily += thanhTien;
      d.donDailySet[maHD] = true;
    }
  }

  function countKeys(obj) { return Object.keys(obj).length; }

  var result = {};
  ['tueTinh','timesCity','pbc','trungHoa'].forEach(function(ch) {
    result[ch] = {};
    for (var day in acc[ch]) {
      result[ch][day] = {};
      ['online','offline'].forEach(function(nguonKey) {
        var d = acc[ch][day][nguonKey];
        if (!d) {
          result[ch][day][nguonKey] = {
            doanhThu: 0, soDon: 0, gttbDon: 0,
            dtBSN: 0, soBSN: 0, gttbBSN: 0,
            dtDaily: 0, soDonDaily: 0, gttbDaily: 0,
          };
          return;
        }
        var soDon = countKeys(d.donSet);
        var soDonBSN = countKeys(d.donBSNSet);
        var soDonDaily = countKeys(d.donDailySet);
        result[ch][day][nguonKey] = {
          doanhThu:   Math.round(d.dtTong),
          soDon:      soDon,
          gttbDon:    soDon > 0 ? Math.round(d.dtTong / soDon) : 0,
          dtBSN:      Math.round(d.dtBSN),
          soBSN:      Math.round(d.slBSN),
          gttbBSN:    soDonBSN > 0 ? Math.round(d.dtBSN / soDonBSN) : 0,
          dtDaily:    Math.round(d.dtDaily),
          soDonDaily: soDonDaily,
          gttbDaily:  soDonDaily > 0 ? Math.round(d.dtDaily / soDonDaily) : 0,
        };
      });
    }
  });

  return result;
}

// =============================================================
// FABI_TATCACUAHANG — Phân loại KH cũ/mới/Không TĐ theo ngày, theo CH
// =============================================================
// Đọc lịch sử mua hàng T3-T5/2026 (sheet LichSuKH_T3T4T5) để "mồi" trước khi
// tính KH cũ/mới cho tháng 6 — tránh nhận nhầm khách quay lại sau 1-3 tháng
// thành "KH mới" chỉ vì Fabi_TatCaCuaHang không còn giữ data tháng cũ.
function loadKHHistorySeed_(ss) {
  var sh = ss.getSheetByName('LichSuKH_T3T4T5');
  if (!sh) return {}; // chưa có sheet này → bỏ qua, không seed gì cả

  var v = sh.getDataRange().getDisplayValues();
  var seed = {}; // key = ch+'_'+sdt -> absDay (số ngày tuyệt đối kể từ epoch)

  function toAbsDay(y, m, d) {
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  }

  for (var r = 1; r < v.length; r++) { // bỏ dòng header
    var ch = String(v[r][0] || '').trim();
    var sdt = String(v[r][1] || '').trim().replace(/[^\d]/g, '');
    // Google Sheets có thể tự convert "0949793024" thành số 949793024,
    // làm mất số 0 đứng đầu → thêm lại nếu thiếu (SĐT VN luôn đủ 10 số)
    if (sdt && sdt.length === 9) sdt = '0' + sdt;
    var dateStr = String(v[r][2] || '').trim();
    if (!ch || !sdt || !dateStr) continue;

    var m = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!m) continue;
    var absDay = toAbsDay(parseInt(m[3]), parseInt(m[2]), parseInt(m[1]));

    var key = ch + '_' + sdt;
    if (seed[key] === undefined || absDay > seed[key]) {
      seed[key] = absDay;
    }
  }

  return seed;
}

function readFabiKHClassification(ss, fabiRows) {
  var v = fabiRows;
  if (!v) {
    var sh = ss.getSheetByName('Fabi_TatCaCuaHang');
    if (!sh) return { error: 'Sheet Fabi_TatCaCuaHang not found' };
    v = sh.getDataRange().getDisplayValues();
  }
  if (v.length < 3) return {};

  var COL_CH    = 0;
  var COL_NGUON = 8;
  var COL_MAHD  = 11;
  var COL_NGAY  = 13;
  var COL_SDT   = 37;

  var TARGET_MONTH = 7;
  var TARGET_YEAR  = 2026;
  var startRow = 2;

  function toAbsDay(y, m, d) {
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  }

  function normStr(s) {
    return String(s||'').trim().toUpperCase()
      .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/gi,'A')
      .replace(/[èéẻẽẹêếềểễệ]/gi,'E')
      .replace(/[ìíỉĩị]/gi,'I')
      .replace(/[òóỏõọôốồổỗộơớờởỡợ]/gi,'O')
      .replace(/[ùúủũụưứừửữự]/gi,'U')
      .replace(/[đ]/gi,'D')
      .replace(/[ýỳỷỹỵ]/gi,'Y');
  }

  function mapCH(raw) {
    var n = normStr(raw);
    if (n.indexOf('CS1') !== -1) return 'tueTinh';
    if (n.indexOf('CS2') !== -1) return 'timesCity';
    if (n.indexOf('CS3') !== -1) return 'pbc';
    if (n.indexOf('CS4') !== -1) return 'trungHoa';
    return null;
  }

  function parseDate(val) {
    var s = String(val || '').trim();
    var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return { year: parseInt(m[1]), month: parseInt(m[2]), day: parseInt(m[3]) };
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return { day: parseInt(m[1]), month: parseInt(m[2]), year: parseInt(m[3]) };
    return null;
  }

  function normPhone(raw) {
    var s = String(raw || '').trim().replace(/[^\d]/g, '');
    if (!s) return '';
    if (s.indexOf('84') === 0 && s.length > 9) s = '0' + s.slice(2);
    return s;
  }

  var historySeed = loadKHHistorySeed_(ss);

  var invoiceMap = {};
  for (var r = startRow; r < v.length; r++) {
    var row = v[r];

    var chKey = mapCH(row[COL_CH]);
    if (!chKey) continue;

    var nguonRaw = String(row[COL_NGUON] || '').trim().toLowerCase();
    if (nguonRaw !== 'offline') continue;

    var maHD = String(row[COL_MAHD] || '').trim();
    if (!maHD) continue;

    var dateObj = parseDate(row[COL_NGAY]);
    if (!dateObj) continue;
    if (dateObj.month !== TARGET_MONTH || dateObj.year !== TARGET_YEAR) continue;

    var key = chKey + '_' + maHD;
    if (invoiceMap[key]) continue;

    invoiceMap[key] = {
      ch:  chKey,
      day: dateObj.day,
      absDay: toAbsDay(dateObj.year, dateObj.month, dateObj.day),
      sdt: normPhone(row[COL_SDT]),
    };
  }

  var CH_KEYS = ['tueTinh','timesCity','pbc','trungHoa'];
  var byCH = {};
  CH_KEYS.forEach(function(ch) { byCH[ch] = []; });
  for (var k in invoiceMap) {
    byCH[invoiceMap[k].ch].push(invoiceMap[k]);
  }

  var result = {};
  CH_KEYS.forEach(function(ch) {
    var list = byCH[ch];
    list.sort(function(a, b) { return a.absDay - b.absDay; });

    // Mồi lastSeenAbsDay từ lịch sử T3-T5 (nếu có) trước khi xử lý tháng 6
    var lastSeenAbsDay = {};
    for (var key in historySeed) {
      if (key.indexOf(ch + '_') === 0) {
        var sdtPart = key.slice(ch.length + 1);
        lastSeenAbsDay[sdtPart] = historySeed[key];
      }
    }

    var dayAgg = {};

    list.forEach(function(inv) {
      if (!dayAgg[inv.day]) {
        dayAgg[inv.day] = { tongDon:0, donCu:0, cu90:0, cuGt90:0, donMoi:0, donKhongTD:0 };
      }
      var agg = dayAgg[inv.day];
      agg.tongDon++;

      if (!inv.sdt) {
        agg.donKhongTD++;
        return;
      }

      if (lastSeenAbsDay[inv.sdt] === undefined) {
        agg.donMoi++;
      } else {
        var gap = inv.absDay - lastSeenAbsDay[inv.sdt];
        agg.donCu++;
        if (gap <= 90) agg.cu90++;
        else agg.cuGt90++;
      }
      lastSeenAbsDay[inv.sdt] = inv.absDay;
    });

    result[ch] = {};
    for (var day in dayAgg) {
      var a = dayAgg[day];
      result[ch][day] = {
        tongDon:    a.tongDon,
        donCu:      a.donCu,
        cu90:       a.cu90,
        cuGt90:     a.cuGt90,
        donMoi:     a.donMoi,
        donKhongTD: a.donKhongTD,
        pctCu90:    a.donCu > 0 ? Math.round(a.cu90 / a.donCu * 100) : 0,
        pctCuGt90:  a.donCu > 0 ? Math.round(a.cuGt90 / a.donCu * 100) : 0,
        pctCu2:     a.tongDon > 0 ? Math.round(a.donCu / a.tongDon * 100) : 0,
        pctMoi2:    a.tongDon > 0 ? Math.round(a.donMoi / a.tongDon * 100) : 0,
        pctKhongTD: a.tongDon > 0 ? Math.round(a.donKhongTD / a.tongDon * 100) : 0,
      };
    }
  });

  return result;
}

// =============================================================
// FABI_TATCACUAHANG — Phân bổ số item/đơn (không tính đơn BSN)
// =============================================================
function readFabiItemsDistribution(ss, fabiRows) {
  var v = fabiRows;
  if (!v) {
    var sh = ss.getSheetByName('Fabi_TatCaCuaHang');
    if (!sh) return { error: 'Sheet Fabi_TatCaCuaHang not found' };
    v = sh.getDataRange().getDisplayValues();
  }
  if (v.length < 3) return {};

  var COL_CH    = 0;
  var COL_NHOM  = 4;
  var COL_NGUON = 8;
  var COL_MAHD  = 11;
  var COL_NGAY  = 13;

  var TARGET_MONTH = 7;
  var TARGET_YEAR  = 2026;
  var startRow = 2;

  function normStr(s) {
    return String(s||'').trim().toUpperCase()
      .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/gi,'A')
      .replace(/[èéẻẽẹêếềểễệ]/gi,'E')
      .replace(/[ìíỉĩị]/gi,'I')
      .replace(/[òóỏõọôốồổỗộơớờởỡợ]/gi,'O')
      .replace(/[ùúủũụưứừửữự]/gi,'U')
      .replace(/[đ]/gi,'D')
      .replace(/[ýỳỷỹỵ]/gi,'Y');
  }

  function mapCH(raw) {
    var n = normStr(raw);
    if (n.indexOf('CS1') !== -1) return 'tueTinh';
    if (n.indexOf('CS2') !== -1) return 'timesCity';
    if (n.indexOf('CS3') !== -1) return 'pbc';
    if (n.indexOf('CS4') !== -1) return 'trungHoa';
    return null;
  }

  function isBSN(raw) {
    return normStr(raw).indexOf('SINH NHAT') !== -1;
  }

  function parseDate(val) {
    var s = String(val || '').trim();
    var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return { year: parseInt(m[1]), month: parseInt(m[2]), day: parseInt(m[3]) };
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return { day: parseInt(m[1]), month: parseInt(m[2]), year: parseInt(m[3]) };
    return null;
  }

  var invMap = {};

  for (var r = startRow; r < v.length; r++) {
    var row = v[r];

    var chKey = mapCH(row[COL_CH]);
    if (!chKey) continue;

    var nguonRaw = String(row[COL_NGUON] || '').trim().toLowerCase();
    if (nguonRaw !== 'offline') continue;

    var maHD = String(row[COL_MAHD] || '').trim();
    if (!maHD) continue;

    var dateObj = parseDate(row[COL_NGAY]);
    if (!dateObj) continue;
    if (dateObj.month !== TARGET_MONTH || dateObj.year !== TARGET_YEAR) continue;

    var key = chKey + '_' + maHD;
    if (!invMap[key]) {
      invMap[key] = { ch: chKey, day: dateObj.day, lineCount: 0, hasBSN: false };
    }
    invMap[key].lineCount++;
    if (isBSN(row[COL_NHOM])) invMap[key].hasBSN = true;
  }

  var CH_KEYS = ['tueTinh','timesCity','pbc','trungHoa'];
  var byDay = {};
  var totals = {};
  CH_KEYS.forEach(function(ch) { byDay[ch] = {}; totals[ch] = { g1:0, g2:0, g3:0, tong:0, sumItems:0 }; });

  for (var k in invMap) {
    var inv = invMap[k];
    if (inv.hasBSN) continue;

    if (!byDay[inv.ch][inv.day]) {
      byDay[inv.ch][inv.day] = { g1:0, g2:0, g3:0, tong:0, sumItems:0 };
    }
    var agg = byDay[inv.ch][inv.day];
    if (inv.lineCount === 1) agg.g1++;
    else if (inv.lineCount === 2) agg.g2++;
    else agg.g3++;
    agg.tong++;
    agg.sumItems += inv.lineCount;

    var t = totals[inv.ch];
    if (inv.lineCount === 1) t.g1++;
    else if (inv.lineCount === 2) t.g2++;
    else t.g3++;
    t.tong++;
    t.sumItems += inv.lineCount;
  }

  var result = { byDay: {}, totals: {} };
  CH_KEYS.forEach(function(ch) {
    result.byDay[ch] = {};
    for (var day in byDay[ch]) {
      var a = byDay[ch][day];
      result.byDay[ch][day] = {
        g1: a.g1, g2: a.g2, g3: a.g3, tong: a.tong,
        tbItems: a.tong > 0 ? Math.round((a.sumItems / a.tong) * 100) / 100 : 0,
        soLuongItem: a.sumItems, // tổng số lượng item (dòng sản phẩm) bán ra trong ngày, không tính BSN
      };
    }
    var t = totals[ch];
    result.totals[ch] = {
      g1: t.g1, g2: t.g2, g3: t.g3, tong: t.tong,
      tbItems: t.tong > 0 ? Math.round((t.sumItems / t.tong) * 100) / 100 : 0,
      soLuongItem: t.sumItems,
    };
  });

  return result;
}

// =============================================================
// DEBUG
// =============================================================
function debugFabiKPI() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = readFabiKPI(ss);
  if (result.error) { Logger.log('ERROR: ' + result.error); return; }
  Logger.log('tueTinh day 17: ' + JSON.stringify(result.tueTinh['17']));
}

function debugFabiKHClassification() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = readFabiKHClassification(ss);
  if (result.error) { Logger.log('ERROR: ' + result.error); return; }
  Logger.log('tueTinh day 16: ' + JSON.stringify(result.tueTinh['16']));
  Logger.log('tueTinh day 17: ' + JSON.stringify(result.tueTinh['17']));
}

function debugFabiItemsDistribution() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = readFabiItemsDistribution(ss);
  if (result.error) { Logger.log('ERROR: ' + result.error); return; }
  Logger.log('tueTinh day 16: ' + JSON.stringify(result.byDay.tueTinh['16']));
  Logger.log('tueTinh day 17: ' + JSON.stringify(result.byDay.tueTinh['17']));
}