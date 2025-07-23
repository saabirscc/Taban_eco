import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/cleanup.dart';
import '../models/volunteer.dart';
import 'auth_service.dart';

class CleanupService {
 static String get baseUrl => AuthService.baseUrl;

  /*───────────────────── helpers ─────────────────────*/

  static Future<Map<String, String>> _authHeaders() async {
    final token = await AuthService.getToken();
    if (token == null) throw Exception('Not authenticated');
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  /*───────────────────── CRUD ─────────────────────*/

  /// POST /cleanup        (create)
  static Future<void> createCleanup(
    String title,
    String description,
    String location,
    String wasteType,
    String severity,
    DateTime? scheduledDate,
    List<dynamic> images, {
    required double latitude,
    required double longitude,
  }) async {
    final token = await AuthService.getToken();
    if (token == null) throw Exception('Not authenticated');

    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/cleanup'),
    )..headers['Authorization'] = 'Bearer $token';

    request
      ..fields['title'] = title
      ..fields['description'] = description
      ..fields['location'] = location
      ..fields['wasteType'] = wasteType
      ..fields['severity'] = severity
      ..fields['latitude'] = latitude.toString()
      ..fields['longitude'] = longitude.toString();

    if (scheduledDate != null) {
      request.fields['scheduledDate'] = scheduledDate.toIso8601String();
    }

    for (var img in images) {
      request.files.add(
        await http.MultipartFile.fromPath('photos', img.path),
      );
    }

    final streamed = await request.send();
    final res = await http.Response.fromStream(streamed);
    if (res.statusCode != 201) {
      throw Exception('Failed to submit cleanup request: ${res.body}');
    }
  }

  /// GET /cleanup/mine    (my cleanups)
  static Future<List<Cleanup>> fetchMyCleanups() async {
    final headers = await _authHeaders();
    final res = await http.get(
      Uri.parse('$baseUrl/cleanup/mine'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to load cleanups: ${res.body}');
    }
    final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return body.map(Cleanup.fromJson).toList();
  }

  /// GET /cleanup         (all cleanups)
  static Future<List<Cleanup>> fetchCleanups() async {
    final headers = await _authHeaders();
    final res = await http.get(
      Uri.parse('$baseUrl/cleanup'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to load cleanups: ${res.body}');
    }
    final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return body.map(Cleanup.fromJson).toList();
  }

  /// PUT /cleanup/:id     (update)
  static Future<void> updateCleanup(
    String id,
    String title,
    String description,
    String location,
    String wasteType,
    String severity,
    DateTime? scheduledDate,
    List<dynamic> images, {
    required double latitude,
    required double longitude,
  }) async {
    final token = await AuthService.getToken();
    if (token == null) throw Exception('Not authenticated');

    final request = http.MultipartRequest(
      'PUT',
      Uri.parse('$baseUrl/cleanup/$id'),
    )..headers['Authorization'] = 'Bearer $token';

    request
      ..fields['title'] = title
      ..fields['description'] = description
      ..fields['location'] = location
      ..fields['wasteType'] = wasteType
      ..fields['severity'] = severity
      ..fields['latitude'] = latitude.toString()
      ..fields['longitude'] = longitude.toString();

    if (scheduledDate != null) {
      request.fields['scheduledDate'] = scheduledDate.toIso8601String();
    }

    for (var img in images) {
      request.files.add(
        await http.MultipartFile.fromPath('photos', img.path),
      );
    }

    final streamed = await request.send();
    final res = await http.Response.fromStream(streamed);
    if (res.statusCode != 200) {
      throw Exception('Failed to update cleanup request: ${res.body}');
    }
  }

  /// DELETE /cleanup/:id
  static Future<void> deleteCleanup(String id) async {
    final headers = await _authHeaders();
    final res = await http.delete(
      Uri.parse('$baseUrl/cleanup/$id'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to delete cleanup request: ${res.body}');
    }
  }

  /*─────────────────────────────────────────────────────*/
  /*         SELF-VOLUNTEER & VOLUNTEER LISTING         */
  /*─────────────────────────────────────────────────────*/

  /// GET /cleanup/:id/volunteers
  static Future<List<Volunteer>> fetchVolunteers(String cleanupId) async {
    final headers = await _authHeaders();
    final res = await http.get(
      Uri.parse('$baseUrl/cleanup/$cleanupId/volunteers'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to load volunteers: ${res.body}');
    }
    final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return body.map(Volunteer.fromJson).toList();
  }

  /// POST /cleanup/:id/volunteer   (join self)
  static Future<List<Volunteer>> joinCleanup(String cleanupId) async {
    final headers = await _authHeaders();
    final res = await http.post(
      Uri.parse('$baseUrl/cleanup/$cleanupId/volunteer'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to join cleanup: ${res.body}');
    }
    final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return body.map(Volunteer.fromJson).toList();
  }

  /// DELETE /cleanup/:id/volunteer (leave self)
  static Future<List<Volunteer>> leaveCleanup(String cleanupId) async {
    final headers = await _authHeaders();
    final res = await http.delete(
      Uri.parse('$baseUrl/cleanup/$cleanupId/volunteer'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to leave cleanup: ${res.body}');
    }
    final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return body.map(Volunteer.fromJson).toList();
  }

  /*─────────────────────────────────────────────────────*/
  /*           ADMIN: MARK CLEANUP COMPLETED             */
  /*─────────────────────────────────────────────────────*/

  /// PUT /admin/cleanups/:id/complete
  /// Returns the updated Cleanup object.
  static Future<Cleanup> completeCleanup(String id) async {
    final headers = await _authHeaders();
    final res = await http.put(
      Uri.parse('$baseUrl/admin/cleanups/$id/complete'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to complete cleanup: ${res.body}');
    }
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return Cleanup.fromJson(data);
  }
}
