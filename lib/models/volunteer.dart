// lib/models/volunteer.dart
class Volunteer {
  final String id;
  final String fullName;
  final String? avatarUrl;

  Volunteer({
    required this.id,
    required this.fullName,
    this.avatarUrl,
  });

  /// Back-compat for old UI that asks for `profilePicture`
  String? get profilePicture => avatarUrl;

  factory Volunteer.fromJson(Map<String, dynamic> j) => Volunteer(
        id:        j['_id'] as String,
        fullName:  j['fullName'] as String,
        avatarUrl: j['profilePicture'] as String?,  // API already sends this
      );
}
