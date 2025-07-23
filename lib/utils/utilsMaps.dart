import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:google_maps_flutter/google_maps_flutter.dart';

/* ────────────────────────────────────────────
   Reverse lookup only route + locality
──────────────────────────────────────────── */
Future<(String route, String city)> _reverseForRoute(
  LatLng loc,
  String apiKey,
) async {
  final url = Uri.parse(
    'https://maps.googleapis.com/maps/api/geocode/json'
    '?latlng=${loc.latitude},${loc.longitude}'
    '&key=$apiKey',
  );
  final res = await http.get(url);
  if (res.statusCode != 200) return ('', '');

  final data = jsonDecode(res.body);
  if (data['status'] != 'OK') return ('', '');

  String route = '', city = '';
  for (final comp in data['results'][0]['address_components']) {
    final types = List<String>.from(comp['types']);
    if (types.contains('route'))              route = comp['long_name'];
    if (types.contains('locality'))           city  = comp['long_name'];
    if (route.isNotEmpty && city.isNotEmpty) break;
  }
  return (route, city);
}

/* ────────────────────────────────────────────
   Forward geocode "route, city" → sublocality
──────────────────────────────────────────── */
Future<String> _forwardForSublocality(
  String route,
  String city,
  String apiKey,
) async {
  final q = Uri.encodeComponent('$route, $city');
  final url = Uri.parse(
    'https://maps.googleapis.com/maps/api/geocode/json'
    '?address=$q'
    '&key=$apiKey',
  );

  final res = await http.get(url);
  if (res.statusCode != 200) return 'Unknown';
  final data = jsonDecode(res.body);
  if (data['status'] != 'OK') return 'Unknown';

  for (final result in data['results']) {
    for (final comp in result['address_components']) {
      final types = List<String>.from(comp['types']);
      if (types.contains('sublocality') ||
          types.contains('sublocality_level_1') ||
          types.contains('neighborhood')) {
        return comp['long_name'];
      }
    }
  }
  return 'Unknown';
}
