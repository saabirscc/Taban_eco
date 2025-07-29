import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../providers/auth_provider.dart';
import '../models/cleanup.dart';
import '../models/volunteer.dart';
import '../services/cleanup_service.dart';
import '../widgets/location_picker.dart';
import '../widgets/waste_type_selector.dart';
import '../widgets/severity_selector.dart';
import '../widgets/image_picker_grid.dart';

/* ───────────────── helpers ───────────────── */

/// Ensure we always have an absolute URL even if
/// the API returns “/uploads/…”.
String _abs(String url) {
  if (url.startsWith('http')) return url;
  return '${CleanupService.baseUrl}$url';
}

/* ───────────────── screen ───────────────── */

class CleanupFormScreen extends StatefulWidget {
  final Cleanup? cleanup;
  const CleanupFormScreen({Key? key, this.cleanup}) : super(key: key);

  @override
  State<CleanupFormScreen> createState() => _CleanupFormScreenState();
}

class _CleanupFormScreenState extends State<CleanupFormScreen> {
  final _formKey     = GlobalKey<FormState>();
  final _titleCtl    = TextEditingController();
  final _descCtl     = TextEditingController();
  final _addressCtl  = TextEditingController();

  String _wasteType = 'plastic';
  String _severity  = 'moderate';
  DateTime? _date;

  LatLng? _pickedLoc;
  double? _accuracy;
  bool _loading = false;

  /// Newly picked images (local files)
  List<XFile> _images      = [];
  List<XFile> _afterImages = [];

  /// Existing (remote) images coming from the API
  List<String> _remoteBefore = [];
  List<String> _remoteAfter  = [];

  List<Volunteer> _volunteers = [];
  String? _myUserId;

  /* ───────── init ───────── */

  @override
  void initState() {
    super.initState();
    _initForm();
    _initVolunteers();
  }

  /// ---------- UPDATED: now falls back to `photoUrls` ----------
  Future<void> _initForm() async {
    final c = widget.cleanup;
    if (c != null) {
      _titleCtl.text   = c.title;
      _descCtl.text    = c.description;
      _addressCtl.text = c.location;
      _wasteType       = c.wasteType;
      _severity        = c.severity;
      _date            = c.scheduledDate;

      // Use beforeImages if present; otherwise fall back to photos
      final List<String> before =
          c.beforeImages.isNotEmpty ? c.beforeImages : c.photoUrls;

      _remoteBefore = before.map(_abs).toList();
      _remoteAfter  = c.afterImages.map(_abs).toList();

      if (c.latitude != null && c.longitude != null) {
        _pickedLoc = LatLng(c.latitude!, c.longitude!);
      }
    }
    _myUserId = context.read<AuthProvider>().userId;
    setState(() {});
  }
  /// ------------------------------------------------------------

  Future<void> _initVolunteers() async {
    if (widget.cleanup == null) return;
    final list = await CleanupService.fetchVolunteers(widget.cleanup!.id);
    if (mounted) setState(() => _volunteers = list);
  }

  /* ───────── utils ───────── */

  void _toast(String m) => Fluttertoast.showToast(
        msg: m,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.black87,
        textColor: Colors.white,
      );

  /* ───────── submit / finish / join ───────── */

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_images.isEmpty && widget.cleanup == null) {
      _toast('Please add at least one photo');
      return;
    }
    if (_pickedLoc == null) {
      _toast('Please select a location');
      return;
    }

    setState(() => _loading = true);
    try {
      final imageFiles = _images.map((x) => File(x.path)).toList();

      if (widget.cleanup == null) {
        await CleanupService.createCleanup(
          _titleCtl.text,
          _descCtl.text,
          _addressCtl.text,
          _wasteType,
          _severity,
          _date,
          imageFiles,
          latitude : _pickedLoc!.latitude,
          longitude: _pickedLoc!.longitude,
        );
        _toast('Cleanup request submitted!');
      } else {
        await CleanupService.updateCleanup(
          widget.cleanup!.id,
          _titleCtl.text,
          _descCtl.text,
          _addressCtl.text,
          _wasteType,
          _severity,
          _date,
          imageFiles,
          latitude : _pickedLoc!.latitude,
          longitude: _pickedLoc!.longitude,
        );
        _toast('Cleanup request updated!');
      }
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      _toast('Submission failed: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _toggleVolunteer() async {
    if (widget.cleanup == null || _myUserId == null) return;
    setState(() => _loading = true);
    final isVol = _volunteers.any((v) => v.id == _myUserId);
    final updated = isVol
        ? await CleanupService.leaveCleanup(widget.cleanup!.id)
        : await CleanupService.joinCleanup(widget.cleanup!.id);
    setState(() => _volunteers = updated);
    setState(() => _loading = false);
  }

  Future<void> _finish() async {
    if (widget.cleanup == null) return;
    if (_afterImages.isEmpty) {
      _toast('Please upload at least one "after" photo');
      return;
    }
    setState(() => _loading = true);
    final files = _afterImages.map((x) => File(x.path)).toList();
    await CleanupService.finishCleanup(widget.cleanup!.id, files);
    _toast('Cleanup marked as completed!');
    if (mounted) Navigator.pop(context, true);
  }

  /* ───────── build ───────── */

  @override
  Widget build(BuildContext context) {
    final isEdit  = widget.cleanup != null;
    final isOwner = isEdit && widget.cleanup!.createdById == _myUserId;
    final amIVol  = !isOwner && _volunteers.any((v) => v.id == _myUserId);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          isEdit
              ? (isOwner ? 'Edit Cleanup Request' : 'View Cleanup Request')
              : 'New Cleanup Request',
        ),
        backgroundColor: Colors.green[700],
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [

              /* ------- basic fields ------- */

              _buildField(_titleCtl, 'Title', 'Enter cleanup title',
                  enabled: !isEdit || isOwner),
              const SizedBox(height: 16),
              _buildField(_descCtl, 'Description', 'Describe the waste…',
                  lines: 3, enabled: !isEdit || isOwner),
              const SizedBox(height: 16),

              /* ------- location picker ------- */

              Text('Select Location on Map',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),

              IgnorePointer(
                ignoring: isEdit && !isOwner,
                child: Opacity(
                  opacity: isEdit && !isOwner ? 0.5 : 1,
                  child: LocationPicker(
                    initial: _pickedLoc,
                    onPicked: (pos, info) {
                      _pickedLoc = pos;
                      _accuracy  = info['accuracy'] as double?;
                      _addressCtl.text =
                          info['street'] ?? info['district'] ?? '';
                      setState(() {});
                    },
                  ),
                ),
              ),
              const SizedBox(height: 8),
              if (_pickedLoc != null) ...[
                Text(
                  'Lat: ${_pickedLoc!.latitude.toStringAsFixed(5)}, '
                  'Lng: ${_pickedLoc!.longitude.toStringAsFixed(5)}\n'
                  'Accuracy: ${_accuracy?.toStringAsFixed(1) ?? '?'} m',
                  style: TextStyle(color: Colors.grey[700]),
                ),
                const SizedBox(height: 8),
              ],
              Text(
                _addressCtl.text.isEmpty
                    ? 'Tap the map or use GPS to pick address'
                    : 'Address: ${_addressCtl.text}',
                style: TextStyle(
                  color: _addressCtl.text.isEmpty ? Colors.grey
                                                   : Colors.green[800],
                  fontWeight: _addressCtl.text.isEmpty
                      ? FontWeight.normal
                      : FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              _buildField(_addressCtl, 'Location Details', 'Add more details…',
                  enabled: !isEdit || isOwner),
              const SizedBox(height: 20),

              /* ------- waste / severity ------- */

              Text('Waste Type',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              IgnorePointer(
                ignoring: isEdit && !isOwner,
                child: Opacity(
                  opacity: isEdit && !isOwner ? 0.5 : 1,
                  child: WasteTypeSelector(
                    current  : _wasteType,
                    onChanged: (v) => setState(() => _wasteType = v),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              Text('Severity Level',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              IgnorePointer(
                ignoring: isEdit && !isOwner,
                child: Opacity(
                  opacity: isEdit && !isOwner ? 0.5 : 1,
                  child: SeveritySelector(
                    current  : _severity,
                    onChanged: (v) => setState(() => _severity = v),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              /* ------- schedule ------- */

              OutlinedButton.icon(
                onPressed: (!isEdit || isOwner)
                    ? () async {
                        final d = await showDatePicker(
                          context: context,
                          initialDate: _date ?? DateTime.now().add(const Duration(days: 1)),
                          firstDate: DateTime.now(),
                          lastDate : DateTime.now().add(const Duration(days: 365)),
                        );
                        if (d != null) setState(() => _date = d);
                      }
                    : null,
                icon : const Icon(Icons.calendar_today, color: Colors.green),
                label: Text(
                  _date == null
                      ? 'Schedule Cleanup (Optional)'
                      : 'Scheduled for ${DateFormat.yMMMd().format(_date!)}',
                ),
              ),
              const SizedBox(height: 20),

              /* ------- BEFORE images ------- */

              Text('Before Photos',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),

              // remote preview first (if any)
              if (_remoteBefore.isNotEmpty)
                RemoteImageGrid(urls: _remoteBefore),
              if (_remoteBefore.isNotEmpty) const SizedBox(height: 12),

              // local picker (owner only on create / edit)
              if (!isEdit || isOwner) ...[
                ImagePickerGrid(
                  initial : _images,
                  onChanged: (imgs) => _images = imgs,
                ),
                const SizedBox(height: 24),
              ],

              /* ------- VOLUNTEERS ------- */

              if (isEdit) ...[
                Text('Volunteers',
                    style: Theme.of(context).textTheme.titleMedium),
                ..._volunteers.map(
                  (v) => ListTile(
                    leading: CircleAvatar(
                      backgroundImage: v.avatarUrl != null
                          ? NetworkImage(v.avatarUrl!)
                          : null,
                      child: v.avatarUrl == null ? Text(v.fullName[0]) : null,
                    ),
                    title: Text(v.fullName),
                  ),
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: _loading || isOwner ? null : _toggleVolunteer,
                  child: Text(amIVol ? 'Leave Cleanup' : 'Volunteer'),
                ),
                const SizedBox(height: 24),
              ],

              /* ------- AFTER images & finish button ------- */

              if (isEdit && isOwner &&
                  widget.cleanup!.status.toLowerCase() != 'completed') ...[
                Text('After Photos',
                    style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                ImagePickerGrid(
                  initial : _afterImages,
                  onChanged: (imgs) => _afterImages = imgs,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: _loading ? null : _finish,
                  style   : ElevatedButton.styleFrom(backgroundColor: Colors.orange),
                  child   : _loading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Mark as Completed'),
                ),
                const SizedBox(height: 24),
              ],

              // show AFTER images read‑only when already completed
              if (isEdit &&
                  widget.cleanup!.status.toLowerCase() == 'completed' &&
                  _remoteAfter.isNotEmpty) ...[
                Text('After Photos',
                    style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                RemoteImageGrid(urls: _remoteAfter),
                const SizedBox(height: 24),
              ],

              /* ------- SUBMIT / UPDATE button ------- */

if (!isEdit)                                   // ← hide in edit mode
  ElevatedButton(
    onPressed: _loading ? null : _submit,
    child: _loading
        ? const CircularProgressIndicator(color: Colors.white)
        : const Text('SUBMIT REQUEST'),
  ),
            ],
          ),
        ),
      ),
    );
  }

  /* ───────── helpers ───────── */

  Widget _buildField(
    TextEditingController ctl,
    String label,
    String hint, {
    int lines = 1,
    bool enabled = true,
  }) {
    return TextFormField(
      controller: ctl,
      maxLines  : lines,
      enabled   : enabled,
      decoration: InputDecoration(
        labelText: label,
        hintText : hint,
        border   : OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
    );
  }
}

/* ────────────────────────────────────────────────────────── */
/*          read‑only grid for remote (network) images        */
/* ────────────────────────────────────────────────────────── */

class RemoteImageGrid extends StatelessWidget {
  const RemoteImageGrid({super.key, required this.urls});
  final List<String> urls;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: urls.map((u) => _thumb(u)).toList(),
    );
  }

  Widget _thumb(String url) => ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: Image.network(
          url,
          width : 100,
          height: 100,
          fit   : BoxFit.cover,
          errorBuilder: (_, __, ___) => Container(
            width : 100,
            height: 100,
            color : Colors.grey[300],
            child : const Icon(Icons.broken_image, size: 24),
          ),
        ),
      );
}
