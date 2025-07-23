import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  // ───────────────────────── state ─────────────────────────
  String? _token;
  User?   _user;

  // ──────────────────────── getters ────────────────────────
  String? get token           => _token;
  User?   get user            => _user;
  String? get role            => _user?.role;         
  bool    get isAuthenticated => _token != null && _user != null;
String? get userId => _user?.id;
  // ───────────────── bootstrap / auto-login ────────────────
  Future<void> tryAutoLogin() async {
    final prefs       = await SharedPreferences.getInstance();
    final storedToken = prefs.getString('token');
    if (storedToken == null) return;

    _token = storedToken;

    // 1) Try to warm-start from cached JSON
    final cached = prefs.getString('user');
    if (cached != null) {
      try {
        _user = User.fromJson(jsonDecode(cached));
      } catch (_) {
        _user = null;
      }
    } 
    // 2) If no cache, fetch from /users/me
    else {
      try {
        _user = await AuthService.fetchProfile();
        await prefs.setString('user', jsonEncode(_user!.toJson()));
      } catch (_) {
        // ignore
      }
    }

    notifyListeners();
  }

  // ─────────────────────────  login  ───────────────────────
  Future<bool> login(String email, String password) async {
    final user  = await AuthService.loginPos(email, password);
    final token = await AuthService.getToken();
    if (token == null) {
      throw Exception('Token missing after login');
    }
    await _persistSession(token, user);
    return true;
  }

  // ───────────────────────── persist ───────────────────────
  Future<void> _persistSession(String token, User user) async {
    _token = token;
    _user  = user;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    await prefs.setString('user',  jsonEncode(user.toJson()));

    notifyListeners();
  }

  // ───────────────── profile mutation helper ───────────────
  void setUser(User user) {
    _user = user;
    SharedPreferences.getInstance()
        .then((p) => p.setString('user', jsonEncode(user.toJson())));
    notifyListeners();
  }

  // ───────────────────────── logout ────────────────────────
  Future<void> logout() async {
    _token = null;
    _user  = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
    notifyListeners();
  }
}
