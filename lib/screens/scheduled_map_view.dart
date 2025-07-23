// lib/screens/scheduled_map_view.dart

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../models/cleanup.dart';
import 'cleanup_form_screen.dart';

/// Inline‐capitalize helper
String _capitalize(String s) =>
    s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

class ScheduledMapView extends StatefulWidget {
  final List<Cleanup> items;
  final Future<void> Function() onRefresh;

  const ScheduledMapView({
    required this.items,
    required this.onRefresh,
    super.key,
  });

  @override
  State<ScheduledMapView> createState() => _ScheduledMapViewState();
}

class _ScheduledMapViewState extends State<ScheduledMapView> {
  late BitmapDescriptor _plasticIcon;
  late BitmapDescriptor _organicIcon;
  late BitmapDescriptor _hazardIcon;
  late BitmapDescriptor _generalIcon;
  bool _iconsReady = false;

  @override
  void initState() {
    super.initState();
    _loadIcons();
  }

  Future<void> _loadIcons() async {
    _plasticIcon = await BitmapDescriptor.fromAssetImage(
      const ImageConfiguration(size: Size(48, 48)),
      'assets/images/pin_plastic.png',
    );
    _organicIcon = await BitmapDescriptor.fromAssetImage(
      const ImageConfiguration(size: Size(48, 48)),
      'assets/images/pin_organic.png',
    );
    _hazardIcon = await BitmapDescriptor.fromAssetImage(
      const ImageConfiguration(size: Size(48, 48)),
      'assets/images/pin_hazard.png',
    );
    _generalIcon = await BitmapDescriptor.fromAssetImage(
      const ImageConfiguration(size: Size(48, 48)),
      'assets/images/pin_general.png',
    );

    setState(() {
      _iconsReady = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_iconsReady) {
      // waiting for our assets to load
      return const Center(child: CircularProgressIndicator());
    }

    final markers = widget.items
        .where((c) => c.latitude != null && c.longitude != null)
        .map((c) {
      // pick custom asset by wasteType
      BitmapDescriptor icon;
      switch (c.wasteType?.toLowerCase()) {
        case 'plastic':
          icon = _plasticIcon;
          break;
        case 'organic':
          icon = _organicIcon;
          break;
        case 'hazardous':
          icon = _hazardIcon;
          break;
        case 'general':
          icon = _generalIcon;
          break;
        default:
          icon = BitmapDescriptor.defaultMarkerWithHue(
            BitmapDescriptor.hueAzure,
          );
      }

      return Marker(
        markerId: MarkerId(c.id),
        position: LatLng(c.latitude!, c.longitude!),
        icon: icon,
        infoWindow: InfoWindow(
          title: c.title,
          snippet:
              '${_capitalize(c.wasteType ?? '')}, ${_capitalize(c.status)}',
          onTap: () async {
            final changed = await Navigator.push<bool>(
              context,
              MaterialPageRoute(
                builder: (_) => CleanupFormScreen(cleanup: c),
              ),
            );
            if (changed == true) widget.onRefresh();
          },
        ),
      );
    }).toSet();

    final initial = markers.isNotEmpty
        ? markers.first.position
        : const LatLng(0, 0);

    return GoogleMap(
      initialCameraPosition:
          CameraPosition(target: initial, zoom: 12),
      markers: markers,
    );
  }
}
