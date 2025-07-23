import 'package:dio/dio.dart';

import '../models/education_content.dart';
import '../services/auth_service.dart';        // for AuthService.getToken()

class EducationService {
  ///  --dart-define=API=https://api.example.com/api
  static final _dio = Dio(
BaseOptions(baseUrl: AuthService.baseUrl),
  );

  /* ───────────── helpers ───────────── */

  static Future<String?> _token() => AuthService.getToken();

  static Future<List<EducationContent>> fetchAll(String myId) async {
    final res = await _dio.get(
      '/education',
      options: Options(headers: {
        if (await _token() case final t?) 'Authorization': 'Bearer $t',
      }),
    );
    return (res.data as List)
        .map((j) => EducationContent.fromJson(j, myId))
        .toList();
  }

  static Future<void> toggleLike(String id) async {
    await _dio.put(
      '/education/$id/like',
      options: Options(headers: {
        if (await _token() case final t?) 'Authorization': 'Bearer $t',
      }),
    );
  }

  static Future<Comment> addComment(String id, String text) async {
    final res = await _dio.post(
      '/education/$id/comment',
      data: {'text': text},
      options: Options(headers: {
        if (await _token() case final t?) 'Authorization': 'Bearer $t',
      }),
    );
    return Comment.fromJson(res.data);
  }
}
