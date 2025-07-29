// // lib/models/cleanup.dart
// class Cleanup {
//   final String id;
//   final String createdById;                 // ← NEW
//   final String title;
//   final String description;
//   final String location;
//   final String wasteType;
//   final String severity;
//   final DateTime? scheduledDate;
//   final List<String> photoUrls;
//   final double? latitude;
//   final double? longitude;
//   final String status;
  
//   List<String> volunteers;
  

//   Cleanup({
//     required this.id,
//     required this.createdById,              // ← NEW
//     required this.title,
//     required this.description,
//     required this.location,
//     required this.wasteType,
//     required this.severity,
//     this.scheduledDate,
//     this.photoUrls = const [],
//     this.latitude,
//     this.longitude,
//     this.status = 'pending',
//     this.volunteers = const [],
//   });

//   /* ---- factory ---- */
//   factory Cleanup.fromJson(Map<String, dynamic> json) {
//     // helpers
//     String _idFrom(dynamic v) {
//       if (v == null) return '';
//       if (v is String) return v;
//       if (v is Map && v['_id'] != null) return v['_id'] as String;
//       return v.toString();
//     }

//     List<String> _stringList(dynamic v) {
//       if (v == null) return [];
//       return List<String>.from(
//         (v as List).map((e) => _idFrom(e)),
//       );
//     }

//     return Cleanup(
//       id           : _idFrom(json['_id']),
//       createdById  : _idFrom(json['createdBy']),          // ← NEW
//       title        : json['title']?.toString() ?? '',
//       description  : json['description']?.toString() ?? '',
//       location     : json['location']?.toString() ?? '',
//       wasteType    : json['wasteType']?.toString() ?? '',
//       severity     : json['severity']?.toString() ?? '',
//       scheduledDate: json['scheduledDate'] != null
//           ? DateTime.tryParse(json['scheduledDate'].toString())
//           : null,
//       photoUrls    : _stringList(json['photos']),
//       latitude     : json['latitude'] != null
//           ? double.tryParse(json['latitude'].toString())
//           : null,
//       longitude    : json['longitude'] != null
//           ? double.tryParse(json['longitude'].toString())
//           : null,
//       status       : json['status']?.toString() ?? 'pending',
//       volunteers   : _stringList(json['volunteers']),
//     );
//   }

//   Map<String, dynamic> toJson() => {
//         '_id'          : id,
//         'createdBy'    : createdById,                     // ← NEW
//         'title'        : title,
//         'description'  : description,
//         'location'     : location,
//         'wasteType'    : wasteType,
//         'severity'     : severity,
//         'scheduledDate': scheduledDate?.toIso8601String(),
//         'photos'       : photoUrls,
//         'latitude'     : latitude,
//         'longitude'    : longitude,
//         'status'       : status,
//         'volunteers'   : volunteers,
//       };
// }



//before
// class Cleanup {
//   final String id;
//   final String createdById;
//   final String title;
//   final String description;
//   final String location;
//   final String wasteType;
//   final String severity;
//   final DateTime? scheduledDate;
//   final List<String> photoUrls;
//   final double? latitude;
//   final double? longitude;
//   final String status;
//   List<String> volunteers;

//   // ✅ NEW
//   final List<String> beforeImages;
//   final List<String> afterImages;

//   Cleanup({
//     required this.id,
//     required this.createdById,
//     required this.title,
//     required this.description,
//     required this.location,
//     required this.wasteType,
//     required this.severity,
//     this.scheduledDate,
//     this.photoUrls = const [],
//     this.latitude,
//     this.longitude,
//     this.status = 'pending',
//     this.volunteers = const [],
//     this.beforeImages = const [],
//     this.afterImages = const [],
//   });

//   /* ---- factory ---- */
//   factory Cleanup.fromJson(Map<String, dynamic> json) {
//     String _idFrom(dynamic v) {
//       if (v == null) return '';
//       if (v is String) return v;
//       if (v is Map && v['_id'] != null) return v['_id'] as String;
//       return v.toString();
//     }

//     List<String> _stringList(dynamic v) {
//       if (v == null) return [];
//       return List<String>.from((v as List).map((e) => e.toString()));
//     }

//     return Cleanup(
//       id: _idFrom(json['_id']),
//       createdById: _idFrom(json['createdBy']),
//       title: json['title']?.toString() ?? '',
//       description: json['description']?.toString() ?? '',
//       location: json['location']?.toString() ?? '',
//       wasteType: json['wasteType']?.toString() ?? '',
//       severity: json['severity']?.toString() ?? '',
//       scheduledDate: json['scheduledDate'] != null
//           ? DateTime.tryParse(json['scheduledDate'].toString())
//           : null,
//       photoUrls: _stringList(json['photos']),
//       latitude: json['latitude'] != null
//           ? double.tryParse(json['latitude'].toString())
//           : null,
//       longitude: json['longitude'] != null
//           ? double.tryParse(json['longitude'].toString())
//           : null,
//       status: json['status']?.toString() ?? 'pending',
//       volunteers: _stringList(json['volunteers']),
//       beforeImages: _stringList(json['beforeImages']), // ✅ safe parsing
//       afterImages: _stringList(json['afterImages']),   // ✅ safe parsing
//     );
//   }

//   Map<String, dynamic> toJson() => {
//         '_id': id,
//         'createdBy': createdById,
//         'title': title,
//         'description': description,
//         'location': location,
//         'wasteType': wasteType,
//         'severity': severity,
//         'scheduledDate': scheduledDate?.toIso8601String(),
//         'photos': photoUrls,
//         'latitude': latitude,
//         'longitude': longitude,
//         'status': status,
//         'volunteers': volunteers,
//         'beforeImages': beforeImages,
//         'afterImages': afterImages,
//       };
// }








// lib/models/cleanup.dart

class Cleanup {
  final String id;
  final String createdById;
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
  final List<String> volunteers;
  final List<String> beforeImages;
  final List<String> afterImages;

  Cleanup({
    required this.id,
    required this.createdById,
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
    this.beforeImages = const [],
    this.afterImages = const [],
  });

  Cleanup copyWith({
    String? id,
    String? createdById,
    String? title,
    String? description,
    String? location,
    String? wasteType,
    String? severity,
    DateTime? scheduledDate,
    List<String>? photoUrls,
    double? latitude,
    double? longitude,
    String? status,
    List<String>? volunteers,
    List<String>? beforeImages,
    List<String>? afterImages,
  }) {
    return Cleanup(
      id: id ?? this.id,
      createdById: createdById ?? this.createdById,
      title: title ?? this.title,
      description: description ?? this.description,
      location: location ?? this.location,
      wasteType: wasteType ?? this.wasteType,
      severity: severity ?? this.severity,
      scheduledDate: scheduledDate ?? this.scheduledDate,
      photoUrls: photoUrls ?? this.photoUrls,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      status: status ?? this.status,
      volunteers: volunteers ?? this.volunteers,
      beforeImages: beforeImages ?? this.beforeImages,
      afterImages: afterImages ?? this.afterImages,
    );
  }

  factory Cleanup.fromJson(Map<String, dynamic> json) {
    String _extractId(dynamic v) {
      if (v == null) return '';
      if (v is String) return v;
      if (v is Map && v['_id'] != null) return v['_id'] as String;
      return v.toString();
    }

    List<String> _toStringList(dynamic v) {
      if (v == null) return [];
      if (v is List) return v.map((e) => e.toString()).toList();
      if (v is String && v.isNotEmpty) return [v];
      return [];
    }

    return Cleanup(
      id: _extractId(json['_id']),
      createdById: _extractId(json['createdBy']),
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      location: json['location']?.toString() ?? '',
      wasteType: json['wasteType']?.toString() ?? '',
      severity: json['severity']?.toString() ?? '',
      scheduledDate: json['scheduledDate'] != null
          ? DateTime.tryParse(json['scheduledDate'].toString())
          : null,
      photoUrls: _toStringList(json['photos']),
      latitude: json['latitude'] != null
          ? double.tryParse(json['latitude'].toString())
          : null,
      longitude: json['longitude'] != null
          ? double.tryParse(json['longitude'].toString())
          : null,
      status: json['status']?.toString() ?? 'pending',
      volunteers: _toStringList(json['volunteers']),
      beforeImages: _toStringList(json['beforeImages']),
      afterImages: _toStringList(json['afterImages']),
    );
  }

  Map<String, dynamic> toJson() => {
        '_id': id,
        'createdBy': createdById,
        'title': title,
        'description': description,
        'location': location,
        'wasteType': wasteType,
        'severity': severity,
        if (scheduledDate != null)
          'scheduledDate': scheduledDate!.toIso8601String(),
        'photos': photoUrls,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
        'status': status,
        'volunteers': volunteers,
        'beforeImages': beforeImages,
        'afterImages': afterImages,
      };

  @override
  String toString() {
    return 'Cleanup(id: $id, title: $title, status: $status, '
           'beforeImages: ${beforeImages.length}, afterImages: ${afterImages.length})';
  }
}
