// lib/models/reward.dart
class Reward {
  final String badgeName;
  final String icon;
  final DateTime earnedDate;

  Reward({required this.badgeName, required this.icon, required this.earnedDate});
  factory Reward.fromJson(Map<String, dynamic> json) => Reward(
    badgeName: json['badgeName'] as String,
    icon:      json['icon']      as String,
    earnedDate: DateTime.parse(json['earnedDate'] as String),
  );
}
