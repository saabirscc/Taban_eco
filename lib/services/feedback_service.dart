// lib/services/feedback_service.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class FeedbackService {
  static const _webBase    = 'http://localhost:5000/api';
  static const _mobileBase = 'http://10.0.2.2:5000/api';

  static String get baseUrl {
    const fromEnv = String.fromEnvironment('API_URL');
    if (fromEnv.isNotEmpty) return fromEnv;
    // adapt for web vs emulator
    return identical(0, 0.0) ? _webBase : _mobileBase;
  }

  /// Reads the stored JWT and posts the feedback
  static Future<void> submitAppFeedback({
    required String text,
    required int rating,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) throw Exception('Not authenticated');

    final res = await http.post(
      Uri.parse('$baseUrl/feedback'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'text': text,
        'rating': rating,
      }),
    );

    if (res.statusCode != 201) {
      final msg = res.headers['content-type']?.contains('application/json') == true
          ? jsonDecode(res.body)['msg'] ?? res.body
          : res.body;
      throw Exception('Failed to submit feedback: $msg');
    }
  }
}
