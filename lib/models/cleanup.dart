// lib/models/cleanup.dart
class Cleanup {
  final String id;
  final String createdById;                 // ← NEW
  final String title;
  final String description;
  final String location;
  final String wasteType;
  final String severity;
  final DateTime? scheduledDate;
  final List<String> photoUrls;
  final double? latitude;
  final double? longitude;
  final String status;
  List<String> volunteers;

  Cleanup({
    required this.id,
    required this.createdById,              // ← NEW
    required this.title,
    required this.description,
    required this.location,
    required this.wasteType,
    required this.severity,
    this.scheduledDate,
    this.photoUrls = const [],
    this.latitude,
    this.longitude,
    this.status = 'pending',
    this.volunteers = const [],
  });

  /* ---- factory ---- */
  factory Cleanup.fromJson(Map<String, dynamic> json) {
    // helpers
    String _idFrom(dynamic v) {
      if (v == null) return '';
      if (v is String) return v;
      if (v is Map && v['_id'] != null) return v['_id'] as String;
      return v.toString();
    }

    List<String> _stringList(dynamic v) {
      if (v == null) return [];
      return List<String>.from(
        (v as List).map((e) => _idFrom(e)),
      );
    }

    return Cleanup(
      id           : _idFrom(json['_id']),
      createdById  : _idFrom(json['createdBy']),          // ← NEW
      title        : json['title']?.toString() ?? '',
      description  : json['description']?.toString() ?? '',
      location     : json['location']?.toString() ?? '',
      wasteType    : json['wasteType']?.toString() ?? '',
      severity     : json['severity']?.toString() ?? '',
      scheduledDate: json['scheduledDate'] != null
          ? DateTime.tryParse(json['scheduledDate'].toString())
          : null,
      photoUrls    : _stringList(json['photos']),
      latitude     : json['latitude'] != null
          ? double.tryParse(json['latitude'].toString())
          : null,
      longitude    : json['longitude'] != null
          ? double.tryParse(json['longitude'].toString())
          : null,
      status       : json['status']?.toString() ?? 'pending',
      volunteers   : _stringList(json['volunteers']),
    );
  }

  Map<String, dynamic> toJson() => {
        '_id'          : id,
        'createdBy'    : createdById,                     // ← NEW
        'title'        : title,
        'description'  : description,
        'location'     : location,
        'wasteType'    : wasteType,
        'severity'     : severity,
        'scheduledDate': scheduledDate?.toIso8601String(),
        'photos'       : photoUrls,
        'latitude'     : latitude,
        'longitude'    : longitude,
        'status'       : status,
        'volunteers'   : volunteers,
      };
}
