import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';

/// Returns both the tapped [LatLng] and a map containing
/// 'district', 'street', 'postal', and 'accuracy' keys.
typedef LocationPicked = void Function(
  LatLng position,
  Map<String, dynamic> info,
);

class LocationPicker extends StatefulWidget {
  const LocationPicker({
    Key? key,
    required this.onPicked,
    this.initial,
  }) : super(key: key);

  final LocationPicked onPicked;
  final LatLng? initial;

  @override
  State<LocationPicker> createState() => _LocationPickerState();
}

class _LocationPickerState extends State<LocationPicker> {
  late GoogleMapController _mapController;
  final LatLng _defaultCenter = const LatLng(2.0371, 45.3438);

  LatLng? _pickedPosition;
  double? _accuracy;
  String? _district;
  String? _street;
  String? _postal;

  final Set<Marker> _markers = {};
  final Set<Circle> _circles = {};

  @override
  void initState() {
    super.initState();
    if (widget.initial != null) {
      _pickedPosition = widget.initial;
      _markers.add(Marker(
        markerId: const MarkerId('init'),
        position: _pickedPosition!,
        infoWindow: InfoWindow(title: widget.initial.toString()),
      ));
    }
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
    if (_pickedPosition != null) {
      _mapController.animateCamera(
        CameraUpdate.newLatLngZoom(_pickedPosition!, 15),
      );
    }
  }

  Future<void> _handleTap(LatLng pos) async {
    String? district, street, postalCode;
    try {
      final places = await placemarkFromCoordinates(
        pos.latitude,
        pos.longitude,
        localeIdentifier: 'en',
      );
      final p = places.first;
      district = p.locality?.isNotEmpty == true
          ? p.locality
          : p.subLocality?.isNotEmpty == true
              ? p.subLocality
              : p.administrativeArea;
      final num = p.subThoroughfare?.trim() ?? '';
      final name = p.thoroughfare?.trim() ?? '';
      final comb = [num, name].where((s) => s.isNotEmpty).join(' ');
      street = comb.isNotEmpty ? comb : null;
      postalCode = p.postalCode;
    } catch (_) {}

    setState(() {
      _pickedPosition = pos;
      _district = district;
      _street = street;
      _postal = postalCode;

      _markers
        ..clear()
        ..add(Marker(
          markerId: const MarkerId('picked'),
          position: pos,
          infoWindow: InfoWindow(
            title: street ?? district ?? 'Unknown',
          ),
        ));

      if (_accuracy != null) {
        _circles
          ..clear()
          ..add(Circle(
            circleId: const CircleId('accuracy'),
            center: pos,
            radius: _accuracy!,
            fillColor: Colors.blue.withOpacity(0.1),
            strokeColor: Colors.blue.withOpacity(0.3),
          ));
      }
    });

    widget.onPicked(pos, {
      'district': district,
      'street': street,
      'postal': postalCode,
      'accuracy': _accuracy,
    });

    _mapController.animateCamera(CameraUpdate.newLatLng(pos));
  }

  Future<void> _useMyLocation() async {
    bool enabled = await Geolocator.isLocationServiceEnabled();
    if (!enabled) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enable location services')),
      );
      return;
    }
    LocationPermission perm = await Geolocator.checkPermission();
    if (perm == LocationPermission.denied) {
      perm = await Geolocator.requestPermission();
    }
    if (perm == LocationPermission.denied ||
        perm == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Location permission denied')),
      );
      return;
    }
    final pos = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
    _accuracy = pos.accuracy;
    await _handleTap(LatLng(pos.latitude, pos.longitude));
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 250,
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: GoogleMap(
              onMapCreated: _onMapCreated,
              initialCameraPosition: CameraPosition(
                target: _pickedPosition ?? _defaultCenter,
                zoom: 12,
              ),
              zoomControlsEnabled: false,
              minMaxZoomPreference: const MinMaxZoomPreference(11, 16),
              markers: _markers,
              circles: _circles,
              onTap: _handleTap,
            ),
          ),
          Positioned(
            bottom: 12,
            right: 12,
            child: FloatingActionButton(
              mini: true,
              backgroundColor: Colors.white,
              onPressed: _useMyLocation,
              child: const Icon(Icons.my_location, color: Colors.black),
            ),
          ),
        ],
      ),
    );
  }
}
