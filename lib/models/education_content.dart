// lib/models/education_content.dart

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
  int likeCount;
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

  /* ───────────────── factory ───────────────── */
  factory EducationContent.fromJson(
    Map<String, dynamic> j,
    String myId,
  ) {
    List<String> _stringList(dynamic v) {
      if (v == null) return [];
      if (v is List) return v.map((e) => e.toString()).toList();
      if (v is String && v.isNotEmpty) return [v];
      return [];
    }

    final likes        = _stringList(j['likes']);
    final commentsJson = (j['comments'] ?? []) as List;

    return EducationContent(
      id          : j['_id']?.toString() ?? '',
      title       : j['title']?.toString() ?? '',
      description : j['description']?.toString() ?? '',
      kind        : j['kind']?.toString() ?? '',

      /* for image / video posts; null for comparison */
      fileUrl     : j['fileUrl']?.toString(),
      thumbUrl    : j['thumbUrl']?.toString(),

      /* for comparison posts */
      beforeImages: _stringList(j['beforeImages']),
      afterImages : _stringList(j['afterImages']),

      likeCount   : likes.length,
      likedByMe   : likes.contains(myId),
      comments    : commentsJson.map((c) => Comment.fromJson(c)).toList(),
    );
  }
}

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
      avatar   : user['profilePicture']?.toString(),
      text     : j['text']?.toString() ?? '',
    );
  }
}
