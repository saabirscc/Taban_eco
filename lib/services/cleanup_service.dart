// import 'dart:convert';
// import 'package:http/http.dart' as http;
// import '../models/cleanup.dart';
// import '../models/volunteer.dart';
// import 'auth_service.dart';

// class CleanupService {
//  static String get baseUrl => AuthService.baseUrl;

//   /*───────────────────── helpers ─────────────────────*/

//   static Future<Map<String, String>> _authHeaders() async {
//     final token = await AuthService.getToken();
//     if (token == null) throw Exception('Not authenticated');
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer $token',
//     };
//   }

//   /*───────────────────── CRUD ─────────────────────*/

//   /// POST /cleanup        (create)
//   static Future<void> createCleanup(
//     String title,
//     String description,
//     String location,
//     String wasteType,
//     String severity,
//     DateTime? scheduledDate,
//     List<dynamic> images, {
//     required double latitude,
//     required double longitude,
//   }) async {
//     final token = await AuthService.getToken();
//     if (token == null) throw Exception('Not authenticated');

//     final request = http.MultipartRequest(
//       'POST',
//       Uri.parse('$baseUrl/cleanup'),
//     )..headers['Authorization'] = 'Bearer $token';

//     request
//       ..fields['title'] = title
//       ..fields['description'] = description
//       ..fields['location'] = location
//       ..fields['wasteType'] = wasteType
//       ..fields['severity'] = severity
//       ..fields['latitude'] = latitude.toString()
//       ..fields['longitude'] = longitude.toString();

//     if (scheduledDate != null) {
//       request.fields['scheduledDate'] = scheduledDate.toIso8601String();
//     }

//     for (var img in images) {
//       request.files.add(
//         await http.MultipartFile.fromPath('photos', img.path),
//       );
//     }

//     final streamed = await request.send();
//     final res = await http.Response.fromStream(streamed);
//     if (res.statusCode != 201) {
//       throw Exception('Failed to submit cleanup request: ${res.body}');
//     }
//   }

//   /// GET /cleanup/mine    (my cleanups)
//   static Future<List<Cleanup>> fetchMyCleanups() async {
//     final headers = await _authHeaders();
//     final res = await http.get(
//       Uri.parse('$baseUrl/cleanup/mine'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to load cleanups: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Cleanup.fromJson).toList();
//   }

//   /// GET /cleanup         (all cleanups)
//   static Future<List<Cleanup>> fetchCleanups() async {
//     final headers = await _authHeaders();
//     final res = await http.get(
//       Uri.parse('$baseUrl/cleanup'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to load cleanups: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Cleanup.fromJson).toList();
//   }

//   /// PUT /cleanup/:id     (update)
//   static Future<void> updateCleanup(
//     String id,
//     String title,
//     String description,
//     String location,
//     String wasteType,
//     String severity,
//     DateTime? scheduledDate,
//     List<dynamic> images, {
//     required double latitude,
//     required double longitude,
//   }) async {
//     final token = await AuthService.getToken();
//     if (token == null) throw Exception('Not authenticated');

//     final request = http.MultipartRequest(
//       'PUT',
//       Uri.parse('$baseUrl/cleanup/$id'),
//     )..headers['Authorization'] = 'Bearer $token';

//     request
//       ..fields['title'] = title
//       ..fields['description'] = description
//       ..fields['location'] = location
//       ..fields['wasteType'] = wasteType
//       ..fields['severity'] = severity
//       ..fields['latitude'] = latitude.toString()
//       ..fields['longitude'] = longitude.toString();

//     if (scheduledDate != null) {
//       request.fields['scheduledDate'] = scheduledDate.toIso8601String();
//     }

//     for (var img in images) {
//       request.files.add(
//         await http.MultipartFile.fromPath('photos', img.path),
//       );
//     }

//     final streamed = await request.send();
//     final res = await http.Response.fromStream(streamed);
//     if (res.statusCode != 200) {
//       throw Exception('Failed to update cleanup request: ${res.body}');
//     }
//   }

//   /// DELETE /cleanup/:id
//   static Future<void> deleteCleanup(String id) async {
//     final headers = await _authHeaders();
//     final res = await http.delete(
//       Uri.parse('$baseUrl/cleanup/$id'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to delete cleanup request: ${res.body}');
//     }
//   }

//   /*─────────────────────────────────────────────────────*/
//   /*         SELF-VOLUNTEER & VOLUNTEER LISTING         */
//   /*─────────────────────────────────────────────────────*/

//   /// GET /cleanup/:id/volunteers
//   static Future<List<Volunteer>> fetchVolunteers(String cleanupId) async {
//     final headers = await _authHeaders();
//     final res = await http.get(
//       Uri.parse('$baseUrl/cleanup/$cleanupId/volunteers'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to load volunteers: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Volunteer.fromJson).toList();
//   }

//   /// POST /cleanup/:id/volunteer   (join self)
//   static Future<List<Volunteer>> joinCleanup(String cleanupId) async {
//     final headers = await _authHeaders();
//     final res = await http.post(
//       Uri.parse('$baseUrl/cleanup/$cleanupId/volunteer'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to join cleanup: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Volunteer.fromJson).toList();
//   }

//   /// DELETE /cleanup/:id/volunteer (leave self)
//   static Future<List<Volunteer>> leaveCleanup(String cleanupId) async {
//     final headers = await _authHeaders();
//     final res = await http.delete(
//       Uri.parse('$baseUrl/cleanup/$cleanupId/volunteer'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to leave cleanup: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Volunteer.fromJson).toList();
//   }

//   /*─────────────────────────────────────────────────────*/
//   /*           ADMIN: MARK CLEANUP COMPLETED             */
//   /*─────────────────────────────────────────────────────*/

//   /// PUT /admin/cleanups/:id/complete
//   /// Returns the updated Cleanup object.
//   static Future<Cleanup> completeCleanup(String id) async {
//     final headers = await _authHeaders();
//     final res = await http.put(
//       Uri.parse('$baseUrl/admin/cleanups/$id/complete'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to complete cleanup: ${res.body}');
//     }
//     final data = jsonDecode(res.body) as Map<String, dynamic>;
//     return Cleanup.fromJson(data);
//   }
// }













//sabirin updated the code
// import 'dart:convert';
// import 'package:http/http.dart' as http;
// import '../models/cleanup.dart';
// import '../models/volunteer.dart';
// import 'auth_service.dart';

// class CleanupService {
//   static String get baseUrl => AuthService.baseUrl;

//   /*───────────────────── helpers ─────────────────────*/

//   static Future<Map<String, String>> _authHeaders() async {
//     final token = await AuthService.getToken();
//     if (token == null) throw Exception('Not authenticated');
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer $token',
//     };
//   }

//   /*───────────────────── CRUD ─────────────────────*/

//   /// POST /cleanup        (create)
//   static Future<void> createCleanup(
//     String title,
//     String description,
//     String location,
//     String wasteType,
//     String severity,
//     DateTime? scheduledDate,
//     List<dynamic> images, {
//     required double latitude,
//     required double longitude,
//   }) async {
//     final token = await AuthService.getToken();
//     if (token == null) throw Exception('Not authenticated');

//     final request = http.MultipartRequest(
//       'POST',
//       Uri.parse('$baseUrl/cleanup'),
//     )..headers['Authorization'] = 'Bearer $token';

//     request
//       ..fields['title'] = title
//       ..fields['description'] = description
//       ..fields['location'] = location
//       ..fields['wasteType'] = wasteType
//       ..fields['severity'] = severity
//       ..fields['latitude'] = latitude.toString()
//       ..fields['longitude'] = longitude.toString();

//     if (scheduledDate != null) {
//       request.fields['scheduledDate'] = scheduledDate.toIso8601String();
//     }

//     for (var img in images) {
//       request.files.add(
//         await http.MultipartFile.fromPath('photos', img.path),
//       );
//     }

//     final streamed = await request.send();
//     final res = await http.Response.fromStream(streamed);
//     if (res.statusCode != 201) {
//       throw Exception('Failed to submit cleanup request: ${res.body}');
//     }
//   }

//   /// GET /cleanup/mine    (my cleanups)
//   static Future<List<Cleanup>> fetchMyCleanups() async {
//     final headers = await _authHeaders();
//     final res = await http.get(
//       Uri.parse('$baseUrl/cleanup/mine'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to load cleanups: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Cleanup.fromJson).toList();
//   }

//   /// GET /cleanup         (all cleanups)
//   static Future<List<Cleanup>> fetchCleanups() async {
//     final headers = await _authHeaders();
//     final res = await http.get(
//       Uri.parse('$baseUrl/cleanup'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to load cleanups: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Cleanup.fromJson).toList();
//   }

//   /// PUT /cleanup/:id     (update)
//   static Future<void> updateCleanup(
//     String id,
//     String title,
//     String description,
//     String location,
//     String wasteType,
//     String severity,
//     DateTime? scheduledDate,
//     List<dynamic> images, {
//     required double latitude,
//     required double longitude,
//   }) async {
//     final token = await AuthService.getToken();
//     if (token == null) throw Exception('Not authenticated');

//     final request = http.MultipartRequest(
//       'PUT',
//       Uri.parse('$baseUrl/cleanup/$id'),
//     )..headers['Authorization'] = 'Bearer $token';

//     request
//       ..fields['title'] = title
//       ..fields['description'] = description
//       ..fields['location'] = location
//       ..fields['wasteType'] = wasteType
//       ..fields['severity'] = severity
//       ..fields['latitude'] = latitude.toString()
//       ..fields['longitude'] = longitude.toString();

//     if (scheduledDate != null) {
//       request.fields['scheduledDate'] = scheduledDate.toIso8601String();
//     }

//     for (var img in images) {
//       request.files.add(
//         await http.MultipartFile.fromPath('photos', img.path),
//       );
//     }

//     final streamed = await request.send();
//     final res = await http.Response.fromStream(streamed);
//     if (res.statusCode != 200) {
//       throw Exception('Failed to update cleanup request: ${res.body}');
//     }
//   }

//   /// DELETE /cleanup/:id
//   static Future<void> deleteCleanup(String id) async {
//     final headers = await _authHeaders();
//     final res = await http.delete(
//       Uri.parse('$baseUrl/cleanup/$id'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to delete cleanup request: ${res.body}');
//     }
//   }

//   /*─────────────────────────────────────────────────────*/
//   /*         SELF-VOLUNTEER & VOLUNTEER LISTING         */
//   /*─────────────────────────────────────────────────────*/

//   /// GET /cleanup/:id/volunteers
//   static Future<List<Volunteer>> fetchVolunteers(String cleanupId) async {
//     final headers = await _authHeaders();
//     final res = await http.get(
//       Uri.parse('$baseUrl/cleanup/$cleanupId/volunteers'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to load volunteers: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Volunteer.fromJson).toList();
//   }

//   /// POST /cleanup/:id/volunteer   (join self)
//   static Future<List<Volunteer>> joinCleanup(String cleanupId) async {
//     final headers = await _authHeaders();
//     final res = await http.post(
//       Uri.parse('$baseUrl/cleanup/$cleanupId/volunteer'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to join cleanup: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Volunteer.fromJson).toList();
//   }

//   /// DELETE /cleanup/:id/volunteer (leave self)
//   static Future<List<Volunteer>> leaveCleanup(String cleanupId) async {
//     final headers = await _authHeaders();
//     final res = await http.delete(
//       Uri.parse('$baseUrl/cleanup/$cleanupId/volunteer'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to leave cleanup: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Volunteer.fromJson).toList();
//   }

//   /*─────────────────────────────────────────────────────*/
//   /*           ADMIN: MARK CLEANUP COMPLETED             */
//   /*─────────────────────────────────────────────────────*/

//   /// PUT /admin/cleanups/:id/complete
//   /// Returns the updated Cleanup object.
//   static Future<Cleanup> completeCleanup(String id) async {
//     final headers = await _authHeaders();
//     final res = await http.put(
//       Uri.parse('$baseUrl/admin/cleanups/$id/complete'),
//       headers: headers,
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to complete cleanup: ${res.body}');
//     }
//     final data = jsonDecode(res.body) as Map<String, dynamic>;
//     return Cleanup.fromJson(data);
//   }

//   /*─────────────────────────────────────────────────────*/
//   /*             FETCH CLEANUP STORIES                   */
//   /*─────────────────────────────────────────────────────*/

//   /// GET /api/cleanup-progress/  (cleanup stories - before and after images, PUBLIC)
//   static Future<List<Cleanup>> fetchCleanupStories() async {
//     // This endpoint is public, so no auth headers!
//     final res = await http.get(
//       Uri.parse('$baseUrl/cleanup-progress/'),
//     );
//     if (res.statusCode != 200) {
//       throw Exception('Failed to load cleanup stories: ${res.body}');
//     }
//     final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
//     return body.map(Cleanup.fromJson).toList();
//   }
// }








// lib/services/cleanup_service.dart

import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart'; // For kDebugMode
import '../models/cleanup.dart';
import '../models/volunteer.dart';
import 'auth_service.dart';

class CleanupService {
  // Base URL without '/api' for constructing image URLs
  static String get baseUrl => AuthService.baseUrl.replaceAll('/api', '');

  // Full API URL (includes '/api')
  static String get apiUrl => AuthService.baseUrl;

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

  /// POST /api/cleanup
  static Future<void> createCleanup(
    String title,
    String description,
    String location,
    String wasteType,
    String severity,
    DateTime? scheduledDate,
    List<File> images, {
    required double latitude,
    required double longitude,
  }) async {
    final token = await AuthService.getToken();
    if (token == null) throw Exception('Not authenticated');

    final req = http.MultipartRequest(
      'POST',
      Uri.parse('$apiUrl/cleanup'),
    )..headers['Authorization'] = 'Bearer $token';

    req
      ..fields['title'] = title
      ..fields['description'] = description
      ..fields['location'] = location
      ..fields['wasteType'] = wasteType
      ..fields['severity'] = severity
      ..fields['latitude'] = latitude.toString()
      ..fields['longitude'] = longitude.toString();

    if (scheduledDate != null) {
      req.fields['scheduledDate'] = scheduledDate.toIso8601String();
    }

    for (var img in images) {
      req.files.add(await http.MultipartFile.fromPath('photos', img.path));
    }

    final streamed = await req.send();
    final res = await http.Response.fromStream(streamed);
    if (res.statusCode != 201) {
      throw Exception('Failed to submit cleanup request: ${res.body}');
    }
  }

  /// GET /api/cleanup/mine
  static Future<List<Cleanup>> fetchMyCleanups() async {
    final headers = await _authHeaders();
    final res = await http.get(
      Uri.parse('$apiUrl/cleanup/mine'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to load cleanups: ${res.body}');
    }
    final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return body.map(Cleanup.fromJson).toList();
  }

  /// GET /api/cleanup
  static Future<List<Cleanup>> fetchCleanups() async {
    final headers = await _authHeaders();
    final res = await http.get(
      Uri.parse('$apiUrl/cleanup'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to load cleanups: ${res.body}');
    }
    final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return body.map(Cleanup.fromJson).toList();
  }

  /// PUT /api/cleanup/:id
  static Future<void> updateCleanup(
    String id,
    String title,
    String description,
    String location,
    String wasteType,
    String severity,
    DateTime? scheduledDate,
    List<File> images, {
    required double latitude,
    required double longitude,
  }) async {
    final token = await AuthService.getToken();
    if (token == null) throw Exception('Not authenticated');

    final req = http.MultipartRequest(
      'PUT',
      Uri.parse('$apiUrl/cleanup/$id'),
    )..headers['Authorization'] = 'Bearer $token';

    req
      ..fields['title'] = title
      ..fields['description'] = description
      ..fields['location'] = location
      ..fields['wasteType'] = wasteType
      ..fields['severity'] = severity
      ..fields['latitude'] = latitude.toString()
      ..fields['longitude'] = longitude.toString();

    if (scheduledDate != null) {
      req.fields['scheduledDate'] = scheduledDate.toIso8601String();
    }

    for (var img in images) {
      req.files.add(await http.MultipartFile.fromPath('photos', img.path));
    }

    final streamed = await req.send();
    final res = await http.Response.fromStream(streamed);
    if (res.statusCode != 200) {
      throw Exception('Failed to update cleanup request: ${res.body}');
    }
  }

  /// DELETE /api/cleanup/:id
  static Future<void> deleteCleanup(String id) async {
    final headers = await _authHeaders();
    final res = await http.delete(
      Uri.parse('$apiUrl/cleanup/$id'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to delete cleanup request: ${res.body}');
    }
  }

  /*─────────────────────────────────────────────────────*/
  /*         SELF-VOLUNTEER & VOLUNTEER LISTING         */
  /*─────────────────────────────────────────────────────*/

  /// GET /api/cleanup/:id/volunteers
  static Future<List<Volunteer>> fetchVolunteers(String cleanupId) async {
    final headers = await _authHeaders();
    final res = await http.get(
      Uri.parse('$apiUrl/cleanup/$cleanupId/volunteers'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to load volunteers: ${res.body}');
    }
    final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return body.map(Volunteer.fromJson).toList();
  }

  /// POST /api/cleanup/:id/volunteer
  static Future<List<Volunteer>> joinCleanup(String cleanupId) async {
    final headers = await _authHeaders();
    final res = await http.post(
      Uri.parse('$apiUrl/cleanup/$cleanupId/volunteer'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to join cleanup: ${res.body}');
    }
    final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return body.map(Volunteer.fromJson).toList();
  }

  /// DELETE /api/cleanup/:id/volunteer
  static Future<List<Volunteer>> leaveCleanup(String cleanupId) async {
    final headers = await _authHeaders();
    final res = await http.delete(
      Uri.parse('$apiUrl/cleanup/$cleanupId/volunteer'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to leave cleanup: ${res.body}');
    }
    final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
    return body.map(Volunteer.fromJson).toList();
  }

  /*─────────────────────────────────────────────────────*/
  /*           USER FINISH CLEANUP (after images)        */
  /*─────────────────────────────────────────────────────*/

  /// PUT /api/cleanup/:id/finish
  static Future<Cleanup> finishCleanup(
    String id,
    List<File> afterImages,
  ) async {
    final token = await AuthService.getToken();
    if (token == null) throw Exception('Not authenticated');

    final req = http.MultipartRequest(
      'PUT',
      Uri.parse('$apiUrl/cleanup/$id/finish'),
    )..headers['Authorization'] = 'Bearer $token';

    for (var img in afterImages) {
      req.files.add(await http.MultipartFile.fromPath('afterImages', img.path));
    }

    final streamed = await req.send();
    final res = await http.Response.fromStream(streamed);
    if (res.statusCode != 200) {
      throw Exception('Failed to finish cleanup: ${res.body}');
    }
    return Cleanup.fromJson(jsonDecode(res.body));
  }

  /*─────────────────────────────────────────────────────*/
  /*          ADMIN UPLOAD BEFORE & AFTER IMAGES         */
  /*─────────────────────────────────────────────────────*/

  /// PUT /api/admin/cleanups/:id/before-after-images
  static Future<Cleanup> uploadBeforeAfterImages(
    String id,
    { List<File>? beforeImages, List<File>? afterImages }
  ) async {
    final token = await AuthService.getToken();
    if (token == null) throw Exception('Not authenticated');

    final req = http.MultipartRequest(
      'PUT',
      Uri.parse('$apiUrl/admin/cleanups/$id/before-after-images'),
    )..headers['Authorization'] = 'Bearer $token';

    if (beforeImages != null) {
      for (var img in beforeImages) {
        req.files.add(await http.MultipartFile.fromPath('beforeImages', img.path));
      }
    }
    if (afterImages != null) {
      for (var img in afterImages) {
        req.files.add(await http.MultipartFile.fromPath('afterImages', img.path));
      }
    }

    final streamed = await req.send();
    final res = await http.Response.fromStream(streamed);
    if (res.statusCode != 200) {
      throw Exception('Failed to upload before/after images: ${res.body}');
    }
    return Cleanup.fromJson(jsonDecode(res.body));
  }

  /*─────────────────────────────────────────────────────*/
  /*         ADMIN: MARK CLEANUP COMPLETED              */
  /*─────────────────────────────────────────────────────*/

  /// PUT /api/admin/cleanups/:id/complete
  static Future<Cleanup> completeCleanup(String id) async {
    final headers = await _authHeaders();
    final res = await http.put(
      Uri.parse('$apiUrl/admin/cleanups/$id/complete'),
      headers: headers,
    );
    if (res.statusCode != 200) {
      throw Exception('Failed to complete cleanup: ${res.body}');
    }
    return Cleanup.fromJson(jsonDecode(res.body));
  }
/* ───────────── public, no‑token list ───────────── */
static Future<List<Cleanup>> fetchPublicCleanups() async {
  final res = await http.get(Uri.parse('$apiUrl/public/cleanups'));
  if (res.statusCode != 200) {
    throw Exception('Failed to load public cleanups: ${res.body}');
  }
  final body = List<Map<String, dynamic>>.from(jsonDecode(res.body));
  return body.map(Cleanup.fromJson).toList();
}

  /*─────────────────────────────────────────────────────*/
  /*             FETCH CLEANUP STORIES                   */
  /*─────────────────────────────────────────────────────*/

  /// GET /api/cleanup-progress/
  static Future<List<Cleanup>> fetchCleanupStories() async {
    try {
      final res = await http.get(
        Uri.parse('$apiUrl/cleanup-progress/'),
        headers: {'Accept': 'application/json'},
      );

      if (res.statusCode == 200) {
        final List<dynamic> jsonData = jsonDecode(res.body);
        return jsonData.map<Cleanup>((json) {
          try {
            final cleanup = Cleanup.fromJson(json as Map<String, dynamic>);
            String processUrl(String path) {
              if (path.startsWith('http')) return path;
              if (path.startsWith('/')) return '$baseUrl$path';
              return '$baseUrl/uploads/$path';
            }
            return cleanup.copyWith(
              beforeImages: cleanup.beforeImages.map(processUrl).toList(),
              afterImages:  cleanup.afterImages.map(processUrl).toList(),
            );
          } catch (e) {
            if (kDebugMode) print('Error parsing story: $e');
            return Cleanup.fromJson(json);
          }
        }).toList();
      } else {
        throw Exception('Failed to load cleanup stories: ${res.body}');
      }
    } catch (e) {
      if (kDebugMode) print('Network/error: $e');
      rethrow;
    }
  }
}
