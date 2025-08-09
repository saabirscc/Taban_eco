import '../services/auth_service.dart';

class EducationContent {
  final String id;
  final String title;
  final String description;

  /// "image" | "video" | "comparison"
  final String kind;

  // image / video only
  final String? fileUrl;
  final String? thumbUrl;

  // comparison only
  final List<String> beforeImages;
  final List<String> afterImages;

  // meta
  int  likeCount;
  bool likedByMe;
  List<Comment> comments;

  EducationContent({
    required this.id,
    required this.title,
    required this.description,
    required this.kind,
    this.fileUrl,
    this.thumbUrl,
    this.beforeImages = const [],
    this.afterImages  = const [],
    required this.likeCount,
    required this.likedByMe,
    required this.comments,
  });

  /* ───────────────────────── helpers ───────────────────────── */

  /// Converts:
  ///   • localhost / 127.0.0.1 → device-reachable host
  ///   • bare "/uploads/foo.jpg" → absolute URL
  static String _fixUrl(String? url) {
    if (url == null || url.isEmpty) return '';
    final base = AuthService.baseUrl.replaceAll('/api', '');
    if (url.startsWith('http://localhost') ||
        url.startsWith('http://127.0.0.1')) {
      return url.replaceFirst(RegExp(r'http://[^/]+'), base);
    }
    if (url.startsWith('/')) return '$base$url';
    return url;
  }

  static List<String> _stringList(dynamic v) {
    if (v == null) return [];
    if (v is List)  return v.map((e) => e.toString()).toList();
    if (v is String && v.isNotEmpty) return [v];
    return [];
  }

  /* ───────────────────────── factory ───────────────────────── */

  factory EducationContent.fromJson(Map<String, dynamic> j, String myId) {
    final likes        = _stringList(j['likes']);
    final commentsJson = (j['comments'] ?? []) as List;

    return EducationContent(
      id          : j['_id']?.toString() ?? '',
      title       : j['title']?.toString() ?? '',
      description : j['description']?.toString() ?? '',
      kind        : j['kind']?.toString() ?? '',

      fileUrl     : _fixUrl(j['fileUrl']?.toString()),
      thumbUrl    : _fixUrl(j['thumbUrl']?.toString()),

      beforeImages: _stringList(j['beforeImages']).map(_fixUrl).toList(),
      afterImages : _stringList(j['afterImages']).map(_fixUrl).toList(),

      likeCount   : likes.length,
      likedByMe   : likes.contains(myId),
      comments    : commentsJson.map((c) => Comment.fromJson(c)).toList(),
    );
  }
}

/* ───────────────────────── comment sub-model ───────────────────────── */

class Comment {
  final String id;
  final String userName;
  final String? avatar;
  final String text;

  Comment({
    required this.id,
    required this.userName,
    required this.avatar,
    required this.text,
  });

  factory Comment.fromJson(Map<String, dynamic> j) {
    final user = j['user'] is Map<String, dynamic>
        ? j['user'] as Map<String, dynamic>
        : <String, dynamic>{};

    return Comment(
      id       : j['_id']?.toString() ?? '',
      userName : user['fullName']?.toString() ?? 'Unknown',
      avatar   : EducationContent._fixUrl(user['profilePicture']?.toString()),
      text     : j['text']?.toString() ?? '',
    );
  }
}
