// lib/services/reward_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/reward.dart';
import 'auth_service.dart';

class RewardService {
  static Future<List<Reward>> fetchUserRewards(String userId) async {
    final token = await AuthService.getToken();
    final res = await http.get(
     Uri.parse('${AuthService.baseUrl}/rewards/$userId'),
      headers: { 'Authorization': 'Bearer $token', 'Content-Type': 'application/json' },
    );
    if (res.statusCode != 200) throw Exception('Failed to load rewards');
    final List body = jsonDecode(res.body);
    return body.map((e) => Reward.fromJson(e)).toList();
  }
}
