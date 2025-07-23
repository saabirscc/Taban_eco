// lib/screens/map_screen.dart
//
// Full copy‑paste‑ready file
// ------------------------------------------------------------
// • On tap we now build the SAME “house‑number + street” string
//   used in ProfileTab / LocationPicker.
// • Keeps fallback to placemark.street and “Unknown”.
// ------------------------------------------------------------

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({Key? key}) : super(key: key);

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  GoogleMapController? _mapController;
  final LatLng _mogadishuCenter = const LatLng(2.0371, 45.3438);

  Position? _currentPosition;
  bool   _isLoading       = true;
  Marker? _pickedMarker;
  String? _pickedStreet;

  @override
  void initState() {
    super.initState();
    _initialiseLocation();
  }

  /* ───────────── GPS bootstrap ───────────── */
  Future<void> _initialiseLocation() async {
    if (!await Geolocator.isLocationServiceEnabled()) {
      setState(() => _isLoading = false);
      return;
    }

    LocationPermission perm = await Geolocator.checkPermission();
    if (perm == LocationPermission.denied) {
      perm = await Geolocator.requestPermission();
    }
    if (perm == LocationPermission.denied ||
        perm == LocationPermission.deniedForever) {
      setState(() => _isLoading = false);
      return;
    }

    final pos = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
    if (!mounted) return;

    setState(() {
      _currentPosition = pos;
      _isLoading       = false;
    });
    _moveCamera(LatLng(pos.latitude, pos.longitude));
  }

  void _moveCamera(LatLng target, {double zoom = 15}) {
    _mapController?.animateCamera(
      CameraUpdate.newLatLngZoom(target, zoom),
    );
  }

  /* ───────────── tap handler ───────────── */
  Future<void> _onMapTapped(LatLng loc) async {
    // 1. marker
    setState(() => _pickedMarker =
        Marker(markerId: const MarkerId('picked'), position: loc));
    _moveCamera(loc);

    // 2. reverse geocode → full street
    String street = 'Unknown';
    try {
      final placemarks =
          await placemarkFromCoordinates(loc.latitude, loc.longitude);

      if (placemarks.isNotEmpty) {
        final p   = placemarks.first;
        final num = (p.subThoroughfare ?? '').trim(); // house #
        final rd  = (p.thoroughfare     ?? '').trim(); // road name
        street    = [num, rd].where((s) => s.isNotEmpty).join(' ').trim();
        if (street.isEmpty) street = p.street ?? 'Unknown';
      }
    } catch (_) {}

    setState(() => _pickedStreet = street);

    // 3. return to caller
    Navigator.pop<Map<String, dynamic>>(context, {
      'location': loc,
      'street'  : street,
    });
  }

  /* ───────────── UI ───────────── */
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : GoogleMap(
                  initialCameraPosition: CameraPosition(
                    target: _currentPosition == null
                        ? _mogadishuCenter
                        : LatLng(_currentPosition!.latitude,
                            _currentPosition!.longitude),
                    zoom: 12,
                  ),
                  onMapCreated: (c) {
                    _mapController = c;
                    if (_currentPosition != null) {
                      _moveCamera(LatLng(_currentPosition!.latitude,
                          _currentPosition!.longitude));
                    }
                  },
                  myLocationEnabled: true,
                  myLocationButtonEnabled: false,
                  compassEnabled: true,
                  markers: _pickedMarker != null ? {_pickedMarker!} : {},
                  onTap: _onMapTapped,
                ),

          // prompt
          Positioned(
            top: MediaQuery.of(context).padding.top + 20,
            left: 20,
            right: 20,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.9),
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  )
                ],
              ),
              child: const Text(
                'Tap a road to capture its name',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
              ),
            ),
          ),

          // my‑location FAB
          Positioned(
            bottom: 20,
            right: 20,
            child: FloatingActionButton(
              mini: true,
              backgroundColor: Colors.white,
              onPressed: _currentPosition == null
                  ? null
                  : () => _moveCamera(LatLng(
                        _currentPosition!.latitude,
                        _currentPosition!.longitude,
                      )),
              child: const Icon(Icons.my_location, color: Colors.black),
            ),
          ),
        ],
      ),
    );
  }
}
