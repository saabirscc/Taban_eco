class EducationContent {
  final String id;
  final String title;
  final String description;
  final String kind;          // image | video
  final String fileUrl;
  final String? thumbUrl;
  int likeCount;
  bool likedByMe;
  List<Comment> comments;

  EducationContent({
    required this.id,
    required this.title,
    required this.description,
    required this.kind,
    required this.fileUrl,
    this.thumbUrl,
    required this.likeCount,
    required this.likedByMe,
    required this.comments,
  });

  factory EducationContent.fromJson(
    Map<String, dynamic> j,
    String myId,
  ) {
    // Safely coerce to a List<String>, or empty if null/missing
    final likes = <String>[
      for (final e in (j['likes'] ?? const []))
        e.toString()
    ];

    // Safely coerce to a List<Map<String, dynamic>>, or empty if null/missing
    final rawComments = j['comments'] ?? const [];
    final commentsJson = <Map<String, dynamic>>[
      for (final c in rawComments)
        if (c is Map<String, dynamic>) c else <String, dynamic>{}
    ];

    return EducationContent(
      id:          j['_id']?.toString() ?? '',
      title:       j['title']?.toString() ?? '',
      description: j['description']?.toString() ?? '',
      kind:        j['kind']?.toString() ?? '',
      fileUrl:     j['fileUrl']?.toString() ?? '',
      thumbUrl:    j['thumbUrl']?.toString(),
      likeCount:   likes.length,
      likedByMe:   likes.contains(myId),
      comments:    commentsJson.map(Comment.fromJson).toList(),
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
      id:       j['_id']?.toString() ?? '',
      userName: user['fullName']?.toString() ?? 'Unknown',
      avatar:   user['profilePicture']?.toString(),
      text:     j['text']?.toString() ?? '',
    );
  }
}
