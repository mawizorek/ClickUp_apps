/* QR Forge · source/qr-selftest.js
   Known-answer checks against the published values in ISO/IEC 18004, plus a
   full read-back of the placed codewords out of the finished matrix.

   Honest about what this is NOT: nothing running in a browser tab can prove a
   physical scanner accepts the output. These checks prove the arithmetic, the
   two BCH strings and the placement/mask round trip. Pointing a phone at the
   code on screen is still the acceptance test. */
(function (root) {
  'use strict';

  function run() {
    var GF = root.QRGF, QR = root.QR, out = [];
    function ok(name, pass, detail) { out.push({ name: name, pass: !!pass, detail: detail || '' }); }

    // GF(256): x^8 reduces to x^4+x^3+x^2+1 = 0x1D under the 0x11D polynomial.
    var idOk = true, zeroOk = true;
    for (var a = 0; a < 256; a++) {
      if (GF.mul(a, 1) !== a) idOk = false;
      if (GF.mul(a, 0) !== 0) zeroOk = false;
    }
    ok('GF identity and zero hold for all 256 elements', idOk && zeroOk);
    ok('GF reduction: 0x80 x 2 = 0x1D', GF.mul(0x80, 2) === 0x1D, '0x' + GF.mul(0x80, 2).toString(16));

    // A codeword block followed by its own ECC must divide cleanly.
    var div = GF.divisor(26), data = new Uint8Array(60);
    for (var i = 0; i < 60; i++) data[i] = (i * 37 + 11) & 0xFF;
    var ecc = GF.remainder(data, div);
    var joined = new Uint8Array(86);
    joined.set(data, 0); joined.set(ecc, 60);
    var check = GF.remainder(joined, div), clean = true;
    for (var j = 0; j < check.length; j++) if (check[j] !== 0) clean = false;
    ok('Reed-Solomon closure: remainder of data+ECC is zero', clean);

    // Published format string for ECC M, mask 0: 101010000010010.
    var s = new QR.Symbol(1, 'M');
    s.formatBits(0);
    var fmt = 0;
    for (var k = 0; k <= 5; k++) fmt |= (s.get(8, k) ? 1 : 0) << k;
    fmt |= (s.get(8, 7) ? 1 : 0) << 6;
    fmt |= (s.get(8, 8) ? 1 : 0) << 7;
    fmt |= (s.get(7, 8) ? 1 : 0) << 8;
    for (var m = 9; m < 15; m++) fmt |= (s.get(14 - m, 8) ? 1 : 0) << m;
    ok('Format string, ECC M mask 0 = 0x5412', fmt === 0x5412, '0x' + fmt.toString(16));

    // Published version string for version 7: 000111110010010100.
    var v7 = new QR.Symbol(7, 'L');
    v7.versionBits();
    var vb = 0;
    for (var q = 0; q < 18; q++)
      vb |= (v7.get(v7.size - 11 + q % 3, Math.floor(q / 3)) ? 1 : 0) << q;
    ok('Version string, version 7 = 0x07C94', vb === 0x07C94, '0x' + vb.toString(16));

    // Capacities that appear in every published table.
    ok('Byte capacity v1-L = 17', QR.capacity(1, 'L') === 17, String(QR.capacity(1, 'L')));
    ok('Byte capacity v1-H = 7', QR.capacity(1, 'H') === 7, String(QR.capacity(1, 'H')));
    ok('Byte capacity v40-L = 2953', QR.capacity(40, 'L') === 2953, String(QR.capacity(40, 'L')));

    // Alignment centres for v7 / v10 / v40.
    ok('Alignment centres v7 = 6,22,38', QR.alignPositions(7).join(',') === '6,22,38', QR.alignPositions(7).join(','));
    ok('Alignment centres v40 = 6,30,58,86,114,142,170',
       QR.alignPositions(40).join(',') === '6,30,58,86,114,142,170');

    // Read every placed codeword back out of the finished matrix. This exercises
    // the zigzag, the reserved-module map and mask reversibility in one shot.
    var sym = QR.encode('https://mawizorek.github.io/ClickUp_apps/qr-forge/', { ecl: 'Q', boost: false });
    sym.applyMask(sym.mask);                       // unmask in place
    var n = sym.size, read = new Uint8Array(sym.codewords.length), bi = 0;
    for (var right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < n; vert++) {
        for (var jj = 0; jj < 2; jj++) {
          var x = right - jj, up = ((right + 1) & 2) === 0, y = up ? n - 1 - vert : vert;
          if (!sym.fixed[y * n + x] && bi < read.length * 8) {
            read[bi >>> 3] |= (sym.m[y * n + x]) << (7 - (bi & 7));
            bi++;
          }
        }
      }
    }
    sym.applyMask(sym.mask);                       // put it back
    var same = read.length === sym.codewords.length;
    for (var r = 0; same && r < read.length; r++) if (read[r] !== sym.codewords[r]) same = false;
    ok('Codewords read back out of the matrix match what went in', same,
       sym.codewords.length + ' codewords, version ' + sym.version);

    var failed = out.filter(function (t) { return !t.pass; });
    return { tests: out, passed: out.length - failed.length, failed: failed.length };
  }

  root.QRSelfTest = { run: run };
})(window);
