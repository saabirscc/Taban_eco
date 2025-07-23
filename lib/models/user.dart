// lib/models/user.dart
class User {
  final String id;
  final String fullName;
  final String email;
  final String district;
  final String? phoneNumber;

  // New
  final String? role;               // 'Admin', 'Users', etc.

  final int points;
  final int badgesCount;
  final int cleanupsDone;
  final String? profilePicture;

  const User({
    required this.id,
    required this.fullName,
    required this.email,
    required this.district,
    this.phoneNumber,
    this.role,                       // <-- new
    this.points = 0,
    this.badgesCount = 0,
    this.cleanupsDone = 0,
    this.profilePicture,
  });

  /// Back-compat getter
  String? get phone => phoneNumber;

  factory User.fromJson(Map<String, dynamic> json) {
    int parseInt(dynamic raw) {
      if (raw is int) return raw;
      if (raw is String) return int.tryParse(raw) ?? 0;
      return 0;
    }

    // phone may arrive as phoneNumber or phone
    String? phone;
    if (json['phoneNumber'] != null) {
      phone = json['phoneNumber'].toString();
    } else if (json['phone'] != null) {
      phone = json['phone'].toString();
    }

    // badges count can be an int or a list length
    int badgesCount = 0;
    if (json['badges'] is List) {
      badgesCount = (json['badges'] as List).length;
    } else if (json['badgesCount'] != null) {
      badgesCount = parseInt(json['badgesCount']);
    }

    return User(
      id:            (json['_id'] ?? json['id'] ?? '').toString(),
      fullName:      json['fullName']  ?? '',
      email:         json['email']     ?? '',
      district:      json['district']  ?? '',
      phoneNumber:   phone,
      role:          json['role'],                 // <-- new
      points:        parseInt(json['points']),
      badgesCount:   badgesCount,
      cleanupsDone:  parseInt(json['cleanupsDone']),
      profilePicture: json['profilePicture'],
    );
  }

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{
      '_id': id,
      'fullName': fullName,
      'email': email,
      'district': district,
      'points': points,
      'badgesCount': badgesCount,
      'cleanupsDone': cleanupsDone,
    };
    if (phoneNumber != null)   map['phoneNumber']   = phoneNumber;
    if (role != null)          map['role']          = role;           // <-- new
    if (profilePicture != null) map['profilePicture'] = profilePicture;
    return map;
  }

  User copyWith({
    String? fullName,
    String? email,
    String? district,
    String? phoneNumber,
    String? role,                     // <-- new
    int? points,
    int? badgesCount,
    int? cleanupsDone,
    String? profilePicture,
  }) {
    return User(
      id: id,
      fullName:     fullName     ?? this.fullName,
      email:        email        ?? this.email,
      district:     district     ?? this.district,
      phoneNumber:  phoneNumber  ?? this.phoneNumber,
      role:         role         ?? this.role,        // <-- new
      points:       points       ?? this.points,
      badgesCount:  badgesCount  ?? this.badgesCount,
      cleanupsDone: cleanupsDone ?? this.cleanupsDone,
      profilePicture: profilePicture ?? this.profilePicture,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is User && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}
