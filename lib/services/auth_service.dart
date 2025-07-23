// lib/services/auth_service.dart
//
// ──────────────────────────────────────────────────────────────
//  Centralised auth helper: registration, login, token storage,
//  profile fetch, and a tiny JWT decoder that gives you the
//  current user-id.
// ──────────────────────────────────────────────────────────────

import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user.dart';

class AuthService {
  static const _browserBase = 'http://localhost:5000/api';      // web build only
  static const _emulatorBase = 'http://10.0.2.2:5000/api';       // Android emulator
  static const _lanBase      = 'http://192.168.1.12:5000/api';   // real device on same WiFi

  static String get baseUrl {
    // allow override
    const env = String.fromEnvironment('API_URL');
    if (env.isNotEmpty) return env;

    if (kIsWeb) return _browserBase;
    if (Platform.isAndroid || Platform.isIOS) return _lanBase;   // <-- change here
    return _browserBase;
  }
  /* ───────────── token helpers ───────────── */
  static Future<String?> getToken() async =>
      (await SharedPreferences.getInstance()).getString('token');

  static Future<void> saveToken(String t) async =>
      (await SharedPreferences.getInstance()).setString('token', t);

  static Future<void> clearToken() async =>
      (await SharedPreferences.getInstance()).remove('token');

  static Map<String, String> _json([String? tok]) => {
        'Content-Type': 'application/json',
        if (tok != null && tok.isNotEmpty) 'Authorization': 'Bearer $tok',
      };

  /* ═════════════════════════ USER FLOW ═════════════════════════ */

  // ── Register (send OTP) ────────────────────────────────────
  static Future<void> registerSendOtp({
    required String fullName,
    required String email,
    required String password,
    required String district,
    required String phoneNumber,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _json(),
      body: jsonEncode({
        'fullName'   : fullName,
        'email'      : email,
        'password'   : password,
        'district'   : district,
        'phoneNumber': phoneNumber,
      }),
    );
    if (res.statusCode != 200 && res.statusCode != 201) {
      _err(res, 'Registration failed');
    }
  }

  // ── Register (verify OTP) ──────────────────────────────────
  static Future<void> verifyRegisterOtp({
    required String email,
    required String otp,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/verify-register'),
      headers: _json(),
      body: jsonEncode({'email': email, 'otp': otp}),
    );
    if (res.statusCode != 200) _err(res, 'Verification failed');
  }

  // ── Login ──────────────────────────────────────────────────
// ── Login ──────────────────────────────────────────────────
static Future<User> login({
  required String email,
  required String password,
}) async {
  final res = await http.post(
    Uri.parse('$baseUrl/auth/login'),
    headers: _json(),
    body: jsonEncode({'email': email, 'password': password}),
  );

  if (res.statusCode == 200) {
    final body = jsonDecode(res.body);

    // 1) build the User object up‑front (we need role below)
    final user = User.fromJson(body['user'] ?? {});

    // 2) MOBILE‑SIDE role gate  ⚠️
    //
    // • Mobile app == normal users only
    // • Web (kIsWeb) == admin portal (handled in React side)
    //
    // If you ever publish the Flutter build to web you can flip the check,
    // or add a compile‑time dart‑define.
    if (!kIsWeb && (user.role?.toLowerCase() == 'admin')) {
      throw Exception('Admins must sign‑in via the web portal.');
    }

    // 3) persist the token as before
    if (body['token'] != null) await saveToken(body['token']);

    return user;                      // success!
  }

  _err(res, 'Login failed');
}

  // ── Forgot-password helpers (OTP flow) ─────────────────────
  static Future<void> forgotPasswordRequestOtp({required String email}) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/forgot-password'),
      headers: _json(),
      body: jsonEncode({'email': email}),
    );
    if (res.statusCode != 200) _err(res, 'Request OTP failed');
  }

  static Future<void> verifyForgotOtp({
    required String email,
    required String otp,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/verify-forgot-otp'),
      headers: _json(),
      body: jsonEncode({'email': email, 'otp': otp}),
    );
    if (res.statusCode != 200) _err(res, 'OTP verification failed');
  }

  static Future<void> resetPasswordWithOtp({
    required String email,
    required String otp,
    required String newPassword,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/reset-password'),
      headers: _json(),
      body: jsonEncode({
        'email'      : email,
        'otp'        : otp,
        'newPassword': newPassword,
      }),
    );
    if (res.statusCode != 200) _err(res, 'Reset password failed');
  }

  /* ───────────── Fetch current user profile ───────────── */
  /// Calls GET /api/users/me and returns a fresh `User`.
  static Future<User> fetchProfile() async {
    final token = await getToken();
    if (token == null) throw Exception('Not authenticated');
    final res = await http.get(
      Uri.parse('$baseUrl/users/me'),
      headers: _json(token),
    );
    if (res.statusCode == 200) {
      final body = jsonDecode(res.body);
      return User.fromJson(body);
    }
    _err(res, 'Fetch profile failed');
  }

  /* ───────────── New: Update profile ───────────── */
  /// Calls PUT /api/users/me with the updated fields.
  static Future<User> updateProfile({
    String? fullName,
    String? email,
    String? district,
    String? phoneNumber,
    String? profilePicture,
  }) async {
    final token = await getToken();
    if (token == null) throw Exception('Not authenticated');

    final body = <String, dynamic>{};
    if (fullName       != null) body['fullName']       = fullName;
    if (email          != null) body['email']          = email;
    if (district       != null) body['district']       = district;
    if (phoneNumber    != null) body['phoneNumber']    = phoneNumber;
    if (profilePicture != null) body['profilePicture'] = profilePicture;

    final res = await http.put(
      Uri.parse('$baseUrl/users/me'),
      headers: _json(token),
      body: jsonEncode(body),
    );
    if (res.statusCode == 200) {
      return User.fromJson(jsonDecode(res.body));
    } else {
      final msg = jsonDecode(res.body)['msg'] ?? 'Update failed';
      throw Exception(msg);
    }
  }

  /* ───────────── New: Upload profile picture ───────────── */
  /// Calls POST /api/users/me/avatar via multipart to upload an image.
  static Future<String> uploadProfilePicture(File file) async {
    final token = await getToken();
    if (token == null) throw Exception('Not authenticated');

    final req = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/users/me/avatar'),
    );
    req.headers['Authorization'] = 'Bearer $token';
    req.files.add(await http.MultipartFile.fromPath('avatar', file.path));

    final streamed = await req.send();
    if (streamed.statusCode == 200) {
      final txt = await streamed.stream.bytesToString();
      final json = jsonDecode(txt);
      return json['profilePicture'] as String;
    } else {
      throw Exception('Image upload failed: ${streamed.statusCode}');
    }
  }

  /* ═══════════════════════ JWT → current user-id ══════════════════════ */

  // adds missing “=” padding so every Base64URL segment length is %4 == 0
  static String _fixBase64(String str) =>
      str.padRight(str.length + ((4 - str.length % 4) % 4), '=');

  /// Return the user-id stored inside the JWT – or null when not logged in.
  static Future<String?> getCurrentUserId() async {
    final token = await getToken();
    if (token == null) return null;

    final parts = token.split('.');
    if (parts.length != 3) return null;       // malformed

    try {
      final payloadStr = utf8.decode(
        base64Url.decode(_fixBase64(parts[1])),
      );
      final payload = jsonDecode(payloadStr);

      return payload['_id']             ??
             payload['id']              ??
             payload['userId']          ??
             payload['sub']             ??
             (payload['user']?['_id']);
    } catch (_) {
      await clearToken(); // bad or expired → wipe
      return null;
    }
  }

  /* ───────────── token-link reset (optional) ───────────── */
  static Future<void> resetByToken({
    required String token,
    required String newPassword,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/reset/$token'),
      headers: _json(),
      body: jsonEncode({'password': newPassword}),
    );
    if (res.statusCode != 200) _err(res, 'Reset failed');
  }

  /* ═════════════ positional wrappers (legacy UI) ═════════════ */

  static Future<User> loginPos(String email, String password) =>
      login(email: email, password: password);

  static Future<void> registerSendOtpPos(
    String full, String mail, String pass, String dist, String phone,
  ) => registerSendOtp(
        fullName    : full,
        email       : mail,
        password    : pass,
        district    : dist,
        phoneNumber : phone,
      );

  static Future<void> verifyRegisterOtpPos(String mail, String otp) =>
      verifyRegisterOtp(email: mail, otp: otp);

  static Future<void> forgotPasswordRequestOtpPos(String mail) =>
      forgotPasswordRequestOtp(email: mail);

  static Future<void> verifyForgotOtpPos(String mail, String otp) =>
      verifyForgotOtp(email: mail, otp: otp);

  static Future<void> resetPasswordWithOtpPos(
    String mail, String otp, String newPass,
  ) => resetPasswordWithOtp(
        email       : mail,
        otp         : otp,
        newPassword : newPass,
      );

  /* ═══════════════════ internal error helper ════════════════════ */
  static Never _err(http.Response r, String msg) {
    final ct = r.headers['content-type'] ?? '';
    if (ct.contains('application/json')) {
      try {
        final j = jsonDecode(r.body);
        throw Exception(j['msg'] ?? j['error'] ?? msg);
      } catch (_) {
        throw Exception(msg);
      }
    }
    throw Exception('$msg: ${r.statusCode}');
  }
}

/* ───────── global shims used by some old screens ───────── */
Future<User> login(String email, String password) =>
    AuthService.loginPos(email, password);

Future<void> registerSendOtp(
  String full, String mail, String pass, String dist, String phone,
) => AuthService.registerSendOtpPos(full, mail, pass, dist, phone);

Future<void> verifyRegisterOtp(String mail, String otp) =>
    AuthService.verifyRegisterOtpPos(mail, otp);

Future<void> forgotPasswordRequestOtp(String mail) =>
    AuthService.forgotPasswordRequestOtpPos(mail);

Future<void> verifyForgotOtp(String mail, String otp) =>
    AuthService.verifyForgotOtpPos(mail, otp);

Future<void> resetPasswordWithOtp(String mail, String otp, String newPass) =>
    AuthService.resetPasswordWithOtpPos(mail, otp, newPass);
